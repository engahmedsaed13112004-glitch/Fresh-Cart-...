import { DefaultSession, NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and Password are required");
        }

        const response = await fetch(`${process.env.API}/auth/signin`, {
          method: "POST",
          body: JSON.stringify({
            email: credentials.email.trim(),
            password: credentials.password
          }),
          headers: {
            "Content-Type": "application/json"
          }
        });

        const payload = await response.json();

        if (response.ok && payload.token) {
          const decode: { id: string } = jwtDecode(payload.token);

          return {
            id: decode.id,
            name: payload.user.name,
            email: payload.user.email,
            token: payload.token,
            user: payload.user 
          };
        } else {
          throw new Error(payload.message || "Invalid email or password");
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = (user as any).user || user;
        token.token = (user as any).token;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = token.user as any;
        (session as any).token = token.token;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt"
  }
};

// Types declaration
declare module "next-auth" {
  interface Session {
    token?: string;
    user: {
      id?: string;
      role?: string;
      name?: string;
      email?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    token: string;
    user: {
      role?: string;
      name?: string;
      email?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    token?: string;
    user?: any;
  }
}