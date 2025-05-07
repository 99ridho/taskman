"use server";

import { z, ZodError } from "zod";
import { createProject, deleteProject, updateProject } from "./api";
import { getToken } from "@/lib/auth";

interface ProjectActionState {
  success: boolean;
  error?: {
    details?: string[];
    message: string;
  };
}

interface ProjectMutationParams {
  title: string;
  description: string;
}

export async function createProjectAction(
  prevState: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  if ((formData.get("reset") as string) === "true") {
    return { success: false };
  }

  const schema = z.object({
    title: z.string(),
    description: z.string().optional(),
  });

  try {
    const params: ProjectMutationParams = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
    };

    const parsed = schema.parse(params);
    const token = (await getToken()) ?? "";

    const result = await createProject(
      {
        title: parsed.title,
        description: parsed.description ?? "",
      },
      token
    );

    if (result.error) {
      return {
        success: false,
        error: {
          message: result.error.message,
          details: result.error.details.map(
            (d) => `${JSON.stringify(d.path)} - ${d.message}`
          ),
        },
      };
    }

    return {
      success: true,
    };
  } catch (err) {
    if (err instanceof ZodError) {
      return {
        success: false,
        error: {
          message: (err as ZodError).message,
          details: (err as ZodError).issues.map(
            (i) => `${JSON.stringify(i.path)} - ${i.message}`
          ),
        },
      };
    }

    return {
      success: false,
      error: {
        message: "error occured",
        details: [(err as Error).message],
      },
    };
  }
}

export async function updateProjectAction(
  prevState: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  if ((formData.get("reset") as string) === "true") {
    return { success: false };
  }

  const schema = z.object({
    title: z.string(),
    description: z.string().optional(),
  });

  try {
    const params: ProjectMutationParams = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
    };

    const parsed = schema.parse(params);
    const token = (await getToken()) ?? "";

    const result = await updateProject(
      formData.get("project_id") as string,
      {
        title: parsed.title,
        description: parsed.description ?? "",
      },
      token
    );

    if (result.error) {
      return {
        success: false,
        error: {
          message: result.error.message,
          details: result.error.details.map(
            (d) => `${JSON.stringify(d.path)} - ${d.message}`
          ),
        },
      };
    }

    return {
      success: true,
    };
  } catch (err) {
    if (err instanceof ZodError) {
      return {
        success: false,
        error: {
          message: (err as ZodError).message,
          details: (err as ZodError).issues.map(
            (i) => `${JSON.stringify(i.path)} - ${i.message}`
          ),
        },
      };
    }

    return {
      success: false,
      error: {
        message: "error occured",
        details: [(err as Error).message],
      },
    };
  }
}

export async function deleteProjectAction(
  prevState: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  if ((formData.get("reset") as string) === "true") {
    return { success: false };
  }

  try {
    const token = (await getToken()) ?? "";

    const result = await deleteProject(
      formData.get("project_id") as string,
      token
    );

    if (result.error) {
      return {
        success: false,
        error: {
          message: result.error.message,
          details: result.error.details.map(
            (d) => `${JSON.stringify(d.path)} - ${d.message}`
          ),
        },
      };
    }

    return {
      success: true,
    };
  } catch (err) {
    if (err instanceof ZodError) {
      return {
        success: false,
        error: {
          message: (err as ZodError).message,
          details: (err as ZodError).issues.map(
            (i) => `${JSON.stringify(i.path)} - ${i.message}`
          ),
        },
      };
    }

    return {
      success: false,
      error: {
        message: "error occured",
        details: [(err as Error).message],
      },
    };
  }
}
