import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import TailwindElement from '../components/tailwind-element.ts';

import '../components/ui/table.ts';

@customElement('table-page')
export class TablePage extends TailwindElement {
    private invoices = [
        {
          invoice: "INV001",
          paymentStatus: "Paid",
          totalAmount: "$250.00",
          paymentMethod: "Credit Card",
        },
        {
          invoice: "INV002",
          paymentStatus: "Pending",
          totalAmount: "$150.00",
          paymentMethod: "PayPal",
        },
        {
          invoice: "INV003",
          paymentStatus: "Unpaid",
          totalAmount: "$350.00",
          paymentMethod: "Bank Transfer",
        },
    ];

    render() {
        return html`
            <div class="p-4 space-y-8">
                <h1 class="text-3xl font-bold">Table</h1>
                
                <shadcn-lit-table>
                    <shadcn-lit-table-caption>A list of your recent invoices.</shadcn-lit-table-caption>
                    <shadcn-lit-table-header>
                        <shadcn-lit-table-row>
                            <shadcn-lit-table-head>Invoice</shadcn-lit-table-head>
                            <shadcn-lit-table-head>Status</shadcn-lit-table-head>
                            <shadcn-lit-table-head>Method</shadcn-lit-table-head>
                            <shadcn-lit-table-head style="text-align: right;">Amount</shadcn-lit-table-head>
                        </shadcn-lit-table-row>
                    </shadcn-lit-table-header>
                    <shadcn-lit-table-body>
                        ${this.invoices.map(invoice => html`
                            <shadcn-lit-table-row>
                                <shadcn-lit-table-cell style="font-weight: 500;">${invoice.invoice}</shadcn-lit-table-cell>
                                <shadcn-lit-table-cell>${invoice.paymentStatus}</shadcn-lit-table-cell>
                                <shadcn-lit-table-cell>${invoice.paymentMethod}</shadcn-lit-table-cell>
                                <shadcn-lit-table-cell style="text-align: right;">${invoice.totalAmount}</shadcn-lit-table-cell>
                            </shadcn-lit-table-row>
                        `)}
                    </shadcn-lit-table-body>
                </shadcn-lit-table>
            </div>
        `;
    }
} 