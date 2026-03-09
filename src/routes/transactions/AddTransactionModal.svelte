<script lang="ts">
	import { Calendar } from '$lib/components/ui/calendar.js';
	import { Combobox } from '$lib/components/ui/combobox.js';
	import { Dialog } from '$lib/components/ui/dialog.js';
	import { Popover } from '$lib/components/ui/popover.js';
	import { CalendarDate, getLocalTimeZone, today as todayDate } from '@internationalized/date';
	import { CalendarIcon, X, ChevronLeft, ChevronRight, Upload, Plus } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { toastStore } from '$lib/stores/toast.svelte';
	import { CATEGORY_COLORS } from '$lib/types/transaction';
import type { Category, TransactionType } from '$lib/types/transaction';
	import { cn } from '$lib/components/ui/cn.js';
	import Input from '$lib/components/ui/Input.svelte';
	import Label from '$lib/components/ui/Label.svelte';
	import ComboboxInput from '$lib/components/ui/ComboboxInput.svelte';
	import ComboboxContent from '$lib/components/ui/ComboboxContent.svelte';
	import ComboboxItem from '$lib/components/ui/ComboboxItem.svelte';
	import illustrationSrc from '$lib/assets/illus/Tech and Innovation _ Technology, Innovation, Connectivity, Vector illustration 1.svg?raw';
	import ThemedSvg from '$lib/components/ui/ThemedSvg.svelte';

	interface Props {
		open: boolean;
		onclose: () => void;
		categories: Category[];
	}

	let { open = $bindable(), onclose, categories }: Props = $props();

	interface EntryDraft {
		type: TransactionType;
		description: string;
		amount: string;
		categoryId: string;
		date: string;
	}

	function today(): string {
		return new Date().toISOString().slice(0, 10);
	}

	function blankEntry(): EntryDraft {
		return { type: 'expense', description: '', amount: '', categoryId: '', date: today() };
	}

	let entry = $state<EntryDraft>(blankEntry());
	let calendarOpen = $state(false);

	function dateStringToCalendarDate(s: string): CalendarDate {
		const [y, m, d] = s.split('-').map(Number);
		return new CalendarDate(y, m, d);
	}

	const calendarValue = $derived(dateStringToCalendarDate(entry.date));

	let categoryInput = $state('');
	let categoryInputFocused = $state(false);
	let categoryInputEl = $state<HTMLInputElement | null>(null);
	let categoryComboOpen = $state(false);

	const typeFilteredCategories = $derived(
		categories
			.filter((c) => c.type === 'both' || c.type === entry.type)
			.sort((a, b) => a.label.localeCompare(b.label))
	);

	const matchedCategories = $derived(
		categoryInput.trim()
			? typeFilteredCategories.filter((c) =>
					c.label.toLowerCase().includes(categoryInput.toLowerCase())
				)
			: typeFilteredCategories
	);

	const selectedCategory = $derived(
		entry.categoryId ? (categories.find((c) => c.id === entry.categoryId) ?? null) : null
	);

	const nextCategoryColor = $derived(
		CATEGORY_COLORS.find((c) => !categories.some((cat) => cat.color === c)) ?? CATEGORY_COLORS[0]
	);

	const isValid = $derived(
		entry.description.trim() !== '' && parseFloat(entry.amount) > 0
	);

	function updateEntry(patch: Partial<EntryDraft>) {
		entry = { ...entry, ...patch };
	}

	function reset() {
		entry = blankEntry();
		categoryInput = '';
	}

	function tryClose() {
		reset();
		onclose();
	}

	let addAnother = $state(false);
</script>

<Dialog.Root bind:open onOpenChange={(v) => { if (!v) tryClose(); }}>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
		<Dialog.Content
			class="fixed left-1/2 top-1/2 z-50 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900"
			onInteractOutside={(e) => { e.preventDefault(); tryClose(); }}
			onEscapeKeydown={(e) => { e.preventDefault(); tryClose(); }}
		>
			<!-- Header -->
			<div class="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
				<Dialog.Title class="text-base font-semibold text-gray-900 dark:text-gray-100">
					Add Transaction
				</Dialog.Title>
				<button
					onclick={tryClose}
					class="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
				>
					<X size={16} />
				</button>
			</div>


			<form
				method="POST"
				action="?/create"
				use:enhance={() => ({ result, update }) => {
					if (result.type === 'success') {
						toastStore.add('Transaction successfully saved');
						if (addAnother) {
							reset();
						} else {
							tryClose();
						}
					}
					update();
				}}
			>
				<!-- Hidden inputs for state-driven fields -->
				<input type="hidden" name="type" value={entry.type} />
				<input type="hidden" name="categoryId" value={entry.categoryId} />
				<input type="hidden" name="date" value={entry.date} />

			<!-- Body: side-by-side -->
			<div class="flex">
				<!-- Left: form -->
				<div class="flex-1 space-y-4 p-6">
					<!-- Type toggle -->
					<div role="group" aria-labelledby="type-label">
						<p id="type-label" class="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">Type</p>
						<div class="flex rounded-lg border border-gray-200 p-1 dark:border-gray-700">
							<button
								type="button"
								onclick={() => updateEntry({ type: 'expense', categoryId: '' })}
								class="flex-1 rounded-md px-4 py-1.5 text-sm font-medium transition-colors {entry.type === 'expense' ? 'bg-primary-600 text-white dark:bg-primary-900/30 dark:text-primary-400' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400'}"
							>
								Expense
							</button>
							<button
								type="button"
								onclick={() => updateEntry({ type: 'income', categoryId: '' })}
								class="flex-1 rounded-md px-4 py-1.5 text-sm font-medium transition-colors {entry.type === 'income' ? 'bg-primary-600 text-white dark:bg-primary-900/30 dark:text-primary-400' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400'}"
							>
								Income
							</button>
						</div>
					</div>

					<!-- Description -->
					<div>
						<Label for="description">Description</Label>
						<Input
							id="description"
							name="description"
							type="text"
							value={entry.description}
							oninput={(e: Event & { currentTarget: HTMLInputElement }) => updateEntry({ description: e.currentTarget.value })}
							placeholder="e.g. Coffee with client"
						/>
					</div>

					<!-- Amount + Category -->
					<div class="grid grid-cols-3 gap-4">
						<div class="col-span-1">
							<Label for="amount">Amount</Label>
							<div class="relative">
								<span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
								<Input
									id="amount"
									name="amount"
									type="number"
									min="0"
									step="0.01"
									value={entry.amount}
									oninput={(e: Event & { currentTarget: HTMLInputElement }) => updateEntry({ amount: e.currentTarget.value })}
									placeholder="0.00"
									class="pl-7"
								/>
							</div>
						</div>

						<div class="col-span-2">
							<p id="category-label" class="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">Category</p>
							{#snippet categoryFooter()}
								{#if categoryInput.trim()}
									<div class="border-t border-gray-100 p-1 dark:border-gray-800">
										<form
											method="POST"
											action="?/createCategory"
											use:enhance={() => async ({ result, update }) => {
												if (result.type === 'success') {
													const id = (result.data as { createdCategoryId?: string } | null)?.createdCategoryId;
													await update();
													if (id) updateEntry({ categoryId: id });
													categoryInput = '';
													categoryComboOpen = false;
												}
											}}
										>
											<input type="hidden" name="label" value={categoryInput.trim()} />
											<input type="hidden" name="type" value={entry.type} />
											<input type="hidden" name="color" value={nextCategoryColor} />
											<button
												type="submit"
												class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20"
											>
												<Plus size={13} />
												Create "{categoryInput.trim()}"
											</button>
										</form>
									</div>
								{/if}
							{/snippet}
							<Combobox.Root
								type="single"
								bind:open={categoryComboOpen}
								value={entry.categoryId}
								onValueChange={(v) => {
									if (v) updateEntry({ categoryId: v });
								}}
							>
								<div class="relative">
									{#if selectedCategory && !categoryInputFocused}
										<span
											class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 inline-flex items-center rounded px-2 py-0.5 text-xs font-medium"
											style="background-color: {selectedCategory.color}22; color: {selectedCategory.color};"
										>{selectedCategory.label}</span>
									{/if}
									<ComboboxInput
										bind:ref={categoryInputEl}
										openOnFocus
										bind:open={categoryComboOpen}
										oninput={(e: Event & { currentTarget: HTMLInputElement }) => { categoryInput = e.currentTarget.value; }}
										onfocus={(e: FocusEvent & { currentTarget: HTMLInputElement }) => { categoryInputFocused = true; categoryInput = ''; e.currentTarget.select(); }}
										onblur={() => { categoryInputFocused = false; }}
										placeholder={selectedCategory ? '' : 'Select or create...'}
										class={cn(
											selectedCategory && !categoryInputFocused
												? 'text-transparent dark:text-transparent'
												: ''
										)}
									/>
								</div>
								<Combobox.Portal>
									<ComboboxContent sideOffset={4} footer={categoryFooter}>
										{#each matchedCategories as cat (cat.id)}
											<ComboboxItem value={cat.id} label={cat.label}>
												<span
													class="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium"
													style="background-color: {cat.color}22; color: {cat.color};"
												>{cat.label}</span>
											</ComboboxItem>
										{/each}
										{#if matchedCategories.length === 0}
											<div class="px-3 py-2 text-sm text-gray-400 dark:text-gray-500">No categories found</div>
										{/if}
									</ComboboxContent>
								</Combobox.Portal>
							</Combobox.Root>
						</div>
					</div>

					<!-- Date -->
					<div>
						<p id="date-label" class="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">Date</p>
						<Popover.Root bind:open={calendarOpen}>
							<Popover.Trigger
								aria-labelledby="date-label"
								class="flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
							>
								<CalendarIcon size={14} class="shrink-0 text-gray-400" />
								{entry.date}
							</Popover.Trigger>
							<Popover.Portal>
								<Popover.Content
									class="z-70 rounded-xl border border-gray-200 bg-white p-3 shadow-xl dark:border-gray-700 dark:bg-gray-900"
									sideOffset={6}
									align="start"
								>
									<Calendar.Root
										type="single"
										value={calendarValue}
										maxValue={todayDate(getLocalTimeZone())}
										weekdayFormat="short"
										onValueChange={(v) => {
											if (v) {
												updateEntry({ date: v.toString() });
												calendarOpen = false;
											}
										}}
										class="select-none"
									>
										{#snippet children({ months, weekdays })}
											<Calendar.Header class="mb-3 flex items-center justify-between">
												<Calendar.PrevButton
													class="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
												>
													<ChevronLeft size={14} />
												</Calendar.PrevButton>
												<Calendar.Heading class="text-sm font-semibold text-gray-800 dark:text-gray-200" />
												<Calendar.NextButton
													class="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
												>
													<ChevronRight size={14} />
												</Calendar.NextButton>
											</Calendar.Header>

											{#each months as month (month.value)}
												<Calendar.Grid class="w-full border-collapse">
													<Calendar.GridHead>
														<Calendar.GridRow class="mb-1 flex">
															{#each weekdays as day (day)}
																<Calendar.HeadCell class="w-9 text-center text-[11px] font-medium text-gray-400">
																	{day}
																</Calendar.HeadCell>
															{/each}
														</Calendar.GridRow>
													</Calendar.GridHead>
													<Calendar.GridBody>
														{#each month.weeks as week (week)}
															<Calendar.GridRow class="flex">
																{#each week as date (date)}
																	<Calendar.Cell {date} month={month.value} class="p-0">
																		{#snippet child({ props, disabled, unavailable, selected })}
																			<Calendar.Day
																				{...props}
																				class="flex h-9 w-9 items-center justify-center rounded-md text-sm transition-colors
																					{selected ? 'bg-primary-600 font-semibold text-white' : ''}
																					{!selected && !disabled && !unavailable ? 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800' : ''}
																					{disabled || unavailable ? 'cursor-not-allowed text-gray-300 dark:text-gray-600' : 'cursor-pointer'}"
																			/>
																		{/snippet}
																	</Calendar.Cell>
																{/each}
															</Calendar.GridRow>
														{/each}
													</Calendar.GridBody>
												</Calendar.Grid>
											{/each}
										{/snippet}
									</Calendar.Root>
								</Popover.Content>
							</Popover.Portal>
						</Popover.Root>
					</div>
				</div>

				<!-- Right: illustration + upload -->
				<div class="flex w-5/12 shrink-0 flex-col items-center justify-center gap-4 border-l border-gray-100 p-6 bg-slate-50 dark:border-gray-800 dark:bg-gray-950">
					<div class="w-full flex flex-col h-full rounded-xl border-2 border-dashed border-gray-200 bg-default px-4 py-5 text-center justify-center items-center dark:border-gray-700">
						<ThemedSvg src={illustrationSrc} class="w-8/12 select-none" />
						<Upload size={18} class="mx-auto mb-2 text-gray-300 dark:text-gray-600" />
						<p class="text-xs font-medium text-gray-500 dark:text-gray-400">Upload receipt</p>
						<p class="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">PNG, JPG, PDF up to 10MB</p>
						<button type="button" class="mt-3 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">
							Browse files
						</button>
					</div>
				</div>
			</div>

			<!-- Footer -->
			<div class="flex items-center justify-end gap-2 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
				<button
					type="button"
					onclick={tryClose}
					class="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
				>
					Cancel
				</button>
				<button
					type="submit"
					onclick={() => (addAnother = true)}
					disabled={!isValid}
					class="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
				>
					Save and add another
				</button>
				<button
					type="submit"
					onclick={() => (addAnother = false)}
					disabled={!isValid}
					class="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
				>
					Save entry
				</button>
			</div>
			</form>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
