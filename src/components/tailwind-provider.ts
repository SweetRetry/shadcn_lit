import { css, LitElement, unsafeCSS } from "lit";
import tailwindStyles from "../styles/tailwind.css?inline";

export default class TailwindProvider extends LitElement {
  constructor() {
    super();
  }
  
  static styles = [
    css`
      ${unsafeCSS(tailwindStyles)}
    `,
  ];
}