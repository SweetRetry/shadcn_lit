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
          return err;
        }
      }

      if (value === null || value === undefined || value?.trim() === "") {
        if (type === "required" && ruleValue !== false) return message;
      } else if (ruleValue) {
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
      class="flex flex-col gap-4"
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
      .ex-form-item-control ::slotted(ex-input) {
        --ex-input-border-color: var(--ex-border);
      }

      .ex-form-item-control-error ::slotted(ex-input) {
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
    return html` <div class="ex-form-item space-y-2">
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
