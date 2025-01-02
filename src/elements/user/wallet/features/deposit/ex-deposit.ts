import { getDepositConfig, getWalletNetwork } from "@/api/wallet";
import "@/components/common/app-link";
import TailwindElement from "@/components/tailwind-element";
import "@/components/ui/ex-copyable";
import "@/components/ui/ex-form/ex-form";
import "@/components/ui/ex-input";
import "@/components/ui/ex-select";
import { CoinController } from "@/controllers/coin-controller";
import { EX_MODULE_ENUM } from "@/utils/module";
import { translate as t } from "lit-i18n";
import "./ex-deposit-record";

import { ExForm } from "@/components/ui/ex-form/ex-form";

import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { createRef, Ref, ref } from "lit/directives/ref.js";

@customElement("ex-deposit")
export class ExDeposit extends TailwindElement {
  private coinController = new CoinController(this);

  @state()
  formState = {
    coin: "USDE",
    net: "",
  };

  formRef: Ref<ExForm<typeof this.formState>> = createRef();

  @state()
  networks: WalletNetwork[] = [];

  @state()
  config?: DepositConfig = void 0;

  @state()
  loading = false;

  @state()
  canDepositCoinList: { label: string; value: string }[] = [];

  async fetchConfig(net: string) {
    this.formState = {
      ...this.formState,
      net,
    };
    const _formData = this.formRef?.value?.getFieldsValue();

    if (_formData?.coin && net) {
      this.loading = true;
      const data = await getDepositConfig({ coin: _formData.coin, net });
      if (data.statusCode === 200) {
        this.config = data.content;
      } else {
        this.config = void 0;
      }
      this.loading = false;
    }
  }

  async fetchNetworks() {
    const _formData = this.formRef?.value?.getFieldsValue();

    const _coin = _formData?.coin || "USDE";

    this.loading = true;

    const data = await getWalletNetwork({ coin: _coin });
    if (data.statusCode === 200) {
      this.networks = data.content;
      if (data.content.length) {
        const _net =
          data.content.find((item) => item.network === this.formState.net)
            ?.network || data.content?.[0].network;
        if (_net) {
          this.fetchConfig(_net);
        }
      }
    }
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.coinController.fetchCoinList();
    this.canDepositCoinList = this.coinController.coinList
      .filter((item) => item.canDeposit)
      .map((item) => ({ label: item.coinCode, value: item.coinCode }));
    this.fetchNetworks();
  }

  render() {
    return html` <section
      class="h-full rounded border border-border p-4 mobile:pt-0"
    >
      <app-link .module=${EX_MODULE_ENUM.Wallet} class="mb-4">
        ← ${t("ZbyFlQ82c4TkhC-Te0z0_")}
      </app-link>

      <ex-form .formState=${this.formState} ${ref(this.formRef)}>
        <ex-form-item label="${t("SFyzijuyLIdw6u62SJLxd")}" name="coin">
          <ex-select
            name="coin"
            .value=${this.formState.coin}
            .options=${this.canDepositCoinList}
            @change=${this.fetchNetworks}
            .labelRender=${(option: { label: string; value: string }) =>
              html` <div class="flex items-center space-x-2">
                <img
                  src=${CoinController.getCoinIcon(option.value)}
                  class="h-6 w-6"
                />
                <span> ${option.label} </span>
              </div>`}
          ></ex-select>
        </ex-form-item>

        <ex-form-item label="${t("-14eg2pKyLolrDkP-Zooi")}" name="net">
          <p slot="help">
            ${t("2UIPuozO_FWxLuMlJl8Az")}
            <span class="text-destructive">${this.formState.net} </span>
          </p>
          <ex-select
            name="net"
            .value=${this.formState.net}
            .placeholder=${t("-awz3VPYwuwZKhQmMa8UX")}
            .options=${this.networks.map((item) => ({
              label: item.name,
              value: item.network,
            }))}
            @change=${(e: CustomEvent) => this.fetchConfig(e.detail.value)}
          ></ex-select>
        </ex-form-item>

        ${this.config?.addr &&
        html` <ex-form-item>
            <div class="text-center">
              <img width="150" class="mx-auto" src=${this.config?.code} />
              <p class="mt-2 text-sm text-gray-600">
                ${t("XEuxY_V9UgZhpwkcbs7Cq")}
              </p>
            </div>
          </ex-form-item>

          <ex-form-item label=${t("17OHb745Zti_j6kZ0_EBW")}>
            <ex-copyable str=${this.config?.addr}></ex-copyable>
          </ex-form-item>`}
      </ex-form>
    </section>`;
  }
}
