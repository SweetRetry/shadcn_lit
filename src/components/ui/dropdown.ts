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

@customElement("shadcn-lit-dropdown")
export class ShadcnLitDropdown extends TailwindElement {
  @property({ type: Boolean })
  open = false; // 控制菜單顯示/隱藏
  
  @property({ type: String })
  placement = "bottom"; // 初始放置位置

  @state()
  menuStyles = { top: "-9999px", left: "-9999px" }; // 動態位置樣式

  @query(".shadcn-lit-trigger")
  trigger!: HTMLElement;

  @query(".shadcn-lit-menu")
  menu!: HTMLElement;

  static styles = [
    ...TailwindElement.styles,
    css`
      :host {
        display: inline-block;
        position: relative;
      }

      .shadcn-lit-menu {
        position: absolute;
        opacity: 0;
        transform: scale(0.8);
        transition:
          opacity 0.2s,
          transform 0.2s;
      }

      .shadcn-lit-menu[open] {
        opacity: 1;
        transform: scale(1);
      }

      .shadcn-lit-menu-bottom {
        transform-origin: center top;
      }

      .shadcn-lit-menu-top {
        transform-origin: center bottom;
      }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    this.updateComplete.then(() => {
        if (this.trigger) {
            this.trigger.addEventListener("click", this.toggleMenu);
        }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.trigger) {
        this.trigger.removeEventListener("click", this.toggleMenu);
    }
    document.removeEventListener("click", this.handleOutsideClick);
  }

  private toggleMenu = async (e: Event) => {
    e.stopPropagation();
    this.open = !this.open;

    if (this.open) {
      await this.updateMenuPosition();

      document.addEventListener("click", this.handleOutsideClick);
    } else {
        document.removeEventListener("click", this.handleOutsideClick);
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

    const path = event.composedPath();
    if (path.includes(this.trigger) || path.includes(this.menu)) {
      return;
    }
    this.open = false;
    document.removeEventListener("click", this.handleOutsideClick);
  };

  render() {
    return html`
      <div class="shadcn-lit-trigger cursor-pointer select-none hover:text-primary">
        <slot name="trigger"></slot>
      </div>
      <div
        class=${cn(
          "shadcn-lit-menu z-10 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          `shadcn-lit-menu-${this.placement.split('-')[0]}`,
        )}
        ?open=${this.open}
        style="top: ${this.menuStyles.top}; left: ${this.menuStyles.left};"
      >
        <slot></slot>
      </div>
    `;
  }
}
