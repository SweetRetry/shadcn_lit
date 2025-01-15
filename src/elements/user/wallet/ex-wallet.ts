import "@/components/common/app-link";
import TailwindElement from "@/components/tailwind-element";
import "@/components/ui/ex-button";
import "@/components/ui/ex-checkbox";
import { ExCheckbox } from "@/components/ui/ex-checkbox";
import { AppWalletShowZeroBalanceKey } from "@/config/storageKey";
import { CoinController } from "@/controllers/coin-controller";
import { WalletController, WalletInfo } from "@/controllers/wallet-controller";
import { cryptoPrecisionFormat, currencyFormat } from "@/utils/format";
import { EX_MODULE_ENUM } from "@/utils/module";
import currency from "currency.js";
import { html } from "lit";
import { translate as t } from "lit-i18n";
import { customElement, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

@customElement("ex-wallet")
export class ExWallet extends TailwindElement {
  private coinController = new CoinController(this, { immediate: true });
  private walletController = new WalletController(this);

  @state()
  private _hiddenZeroBalance = JSON.parse(
    localStorage.getItem(AppWalletShowZeroBalanceKey) || "false",
  ) as boolean;

  // Getter
  get hiddenZeroBalance() {
    return this._hiddenZeroBalance;
  }

  // Setter
  set hiddenZeroBalance(value: boolean) {
    this._hiddenZeroBalance = value;
    // 同步到 localStorage
    localStorage.setItem(AppWalletShowZeroBalanceKey, JSON.stringify(value));
  }

  get loading() {
    return (
      this.walletController.isGettingWalletInfo ||
      this.coinController.isGettingCoinList
    );
  }

  private renderHeader(wallet?: WalletInfo) {
    return html`<section class="flex justify-between">
      <div class="space-y-2">
        <p class="text-xl font-semibold">${t("tAkKt6TgvSxv07JogOP3r")}</p>
        <p class="text-2xl font-semibold">
          ≈ ${currency(wallet?.balance || 0).format({ precision: 2 })}
        </p>
      </div>

      <div class="space-x-3">
        <app-link .module=${EX_MODULE_ENUM.Deposit}>
          <ex-button size="sm" variant="secondary">
            ${t("IAm45vKTSJbBqHfSfcDm8")}
          </ex-button>
        </app-link>

        <app-link .module=${EX_MODULE_ENUM.Withdraw}>
          <ex-button size="sm" variant="secondary">
            ${t("LulHZBEkbWF9nh5mTOSkw")}
          </ex-button>
        </app-link>
      </div>
    </section> `;
  }
  private renderCryptos(wallet?: WalletInfo) {
    if (wallet?.assets) {
      let assets = Object.entries(wallet?.assets);

      this.hiddenZeroBalance &&
        (assets = assets.filter(
          (asset) => Number(asset[1].total_amount) !== 0,
        ));

      return html` <section>
        <div class="mb-4 flex items-center justify-between space-x-2">
          <h2 class="text-xl font-semibold">Assets</h2>
          <ex-checkbox
            .checked=${this.hiddenZeroBalance}
            @change=${(e: Event) => {
              this.hiddenZeroBalance = (e.target as ExCheckbox).checked;
            }}
          >
            ${t("w2A6KG_nqADy3pjNsC9I8")}
          </ex-checkbox>
        </div>
        <ul class="space-y-3">
          ${repeat(
            assets,
            ([coinCode]) => coinCode,
            ([coinCode, value]) =>
              html`<li class="flex items-center justify-between">
                <div class="flex">
                  <img
                    src="${CoinController.getCoinIcon(coinCode)}"
                    class="mr-2 h-8 w-8"
                  />
                  <div class="space-y-2">
                    <p class="font-bold">${coinCode}</p>
                    <p class="text-sm text-gray-500">
                      ${this.coinController.coinMap?.get(coinCode)?.fullName}
                    </p>
                  </div>
                </div>

                <div class="space-y-2 text-right">
                  <p>
                    ${cryptoPrecisionFormat(value.total_amount, {
                      precision:
                        this.coinController.coinMap?.get(coinCode)?.precision,
                    })}
                  </p>

                  <p class="text-sm text-gray-500">
                    ≈${currencyFormat(value.total_convert)}
                  </p>
                </div>
              </li>`,
          )}
        </ul>
      </section>`;
    }
  }

  render() {
    const wallet = this.walletController.wallet;

    return html` <section class="h-full rounded">
      <ex-spinner .loading=${this.loading}>
        ${this.renderHeader(wallet)}
        <p class="my-4 h-[1px] w-full bg-gray-200"></p>
        ${this.renderCryptos(wallet)}
      </ex-spinner>
    </section>`;
  }
}
