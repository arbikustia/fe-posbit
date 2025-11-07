<script lang="ts">
	import LayoutNavBarMenuItem from './layout-navbar-menu-item.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import { checkRole, getUserRole } from '@/rbacUtils';
	import { ROLES } from '@/constants/permission';

	let open = false;
	let reportOpen = false;

	// Deteksi halaman aktif
	$: isMasterActive = $page.url.pathname.startsWith('/master');
	$: isReportActive = $page.url.pathname.startsWith('/report');
	const user = getUserRole();
	$: isAdmin = checkRole(ROLES.ADMIN);
	$: isCashier = checkRole(ROLES.CASHIER);
	$: isGudang = checkRole(ROLES.GUDANG);

	// Tutup popover master saat pindah halaman
	$: if (isMasterActive) {
		open = false;
	}

	// Tutup popover report saat pindah halaman di dalam /report
	$: if (isReportActive) {
		reportOpen = false;
	}
</script>

<nav class="flex items-center justify-center gap-2">
	<!-- Dashboard -->
	{#if isAdmin}
		<LayoutNavBarMenuItem href="/dashboard" label="Dashboard">
			<svg
				class="size-5!"
				slot="icon"
				xmlns="http://www.w3.org/2000/svg"
				width="100"
				height="100"
				viewBox="0 0 28 28"
			>
				<path fill="currentColor" d="M3 13h8V3H3zm0 8h8v-6H3zm10 0h8V11h-8zm0-18v6h8V3z" />
			</svg>
		</LayoutNavBarMenuItem>
	{/if}

	<!-- Master Group -->
	{#if isAdmin || isCashier}
		<Popover.Root bind:open>
			<Popover.Trigger
				class={cn(
					buttonVariants({ variant: 'ghost' }),
					'navbar-item hover:bg-sidebar-accent hover:text-sidebar-accent-foreground relative h-full rounded-none py-4',
					isMasterActive && 'bg-accent/50 text-primary hover:text-sidebar-accent-foreground'
				)}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
					><path
						fill="currentColor"
						d="M12 8V2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10h-6a2 2 0 0 1-2-2m0 7a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-2.5A.75.75 0 0 1 12 15m-3.25-4a.75.75 0 0 1 .75.75v6.5a.75.75 0 0 1-1.5 0v-6.5a.75.75 0 0 1 .75-.75m6.5 2a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5a.75.75 0 0 1 .75-.75M13.5 8V2.5l6 6H14a.5.5 0 0 1-.5-.5"
					/></svg
				>
				<span>Master</span>
				<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
					><path
						fill="currentColor"
						fill-rule="evenodd"
						d="M2.15 4.15a.5.5 0 0 1 .707 0l3.15 3.15l3.15-3.15a.5.5 0 0 1 .707.707l-3.5 3.5a.5.5 0 0 1-.707 0l-3.5-3.5a.5.5 0 0 1 0-.707z"
						clip-rule="evenodd"
					/></svg
				>

				<!-- Active indicator border -->
				{#if isMasterActive}
					<span class="border-primary absolute right-0 bottom-[-2px] left-0 rounded-t-lg border-t-4"
					></span>
				{/if}
			</Popover.Trigger>

			<Popover.Content class="w-52 space-y-2 p-3">
				{#if isAdmin}
					<LayoutNavBarMenuItem
						href="/master/user"
						label="User"
						extendClass="text-xs w-full text-start h-10 flex justify-start"
					>
						<svg
							slot="icon"
							class="size-5!"
							xmlns="http://www.w3.org/2000/svg"
							width="100"
							height="100"
							viewBox="0 0 20 20"
						>
							<path
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1m8-10a3 3 0 1 1-6 0a3 3 0 0 1 6 0"
							/>
						</svg>
					</LayoutNavBarMenuItem>
				{/if}

				{#if isAdmin}
					<LayoutNavBarMenuItem
						href="/master/point"
						label="Point"
						extendClass="text-xs w-full text-start h-10 flex justify-start"
					>
						<svg
							slot="icon"
							class="size-5!"
							xmlns="http://www.w3.org/2000/svg"
							width="100"
							height="100"
							viewBox="0 0 26 26"
						>
							<path
								fill="currentColor"
								d="M23.43 8.724c-.51-2.08-1.16-3.888-2.939-5.157a.3.3 0 0 0-.35.48c2.999 2.168 4.248 9.463.92 14.05a10.73 10.73 0 0 1-8.514 4.787a10.9 10.9 0 0 1-8.825-4.057C-1.604 11.93 1.824 1.728 11.477.839a12.1 12.1 0 0 1 5.137.52a.344.344 0 1 0 .23-.65a12.8 12.8 0 0 0-5.427-.65C1.064.87-2.923 11.871 2.833 19.506a11.99 11.99 0 0 0 9.754 4.488c7.075-.28 12.781-7.346 10.842-15.27"
							/>
							<path
								fill="currentColor"
								d="M7.84 4.197C4.252 6.005 1.914 12.4 4.702 16.359c5.396 7.515 20.776 2.638 14.53-9.724c-1.919-3.918-7.455-4.437-11.392-2.438m10.833 2.718a12.5 12.5 0 0 1 1.299 5.576c-.43 6.626-10.424 8.744-14.31 3.198c-2.42-3.328-.35-9.074 2.607-10.683c3.558-1.929 8.615-1.589 10.404 1.909"
							/>
							<path
								fill="currentColor"
								d="M10.728 7.654c-.89.64-1 1.42-1 3.368c0 .46.19 4.687.32 4.927a.28.28 0 0 0 .38.16c.23-.08.15-.16.15-1.13v-2.998c.36.16-.21.11 1.729.05c1.179 0 2.208 0 2.998-.899c1.839-1.999-1.61-5.596-4.577-3.478m3.937 2.908c-.94 1.21-3.727.52-3.997.71c.19-3.088.54-2.788 2.148-3.168c1.11.1 2.609 1.479 1.85 2.458"
							/>
						</svg>
					</LayoutNavBarMenuItem>
				{/if}

				{#if isAdmin || isCashier}
					<LayoutNavBarMenuItem
						href="/master/customer"
						label="Customer"
						extendClass="text-xs w-full text-start h-10 flex justify-start"
					>
						<svg
							slot="icon"
							class="size-5!"
							xmlns="http://www.w3.org/2000/svg"
							width="100"
							height="100"
							viewBox="0 0 14 14"
						>
							<g
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1"
							>
								<path d="M9.284 3.503a1.621 1.621 0 1 0 3.242 0a1.621 1.621 0 1 0-3.242 0" />
								<path d="M8.473 8.367v-.81a2.432 2.432 0 0 1 4.865 0v.81M6.6 8.369h6.738" />
								<path d="M3.604 5.612a1.712 1.712 0 1 0 0-3.425a1.712 1.712 0 0 0 0 3.425" />
								<path
									d="M6.6 8.609a2.996 2.996 0 1 0-5.993 0v1.284h1.285l.428 3.424h2.568l.428-3.424H6.6z"
								/>
							</g>
						</svg>
					</LayoutNavBarMenuItem>
				{/if}

				{#if isAdmin}
					<LayoutNavBarMenuItem
						href="/master/item"
						label="Item"
						extendClass="text-xs w-full text-start h-10 flex justify-start"
					>
						<svg
							slot="icon"
							class="size-5!"
							xmlns="http://www.w3.org/2000/svg"
							width="100"
							height="100"
							viewBox="0 0 48 48"
						>
							<g
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="4"
							>
								<path d="M14 13v6h28V7H14z" />
								<path d="M14 13H6v22h8" />
								<path d="M14 29h28v12H14z" />
							</g>
						</svg>
					</LayoutNavBarMenuItem>
				{/if}
			</Popover.Content>
		</Popover.Root>
	{/if}

	{#if isAdmin || isCashier}
		<LayoutNavBarMenuItem href="/transaction" label={'Transaction'}>
			<svg
				slot="icon"
				class="size-5!"
				xmlns="http://www.w3.org/2000/svg"
				width="100"
				height="100"
				viewBox="0 0 26 26"
			>
				<g
					fill="none"
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="1.5"
				>
					<path
						d="M4.58 8.607L2 8.454C3.849 3.704 9.158 1 14.333 2.344c5.513 1.433 8.788 6.918 7.314 12.25c-1.219 4.411-5.304 7.337-9.8 7.406"
					/>
					<path stroke-dasharray=".5 3" d="M12 22C6.5 22 2 17 2 11" />
					<path
						d="M13.604 9.722c-.352-.37-1.213-1.237-2.575-.62c-1.361.615-1.577 2.596.482 2.807c.93.095 1.537-.11 2.093.47c.556.582.659 2.198-.761 2.634s-2.341-.284-2.588-.509m1.653-6.484v.79m0 6.337v.873"
					/>
				</g>
			</svg>
		</LayoutNavBarMenuItem>
	{/if}

	{#if isAdmin}
		<LayoutNavBarMenuItem href="/purchase" label={'Purchase'}>
			<svg
				slot="icon"
				class="size-5!"
				xmlns="http://www.w3.org/2000/svg"
				width="100"
				height="100"
				viewBox="0 0 32 32"
			>
				<g
					fill="none"
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="1.5"
				>
					<path
						d="M28 6H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2m0 2v3H4V8ZM4 24V13h24v11Z"
					/>
					<path d="M6 20h10v2H6z" />
				</g>
			</svg>
		</LayoutNavBarMenuItem>
	{/if}

	{#if isAdmin || isGudang}
		<Popover.Root bind:open={reportOpen}>
			<Popover.Trigger
				class={cn(
					buttonVariants({ variant: 'ghost' }),
					'navbar-item hover:bg-sidebar-accent hover:text-sidebar-accent-foreground relative h-full rounded-none py-4',
					isReportActive && 'bg-accent/50 text-primary hover:text-sidebar-accent-foreground'
				)}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
					><g
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						><path
							d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5.697M18 14v4h4m-4-7V7a2 2 0 0 0-2-2h-2"
						/><path
							d="M8 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2m6 13a4 4 0 1 0 8 0a4 4 0 1 0-8 0m-6-7h4m-4 4h3"
						/></g
					></svg
				>
				<span>Report</span>
				<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
					><path
						fill="currentColor"
						fill-rule="evenodd"
						d="M2.15 4.15a.5.5 0 0 1 .707 0l3.15 3.15l3.15-3.15a.5.5 0 0 1 .707.707l-3.5 3.5a.5.5 0 0 1-.707 0l-3.5-3.5a.5.5 0 0 1 0-.707z"
						clip-rule="evenodd"
					/></svg
				>

				<!-- Active indicator border -->
				{#if isReportActive}
					<span class="border-primary absolute right-0 bottom-[-2px] left-0 rounded-t-lg border-t-4"
					></span>
				{/if}
			</Popover.Trigger>

			<Popover.Content class="w-52 space-y-2 p-3">
				{#if isAdmin || isCashier}
					<LayoutNavBarMenuItem
						href="/report/sales"
						label="Sales"
						extendClass="text-xs w-full text-start h-10 flex justify-start"
					>
						<svg
							slot="icon"
							xmlns="http://www.w3.org/2000/svg"
							width="48"
							height="48"
							viewBox="0 0 48 48"
							class="size-5"
						>
							<g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4">
								<path d="M41 14L24 4L7 14v20l17 10l17-10z" />
								<path stroke-linecap="round" d="M24 22v8m8-12v12m-16-4v4" />
							</g>
						</svg>
					</LayoutNavBarMenuItem>
				{/if}
				{#if isAdmin || isGudang}
					<LayoutNavBarMenuItem
						href="/report/purchase"
						label="Invoice"
						extendClass="text-xs w-full text-start h-10 flex justify-start"
					>
						<svg
							slot="icon"
							xmlns="http://www.w3.org/2000/svg"
							width="48"
							height="48"
							viewBox="0 0 48 48"
							class="size-5"
						>
							<g
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1"
							>
								<path
									d="M40.032 4C37.806 4 36 9.372 36 16h4.032c1.944 0 2.914 0 3.516-.67c.6-.672.496-1.556.288-3.322C42.28 7.34 41.788 4 40.032 4Z"
								/>
								<path
									d="M36 16.108v21.184c0 3.022 0 4.534-.924 5.13c-1.51.972-3.844-1.068-5.018-1.808c-.97-.612-1.454-.916-1.992-.934c-.582-.02-1.076.274-2.124.934l-3.822 2.41c-1.032.65-1.546.976-2.12.976s-1.09-.326-2.12-.976l-3.82-2.41c-.972-.612-1.456-.916-1.994-.934c-.582-.02-1.076.274-2.124.934c-1.174.74-3.508 2.78-5.018 1.808C4 41.826 4 40.316 4 37.292V16.108c0-5.708 0-8.56 1.758-10.334C7.514 4 10.344 4 16 4h24"
								/>
								<path
									d="M20 16c-2.21 0-4 1.344-4 3s1.79 3 4 3s4 1.344 4 3s-1.79 3-4 3m0-12c1.74 0 3.224.834 3.772 2M20 16v-2m0 14c-1.74 0-3.224-.834-3.772-2M20 28v2"
								/>
							</g>
						</svg>
					</LayoutNavBarMenuItem>
				{/if}
				{#if isAdmin}
					<LayoutNavBarMenuItem
						href="/report/shift"
						label="Summary Shift"
						extendClass="text-xs w-full text-start h-10 flex justify-start"
					>
						<svg
							slot="icon"
							xmlns="http://www.w3.org/2000/svg"
							width="48"
							height="48"
							viewBox="0 0 48 48"
							class="size-5"
						>
							<g
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1"
							>
								<path
									d="M8.038 16.342h31.925a3.537 3.537 0 0 1 3.537 3.536v18.986a3.54 3.54 0 0 1-3.538 3.538H8.037A3.537 3.537 0 0 1 4.5 38.865V19.88a3.54 3.54 0 0 1 3.538-3.538"
								/>
								<rect width="4.126" height="4.127" x="19.874" y="19.353" rx="2.063" />
								<path
									d="M35.367 19.353a2.063 2.063 0 0 1 2.063 2.063h0a2.063 2.063 0 0 1-2.063 2.064h0a2.063 2.063 0 0 1-2.063-2.064h0a2.063 2.063 0 0 1 2.063-2.063m-13.473-7.141a6.612 6.612 0 1 1 13.224 0m-13.224 0v4.15m13.224-4.15v3.913m-22.487-3.33a6.612 6.612 0 0 1 10.432-5.4m-10.432 5.4v3.261M8.13 21.842a2.063 2.063 0 1 1 4.126 0m-.001 14.897a2.063 2.063 0 1 1-4.126 0m4.126 0V21.84m-4.125.002V36.74"
								/>
							</g>
						</svg>
					</LayoutNavBarMenuItem>
				{/if}
			</Popover.Content>
		</Popover.Root>
	{/if}
</nav>
