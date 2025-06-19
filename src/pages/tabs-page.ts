import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import TailwindElement from '../components/tailwind-element.ts';

import '../components/ui/button.ts';
import '../components/ui/input.ts';
import '../components/ui/tabs.ts';

@customElement('tabs-page')
export class TabsPage extends TailwindElement {
    render() {
        return html`
            <div class="p-4 space-y-8 max-w-md">
                <h1 class="text-3xl font-bold">Tabs</h1>
                
                <shadcn-lit-tabs defaultValue="account">
                    <shadcn-lit-tabs-list>
                        <shadcn-lit-tabs-trigger value="account">Account</shadcn-lit-tabs-trigger>
                        <shadcn-lit-tabs-trigger value="password">Password</shadcn-lit-tabs-trigger>
                    </shadcn-lit-tabs-list>
                    <shadcn-lit-tabs-content value="account">
                        <div class="p-4 border rounded-md mt-2">
                            <p class="text-sm text-muted-foreground">Make changes to your account here. Click save when you're done.</p>
                            <div class="space-y-4 py-4">
                                <div class="space-y-2">
                                    <label for="name">Name</label>
                                    <shadcn-lit-input id="name" value="Pedro Duarte"></shadcn-lit-input>
                                </div>
                                <div class="space-y-2">
                                    <label for="username">Username</label>
                                    <shadcn-lit-input id="username" value="@peduarte"></shadcn-lit-input>
                                </div>
                            </div>
                            <shadcn-lit-button>Save changes</shadcn-lit-button>
                        </div>
                    </shadcn-lit-tabs-content>
                    <shadcn-lit-tabs-content value="password">
                        <div class="p-4 border rounded-md mt-2">
                            <p class="text-sm text-muted-foreground">Change your password here. After saving, you'll be logged out.</p>
                             <div class="space-y-4 py-4">
                                <div class="space-y-2">
                                    <label for="current-password">Current password</label>
                                    <shadcn-lit-input id="current-password" type="password"></shadcn-lit-input>
                                </div>
                                <div class="space-y-2">
                                    <label for="new-password">New password</label>
                                    <shadcn-lit-input id="new-password" type="password"></shadcn-lit-input>
                                </div>
                            </div>
                            <shadcn-lit-button>Save password</shadcn-lit-button>
                        </div>
                    </shadcn-lit-tabs-content>
                </shadcn-lit-tabs>

            </div>
        `;
    }
} 