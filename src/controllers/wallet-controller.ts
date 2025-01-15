import { getUserAccount } from "@/api/wallet";

import { ReactiveController, ReactiveControllerHost } from "lit";

export interface MainAccount {
  accountType: "MainAccount";
  // 餘額
  balance: string | number;

  assets: MainAccountAsset[];
  // 賬戶詳細信息
  detail: {
    available: number;
    frozen: number;
  };
}

export interface MainAccountAsset {
  amount: number;
  coinCode: string;
  convert: number;
  type: "frozen" | "available" | "total";
}

export type CoinMapValue = {
  [key in `${"frozen" | "available" | "total"}_${"amount" | "convert"}`]?: number;
};

export interface WalletInfo {
  balance: string | number;
  available: number;
  frozen: number;
  assets: {
    [k: string]: CoinMapValue;
  };
}

export class WalletController implements ReactiveController {
  host: ReactiveControllerHost;

  wallet?: WalletInfo = void 0;

  isGettingWalletInfo = false;

  constructor(host: ReactiveControllerHost) {
    (this.host = host).addController(this);
  }
  async hostConnected() {
    await this.fetchWalletInfo();
    this.host.requestUpdate();
  }
  hostDisconnected() {
    this.wallet = void 0;
    this.host.requestUpdate();
  }

  protected async fetchWalletInfo() {
    // 如果缓存不存在，则获取数据
    this.isGettingWalletInfo = true;

    try {
      const data = await getUserAccount();

      if (data.statusCode === 200) {
        const mainAccount = data.content.find(
          (item: { accountType: string }) => item.accountType === "MainAccount",
        ) as MainAccount;

        if (mainAccount) {
          const coinMap: Map<string, CoinMapValue> = new Map();
          (mainAccount.assets as MainAccountAsset[]).map((item) => {
            coinMap.set(item.coinCode, {
              ...coinMap.get(item.coinCode),
              [`${item.type}_amount`]: item.amount,
              [`${item.type}_convert`]: item.convert,
            });
          });

          this.wallet = {
            balance: mainAccount.balance,
            available: mainAccount.detail.available,
            frozen: mainAccount.detail.frozen,
            assets: Object.fromEntries(coinMap),
          };
        }
      } else {
        this.wallet = void 0;
      }
    } catch (error) {
      console.error("Failed to fetch coin list:", error);
    } finally {
      this.isGettingWalletInfo = false;
      this.host.requestUpdate();
    }
  }
  getCoinAvailableAmount(coinCode: string) {
    return this.wallet?.assets?.[coinCode]?.available_amount;
  }
}
