import { consume, createContext, provide } from "@lit/context";
import { css, CSSResult, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import TailwindElement from "../tailwind-element";

export interface RuleItem {
  type?:
    | "required"
    | "max"
    | "min"
    | "len"
    | "maxLen"
    | "minLen"
    | "email"
    | "regexp";
  value?: number;
  message?: string; // 校验失败时的错误提示信息
  validator?: (value?: string) => Promise<void>;
}

export type ValidateStatus = "error" | "warning" | "success" | "default";

export interface FormContextProvide<
  T extends Record<string, any> = Record<string, any>,
> {
  validate: (nameList?: string[]) => Promise<{
    values?: T;
    errors?: Record<string, any>;
  }>;
  setFieldValue: (name: keyof T, value: T[keyof T]) => Promise<void>;
  getFieldValue: (field: keyof T) => T[keyof T] | undefined;
  getFieldsValue: () => T | undefined;
  setFormItem: (formItem: ExFormItem) => void;
}
export const formContext = createContext<FormContextProvide>(
  Symbol("ex-form-context"),
);

@customElement("ex-form")
export class ExForm<
  T extends Record<string, any> = Record<string, any>,
> extends TailwindElement {
  getFieldValue(field: keyof T) {
    return this.formState?.[field];
  }
  getFieldsValue = () => this.formState;
  setFieldValue = async (name: keyof T, value: T[keyof T]) => {
    this.formState = {
      ...this.formState,
      [name]: value,
    } as T;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          key: name,
          value,
        },
      }),
    );
    this.validate([name.toString()]);
  };

  @state()
  private formItems: ExFormItem[] = [];

  private setFormItem = (formItem: ExFormItem) => {
    this.formItems.push(formItem);
  };

  private validateField = async (name: keyof T) => {
    const rules = this.rules?.[name];
    const value = this.formState?.[name];
    if (!rules) return;
    for (const rule of rules) {
      const { type, message, value: ruleValue, validator } = rule;

      if (validator && typeof validator === "function") {
        try {
          await validator(value);
          break;
        } catch (err) {
          return (err as Error).message;
        }
      }

      if (value === null || value === undefined || value?.trim() === "") {
        if (type === "required" && ruleValue !== false) return message;
      } else if (!ruleValue) {
        switch (type) {
          case "max":
            if (Number(value) > ruleValue) return message;
            break;
          case "min":
            if (Number(value) < ruleValue) return message;
            break;
          case "len":
            if (value.length !== ruleValue) return message;
            break;
          case "maxLen":
            if (value.length > ruleValue) return message;
            break;
          case "minLen":
            if (value.length < ruleValue) return message;
            break;
          case "email":
            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value))
              return message;
            break;
          case "regexp":
            if (!new RegExp(ruleValue).test(value)) return message;
            break;
          default:
            break;
        }
      }
    }
  };

  validate = async (
    nameList?: Array<keyof T>,
  ): Promise<{
    values?: T;
    errors?: Record<string, any>;
  }> => {
    if (!this.formState || !this.rules)
      return { values: void 0, errors: void 0 };

    const _validateInfos = {} as Record<
      keyof T,
      {
        status: ValidateStatus;
        message: string;
      }
    >;
    const errors = {} as Record<keyof T, string>;

    const keys = nameList || Object.keys(this.rules);

    await Promise.all(
      keys.map(async (key) => {
        const message = await this.validateField(key);

        if (message) {
          errors[key] = message;
          _validateInfos[key] = {
            status: "error",
            message,
          };
        }
      }),
    );
    this.validateInfos = _validateInfos;

    this.setFormItemValidateInfo();
    if (Object.keys(errors).length > 0) {
      return { values: void 0, errors };
    }
    return { values: this.formState, errors };
  };

  @provide({ context: formContext })
  _provide: FormContextProvide = {
    validate: this.validate,
    setFieldValue: this.setFieldValue,
    getFieldValue: this.getFieldValue,
    getFieldsValue: this.getFieldsValue,
    setFormItem: this.setFormItem,
  };

  @property({ type: Object })
  formState?: T = void 0;

  @property()
  rules?: Record<keyof T, any[]> = void 0;

  @state()
  private validateInfos = {} as Record<
    keyof T,
    { status: ValidateStatus; message?: string }
  >;

  setFormItemValidateInfo() {
    this.formItems?.forEach((formItem) => {
      if (formItem.name) {
        formItem.setValidateInfo(
          this.validateInfos?.[formItem.name] || { status: "default" },
        );
      }
    });
  }

  render() {
    return html` <form @submit=${(e: SubmitEvent) => e.preventDefault()}>
      <slot></slot>
    </form>`;
  }
}

@customElement("ex-form-item")
export class ExFormItem extends TailwindElement {
  @consume({ context: formContext })
  @property({ attribute: false })
  formContext?: FormContextProvide;

  static styles: CSSResult[] = [
    ...TailwindElement.styles,
    css`
      .ex-form-item-control ::slotted(ex-input) {
        --ex-input-border-color: var(--border);
      }

      .ex-form-item-control-error ::slotted(ex-input) {
        --ex-input-border-color: var(--destructive);
      }
    `,
  ];

  @property()
  name?: string;

  @property()
  label?: string;

  @property()
  helpText?: string;

  @property()
  message?: string;

  @property()
  status: ValidateStatus = "default";

  setValidateInfo(info: { status: ValidateStatus; message?: string }) {
    this.status = info.status;
    this.message = info?.message;
  }

  connectedCallback() {
    super.connectedCallback();
    this.formContext?.setFormItem(this);
  }

  renderMessage() {
    if (this.message && this.status === "error") {
      return html`<p class="text-sm text-destructive">${this.message}</p>`;
    }
  }

  render() {
    return html` <div class="ex-form-item space-y-2">
      <div class="text-sm">
        <slot name="label">
          ${this.label && html`<label> ${this.label} </label>`}
        </slot>
      </div>

      <div class=${`ex-form-item-control ex-form-item-control-${this.status}`}>
        <slot></slot>
      </div>

      ${this.renderMessage()}

      <div class="text-sm text-gray-500">
        <slot name="help">
          ${this.helpText && html`<p>${this.helpText}</p>`}
        </slot>
      </div>
    </div>`;
  }
}
