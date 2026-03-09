<script lang="ts">
	import { Calendar } from '$lib/components/ui/calendar.js';
	import { Popover } from '$lib/components/ui/popover.js';
	import { CalendarDate } from '@internationalized/date';
	import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-svelte';

	interface Props {
		value: string; // YYYY-MM-DD
		class?: string;
	}

	let { value = $bindable(), class: className }: Props = $props();

	let open = $state(false);

	const calendarValue = $derived.by(() => {
		const [y, m, d] = value.split('-').map(Number);
		return new CalendarDate(y, m, d);
	});

	const displayValue = $derived(
		new Date(value + 'T00:00:00').toLocaleDateString('en-US', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		})
	);
</script>

<Popover.Root bind:open>
	<Popover.Trigger
		class="flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 transition-colors focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 {className ?? ''}"
	>
		<CalendarIcon size={13} class="shrink-0 text-gray-400" />
		{displayValue}
	</Popover.Trigger>
	<Popover.Portal>
		<Popover.Content
			class="z-[70] rounded-xl border border-gray-200 bg-white p-3 shadow-xl dark:border-gray-700 dark:bg-gray-900"
			sideOffset={6}
			align="start"
		>
			<Calendar.Root
				type="single"
				value={calendarValue}
				weekdayFormat="short"
				onValueChange={(v) => {
					if (v) {
						value = v.toString();
						open = false;
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
															{!selected && !disabled && !unavailable ? 'cursor-pointer text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800' : ''}
															{disabled || unavailable ? 'cursor-not-allowed text-gray-300 dark:text-gray-600' : ''}"
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
