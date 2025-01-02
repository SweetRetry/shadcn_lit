import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import TailwindElement from "../tailwind-element";

@customElement("ex-checkbox")
export class ExCheckbox extends TailwindElement {
  @property({ type: Boolean, reflect: true })
  checked = false;

  @property({ type: Boolean })
  disabled = false;

  @property({ type: String })
  label = "";

  onCheckedChange = () => {
    this.checked = !this.checked;
    this.dispatchEvent(new CustomEvent("change"));
  };

  render() {
    return html`
      <label class="flex cursor-pointer items-center text-sm">
        <input
          type="checkbox"
          class="h-4 w-4 accent-primary"
          ?checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${this.onCheckedChange}
        />
        <span class="ml-2">
          <slot>${this.label} </slot>
        </span>
      </label>
    `;
  }
}
