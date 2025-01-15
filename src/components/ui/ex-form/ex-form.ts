import { cn } from "@/utils/style";
import { consume, provide } from "@lit/context";
import { css, CSSResult, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { pick } from "lodash-es";
import TailwindElement from "../../tailwind-element";
import { formContext, FormContextProvide } from "./context";
import { ValidateInfo, ValidateInfos, ValidateStatus } from "./types";

@customElement("ex-form")
export class ExForm<
  T extends Record<string, any> = Record<string, any>,
> extends TailwindElement {
  @property()
  direction: "vertical" | "horizontal" = "vertical";

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

    // 如果没有规则，直接返回
    if (!rules) return;

    for (const rule of rules) {
      const { type, message, value: ruleValue, validator } = rule;

      // 验证器优先处理
      if (validator && typeof validator === "function") {
        try {
          await validator(value);
          break; // 验证通过，跳过后续规则
        } catch (err) {
          return err instanceof Error
            ? err.message
            : message || "Validation failed";
        }
      }

      // 检查值是否为空
      if (value === null || value === undefined || value === "") {
        if (type === "required" && ruleValue !== false)
          return message || "This field is required";
        continue; // 空值无需进行其他规则验证
      }

      // 检查值是否为数字或字符串
      const isNumber = typeof value === "number" || !isNaN(Number(value));
      const isString = typeof value === "string";

      // 规则值验证（仅在需要时验证）
      if (type !== "email" && (ruleValue === null || ruleValue === undefined)) {
        console.warn(`Rule value is missing for rule type: ${type}`);
        continue;
      }

      try {
        switch (type) {
          case "max":
            if (!isNumber) throw new Error("Value is not a number");
            if (Number(value) > ruleValue)
              return (
                message || `Value must be less than or equal to ${ruleValue}`
              );
            break;

          case "min":
            if (!isNumber) throw new Error("Value is not a number");
            if (Number(value) < ruleValue)
              return (
                message || `Value must be greater than or equal to ${ruleValue}`
              );
            break;

          case "len":
            if (!isString) throw new Error("Value is not a string");
            if (value.length !== ruleValue)
              return (
                message || `Value must be exactly ${ruleValue} characters long`
              );
            break;

          case "maxLen":
            if (!isString) throw new Error("Value is not a string");
            if (value.length > ruleValue)
              return message || `Value must not exceed ${ruleValue} characters`;
            break;

          case "minLen":
            if (!isString) throw new Error("Value is not a string");
            if (value.length < ruleValue)
              return (
                message || `Value must be at least ${ruleValue} characters`
              );
            break;

          case "email":
            if (!isString) throw new Error("Value is not a string");
            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value))
              return message || "Invalid email format";
            break;

          case "regexp":
            if (!isString) throw new Error("Value is not a string");
            if (!new RegExp(ruleValue).test(value))
              return message || "Value does not match the required pattern";
            break;

          default:
            console.warn(`Unknown rule type: ${type}`);
            break;
        }
      } catch (err) {
        console.error(`Validation error for field "${name.toString()}":`, err);
        return message || `Invalid value for rule type: ${type}`;
      }
    }
  };

  validate = async (
    nameList: Array<keyof T> = Object.keys(this.rules || {}),
  ) => {
    if (!this.formState || !this.rules) return void 0;

    const _validateInfos = {} as ValidateInfos<T>;
    const errors = {} as Record<keyof T, string>;

    await Promise.all(
      nameList.map(async (key) => {
        const message = await this.validateField(key);

        if (message) {
          errors[key] = message;
          _validateInfos[key] = {
            status: "error",
            message,
          };
        } else {
        }
      }),
    );
    this.validateInfos = _validateInfos;

    this.setFormItemValidateInfo();
    if (Object.keys(errors).length > 0) {
      throw new Error(JSON.stringify(errors));
    }

    return pick(this.formState, nameList);
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
    return html` <form
      @submit=${(e: SubmitEvent) => e.preventDefault()}
      class=${cn("flex gap-3", {
        "flex-col": this.direction === "vertical",
      })}
    >
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
      .ex-form-item-control ::slotted(*) {
        --ex-input-border-color: var(--ex-border);
      }

      .ex-form-item-control-error ::slotted(*) {
        --ex-input-border-color: var(--ex-destructive);
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

  setValidateInfo(info: ValidateInfo) {
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
    return html` <div class="ex-form-item space-y-1">
      <label class="text-sm font-medium">
        <slot name="label">
          ${this.label && html`<label> ${this.label} </label>`}
        </slot>
      </label>

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

declare global {
  interface HTMLElementTagNameMap {
    "ex-form": ExForm;
    "ex-form-item": ExFormItem;
  }
}
