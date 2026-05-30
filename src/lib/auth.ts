import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "./dbConnect";
import UserModel from "./models/UserModel";
import bcrypt from "bcryptjs";

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      credentials: {
        email:    { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await dbConnect();

        const user = await UserModel.findOne({ email: credentials.email });

        // Guard: no user, deauthorized, or no password set (OAuth-only account)
        if (!user || user.isAuthorized === false || !user.password) return null;

        const isMatch = await bcrypt.compare(
          credentials.password as string,
          user.password as string
        );
        if (!isMatch) return null;

        return user;
      },
    }),
  ],

  pages: {
    signIn:  "/signin",
    newUser: "/register",
    error:   "/signin",
  },

  callbacks: {
    // Called on every sign-in AND every session read.
    // `user` is only present on the first sign-in — that's when we hit the DB.
    async jwt({ user, trigger, session, token }: any) {
      if (user) {
        // NextAuth v5 gives a fresh OAuth profile object here — it does NOT
        // carry mutations made in signIn(). Re-fetch from DB to get isAdmin.
        let dbUser: any = null;
        try {
          await dbConnect();
          dbUser = await UserModel.findOne({ email: user.email }).lean();
        } catch (e) {
          console.error("[auth] jwt DB lookup failed:", e);
        }

        token.user = {
          _id:               dbUser?._id?.toString() ?? "",
          email:             dbUser?.email            ?? user.email,
          name:              dbUser?.name             ?? user.name,
          isAdmin:           dbUser?.isAdmin          ?? false,
          isPasswordUpdated: dbUser?.isPasswordUpdated ?? false,
        };
      }

      if (trigger === "update" && session) {
        token.user = {
          ...token.user,
          email: session.user.email,
          name:  session.user.name,
        };
      }

      return token;
    },

    async session({ session, token }: any) {
      session.user = token.user;
      return session;
    },

    // Ensures a DB record exists for new Google users.
    async signIn({ account, profile }: any) {
      if (account?.provider !== "google") return true;

      try {
        await dbConnect();
        const existing = await UserModel.findOne({ email: profile.email });

        if (!existing) {
          await UserModel.create({
            name:              profile.name,
            email:             profile.email,
            password:          null,
            isAdmin:           false,
            isPasswordUpdated: false,
          });
        } else if (existing.isAuthorized === false) {
          return false;
        }
        return true;
      } catch (e) {
        console.error("[auth] signIn error:", e);
        return false;
      }
    },
  },
});
