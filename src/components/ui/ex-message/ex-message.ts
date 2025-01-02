import TailwindElement from "@/components/tailwind-element";
import { createLucideIcon } from "@/utils/icon";
import { cva } from "class-variance-authority";
import { html, nothing, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { CircleCheck, CircleX, Info } from "lucide";

import { message as exMessage } from "./helper";

export type MessageType = "info" | "success" | "error";

@customElement("ex-message-box")
export class ExMessageBox extends TailwindElement {
  render() {
    return html`<div
      class="pointer-events-none fixed left-0 top-4 z-[100] flex w-full flex-col items-center justify-center gap-2"
    >
      <slot></slot>
    </div>`;
  }
}

const messageVariants = cva(
  "pointer-events-auto w-fit inline-flex items-center rounded border border-border bg-background px-4 py-2 text-sm shadow animate-in fade-in slide-in-from-top",
  {
    variants: {
      type: {
        info: "text-foreground",
        success: "text-primary",
        error: "text-destructive",
      },
    },
    defaultVariants: {
      type: "info",
    },
  },
);

@customElement("ex-message")
export class ExMessage extends TailwindElement {
  @property()
  id = "";

  @property()
  duration = 3000;

  @property()
  message?: string | TemplateResult = "";

  @property()
  type: MessageType = "info";

  connectedCallback() {
    super.connectedCallback();
    this.duration !== 0 && this.autoRemove();
  }

  protected autoRemove() {
    setTimeout(() => {
      exMessage.remove(this.id);
    }, this.duration);
  }

  private renderIcon = () => {
    switch (this.type) {
      case "info":
        return createLucideIcon(Info);
      case "success":
        return createLucideIcon(CircleCheck);
      case "error":
        return createLucideIcon(CircleX);
      default:
        return nothing;
    }
  };

  render() {
    return html`
      <div class=${messageVariants({ type: this.type })} id=${this.id}>
        ${this.renderIcon()}
        <span class="ml-2"> ${this.message} </span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ex-message-box": ExMessageBox;
    "ex-message": ExMessage;
  }
}
