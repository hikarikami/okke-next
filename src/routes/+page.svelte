<script lang="ts">
	import {
		TrendingUp,
		Wallet,
		BarChart3,
		ShieldCheck,
		Zap,
		ArrowRight,
		Check,
		Star,
		Menu,
		X
	} from 'lucide-svelte';

	let mobileMenuOpen = $state(false);

	const features = [
		{
			icon: TrendingUp,
			title: 'Smart Transaction Tracking',
			description:
				'Log income and expenses in seconds. Categorise automatically and see where every dollar goes.'
		},
		{
			icon: BarChart3,
			title: 'Visual Analytics',
			description:
				'Beautiful charts and summaries that make your financial picture instantly clear — no spreadsheets needed.'
		},
		{
			icon: Wallet,
			title: 'Budget Categories',
			description:
				'Create custom categories that match your life. Track spending patterns and spot opportunities to save.'
		},
		{
			icon: ShieldCheck,
			title: 'Secure & Private',
			description:
				'Your data stays yours. Built with end-to-end security and no third-party data sharing, ever.'
		},
		{
			icon: Zap,
			title: 'Instant Insights',
			description:
				'Month-over-month comparisons, income vs. expense breakdowns, and balance trends at a glance.'
		},
		{
			icon: Check,
			title: 'Receipt Management',
			description:
				'Attach receipts directly to transactions. Keep your records clean and audit-ready year-round.'
		}
	];

	const steps = [
		{
			number: '01',
			title: 'Add your transactions',
			description:
				'Quickly log income and expenses with our streamlined entry form. Attach receipts and pick a category in seconds.'
		},
		{
			number: '02',
			title: 'Organise by category',
			description:
				'Use built-in or custom categories to group your spending. Okke automatically tracks totals per category each month.'
		},
		{
			number: '03',
			title: 'Understand your money',
			description:
				'Watch your dashboard update in real time. See your balance, spending trends, and monthly comparisons instantly.'
		}
	];

	const testimonials = [
		{
			name: 'Sarah K.',
			role: 'Freelance Designer',
			body: "Okke is the first finance app I've actually stuck with. It's simple, fast, and I finally know where my money goes each month.",
			rating: 5
		},
		{
			name: 'Marcus T.',
			role: 'Software Engineer',
			body: "I tried four different budgeting apps. Okke is the only one that didn't make me feel like I needed a finance degree to use it.",
			rating: 5
		},
		{
			name: 'Priya M.',
			role: 'Small Business Owner',
			body: "Running a small business means keeping a close eye on cash flow. Okke makes it effortless — I check it every morning.",
			rating: 5
		}
	];

	const pricingPlans = [
		{
			name: 'Free',
			price: '$0',
			period: 'forever',
			description: 'Perfect for getting started with personal finance tracking.',
			features: ['Up to 100 transactions/month', '5 custom categories', 'Basic analytics', 'Receipt uploads'],
			cta: 'Get started free',
			highlighted: false
		},
		{
			name: 'Pro',
			price: '$7',
			period: 'per month',
			description: 'For people who want complete visibility over their finances.',
			features: ['Unlimited transactions', 'Unlimited categories', 'Advanced analytics', 'Receipt uploads', 'Export to CSV', 'Priority support'],
			cta: 'Start free trial',
			highlighted: true
		},
		{
			name: 'Super Pro',
			price: '$16',
			period: 'per month',
			description: 'For people who want complete visibility over their finances.',
			features: ['Unlimited transactions', 'Unlimited categories', 'Advanced analytics', 'Receipt uploads', 'Export to CSV', 'Priority support'],
			cta: 'Start free trial',
			highlighted: false
		}
	];
</script>

<div class="min-h-screen bg-white text-gray-900">
	<!-- Navbar -->
	<header class="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
		<div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-2">
				<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
					<Wallet size={16} class="text-white" />
				</div>
				<span class="text-base font-semibold tracking-tight text-gray-900">Okke</span>
			</a>

			<!-- Desktop nav -->
			<nav class="hidden items-center gap-7 md:flex">
				<a href="#features" class="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900">Features</a>
				<a href="#how-it-works" class="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900">How it works</a>
				<a href="#pricing" class="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900">Pricing</a>
			</nav>

			<!-- Desktop CTAs -->
			<div class="hidden items-center gap-3 md:flex">
				<a
					href="/login"
					class="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
				>
					Sign in
				</a>
				<a
					href="/login"
					class="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
				>
					Get started
				</a>
			</div>

			<!-- Mobile menu button -->
			<button
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
				class="flex h-9 w-9 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 md:hidden"
				aria-label="Toggle menu"
			>
				{#if mobileMenuOpen}
					<X size={20} />
				{:else}
					<Menu size={20} />
				{/if}
			</button>
		</div>

		<!-- Mobile menu -->
		{#if mobileMenuOpen}
			<div class="border-t border-gray-100 bg-white px-6 py-4 md:hidden">
				<nav class="flex flex-col gap-4">
					<a href="#features" class="text-sm font-medium text-gray-700" onclick={() => (mobileMenuOpen = false)}>Features</a>
					<a href="#how-it-works" class="text-sm font-medium text-gray-700" onclick={() => (mobileMenuOpen = false)}>How it works</a>
					<a href="#pricing" class="text-sm font-medium text-gray-700" onclick={() => (mobileMenuOpen = false)}>Pricing</a>
					<div class="flex flex-col gap-2 border-t border-gray-100 pt-4">
						<a href="/login" class="text-sm font-medium text-gray-600">Sign in</a>
						<a href="/login" class="rounded-lg bg-primary-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-primary-700">
							Get started
						</a>
					</div>
				</nav>
			</div>
		{/if}
	</header>

	<!-- Hero -->
	<section class="relative overflow-hidden px-6 pb-20 pt-24">
		<!-- Background blobs -->
		<div class="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary-100 opacity-40 blur-3xl"></div>
		<div class="pointer-events-none absolute right-0 top-20 h-72 w-72 rounded-full bg-primary-200 opacity-20 blur-3xl"></div>

		<div class="relative mx-auto max-w-6xl">
			<!-- Badge -->
			<div class="mb-6 flex justify-center">
				<span class="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
					<span class="h-1.5 w-1.5 rounded-full bg-primary-500"></span>
					Personal finance, simplified
				</span>
			</div>

			<!-- Headline -->
			<h1 class="mx-auto max-w-3xl text-center text-5xl font-bold leading-tight tracking-tight text-gray-900 sm:text-6xl">
				Take control of
				<span class="text-primary-600"> your money</span>
			</h1>
			<p class="mx-auto mt-6 max-w-xl text-center text-lg leading-relaxed text-gray-500">
				Track income, manage expenses, and understand your financial health — all in one clean,
				intuitive dashboard.
			</p>

			<!-- CTAs -->
			<div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
				<a
					href="/login"
					class="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md"
				>
					Get started free
					<ArrowRight size={16} />
				</a>
				<a
					href="#how-it-works"
					class="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
				>
					See how it works
				</a>
			</div>

			<!-- Social proof -->
			<p class="mt-8 text-center text-xs text-gray-400">
				No credit card required &middot; Free forever plan available
			</p>

			<!-- Dashboard mockup -->
			<div class="mx-auto mt-16 max-w-4xl">
				<!-- Browser chrome -->
				<div class="overflow-hidden rounded-2xl border border-gray-200 shadow-2xl shadow-gray-200/60">
					<!-- Browser bar -->
					<div class="flex items-center gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3">
						<div class="flex gap-1.5">
							<div class="h-3 w-3 rounded-full bg-red-400"></div>
							<div class="h-3 w-3 rounded-full bg-yellow-400"></div>
							<div class="h-3 w-3 rounded-full bg-green-400"></div>
						</div>
						<div class="flex-1 rounded-md bg-white border border-gray-200 px-3 py-1 text-center text-xs text-gray-400">
							okke.app/dashboard
						</div>
					</div>

					<!-- Mockup content -->
					<div class="flex bg-gray-50">
						<!-- Sidebar -->
						<div class="hidden w-48 shrink-0 border-r border-gray-200 bg-white p-3 sm:block">
							<div class="mb-4 flex items-center gap-2 px-2 py-1">
								<div class="h-5 w-5 rounded bg-primary-600"></div>
								<span class="text-xs font-semibold text-gray-800">Okke</span>
							</div>
							<div class="space-y-0.5">
								{#each ['Dashboard', 'Transactions', 'Categories'] as item, i (item)}
									<div class="flex items-center gap-2 rounded-md px-2 py-1.5 {i === 0 ? 'bg-primary-50 text-primary-700' : 'text-gray-500'}">
										<div class="h-3 w-3 rounded-sm {i === 0 ? 'bg-primary-400' : 'bg-gray-300'}"></div>
										<span class="text-[11px] font-medium">{item}</span>
									</div>
								{/each}
							</div>
						</div>

						<!-- Main content -->
						<div class="flex-1 p-4">
							<p class="mb-3 text-[11px] font-semibold text-gray-700">Dashboard · March 2026</p>

							<!-- Stat cards -->
							<div class="mb-4 grid grid-cols-3 gap-2">
								{#each [{ label: 'Income', value: '$8,240', color: 'text-emerald-600', bg: 'bg-emerald-50' }, { label: 'Expenses', value: '$3,180', color: 'text-red-500', bg: 'bg-red-50' }, { label: 'Balance', value: '$5,059', color: 'text-primary-600', bg: 'bg-primary-50' }] as card (card.label)}
									<div class="rounded-lg border border-gray-200 bg-white p-2.5">
										<p class="text-[10px] text-gray-400">{card.label}</p>
										<p class="mt-0.5 text-sm font-bold {card.color}">{card.value}</p>
									</div>
								{/each}
							</div>

							<!-- Transaction rows -->
							<div class="rounded-lg border border-gray-200 bg-white">
								<div class="border-b border-gray-100 px-3 py-2">
									<p class="text-[10px] font-semibold text-gray-600">Recent Transactions</p>
								</div>
								{#each [{ desc: 'Client payment — Acme Corp', cat: 'Client Payment', amount: '+$2,400', income: true }, { desc: 'AWS — Monthly subscription', cat: 'Software', amount: '-$89', income: false }, { desc: 'Freelance project', cat: 'Client Payment', amount: '+$850', income: true }] as tx (tx.desc)}
									<div class="flex items-center justify-between border-b border-gray-50 px-3 py-2 last:border-0">
										<div>
											<p class="text-[10px] font-medium text-gray-700">{tx.desc}</p>
											<p class="text-[9px] text-gray-400">{tx.cat}</p>
										</div>
										<span class="text-[11px] font-semibold {tx.income ? 'text-emerald-600' : 'text-gray-600'}">{tx.amount}</span>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Stats strip -->
	<section class="border-y border-gray-100 bg-gray-50 py-12">
		<div class="mx-auto max-w-4xl px-6">
			<div class="grid grid-cols-2 gap-8 sm:grid-cols-4">
				{#each [{ value: '12,000+', label: 'Active users' }, { value: '$180M+', label: 'Transactions tracked' }, { value: '99.9%', label: 'Uptime' }, { value: '4.9 ★', label: 'Average rating' }] as stat (stat.label)}
					<div class="text-center">
						<p class="text-3xl font-bold text-gray-900">{stat.value}</p>
						<p class="mt-1 text-sm text-gray-500">{stat.label}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Features -->
	<section id="features" class="px-6 py-24">
		<div class="mx-auto max-w-6xl">
			<div class="mb-14 text-center">
				<p class="mb-3 text-sm font-semibold uppercase tracking-widest text-primary-600">Features</p>
				<h2 class="text-4xl font-bold tracking-tight text-gray-900">Everything you need, nothing you don't</h2>
				<p class="mx-auto mt-4 max-w-lg text-base text-gray-500">
					Okke is built to be fast and focused. Every feature exists to help you understand and manage your money better.
				</p>
			</div>

			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each features as feature (feature.title)}
					<div class="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-primary-200 hover:shadow-md hover:shadow-primary-50">
						<div class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100">
							<feature.icon size={20} />
						</div>
						<h3 class="mb-2 text-base font-semibold text-gray-900">{feature.title}</h3>
						<p class="text-sm leading-relaxed text-gray-500">{feature.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- How it works -->
	<section id="how-it-works" class="bg-gray-50 px-6 py-24">
		<div class="mx-auto max-w-6xl">
			<div class="mb-14 text-center">
				<p class="mb-3 text-sm font-semibold uppercase tracking-widest text-primary-600">How it works</p>
				<h2 class="text-4xl font-bold tracking-tight text-gray-900">Up and running in minutes</h2>
			</div>

			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				{#each steps as step (step.number)}
					<div class="relative">
						<div class="mb-4 flex items-center gap-3">
							<span class="text-4xl font-bold text-primary-200">{step.number}</span>
							<div class="h-px flex-1 bg-primary-100"></div>
						</div>
						<h3 class="mb-2 text-lg font-semibold text-gray-900">{step.title}</h3>
						<p class="text-sm leading-relaxed text-gray-500">{step.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Testimonials -->
	<section class="px-6 py-24">
		<div class="mx-auto max-w-6xl">
			<div class="mb-14 text-center">
				<p class="mb-3 text-sm font-semibold uppercase tracking-widest text-primary-600">Testimonials</p>
				<h2 class="text-4xl font-bold tracking-tight text-gray-900">Loved by people who care about their money</h2>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
				{#each testimonials as t (t.name)}
					<div class="rounded-2xl border border-gray-200 bg-white p-6">
						<div class="mb-4 flex gap-0.5">
							{#each { length: t.rating } as _, i (i)}
								<Star size={14} class="fill-amber-400 text-amber-400" />
							{/each}
						</div>
						<p class="mb-5 text-sm leading-relaxed text-gray-600">"{t.body}"</p>
						<div>
							<p class="text-sm font-semibold text-gray-900">{t.name}</p>
							<p class="text-xs text-gray-400">{t.role}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Pricing -->
	<section id="pricing" class="bg-gray-50 px-6 py-24">
		<div class="mx-auto max-w-4xl">
			<div class="mb-14 text-center">
				<p class="mb-3 text-sm font-semibold uppercase tracking-widest text-primary-600">Pricing</p>
				<h2 class="text-4xl font-bold tracking-tight text-gray-900">Simple, transparent pricing</h2>
				<p class="mx-auto mt-4 max-w-sm text-base text-gray-500">Start for free. Upgrade when you need more.</p>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
				{#each pricingPlans as plan (plan.name)}
					<div class="flex flex-col  rounded-2xl border {plan.highlighted ? 'border-primary-300 bg-primary-600 text-white scale-105' : 'border-gray-200 bg-white'} p-8">
						<p class="mb-1 text-sm font-semibold {plan.highlighted ? 'text-primary-200' : 'text-gray-500'}">{plan.name}</p>
						<div class="mb-4 flex items-baseline gap-1">
							<span class="text-4xl font-bold {plan.highlighted ? 'text-white' : 'text-gray-900'}">{plan.price}</span>
							<span class="text-sm {plan.highlighted ? 'text-primary-200' : 'text-gray-400'}">{plan.period}</span>
						</div>
						<p class="mb-6 text-sm {plan.highlighted ? 'text-primary-100' : 'text-gray-500'}">{plan.description}</p>

						<ul class="mb-8 space-y-3">
							{#each plan.features as feature (feature)}
								<li class="flex items-center gap-2 text-sm {plan.highlighted ? 'text-primary-100' : 'text-gray-600'}">
									<Check size={15} class="{plan.highlighted ? 'text-primary-300' : 'text-primary-500'} shrink-0" />
									{feature}
								</li>
							{/each}
						</ul>

						<a
							href="/login"
							class="block mt-auto rounded-xl px-4 py-3 text-center text-sm font-semibold transition-colors {plan.highlighted
								? 'bg-white text-primary-700 hover:bg-primary-50'
								: 'bg-primary-600 text-white hover:bg-primary-700'}"
						>
							{plan.cta}
						</a>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Final CTA -->
	<section class="px-6 py-24">
		<div class="mx-auto max-w-2xl text-center">
			<h2 class="text-4xl font-bold tracking-tight text-gray-900">
				Start understanding your money today
			</h2>
			<p class="mt-4 text-base text-gray-500">
				Join thousands of people using Okke to take control of their finances. No credit card required.
			</p>
			<div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
				<a
					href="/login"
					class="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md"
				>
					Get started free
					<ArrowRight size={16} />
				</a>
				<a
					href="#features"
					class="text-sm font-medium text-gray-500 transition-colors hover:text-gray-700"
				>
					Learn more
				</a>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="border-t border-gray-100 px-6 py-10">
		<div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
			<div class="flex items-center gap-2">
				<div class="flex h-6 w-6 items-center justify-center rounded bg-primary-600">
					<Wallet size={12} class="text-white" />
				</div>
				<span class="text-sm font-semibold text-gray-800">Okke</span>
			</div>
			<p class="text-xs text-gray-400">&copy; 2026 Okke. All rights reserved.</p>
			<div class="flex gap-5">
				<a href="/privacy" class="text-xs text-gray-400 hover:text-gray-600">Privacy</a>
				<a href="/terms" class="text-xs text-gray-400 hover:text-gray-600">Terms</a>
				<a href="/contact" class="text-xs text-gray-400 hover:text-gray-600">Contact</a>
			</div>
		</div>
	</footer>
</div>
