import { getWalletRecord } from "@/api/wallet";
import TailwindElement from "@/components/tailwind-element";
import { CoinController } from "@/controllers/coin-controller";

import { html, PropertyValues } from "lit";
import { customElement, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

@customElement("ex-deposit-record")
export class ExDepositRecord extends TailwindElement {
  @state()
  loading = false;

  @state()
  error = "";

  @state()
  dataSource: any[] = [];

  @state()
  total = 0;

  @state()
  totalPage = 0;

  @state()
  pageSize = 10;

  @state()
  pageID = 1;

  _fetch = async () => {
    this.loading = true;
    const res = await getWalletRecord({
      type: "Deposit",
      pageID: this.pageID,
      pageSize: this.pageSize,
    });
    if (res.statusCode === 200) {
      this.dataSource = res.content.list;
      this.total = res.content.totalCount;
      this.totalPage = res.content.totalPage;
    } else {
      this.error = res.message;
    }
    this.loading = false;
  };

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this._fetch();
  }

  render() {
    return html`
      <ul>
        ${repeat(
          this.dataSource,
          (item) => item.id,
          (item) =>
            html` <li class="flex items-center justify-between">
              <div class="flex">
                <img
                  src=${CoinController.getCoinIcon(item.coinCode)}
                  class="mr-4 h-8 w-8"
                />

                <div>
                  <p class="text-sm font-semibold">${item.type}</p>
                  <p class="text-gray-500">${item.id}</p>
                </div>
              </div>

              <div class="text-right">
                <p class="text-sm font-semibold">${item.amount}</p>
                <p class="text-gray-500">${item.createTime}</p>
              </div>
            </li>`,
        )}
      </ul>
    `;
  }
}
