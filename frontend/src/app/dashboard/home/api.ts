import { HttpClientRequestType, sendHttpRequest } from "@/lib/http";
import { BaseResponse } from "@/lib/http/response";
import { TaskSummary } from "../tasks/types";

export async function getTaskSummary(token: string) {
  const request: HttpClientRequestType = {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
    method: "GET",
    path: "/tasks/summary",
    headers: {
      Authorization: token,
    },
    queryParams: undefined,
    body: undefined,
  };

  return sendHttpRequest<BaseResponse<TaskSummary>>(request);
}
