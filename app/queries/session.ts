import { prisma } from "#app/utils/db.server";

export function getExpiredSessionCount() {
  return prisma.session.count({
    where: {
      expirationDate: {
        lt: new Date(Date.now()),
      },
    },
  });
}

export function deleteExpiredSessions() {
  return prisma.session.deleteMany({
    where: {
      expirationDate: {
        lt: new Date(Date.now()),
      },
    },
  });
}
