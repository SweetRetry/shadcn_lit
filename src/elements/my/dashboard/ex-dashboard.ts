import TailwindElement from "@/components/tailwind-element";
import "@/components/ui/ex-copyable";
import { ExUserController } from "@/controllers/user-controller";
import { WalletController } from "@/controllers/wallet-controller";
import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { createWalletBalanceTemplate } from "../wallet/ex-wallet";

@customElement("ex-dashboard")
export class ExDashboard extends TailwindElement {
  userController = new ExUserController(this);
  walletController = new WalletController(this);
  render() {
    const userInfo = this.userController.userInfo;

    return html` <section>
      <div class="flex space-x-8">
        <div class="flex">
          <div
            class="relative mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary bg-opacity-70"
          >
            <span class="text-xl text-white text-opacity-90">
              ${userInfo?.fullName
                ?.split(" ")
                ?.map((item) => item[0])
                ?.join(" ")}
            </span>
            <div
              class="absolute -right-1 -top-1 rounded-full border-2 border-solid border-white bg-white"
            >
              <img
                src=${`/svgs/countries/${userInfo?.country}` + ".svg"}
                class="h-6 w-6"
              />
            </div>
          </div>
          <div>
            <label> ${userInfo?.fullName} </label>
            <p>${userInfo?.email}</p>
          </div>
        </div>

        <div class="flex border-l border-border">
          <div class="px-8">
            <label class="mb-4 text-gray-500">Exworth ID</label>
            <ex-copyable str=${userInfo?.uuid || "--"}></ex-copyable>
          </div>

          <div class="px-8">
            <label class="mb-4 text-gray-500">Identity Status</label>
            <p>${userInfo?.identity.user.status}</p>
          </div>
        </div>
      </div>

      <div class="mt-4">
        ${createWalletBalanceTemplate(this.walletController.wallet)}
      </div>
    </section>`;
  }
}
