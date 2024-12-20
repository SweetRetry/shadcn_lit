interface CoinItem {
  // 可提幣
  canDeposit: boolean;
  // 閃兌
  canExchangeIn: boolean;
  canExchangeOut: boolean;
  // 內部，外部提幣 ["OUTER","INTERNAL"]
  withdraw: ["OUTER", "INTERNAL"];
  // 代币代号
  coinCode: string;
  // 代币id
  coinId: number;
  // 代币名称
  fullName: string;
  // 代币简称
  name: string;
  // 支持網絡
  nets: string[];
  // 小數點
  precision: number;
  show: boolean;
  // 交易類型
  trade: {
    fund: boolean;
    recharge: boolean;
    ppcRecharge: boolean;
  };
  icon: string;
}
