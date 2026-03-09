<script lang="ts">
	import { Dialog } from '$lib/components/ui/dialog.js';
	import { Select } from '$lib/components/ui/select.js';
	import Input from '$lib/components/ui/Input.svelte';
	import Label from '$lib/components/ui/Label.svelte';
	import SelectTrigger from '$lib/components/ui/SelectTrigger.svelte';
	import SelectContent from '$lib/components/ui/SelectContent.svelte';
	import SelectItem from '$lib/components/ui/SelectItem.svelte';
	import { X, ChevronDown, Loader2 } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import type { Company } from '$lib/types/contact';

	interface Props {
		open: boolean;
		onclose: () => void;
		companies: Company[];
	}

	let { open = $bindable(), onclose, companies }: Props = $props();

	interface Draft {
		name: string;
		email: string;
		companyId: string;
	}

	function blank(): Draft {
		return { name: '', email: '', companyId: '' };
	}

	let draft = $state<Draft>(blank());
	let loading = $state(false);

	const isValid = $derived(draft.name.trim() !== '' && draft.email.trim() !== '');

	const selectedCompanyLabel = $derived(
		draft.companyId ? (companies.find((c) => c.id === draft.companyId)?.name ?? '') : ''
	);

	function reset() {
		draft = blank();
	}

	function tryClose() {
		reset();
		onclose();
	}


</script>

<Dialog.Root bind:open onOpenChange={(v) => { if (!v) tryClose(); }}>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
		<Dialog.Content
			class="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900"
			onInteractOutside={(e) => { e.preventDefault(); tryClose(); }}
			onEscapeKeydown={(e) => { e.preventDefault(); tryClose(); }}
		>
			<!-- Header -->
			<div class="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
				<Dialog.Title class="text-base font-semibold text-gray-900 dark:text-gray-100">
					New Contact
				</Dialog.Title>
				<button
					onclick={tryClose}
					class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
				>
					<X size={16} />
				</button>
			</div>

			<form
				method="POST"
				action="?/create"
				use:enhance={() => {
					loading = true;
					return async ({ result, update }) => {
						if (result.type === 'success' || result.type === 'redirect') { reset(); onclose(); }
						await update();
						loading = false;
					};
				}}
			>
			<input type="hidden" name="companyId" value={draft.companyId} />
			<!-- Body -->
			<div class="space-y-4 p-6">
				<!-- Name -->
				<div>
					<Label for="contact-name">Name</Label>
					<Input
						id="contact-name"
						name="name"
						type="text"
						bind:value={draft.name}
						placeholder="e.g. Jane Smith"
					/>
				</div>

				<!-- Email -->
				<div>
					<Label for="contact-email">Email</Label>
					<Input
						id="contact-email"
						name="email"
						type="email"
						bind:value={draft.email}
						placeholder="e.g. jane@example.com"
					/>
				</div>

				<!-- Company -->
				<div>
					<Label for="contact-company">Company <span class="font-normal text-gray-400">(optional)</span></Label>
					<Select.Root
						type="single"
						value={draft.companyId}
						onValueChange={(v) => { draft.companyId = v ?? ''; }}
					>
						<SelectTrigger id="contact-company" class="flex items-center justify-between">
							<span class={draft.companyId ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}>
								{selectedCompanyLabel || 'Select a company...'}
							</span>
							<ChevronDown size={14} class="shrink-0 text-gray-400" />
						</SelectTrigger>
						<Select.Portal>
							<SelectContent>
								{#each companies as company (company.id)}
									<SelectItem value={company.id} label={company.name}>
										{company.name}
									</SelectItem>
								{/each}
							</SelectContent>
						</Select.Portal>
					</Select.Root>
				</div>
			</div>

			<!-- Footer -->
			<div class="flex items-center justify-end gap-2 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
				<button
					type="button"
					onclick={tryClose}
					class="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={!isValid || loading}
					class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{#if loading}<Loader2 size={14} class="animate-spin" />{/if}
					Save contact
				</button>
			</div>
			</form>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
