import "@/components/ui/ex-form/ex-form";
import "@/components/ui/ex-input";
import "@/components/ui/ex-upload";

import { postUserLogin } from "@/api/user";
import TailwindElement from "@/components/tailwind-element";
import { ExForm } from "@/components/ui/ex-form/ex-form";

import { PostUserLoginParams } from "@/api/user/types";
import { EX_MODULE_ENUM, handleModuleChange } from "@/utils/module";
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
  };

  @state()
  loading = false;

  formRef = createRef<ExForm<PostUserLoginParams>>();

  async handleSubmit() {
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
        <div class="mx-auto w-full max-w-sm p-4">
          <h2 class="mb-6 text-center text-2xl font-bold">
            ${t("FQg_sRfHOfB_zIKXXU2Ae")}
          </h2>

          <ex-form
            ${ref(this.formRef)}
            .formState=${this.formState}
            .rules=${this.rules}
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
                  class="text-primary hover:text-primary/90"
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

            <p class="mt-6 text-center text-sm">
              ${t("9pWhvPa9ZuGel4sLL8shr")}
              <a
                class="font-semibold text-primary hover:text-primary/90"
                @click=${() => handleModuleChange(EX_MODULE_ENUM.Register)}
              >
                ${t("wl1Ykc8yBKy9VxMsaOsVd")}
              </a>
            </p>
          </ex-form>
        </div>
      </div>
    `;
  }
}
