import { HttpClientRequestType, sendHttpRequest } from "@/lib/http";
import { BaseResponse } from "@/lib/http/response";
import { Project, Task } from "./types";

export async function getProjects(
  page: number,
  pageSize: number,
  token: string
) {
  const request: HttpClientRequestType = {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
    method: "GET",
    path: "/projects",
    headers: {
      Authorization: token,
    },
    queryParams: new URLSearchParams({
      page: `${page}`,
      page_size: `${pageSize}`,
    }),
    body: undefined,
  };

  return sendHttpRequest<BaseResponse<Project[]>>(request);
}

export async function getProjectTasks(
  projectID: string,
  page: number,
  pageSize: number,
  token: string
) {
  const request: HttpClientRequestType = {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
    method: "GET",
    path: `/projects/${projectID}/tasks`,
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

export async function createProject(
  arg: { title: string; description: string },
  token: string
) {
  const request: HttpClientRequestType = {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
    method: "POST",
    path: "/projects",
    headers: {
      Authorization: token,
    },
    queryParams: undefined,
    body: { ...arg },
  };

  return sendHttpRequest<BaseResponse<string>>(request);
}

export async function updateProject(
  projectID: string,
  arg: { title: string; description: string },
  token: string
) {
  const request: HttpClientRequestType = {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
    method: "PUT",
    path: `/projects/${projectID}`,
    headers: {
      Authorization: token,
    },
    queryParams: undefined,
    body: { ...arg },
  };

  return sendHttpRequest<BaseResponse<string>>(request);
}

export async function deleteProject(projectID: string, token: string) {
  const request: HttpClientRequestType = {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
    method: "DELETE",
    path: `/projects/${projectID}`,
    headers: {
      Authorization: token,
    },
    queryParams: undefined,
    body: undefined,
  };

  return sendHttpRequest<BaseResponse<string>>(request);
}
