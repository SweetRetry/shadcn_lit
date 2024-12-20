import { ExResponse, request } from "..";

export const getCoinList = (): Promise<ExResponse<{ coin: CoinItem[] }>> =>
  request.get("/coinlist");
