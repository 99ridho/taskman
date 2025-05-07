export type BaseResponseError = {
  type: string;
  details: { path: string[]; message: string }[];
  message: string;
  statusCode: number;
};

export type BaseResponsePaging = {
  page: number;
  page_size: number;
  total_records: number;
  total_page: number;
};

export type BaseResponse<T> = {
  data?: T;
  error?: BaseResponseError;
  paging?: BaseResponsePaging;
};
