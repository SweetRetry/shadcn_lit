import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import TailwindElement from '../components/tailwind-element.ts';

import '../components/ui/upload.ts';

@customElement('upload-page')
export class UploadPage extends TailwindElement {
  render() {
    return html`
      <div class="p-4 space-y-8 max-w-xl">
        <h1 class="text-3xl font-bold">Upload</h1>
        <shadcn-lit-upload></shadcn-lit-upload>
      </div>
    `;
  }
} 