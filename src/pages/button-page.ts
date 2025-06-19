import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import TailwindElement from '../components/tailwind-element.ts';

import '../components/ui/button.ts';

@customElement('button-page')
export class ButtonPage extends TailwindElement {
  render() {
    return html`
      <div class="p-4 space-y-8">
        <h1 class="text-3xl font-bold">Button</h1>
        
        <div>
            <h2 class="text-xl font-semibold mb-4">Variants</h2>
            <div class="flex gap-4 items-center flex-wrap">
                <shadcn-lit-button>Default</shadcn-lit-button>
                <shadcn-lit-button variant="destructive">Destructive</shadcn-lit-button>
                <shadcn-lit-button variant="outline">Outline</shadcn-lit-button>
                <shadcn-lit-button variant="secondary">Secondary</shadcn-lit-button>
                <shadcn-lit-button variant="ghost">Ghost</shadcn-lit-button>
                <shadcn-lit-button variant="link">Link</shadcn-lit-button>
            </div>
        </div>

        <div>
            <h2 class="text-xl font-semibold mb-4">Sizes</h2>
            <div class="flex gap-4 items-center flex-wrap">
                <shadcn-lit-button size="sm">Small</shadcn-lit-button>
                <shadcn-lit-button size="default">Default</shadcn-lit-button>
                <shadcn-lit-button size="lg">Large</shadcn-lit-button>
            </div>
        </div>

        <div>
            <h2 class="text-xl font-semibold mb-4">Icon Button</h2>
            <div class="flex gap-4 items-center flex-wrap">
                <shadcn-lit-button size="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M5 12h14"/></svg>
                </shadcn-lit-button>
            </div>
        </div>

        <div>
            <h2 class="text-xl font-semibold mb-4">With Icon</h2>
            <div class="flex gap-4 items-center flex-wrap">
                <shadcn-lit-button>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/></svg>
                    Login with Email
                </shadcn-lit-button>
            </div>
        </div>

        <div>
            <h2 class="text-xl font-semibold mb-4">Loading</h2>
            <div class="flex gap-4 items-center flex-wrap">

                <shadcn-lit-button loading>
                    Loading
                </shadcn-lit-button>
            </div>
        </div>

        <div>
            <h2 class="text-xl font-semibold mb-4">Disabled</h2>
            <div class="flex gap-4 items-center flex-wrap">
                <shadcn-lit-button disabled>Disabled</shadcn-lit-button>
            </div>
        </div>
      </div>
    `;
  }
} 