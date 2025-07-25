
import { cn } from "@/utils/style";
import { cva } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import TailwindElement from "../tailwind-element";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

@customElement("shadcn-lit-button")
export class ShadcnLitButton extends TailwindElement {
  @property({
    type: String,
  })
  size?: "default" | "sm" | "lg" | "icon" = "default";

  @property({ type: Boolean })
  disabled?: boolean = false;

  @property({ type: Boolean })
  loading?: boolean;

  @property({
    type: String,
  })
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link" = "default";

  @property({ type: String })
  class?: string;

  render() {
    return html`
      <button
        class=${cn(
          buttonVariants({
            variant: this.variant,
            size: this.size,
          }),
          this.class,
          this.disabled && "!cursor-not-allowed",
        )}
        ?disabled=${this.disabled || this.loading}
      >
    
        ${this.loading
          ? html`
              <div
                class="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-primary-foreground border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              ></div>
            `
          : nothing}

<slot></slot>
      </button>
    `;
  }
}
