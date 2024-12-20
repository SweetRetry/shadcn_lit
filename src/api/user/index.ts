import { ExResponse, request } from "..";

export const postUserLogin = (data: {
  email: string;
  password: string;
}): Promise<ExResponse> => request.post("/user/login", data);
