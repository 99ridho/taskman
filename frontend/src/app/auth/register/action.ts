"use server";

import { register } from "@/lib/auth";
import { BaseResponse } from "@/lib/http/response";

interface RegisterCredentials {
  username: string;
  password: string;
}

interface RegisterActionState {
  success: boolean;
  error?: {
    details?: string[];
    message: string;
  };
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

    return { success: true };
  } catch (err) {
    return {
      error: {
        message: "Error occured",
        details: [(err as Error).message],
      },
      success: false,
    };
  }
}
