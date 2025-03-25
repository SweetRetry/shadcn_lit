import { getWalletWithdrawHistory } from "@/api/my/wallet";
import { WithdrawRecordItem } from "@/api/my/wallet/types";
import "@/components/ui/ex-table";

import TailwindElement from "@/components/tailwind-element";

import { CoinController } from "@/controllers/coin-controller";
import { cryptoPrecisionFormat } from "@/utils/format";
import { ColumnDef } from "@tanstack/lit-table";
import { produce } from "immer";
import { html, PropertyValues } from "lit";
import { translate as t } from "lit-i18n";
import { customElement, property, state } from "lit/decorators.js";
// 枚举定义
export enum CoinWithdrawStatus {
  WAITING = 0,
  PROCESSING = 1,
  SUCCESS = 2,
  FAILURE = 3,
  CANCEL = 4,
}

const withdrawStatusTextMap: Record<CoinWithdrawStatus, any> = {
  [CoinWithdrawStatus.WAITING]: t("history.withdraw.status.waiting"),
  [CoinWithdrawStatus.PROCESSING]: t("history.withdraw.status.processing"),
  [CoinWithdrawStatus.SUCCESS]: t("history.withdraw.status.success"),
  [CoinWithdrawStatus.FAILURE]: t("history.withdraw.status.failure"),
  [CoinWithdrawStatus.CANCEL]: t("history.withdraw.status.cancel"),
};

const columns: ColumnDef<WithdrawRecordItem>[] = [
  {
    accessorKey: "createTime",
    header: "Create Time",
    cell: ({ row }) => row.getValue("createTime"),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) =>
      row.getValue("type") === "INTERNAL"
        ? "內部提幣"
        : `外部提幣(${row.original.net})`,
  },
  {
    accessorKey: "amount",
    header: () => html`<div class="text-right">Amount</div>`,
    cell: ({ row }) =>
      html` <div class="text-right">
        ${cryptoPrecisionFormat(row.getValue("amount"), {
          append: row.original.coinCode,
          precision: CoinController.getCoinPrecision(row.original.coinCode),
        })}
      </div>`,
  },
  {
    accessorKey: "id",
    header: "TxID",
    cell: ({ row }) => row.getValue("id"),
  },
  {
    accessorKey: "status",
    header: () => "Status",
    cell: ({ row }) =>
      withdrawStatusTextMap[row.original.status as CoinWithdrawStatus],
  },
];

const ininitialParams = {
  coin: "",
  // status: "" as "" | CoinWithdrawStatus,
};

@customElement("ex-withdraw-history")
export class ExDepositRecord extends TailwindElement {
  private coinController = new CoinController(this, { immediate: true });

  @property()
  mode?: "recent" | "history" = "history";

  @state()
  queryParams = { ...ininitialParams };

  @state()
  dataSource: WithdrawRecordItem[] = [];

  @state()
  loading = false;

  @state()
  pageID = 1;

  @property()
  pageSize = 10;

  @state()
  totalPage = 0;

  @state()
  totalCount = 0;

  @state()
  error = "";

  async _fetchData() {
    this.loading = true;
    const res = await getWalletWithdrawHistory({
      pageID: this.pageID,
      pageSize: this.pageSize,
      ...this.queryParams,
    });
    if (res.statusCode === 200) {
      this.totalPage = res.content.totalPage;
      this.totalCount = res.content.totalCount;
      this.dataSource = res.content.list;
    } else {
      this.error = res.message;
    }
    this.loading = false;
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this._fetchData();
  }

  setQueryParams = <T extends keyof typeof ininitialParams>(
    key: T,
    value: (typeof ininitialParams)[T],
  ) => {
    this.queryParams = produce(this.queryParams, (draft) => {
      draft[key] = value;
    });
  };

  render() {
    if (this.mode === "recent")
      return html`
        <ex-table
          .columns=${columns}
          .error=${this.error}
          .loading=${this.loading}
          .dataSource=${this.dataSource}
          .pagination=${false}
        ></ex-table>
      `;

    return html`
      <ex-form
        direction="horizontal"
        .formState=${this.queryParams}
        @change=${(e: CustomEvent) =>
          this.setQueryParams(e.detail.key, e.detail.value)}
      >
        <ex-form-item
          label="${t("SFyzijuyLIdw6u62SJLxd")}"
          class="w-1/5"
          name="coin"
        >
          <ex-select
            name="coin"
            .value=${this.queryParams.coin}
            autoFillAllOption
            @change=${this._fetchData}
            .options=${this.coinController.coinList.map((item) => ({
              label: item.coinCode,
              value: item.coinCode,
            }))}
            .labelRender=${(option: { label: string; value: string }) => {
              if (!option.value) return option.label;
              return html` <div class="flex items-center space-x-2">
                <img
                  src=${CoinController.getCoinIcon(option.value)}
                  class="h-6 w-6"
                />
                <span> ${option.label} </span>
              </div>`;
            }}
          ></ex-select>
        </ex-form-item>
      </ex-form>
      <section class="relative mt-4 w-full overflow-x-auto overflow-y-hidden">
        ${this.loading
          ? html`<ex-spinner></ex-spinner>`
          : html` <ex-table
              .columns=${columns}
              .error=${this.error}
              .dataSource=${this.dataSource}
              .totalCount=${this.totalCount}
              .totalPage=${this.totalPage}
              .showTotal=${(total: number) => `Total ${total} order(s)`}
              .current=${this.pageID}
              @prev=${() => {
                this.pageID--;
                this._fetchData();
              }}
              @next=${() => {
                this.pageID++;
                this._fetchData();
              }}
            ></ex-table>`}
      </section>
    `;
  }
}
