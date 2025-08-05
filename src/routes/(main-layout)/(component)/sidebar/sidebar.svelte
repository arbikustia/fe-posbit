<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import type { ComponentProps } from 'svelte';
	import SidebarNavMain from './sidebar-nav-main.svelte';
	import SidebarNavMaster from './sidebar-nav-master.svelte';
	import SidebarNavSetting from './sidebar-nav-setting.svelte';
	import SidebarNavUser from './sidebar-nav-user.svelte';
	import SidebarNavOther from './sidebar-nav-other.svelte';
	import { themeConfigStore } from '$lib/stores/themeConfigStore';
	import { themeSrcLogo } from '$lib/utils';
	import { CardBalance } from '../card-balance';

	let { ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();

	const logoSrc = $derived(themeSrcLogo($themeConfigStore.logoType));
</script>

<Sidebar.Root {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton
					class="w-fit hover:bg-transparent data-[slot=sidebar-menu-button]:!p-1.5"
				>
					{#snippet child({ props })}
						<a href="/" {...props}>
							<img class="block h-8 w-auto object-contain" src={logoSrc} alt="Opsigo" />
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<CardBalance className="!p-3" />
		<SidebarNavMain />
		<SidebarNavMaster />
		<SidebarNavSetting />
		<SidebarNavOther />
	</Sidebar.Content>
	<Sidebar.Footer>
		<SidebarNavUser />
	</Sidebar.Footer>
</Sidebar.Root>
