import { VerifyValues } from "@/components/verify/ex-verify-form";
import { ExResponse, request } from "../../request";
import { DepositConfig, WalletNetwork } from "./types";

// 钱包账户
export const getUserAccount = (): Promise<ExResponse> =>
  request.get("/account/balance");

// 充币
export const getWalletNetwork = (params: {
  coin: string;
}): Promise<ExResponse<WalletNetwork[]>> =>
  request.get("/wallet/network", {
    params,
  });

// 充币配置
export const getDepositConfig = (params: {
  coin: string;
  net: string;
}): Promise<ExResponse<DepositConfig>> =>
  request.get("/wallet/coin/config", {
    params: { ...params, action: "Deposit" },
  });

export const postWalletWithdraw = (
  data:
    | {
        coin: string;
        net?: string;
        address?: string;
        amount: string;
        target?: string;
        type: "INTERNAL" | "OUTER";
      }
    | VerifyValues,
  requestId?: string,
): Promise<ExResponse> =>
  request.post("/wallet/withdraw", data, {
    headers: {
      "api-version": "2.0",
      "request-id": requestId,
    },
  });

export const getWalletDepositHistory = (params: {
  coin?: string;
  pageID: number;
  pageSize: number;
}): Promise<ExResponse> =>
  request.get("/wallet/record", {
    params: {
      ...params,
      type: "Deposit",
    },
  });

export const getWalletWithdrawHistory = (params: {
  coin?: string;
  pageID: number;
  pageSize: number;
}): Promise<ExResponse> =>
  request.get("/wallet/record", {
    params: {
      ...params,
      type: "Withdraw",
    },
  });
