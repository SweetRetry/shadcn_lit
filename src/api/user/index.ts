import { VerifyValues } from "@/components/verify/ex-verify-form";
import { ExResponse, request } from "..";
import { PostResetPwdParams, PostUserLoginParams } from "./types";

export const postUserLogin = (data: PostUserLoginParams): Promise<ExResponse> =>
  request.post("/user/login", data);

export const postResetUserPwd = (
  data: PostResetPwdParams | VerifyValues,
): Promise<ExResponse> => request.post("/user/forgetPassword", data);
