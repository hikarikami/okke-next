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
	Minimal theme: monochrome, all typography, maximum whitespace.
	Intentionally uses inline styles for html2pdf.js compatibility.
-->
<div
	id="invoice-preview"
	style="
		font-family: ui-sans-serif, system-ui, sans-serif;
		font-size: 13px;
		color: #111827;
		background: #ffffff;
		padding: 56px 64px;
		max-width: 794px;
		margin: 0 auto;
		box-sizing: border-box;
		line-height: 1.6;
	"
>
	<!-- Header -->
	<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px;">
		<!-- Company name -->
		<div>
			<div style="font-size: 18px; font-weight: 700; color: #111827; letter-spacing: -0.4px;">
				{invoice.from.name}
			</div>
		</div>

		<!-- Invoice label + number + dates -->
		<div style="text-align: right;">
			<div style="font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: #9ca3af; margin-bottom: 4px;">Invoice</div>
			<div style="font-size: 22px; font-weight: 700; color: {brandColour}; letter-spacing: -0.5px; margin-bottom: 10px;">
				{invoice.number}
			</div>
			<div style="font-size: 11px; color: #9ca3af; margin-bottom: 2px;">
				Issued <span style="color: #6b7280;">{fmtDate(invoice.issueDate)}</span>
			</div>
			<div style="font-size: 11px; color: #9ca3af;">
				Due <span style="color: #6b7280;">{fmtDate(invoice.dueDate)}</span>
			</div>
		</div>
	</div>

	<!-- Thin rule -->
	<div style="border-top: 1px solid #e5e7eb; margin-bottom: 40px;"></div>

	<!-- From / Bill To -->
	<div style="display: flex; gap: 64px; margin-bottom: 48px;">
		<div style="flex: 1;">
			<div style="font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #d1d5db; margin-bottom: 10px;">From</div>
			<div style="font-weight: 600; color: #111827; margin-bottom: 4px;">{invoice.from.name}</div>
			{#if invoice.from.address}
				<div style="white-space: pre-line; color: #6b7280; font-size: 12px;">{invoice.from.address}</div>
			{/if}
			{#if invoice.from.email}
				<div style="color: #6b7280; font-size: 12px;">{invoice.from.email}</div>
			{/if}
			{#if invoice.from.phone}
				<div style="color: #6b7280; font-size: 12px;">{invoice.from.phone}</div>
			{/if}
		</div>

		<div style="flex: 1;">
			<div style="font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #d1d5db; margin-bottom: 10px;">Bill To</div>
			<div style="font-weight: 600; color: #111827; margin-bottom: 4px;">{invoice.billTo.name}</div>
			{#if invoice.billTo.address}
				<div style="white-space: pre-line; color: #6b7280; font-size: 12px;">{invoice.billTo.address}</div>
			{/if}
			{#if invoice.billTo.email}
				<div style="color: #6b7280; font-size: 12px;">{invoice.billTo.email}</div>
			{/if}
		</div>
	</div>

	<!-- Thin rule -->
	<div style="border-top: 1px solid #e5e7eb; margin-bottom: 0;"></div>

	<!-- Line items table -->
	<table style="width: 100%; border-collapse: collapse; margin-bottom: 0;">
		<thead>
			<tr>
				<th style="text-align: left; padding: 12px 0; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #d1d5db; border-bottom: 1px solid #f3f4f6;">Description</th>
				<th style="text-align: right; padding: 12px 0; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #d1d5db; border-bottom: 1px solid #f3f4f6; width: 60px;">Qty</th>
				<th style="text-align: right; padding: 12px 0; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #d1d5db; border-bottom: 1px solid #f3f4f6; width: 100px;">Unit Price</th>
				<th style="text-align: right; padding: 12px 0; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #d1d5db; border-bottom: 1px solid #f3f4f6; width: 100px;">Total</th>
			</tr>
		</thead>
		<tbody>
			{#each invoice.lineItems as item (item.id)}
				<tr>
					<td style="padding: 13px 0; color: #374151; border-bottom: 1px solid #f9fafb;">{item.description}</td>
					<td style="padding: 13px 0; text-align: right; color: #9ca3af; border-bottom: 1px solid #f9fafb;">{item.quantity}</td>
					<td style="padding: 13px 0; text-align: right; color: #9ca3af; border-bottom: 1px solid #f9fafb;">${fmt(item.unitPrice)}</td>
					<td style="padding: 13px 0; text-align: right; color: #374151; border-bottom: 1px solid #f9fafb;">${fmt(item.total)}</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<!-- Thin rule -->
	<div style="border-top: 1px solid #e5e7eb; margin-bottom: 24px;"></div>

	<!-- Totals -->
	<div style="display: flex; justify-content: flex-end; margin-bottom: 48px;">
		<div style="min-width: 220px;">
			<div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; color: #9ca3af;">
				<span>Subtotal</span>
				<span>${fmt(invoice.subtotal)}</span>
			</div>
			{#if invoice.taxEnabled}
				<div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; color: #9ca3af;">
					<span>Tax ({invoice.taxRate}%)</span>
					<span>${fmt(invoice.taxAmount)}</span>
				</div>
			{/if}
			<div style="border-top: 1px solid #e5e7eb; margin: 8px 0;"></div>
			<div style="display: flex; justify-content: space-between; padding: 4px 0;">
				<span style="font-size: 14px; font-weight: 700; color: #111827;">Total</span>
				<span style="font-size: 14px; font-weight: 700; color: {brandColour};">${fmt(invoice.total)}</span>
			</div>
		</div>
	</div>

	<!-- Notes / Payment Terms -->
	{#if invoice.notes || invoice.paymentTerms}
		<div style="border-top: 1px solid #e5e7eb; padding-top: 32px; display: flex; gap: 48px;">
			{#if invoice.notes}
				<div style="flex: 1;">
					<div style="font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #d1d5db; margin-bottom: 8px;">Notes</div>
					<div style="font-size: 12px; color: #6b7280; white-space: pre-line;">{invoice.notes}</div>
				</div>
			{/if}
			{#if invoice.paymentTerms}
				<div style="flex: 1;">
					<div style="font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #d1d5db; margin-bottom: 8px;">Payment Details</div>
					<div style="font-size: 12px; color: #6b7280; white-space: pre-line;">{invoice.paymentTerms}</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
