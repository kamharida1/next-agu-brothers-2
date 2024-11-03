import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "./dbConnect";
import UserModel from "./models/UserModel";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";

export const config = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      credentials: {
        email: {
          type: "email",
        },
        password: { type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        if (credentials == null) return null;

        const user = await UserModel.findOne({ email: credentials.email });

        if (user) {
          const isMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          );
          if (isMatch) {
            return user;
          }
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
          isAdmin: user.isAdmin,
        };
      }
      if (trigger === "update" && session) {
        token.user = {
          ...token.user,
          email: session.user.email,
          name: session.user.name,
        };
      }
      //  console.log('jwt', token)
      return token;
    },
    session: async ({ session, token }: any) => {
      if (token) {
        session.user = token.user;
      }
      return session;
    },
    async signIn({ user, account, profile }: any) {
      console.log("Google Profile Data:", profile);
      console.log("Google Account Data:", account);
      try {
        await dbConnect();
        if (account.provider === "google") {
          const existingUser = await UserModel.findOne({
            email: profile.email,
          });
          if (!existingUser) {
            // Create new user
            const newUser = new UserModel({
              name: profile.name,
              email: profile.email,
              password: null, // Google users don't have a password
              isAdmin: false,
            });
            await newUser.save();
            user._id = newUser._id;
            user.isAdmin = newUser.isAdmin;
          } else {
            // Use existing user
            user._id = existingUser._id;
            // user.isAdmin = existingUser.isAdmin;
          }
        }
        return true;
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false; // Deny access if any error occurs
      }
    },
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config);
