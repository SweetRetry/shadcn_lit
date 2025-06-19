import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import TailwindElement from '../components/tailwind-element.ts';

import '../components/ui/select.ts';

@customElement('select-page')
export class SelectPage extends TailwindElement {
    @state()
    private value = "apple";

    private fruits = [
        { value: "apple", label: "Apple" },
        { value: "banana", label: "Banana" },
        { value: "blueberry", label: "Blueberry" },
        { value: "grapes", label: "Grapes" },
        { value: "pineapple", label: "Pineapple" },
    ];

    render() {
        return html`
            <div class="p-4 space-y-8 max-w-xs">
                <h1 class="text-3xl font-bold">Select</h1>
                
                <shadcn-lit-select .value=${this.value} @change=${(e: CustomEvent) => this.value = e.detail.value}>
                    <shadcn-lit-select-trigger slot="trigger">
                        <span>${this.fruits.find(f => f.value === this.value)?.label || 'Select a fruit'}</span>
                    </shadcn-lit-select-trigger>
                    <shadcn-lit-select-content slot="content">
                        <shadcn-lit-select-label>Fruits</shadcn-lit-select-label>
                        ${this.fruits.map(fruit => html`
                            <shadcn-lit-select-item .value=${fruit.value}>${fruit.label}</shadcn-lit-select-item>
                        `)}
                        <shadcn-lit-select-separator></shadcn-lit-select-separator>
                        <shadcn-lit-select-label>Vegetables</shadcn-lit-select-label>
                        <shadcn-lit-select-item value="carrot">Carrot</shadcn-lit-select-item>
                    </shadcn-lit-select-content>
                </shadcn-lit-select>

                <p>Selected value: <span class="font-bold">${this.value}</span></p>
            </div>
        `;
    }
} 