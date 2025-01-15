import { getCoinList } from "@/api/coin";
import { ReactiveController, ReactiveControllerHost } from "lit";

interface CoinControllerOptions {
  // 是否需要获取数据
  immediate?: boolean;
}
export class CoinController implements ReactiveController {
  host: ReactiveControllerHost;

  // 静态缓存，所有实例共享
  static cachedCoinList: CoinItem[] | null = null;
  static cachedCoinPrecisionMap: Map<string, CoinItem> | null = null;

  coinList: CoinItem[] = [];

  coinMap: Map<string, CoinItem> | null = null;

  // 正在获取 coinList
  isGettingCoinList = false;

  _options: CoinControllerOptions = { immediate: false };
  constructor(host: ReactiveControllerHost, options?: CoinControllerOptions) {
    (this.host = host).addController(this);
    this._options = {
      ...this._options,
      ...options,
    };
  }

  async hostConnected() {
    if (this._options.immediate) {
      await this.fetchCoinList();
      this.host.requestUpdate();
    }
  }

  hostDisconnected() {
  }

  async fetchCoinList() {
    // 如果缓存存在，直接使用缓存数据
    if (
      CoinController.cachedCoinList &&
      CoinController.cachedCoinPrecisionMap
    ) {
      this.coinList = CoinController.cachedCoinList;
      this.coinMap = CoinController.cachedCoinPrecisionMap;
      return;
    }

    // 如果缓存不存在，则获取数据
    this.isGettingCoinList = true;

    try {
      const data = await getCoinList();
      if (data.statusCode === 200) {
        // 更新当前实例的数据
        this.coinList = data.content?.coin || [];
        this.coinMap = new Map(
          this.coinList.map((item: CoinItem) => [item.coinCode, item]),
        );

        // 缓存数据
        CoinController.cachedCoinList = this.coinList;
        CoinController.cachedCoinPrecisionMap = this.coinMap;
      }
    } catch (error) {
      console.error("Failed to fetch coin list:", error);
    } finally {
      this.isGettingCoinList = false;
      this.host.requestUpdate()
    }
  }

  static getCoinIcon = (coinCode: string) => {
    return `/svgs/coin/${coinCode}.svg`;
  };

  static getCoinPrecision = (coinCode: string) => {
    return this.cachedCoinPrecisionMap?.get(coinCode)?.precision || 6;
  };
}
