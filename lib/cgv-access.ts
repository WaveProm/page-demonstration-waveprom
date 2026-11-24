import "server-only";

const expectedPassword = () => {
  const password = process.env.CGV_PASSWORD;
  if (!password) throw new Error("CGV_PASSWORD is not set");
  return password;
};

export const isCgvPassword = (password: string) =>
  password === expectedPassword();
