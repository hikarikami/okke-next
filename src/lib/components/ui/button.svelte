<script lang="ts">
	import { Button } from 'bits-ui';
	import { cn } from './cn.js';

	let { class: className, ...rest } = $props();
</script>

<Button.Root class={cn(className)} {...rest} />
