import { createContext, provide } from "@lit/context";
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

export interface ThemeContextProvide {
  getTheme: () => "light" | "dark";
  toggleTheme: () => void;
}

export const themeContext = createContext<ThemeContextProvide>(
  Symbol("ex-theme-context"),
);

@customElement("theme-provider")
export class ThemeProvider extends LitElement {
  @property({ type: String })
  theme: "light" | "dark" = "light";

  private toggleTheme = () => {
    this.theme = this.theme === "light" ? "dark" : "light";
    this.dispatchEvent(
      new CustomEvent("themeChange", {
        detail: this.theme,
      }),
    );
  };

  @provide({ context: themeContext })
  _provide: ThemeContextProvide = {
    getTheme: () => {
      console.log(this.theme);
      return this.theme || 'light';
    },
    toggleTheme: this.toggleTheme,
  };

  render() {
    return html`<slot></slot>`;
  }
}
