interface DepositConfig {
  addr: string;
  code: string;
  coin: string;
  depositMax: number;
  depositMin: number;
  net: number;
}

interface WalletNetwork {
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
