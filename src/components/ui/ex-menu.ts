import TailwindElement from "@/components/tailwind-element";
import { createLucideIcon } from "@/utils/icon";
import { cn } from "@/utils/style";
import { html, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ChevronDown, ChevronUp } from "lucide";

interface MenuItem {
  key: string;
  label: string | TemplateResult;
  children?: MenuItem[];
}

@customElement("ex-menu")
export class ExMenu extends TailwindElement {
  @property({ type: Array })
  items: MenuItem[] = [];

  @property()
  activeKey: string | null = null;

  @state()
  openKeys = new Set<string>();

  handleItemClick(key: string) {
    this.activeKey = key;
    this.dispatchEvent(
      new CustomEvent("select", {
        detail: { key },
        bubbles: true,
        composed: true,
      }),
    );
  }

  toggleGroup(key: string) {
    if (this.openKeys.has(key)) {
      this.openKeys.delete(key);
    } else {
      this.openKeys.add(key);
    }
    this.requestUpdate();
  }

  renderItems(items: MenuItem[], level = 0): TemplateResult[] {
    return items.map((item) => {
      if (item.children) {
        const isOpen = this.openKeys.has(item.key);
        return html`
          <li class="flex flex-col">
            <div
              @click=${() => this.toggleGroup(item.key)}
              class=${cn(
                "flex cursor-pointer items-center whitespace-nowrap h-12 text-sm hover:bg-accent font-semibold px-6",
                {
                  "text-primary": isOpen,
                },
              )}
            >
              <span>${item.label}</span>
              <span class="ml-auto ">
                ${isOpen
                  ? createLucideIcon(ChevronDown, { size: 16 })
                  : createLucideIcon(ChevronUp, { size: 16 })}
              </span>
            </div>
            <ul
              class=${cn("overflow-hidden transition-all ml-4", {
                "max-h-0": !isOpen,
                "max-h-screen": isOpen,
              })}
            >
              ${this.renderItems(item.children, level + 1)}
            </ul>
          </li>
        `;
      }

      const isSelected = this.activeKey === item.key;
      return html`
        <li
          class=${cn(
            "flex cursor-pointer items-center whitespace-nowrap h-12 text-sm hover:bg-accent hover:text-primary font-semibold px-6",
            {
              "bg-accent text-primary": isSelected,
            },
          )}
          @click=${() => this.handleItemClick(item.key)}
        >
          ${item.label}
        </li>
      `;
    });
  }

  render() {
    return html`
      <ul class="flex flex-col">
        ${this.renderItems(this.items)}
      </ul>
    `;
  }
}
