import { BaseResponse } from "@/response";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type Profile = {
  user_id: string;
  username: string;
  created_at: string;
};

export async function login(credential: {
  username: string;
  password: string;
}): Promise<BaseResponse<string>> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credential),
    }
  );

  return await response.json();
}

export async function register(credential: {
  username: string;
  password: string;
}): Promise<BaseResponse<string>> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credential),
    }
  );

  return await response.json();
}

export async function getProfile(
  token: string
): Promise<BaseResponse<Profile>> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`,
    {
      method: "GET",
      headers: {
        Authorization: token,
      },
    }
  );

  return await response.json();
}

export async function setToken(token: string) {
  (await cookies()).set("token", "Bearer " + token);
}

export async function logout() {
  (await cookies()).delete("token");
  redirect("/auth/login");
}

export async function getToken() {
  return (await cookies()).get("token")?.value;
}
