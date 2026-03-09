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

<div
	id="invoice-preview"
	style="
		font-family: ui-sans-serif, system-ui, sans-serif;
		font-size: 13px;
		color: #1a1a2e;
		background: #ffffff;
		padding: 48px 56px;
		max-width: 794px;
		margin: 0 auto;
		box-sizing: border-box;
		line-height: 1.5;
	"
>
	<!-- Header -->
	<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px;">
		<div style="display: flex; align-items: center; gap: 10px;">
			<div style="
				width: 40px; height: 40px;
				background: {brandColour};
				border-radius: 8px;
				display: flex; align-items: center; justify-content: center;
			">
				<span style="color: #fff; font-weight: 700; font-size: 16px;">
					{invoice.from.name.charAt(0).toUpperCase()}
				</span>
			</div>
			<span style="font-size: 15px; font-weight: 600; color: #1a1a2e;">
				{invoice.from.name}
			</span>
		</div>

		<div style="text-align: right;">
			<div style="font-size: 26px; font-weight: 700; color: #1a1a2e; letter-spacing: -0.5px;">INVOICE</div>
			<div style="font-size: 14px; color: {brandColour}; font-weight: 600; margin-top: 2px;">
				#{invoice.number}
			</div>
			<div style="margin-top: 8px; font-size: 12px; color: #6b7280;">
				<span style="display: inline-block; margin-right: 16px;">
					<span style="color: #9ca3af;">Issued:</span>
					<span style="color: #374151; font-weight: 500; margin-left: 4px;">{fmtDate(invoice.issueDate)}</span>
				</span>
				<span style="display: inline-block;">
					<span style="color: #9ca3af;">Due:</span>
					<span style="color: #374151; font-weight: 500; margin-left: 4px;">{fmtDate(invoice.dueDate)}</span>
				</span>
			</div>
		</div>
	</div>

	<!-- Divider -->
	<div style="border-top: 2px solid {brandColour}; margin-bottom: 32px;"></div>

	<!-- From / Bill To -->
	<div style="display: flex; gap: 40px; margin-bottom: 40px;">
		<div style="flex: 1;">
			<div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; margin-bottom: 8px;">From</div>
			<div style="font-weight: 600; color: #1a1a2e; margin-bottom: 4px;">{invoice.from.name}</div>
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
			<div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; margin-bottom: 8px;">Bill To</div>
			<div style="font-weight: 600; color: #1a1a2e; margin-bottom: 4px;">{invoice.billTo.name}</div>
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
			<tr style="background: #f3f4f6;">
				<th style="text-align: left; padding: 10px 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Description</th>
				<th style="text-align: right; padding: 10px 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #6b7280; border-bottom: 1px solid #e5e7eb; width: 70px;">Qty</th>
				<th style="text-align: right; padding: 10px 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #6b7280; border-bottom: 1px solid #e5e7eb; width: 100px;">Unit Price</th>
				<th style="text-align: right; padding: 10px 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #6b7280; border-bottom: 1px solid #e5e7eb; width: 100px;">Total</th>
			</tr>
		</thead>
		<tbody>
			{#each invoice.lineItems as item, i (item.id)}
				<tr style="background: {i % 2 === 1 ? '#f9fafb' : '#ffffff'};">
					<td style="padding: 11px 12px; color: #374151; border-bottom: 1px solid #f3f4f6;">{item.description}</td>
					<td style="padding: 11px 12px; text-align: right; color: #6b7280; border-bottom: 1px solid #f3f4f6;">{item.quantity}</td>
					<td style="padding: 11px 12px; text-align: right; color: #6b7280; border-bottom: 1px solid #f3f4f6;">${fmt(item.unitPrice)}</td>
					<td style="padding: 11px 12px; text-align: right; font-weight: 500; color: #374151; border-bottom: 1px solid #f3f4f6;">${fmt(item.total)}</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<!-- Totals -->
	<div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
		<div style="min-width: 240px;">
			<div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #6b7280;">
				<span>Subtotal</span>
				<span>${fmt(invoice.subtotal)}</span>
			</div>
			{#if invoice.taxEnabled}
				<div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #6b7280; border-bottom: 1px solid #e5e7eb;">
					<span>Tax ({invoice.taxRate}%)</span>
					<span>${fmt(invoice.taxAmount)}</span>
				</div>
			{:else}
				<div style="border-bottom: 1px solid #e5e7eb;"></div>
			{/if}
			<div style="display: flex; justify-content: space-between; padding: 10px 0 6px; font-size: 15px; font-weight: 700; color: #1a1a2e;">
				<span>Total</span>
				<span style="color: {brandColour};">${fmt(invoice.total)}</span>
			</div>
		</div>
	</div>

	<!-- Notes / Payment Terms -->
	{#if invoice.notes || invoice.paymentTerms}
		<div style="display: flex; gap: 40px; border-top: 1px solid #e5e7eb; padding-top: 24px;">
			{#if invoice.notes}
				<div style="flex: 1;">
					<div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; margin-bottom: 6px;">Notes</div>
					<div style="font-size: 12px; color: #6b7280; white-space: pre-line;">{invoice.notes}</div>
				</div>
			{/if}
			{#if invoice.paymentTerms}
				<div style="flex: 1;">
					<div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; margin-bottom: 6px;">Payment Details</div>
					<div style="font-size: 12px; color: #6b7280; white-space: pre-line;">{invoice.paymentTerms}</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
