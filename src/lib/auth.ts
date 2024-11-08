// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import dbConnect from "./dbConnect";
import UserModel from "./models/UserModel";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        if (!credentials) return null;

        const user = await UserModel.findOne({ email: credentials.email });
        if (user && user.isAuthorized !== false) { // Check isAuthorized
          const isMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          );
          if (isMatch) return user;
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    newUser: "/register",
    error: "/signin",
  },
  callbacks: {
    async jwt({ user, trigger, session, token }: any) {
      if (user) {
        token.user = {
          _id: user._id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin || false,
          isPasswordUpdated: user.isPasswordUpdated,
        };
      }
      if (trigger === "update" && session) {
        token.user = { ...token.user, email: session.user.email, name: session.user.name };
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user = token.user;
      }
      return session;
    },
    async signIn({ user, account, profile }: any) {
      try {
        await dbConnect();

        if (account.provider === "facebook") {
          let existingUser = await UserModel.findOne({ facebookId: profile.id });

          if (!existingUser) {
            existingUser = new UserModel({
              name: profile.name,
              email: profile.email,
              facebookId: profile.id,
              password: null,
              isAdmin: false,
              isPasswordUpdated: false,
              isAuthorized: true,
            });
            await existingUser.save();
          }

          if (existingUser.isAuthorized === false) {
            return false; // Block sign-in if user is deauthorized
          }

          user._id = existingUser._id;
          user.isAdmin = existingUser.isAdmin;
          user.isAuthorized = existingUser.isAuthorized;
        } else if (account.provider === "google") {
          const existingUser = await UserModel.findOne({ email: profile.email });
          if (!existingUser) {
            const newUser = new UserModel({
              name: profile.name,
              email: profile.email,
              password: null,
              isAdmin: false,
              isPasswordUpdated: false,
            });
            await newUser.save();
            user._id = newUser._id;
            user.isAdmin = newUser.isAdmin;
          } else {
            if (existingUser.isAuthorized === false) {
              return false; // Block sign-in if user is deauthorized
            }
            user._id = existingUser._id;
            user.isAdmin = existingUser.isAdmin;
          }
        } else if (account.provider === "credentials") {
          if (!user.isPasswordUpdated) {
            await UserModel.findByIdAndUpdate(user._id, { isPasswordUpdated: true });
            user.isPasswordUpdated = true;
          }
        }
        return true;
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false;
      }
    },
  },
};

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth(authOptions);
