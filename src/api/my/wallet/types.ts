export interface DepositConfig {
  addr: string;
  code: string;
  coin: string;
  depositMax: number;
  depositMin: number;
  net: number;
}

export interface WalletNetwork {
  network: string;
  name: string;
  addressRegex: string;
  contractType: string;
  withdrawFee: number;
  withdrawMax: number;
  withdrawMin: number;
  depositMax: number;
  depositMin: number;
}

export interface DepositRecordItem {
  amount: number;
  createTime: string;
  id: string;
  recordType: string;
  type: string;
  coinCode: string;
  icon: string;
}

export interface WithdrawRecordItem {
  amount: number;
  createTime: string;
  fee: number;
  hash: string;
  id: string;
  receiver: string;
  sendAmount: number;
  status: number;
  recordType: string;
  type: string;
  coinCode: string;
  icon: string;
  // 外部轉賬時存在
  net?: string;
}
