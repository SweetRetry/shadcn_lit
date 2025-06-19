import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import TailwindElement from '../components/tailwind-element.ts';

import '../components/ui/menu.ts';

@customElement('menu-page')
export class MenuPage extends TailwindElement {
  render() {
    return html`
      <div class="p-4 space-y-8">
        <h1 class="text-3xl font-bold">Menu</h1>
        
        <shadcn-lit-menu>
            <shadcn-lit-menu-item>New Tab</shadcn-lit-menu-item>
            <shadcn-lit-menu-item>New Window</shadcn-lit-menu-item>
            <hr/>
            <shadcn-lit-menu-item>Print</shadcn-lit-menu-item>
            <shadcn-lit-menu-item>Help</shadcn-lit-menu-item>
        </shadcn-lit-menu>

      </div>
    `;
  }
} 