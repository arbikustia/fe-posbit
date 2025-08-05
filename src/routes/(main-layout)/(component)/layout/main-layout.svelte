<script lang="ts">
	import LayoutFooter from './layout-footer.svelte';
	import LayoutNavBar from './layout-navbar.svelte';
	import { userStore } from '$lib/stores/userStore';
	import { themeConfigStore } from '$lib/stores/themeConfigStore';
	import LayoutSidebar1 from './layout-sidebar-1.svelte';
	import LayoutSidebar2 from './layout-sidebar-2.svelte';
	import { APP_VERSION } from '$lib/constants/app';
	import { cn } from '$lib/utils';

	let { children } = $props();
</script>

{#if $themeConfigStore.navigation === 'sidebar'}
	{@const SidebarVariant = $themeConfigStore.sidebar === 1 ? LayoutSidebar1 : LayoutSidebar2}
	<SidebarVariant>
		<div
			class={cn('app pb-20', {
				'border-t': $themeConfigStore.sidebar === 1
			})}
		>
			<main>
				{@render children()}
			</main>
			<div
				class="absolute bottom-0 left-0 right-0 mt-4 flex items-center justify-between px-4 py-4"
			>
				<p>&copy; {new Date().getFullYear()} Opsigo All rights reserved.</p>
				<p class="text-gray-400">v.{APP_VERSION}</p>
			</div>
		</div>
	</SidebarVariant>
{:else}
	<div class="app min-h-full min-w-[1024px]">
		<LayoutNavBar userInfo={$userStore?.userInfo} />
		<main>
			{@render children()}
		</main>
		<LayoutFooter />
	</div>
{/if}
