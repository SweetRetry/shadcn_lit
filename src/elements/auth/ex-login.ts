import "@/components/common/app-link";
import "@/components/ui/ex-form/ex-form";
import "@/components/ui/ex-input";
import "@/components/ui/ex-upload";

import { postUserLogin } from "@/api/auth";
import TailwindElement from "@/components/tailwind-element";
import { ExForm } from "@/components/ui/ex-form/ex-form";

import { PostUserLoginParams } from "@/api/auth/types";
import { AppLogo } from "@/components/common/app-logo";
import { EX_MODULE_ENUM, handleModuleChange } from "@/utils/module";
import { produce } from "immer";
import { html } from "lit";
import { translate as t } from "lit-i18n";
import { customElement, state } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";

@customElement("ex-login")
export class ExLogin extends TailwindElement {
  @state()
  formState: PostUserLoginParams = {
    email: "",
    password: "",
  };

  rules = {
    email: [
      {
        type: "required",
        message: t("efWh8Lmsk4F7uYC76LiFg"),
      },
      {
        type: "email",
        message: "請輸入正確的郵箱地址",
      },
    ],

    password: [
      {
        type: "required",
        message: t("lGsrMtXGUODjwRq0S6SBt"),
      },
    ],
  };

  @state()
  loading = false;

  formRef = createRef<ExForm<PostUserLoginParams>>();

  async handleSubmit() {
    if (this.loading) return;
    const values = await this.formRef?.value?.validate();

    if (values) {
      this.loading = true;
      const data = await postUserLogin(values);

      if (data.statusCode === 200) {
        handleModuleChange(EX_MODULE_ENUM.Wallet);
      }
      this.loading = false;
    }
  }
  render() {
    return html`
      <div class="flex h-full items-center">
        <div class="mx-auto w-full max-w-md">
          <div class="rounded-lg border border-border p-8 mobile:border-none">
            <div class="w-40">${AppLogo}</div>
            <h2 class="my-6 text-2xl font-bold">
              ${t("3ZWnotiAjXAIshLbWfxiX")}
            </h2>

            <ex-form
              ${ref(this.formRef)}
              .formState=${this.formState}
              .rules=${this.rules}
              @change=${(e: CustomEvent) => {
                this.formState = produce(this.formState, (draft) => {
                  draft[e.detail.key as keyof PostUserLoginParams] =
                    e.detail.value;
                });
              }}
            >
              <ex-form-item label="${t("ChvwKWcUtSXzJ2mizkUuK")}" name="email">
                <ex-input
                  placeholder="${t("Q9TWGNX56cwOAyIbH4c7I")}"
                  name="email"
                >
                </ex-input>
              </ex-form-item>

              <ex-form-item name="password">
                <div class="flex justify-between" slot="label">
                  <label> ${t("ArS2AzZCVnCvXrzxGHMu3")} </label>
                  <a
                    class="cursor-pointer text-primary hover:text-primary/90"
                    @click=${() => handleModuleChange(EX_MODULE_ENUM.ResetPwd)}
                  >
                    ${t("e4bvRe_uOA4OucRujrbuw")}
                  </a>
                </div>
                <ex-input
                  placeholder="${t("fMBGcHZ74F6D_S3-bF3cP")}"
                  type="password"
                  name="password"
                >
                </ex-input>
              </ex-form-item>

              <ex-button
                @click=${this.handleSubmit}
                class="w-full"
                .loading=${this.loading}
              >
                ${t("NlTvgznX0BryVIMKQOY7G")}
              </ex-button>
            </ex-form>
          </div>

          <div class="text-center text-sm mt-2">
            ${t("9pWhvPa9ZuGel4sLL8shr")}
            <app-link .module=${EX_MODULE_ENUM.Register}>
              <p
                class="cursor-pointer font-semibold text-primary hover:text-primary/90"
              >
                ${t("wl1Ykc8yBKy9VxMsaOsVd")}
              </p>
            </app-link>
          </div>
        </div>
      </div>
    `;
  }
}
