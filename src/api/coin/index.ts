import { ExResponse, request } from "../request";

export const getCoinList = (): Promise<ExResponse<{ coin: CoinItem[] }>> =>
  request.get("/coinlist");
