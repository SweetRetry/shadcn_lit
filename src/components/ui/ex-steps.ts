import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import TailwindElement from "../tailwind-element";

@customElement("ex-steps")
export class ExSteps extends TailwindElement {
  @property()
  current = 0;

  @property({ type: Array })
  steps: Array<{ label: string }> = [];

  render() {
    return html`
      <div>
        <div class="flex h-2 space-x-3">
          ${repeat(
            this.steps,
            (_, index) => index,
            (_, index) => html`
              <div
                style=${`'width':${1 / this.steps.length}`}
                class="${index < this.current
                  ? "bg-primary"
                  : "bg-gray-200"} bg-primary"
              ></div>
            `,
          )}
        </div>

        <p>${this.steps?.[this.current].label}</p>
      </div>
    `;
  }
}
