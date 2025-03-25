import "@/components/common/app-link";
import "@/components/ui/ex-form/ex-form";
import "@/components/ui/ex-input";
import "@/components/ui/ex-upload";
import "@/components/verify/ex-verify-form";

import { postResetUserPwd, postSendForgetPwdCaptcha } from "@/api/auth";
import TailwindElement from "@/components/tailwind-element";
import { ExForm } from "@/components/ui/ex-form/ex-form";

import { PostResetPwdParams } from "@/api/auth/types";
import { AppLogo } from "@/components/common/app-logo";
import { ExVerifyForm, VerifyConfig } from "@/components/verify/ex-verify-form";
import { EX_MODULE_ENUM } from "@/utils/module";
import { produce } from "immer";
import { html } from "lit";
import { translate as t } from "lit-i18n";
import { customElement, state } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";

@customElement("ex-reset-pwd")
export class ExResetPwd extends TailwindElement {
  @state()
  formState: PostResetPwdParams = {
    email: "",
    password: "",
    confirm: "",
  };

  setFormState(key: keyof PostResetPwdParams, value: string) {
    this.formState = produce(this.formState, (draft) => {
      draft[key] = value;
    });
  }

  rules = {
    email: [
      {
        type: "required",
        message: t("efWh8Lmsk4F7uYC76LiFg"),
      },

      {
        type: "email",
        message: t("efWh8Lmsk4F7uYC76LiFg"),
      },
    ],
    password: [
      {
        type: "required",
        message: t("lGsrMtXGUODjwRq0S6SBt"),
      },
    ],
    confirm: [
      {
        type: "required",
        message: t("lGsrMtXGUODjwRq0S6SBt"),
      },
      {
        validator: async (value: string) => {
          if (value !== this.formState.password) {
            return Promise.reject("两次密码输入不一致");
          }
        },
      },
    ],
  };

  @state()
  loading = false;

  formRef = createRef<ExForm<PostResetPwdParams>>();

  verifyRef = createRef<ExVerifyForm>();

  @state()
  step = 1;

  @state()
  verifyConfig = {};

  async handleSubmit() {
    if (this.loading) return;
    switch (this.step) {
      case 1:
        const values = await this.formRef.value?.validate(["email"]);

        if (values) {
          this.loading = true;

          const res = await postResetUserPwd(values);
          if (res.statusCode === 200) {
            this.verifyConfig = res.content as VerifyConfig;
            this.step = 2;
          }
        }
        break;
      case 2:
        const verifyValues = await this.verifyRef.value?.validate();
        if (verifyValues) {
          this.loading = true;

          const res = await postResetUserPwd(verifyValues);
          if (res.statusCode === 200) {
            this.step = 3;
          }
        }
        break;
      case 3:
        const _values = await this.formRef.value?.validate([
          "password",
          "confirm",
        ]);
        if (_values) {
          this.loading = true;

          const data = await postResetUserPwd(_values);
          if (data.statusCode === 200) {
            this.step = 4;
          }
        }
        break;
    }
    this.loading = false;
  }

  renderStepForm() {
    switch (this.step) {
      case 1:
        return html`
          <h2 class="text-2xl font-semibold">Forgot password</h2>
          <p class="text-gray-500">
            Enter your email address to reset your password.
          </p>
          <ex-form-item label="${t("ChvwKWcUtSXzJ2mizkUuK")}" name="email">
            <ex-input placeholder="${t("Q9TWGNX56cwOAyIbH4c7I")}" name="email">
            </ex-input>
          </ex-form-item>

          <ex-button
            @click=${this.handleSubmit}
            class="w-full"
            .loading=${this.loading}
          >
            确认
          </ex-button>
        `;
      case 2:
        return html`
          <h2 class="text-2xl font-semibold">Verify your account</h2>
          <p class="text-gray-500">Please enter the verification code.</p>
          <ex-verify-form
            ${ref(this.verifyRef)}
            .verifyConfig=${this.verifyConfig}
            .verifyInformation=${{ email: this.formState.email }}
            .sendCaptcha=${() => postSendForgetPwdCaptcha()}
          >
          </ex-verify-form>
          <ex-button
            @click=${this.handleSubmit}
            class="w-full"
            .loading=${this.loading}
          >
            验证
          </ex-button>
        `;
      case 3:
        return html`
          <h2 class="text-2xl font-semibold">Set yout new password</h2>
          <p class="text-gray-500">
            Your new password must be different from the previous one.
          </p>
          <ex-form-item name="password" label="密碼">
            <ex-input
              placeholder="${t("fMBGcHZ74F6D_S3-bF3cP")}"
              type="password"
              name="password"
            >
            </ex-input>
          </ex-form-item>

          <ex-form-item name="confirm" label="確認密碼">
            <ex-input
              placeholder="${t("fMBGcHZ74F6D_S3-bF3cP")}"
              type="password"
              name="confirm"
            >
            </ex-input>
          </ex-form-item>

          <ex-button
            @click=${this.handleSubmit}
            class="w-full"
            .loading=${this.loading}
          >
            重置
          </ex-button>
        `;
    }
  }

  renderResult() {
    return html`
      <div class="space-y-4">
        <h2 class="text-2xl font-semibold">Password Reset!</h2>
        <p class="text-gray-500">
          Your password has been reset successfully. You can click continue to
          login.
        </p>

        <app-link .module=${EX_MODULE_ENUM.Login}>
          <ex-button>登录</ex-button>
        </app-link>
      </div>
    `;
  }
  render() {
    return html`
      <div class="flex h-full items-center">
        <div class="mx-auto w-full max-w-md">
          <div class="rounded-lg border border-border p-8 mobile:border-none">
            ${this.step === 4
              ? this.renderResult()
              : html`
                  <div class="mb-6 w-40">${AppLogo}</div>

                  <ex-form
                    ${ref(this.formRef)}
                    @change=${(e: CustomEvent) =>
                      this.setFormState(e.detail.key, e.detail.value)}
                    .formState=${this.formState}
                    .rules=${this.rules}
                  >
                    ${this.renderStepForm()}
                  </ex-form>
                `}
          </div>
          <div class="text-center text-sm text-gray-500 mt-2">
            <app-link .module=${EX_MODULE_ENUM.Register}>
              <p class="text-center text-primary">註冊</p>
            </app-link>

            <span>或</span>

            <app-link .module=${EX_MODULE_ENUM.Login}>
              <p class="text-center text-primary">登录</p>
            </app-link>
          </div>
        </div>
      </div>
    `;
  }
}
