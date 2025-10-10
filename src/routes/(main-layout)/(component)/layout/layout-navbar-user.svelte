<script lang="ts">
	import { enhance } from '$app/forms';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { UserInfo } from '$lib/types/UserLogin';
	import type { SubmitFunction } from '@sveltejs/kit';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { goto } from '$app/navigation';
	let { userInfo }: { userInfo: UserInfo | undefined } = $props();

	const logout: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type === 'redirect') {
				window.location.href = result.location;
			}
		};
	};
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class={buttonVariants({
			variant: 'ghost',
			class:
				'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground relative flex h-full items-center rounded-none '
		})}
	>
		<svg
			class="size-7!"
			xmlns="http://www.w3.org/2000/svg"
			width="144"
			height="144"
			viewBox="0 0 256 256"
		>
			<g fill="currentColor">
				<path
					d="M224 128a95.76 95.76 0 0 1-31.8 71.37A72 72 0 0 0 128 160a40 40 0 1 0-40-40a40 40 0 0 0 40 40a72 72 0 0 0-64.2 39.37A96 96 0 1 1 224 128"
					opacity="0.2"
				/>
				<path
					d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24M74.08 197.5a64 64 0 0 1 107.84 0a87.83 87.83 0 0 1-107.84 0M96 120a32 32 0 1 1 32 32a32 32 0 0 1-32-32m97.76 66.41a79.66 79.66 0 0 0-36.06-28.75a48 48 0 1 0-59.4 0a79.66 79.66 0 0 0-36.06 28.75a88 88 0 1 1 131.52 0"
				/>
			</g>
		</svg>

		<div>{userInfo?.fullName}</div>

		<ChevronDown class="size-4 " />
	</DropdownMenu.Trigger>

	<DropdownMenu.Content class="w-56" align="end">
		<DropdownMenu.Label class="font-normal">
			<div class="flex flex-col space-y-1">
				<p class=" leading-none font-medium">{userInfo?.fullName}</p>
				<p class="text-md text-muted-foreground leading-none">{userInfo?.email}</p>
			</div>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<!-- <DropdownMenu.Item onclick={() => goto('/profile')}>Profile</DropdownMenu.Item> -->
			<DropdownMenu.Item>Settings</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>
			{#snippet child({ props })}
				<form {...props} method="POST" use:enhance={logout} action="/api/logout">
					<button type="submit" class="w-full text-left focus-visible:outline-hidden">Logout</button
					>
				</form>
			{/snippet}
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
