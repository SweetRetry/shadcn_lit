import { html } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import TailwindElement from "../tailwind-element";

interface UploadedFile {
    file: File;
    previewUrl: string;
}

@customElement("shadcn-lit-upload")
export class ShadcnLitUpload extends TailwindElement {
    @state()
    private files: UploadedFile[] = [];

    @query("#dropzone-file")
    private fileInput!: HTMLInputElement;

    private handleFileChange(e: Event) {
        const input = e.target as HTMLInputElement;
        if (input.files) {
            this.addFiles(Array.from(input.files));
        }
    }
    
    private addFiles(newFiles: File[]) {
        const toAdd = newFiles.map(file => ({
            file,
            previewUrl: URL.createObjectURL(file)
        }));
        this.files = [...this.files, ...toAdd];
    }
    
    private removeFile(fileToRemove: UploadedFile) {
        this.files = this.files.filter(f => f !== fileToRemove);
        URL.revokeObjectURL(fileToRemove.previewUrl);
    }
    
    private handleDragOver(e: DragEvent) {
        e.preventDefault();
    }
    
    private handleDrop(e: DragEvent) {
        e.preventDefault();
        if (e.dataTransfer?.files) {
            this.addFiles(Array.from(e.dataTransfer.files));
        }
    }

    render() {
        return html`
            <div class="space-y-4">
                <div 
                    @dragover=${this.handleDragOver}
                    @drop=${this.handleDrop}
                    @click=${() => this.fileInput.click()}
                    class="flex items-center justify-center w-full">
                    <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50">
                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg class="w-8 h-8 mb-4 text-muted-foreground" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p class="mb-2 text-sm text-muted-foreground"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                            <p class="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <input id="dropzone-file" type="file" class="hidden" @change=${this.handleFileChange} multiple />
                    </label>
                </div> 

                ${this.files.length > 0 ? html`
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        ${this.files.map(f => html`
                            <div class="relative group">
                                <img src=${f.previewUrl} alt=${f.file.name} class="h-auto max-w-full rounded-lg" />
                                <div @click=${() => this.removeFile(f)} class="absolute top-1 right-1 cursor-pointer opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1">
                                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </div>
                            </div>
                        `)}
                    </div>
                ` : ''}
            </div>
        `;
    }
}
