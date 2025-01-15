import "@/components/common/app-link";
import "@/components/ui/ex-checkbox";
import "@/components/ui/ex-form/ex-form";
import "@/components/ui/ex-input";
import "@/components/ui/ex-upload";
import "@/components/verify/ex-verify-form";

import { postSendRegisterCaptcha, postUserRegister } from "@/api/user";
import TailwindElement from "@/components/tailwind-element";
import { ExForm } from "@/components/ui/ex-form/ex-form";

import { PostUserRegisterParams } from "@/api/user/types";
import { AppLogo } from "@/components/common/app-logo";
import { ExVerifyForm } from "@/components/verify/ex-verify-form";
import { EX_MODULE_ENUM, handleModuleChange } from "@/utils/module";
import { produce } from "immer";
import { html } from "lit";
import { translate as t } from "lit-i18n";
import { customElement, state } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";

@customElement("ex-register")
export class ExResetPwd extends TailwindElement {
  @state()
  formState: PostUserRegisterParams = {
    email: "",
    password: "",
    confirm: "",
    submit: false,
  };

  setFormState<K extends keyof PostUserRegisterParams>(
    key: K,
    value: PostUserRegisterParams[K],
  ) {
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
    submit: [
      {
        type: "required",
        message:
          "You need to accept out terms of service and privacy policy to create an account",
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

  formRef = createRef<ExForm<PostUserRegisterParams>>();

  verifyRef = createRef<ExVerifyForm>();

  @state()
  step = 1;

  @state()
  verifyConfig = {};

  async handleSubmit() {
    if (this.loading) return;
    switch (this.step) {
      case 1:
        const values = await this.formRef.value?.validate(["email", "submit"]);

        if (values) {
          this.loading = true;

          const res = await postUserRegister(values);
          if (res.statusCode === 200) {
            this.verifyConfig = { email: 1 };
            this.step = 2;
          }
        }
        break;
      case 2:
        const verifyValues = await this.verifyRef.value?.validate();
        if (verifyValues) {
          this.loading = true;

          const res = await postUserRegister(verifyValues);
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

          const data = await postUserRegister(_values);
          if (data.statusCode === 200) {
            handleModuleChange(EX_MODULE_ENUM.Login);
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
          <h2 class="text-2xl font-semibold">Create your account</h2>

          <ex-form-item label="${t("ChvwKWcUtSXzJ2mizkUuK")}" name="email">
            <ex-input placeholder="${t("Q9TWGNX56cwOAyIbH4c7I")}" name="email">
            </ex-input>
          </ex-form-item>

          <ex-form-item name="submit">
            <ex-checkbox>
              I have read and agree to Exworth's
              <a
                class="deco text-primary hover:text-primary/90"
                target="_blank"
                href="/staticcdn/exstatic/pro/documents/TERMS_AND_CONDITIONS.html"
              >
                Terms of Service
              </a>
              and
              <a
                class="text-primary hover:text-primary/90"
                target="_blank"
                href="/staticcdn/exstatic/pro/documents/TERMS_AND_CONDITIONS.html"
              >
                Privacy Policy
              </a>
            </ex-checkbox>
          </ex-form-item>
        `;
      case 2:
        return html`
          <h2 class="text-2xl font-semibold">Check your email</h2>
          <p class="text-gray-500">Please enter the verification code</p>
          <ex-verify-form
            ${ref(this.verifyRef)}
            .verifyConfig=${this.verifyConfig}
            .verifyInformation=${{ email: this.formState.email }}
            .sendCaptcha=${() => postSendRegisterCaptcha()}
          >
          </ex-verify-form>
        `;
      case 3:
        return html` <h2 class="text-2xl font-semibold">Set your password</h2>

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
          </ex-form-item>`;
    }
  }

  render() {
    return html`
      <div class="flex h-full items-center">
        <div class="mx-auto w-full max-w-md">
          <div class="rounded-lg border border-border p-8 mobile:border-none">
            <div class="mb-6 w-40">${AppLogo}</div>

            <ex-form
              ${ref(this.formRef)}
              @change=${(e: CustomEvent) =>
                this.setFormState(e.detail.key, e.detail.value)}
              .formState=${this.formState}
              .rules=${this.rules}
            >
              ${this.renderStepForm()}

              <ex-button
                @click=${this.handleSubmit}
                class="w-full"
                .loading=${this.loading}
              >
                Confirm
              </ex-button>
            </ex-form>
          </div>

          <div class="text-center text-sm text-gray-600 mt-2">
            已经拥有账号？立即
            <app-link .module=${EX_MODULE_ENUM.Login}>
              <h2 class="text-center text-primary hover:text-primary/90">登录</h2>
            </app-link>
          </div>
        </div>
      </div>
    `;
  }
}
