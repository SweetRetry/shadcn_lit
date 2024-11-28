import "@shoelace-style/shoelace/dist/components/dialog/dialog.js";
import SlDialog from "@shoelace-style/shoelace/dist/components/dialog/dialog.js";
import "@shoelace-style/shoelace/dist/components/option/option.js";
import "@shoelace-style/shoelace/dist/components/select/select.js";
import dialogStyles from "@shoelace-style/shoelace/dist/themes/light.css?inline";
import { Big } from "big.js";
import { css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import BTC_LOGO from "../assets/BTC.svg";
import ETH_LOGO from "../assets/ETH.svg";
import USDT_LOGO from "../assets/USDT.svg";
import TailwindProvider from "../components/tailwind-provider";
import { generateHSLShades } from "../utils/color";
import { cn } from "../utils/style";

const cryptos = [
  {
    name: "BTC Bitcoin",
    logo: BTC_LOGO,
    value: "BTC",
  },
  {
    name: "Ether",
    logo: ETH_LOGO,
    value: "ETH",
  },
  {
    name: "USDT",
    logo: USDT_LOGO,
    value: "USDT",
  },
];

@customElement("ex-wallet")
class ExWallet extends TailwindProvider {
  @property()
  primary: string | undefined;

  static styles = [
    ...TailwindProvider.styles,
    css`
      ${unsafeCSS(dialogStyles)}
    `,
  ];

  @property()
  coin: string = "BTC";

  @property()
  amount: string = "500";

  @property()
  method: string = "wallet";

  @property()
  inputError: string = "";

  @property()
  currency: string = "USD";

  dialog: SlDialog | null = null;

  updated() {
    if (this.primary) {
      const style = document.createElement("style");

      style.textContent = `
          :host {
            --primary: ${this.primary};
            ${generateHSLShades(this.primary)}
          }
        `;
      this.shadowRoot?.appendChild(style);
    }
    this.dialog = this.shadowRoot?.querySelector("sl-dialog")!;
  }

  openDialog() {
    this.dialog?.show();
  }

  closeDialog() {
    this.dialog?.hide();
  }

  submit() {
    this.openDialog();
  }

  handleInput(value: string) {
    // 验证value为合法数字字符串，且为正数
    if (!/^\d+(\.\d+)?$/.test(value))
      return (this.inputError = "Invalid amount");
    if (!Big(value).gt(0)) return (this.inputError = "Invalid amount");

    this.inputError = "";
    this.amount = Big(value).toString();
  }

  renderCryptos() {
    return html` <section>
      <ul class="flex justify-around space-x-6">
        ${cryptos.map(
          (crypto) => html`
            <li
              class=${cn(
                "flex justify-center items-center w-[130px] shadow flex-col py-4 rounded space-y-4 cursor-pointer hover:border-primary border border-solid",
                this.coin === crypto.value && "border-primary"
              )}
              @click=${() => (this.coin = crypto.value)}
            >
              <img src=${crypto.logo} class="w-12 h-12" />
              <span class="font-bold">${crypto.name}</span>
            </li>
          `
        )}
      </ul>
      <p
        class="text-center mt-4 flex items-center justify-center text-gray-400"
      >
        You selected
        <span
          class="border border-solid rounded-xl px-3 border-primary inline-flex items-center space-x-2 ml-2 text-black"
        >
          <img
            src=${cryptos.find((item) => item.value === this.coin)?.logo}
            class="w-4 h-4 mr-2"
          />
          ${this.coin}
        </span>
      </p>
    </section>`;
  }

  // 渲染组件的 HTML
  render() {
    return html`
      <div
        class="shadow px-16 py-8 rounded mx-auto container flex justify-center items-center flex-col space-y-8 max-w-[768px]"
      >
        <h2 class="font-bold">CHOOSE A CRYPTO</h2>
        ${this.renderCryptos()}
        <section class="flex justify-center flex-col items-center w-full">
          <p class="font-bold text-base mb-2">HOW MUCH?</p>
          <div class="w-full">
            <div class="relative">
              <span class="absolute left-4 h-full inline-flex items-center">
                $
              </span>
              <input
                class="border border-border flex-1 px-12 py-3 focus-visible:outline-primary rounded w-full"
                placeholder="0.00"
                value=${this.amount}
                @input=${(e: any) => this.handleInput(e.target.value)}
              />

              <sl-select
                class="absolute right-2 h-full inline-flex items-center"
                filled
                value=${this.currency}
                @sl-change=${(e: any) => {
                  this.currency = e.target.value;
                }}
              >
                <sl-option value="USD">USD</sl-option>
                <sl-option value="CNY">CNY</sl-option>
              </sl-select>
            </div>
            ${this.inputError &&
            html`<p class="text-red-600 text-left">${this.inputError}</p>`}
          </div>
          <ul class="flex space-x-4 justify-center mt-4">
            ${[500, 2000, 5000, 8000].map(
              (item) => html`
                <li>
                  <button
                    class=${cn(
                      "rounded px-3 py-1 text-white hover:bg-black",
                      this.amount === item.toString()
                        ? "bg-black "
                        : "bg-gray-300 "
                    )}
                    @click=${() => (this.amount = item.toString())}
                  >
                    $ ${item}
                  </button>
                </li>
              `
            )}
          </ul>
          <p class="mt-2">Apporx 0.0246 BTC</p>
        </section>
        <section class="w-full">
          <p class="font-bold text-base mb-3 text-center">PAYMENT METHOD</p>
          <div class="flex justify-between space-x-6">
            <div
              class=${cn(
                "border border-solid rounded-lg p-4 w-1/2 hover:border-primary cursor-pointer",
                this.method === "wallet" && "border-primary"
              )}
              @click=${() => (this.method = "wallet")}
            >
              <p>My flat balance($ 0.00)</p>
              <p class="text-gray-500 text-sm">ADD CREDIT</p>
              <p class="text-gray-400 text-xs">
                SWIFT,ACH,SEPA,FASTER PAYMENTS
              </p>
            </div>
            <div
              class=${cn(
                "border border-solid rounded-lg p-4 w-1/2 hover:border-primary cursor-pointer",
                this.method === "card" && "border-primary"
              )}
              @click=${() => (this.method = "card")}
            >
              <p>Credit/Debit card</p>
              <p class="text-gray-500 text-sm">INSTANT PURCHASE</p>
              <p class="text-gray-400 text-xs">VISA MASTERCARD</p>
            </div>
          </div>
        </section>
        <button
          class="bg-primary text-white rounded px-4 py-2 w-full"
          @click=${this.submit}
        >
          Continue
        </button>

        <sl-dialog label="Dialog">
          <div class="flex justify-between">
            You are trying to buy ${this.amount} USD worth of ${this.coin} using
            a ${this.method}
          </div>
          <div slot="footer">
            <button
              class="bg-primary text-white rounded px-4 py-2 "
              @click=${this.closeDialog}
            >
              Close
            </button>
            <button
              class="bg-primary text-white rounded px-4 py-2 "
              @click=${this.submit}
            >
              Confirm
            </button>
          </div>
        </sl-dialog>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ex-wallet": ExWallet;
  }
}
