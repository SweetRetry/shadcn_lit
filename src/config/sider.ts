import { createLucideIcon } from "@/utils/icon";
import { EX_MODULE_ENUM } from "@/utils/module";
import { html } from "lit";
import { ArrowLeftRight, CreditCard, MessageCircle, Wallet } from "lucide";

export const SIDER_MENUS = [
  {
    label: html` <div class="flex items-center">
      ${createLucideIcon(Wallet)}
      <span class="ml-2">Wallet</span>
    </div>`,
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
    label: html` <div class="flex items-center">
      ${createLucideIcon(CreditCard)}
      <span class="ml-2"> Card </span>
    </div>`,
    key: "Card",
  },
  {
    label: html` <div class="flex items-center">
      ${createLucideIcon(ArrowLeftRight)}
      <span class="ml-2"> Exchange </span>
    </div>`,
    key: "Exchange",
  },
  {
    key: EX_MODULE_ENUM.Messages,
    label: html` <div class="flex items-center">
      ${createLucideIcon(MessageCircle)}
      <span class="ml-2"> Messages </span>
    </div>`,
  },
];
