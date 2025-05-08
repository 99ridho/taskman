"use server";

import { login, setToken } from "@/lib/auth";
import { BaseResponse } from "@/lib/http/response";

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginActionState {
  success: boolean;
  error?: {
    details?: string[];
    message: string;
  };
}

export async function loginAction(
  prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  try {
    const credentials: LoginCredentials = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };

    const res: BaseResponse<string> = await login(credentials);
    if (!res.data && res.error) {
      return {
        success: false,
        error: {
          message: res.error.message,
          details: res.error.details.map(
            (d) => `${JSON.stringify(d.path)} - ${d.message}`
          ),
        },
      };
    }

    if (res.data) {
      await setToken(res.data);
    }

    return { success: true };
  } catch (error) {
    return {
      error: {
        message: "Error occured",
        details: [(error as Error).message],
      },
      success: false,
    };
  }
}
