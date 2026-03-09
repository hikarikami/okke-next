<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Button from '$lib/components/ui/button.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { Avatar } from '$lib/components/ui/avatar.js';
	import { DropdownMenu } from '$lib/components/ui/dropdown-menu.js';
	import { Separator } from '$lib/components/ui/separator.js';
	import { Tooltip } from '$lib/components/ui/tooltip.js';
	import { page } from '$app/stores';
	import {
		LayoutDashboard,
		ArrowLeftRight,
		Tag,
		FileText,
		Users,
		PanelLeftClose,
		PanelLeftOpen,
		Sun,
		Moon,
		LogOut,
		Settings,
		User,
		ChevronDown
	} from 'lucide-svelte';

	let { children } = $props();

	let sidebarCollapsed = $state(false);
	let dark = $state(false);

	const isLandingPage = $derived($page.url.pathname === '/');

	$effect(() => {
		if (dark) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	});

	const navItems = [
		{ label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
		{ label: 'Transactions', icon: ArrowLeftRight, href: '/transactions' },
		{ label: 'Invoices', icon: FileText, href: '/invoices' },
		{ label: 'Contacts', icon: Users, href: '/contacts' },
		{ label: 'Categories', icon: Tag, href: '/categories' }
	];
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if isLandingPage}
	{@render children()}
{:else}
<div class="flex h-screen flex-col bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
	<!-- Top Navigation Bar -->
	<header
		class="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900"
	>
		<!-- Left: Toggle + App Name -->
		<div class="flex items-center gap-3">
			<Button
				onclick={() => (sidebarCollapsed = !sidebarCollapsed)}
				class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
			>
				{#if sidebarCollapsed}
					<PanelLeftOpen size={18} />
				{:else}
					<PanelLeftClose size={18} />
				{/if}
			</Button>

			<span class="text-base font-semibold tracking-tight text-gray-900 dark:text-gray-100">
				Okke
			</span>
		</div>

		<!-- Right: Dark mode toggle + Account -->
		<div class="flex items-center gap-2">
			<!-- Dark / Light toggle -->
			<Button
				onclick={() => (dark = !dark)}
				class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
				aria-label="Toggle dark mode"
			>
				{#if dark}
					<Sun size={16} />
				{:else}
					<Moon size={16} />
				{/if}
			</Button>

			<!-- Account Dropdown -->
			<DropdownMenu.Root>
				<DropdownMenu.Trigger
					class="flex h-8 items-center gap-2 rounded-md px-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
				>
					<Avatar.Root
						class="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-primary-600 text-xs font-medium text-white"
					>
						<Avatar.Fallback>JD</Avatar.Fallback>
					</Avatar.Root>
					<span class="hidden text-sm font-medium text-gray-700 dark:text-gray-300 sm:block"
						>John Doe</span
					>
					<ChevronDown size={14} class="text-gray-400" />
				</DropdownMenu.Trigger>

				<DropdownMenu.Content
					class="z-50 min-w-44 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
					sideOffset={6}
					align="end"
				>
					<DropdownMenu.Item
						class="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
					>
						<User size={14} />
						Profile
					</DropdownMenu.Item>
					<DropdownMenu.Item
						class="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
					>
						<Settings size={14} />
						Settings
					</DropdownMenu.Item>
					<DropdownMenu.Separator class="my-1 border-t border-gray-200 dark:border-gray-700" />
					<DropdownMenu.Item
						class="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
					>
						<LogOut size={14} />
						Sign out
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</header>

	<!-- Body -->
	<div class="flex flex-1 overflow-hidden">
		<!-- Sidebar -->
		<aside
			class="flex shrink-0 flex-col border-r border-gray-200 bg-white transition-all duration-200 dark:border-gray-800 dark:bg-gray-900"
			style="width: {sidebarCollapsed ? '56px' : '220px'}"
		>
			<nav class="flex flex-1 flex-col gap-1 p-2">
				{#each navItems as item (item.label)}
					{#if sidebarCollapsed}
						<Tooltip.Provider delayDuration={200}>
							<Tooltip.Root>
								<Tooltip.Trigger>
									{#snippet child({ props })}
										<a
											href={item.href}
											{...props}
											class="flex h-9 w-9 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
										>
											<item.icon size={18} />
										</a>
									{/snippet}
								</Tooltip.Trigger>
								<Tooltip.Content
									class="rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
									side="right"
									sideOffset={8}
								>
									{item.label}
								</Tooltip.Content>
							</Tooltip.Root>
						</Tooltip.Provider>
					{:else}
						<a
							href={item.href}
							class="flex h-9 items-center gap-3 rounded-md px-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
						>
							<item.icon size={16} class="shrink-0" />
							{item.label}
						</a>
					{/if}
				{/each}
			</nav>

			<Separator.Root class="border-t border-gray-200 dark:border-gray-800" />

			<!-- Sidebar footer -->
			<div class="p-2">
				{#if sidebarCollapsed}
					<Tooltip.Provider delayDuration={200}>
						<Tooltip.Root>
							<Tooltip.Trigger>
								{#snippet child({ props })}
									<a
										href="/settings"
										{...props}
										class="flex h-9 w-9 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
									>
										<Settings size={16} />
									</a>
								{/snippet}
							</Tooltip.Trigger>
							<Tooltip.Content
								class="rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
								side="right"
								sideOffset={8}
							>
								Settings
							</Tooltip.Content>
						</Tooltip.Root>
					</Tooltip.Provider>
				{:else}
					<a
						href="/settings"
						class="flex h-9 items-center gap-3 rounded-md px-3 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
					>
						<Settings size={16} class="shrink-0" />
						Settings
					</a>
				{/if}
			</div>
		</aside>

		<!-- Main content -->
		<main class="flex-1 overflow-auto">
			{@render children()}
		</main>
	</div>
</div>
{/if}

<Toast />
