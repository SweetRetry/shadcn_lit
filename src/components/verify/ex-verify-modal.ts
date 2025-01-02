import { ExResponse } from "@/api";
import "@/components/ui/ex-button";
import "@/components/ui/ex-form/ex-form";
import { ExForm } from "@/components/ui/ex-form/ex-form";
import "@/components/ui/ex-input";
import "@/components/ui/ex-modal";
import { ExModal } from "@/components/ui/ex-modal";
import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
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

  @property()
  verifyConfig = {
    ...initialVerifyConfig,
  };

  verifyFormRef: Ref<ExForm<VerifyValues>> = createRef();

  @state()
  loading = false;

  veirfyModalRef?: Ref<ExModal> = createRef();

  show = (config: VerifyConfig) => {
    this.verifyConfig = config;

    this.veirfyModalRef?.value?.show();
  };

  close = () => this.veirfyModalRef?.value?.close();

  protected afterClose = () => {
    this.verifyConfig = {
      ...initialVerifyConfig,
    };
  };

  protected handleVerify = async () => {
    if (!this.verifyFormRef) return;

    const values = await this.verifyFormRef.value?.validate();
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
        @afterClose=${this.afterClose}
      >
        <ex-verify-form
          ${ref(this.verifyFormRef)}
          .verifyConfig=${this.verifyConfig}
        ></ex-verify-form>

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
