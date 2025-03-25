import "@/components/common/app-link";
import TailwindElement from "@/components/tailwind-element";
import "@/components/ui/ex-button";
import "@/components/ui/ex-dropdown";
import "@/components/ui/ex-menu";
import "@/components/ui/ex-spinner";
import "@/elements/my/messages/ex-messages";

import "@/providers/i18n-provider";

import { EX_MODLUES, EX_MODULE_ENUM } from "@/utils/module";
import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Globe, Moon, Sun, UserCircle2 } from "lucide";
import { AppLogo } from "./components/common/app-logo";
import { SIDER_MENUS } from "./config/sider";
import { AppThemeKey } from "./config/storageKey";
import { I18nUtil } from "./locales";
import { createLucideIcon } from "./utils/icon";
import { setSystemTheme } from "./utils/theme";

const GlobeIcon = createLucideIcon(Globe);
const MoonIcon = createLucideIcon(Moon);
const SunIcon = createLucideIcon(Sun);

interface ExAppConfig {
  user?: {
    email?: string;
  };
  i18n?: {
    defaultLang?: string;
    resourceUrl?: string;
  };
}

const LocaleToggle = () => {
  const locales = [
    {
      label: "繁體中文",
      key: "zh-HK",
    },
    {
      label: "English",
      key: "en-US",
    },
  ];

  return html` <ex-dropdown placement="bottom-end">
    <ex-button slot="trigger" size="icon" variant="ghost">
      ${GlobeIcon}
    </ex-button>

    <ex-menu
      .items=${locales}
      @select=${(e: CustomEvent<{ key: string }>) => {
        I18nUtil.setLocale(e.detail.key);
      }}
    >
    </ex-menu>
  </ex-dropdown>`;
};

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
  tagProps?: Record<string, any>;

  @property({ type: String })
  theme: "light" | "dark" | "system" =
    (localStorage.getItem(AppThemeKey) as "light" | "dark" | "system") ||
    "system";

  connectedCallback() {
    super.connectedCallback();
    // 监听浏览器前进、后退操作
    window.addEventListener("popstate", this.handlePopState);

    setSystemTheme((theme) => {
      localStorage.setItem(AppThemeKey, theme);
      document.documentElement.classList.toggle(
        this.theme === "system" ? theme : this.theme,
      );
    });

    // 刷新页面时恢复状态
    const savedState =
      sessionStorage.getItem(LOCATION_CACHE) ||
      JSON.stringify({ moduleName: EX_MODULE_ENUM.Login });

    const { moduleName, props } = JSON.parse(savedState);
    this.switchModule(moduleName, props);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();

    window.removeEventListener("popstate", this.handlePopState);
  }

  private handlePopState = (event: PopStateEvent) => {
    const state = event.state;

    if (state?.moduleName) {
      this.switchModule(state.moduleName, state.props);
    }
  };

  // 更新状态并推送到 history
  private updateState(moduleName: EX_MODULE_ENUM, repalce: boolean = false) {
    const state = { moduleName, props: this.tagProps };
    // 更新 history 状态，但不改变路径
    repalce
      ? window.history.replaceState(state, "")
      : window.history.pushState(state, "");
    // 存储状态到 sessionStorage，便于刷新时恢复
    sessionStorage.setItem(LOCATION_CACHE, JSON.stringify(state));
  }

  get currentModule() {
    return EX_MODLUES[this.tag as EX_MODULE_ENUM];
  }
  async switchModule(moduleName: EX_MODULE_ENUM, props?: Record<string, any>) {
    this.tagProps = props;

    if (customElements.get(moduleName)) {
      this.updateState(moduleName);
      return (this.tag = moduleName);
    }
    this.loading = true;
    try {
      await EX_MODLUES[moduleName].module();
      this.updateState(moduleName);
      this.tag = moduleName;
    } catch (e) {
      console.log((e as Error).message);
    } finally {
      this.loading = false;
    }
  }
  private renderDynamicElement(tag: string | typeof nothing) {
    if (!tag || tag === nothing) return nothing;
    const dynamicElement = document.createElement(tag);
    if (this.tagProps) {
      Object.entries(this.tagProps).forEach(([key, value]) => {
        dynamicElement.setAttribute(key, value);
      });
    }
    return html`${dynamicElement}`;
  }

  renderSiderbar() {
    if (this.currentModule?.hideSider) return nothing;

    return html` <nav class="mr-4 min-w-[200px] mobile:hidden">
      <ex-menu
        .items=${SIDER_MENUS}
        @select=${(e: CustomEvent<{ key: EX_MODULE_ENUM }>) => {
          this.switchModule(e.detail.key);
        }}
      ></ex-menu>
    </nav>`;
  }
  render() {
    return html`
      <i18n-provider
        ?defaultLang=${this.config?.i18n?.defaultLang}
        ?resourceUrl=${this.config?.i18n?.resourceUrl}
      >
        <ex-user-provider>
          <main class="ex-container relative">
            <header
              class="flex h-16 w-full items-center justify-between px-8 mobile:px-4"
            >
              <div class="w-32">${AppLogo}</div>

              <div class="space-x-2">
                <ex-messages
                  .pageSize=${4}
                  type="popup"
                  class="mobile:hidden"
                ></ex-messages>

                <ex-dropdown placement="bottom-end">
                  <ex-button slot="trigger" size="icon" variant="ghost">
                    ${createLucideIcon(UserCircle2)}
                  </ex-button>

                  <ex-menu
                    .items=${[
                      {
                        label: "Log Out",
                        key: "logout",
                      },
                    ]}
                    @select=${(e: CustomEvent<{ key: string }>) => {
                      if (e.detail.key === "logout") {
                        this.switchModule(EX_MODULE_ENUM.Login);
                      }
                    }}
                  >
                  </ex-menu>
                </ex-dropdown>

                <ex-button
                  size="icon"
                  variant="ghost"
                  @click=${() => {
                    document.documentElement.classList.toggle("dark");
                    this.theme = this.theme === "dark" ? "light" : "dark";
                    localStorage.setItem(AppThemeKey, this.theme);
                  }}
                >
                  ${this.theme === "light" ? MoonIcon : SunIcon}
                </ex-button>

                ${LocaleToggle()}
              </div>
            </header>

            <section
              class="flex w-full overflow-x-hidden mobile:px-4"
              style="height:calc(100vh - 64px)"
            >
              ${this.renderSiderbar()}
              <section
                style="width:calc(100% - 200px)"
                class="mx-auto max-w-[1200px] px-4 mobile:!w-full mobile:px-0"
              >
                <ex-spinner .loading=${this.loading}>
                  ${this.renderDynamicElement(this.tag)}
                </ex-spinner>
              </section>
            </section>
          </main>
        </ex-user-provider>
      </i18n-provider>
    `;
  }
}
