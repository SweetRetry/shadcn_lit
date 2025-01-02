import { html, LitElement, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import { I18nUtil } from "../locales";

@customElement("i18n-provider")
export class I18nProvider extends LitElement {
  protected createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }

  @property({ type: String })
  defaultLang?: string = void 0;

  @property({ type: String })
  resourceUrl?: string = void 0; // 远程语言文件 URL

  constructor() {
    super();
    I18nUtil.init();
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    if (_changedProperties.has("defaultLang") && this.defaultLang) {
      I18nUtil.setLocale(this.defaultLang, this.resourceUrl);
    }
  }

  render() {
    return html` <slot></slot> `;
  }
}
