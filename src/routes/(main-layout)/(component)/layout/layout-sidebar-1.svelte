<script lang="ts">
	import { Sidebar as AppSidebar } from '../sidebar';
	import SidebarHeader from '../sidebar/sidebar-header.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	let { children } = $props();
</script>

<Sidebar.Provider
	style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
>
	<AppSidebar variant="inset" class="z-32" />
	<Sidebar.Inset class="min-w-[1024px]">
		<SidebarHeader />
		{@render children()}
	</Sidebar.Inset>
</Sidebar.Provider>
