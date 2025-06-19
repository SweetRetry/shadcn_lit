import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import TailwindElement from '../components/tailwind-element.ts';

import '../components/ui/button.ts';
import '../components/ui/form/form.ts';
import '../components/ui/input.ts';

@customElement('form-page')
export class FormPage extends TailwindElement {

    private rules = {
        email: [
            { type: 'required', message: 'Email is required' },
            { type: 'email', message: 'Invalid email address' },
        ],
    };

    private handleSubmit(e: CustomEvent) {
        console.log('Form submitted:', e.detail.values);
        alert('Form submitted! Check the console for values.');
    }

    render() {
        return html`
            <div class="p-4 space-y-8 max-w-md">
                <h1 class="text-3xl font-bold">Form</h1>
                
                <shadcn-lit-form .rules=${this.rules} @submit=${this.handleSubmit}>
                    <shadcn-lit-form-item name="email" label="Email">
                        <shadcn-lit-input type="email" placeholder="m@example.com"></shadcn-lit-input>
                    </shadcn-lit-form-item>
                    
                    <shadcn-lit-button type="submit" class="mt-4">Submit</shadcn-lit-button>
                </shadcn-lit-form>
            </div>
        `;
    }
} 