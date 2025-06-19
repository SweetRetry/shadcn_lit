import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import TailwindElement from '../components/tailwind-element.ts';

import '../components/ui/input.ts';

@customElement('input-page')
export class InputPage extends TailwindElement {
  render() {
    return html`
      <div class="p-4 space-y-8 max-w-md">
        <h1 class="text-3xl font-bold">Input</h1>
        <shadcn-lit-input type="email" placeholder="Email"></shadcn-lit-input>
      </div>
    `;
  }
} 