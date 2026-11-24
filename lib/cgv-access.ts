import "server-only";
import { createHash } from "node:crypto";
import { cookies } from "next/headers";

const cookieName = "cgvwp";
const cookieMaxAgeInSeconds = 60 * 60 * 24 * 30;

const expectedPassword = () => {
  const password = process.env.CGV_PASSWORD;
  if (!password) throw new Error("CGV_PASSWORD is not set");
  return password;
};

const accessToken = (password: string) =>
  createHash("sha256").update(password).digest("base64url");

export const hasCgvAccess = async () => {
  const token = (await cookies()).get(cookieName)?.value;
  return token === accessToken(expectedPassword());
};

export const grantCgvAccessIfValid = async (password: string) => {
  const expected = expectedPassword();
  if (password !== expected) return;

  (await cookies()).set(cookieName, accessToken(expected), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/cgvwp",
    maxAge: cookieMaxAgeInSeconds,
  });
};
