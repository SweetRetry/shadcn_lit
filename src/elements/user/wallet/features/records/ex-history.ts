import "@/components/common/app-link";
import TailwindElement from "@/components/tailwind-element";
import "@/components/ui/ex-form/ex-form";
import "@/components/ui/ex-select";
import "@/components/ui/ex-tabs";
import { ExTabItem } from "@/components/ui/ex-tabs";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import "./ex-deposit-hisotry";
import "./ex-withdraw-history";

@customElement("ex-history")
export class ExHistory extends TailwindElement {
  @property()
  type = "deposit";

  renderHistory() {
    switch (this.type) {
      case "deposit":
        return html` <ex-deposit-history></ex-deposit-history> `;
      case "withdraw":
        return html` <ex-withdraw-history></ex-withdraw-history>`;
      default:
        return nothing;
    }
  }
  render() {
    const tabs: ExTabItem[] = [
      {
        label: "Deposit",
        value: "deposit",
      },
      {
        label: "Withdraw",
        value: "withdraw",
      },
    ];
    return html` <section>
      <ex-tabs
        .tabs=${tabs}
        .value=${this.type}
        @tab-change=${(e: CustomEvent<ExTabItem>) => {
          this.type = e.detail.value;
        }}
      ></ex-tabs>
      <div class="mt-2">${this.renderHistory()}</div>
    </section>`;
  }
}
