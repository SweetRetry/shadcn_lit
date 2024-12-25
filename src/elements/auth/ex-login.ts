import "@/components/ui/ex-form/element";
import "@/components/ui/ex-input";
import "@/components/ui/ex-upload";

import { postUserLogin } from "@/api/user";
import TailwindElement from "@/components/tailwind-element";
import { ExForm } from "@/components/ui/ex-form/element";

import { themeContext, ThemeContextProvide } from "@/providers/theme-provider";
import { EX_MODULE_ENUM, handleModuleChange } from "@/utils/module";
import { consume } from "@lit/context";
import { html } from "lit";
import { translate as t } from "lit-i18n";
import { customElement, state } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";

@customElement("ex-login")
export class ExLogin extends TailwindElement {
  @state()
  formState = {
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

  @consume({ context: themeContext })
  themeInject?: ThemeContextProvide;

  formRef = createRef<
    ExForm<{
      email: string;
      password: string;
    }>
  >();

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
        <div class="mx-auto w-full max-w-lg rounded border border-border p-8">
          <h2 class="mb-6 text-2xl font-bold">${t("NlTvgznX0BryVIMKQOY7G")}</h2>

          <ex-form
            ${ref(this.formRef)}
            .formState=${this.formState}
            .rules=${this.rules}
          >
            <ex-form-item
              label="${t("ChvwKWcUtSXzJ2mizkUuK")}"
              name="email"
            >
              <ex-input
                placeholder="${t("Q9TWGNX56cwOAyIbH4c7I")}"
                name="email"
              >
              </ex-input>
            </ex-form-item>

            <ex-form-item
              label="${t("ArS2AzZCVnCvXrzxGHMu3")}"
              name="password"
            >
              <ex-input
                placeholder="${t("fMBGcHZ74F6D_S3-bF3cP")}"
                type="password"
                name="password"
              >
              </ex-input>
            </ex-form-item>

            <ex-button
              @click=${this.handleSubmit}
              class="mt-6 w-full"
              .loading=${this.loading}
            >
              ${t("NlTvgznX0BryVIMKQOY7G")}
            </ex-button>
          </ex-form>
        </div>
      </div>
    `;
  }
}
