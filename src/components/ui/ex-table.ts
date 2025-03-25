import TailwindElement from "@/components/tailwind-element";
import "@/components/ui/ex-spinner";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Table,
  TableController,
} from "@tanstack/lit-table";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

@customElement("ex-table")
export class ExTable<T = any> extends TailwindElement {
  @property({ type: Array })
  columns: ColumnDef<T, any>[] = [];

  @property()
  current = 1;

  @property()
  totalCount = 0;

  @property()
  totalPage = 0;

  @property()
  dataSource: T[] = [];

  @property({ type: Boolean })
  pagination = true;

  @property({ type: Function })
  showTotal?: Function;

  private next() {
    if (this.current < this.totalPage) {
      this.dispatchEvent(new CustomEvent("next"));
    }
  }

  private prev() {
    if (this.current > 1) {
      this.dispatchEvent(new CustomEvent("prev"));
    }
  }
  private rendertableHeader(table: Table<T>) {
    return html` <thead class="[&_tr]:border-b">
      <tr
        class="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
      >
        ${repeat(
          table.getHeaderGroups(),
          (headerGroup) => headerGroup.id,
          (headerGroup) =>
            html`${repeat(
              headerGroup.headers,
              (header) => header.id,
              (header) =>
                html` <th
                  class="h-10 w-[100px] px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
                >
                  ${header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>`,
            )}`,
        )}
      </tr>
    </thead>`;
  }

  private renderTable = (table: Table<T>) => {
    const columnCount = table.getAllColumns().length;

    return html`
      <table class="w-full caption-bottom text-sm tablet:min-w-[768px]">
        ${this.rendertableHeader(table)}
        <tbody class="[&_tr:last-child]:border-0">
          ${table.getRowModel().rows.length
            ? repeat(
                table.getRowModel().rows,
                (row) => row.id,
                (row) => html`
                  <tr
                    class="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    ${repeat(
                      row.getVisibleCells(),
                      (cell) => cell.id,
                      (cell) =>
                        html` <td
                          class="whitespace-nowrap p-2 align-middle font-medium [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
                        >
                          ${flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>`,
                    )}
                  </tr>
                `,
              )
            : html` <tr
                class="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
              >
                <td
                  colspan=${columnCount}
                  class="p-2 text-center align-middle font-medium [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
                >
                  暫無數據
                </td>
              </tr>`}
        </tbody>
      </table>
    `;
  };

  protected render() {
    const table = new TableController<T>(this).table({
      columns: this.columns,
      data: this.dataSource,
      getCoreRowModel: getCoreRowModel(),
    });

    return html`
      <section class="relative w-full overflow-x-auto overflow-y-hidden">
        ${this.renderTable(table)}
      </section>
      ${this.showTotal || this.pagination
        ? html` <div class="mt-2 flex justify-between px-2">
            <div class="text-sm text-gray-500">
              ${this.showTotal?.(this.totalCount)}
            </div>
            ${this.pagination !== false &&
            html` <div class="space-x-2">
              <ex-button
                variant="secondary"
                .disabled=${this.current === 1}
                @click=${this.prev}
              >
                Prev
              </ex-button>
              <ex-button
                variant="secondary"
                .disabled=${this.current === this.totalPage}
                @click=${this.next}
              >
                Next
              </ex-button>
            </div>`}
          </div>`
        : nothing}
    `;
  }
}
