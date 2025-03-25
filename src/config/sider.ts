import { createLucideIcon } from "@/utils/icon";
import { EX_MODULE_ENUM } from "@/utils/module";
import { html } from "lit";
import {
  ArrowLeftRight,
  CreditCard,
  IconNode,
  LayoutDashboard,
  Wallet,
} from "lucide";

const createMenuLabel = (icon: IconNode, title: string) =>
  html` <div class="flex items-center">
    ${createLucideIcon(icon)}
    <span class="ml-2"> ${title} </span>
  </div>`;

export const SIDER_MENUS = [
  {
    label: createMenuLabel(LayoutDashboard, "Dashboard"),
    key: EX_MODULE_ENUM.Dashboard,
  },
  {
    label: createMenuLabel(Wallet, "Wallet"),
    key: "Wallet",
    children: [
      {
        label: "Assets",
        key: EX_MODULE_ENUM.Wallet,
      },
      {
        label: "Orders",
        key: EX_MODULE_ENUM.Hisotry,
      },
    ],
  },
  {
    label: createMenuLabel(CreditCard, "Card"),
    key: "Card",
  },
  {
    label: createMenuLabel(ArrowLeftRight, "Exchange"),
    key: "Exchange",
  },
];
