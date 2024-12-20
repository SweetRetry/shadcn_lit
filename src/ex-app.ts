import TailwindElement from "@/components/tailwind-element";
import "@/components/ui/ex-button";
import "@/components/ui/ex-dropdown";
import "@/components/ui/ex-menu";
import "@/components/ui/ex-spinner";
import "@/providers/i18n-provider";
import "@/providers/theme-provider";
import "@/providers/user-provider";

import { EX_MODULE_ENUM, loadExModule } from "@/utils/module";
import { html, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { createElement, Globe, Moon, Sun } from "lucide";
import { I18nUtil } from "./locales";

const GlobeIcon = createElement(Globe);
const MoonIcon = createElement(Moon);
const SunIcon = createElement(Sun);

interface ExAppConfig {
  user?: {
    email?: string;
  };
  i18n?: {
    defaultLang?: string;
    resourceUrl?: string;
  };
}

const LOCATION_CACHE = "LOCATION_CACHE";

@customElement("ex-app")
export class ExApp extends TailwindElement {
  @property({ type: Object })
  config: ExAppConfig = {};

  @state()
  loading = false;

  @state()
  tag: EX_MODULE_ENUM | typeof nothing = nothing;

  @state()
  locale = I18nUtil.getLocale();

  @property({ type: String })
  theme: "light" | "dark" = "light";

  connectedCallback() {
    super.connectedCallback();
    // 监听浏览器前进、后退操作
    window.addEventListener("popstate", this.handlePopState);

    // 刷新页面时恢复状态
    const savedState = sessionStorage.getItem(LOCATION_CACHE);
    const { moduleName } = JSON.parse(
      savedState || JSON.stringify({ moduleName: EX_MODULE_ENUM.Login }),
    );
    this.switchModule(moduleName);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();

    window.removeEventListener("popstate", this.handlePopState);
  }

  private handlePopState = (event: PopStateEvent) => {
    const state = event.state;
    if (state?.moduleName) {
      this.tag = state.moduleName;
    }
  };

  // 更新状态并推送到 history
  private updateState(moduleName: EX_MODULE_ENUM) {
    const state = { moduleName };
    // 更新 history 状态，但不改变路径
    history.pushState(state, "", "");
    // 存储状态到 sessionStorage，便于刷新时恢复
    sessionStorage.setItem(LOCATION_CACHE, JSON.stringify(state));
  }
  handleSetLocale = (locale: string) => {
    I18nUtil.setLocale(locale);
    this.locale = locale;
  };

  async switchModule(moduleName: EX_MODULE_ENUM) {
    if (customElements.get(moduleName)) {
      this.updateState(moduleName);
      return (this.tag = moduleName);
    }
    this.loading = true;
    await loadExModule(moduleName);
    this.updateState(moduleName);
    this.tag = moduleName;
    this.loading = false;
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    if (this.theme === "dark") document.documentElement.classList.add("dark");
  }
  private renderDynamicElement(tag: string | typeof nothing) {
    if (!tag || tag === nothing) return nothing;
    const dynamicElement = document.createElement(tag);

    return html`${dynamicElement}`;
  }

  render() {
    return html`
      <i18n-provider
        ?defaultLang=${this.config?.i18n?.defaultLang}
        ?resourceUrl=${this.config?.i18n?.resourceUrl}
      >
        <user-provider ?config=${this.config?.user}>
          <main class="ex-container relative flex h-full">
            <header
              class="fixed left-0 top-0 flex h-12 w-full items-center justify-between px-8"
            >
              <div></div>
              <div>
                <ex-button
                  variant="ghost"
                  @click=${() => {
                    document.documentElement.classList.toggle("dark");
                    this.theme = this.theme === "dark" ? "light" : "dark";
                  }}
                >
                  ${this.theme === "light" ? MoonIcon : SunIcon}
                </ex-button>

                <ex-dropdown placement="bottom-end">
                  <ex-button
                    slot="trigger"
                    variant="ghost"
                  >
                    ${GlobeIcon}
                  </ex-button>

                  <ex-menu>
                    <ex-menu-item @click=${() => this.handleSetLocale("zh-HK")}>
                      <ex-button variant="ghost"> 繁體中文 </ex-button>
                    </ex-menu-item>
                    <ex-menu-item @click=${() => this.handleSetLocale("en-US")}>
                      <ex-button variant="ghost"> English </ex-button>
                    </ex-menu-item>
                  </ex-menu>
                </ex-dropdown>
              </div>
            </header>

            <div class="h-full w-full py-12 mobile:pb-0">
              <ex-spinner .loading=${this.loading}>
                <section class="mx-auto h-full max-w-screen-sm rounded">
                  ${this.renderDynamicElement(this.tag)}
                </section>
              </ex-spinner>
            </div>
          </main>
        </user-provider>
      </i18n-provider>
    `;
  }
}
