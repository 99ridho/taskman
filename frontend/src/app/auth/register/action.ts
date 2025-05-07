"use server";

import { login, register, setToken } from "@/lib/auth";
import { BaseResponse } from "@/response";

interface RegisterCredentials {
  username: string;
  password: string;
}

interface RegisterActionState {
  success: boolean;
  error?: string;
}

export async function registerAction(
  prevState: RegisterActionState,
  formData: FormData
): Promise<RegisterActionState> {
  try {
    const credentials: RegisterCredentials = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };

    const res: BaseResponse<string> = await register(credentials);
    if (!res.data && res.error) {
      return { success: false, error: `Login failed: ${res.error.message}` };
    }

    return { success: true };
  } catch (error) {
    return { error: (error as Error).message, success: false };
  }
}
