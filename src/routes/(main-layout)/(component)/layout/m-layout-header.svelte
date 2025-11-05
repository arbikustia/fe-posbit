<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import Icon from '@iconify/svelte';
	import LayoutSidebar from './m-layout-sidebar.svelte';
	import { themeConfigStore } from '$lib/stores/themeConfigStore';
	import { themeSrcLogo } from '$lib/utils';

	let isOpenSidebar = $state(false);
	const logoSrc = $derived(themeSrcLogo($themeConfigStore.logoType));
</script>

<div class="bg-sidebar fixed top-0 z-10 flex w-full justify-between p-2 shadow-md">
	<div class="flex items-center">
		<Button variant="ghost" onclick={() => (isOpenSidebar = true)}>
			<Icon
				icon="iconamoon:menu-burger-horizontal-duotone"
				class="text-(--sidebar-foreground)"
				width="24"
				height="24"
			/>
		</Button>
		<div>
			<a href="/">
				<img src={logoSrc} alt="Bantuit" class="h-8" />
			</a>
		</div>
	</div>

</div>

<LayoutSidebar bind:open={isOpenSidebar} />
