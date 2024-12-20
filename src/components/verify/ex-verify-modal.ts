import "@/components/ui/ex-button";
import "@/components/ui/ex-form";
import "@/components/ui/ex-input";
import "@/components/ui/ex-modal";

import { ExModal } from "@/components/ui/ex-modal";
import { v4 as uuidv4 } from "uuid";

import { ExResponse } from "@/api";
import { ExForm } from "@/components/ui/ex-form";
import { produce } from "immer";
import { html } from "lit";
import { translate as t } from "lit-i18n";
import { customElement, property, query, state } from "lit/decorators.js";
import { createRef, Ref, ref } from "lit/directives/ref.js";
import TailwindElement from "../tailwind-element";

export interface VerifyConfig {
  security: 0 | 1;
  mfa: 0 | 1;
  email: 0 | 1;
  requestId: string;
}

const initialVerifyConfig = {
  security: 0,
  mfa: 0,
  email: 0,
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

@customElement("ex-verify-modal")
export class ExVerifyModal extends TailwindElement {
  @property()
  verifyInformation = {
    email: "",
    phone: "",
  };

  @property()
  callbacks?: VerifyCallbacks;

  @state()
  verifyConfig = {
    ...initialVerifyConfig,
  };

  @state()
  verifyValues = { ...initialVerifyValues };

  verifyModalId = uuidv4();

  @query("#verify-form") verifyFormRef?: ExForm<VerifyValues>;

  rules = {
    securityPassword: [
      {
        type: "required",
        message: t("3xEHseDPL3yyrQBFFRT9r"),
      },
    ],
  };

  @state()
  loading = false;

  private setVerifyValues = (key: keyof VerifyValues, value: string) => {
    this.verifyValues = produce(this.verifyValues, (draft) => {
      draft[key] = value;
    });
  };

  veirfyModalRef?: Ref<ExModal> = createRef();

  show = (config: VerifyConfig) => {
    this.verifyConfig = config;

    this.veirfyModalRef?.value?.show();
  };

  close = () => {
    this.veirfyModalRef?.value?.close();
  };

  protected afterClose = () => {
    this.verifyConfig = {
      ...initialVerifyConfig,
    };
    this.verifyValues = {
      ...initialVerifyValues,
    };
  };

  protected handleVerify = async () => {
    if (!this.verifyFormRef) return;

    const { values } = await this.verifyFormRef.validate();
    if (!values) return;

    this.loading = true;

    const res = await this.callbacks?.submit?.(
      values,
      this.verifyConfig.requestId,
    );
    if (res?.statusCode === 200) {
      this.veirfyModalRef?.value?.close();
    }

    this.loading = false;
  };

  render() {
    return html`
      <ex-modal
        title="安全驗證"
        ref=${ref(this.veirfyModalRef)}
        id=${this.verifyModalId}
        @afterClose=${this.afterClose}
      >
        <ex-form
          id="verify-form"
          .formState=${this.verifyValues}
          @change=${(e: CustomEvent) =>
            this.setVerifyValues(e.detail.key, e.detail.value)}
          .rules=${this.rules}
        >
          <ex-form-item
            name="securityPassword"
            label="安全密码"
          >
            <ex-input
              type="password"
              .value=${this.verifyValues.securityPassword}
              placeholder="請輸入安全密碼"
              name="securityPassword"
            ></ex-input>
          </ex-form-item>
        </ex-form>

        <ex-button
          class="mt-4 w-full"
          @click=${this.handleVerify}
          .loading=${this.loading}
        >
          確認
        </ex-button>
      </ex-modal>
    `;
  }
}
