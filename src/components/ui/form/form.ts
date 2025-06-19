      import { consume, createContext, provide } from "@lit/context";
import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import TailwindElement from "../../tailwind-element";

// Merged from types.ts
export interface RuleItem {
  type?: "required" | "email" | "regexp";
  message?: string;
  pattern?: RegExp;
}

export type ValidateStatus = "error" | "success" | "default";

export interface ValidateInfo {
  status: ValidateStatus;
  message?: string;
}

// Merged from context.ts
export interface FormContextProvide<T extends Record<string, any>> {
  values: T;
  validate: (name?: keyof T) => Promise<boolean>;
  setFieldValue: (name: keyof T, value: any) => void;
  getFieldValue: (name: keyof T) => any;
  registerField: (field: ShadcnLitFormItem) => void;
  unregisterField: (field: ShadcnLitFormItem) => void;
}

export const formContext = createContext<FormContextProvide<any>>(
  Symbol("form-context"),
);

@customElement("shadcn-lit-form")
export class ShadcnLitForm<
  T extends Record<string, any>,
> extends LitElement {
  @provide({ context: formContext })
  formContext: FormContextProvide<T>;

  constructor() {
    super();
    this.formContext = {
        values: this.values,
        validate: this.validate,
        setFieldValue: this.setFieldValue,
        getFieldValue: this.getFieldValue,
        registerField: this.registerField,
        unregisterField: this.unregisterField,
    };
  }

  @property({ type: Object })
  values: T = {} as T;

  @property({ type: Object })
  rules: Partial<Record<keyof T, RuleItem[]>> = {};

  @state()
  private fields: ShadcnLitFormItem[] = [];

  private registerField = (field: ShadcnLitFormItem) => {
    this.fields.push(field);
  };

  private unregisterField = (field: ShadcnLitFormItem) => {
    this.fields = this.fields.filter((f) => f !== field);
  };

  getFieldValue = (name: keyof T) => {
    return this.values[name];
  };

  setFieldValue = (name: keyof T, value: any) => {
    this.values = { ...this.values, [name]: value };
    this.formContext = { ...this.formContext, values: this.values };
    this.requestUpdate();
  };

  validate = async (name?: keyof T): Promise<boolean> => {
    let isValid = true;
    const fieldsToValidate = name ? this.fields.filter(f => f.name === name) : this.fields;

    for (const field of fieldsToValidate) {
        if (field.name && this.rules[field.name]) {
            const fieldIsValid = await field.validate(this.values[field.name], this.rules[field.name]!);
            if (!fieldIsValid) {
                isValid = false;
            }
        }
    }
    return isValid;
  };

  submit = async () => {
    const isValid = await this.validate();
    if (isValid) {
      this.dispatchEvent(new CustomEvent('submit', { detail: { values: this.values } }));
    } else {
      console.log('Validation failed');
    }
  }

  render() {
    return html`<form @submit=${(e: Event) => { e.preventDefault(); this.submit(); }}><slot></slot></form>`;
  }
}

@customElement("shadcn-lit-form-item")
export class ShadcnLitFormItem extends TailwindElement {
  @consume({ context: formContext, subscribe: true })
  private formContext?: FormContextProvide<any>;

  @property({ type: String })
  name?: string;

  @property({ type: String })
  label?: string;

  @state()
  private error?: string;

  connectedCallback() {
    super.connectedCallback();
    this.formContext?.registerField(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.formContext?.unregisterField(this);
  }

  async validate(value: any, rules: RuleItem[]): Promise<boolean> {
    for (const rule of rules) {
      if (rule.type === 'required' && !value) {
        this.error = rule.message || `${this.name} is required`;
        return false;
      }
      if (rule.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        this.error = rule.message || 'Invalid email address';
        return false;
      }
      if (rule.type === 'regexp' && rule.pattern && !rule.pattern.test(value)) {
          this.error = rule.message || 'Invalid format';
          return false;
      }
    }
    this.error = undefined;
    return true;
  }

  private handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    if (this.name) {
      this.formContext?.setFieldValue(this.name, target.value);
    }
  }

  render() {
    return html`
      <div class="space-y-2">
        <label for=${this.name} class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">${this.label}</label>
        <div @input=${this.handleInput}>
            <slot></slot>
        </div>
        ${this.error ? html`<p class="text-sm font-medium text-destructive">${this.error}</p>` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "shadcn-lit-form": ShadcnLitForm<any>;
    "shadcn-lit-form-item": ShadcnLitFormItem;
  }
}
