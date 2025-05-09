import { HttpClientRequestType, sendHttpRequest } from "@/lib/http";
import { BaseResponse } from "@/lib/http/response";
import { Task } from "./types";

export async function getTasks(page: number, pageSize: number, token: string) {
  const request: HttpClientRequestType = {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
    method: "GET",
    path: "/tasks",
    headers: {
      Authorization: token,
    },
    queryParams: new URLSearchParams({
      page: `${page}`,
      page_size: `${pageSize}`,
    }),
    body: undefined,
  };

  return sendHttpRequest<BaseResponse<Task[]>>(request);
}

export async function createTask(
  arg: {
    title: string;
    description: string;
    priority: number;
    project_id: number;
    due_date: string;
  },
  token: string
) {
  const request: HttpClientRequestType = {
    baseURL: process.env.MUTATION_API_BASE_URL || "",
    method: "POST",
    path: "/tasks",
    headers: {
      Authorization: token,
    },
    queryParams: undefined,
    body: { ...arg },
  };

  return sendHttpRequest<BaseResponse<string>>(request);
}

export async function updateTask(
  taskID: string,
  arg: {
    title: string;
    description: string;
    priority: number;
    project_id: number;
    due_date: string;
    is_completed: boolean;
  },
  token: string
) {
  const request: HttpClientRequestType = {
    baseURL: process.env.MUTATION_API_BASE_URL || "",
    method: "PUT",
    path: `/tasks/${taskID}`,
    headers: {
      Authorization: token,
    },
    queryParams: undefined,
    body: {
      action: "UPDATE",
      data: { ...arg },
    },
  };

  return sendHttpRequest<BaseResponse<string>>(request);
}

export async function deleteTask(taskID: string, token: string) {
  const request: HttpClientRequestType = {
    baseURL: process.env.MUTATION_API_BASE_URL || "",
    method: "DELETE",
    path: `/tasks/${taskID}`,
    headers: {
      Authorization: token,
    },
    queryParams: undefined,
    body: undefined,
  };

  return sendHttpRequest<BaseResponse<string>>(request);
}
