import { cn } from "@/utils/style";
import {
  computePosition,
  flip,
  offset,
  Placement,
  shift,
} from "@floating-ui/dom";
import "@lit-labs/virtualizer";
import { consume } from "@lit/context";
import { html, TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import TailwindElement from "../tailwind-element";

import { createLucideIcon } from "@/utils/icon";
import { ChevronDown, ChevronUp } from "lucide";
import { formContext, FormContextProvide } from "./ex-form/context";

@customElement("ex-select")
export class ExSelect extends TailwindElement {
  @property({ type: Array }) options: {
    label: string;
    value: string | number;
  }[] = []; // 选项数组

  @property({ type: Boolean })
  autoFillAllOption = false;

  @property()
  value?: string | number = ""; // 当前选中的值

  @state()
  open: boolean = false; // 下拉框是否打开

  @property()
  placeholder?: string = "";

  @property({ type: Function })
  renderItem?: (option: {
    label: string;
    value: string | number;
  }) => TemplateResult;

  @property({ type: Function })
  labelRender?: (option: {
    label: string;
    value: string | number;
  }) => TemplateResult;

  @consume({ context: formContext })
  formContext?: FormContextProvide;

  @property()
  name?: string;

  @property({ type: Boolean })
  disabled = false;

  @property()
  placement?: "bottom" | "top" = "bottom";

  @state() private menuStyles = {
    top: "-9999px",
    left: "-9999px",
    height: "0px",
  }; // 動態位置樣式

  @query(".ex-select-trigger") trigger!: HTMLElement;
  @query(".ex-select-menu") menu!: HTMLElement;

  // 切换下拉框的开关状态
  private async updateMenuPosition() {
    if (!this.trigger || !this.menu) return;

    const { x, y, placement } = await computePosition(this.trigger, this.menu, {
      middleware: [
        offset(),
        flip({
          fallbackPlacements: ["top", "bottom"],
        }),
        shift(),
      ],
      placement: this.placement as Placement,
    });
    this.placement = placement as "top" | "bottom";

    this.menuStyles = {
      ...this.menuStyles,
      top: `${y}px`,
      left: `${x}px`,
    };
  }

  private toggleOptions = async () => {
    this.dispatchEvent(new CustomEvent("click"));
    if (this.disabled) return;
    this.open = !this.open;
    if (this.open) {
      await this.updateMenuPosition();

      requestAnimationFrame(() => {
        document.addEventListener("click", this.handleOutsideClick, {
          once: true,
        });
      });
    }
    this.menuStyles = {
      ...this.menuStyles,
      height: `${this.open ? (Math.min(this.options.length, 6) + (this.autoFillAllOption ? 1 : 0)) * 40 : 0}px`,
    };
  };

  private handleOutsideClick = (event: MouseEvent) => {
    if (!this.open) return;

    const target = event.target as Node;
    if (this.trigger?.contains(target) || this.menu?.contains(target)) {
      return;
    }
    this.open = false;

    document.removeEventListener("click", this.handleOutsideClick);
  };

  selectOption = (option: { label: string; value: string | number }) => {
    if (this.value === option.value) return;

    this.value = option.value;

    this.open = false;
    if (this.name) this.formContext?.setFieldValue(this.name, option.value);

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          value: option.value,
          option,
        },
      }),
    );
  };

  _renderItem = (option: { label: string; value: string }) => {
    return html`
      <li
        class=${cn(
          "px-3 py-2 hover:bg-secondary cursor-pointer hover:text-secondary-foreground w-full list-none select-none text-sm h-[40px] flex items-center",
          this.value === option.value && "!bg-primary !text-primary-foreground",
        )}
        @click="${() => this.selectOption(option)}"
      >
        ${this.renderItem
          ? this.renderItem(option)
          : this.labelRender
            ? this.labelRender(option)
            : option.label}
      </li>
    `;
  };

  render() {
    const options = this.autoFillAllOption
      ? [
          {
            label: "All",
            value: "",
          },
          ...this.options,
        ]
      : this.options;

    const selectedOption = options.find(
      (option) => option.value === this.value,
    );

    return html`
      <div class="relative">
        <div
          class="ex-select-trigger [& > span]:line-clamp-1 flex h-10 w-full cursor-pointer select-none items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors placeholder:text-muted-foreground hover:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          @click="${this.toggleOptions}"
        >
          <span>
            ${selectedOption
              ? this.labelRender
                ? this.labelRender(selectedOption)
                : selectedOption?.label
              : html`<span class="text-[#808080]">${this.placeholder}</span>`}
          </span>

          <span class="text-[#808080]">
            ${this.open
              ? createLucideIcon(ChevronUp)
              : createLucideIcon(ChevronDown)}
          </span>
        </div>

        <div
          class=${cn(
            "ex-select-menu absolute z-10 w-full overflow-y-auto bg-background duration-150 ease-in-out border border-border rounder",
            this.open ? "opacity-100" : "opacity-0 !h-[0px]",
            this.placement === "bottom" ? "origin-top " : "origin-bottom ",
          )}
          style="top: ${this.menuStyles.top};
           left: ${this.menuStyles.left};
           height: ${this.menuStyles.height};
           transition-property: height, opacity;"
        >
          <lit-virtualizer .items=${options} .renderItem=${this._renderItem}>
          </lit-virtualizer>
        </div>
      </div>
    `;
  }
}
