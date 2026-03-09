<script lang="ts">
	interface Props {
		src: string;
		class?: string;
	}

	let { src, class: className }: Props = $props();

	const processedSvg = $derived(
		src
			.replace(/fill="black"/g, 'fill="currentColor"')
			.replace(/\swidth="[^"]*"/g, '')
			.replace(/\sheight="[^"]*"/g, '')
			.replace(
				/<svg\b/,
				'<svg class="w-full h-auto" preserveAspectRatio="xMidYMid meet"'
			)
	);
</script>

<div class={`text-gray-900 dark:text-gray-400 ${className ?? ''}`}>
	{@html processedSvg}
</div>