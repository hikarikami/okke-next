<script lang="ts">
	import { Popover } from 'bits-ui';
	import { Check } from 'lucide-svelte';

	interface Props {
		value: string;
	}

	let { value = $bindable('#37a87d') }: Props = $props();

	let open = $state(false);

	const PRESETS = [
		'#37a87d', // Okke green (default)
		'#0d9488', // Teal
		'#0ea5e9', // Sky
		'#3b82f6', // Blue
		'#6366f1', // Indigo
		'#8b5cf6', // Violet
		'#ec4899', // Pink
		'#ef4444', // Red
		'#f97316', // Orange
		'#eab308', // Amber
		'#64748b', // Slate
		'#111827'  // Near-black
	];

	function selectPreset(colour: string) {
		value = colour;
		open = false;
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger
		class="flex h-9 items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-750 dark:focus:ring-primary-900/30"
		aria-label="Pick brand colour"
	>
		<span
			class="h-4 w-4 shrink-0 rounded"
			style="background-color: {value};"
		></span>
		<span class="font-mono text-xs uppercase tracking-wide">{value}</span>
	</Popover.Trigger>

	<Popover.Portal>
		<Popover.Content
			class="z-70 w-52 rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900"
			sideOffset={6}
			align="start"
		>
			<!-- Preset swatches -->
			<div class="grid grid-cols-6 gap-1.5 p-3">
				{#each PRESETS as colour (colour)}
					<button
						type="button"
						onclick={() => selectPreset(colour)}
						class="relative flex h-7 w-7 items-center justify-center rounded-md transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1"
						style="background-color: {colour}; --tw-ring-color: {colour};"
						aria-label={colour}
					>
						{#if value.toLowerCase() === colour.toLowerCase()}
							<Check size={12} class="text-white drop-shadow" strokeWidth={3} />
						{/if}
					</button>
				{/each}
			</div>

			<!-- Divider -->
			<div class="border-t border-gray-100 dark:border-gray-800"></div>

			<!-- Custom colour picker -->
			<div class="p-3">
				<p class="mb-2 text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
					Custom
				</p>
				<div class="flex items-center gap-2">
					<div class="relative h-7 w-7 shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
						<span
							class="pointer-events-none absolute inset-0"
							style="background-color: {value};"
						></span>
						<input
							type="color"
							value={value}
							oninput={(e) => { value = e.currentTarget.value; }}
							class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
							aria-label="Custom colour"
						/>
					</div>
					<input
						type="text"
						value={value}
						maxlength={7}
						spellcheck={false}
						oninput={(e) => {
							const v = e.currentTarget.value;
							if (/^#[0-9a-fA-F]{6}$/.test(v)) value = v;
						}}
						class="w-full rounded-md border border-gray-200 bg-transparent px-2 py-1 font-mono text-xs uppercase text-gray-700 outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-200 dark:border-gray-700 dark:text-gray-300"
					/>
				</div>
			</div>
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
