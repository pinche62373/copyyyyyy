import bcrypt from "bcryptjs";
import type { Password, Role, User } from "prisma-client";
import { prisma } from "#app/utils/db.server";

export type { User } from "prisma-client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      username: true,
      roles: {
        select: {
          name: true,
          permissions: {
            select: {
              resource: true,
              action: true,
              scope: true,
            },
            orderBy: {
              resource: "asc",
            },
          },
        },
      },
    },
  });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(
  email: User["email"],
  username: User["username"],
  password: string,
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      username,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function assignRoleToUser(userId: User["id"], role: Role["name"]) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      roles: {
        connect: {
          name: role,
        },
      },
    },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"],
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash,
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

export function updateUserAccountSettings({
  id,
  username,
}: Pick<User, "id" | "username">) {
  return prisma.user.update({
    where: { id },
    data: {
      id,
      username,
    },
  });
}

/**
 * Checks if the provided email address is available for use.
 */
// type Email = typeof User<Pick<User, "email">>

export async function isEmailAddressAvailable(email: string): Promise<boolean> {
  const result = await prisma.user.findFirst({
    where: { email },
  });

  if (result === null) {
    return true;
  }

  return false;
}

/**
 * Checks if the provided username is available for use.
 */
export async function isUsernameAvailable({
  username,
}: Pick<User, "username">): Promise<boolean> {
  const result = await prisma.user.findFirst({
    where: { username },
  });

  if (result === null) {
    return true;
  }

  return false;
}
