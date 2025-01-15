import { getNoticeMessageList } from "@/api/user/my/notice";
import { ExMessageItem } from "@/api/user/my/types";
import "@/components/common/app-link";
import TailwindElement from "@/components/tailwind-element";
import "@/components/ui/ex-button";
import "@/components/ui/ex-dropdown";

import { createLucideIcon } from "@/utils/icon";
import { EX_MODULE_ENUM } from "@/utils/module";
import { html, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { ArrowRight, MessageCircle } from "lucide";

@customElement("ex-messages")
export class ExMessages extends TailwindElement {
  @property()
  type: "page" | "popup" = "page";

  @property()
  pageSize = 20;

  @state()
  dataSource: ExMessageItem[] = [];

  @state()
  loading = false;

  @state()
  pageID = 1;

  @state()
  isFinished = false;

  async fetchMessage() {
    this.loading = true;
    const res = await getNoticeMessageList({
      pageID: this.pageID,
      pageSize: this.pageSize,
    });
    if (res.statusCode === 200) {
      this.dataSource = [...this.dataSource, ...res.content.content];
    }

    this.loading = false;
  }

  loadMore() {
    if (this.isFinished) return;
    this.pageID++;
    this.fetchMessage();
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.fetchMessage();
  }
  render() {
    if (this.type === "popup") {
      return html`
        <ex-dropdown placement="bottom-end">
          <ex-button slot="trigger" size="icon" variant="ghost">
            ${createLucideIcon(MessageCircle)}
          </ex-button>

          <div class="min-w-60 p-4">
            <div class="mb-2 flex items-center justify-between">
              <div></div>
              <app-link
                class="text-sm text-gray-500"
                .module=${EX_MODULE_ENUM.Messages}
              >
                View all
                <span class="ml-2">
                  ${createLucideIcon(ArrowRight, { size: 16 })}
                </span>
              </app-link>
            </div>
            <ul class="space-y-2">
              ${repeat(
                this.dataSource,
                (item) => item.id,
                (item) => html`
                  <li
                    class="flex items-center justify-between space-x-4 whitespace-nowrap"
                  >
                    <label class="text-sm font-medium">${item.title}</label>
                    <span class="text-xs text-gray-500">
                      ${item.createTime}
                    </span>
                  </li>
                `,
              )}
            </ul>
          </div>
        </ex-dropdown>
      `;
    }
    return html`<section class="pb-4">
      <h2 class="mb-4 text-2xl font-bold">Messages</h2>
      <ul class="rounded border border-border">
        ${repeat(
          this.dataSource,
          (item) => item.id,
          (item) => html`
            <li class="border-b border-border p-4 last:border-none">
              <div
                class="mb-2 flex items-center justify-between space-x-4 whitespace-nowrap"
              >
                <label class="font-medium">${item.title}</label>
                <span class="text-xs text-gray-500"> ${item.createTime} </span>
              </div>
              <div class="text-sm text-gray-500">${item.body}</div>
            </li>
          `,
        )}
        ${this.loading
          ? html` <li class="py-4 text-center">
              <ex-spinner loading></ex-spinner>
            </li>`
          : html` <li class="py-2 text-center">
              <ex-button variant="link" @click=${this.loadMore}>
                ${this.isFinished ? "No More Data." : "Load More"}
              </ex-button>
            </li>`}
      </ul>
    </section> `;
  }
}
