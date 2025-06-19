import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import TailwindElement from '../components/tailwind-element.ts';

import '../components/ui/checkbox.ts';

@customElement('checkbox-page')
export class CheckboxPage extends TailwindElement {
  render() {
    return html`
      <div class="p-4 space-y-8">
        <h1 class="text-3xl font-bold">Checkbox</h1>
        
        <div class="flex items-center space-x-2">
            <shadcn-lit-checkbox id="terms"></shadcn-lit-checkbox>
            <label
                for="terms"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                Accept terms and conditions
            </label>
        </div>

      </div>
    `;
  }
} 