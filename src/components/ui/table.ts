import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import TailwindElement from "../tailwind-element";

@customElement("shadcn-lit-table")
export class ShadcnLitTable extends TailwindElement {
  static styles = [
    ...TailwindElement.styles,
    css`
      :host {
        display: block;
        width: 100%;
      }
      .table-container {
        position: relative;
        width: 100%;
        overflow: auto;
        border-radius: calc(var(--shadcn-lit-radius) - 2px);
        border: 1px solid hsl(var(--shadcn-lit-border));
      }
      table {
        width: 100%;
        caption-side: bottom;
        font-size: 0.875rem;
        border-collapse: collapse;
        border-spacing: 0;
        background-color: hsl(var(--shadcn-lit-background));
      }
    `
  ];

  render() {
    return html`<div class="table-container">
      <table>
        <slot></slot>
      </table>
    </div>`;
  }
}

@customElement("shadcn-lit-table-header")
export class ShadcnLitTableHeader extends TailwindElement {
  static styles = [
    ...TailwindElement.styles,
    css`
      :host {
        display: table-header-group;
        width: 100%;
      }

      thead tr {
        border-bottom: 1px solid hsl(var(--shadcn-lit-border));
      }
    `
  ];

  render() {
    return html`<thead class='bg-muted/30'><slot></slot></thead>`;
  }
}

@customElement("shadcn-lit-table-body")
export class ShadcnLitTableBody extends TailwindElement {
  static styles = [
    ...TailwindElement.styles,
    css`
      :host {
        display: table-row-group;
        width: 100%;
      }
    `
  ];

  render() {
    return html`<tbody><slot></slot></tbody>`;
  }
}

@customElement("shadcn-lit-table-footer")
export class ShadcnLitTableFooter extends TailwindElement {
  static styles = [
    ...TailwindElement.styles,
    css`
      :host {
        display: table-footer-group;
        width: 100%;
      }
      tfoot {
        border-top: 1px solid hsl(var(--shadcn-lit-border));
        background-color: hsl(var(--shadcn-lit-muted) / 0.5);
        font-weight: 500;
      }
    `
  ];

  render() {
    return html`<tfoot><slot></slot></tfoot>`
  }
}

@customElement("shadcn-lit-table-row")
export class ShadcnLitTableRow extends TailwindElement {
  static styles = [
    ...TailwindElement.styles,
    css`
      :host {
        display: block;
        width: 100%;
      }
      tr {
        width: 100%;
        display: block;
        border-bottom: 1px solid hsl(var(--shadcn-lit-border));
        transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      tr:hover {
        background-color: hsl(var(--shadcn-lit-muted) / 0.5);
      }
      tr:last-child {
        border-bottom: none;
      }
      tr[data-state="selected"] {
        background-color: hsl(var(--shadcn-lit-muted));
      }
    `
  ];

  render() {
    return html`<tr>
      <slot></slot>
    </tr>`;
  }
}

@customElement("shadcn-lit-table-head")
export class ShadcnLitTableHead extends TailwindElement {
  static styles = [
    ...TailwindElement.styles,
    css`
      :host {
        display: table-cell;
        width: auto;
      }
      th {
        height: 3rem;
        padding: 0 1rem;
        text-align: left;
        vertical-align: middle;
        font-weight: 500;
        color: hsl(var(--shadcn-lit-muted-foreground));
        font-size: 0.875rem;
        width: 100%;
      }
      th:has([role="checkbox"]) {
        padding-right: 0;
      }
    `
  ];

  render() {
    return html`<th><slot></slot></th>`
  }
}

@customElement("shadcn-lit-table-cell")
export class ShadcnLitTableCell extends TailwindElement {
  static styles = [
    ...TailwindElement.styles,
    css`
      :host {
        display: table-cell;
        width: auto;
      }
      td {
        padding: 1rem;
        vertical-align: middle;
        color: hsl(var(--shadcn-lit-foreground));
        width: 100%;
      }
      td:has([role="checkbox"]) {
        padding-right: 0;
      }
    `
  ];

  render() {
    return html`<td><slot></slot></td>`
  }
}

@customElement("shadcn-lit-table-caption")
export class ShadcnLitTableCaption extends TailwindElement {
  static styles = [
    ...TailwindElement.styles,
    css`
      :host {
        display: table-caption;
        width: 100%;
      }
      caption {
        margin-top: 1rem;
        font-size: 0.875rem;
        color: hsl(var(--shadcn-lit-muted-foreground));
        caption-side: bottom;
        width: 100%;
      }
    `
  ];

  render() {
    return html`<caption><slot></slot></caption>`
  }
}
