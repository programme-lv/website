type SuccessResponse<T> = {
  status: "success";
  data: T;
};

type ErrorResponse = {
  status: "error";
  data: null;
  code: string;
  message: string;
};

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export type { ApiResponse, SuccessResponse, ErrorResponse };
