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
      return token;
    },
    session: async ({ session, token }: any) => {
      if (token) {
        session.user = token.user;
      }
      return session;
    },
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config);
// import CredentialsProvider from "next-auth/providers/credentials";
// import dbConnect from "./dbConnect";
// import UserModel from "./models/UserModel";
// import bcrypt from "bcryptjs";
// import GoogleProvider from "next-auth/providers/google";

// export const config = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//     CredentialsProvider({
//       credentials: {
//         email: {
//           type: "email",
//         },
//         password: { type: "password" },
//       },
//       async authorize(credentials) {
//         await dbConnect();
//         if (credentials == null) return null;

//         const user = await UserModel.findOne({ email: credentials.email });

//         if (user) {
//           const isMatch = await bcrypt.compare(
//             credentials.password as string,
//             user.password
//           );
//           if (isMatch) {
//             return user;
//           }
//         }
//         return null;
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/signin",
//     newUser: "/register",
//     error: "/signin",
//   },
//   callbacks: {
//     async jwt({ user, trigger, session, token }: any) {
//       if (user) {
//         token.user = {
//           _id: user._id,
//           email: user.email,
//           name: user.name,
//           isAdmin: user.isAdmin,
//         };
//       }
//       if (trigger === "update" && session) {
//         token.user = {
//           ...token.user,
//           email: session.user.email,
//           name: session.user.name,
//         };
//       }
//       //  console.log('jwt', token)
//       return token;
//     },
//     session: async ({ session, token }: any) => {
//       if (token) {
//         session.user = token.user;
//       }
//       const sessionUser = await UserModel.findOne({ email: session.user.email });
//       if (sessionUser) {
//         session.user.id = sessionUser._id;
//         session.user.isAdmin = sessionUser.isAdmin; // Ensures isAdmin is added to session
//       }

//       return session;
//     },
//     async signIn({ profile, account }: any) {
//       console.log(profile);
//       try {
//         await dbConnect();
//         if (account.provider === "google") {
//         const userExist = await UserModel.findOne({ email: profile.email });
//         console.log("userExist", userExist);
//         if (!userExist) {
//           const user = await UserModel.create({
//             name: profile.name,
//             email: profile.email,
//             isAdmin: false,
//             password: "",
//             cart: [],
//             addresses: [],
//             wishlist: []
//           })
//           await user.save();
//         }
//       }
//         return true
//       } catch (error) {
//         console.log(error);
//         return false;
//       }
//     },
//   },
// };

// export const {
//   handlers: { GET, POST },
//   auth,
//   signIn,
//   signOut,
// } = NextAuth(config);
