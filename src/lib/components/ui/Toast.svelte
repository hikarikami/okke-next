<script lang="ts">
	import { toastStore } from '$lib/stores/toast.svelte';
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { CheckCircle, AlertCircle, Info, X } from 'lucide-svelte';

	const icons = {
		success: CheckCircle,
		error: AlertCircle,
		info: Info
	} as const;

	const styles = {
		success: {
			container: 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/30',
			icon: 'text-emerald-600 dark:text-emerald-400',
			text: 'text-emerald-800 dark:text-emerald-200',
			close: 'text-emerald-400 hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-800/50 dark:hover:text-emerald-300'
		},
		error: {
			container: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30',
			icon: 'text-red-600 dark:text-red-400',
			text: 'text-red-800 dark:text-red-200',
			close: 'text-red-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-800/50 dark:hover:text-red-300'
		},
		info: {
			container: 'border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/30',
			icon: 'text-primary-600 dark:text-primary-400',
			text: 'text-primary-800 dark:text-primary-200',
			close: 'text-primary-400 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-800/50 dark:hover:text-primary-300'
		}
	} as const;
</script>

<div
	class="pointer-events-none fixed left-1/2 top-5 z-[100] flex -translate-x-1/2 flex-col items-center gap-2"
	aria-live="polite"
	aria-label="Notifications"
>
	{#each toastStore.toasts as toast (toast.id)}
		{@const s = styles[toast.type]}
		{@const Icon = icons[toast.type]}
		<div
			animate:flip={{ duration: 200 }}
			in:fly={{ y: -12, duration: 250 }}
			out:fly={{ y: -8, duration: 200 }}
			class="pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg {s.container}"
		>
			<Icon size={16} class={s.icon} />
			<p class="text-sm font-medium {s.text}">{toast.message}</p>
			<button
				onclick={() => toastStore.remove(toast.id)}
				class="ml-1 flex h-5 w-5 items-center justify-center rounded transition-colors {s.close}"
				aria-label="Dismiss"
			>
				<X size={12} />
			</button>
		</div>
	{/each}
</div>
