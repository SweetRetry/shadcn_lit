import { cn } from "@/utils/style";
import {
  Placement,
  computePosition,
  flip,
  offset,
  shift,
} from "@floating-ui/dom";
import { consume, createContext, provide } from "@lit/context";
import { PropertyValueMap, html } from "lit";
import {
  customElement,
  property,
  queryAssignedElements,
  state,
} from "lit/decorators.js";
import TailwindElement from "../tailwind-element";

// Context
interface SelectContext {
  value: string | number;
  setValue: (value: string | number) => void;
}

const selectContext = createContext<SelectContext>(Symbol("select-context"));

@customElement("shadcn-lit-select")
export class ShadcnLitSelect extends TailwindElement {
  @provide({ context: selectContext })
  private context: SelectContext;

  @queryAssignedElements({ slot: "trigger", flatten: true })
  private triggerElements!: HTMLElement[];
  private get trigger() {
    return this.triggerElements?.[0];
  }

  @queryAssignedElements({ slot: "content", flatten: true })
  private contentElements!: HTMLElement[];
  private get content() {
    return this.contentElements?.[0] as ShadcnLitSelectContent | undefined;
  }

  constructor() {
    super();
    this.context = {
      value: this.value,
      setValue: this.setValue.bind(this),
    };
  }

  protected willUpdate(
    changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has("value")) {
      this.context = {
        ...this.context,
        value: this.value,
      };
    }
  }

  firstUpdated() {
    if (this.trigger) {
      this.trigger.addEventListener("click", this.toggleOpen.bind(this));
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.trigger) {
      this.trigger.removeEventListener("click", this.toggleOpen.bind(this));
    }
    document.removeEventListener("click", this.handleOutsideClick);
  }

  @property({ type: String })
  value: string | number = "";

  @property({ type: String })
  placement: Placement = "bottom-start";

  @state()
  private open = false;

  private setValue(value: string | number) {
    this.value = value;
    this.open = false; // Close on select
    if (this.content) {
      this.content.open = false;
    }
    this.dispatchEvent(new CustomEvent("change", { detail: { value } }));
  }

  private async toggleOpen(e: Event) {
    e.stopPropagation();
    this.open = !this.open;
    if (this.content) {
      this.content.open = this.open;
    }

    if (this.open) {
      await this.updatePosition();
      document.addEventListener("click", this.handleOutsideClick);
    } else {
      document.removeEventListener("click", this.handleOutsideClick);
    }
  }

  private handleOutsideClick = (event: MouseEvent) => {
    if (!this.open) return;
    const path = event.composedPath();
    if (
      (this.trigger && path.includes(this.trigger)) ||
      (this.content && path.includes(this.content))
    ) {
      return;
    }
    this.open = false;
    if (this.content) {
      this.content.open = false;
    }
    document.removeEventListener("click", this.handleOutsideClick);
  };

  private async updatePosition() {
    if (!this.trigger || !this.content) return;
    
    // 等待下一帧确保DOM已经更新
    await new Promise(resolve => requestAnimationFrame(resolve));
    
    const { x, y } = await computePosition(this.trigger, this.content, {
      placement: this.placement,
      middleware: [offset(4), flip(), shift({ padding: 8 })],
    });

    // 设置菜单宽度与trigger一致
    const triggerWidth = this.trigger.getBoundingClientRect().width;

    Object.assign(this.content.style, {
      position: `absolute`,
      left: `${x}px`,
      top: `${y}px`,
      width: `${triggerWidth}px`,
      minWidth: `${triggerWidth}px`, // 覆盖min-w-[8rem]
    });
  }

  render() {
    return html`
      <slot name="trigger"></slot>
      <slot name="content"></slot>
    `;
  }
}

// Trigger
@customElement("shadcn-lit-select-trigger")
export class ShadcnLitSelectTrigger extends TailwindElement {
  render() {
    return html`
      <div
        class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <slot></slot>
        <svg
          class="h-4 w-4 opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    `;
  }
}

// Content
@customElement("shadcn-lit-select-content")
export class ShadcnLitSelectContent extends TailwindElement {
  @property({ type: Boolean, reflect: true })
  open = false;

  render() {
    return html`
      <style>
        :host {
          display: block;
        }
        .content-wrapper {
          width: inherit;
          min-width: inherit;
        }
      </style>
      <div
        class=${cn(
          "content-wrapper fixed z-50 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md transition-all duration-200 ease-in-out",
          this.open 
            ? "opacity-100 scale-100" 
            : "opacity-0 scale-95 pointer-events-none"
        )}
        style="box-sizing: border-box;"
      >
        <div class="p-1 w-full overflow-hidden">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

// Item
@customElement("shadcn-lit-select-item")
export class ShadcnLitSelectItem extends TailwindElement {
  @consume({ context: selectContext, subscribe: true })
  private context!: SelectContext;

  @property({ type: String })
  value: string | number = "";

  render() {
    return html`
      <div
        @click=${() => this.context.setValue(this.value)}
        class=${cn(
          "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          { "font-semibold": this.context.value === this.value }
        )}
        style="box-sizing: border-box; max-width: 100%; overflow: hidden;"
      >
        ${this.context.value === this.value
          ? html`<span
              class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center flex-shrink-0"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-4 w-4"
              >
                <polyline points="20 6 9 17 5 12" />
              </svg>
            </span>`
          : ""}
        <span class="truncate"><slot></slot></span>
      </div>
    `;
  }
}

// Label
@customElement("shadcn-lit-select-label")
export class ShadcnLitSelectLabel extends TailwindElement {
  render() {
    return html`<div 
      class="py-1.5 pl-8 pr-2 text-sm font-semibold"
      style="box-sizing: border-box; max-width: 100%; overflow: hidden;"
    >
      <span class="truncate block"><slot></slot></span>
    </div>`;
  }
}

// Separator
@customElement("shadcn-lit-select-separator")
export class ShadcnLitSelectSeparator extends TailwindElement {
  render() {
    return html`<div class="-mx-1 my-1 h-px bg-muted"></div>`;
  }
}
