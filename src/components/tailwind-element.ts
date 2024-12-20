import { css, LitElement, unsafeCSS } from "lit";
import tailwindStyles from "../styles/tailwind.css?inline";

export default class TailwindElement extends LitElement {
  static styles = [
    css`
      ${unsafeCSS(tailwindStyles)}
    `,
  ];
}
