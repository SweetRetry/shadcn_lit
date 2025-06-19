import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import TailwindElement from './components/tailwind-element.ts';
import './styles/theme.css';

// Dynamically import all pages from the pages directory
import.meta.glob('./pages/*.ts', { eager: true });

const components = [
    'button', 'checkbox', 'dropdown', 'form', 'input', 
    'menu', 'modal', 'select', 'steps', 'table', 'tabs', 'upload'
];

// Simple router
const routes = (location: string) => {
    if (!location) {
        return html`<div>
            <h1 class="text-4xl font-bold">Shadcn Lit</h1>
            <p class="text-muted-foreground mt-2">A Lit component library with a shadcn feel.</p>
            <p class="mt-4">Select a component from the sidebar to view it.</p>
        </div>`;
    }

    if (components.includes(location)) {
        const tagName = `${location}-page`;
        const element = document.createElement(tagName);
        return element;
    }
    
    return html`<h1>404 Not Found</h1><p>Page not found for ${location}</p>`;
}

@customElement('app-root')
export class AppRoot extends TailwindElement {
    @state()
    private _location = window.location.hash.replace(/^#\/?/, '');

    constructor() {
        super();
        window.addEventListener('hashchange', () => {
            this._location = window.location.hash.replace(/^#\/?/, '');
        });
    }

    render() {
        return html`
            <div class="flex h-screen bg-background text-foreground">
                <aside class="w-64 border-r border-border p-4 flex flex-col">
                    <a href="#" @click=${(e: MouseEvent) => {e.preventDefault(); window.location.hash = ''}}>
                        <h2 class="text-lg font-semibold mb-4">Shadcn Lit</h2>
                    </a>
                    <nav class="flex flex-col space-y-1 overflow-y-auto">
                        ${components.map(name => html`
                            <a href="#/${name}" class="capitalize px-2 py-1 rounded-md text-sm hover:bg-accent ${this._location === name ? 'bg-accent font-semibold' : ''}">
                                ${name}
                            </a>
                        `)}
                    </nav>
                </aside>
                <main class="flex-1 p-8 overflow-auto">
                    ${routes(this._location)}
                </main>
            </div>
        `;
    }
} 