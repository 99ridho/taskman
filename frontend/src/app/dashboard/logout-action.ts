"use server";

import { logout } from "@/lib/auth";

export default async function logoutAction() {
  await logout();
}
