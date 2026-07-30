import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authenticateUser } from "@/lib/auth/authenticate-user";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      authorize: async (credentials) => authenticateUser(credentials),
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        if (typeof token.id === "string") {
          session.user.id = token.id;
        }

        if (token.role === "ADMIN" || token.role === "TECHNICIAN") {
          session.user.role = token.role;
        }
      }

      return session;
    },
  },
});
