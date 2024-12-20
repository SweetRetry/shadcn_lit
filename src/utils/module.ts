import { ExApp } from "@/ex-app";
import { translate as t } from "lit-i18n";

export enum EX_MODULE_ENUM {
  Login = "ex-login",
  Wallet = "ex-wallet",
  Deposit = "ex-deposit",
  Withdraw = "ex-withdraw",
}

export const EX_MODLUES = {
  [EX_MODULE_ENUM.Login]: {
    name: t("NlTvgznX0BryVIMKQOY7G"),
    module: () => import("@/elements/user/ex-login"),
  },
  [EX_MODULE_ENUM.Wallet]: {
    name: t("ZbyFlQ82c4TkhC-Te0z0_"),
    module: () => import("@/elements/wallet/ex-wallet"),
  },
  [EX_MODULE_ENUM.Deposit]: {
    name: t("IAm45vKTSJbBqHfSfcDm8"),
    module: () => import("@/elements/wallet/features/ex-deposit"),
  },
  [EX_MODULE_ENUM.Withdraw]: {
    name: t("LulHZBEkbWF9nh5mTOSkw"),
    module: () => import("@/elements/wallet/features/ex-withdraw"),
  },
};

export const loadExModule = (moduleName: EX_MODULE_ENUM) => {
  return EX_MODLUES[moduleName].module();
};

export const handleModuleChange = (moduleName: EX_MODULE_ENUM) => {
  const exApp = document.querySelector("ex-app") as ExApp;

  return exApp.switchModule(moduleName);
};
