import { ExResponse } from "@/api";
import "@/components/ui/ex-button";
import "@/components/ui/ex-form/ex-form";
import { ExForm } from "@/components/ui/ex-form/ex-form";
import "@/components/ui/ex-input";
import "@/components/ui/ex-modal";
import { TimerController } from "@/controllers/timer-controller";
import { produce } from "immer";
import { html, nothing } from "lit";
import { translate as t } from "lit-i18n";
import { customElement, property, state } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";
import TailwindElement from "../tailwind-element";

export interface VerifyConfig {
  security: 0 | 1;
  mfa: 0 | 1;
  email: 0 | 1;
  sms: 0 | 1;
  requestId: string;
}

const initialVerifyConfig: VerifyConfig = {
  security: 0,
  mfa: 0,
  email: 0,
  sms: 0,
  requestId: "",
};

const initialVerifyValues = {
  mfaCode: "",
  mobileCode: "",
  emailCaptcha: "",
  securityPassword: "",
};

export type VerifyValues = typeof initialVerifyValues;

export interface VerifyCallbacks {
  submit?: (values: VerifyValues, requestId: string) => Promise<ExResponse>;
  success?: () => void;
  error?: () => void;
}

@customElement("ex-verify-form")
export class ExVerifyForm extends TailwindElement {
  captchaTimerController = new TimerController(this);

  smsTimerController = new TimerController(this);

  @property()
  verifyInformation = {
    email: "",
    phone: "",
  };

  @property()
  callbacks?: VerifyCallbacks;

  @property()
  verifyConfig = {
    ...initialVerifyConfig,
  };

  @property({ type: Function })
  sendCaptcha?: () => Promise<ExResponse>;

  @state()
  captchaSending = false;

  private _sendCaptcha = async () => {
    if (!this.sendCaptcha) return;
    if (this.captchaSending || this.captchaTimerController.isRunning) return;
    this.captchaSending = true;
    const { statusCode } = await this.sendCaptcha();
    if (statusCode === 200) {
      this.captchaTimerController.start();
    }
    this.captchaSending = false;
  };

  @property({ type: Function })
  sendSms?: () => Promise<ExResponse>;

  @state()
  smsSending = false;

  private _sendSms = async () => {
    if (!this.sendSms) return;
    if (this.smsSending || this.smsTimerController.isRunning) return;
    this.smsSending = true;
    const { statusCode } = await this.sendSms();
    if (statusCode === 200) {
      this.smsTimerController.start();
    }
    this.smsSending = false;
  };

  @state()
  verifyValues = { ...initialVerifyValues };

  verifyFormRef? = createRef<ExForm<VerifyValues>>();

  get rules() {
    return {
      securityPassword: [
        {
          type: "required",
          value: !!this.verifyConfig.security,
          message: t("3xEHseDPL3yyrQBFFRT9r"),
        },
        {
          type: "len",
          value: 6,
          message: "請輸入6位安全密碼",
        },
      ],
      mfaCode: [
        {
          type: "required",
          value: !!this.verifyConfig.mfa,
          message: "請輸入MFA驗證碼",
        },
        {
          type: "len",
          value: 6,
          message: "請輸入6位MFA驗證碼",
        },
      ],
      emailCaptcha: [
        {
          type: "required",
          value: !!this.verifyConfig.email,

          message: "請輸入郵箱驗證碼",
        },
        {
          type: "len",
          value: 6,
          message: "請輸入6位郵箱驗證碼",
        },
      ],
      mobileCode: [
        {
          type: "required",
          value: !!this.verifyConfig.sms,

          message: "請輸入手機驗證碼",
        },
        {
          type: "len",
          value: 6,
          message: "請輸入6位手機驗證碼",
        },
      ],
    };
  }
  private setVerifyValues = (key: keyof VerifyValues, value: string) => {
    this.verifyValues = produce(this.verifyValues, (draft) => {
      draft[key] = value;
    });
  };

  protected afterClose = () => {
    this.verifyValues = {
      ...initialVerifyValues,
    };
  };

  validate = () => this.verifyFormRef?.value?.validate();

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.afterClose();
  }

  render() {
    return html`
      <ex-form
        ${ref(this.verifyFormRef)}
        .formState=${this.verifyValues}
        @change=${(e: CustomEvent) =>
          this.setVerifyValues(e.detail.key, e.detail.value)}
        .rules=${this.rules}
      >
        ${this.verifyConfig.security
          ? html`
              <ex-form-item name="securityPassword" label="安全密碼">
                <ex-input
                  type="password"
                  .value=${this.verifyValues.securityPassword}
                  placeholder="請輸入安全密碼"
                  name="securityPassword"
                ></ex-input>
              </ex-form-item>
            `
          : nothing}
        ${this.verifyConfig.mfa
          ? html` <ex-form-item name="mfaCode" label="MFA驗證碼">
              <ex-input
                .value=${this.verifyValues.mfaCode}
                placeholder="請輸入MFA驗證碼"
                name="mfaCode"
              ></ex-input>
            </ex-form-item>`
          : nothing}
        ${this.verifyConfig.email
          ? html` <ex-form-item name="emailCaptcha" label="郵箱驗證碼">
              <ex-input
                .value=${this.verifyValues.emailCaptcha}
                placeholder="請輸入郵箱驗證碼"
                name="emailCaptcha"
              >
                <ex-button
                  slot="suffix"
                  variant="link"
                  ?disabled=${this.captchaSending ||
                  this.captchaTimerController.isRunning}
                  @click=${() => this._sendCaptcha?.()}
                >
                  ${this.captchaTimerController.render("发送")}
                </ex-button>
              </ex-input>
            </ex-form-item>`
          : nothing}
        ${this.verifyConfig.sms
          ? html` <ex-form-item name="mobileCode" label="手機驗證碼">
              <ex-input
                .value=${this.verifyValues.mobileCode}
                placeholder="請輸入手機驗證碼"
                name="mobileCode"
                @click=${() => this._sendSms?.()}
              >
                <ex-button
                  slot="suffix"
                  variant="link"
                  ?disabled=${this.smsSending ||
                  this.smsTimerController.isRunning}
                  @click=${() => this._sendCaptcha?.()}
                >
                  ${this.smsTimerController.render("发送")}
                </ex-button>
              </ex-input>
            </ex-form-item>`
          : nothing}
      </ex-form>
    `;
  }
}
