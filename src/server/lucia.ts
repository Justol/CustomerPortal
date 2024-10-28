import { lucia } from "lucia";
import { prisma } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export const auth = lucia({
  env: "DEV", // "PROD" if production
  adapter: prisma(client, {
    user: "user",
    key: "key",
    session: "session"
  }),
  getUserAttributes: (data) => {
    return {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role
    };
  }
});

export type Auth = typeof auth;