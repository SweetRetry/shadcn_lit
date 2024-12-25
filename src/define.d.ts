import { ExForm, ExFormItem } from "./components/ui/ex-form/element";
import { ExSelect } from "./components/ui/ex-select";

declare global {
  interface HTMLElementTagNameMap {
    "ex-form": ExForm;
    "ex-form-item": ExFormItem;
    "ex-select": ExSelect;
  }
}
