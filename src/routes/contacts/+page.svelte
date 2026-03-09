<script lang="ts">
	import { Users, Plus } from 'lucide-svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import AddContactModal from './AddContactModal.svelte';

	let { data } = $props();
	let modalOpen = $state(false);

	const columns = [
		{ key: 'name', label: 'Name' },
		{ key: 'email', label: 'Email' },
		{ key: 'company', label: 'Company', width: '180px' }
	];
</script>

<div class="p-6">
	<!-- Page header -->
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Contacts</h1>
			<p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Manage your clients and contacts</p>
		</div>
		<button
			onclick={() => (modalOpen = true)}
			class="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
		>
			<Plus size={16} />
			New contact
		</button>
	</div>

	<!-- Contacts table -->
	<Table
		{columns}
		rows={data.contacts}
		emptyTitle="No contacts yet"
		emptySubtitle="Add your first contact to get started"
	>
		{#snippet emptyIcon()}
			<div class="mb-3 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
				<Users size={24} class="text-gray-400" />
			</div>
		{/snippet}

		{#snippet emptyAction()}
			<button
				onclick={() => (modalOpen = true)}
				class="mt-4 flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
			>
				<Plus size={14} />
				New contact
			</button>
		{/snippet}

		{#snippet cell(key, contact)}
			{#if key === 'name'}
				<span class="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
					{contact.name}
				</span>
			{:else if key === 'email'}
				<span class="truncate text-sm text-gray-500 dark:text-gray-400">
					{contact.email}
				</span>
			{:else if key === 'company'}
				{#if contact.companyName}
					<span class="truncate text-sm text-gray-600 dark:text-gray-300">
						{contact.companyName ?? '—'}
					</span>
				{:else}
					<span class="text-sm text-gray-300 dark:text-gray-600">—</span>
				{/if}
			{/if}
		{/snippet}
	</Table>
</div>

<AddContactModal bind:open={modalOpen} companies={data.companies} onclose={() => (modalOpen = false)} />
