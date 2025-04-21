import { prisma } from "@/db/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        // Check if the user exists in the database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        // Check if the user exists and if the password is correct
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );

          // If password is correct, return the user object
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        // If user does not exist or password is incorrect, return null
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      // Set the user ID from the token
      session.user.id = token.sub;

      // If there's an update, set the user name
      if (trigger === "update") {
        session.user.name = user.name;
      }

      return session;
    },
  },
  // satisfies NextAuthConfig is a TypeScript utility type that ensures the config object is compatible with the NextAuthConfig type.
} satisfies NextAuthConfig;

// Handlers is an object that contains the http handlers for the different endpoints that NextAuth uses, and we'll use these handlers to create our NextAuth API routes'
// Auth is a function that will get the session and check if the user is logged in or not
export const { handlers, auth, signIn, signOut } = NextAuth(config);
