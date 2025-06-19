import { cn } from "@/utils/style";
import { consume, createContext } from "@lit/context";
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import TailwindElement from "../tailwind-element";

// Context
interface StepsContext {
  currentStep: number;
}

const stepsContext = createContext<StepsContext>(Symbol("steps-context"));

@customElement("shadcn-lit-steps")
export class ShadcnLitSteps extends LitElement {

  @property({ type: Number })
  set currentStep(value: number) {
      this._currentStep = value;
  }
  get currentStep(): number {
      return this._currentStep;
  }
  private _currentStep = 0;

  render() {
    return html`<div class="flex items-center gap-4"><slot></slot></div>`;
  }
}

@customElement("shadcn-lit-step-item")
export class ShadcnLitStepItem extends TailwindElement {
  @consume({ context: stepsContext })
  private context!: StepsContext;

  @property({ type: Number })
  step = 0;

  render() {
    const isActive = this.step === this.context.currentStep;
    const isCompleted = this.step < this.context.currentStep;

    return html`
      <div class="flex items-center gap-2">
        <div
          class=${cn(
            "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
            isActive && "bg-primary text-primary-foreground",
            isCompleted && "bg-secondary text-secondary-foreground",
            !isActive && !isCompleted && "bg-muted text-muted-foreground",
          )}
        >
          ${isCompleted ? html`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M20 6 9 17l-5-5"/></svg>
          ` : this.step + 1}
        </div>
        <div class="text-sm font-medium"><slot></slot></div>
      </div>
    `;
  }
}

@customElement("shadcn-lit-steps-separator")
export class ShadcnLitStepsSeparator extends TailwindElement {
    render() {
        return html`<div class="h-px flex-1 bg-border"></div>`
    }
}
