import { ExApp } from "@/ex-app";
import { translate as t } from "lit-i18n";

export enum EX_MODULE_ENUM {
  Dashboard = "ex-dashboard",
  Login = "ex-login",
  Register = "ex-register",
  ResetPwd = "ex-reset-pwd",
  Wallet = "ex-wallet",
  Deposit = "ex-deposit",
  Withdraw = "ex-withdraw",
  Hisotry = "ex-history",
  Messages = "ex-messages",
}

export const EX_MODLUES: Record<
  EX_MODULE_ENUM,
  { name: any; module: () => Promise<any>; hideSider?: boolean }
> = {
  [EX_MODULE_ENUM.Login]: {
    name: t("NlTvgznX0BryVIMKQOY7G"),
    module: () => import("@/elements/auth/ex-login"),
    hideSider: true,
  },
  [EX_MODULE_ENUM.Register]: {
    name: t("FDiOM6AezHrPUOgj33o9a"),
    module: () => import("@/elements/auth/ex-register"),
    hideSider: true,
  },
  [EX_MODULE_ENUM.ResetPwd]: {
    name: t("NR6TsvjRUykEJKbsLwDrE"),
    module: () => import("@/elements/auth/ex-reset-pwd"),
    hideSider: true,
  },
  [EX_MODULE_ENUM.Dashboard]: {
    name: t("Dashboard"),
    module: () => import("@/elements/my/dashboard/ex-dashboard"),
  },
  [EX_MODULE_ENUM.Wallet]: {
    name: t("ZbyFlQ82c4TkhC-Te0z0_"),
    module: () => import("@/elements/my/wallet/ex-wallet"),
  },
  [EX_MODULE_ENUM.Deposit]: {
    name: t("IAm45vKTSJbBqHfSfcDm8"),
    module: () => import("@/elements/my/wallet/features/ex-deposit"),
  },
  [EX_MODULE_ENUM.Withdraw]: {
    name: t("LulHZBEkbWF9nh5mTOSkw"),
    module: () => import("@/elements/my/wallet/features/ex-withdraw"),
  },
  [EX_MODULE_ENUM.Hisotry]: {
    name: "History",
    module: () => import("@/elements/my/wallet/features/records/ex-history"),
  },
  [EX_MODULE_ENUM.Messages]: {
    name: "Messages",
    module: () => import("@/elements/my/messages/ex-messages"),
  },
};

export const handleModuleChange = (
  moduleName: EX_MODULE_ENUM,
  props?: Record<string, any>,
) => {
  const exApp = document.querySelector("ex-app") as ExApp;

  return exApp.switchModule(moduleName, props);
};
