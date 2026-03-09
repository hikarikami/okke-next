<script lang="ts">
	import type { Invoice } from '$lib/types/invoice';

	interface Props {
		invoice: Invoice;
		brandColour: string;
	}

	let { invoice, brandColour }: Props = $props();

	const fmt = (n: number) =>
		n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

	const fmtDate = (d: string) =>
		new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
</script>

<!--
	Modern theme: dark slate header, clean white body, teal accent on totals.
	Intentionally uses inline styles for html2pdf.js compatibility.
-->
<div
	id="invoice-preview"
	style="
		font-family: ui-sans-serif, system-ui, sans-serif;
		font-size: 13px;
		color: #1e293b;
		background: #ffffff;
		max-width: 794px;
		margin: 0 auto;
		box-sizing: border-box;
		line-height: 1.5;
	"
>
	<!-- Dark header -->
	<div style="
		background: #0f172a;
		padding: 36px 48px 28px;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	">
		<!-- Company -->
		<div>
			<div style="font-size: 17px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px; margin-bottom: 12px;">
				{invoice.from.name}
			</div>
			<div style="font-size: 11px; color: #94a3b8; margin-bottom: 2px;">
				<span style="color: #64748b;">Issued</span>
				<span style="color: #cbd5e1; margin-left: 6px;">{fmtDate(invoice.issueDate)}</span>
			</div>
			<div style="font-size: 11px; color: #94a3b8;">
				<span style="color: #64748b;">Due</span>
				<span style="color: #cbd5e1; margin-left: 6px;">{fmtDate(invoice.dueDate)}</span>
			</div>
		</div>

		<!-- Invoice label + number -->
		<div style="text-align: right;">
			<div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #64748b; margin-bottom: 4px;">Invoice</div>
			<div style="font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: -1px;">#{invoice.number}</div>
		</div>
	</div>

	<!-- Body -->
	<div style="padding: 40px 48px;">
		<!-- From / Bill To -->
		<div style="display: flex; gap: 48px; margin-bottom: 40px;">
			<div style="flex: 1;">
				<div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin-bottom: 10px;">From</div>
				<div style="font-weight: 600; color: #0f172a; margin-bottom: 3px;">{invoice.from.name}</div>
				{#if invoice.from.address}
					<div style="white-space: pre-line; color: #64748b; font-size: 12px;">{invoice.from.address}</div>
				{/if}
				{#if invoice.from.email}
					<div style="color: #64748b; font-size: 12px;">{invoice.from.email}</div>
				{/if}
				{#if invoice.from.phone}
					<div style="color: #64748b; font-size: 12px;">{invoice.from.phone}</div>
				{/if}
			</div>

			<div style="flex: 1;">
				<div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin-bottom: 10px;">Bill To</div>
				<div style="font-weight: 600; color: #0f172a; margin-bottom: 3px;">{invoice.billTo.name}</div>
				{#if invoice.billTo.address}
					<div style="white-space: pre-line; color: #64748b; font-size: 12px;">{invoice.billTo.address}</div>
				{/if}
				{#if invoice.billTo.email}
					<div style="color: #64748b; font-size: 12px;">{invoice.billTo.email}</div>
				{/if}
			</div>
		</div>

		<!-- Line items table -->
		<table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
			<thead>
				<tr>
					<th style="text-align: left; padding: 10px 0; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; border-bottom: 2px solid #e2e8f0;">Description</th>
					<th style="text-align: right; padding: 10px 0; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; border-bottom: 2px solid #e2e8f0; width: 60px;">Qty</th>
					<th style="text-align: right; padding: 10px 0; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; border-bottom: 2px solid #e2e8f0; width: 100px;">Unit Price</th>
					<th style="text-align: right; padding: 10px 0; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; border-bottom: 2px solid #e2e8f0; width: 100px;">Total</th>
				</tr>
			</thead>
			<tbody>
				{#each invoice.lineItems as item (item.id)}
					<tr>
						<td style="padding: 12px 0; color: #334155; border-bottom: 1px solid #f1f5f9;">{item.description}</td>
						<td style="padding: 12px 0; text-align: right; color: #64748b; border-bottom: 1px solid #f1f5f9;">{item.quantity}</td>
						<td style="padding: 12px 0; text-align: right; color: #64748b; border-bottom: 1px solid #f1f5f9;">${fmt(item.unitPrice)}</td>
						<td style="padding: 12px 0; text-align: right; font-weight: 500; color: #334155; border-bottom: 1px solid #f1f5f9;">${fmt(item.total)}</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<!-- Totals -->
		<div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
			<div style="min-width: 240px;">
				<div style="display: flex; justify-content: space-between; padding: 5px 0; font-size: 13px; color: #64748b;">
					<span>Subtotal</span>
					<span>${fmt(invoice.subtotal)}</span>
				</div>
				{#if invoice.taxEnabled}
					<div style="display: flex; justify-content: space-between; padding: 5px 0; font-size: 13px; color: #64748b; border-bottom: 1px solid #e2e8f0;">
						<span>Tax ({invoice.taxRate}%)</span>
						<span>${fmt(invoice.taxAmount)}</span>
					</div>
				{:else}
					<div style="border-bottom: 1px solid #e2e8f0; margin-top: 5px;"></div>
				{/if}
				<div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0 6px;">
					<span style="font-size: 14px; font-weight: 700; color: #0f172a;">Total</span>
					<span style="font-size: 20px; font-weight: 800; color: {brandColour};">${fmt(invoice.total)}</span>
				</div>
			</div>
		</div>

		<!-- Notes / Payment Terms -->
		{#if invoice.notes || invoice.paymentTerms}
			<div style="display: flex; gap: 40px; border-top: 1px solid #e2e8f0; padding-top: 24px;">
				{#if invoice.notes}
					<div style="flex: 1;">
						<div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin-bottom: 6px;">Notes</div>
						<div style="font-size: 12px; color: #64748b; white-space: pre-line;">{invoice.notes}</div>
					</div>
				{/if}
				{#if invoice.paymentTerms}
					<div style="flex: 1;">
						<div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin-bottom: 6px;">Payment Details</div>
						<div style="font-size: 12px; color: #64748b; white-space: pre-line;">{invoice.paymentTerms}</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
