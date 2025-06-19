import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import TailwindElement from '../components/tailwind-element.ts';

import '../components/ui/button.ts';
import '../components/ui/dropdown.ts';

@customElement('dropdown-page')
export class DropdownPage extends TailwindElement {
  render() {
    return html`
      <div class="p-4 space-y-8">
        <h1 class="text-3xl font-bold">Dropdown Menu</h1>
        
        <shadcn-lit-dropdown>
            <shadcn-lit-button slot="trigger" variant="outline">Open</shadcn-lit-button>
            <div class="flex flex-col p-2">
                <a href="#" class="px-2 py-1.5 text-sm rounded-sm hover:bg-accent">Profile</a>
                <a href="#" class="px-2 py-1.5 text-sm rounded-sm hover:bg-accent">Billing</a>
                <a href="#" class="px-2 py-1.5 text-sm rounded-sm hover:bg-accent">Settings</a>
                <a href="#" class="px-2 py-1.5 text-sm rounded-sm hover:bg-accent">Log out</a>
            </div>
        </shadcn-lit-dropdown>

      </div>
    `;
  }
} 