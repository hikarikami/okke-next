<script lang="ts">
	
	let { data } = $props();
	import InvoiceTemplate from '$lib/components/InvoiceTemplate.svelte';
	import { ArrowLeft, Download, Printer, Clock, Send, Pencil } from 'lucide-svelte';

	const invoice = data.invoice;
	const invoiceTheme = data.invoiceTheme;
	const brandColour = data.brandColour;

	async function downloadPdf() {
		if (!invoice) return;
		const pkg = 'html2pdf.js';
		const { default: html2pdf } = await import(pkg);
		const el = document.getElementById('invoice-preview');
		if (!el) return;
		html2pdf()
			.set({
				margin: 10,
				filename: `${invoice.number}.pdf`,
				image: { type: 'jpeg', quality: 0.98 },
				html2canvas: { scale: 2, useCORS: true },
				jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
			})
			.from(el)
			.save();
	}

	function printInvoice() {
		const el = document.getElementById('invoice-preview');
		if (!el) return;
		const win = window.open('', '_blank');
		if (!win) return;
		win.document.write(`<!DOCTYPE html><html><head><title>${invoice?.number ?? 'Invoice'}</title>
<style>*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;}body{margin:0;padding:0;background:#fff;}@page{margin:10mm;}</style>
</head><body>${el.outerHTML}</body></html>`);
		win.document.close();
		win.focus();
		win.print();
		win.close();
	}
</script>

<div class="flex h-full flex-col">
	{#if !invoice}
		<div class="flex flex-1 flex-col items-center justify-center gap-3">
			<p class="text-sm text-gray-500 dark:text-gray-400">Invoice not found.</p>
			<a href="/invoices" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-400">
				Back to invoices
			</a>
		</div>
	{:else}
		<!-- Header -->
		<div
			class="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900"
		>
			<div class="flex items-center gap-3">
				<a
					href="/invoices"
					class="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
				>
					<ArrowLeft size={16} />
				</a>
				<div>
					<div class="flex items-center gap-2">
						<h1 class="text-base font-semibold text-gray-900 dark:text-gray-100">
							{invoice.number}
						</h1>
						{#if invoice.status === 'sent'}
							<span
								class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
							>
								<Send size={10} />
								Sent
							</span>
						{:else}
							<span
								class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
							>
								<Clock size={10} />
								Draft
							</span>
						{/if}
					</div>
					<p class="text-xs text-gray-400">{invoice.billTo.name}</p>
				</div>
			</div>

			<div class="flex items-center gap-2">
				{#if invoice.status === 'draft'}
					<a
						href="/invoices/{invoice.id}/edit"
						class="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
					>
						<Pencil size={14} />
						Edit
					</a>
				{/if}
				<button
					onclick={printInvoice}
					class="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
				>
					<Printer size={14} />
					Print
				</button>
				<button
					onclick={downloadPdf}
					class="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
				>
					<Download size={14} />
					Download PDF
				</button>
			</div>
		</div>

		<!-- Invoice preview -->
		<div class="flex-1 overflow-y-auto bg-gray-50 p-8 dark:bg-gray-950">
			<div class="mx-auto max-w-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-700">
				<InvoiceTemplate {invoice} theme={invoiceTheme} {brandColour} />
			</div>
		</div>
	{/if}
</div>
