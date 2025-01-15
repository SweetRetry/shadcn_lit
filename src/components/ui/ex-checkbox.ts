import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import TailwindElement from "../tailwind-element";

@customElement("ex-checkbox")
export class ExCheckbox extends TailwindElement {
  @property({ type: Boolean, reflect: true })
  checked = false;

  @property({ type: Boolean })
  disabled = false;

  onCheckedChange = () => {
    this.checked = !this.checked;
    this.dispatchEvent(new CustomEvent("change"));
  };

  render() {
    return html`
      <div
        class="user-select-none flex cursor-pointer text-sm"
        @click=${this.onCheckedChange}
      >
        <input
          type="checkbox"
          class="h-4 w-4 accent-primary"
          ?checked=${this.checked}
          ?disabled=${this.disabled}
        />
        <label class="ml-2 cursor-pointer">
          <slot> </slot>
        </label>
      </div>
    `;
  }
}
