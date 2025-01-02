import "@/components/ui/ex-button";
import { html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import TailwindElement from "../tailwind-element";

@customElement("ex-upload")
export class ExUpload extends TailwindElement {
  @property({ type: Array })
  fileList: { file: File; previewUrl: string; fileId: string }[] = [];

  // 通过查询选择文件输入框
  @query('input[type="file"]') fileInput!: HTMLInputElement;

  // 处理文件选择
  private handleFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;

    if (files) {
      const newFiles = Array.from(files).map((file) => ({
        file,
        fileId: crypto.randomUUID(),
        previewUrl: URL.createObjectURL(file),
      }));
      this.fileList = [...this.fileList, ...newFiles];
    }
  }

  // 删除文件
  private handleRemoveFile(fileToRemove: File) {
    this.fileList = this.fileList.filter(
      (file) => file.file.name !== fileToRemove.name,
    );
  }

  // 触发文件选择
  private handleClick() {
    this.fileInput.click();
  }

  private renderFileList() {
    if (this.fileList.length)
      return html`<ul class="mt-4 space-y-3">
        ${this.fileList.map(
          ({ file, previewUrl, fileId }) => html`
            <li class="flex items-center justify-between" key="${fileId}">
              <div class="flex items-center space-x-3">
                <img src="${previewUrl}" />
                <label>${file.name}</label>
              </div>
              <ex-button
                @click="${() => this.handleRemoveFile(file)}"
                type="text"
              >
                删除
              </ex-button>
            </li>
          `,
        )}
      </ul>`;
  }

  render() {
    return html`
      <div>
        <!-- 自定义上传按钮 -->
        <ex-button @click="${this.handleClick}" disabled=${false}>
          上传 +
        </ex-button>

        <!-- 隐藏的文件输入框 -->
        <input type="file" class="hidden" @change="${this.handleFileChange}" />

        ${this.renderFileList()}
      </div>
    `;
  }
}
