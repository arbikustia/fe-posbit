<script lang="ts">
	import { Sidebar as AppSidebar } from '../sidebar';
	import SidebarHeader from '../sidebar/sidebar-header.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	let { children } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar collapsible="icon" class="z-32" />
	<Sidebar.Inset class="min-w-[1024px]">
		<SidebarHeader />
		{@render children()}
	</Sidebar.Inset>
</Sidebar.Provider>
