import { ExResponse, request } from "../request";
import { ExUserInfoModel } from "./types";

export const getUserInfo = (): Promise<ExResponse<ExUserInfoModel>> =>
  request.get("/user/info");
