import { cn } from "@/utils/style";
import { consume, createContext, provide } from "@lit/context";
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import TailwindElement from "../tailwind-element";

// Context
interface TabsContext {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const tabsContext = createContext<TabsContext>(Symbol("tabs-context"));

@customElement("shadcn-lit-tabs")
export class ShadcnLitTabs extends LitElement {
  @provide({ context: tabsContext })
  private context: TabsContext;

  constructor() {
    super();
    this.context = {
        activeTab: this.defaultValue,
        setActiveTab: this.setActiveTab.bind(this),
    };
  }

  @property({ type: String })
  defaultValue = "";

  private setActiveTab(value: string) {
    this.context = { ...this.context, activeTab: value };
    this.dispatchEvent(new CustomEvent("change", { detail: { value } }));
  }

  render() {
    return html`<slot></slot>`;
  }
}

// List
@customElement("shadcn-lit-tabs-list")
export class ShadcnLitTabsList extends TailwindElement {
  render() {
    return html`
      <div
        class="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground"
      >
        <slot></slot>
      </div>
    `;
  }
}

// Trigger
@customElement("shadcn-lit-tabs-trigger")
export class ShadcnLitTabsTrigger extends TailwindElement {
  @consume({ context: tabsContext, subscribe: true })
  private context!: TabsContext;

  @property({ type: String })
  value = "";

  render() {
    const isActive = this.context.activeTab === this.value;
    return html`
      <button
        @click=${() => this.context.setActiveTab(this.value)}
        class=${cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          isActive && "bg-background text-foreground shadow-sm",
        )}
      >
        <slot></slot>
      </button>
    `;
  }
}

// Content
@customElement("shadcn-lit-tabs-content")
export class ShadcnLitTabsContent extends TailwindElement {
  @consume({ context: tabsContext, subscribe: true })
  private context!: TabsContext;
  
  @property({ type: String })
  value = "";

  render() {
    return this.context.activeTab === this.value
      ? html`<div class="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"><slot></slot></div>`
      : "";
  }
}
