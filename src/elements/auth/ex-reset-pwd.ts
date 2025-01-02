import "@/components/common/app-link";
import "@/components/ui/ex-form/ex-form";
import "@/components/ui/ex-input";
import "@/components/ui/ex-upload";
import "@/components/verify/ex-verify-form";

import { postResetUserPwd } from "@/api/user";
import TailwindElement from "@/components/tailwind-element";
import { ExForm } from "@/components/ui/ex-form/ex-form";

import { PostResetPwdParams } from "@/api/user/types";
import { message } from "@/components/ui/ex-message/helper";
import { ExVerifyForm, VerifyConfig } from "@/components/verify/ex-verify-form";
import { EX_MODULE_ENUM, handleModuleChange } from "@/utils/module";
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
            handleModuleChange(EX_MODULE_ENUM.Login);
            message.show("重置密码成功");
          }
        }
        break;
    }
    this.loading = false;
  }

  renderStepForm() {
    switch (this.step) {
      case 1:
        return html` <ex-form-item
          label="${t("ChvwKWcUtSXzJ2mizkUuK")}"
          name="email"
        >
          <ex-input placeholder="${t("Q9TWGNX56cwOAyIbH4c7I")}" name="email">
          </ex-input>
        </ex-form-item>`;
      case 2:
        return html`
          <ex-verify-form
            ${ref(this.verifyRef)}
            .verifyConfig=${this.verifyConfig}
          >
          </ex-verify-form>
        `;
      case 3:
        return html` <ex-form-item name="password" label="密碼">
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
        <div class="mx-auto w-full max-w-sm p-4">
          <div class="mb-4">
            <app-link .module=${EX_MODULE_ENUM.Login}>
              <h2 class="text-center text-lg font-semibold">
                ${t("FQg_sRfHOfB_zIKXXU2Ae")}
              </h2>
            </app-link>
          </div>

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
              重置
            </ex-button>
          </ex-form>
        </div>
      </div>
    `;
  }
}
