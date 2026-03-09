<script lang="ts">
	import type { Invoice } from '$lib/types/invoice';
	import type { InvoiceTheme } from '$lib/types/business';
	import ThemeClassic from './invoice-themes/ThemeClassic.svelte';
	import ThemeModern from './invoice-themes/ThemeModern.svelte';
	import ThemeMinimal from './invoice-themes/ThemeMinimal.svelte';
	import ThemeBold from './invoice-themes/ThemeBold.svelte';

	interface Props {
		invoice: Invoice;
		theme?: InvoiceTheme;
		brandColour?: string;
	}

	let { invoice, theme = 'classic', brandColour = '#37a87d' }: Props = $props();
</script>

{#if theme === 'modern'}
	<ThemeModern {invoice} {brandColour} />
{:else if theme === 'minimal'}
	<ThemeMinimal {invoice} {brandColour} />
{:else if theme === 'bold'}
	<ThemeBold {invoice} {brandColour} />
{:else}
	<ThemeClassic {invoice} {brandColour} />
{/if}
