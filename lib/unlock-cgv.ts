"use server";

import { redirect } from "next/navigation";
import { grantCgvAccessIfValid } from "@/lib/cgv-access";

export const unlockCgv = async (formData: FormData) => {
  const password = formData.get("password");
  if (typeof password === "string") await grantCgvAccessIfValid(password);
  redirect("/cgvwp");
};
