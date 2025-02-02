import type { Cookie, CookieOptions, SessionData } from "react-router";
import { createCookie, createSessionStorage } from "react-router";
import invariant from "tiny-invariant";
import { COOKIE_SECURE } from "#app/utils/constants";
import { prisma } from "#app/utils/db.server";

invariant(
  process.env.COOKIE_DOMAIN,
  "Environment variable not found: COOKIE_DOMAIN",
);

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
  domain: process.env.COOKIE_DOMAIN,
  secure: COOKIE_SECURE,
  secrets: [process.env.COOKIE_SECRET],
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
      invariant(data.user.id, "Session update regquires data.userId");

      await prisma.session.update({
        where: {
          id,
        },
        data: {
          userId: data.user.id,
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
