import { getWalletNetwork, postWalletWithdraw } from "@/api/wallet";
import TailwindElement from "@/components/tailwind-element";
import "@/components/ui-extends/link";
import "@/components/ui/ex-button";
import "@/components/ui/ex-form/element";
import { ExForm } from "@/components/ui/ex-form/element";
import "@/components/ui/ex-input";
import "@/components/ui/ex-modal";
import { ExModal } from "@/components/ui/ex-modal";
import "@/components/ui/ex-select";
import "@/components/ui/ex-spinner";
import "@/components/verify/ex-verify-modal";
import { Big } from "big.js";
import { produce } from "immer";
import { ExVerifyModal } from "./../../../../components/verify/ex-verify-modal";

import { CoinController } from "@/controllers/coin-controller";
import { WalletController } from "@/controllers/wallet-controller";
import { cryptoPrecisionFormat } from "@/utils/format";

import { VerifyConfig } from "@/components/verify/ex-verify-modal";
import { EX_MODULE_ENUM } from "@/utils/module";
import { cn } from "@/utils/style";
import { html, nothing } from "lit";
import { translate as t } from "lit-i18n";
import { customElement, state } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";

const ininitialState = {
  coin: "USDE",
  amount: "",
  net: "",
  addr: "",
  type: "OUTER" as "OUTER" | "INTERNAL",
  target: "",
};

@customElement("ex-withdraw")
export class ExWithdraw extends TailwindElement {
  coinController = new CoinController(this);
  walletController = new WalletController(this);

  formRef = createRef<ExForm<typeof ininitialState>>();
  modalRef = createRef<ExModal>();
  verifyModalRef = createRef<ExVerifyModal>();

  @state()
  formState = { ...ininitialState };

  @state()
  rules = {
    coin: [
      {
        type: "required",
        message: t("7fuLfmK1W1MD9aGo8ZfWM"),
      },
    ],
    addr: [
      {
        type: "required",
        message: t("7pWGqz-aGn5ygY1_lkQm6"),
      },
      {
        validator: async (value: string) => {
          if (this.formState.net) {
            const selectedNetwork = this.networks.find(
              (n) => n.network === this.formState.net,
            );
            if (!selectedNetwork) return Promise.resolve();

            if (!RegExp(selectedNetwork?.addressRegex).test(value)) {
              return Promise.reject("Invalid withdraw address");
            }
          }
        },
      },
    ],
    net: [
      {
        type: "required",
        message: t("JK8TNck3PIZmO1xWzgd2L"),
      },
    ],
    amount: [
      {
        type: "required",
        message: t("gWdzqffu61uCKOqb3-VIM"),
      },
      {
        validator: async (value: string) => {
          // value不为正整数提示输入正整数
          if (!/^\d+$/.test(value)) {
            return Promise.reject(t("vyAfAUot6ygBMGuT8qzRH"));
          }

          const availabelAmount = this.walletController.getCoinAvailableAmount(
            this.formState.coin,
          );

          if (!availabelAmount)
            return Promise.reject("Invalid withdraw amount");

          if (Big(value).gt(availabelAmount)) {
            return Promise.reject("Insufficient balance");
          }
        },
      },
    ],
    target: [
      {
        type: "required",
        message: t("151oWoM0Pe4ni-9Ep_iyN"),
      },
    ],
  };

  @state()
  networks: WalletNetwork[] = [];
  @state()
  networkModalOpen = false;
  @state()
  canWithdrawCoinList: { label: string; value: string }[] = [];

  setFormState = <T extends keyof typeof ininitialState>(
    key: T,
    value: (typeof ininitialState)[T],
  ) => {
    this.formState = produce(this.formState, (draft) => {
      draft[key] = value;
    });
  };
  async getNetworks() {
    const _formData = this.formRef.value?.getFieldsValue();

    const _coin = _formData?.coin || "USDE";

    const data = await getWalletNetwork({ coin: _coin });
    if (data.statusCode === 200) {
      this.networks = data.content;
    }
  }

  async connectedCallback() {
    super.connectedCallback();

    this.getNetworks();
    await this.coinController.fetchCoinList();

    this.canWithdrawCoinList = this.coinController.coinList
      .filter((coin) => coin.withdraw.length > 0)
      .map((item) => ({ label: item.coinCode, value: item.coinCode }));
  }

  async handleSubmit() {
    const { type } = this.formState;
    const shouldValidateKeys = ["coin", "amount"].concat(
      type === "OUTER" ? ["addr", "net"] : ["target"],
    ) as Array<keyof typeof ininitialState>;
    try {
      const values = await this.formRef.value?.validate(shouldValidateKeys);
      if (values) {
        const res = await postWalletWithdraw(values);
        if (res.statusCode === 200) {
          this.verifyModalRef?.value?.show(res.content as VerifyConfig);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  protected renderSelectCoinStep = () => {
    return html` <div class="space-y-2">
      <h3 class="mb-2 font-bold">${t("7fuLfmK1W1MD9aGo8ZfWM")}</h3>
      <ex-form-item name="coin">
        ${this.formState.coin === "USDE" &&
        html`<p slot="help">${t("m233lVVFcr4QDwfq2ycFP")}</p>`}
        <ex-select
          name="coin"
          .value=${this.formState.coin}
          placeholder=${t("7fuLfmK1W1MD9aGo8ZfWM")}
          .options=${this.canWithdrawCoinList}
          .labelRender=${(option: { label: string; value: string }) =>
            html` <div class="flex items-center space-x-2">
              <img
                src=${CoinController.getCoinIcon(option.value)}
                class="h-6 w-6"
              />
              <span> ${option.label} </span>
            </div>`}
        >
        </ex-select>
      </ex-form-item>
    </div>`;
  };

  protected handleSelectNetwork = ({ network }: WalletNetwork) => {
    if (this.formState.net === network) return;
    this.setFormState("net", network);
    this.formState.addr && this.formRef?.value?.validate(["addr"]);
    this.modalRef?.value?.close();
  };

  protected renderWithdrawTargetStep() {
    const { type, addr, target } = this.formState;
    const isOuter = type === "OUTER";
    return html` <div>
      <h3 class="font-bold">${t("wLwf2OXANiga0mKqyLe-0")}</h3>
      <div class="space-x-2">
        <ex-button
          variant="link"
          class=${type === "OUTER" && "text-primary"}
          @click="${() => this.setFormState("type", "OUTER")}"
        >
          ${t("17OHb745Zti_j6kZ0_EBW")}
        </ex-button>
        <ex-button
          variant="link"
          class=${this.formState.type === "INTERNAL" && "text-primary"}
          @click="${() => this.setFormState("type", "INTERNAL")}"
        >
          ${t("nTzlVuCOfSvg4CC4x7TmD")}
        </ex-button>
      </div>

      ${isOuter
        ? html`
            <ex-form-item name="addr">
              <ex-input
                placeholder="${t("7pWGqz-aGn5ygY1_lkQm6")}"
                .value=${addr}
                name="addr"
              ></ex-input>
            </ex-form-item>

            <ex-form-item name="net">
              <ex-select
                name="net"
                .options=${this.networks.map((item) => ({
                  label: item.name,
                  value: item.network,
                  ...item,
                }))}
                disabled
                .value=${this.formState.net}
                placeholder="${t("JK8TNck3PIZmO1xWzgd2L")}"
                @click=${() => this.modalRef.value?.show()}
                .labelRender=${(
                  option: WalletNetwork & {
                    label: string;
                    value: string;
                  },
                ) =>
                  html` ${option.network}
                    <span class="text-gray-500"> ${option.name} </span>`}
              ></ex-select>
            </ex-form-item>
          `
        : html`
            <ex-form-item name="target">
              <ex-input
                placeholder="Email / Exworth ID"
                .value=${target}
                name="target"
              ></ex-input>
            </ex-form-item>
          `}
    </div>`;
  }
  protected renderNetworkModal() {
    const _networks = this.networks.map((item) => ({
      ...item,
      matched: this.formState.addr
        ? RegExp(item.addressRegex).test(this.formState.addr)
        : true,
    }));

    return html` <ex-modal
      title="${t("JK8TNck3PIZmO1xWzgd2L")}"
      ${ref(this.modalRef)}
    >
      <p class="rounded bg-accent p-2 text-sm text-accent-foreground">
        ${t("44Og7j1RHGjp5kCBmm386")}
      </p>
      <ul class="mt-4">
        ${_networks.map(
          (item) =>
            html` <li
              @click=${() => {
                item.matched && this.handleSelectNetwork(item);
              }}
              class=${cn(
                "flex justify-between p-3 hover:bg-accent",
                item.matched
                  ? "cursor-pointer "
                  : "cursor-not-allowed select-none",
              )}
            >
              <div>
                <p class=${!item.matched && "text-muted-foreground"}>
                  ${item.network}
                  ${!item.matched
                    ? html`<span
                        class="ml-2 rounded bg-secondary p-1 text-xs text-secondary-foreground"
                      >
                        ${t("QVKj1r5hH6kNu0lJGkt_h")}
                      </span>`
                    : nothing}
                </p>
                <p
                  class=${cn(
                    "mt-2 text-sm ",
                    item.matched
                      ? "text-accent-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  ${item.name}
                </p>
              </div>
              <p
                class=${cn(
                  "mt-2 text-sm",
                  item.matched
                    ? "text-accent-foreground"
                    : "text-muted-foreground",
                )}
              >
                ${t("NoCuxoBNwZX49EvPtwDpr", [
                  cryptoPrecisionFormat(item.withdrawFee, {
                    append: this.formState.coin,
                    precision: this.coinController.coinMap?.get(
                      this.formState.coin,
                    )?.precision,
                  }),
                ])}
              </p>
            </li>`,
        )}
      </ul>
    </ex-modal>`;
  }

  protected renderWithdrawAmount = () => {
    const { coin, net, addr, type, target, amount } = this.formState;

    const precision = this.coinController.getCoinPrecision(coin);
    const availabelAmount = this.walletController.getCoinAvailableAmount(coin);

    const selectedNetwork = this.networks.find(
      (item) => item.network === this.formState.net,
    );

    const isOuter = type === "OUTER";

    const renderResult = () => {
      return html`
        <div class="mb-2 flex justify-between text-sm">
          <label class="text-muted-foreground">可用數量</label>
          <span>
            ${cryptoPrecisionFormat(availabelAmount, {
              precision: precision,
              append: coin,
            })}
          </span>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <p class="text-xl font-semibold">
              ${cryptoPrecisionFormat(
                Math.max(
                  Big(this.formState.amount || 0)
                    .minus(selectedNetwork?.withdrawFee || 0)
                    .toNumber(),
                  0,
                ),
                {
                  precision: precision,
                  append: coin,
                },
              )}
            </p>
            <p class="text-sm text-muted-foreground">
              ${t("NoCuxoBNwZX49EvPtwDpr", [
                cryptoPrecisionFormat(selectedNetwork?.withdrawFee || 0, {
                  precision: precision,
                  append: coin,
                }),
              ])}
            </p>
          </div>

          <ex-button
            @click=${this.handleSubmit}
            size="lg"
          >
            ${t("LulHZBEkbWF9nh5mTOSkw")}
          </ex-button>
        </div>
      `;
    };

    const isShow = (isOuter && net && addr) || (!isOuter && target);

    if (!isShow) return nothing;

    return html`
      <div>
        <h3 class="font-bold">${t("dGM4mBG9if-u_Z-iuG6zV")}</h3>

        <ex-form-item name="amount">
          <ex-input
            .placeholder=${isOuter
              ? `${selectedNetwork?.withdrawMin} - ${selectedNetwork?.withdrawMax}`
              : t("gWdzqffu61uCKOqb3-VIM")}
            name="amount"
            .value=${amount}
          >
            <div slot="suffix">
              ${coin}
              <span class="text-muted"> | </span>
              <span
                class="cursor-pointer text-primary"
                @click="${() => {
                  this.setFormState(
                    "amount",
                    Math.max(
                      selectedNetwork?.withdrawMax || 0,
                      availabelAmount || 0,
                    ).toString(),
                  );
                  requestAnimationFrame(() =>
                    this.formRef.value?.validate(["amount"]),
                  );
                }}"
              >
                MAX
              </span>
            </div>
          </ex-input>
        </ex-form-item>
        ${renderResult()}
      </div>
    `;
  };
  render() {
    return html`
      <section class="h-full rounded border border-border p-4 mobile:pt-0">
        <ex-spinner
          .loading=${this.coinController.isGettingCoinList ||
          this.walletController.isGettingWalletInfo}
        >
          <ex-link
            .module=${EX_MODULE_ENUM.Wallet}
            class="mb-4"
          >
            ← ${t("ZbyFlQ82c4TkhC-Te0z0_")}
          </ex-link>

          <ex-form
            ${ref(this.formRef)}
            .formState=${this.formState}
            @change=${(e: CustomEvent) =>
              this.setFormState(e.detail.key, e.detail.value)}
            .rules=${this.rules}
            class="space-y-4"
          >
            ${this.renderSelectCoinStep()} ${this.renderWithdrawTargetStep()}
            ${this.renderWithdrawAmount()}
          </ex-form>
        </ex-spinner>
      </section>

      ${this.renderNetworkModal()}
      <ex-verify-modal
        ${ref(this.verifyModalRef)}
        .callbacks=${{
          submit: postWalletWithdraw,
        }}
      ></ex-verify-modal>
    `;
  }
}
