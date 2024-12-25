import "@/components/ui/ex-button";
import { ScreenController } from "@/controllers/screen-controller";
import { cn } from "@/utils/style";
import { html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import TailwindElement from "../tailwind-element";

@customElement("ex-modal")
export class ExModal extends TailwindElement {
  screenController = new ScreenController(this);
  @property({ type: String })
  title = "";

  @property({ type: Boolean })
  open = false;

  @property({ type: Boolean })
  closeOnMaskClick = true;

  @state()
  closing = false;

  @property()
  width? = 520;

  @query(".mask") mask!: HTMLDivElement;
  @query(".modal-content") modalContent!: HTMLDivElement;

  show() {
    this.closing = false;
    this.open = true;
  }

  close = () => {
    this.closing = true;
    this.mask.addEventListener(
      "animationend",
      () => {
        this.closing = false;
        this.open = false;
        this.dispatchEvent(new CustomEvent("afterClose"));
      },
      { once: true },
    );
  };

  connectedCallback(): void {
    super.connectedCallback();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  render() {
    if (this.screenController.isMobile) {
      return html`<div
        @click=${this.closeOnMaskClick ? this.close : null}
        class=${cn(
          "mask fixed inset-0 z-50 flex items-end justify-center bg-black/80",
          this.closing ? "animate-out  fade-out-0" : "animate-in  fade-in-0 ",
          {
            hidden: !this.open && !this.closing,
          },
        )}
      >
        <div
          class=${cn(
            "relative w-full rounded-t-lg bg-white",
            this.closing
              ? "animate-out slide-out-to-bottom fade-out-0"
              : "animate-in slide-in-from-bottom fade-in-0",
          )}
          @click=${(e: MouseEvent) => e.stopPropagation()}
        >
          <header class="flex items-center justify-between px-4 py-3">
            <h2 class="text-lg font-bold">${this.title}</h2>

            <ex-button
              @click=${() => (this.open = false)}
              variant="ghost"
            >
              <span class="text-lg">x</span>
            </ex-button>
          </header>

          <div class="p-4 pt-0">
            <slot></slot>
          </div>

          <footer class="mt-2">
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>`;
    }

    return html` <div
      @click=${this.closeOnMaskClick ? this.close : null}
      class=${cn(
        "mask fixed inset-0 z-50 flex items-center justify-center bg-black/80",
        this.closing ? "animate-out  fade-out-0 " : "animate-in  fade-in-0 ",
        {
          hidden: !this.open && !this.closing,
        },
      )}
    >
      <div
        class=${cn(
          "relative w-full rounded-lg border border-border bg-background px-6 py-5 border border-border",
          this.closing
            ? "animate-out zoom-out-95 fade-out-0 "
            : "animate-in zoom-in-95 fade-in-0 ",
        )}
        @click=${(e: Event) => e.stopPropagation()}
        style="width: ${this.width}px"
      >
        <header class="mb-2 flex items-center justify-between">
          <h2 class="text-lg font-bold">${this.title}</h2>

          <ex-button
            @click=${() => (this.open = false)}
            variant="ghost"
          >
            <span class="text-lg">x</span>
          </ex-button>
        </header>

        <slot></slot>

        <footer class="mt-2 flex justify-end gap-4">
          <slot name="footer"></slot>
        </footer>
      </div>
    </div>`;
  }
}
