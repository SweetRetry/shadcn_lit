import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import TailwindElement from '../components/tailwind-element.ts';

import '../components/ui/button.ts';
import '../components/ui/steps.ts';

@customElement('steps-page')
export class StepsPage extends TailwindElement {
    @state()
    private currentStep = 0;

    private steps = [
        "Create account",
        "Verify email",
        "Done",
    ];

    private nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
        }
    }

    private prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
        }
    }

    render() {
        return html`
            <div class="p-4 space-y-8 max-w-md">
                <h1 class="text-3xl font-bold">Steps</h1>
                
                <shadcn-lit-steps .currentStep=${this.currentStep}>
                    <shadcn-lit-step-item .step=${0}>Create account</shadcn-lit-step-item>
                    <shadcn-lit-steps-separator></shadcn-lit-steps-separator>
                    <shadcn-lit-step-item .step=${1}>Verify email</shadcn-lit-step-item>
                    <shadcn-lit-steps-separator></shadcn-lit-steps-separator>
                    <shadcn-lit-step-item .step=${2}>Done!</shadcn-lit-step-item>
                </shadcn-lit-steps>

                <div class="mt-8 pt-4 border-t">
                    <p class="text-lg font-semibold mb-4">Current Step: ${this.steps[this.currentStep]}</p>
                    <div class="flex gap-4">
                        <shadcn-lit-button @click=${this.prevStep} ?disabled=${this.currentStep === 0}>Previous</shadcn-lit-button>
                        <shadcn-lit-button @click=${this.nextStep} ?disabled=${this.currentStep === this.steps.length - 1}>Next</shadcn-lit-button>
                    </div>
                </div>
            </div>
        `;
    }
} 