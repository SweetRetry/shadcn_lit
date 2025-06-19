import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import TailwindElement from '../components/tailwind-element.ts';

import '../components/ui/button.ts';
import '../components/ui/input.ts';
import '../components/ui/modal.ts';

@customElement('modal-page')
export class ModalPage extends TailwindElement {
    @state()
    private open = false;

    render() {
        return html`
            <div class="p-4 space-y-8">
                <h1 class="text-3xl font-bold">Modal</h1>
                
                <shadcn-lit-button @click=${() => this.open = true}>Open Modal</shadcn-lit-button>

                <shadcn-lit-modal 
                    title="Edit Profile"
                    .open=${this.open}
                    @close=${() => this.open = false}
                >
                    <p class="text-sm text-muted-foreground">
                        Make changes to your profile here. Click save when you're done.
                    </p>
                    <div class="grid gap-4 py-4">
                        <div class="grid grid-cols-4 items-center gap-4">
                            <label for="name" class="text-right">Name</label>
                            <shadcn-lit-input id="name" value="Pedro Duarte" class="col-span-3"></shadcn-lit-input>
                        </div>
                        <div class="grid grid-cols-4 items-center gap-4">
                            <label for="username" class="text-right">Username</label>
                            <shadcn-lit-input id="username" value="@peduarte" class="col-span-3"></shadcn-lit-input>
                        </div>
                    </div>
                    <div slot="footer">
                        <shadcn-lit-button @click=${() => this.open = false}>Save changes</shadcn-lit-button>
                    </div>
                </shadcn-lit-modal>
            </div>
        `;
    }
} 