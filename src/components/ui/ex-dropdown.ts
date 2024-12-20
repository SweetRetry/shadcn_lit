import { cn } from "@/utils/style";
import {
  computePosition,
  flip,
  offset,
  Placement,
  shift,
} from "@floating-ui/dom";
import { css, html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import TailwindElement from "../tailwind-element";

@customElement("ex-dropdown")
export class ExDropdownMenu extends TailwindElement {
  @property({ type: Boolean }) open = false; // 控制菜單顯示/隱藏
  @property({ type: String }) placement = "bottom"; // 初始放置位置
  @state() private menuStyles = { top: "-9999px", left: "-9999px" }; // 動態位置樣式

  // TODO:可悬浮打开
  // @property({ type: Boolean }) hoverable = false;

  @query(".ex-trigger") trigger!: HTMLElement;
  @query(".ex-menu") menu!: HTMLElement;

  static styles = [
    ...TailwindElement.styles,
    css`
      :host {
        display: inline-block;
        position: relative;
      }

      .ex-menu {
        position: absolute;

        visibility: hidden;
        opacity: 0;
        transform: scale(0.8);
        transition:
          opacity 0.2s,
          transform 0.2s;
      }

      .ex-menu[open="true"] {
        visibility: visible;
        opacity: 1;
        transform: scale(1);
      }

      .ex-menu-bottom {
        transform-origin: center top;
      }

      .ex-menu-top {
        transform-origin: center bottom;
      }
    `,
  ];

  firstUpdated() {
    if (this.trigger) {
      this.trigger.addEventListener("click", this.toggleMenu);
    }
  }

  private toggleMenu = async (e: Event) => {
    e.stopPropagation();
    this.open = !this.open;

    if (this.open) {
      await this.updateMenuPosition();

      document.addEventListener("click", this.handleOutsideClick, {
        once: true,
      });
    }
  };

  private async updateMenuPosition() {
    if (!this.trigger || !this.menu) return;

    const { x, y, placement } = await computePosition(this.trigger, this.menu, {
      middleware: [offset(10), flip(), shift()],
      placement: this.placement as Placement,
    });
    this.placement = placement;

    this.menuStyles = { top: `${y}px`, left: `${x}px` };
  }

  private handleOutsideClick = (event: MouseEvent) => {
    if (!this.open) return;

    const target = event.target as Node;
    if (this.trigger?.contains(target) || this.menu?.contains(target)) {
      return;
    }
    this.open = false;

    document.removeEventListener("click", this.handleOutsideClick);
  };

  render() {
    return html`
      <div class="ex-trigger cursor-pointer select-none hover:text-primary">
        <slot name="trigger"></slot>
      </div>
      <div
        class=${cn(
          "ex-menu z-10 bg-background border shadow border-border rounded",
          `ex-menu-${this.placement}`,
        )}
        open=${this.open}
        style="top: ${this.menuStyles.top}; left: ${this.menuStyles.left};"
      >
        <slot></slot>
      </div>
    `;
  }
}
