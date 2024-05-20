import type { Cookie, CookieOptions, SessionData } from "@remix-run/node";
import { createCookie, createSessionStorage } from "@remix-run/node";
import invariant from "tiny-invariant";

import { prisma } from "./db.server";
invariant(
  process.env.COOKIE_SECRET,
  "Environment variable not found: COOKIE_SECRET",
);

interface StoreGeneratorArg {
  cookie: Cookie | CookieOptions;
}

export const sessionCookie = createCookie("__session", {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  secrets: [process.env.COOKIE_SECRET],
  secure: process.env.NODE_ENV === "production",
});

export const createDatabaseSessionStorage = ({ cookie }: StoreGeneratorArg) => {
  return createSessionStorage<SessionData, SessionData>({
    cookie,
    createData: async (data, expires) => {
      invariant(data.user.id, "userId must be set");

      const session = await prisma.session.create({
        data: {
          userId: data.user.id,
          expirationDate: expires || new Date(Date.now() + 99960000),
        },
      });

      return session.id;
    },
    readData: async (id) => {
      return await prisma.session.findUnique({
        where: { id },
        include: { user: { select: { email: true } } },
      });
    },
    updateData: async (id, data, expires) => {
      const userId = data.userId;

      await prisma.session.update({
        where: {
          id,
        },
        data: {
          userId,
          expirationDate: expires || new Date(Date.now() + 99960000),
        },
      });
    },
    deleteData: async (id) => {
      await prisma.session.delete({
        where: { id },
      });
    },
  });
};

export const { getSession, commitSession, destroySession } =
  createDatabaseSessionStorage({
    cookie: sessionCookie,
  });
