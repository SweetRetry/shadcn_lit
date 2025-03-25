import { VerifyValues } from "@/components/verify/ex-verify-form";
import { ExResponse, request } from "../request";
import {
  PostResetPwdParams,
  PostUserLoginParams,
  PostUserRegisterParams,
} from "./types";

export const postUserLogin = (data: PostUserLoginParams): Promise<ExResponse> =>
  request.post("/user/login", data);

export const postResetUserPwd = (
  data: PostResetPwdParams | VerifyValues,
): Promise<ExResponse> => request.post("/user/forgetPassword", data);

export const postSendForgetPwdCaptcha = (): Promise<ExResponse> =>
  request.post("/user/captcha", {
    event: "FORGET_PASSWORD",
  });

export const postUserRegister = (
  data: PostUserRegisterParams | VerifyValues,
): Promise<ExResponse> => request.post("/user/register", data);

export const postSendRegisterCaptcha = (): Promise<ExResponse> =>
  request.post("/user/captcha", {
    event: "EMAIL_REGISTER",
  });
