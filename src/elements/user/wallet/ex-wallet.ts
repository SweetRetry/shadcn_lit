import TailwindElement from "@/components/tailwind-element";
import "@/components/ui-extends/link";
import "@/components/ui/ex-button";
import "@/components/ui/ex-checkbox";
import { ExCheckbox } from "@/components/ui/ex-checkbox";
import { CoinController } from "@/controllers/coin-controller";
import { WalletController, WalletInfo } from "@/controllers/wallet-controller";
import { cryptoPrecisionFormat, currencyFormat } from "@/utils/format";
import { EX_MODULE_ENUM } from "@/utils/module";
import currency from "currency.js";
import { html } from "lit";
import { translate as t } from "lit-i18n";
import { customElement, state } from "lit/decorators.js";

@customElement("ex-wallet")
export class ExWallet extends TailwindElement {
  private coinController = new CoinController(this, { immediate: true });
  private walletController = new WalletController(this);

  @state()
  private _hiddenZeroBalance = JSON.parse(
    localStorage.getItem("hiddenZeroBalance") || "false",
  );

  // Getter
  get hiddenZeroBalance() {
    return this._hiddenZeroBalance;
  }

  // Setter
  set hiddenZeroBalance(value: boolean) {
    const oldValue = this._hiddenZeroBalance;
    this._hiddenZeroBalance = value;
    this.requestUpdate("hiddenZeroBalance", oldValue);
    // 同步到 localStorage
    localStorage.setItem("hiddenZeroBalance", JSON.stringify(value));
  }

  renderHeader(wallet?: WalletInfo) {
    return html`<section>
      <div class="space-y-2">
        <p class="font-bold">${t("tAkKt6TgvSxv07JogOP3r")}</p>
        <p class="text-2xl font-bold">
          ${currency(wallet?.balance || 0).format({ precision: 2 })}
        </p>
      </div>

      <div class="mt-4 space-x-3">
        <ex-link .module=${EX_MODULE_ENUM.Deposit}>
          <ex-button> ${t("IAm45vKTSJbBqHfSfcDm8")} </ex-button>
        </ex-link>

        <ex-link .module=${EX_MODULE_ENUM.Withdraw}>
          <ex-button> ${t("LulHZBEkbWF9nh5mTOSkw")} </ex-button>
        </ex-link>
      </div>
    </section> `;
  }
  renderCryptos(wallet?: WalletInfo) {
    if (wallet?.assets) {
      let assets = Object.entries(wallet?.assets);

      this.hiddenZeroBalance &&
        (assets = assets.filter(
          (asset) => Number(asset[1].total_amount) !== 0,
        ));

      return html` <section>
        <div class="mb-4 flex items-center justify-end space-x-2">
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
          ${assets.map(
            ([coinCode, value]) =>
              html`<li class="flex justify-between">
                <div class="flex items-center space-x-3">
                  <img
                    src="${CoinController.getCoinIcon(coinCode)}"
                    class="h-8 w-8"
                  />
                  <div class="space-y-2">
                    <p class="font-bold">${coinCode}</p>
                    <p class="text-sm text-gray-400">
                      ${this.coinController.coinMap?.get(coinCode)?.fullName}
                    </p>
                  </div>
                </div>

                <div class="space-y-2">
                  <p>
                    ${cryptoPrecisionFormat(value.total_amount, {
                      precision:
                        this.coinController.coinMap?.get(coinCode)?.precision,
                    })}
                  </p>

                  <p class="text-right text-sm text-gray-400">
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
    return html` <section class="h-full rounded border border-border p-4">
      <ex-spinner
        .loading=${this.walletController.isGettingWalletInfo ||
        this.coinController.isGettingCoinList}
      >
        ${this.renderHeader(wallet)}
        <p class="my-6 h-[1px] w-full bg-gray-200"></p>
        ${this.renderCryptos(wallet)}
      </ex-spinner>
    </section>`;
  }
}
