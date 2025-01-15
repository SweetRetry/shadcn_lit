import { cn } from "@/utils/style";
import { consume } from "@lit/context";
import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import TailwindElement from "../tailwind-element";
import { formContext, FormContextProvide } from "./ex-form/context";

@customElement("ex-input")
export class ExInput extends TailwindElement {
  @consume({ context: formContext })
  formContext?: FormContextProvide;

  @property()
  name?: string;

  @property({ type: String })
  placeholder?: string;

  @property()
  type?: string = "text";

  @property({ type: Boolean })
  disabled: boolean = false;

  @property({ type: String })
  value = "";

  @state()
  hasPrefix = false;
  @state()
  hasSuffix = false;

  firstUpdated() {
    this.shadowRoot?.addEventListener("slotchange", () => {
      const slots = this.shadowRoot?.querySelectorAll(`slot`);
      slots?.forEach((item) => {
        if (item.assignedNodes().length > 0) {
          if (item.name === "prefix") this.hasPrefix = true;
          if (item.name === "suffix") this.hasSuffix = true;
        }
      });
    });
  }

  async handleChange(e: Event) {
    if (this.disabled) return;
    const _value = (e.target as HTMLInputElement).value;
    this.value = _value;
    if (this.name) this.formContext?.setFieldValue(this.name, _value);
    this.dispatchEvent(new CustomEvent("change"));
  }

  render() {
    return html` <div class="relative flex flex-col">
      <span class="absolute left-4 top-0 inline-flex h-full items-center">
        <slot name="prefix"></slot>
      </span>
      <input
        ?disabled=${this.disabled}
        type=${this.type}
        .value=${this.value}
        placeholder=${this.placeholder}
        @input=${this.handleChange}
        class=${cn(
          "border-[hsl(var(--ex-input-border-color))] flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-none",
          {
            "pl-10": this.hasPrefix,
            "pr-10": this.hasSuffix,
          },
        )}
      />
      <span class="absolute right-4 top-0 inline-flex h-full items-center">
        <slot name="suffix"></slot>
      </span>
    </div>`;
  }
}
