import { createContext, provide } from "@lit/context";
import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
// 定义用户配置类型
export interface UserConfig {
  email?: string;
}

// 创建上下文
export const userConfigContext = createContext(Symbol("user-context"));

@customElement("user-provider")
export class UserProvider extends LitElement {
  protected createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }

  @property({ type: Object })
  config: UserConfig = {
    email: void 0,
  };

  @provide({ context: userConfigContext })
  @state()
  userInfo = null;

  // 监听userConfig的变化
  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has("config") && this.config?.email) {
      this.fetchUserInfo(this.config.email);
    }
  }

  // 模拟请求用户信息
  async fetchUserInfo(email: string) {
    try {
      const response = await fetch(
        `https://api.example.com/userinfo?email=${email}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user info");
      }
      this.userInfo = await response.json();
      console.log("Fetched user info:", this.userInfo);
    } catch (error) {
      console.error("Error fetching user info:", error);
      this.userInfo = null;
    }
  }

  render() {
    // const isProvideEmail = this.config?.email ? true : false;
    // if (!isProvideEmail) return html`<ex-login></ex-login>`;
    return html` <slot></slot> `;
  }
}
