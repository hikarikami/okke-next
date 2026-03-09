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
	Bold theme: teal sidebar on left, white content on right.
	Intentionally uses inline styles for html2pdf.js compatibility.
-->
<div
	id="invoice-preview"
	style="
		font-family: ui-sans-serif, system-ui, sans-serif;
		font-size: 13px;
		color: #1a1a2e;
		background: #ffffff;
		max-width: 794px;
		margin: 0 auto;
		box-sizing: border-box;
		line-height: 1.5;
		display: flex;
		min-height: 400px;
	"
>
	<!-- Sidebar -->
	<div style="
		width: 200px;
		min-width: 200px;
		background: {brandColour};
		padding: 48px 28px;
		display: flex;
		flex-direction: column;
	">
		<!-- Initial avatar -->
		<div style="
			width: 56px; height: 56px;
			background: rgba(255,255,255,0.2);
			border-radius: 50%;
			display: flex; align-items: center; justify-content: center;
			margin-bottom: 16px;
		">
			<span style="color: #ffffff; font-weight: 800; font-size: 24px;">
				{invoice.from.name.charAt(0).toUpperCase()}
			</span>
		</div>

		<!-- Company name -->
		<div style="font-size: 13px; font-weight: 700; color: #ffffff; margin-bottom: 32px; line-height: 1.3;">
			{invoice.from.name}
		</div>

		<!-- Divider -->
		<div style="border-top: 1px solid rgba(255,255,255,0.25); margin-bottom: 24px;"></div>

		<!-- Invoice label -->
		<div style="font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: rgba(255,255,255,0.6); margin-bottom: 4px;">Invoice</div>
		<div style="font-size: 16px; font-weight: 800; color: #ffffff; margin-bottom: 32px; letter-spacing: -0.3px;">
			{invoice.number}
		</div>

		<!-- Dates -->
		<div style="margin-bottom: 12px;">
			<div style="font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.5); margin-bottom: 2px;">Issued</div>
			<div style="font-size: 11px; color: rgba(255,255,255,0.9);">{fmtDate(invoice.issueDate)}</div>
		</div>
		<div>
			<div style="font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.5); margin-bottom: 2px;">Due</div>
			<div style="font-size: 11px; color: rgba(255,255,255,0.9);">{fmtDate(invoice.dueDate)}</div>
		</div>
	</div>

	<!-- Main content -->
	<div style="flex: 1; padding: 48px 40px; display: flex; flex-direction: column;">
		<!-- From / Bill To -->
		<div style="display: flex; gap: 32px; margin-bottom: 40px;">
			<div style="flex: 1;">
				<div style="font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: {brandColour}; margin-bottom: 8px;">From</div>
				<div style="font-weight: 600; color: #111827; margin-bottom: 3px;">{invoice.from.name}</div>
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
				<div style="font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: {brandColour}; margin-bottom: 8px;">Bill To</div>
				<div style="font-weight: 600; color: #111827; margin-bottom: 3px;">{invoice.billTo.name}</div>
				{#if invoice.billTo.address}
					<div style="white-space: pre-line; color: #6b7280; font-size: 12px;">{invoice.billTo.address}</div>
				{/if}
				{#if invoice.billTo.email}
					<div style="color: #6b7280; font-size: 12px;">{invoice.billTo.email}</div>
				{/if}
			</div>
		</div>

		<!-- Line items table -->
		<table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
			<thead>
				<tr style="background: #f8fafc;">
					<th style="text-align: left; padding: 10px 12px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: {brandColour};">Description</th>
					<th style="text-align: right; padding: 10px 12px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: {brandColour}; width: 50px;">Qty</th>
					<th style="text-align: right; padding: 10px 12px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: {brandColour}; width: 90px;">Unit Price</th>
					<th style="text-align: right; padding: 10px 12px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: {brandColour}; width: 90px;">Total</th>
				</tr>
			</thead>
			<tbody>
				{#each invoice.lineItems as item (item.id)}
					<tr>
						<td style="padding: 11px 12px; color: #374151; border-bottom: 1px solid #f3f4f6;">{item.description}</td>
						<td style="padding: 11px 12px; text-align: right; color: #6b7280; border-bottom: 1px solid #f3f4f6;">{item.quantity}</td>
						<td style="padding: 11px 12px; text-align: right; color: #6b7280; border-bottom: 1px solid #f3f4f6;">${fmt(item.unitPrice)}</td>
						<td style="padding: 11px 12px; text-align: right; font-weight: 500; color: #374151; border-bottom: 1px solid #f3f4f6;">${fmt(item.total)}</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<!-- Totals -->
		<div style="display: flex; justify-content: flex-end; margin-bottom: 32px;">
			<div style="min-width: 220px;">
				<div style="display: flex; justify-content: space-between; padding: 5px 0; font-size: 12px; color: #6b7280;">
					<span>Subtotal</span>
					<span>${fmt(invoice.subtotal)}</span>
				</div>
				{#if invoice.taxEnabled}
					<div style="display: flex; justify-content: space-between; padding: 5px 0; font-size: 12px; color: #6b7280;">
						<span>Tax ({invoice.taxRate}%)</span>
						<span>${fmt(invoice.taxAmount)}</span>
					</div>
				{/if}
				<div style="border-top: 2px solid {brandColour}; margin: 8px 0;"></div>
				<div style="display: flex; justify-content: space-between; padding: 4px 0;">
					<span style="font-size: 14px; font-weight: 700; color: #111827;">Total</span>
					<span style="font-size: 16px; font-weight: 800; color: {brandColour};">${fmt(invoice.total)}</span>
				</div>
			</div>
		</div>

		<!-- Notes / Payment Terms -->
		{#if invoice.notes || invoice.paymentTerms}
			<div style="border-top: 1px solid #e5e7eb; padding-top: 24px; display: flex; gap: 32px; margin-top: auto;">
				{#if invoice.notes}
					<div style="flex: 1;">
						<div style="font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: {brandColour}; margin-bottom: 6px;">Notes</div>
						<div style="font-size: 12px; color: #6b7280; white-space: pre-line;">{invoice.notes}</div>
					</div>
				{/if}
				{#if invoice.paymentTerms}
					<div style="flex: 1;">
						<div style="font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: {brandColour}; margin-bottom: 6px;">Payment Details</div>
						<div style="font-size: 12px; color: #6b7280; white-space: pre-line;">{invoice.paymentTerms}</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
