<script lang="ts">
	import { Dialog } from '$lib/components/ui/dialog.js';
	import { CATEGORY_COLORS } from '$lib/types/transaction';
	import type { Category, TransactionType } from '$lib/types/transaction';
	import Input from '$lib/components/ui/Input.svelte';
	import Label from '$lib/components/ui/Label.svelte';
	import { X, Loader2 } from 'lucide-svelte';
	import { enhance } from '$app/forms';

	interface Props {
		open: boolean;
		onclose: () => void;
		/** Pass a category to edit it; omit to create a new one */
		category?: Category;
		nextColor: string;
	}

	let { open = $bindable(), onclose, category, nextColor }: Props = $props();

	const isEdit = $derived(!!category);

	let label = $state('');
	let color = $state('');
	let type = $state<TransactionType | 'both'>('both');

	$effect(() => {
		if (open) {
			label = category?.label ?? '';
			color = category?.color ?? nextColor;
			type = category?.type ?? 'both';
		}
	});

	const isValid = $derived(label.trim().length > 0);
	let loading = $state(false);
</script>

<Dialog.Root
	bind:open
	onOpenChange={(v) => {
		if (!v) onclose();
	}}
>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
		<Dialog.Content
			class="fixed top-1/2 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900"
			onEscapeKeydown={(e) => {
				e.preventDefault();
				onclose();
			}}
			onInteractOutside={(e) => {
				e.preventDefault();
				onclose();
			}}
		>
			<form
				method="POST"
				action={isEdit ? '?/update' : '?/create'}
				use:enhance={() => {
					loading = true;
					return async ({ result, update }) => {
						if (result.type === 'success' || result.type === 'redirect') onclose();
						await update();
						loading = false;
					};
				}}
			>
				{#if isEdit && category}
					<input type="hidden" name="id" value={category.id} />
				{/if}
				<input type="hidden" name="color" value={color} />
				<input type="hidden" name="type" value={type} />

				<!-- Header -->
				<div
					class="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800"
				>
					<Dialog.Title class="text-sm font-semibold text-gray-900 dark:text-gray-100">
						{isEdit ? 'Edit Category' : 'New Category'}
					</Dialog.Title>
					<button
						type="button"
						onclick={onclose}
						class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
					>
						<X size={15} />
					</button>
				</div>

				<!-- Body -->
				<div class="space-y-5 p-5">
					<!-- Name -->
					<div>
						<Label for="cat-name">Name</Label>
						<Input
							id="cat-name"
							name="label"
							type="text"
							bind:value={label}
							placeholder="e.g. Utilities"
						/>
					</div>

					<!-- Type -->
					<div>
						<p class="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">Applies to</p>
						<div class="flex rounded-lg border border-gray-200 p-1 dark:border-gray-700">
							{#each [['expense', 'Expense'], ['income', 'Income'], ['both', 'Both']] as [val, lbl] (val)}
								<button
									type="button"
									onclick={() => (type = val as TransactionType | 'both')}
									class="flex-1 cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors {type ===
									val
										? 'bg-primary-600 text-white dark:bg-primary-900/30 dark:text-primary-400'
										: 'text-gray-500 hover:text-gray-800 dark:text-gray-400'}"
								>
									{lbl}
								</button>
							{/each}
						</div>
					</div>

					<!-- Color -->
					<div>
						<p class="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Colour</p>
						<div class="flex flex-wrap gap-2">
							{#each CATEGORY_COLORS as c (c)}
								<button
									type="button"
									onclick={() => (color = c)}
									class="h-7 w-7 cursor-pointer rounded-full transition-transform hover:scale-110 {color === c
										? 'ring-2 ring-gray-400 ring-offset-2 dark:ring-offset-gray-900'
										: ''}"
									style="background-color: {c}"
									aria-label="Select colour {c}"
								/>
							{/each}
						</div>
						<!-- Preview -->
						<div class="mt-3">
							<span
								class="inline-flex items-center rounded px-2.5 py-1 text-xs font-medium"
								style="background-color: {color}22; color: {color};"
							>
								{label.trim() || 'Preview'}
							</span>
						</div>
					</div>
				</div>

				<!-- Footer -->
				<div
					class="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-4 dark:border-gray-800"
				>
					<button
						type="button"
						onclick={onclose}
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
						{isEdit ? 'Save changes' : 'Create category'}
					</button>
				</div>
			</form>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
