"use server";

import { z, ZodError } from "zod";
import { createTask, deleteTask, updateTask } from "./api";
import { getToken } from "@/lib/auth";

interface TaskActionState {
  success: boolean;
  error?: {
    details?: string[];
    message: string;
  };
}

interface TaskMutationParams {
  title: string;
  description: string;
  priority: number;
  due_date: string;
  project_id: number;
  is_completed?: boolean;
}

export async function createTaskAction(
  prevState: TaskActionState,
  formData: FormData
): Promise<TaskActionState> {
  if ((formData.get("reset") as string) === "true") {
    return { success: false };
  }

  const schema = z.object({
    title: z.string().nonempty(),
    description: z.string().nonempty(),
    priority: z.number().gt(0),
    due_date: z.string().datetime(),
    project_id: z.number().gt(0),
  });

  try {
    const params: TaskMutationParams = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      priority: parseInt(formData.get("priority") as string),
      due_date: new Date(formData.get("due_date") as string).toISOString(),
      project_id: parseInt(formData.get("project_id") as string),
    };

    const parsed = schema.parse(params);
    const token = (await getToken()) ?? "";

    const result = await createTask(
      {
        ...parsed,
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
          message: "Validation error",
          details: (err as ZodError).issues.map(
            (i) => `${JSON.stringify(i.path)} - ${i.message}`
          ),
        },
      };
    }

    return {
      success: false,
      error: {
        message: "Error occured",
        details: [(err as Error).message],
      },
    };
  }
}

export async function updateTaskAction(
  prevState: TaskActionState,
  formData: FormData
): Promise<TaskActionState> {
  if ((formData.get("reset") as string) === "true") {
    return { success: false };
  }

  const schema = z.object({
    title: z.string().nonempty(),
    description: z.string().nonempty(),
    priority: z.number().gt(0),
    due_date: z.string().datetime(),
    project_id: z.number().gt(0),
    is_completed: z.boolean(),
  });

  try {
    const params: TaskMutationParams = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      priority: parseInt(formData.get("priority") as string),
      due_date: new Date(formData.get("due_date") as string).toISOString(),
      project_id: parseInt(formData.get("project_id") as string),
      is_completed: (formData.get("is_complete") as string) === "true",
    };

    const parsed = schema.parse(params);
    console.log(parsed);
    const token = (await getToken()) ?? "";

    const result = await updateTask(
      formData.get("task_id") as string,
      { ...parsed },
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

export async function deleteTaskAction(
  prevState: TaskActionState,
  formData: FormData
): Promise<TaskActionState> {
  if ((formData.get("reset") as string) === "true") {
    return { success: false };
  }

  try {
    const token = (await getToken()) ?? "";

    const result = await deleteTask(formData.get("task_id") as string, token);

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
