<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { ChevronRight } from '@lucide/svelte';
	import { ThemeCostumizer } from '../theme-costumizer';
	import { DropdownMenuTrigger } from '$lib/components/ui/dropdown-menu';
	import { LanguageSwitch } from '../language-switch';
	import { DialogTrigger } from '$lib/components/ui/dialog';
</script>

<Sidebar.Group class="mt-auto group-data-[collapsible=icon]:hidden">
	<Sidebar.GroupLabel>Settings</Sidebar.GroupLabel>
	<Sidebar.Menu>
		<Sidebar.MenuItem>
			<ThemeCostumizer>
				{#snippet trigger()}
					<DialogTrigger>
						{#snippet child({ props })}
							<Sidebar.MenuButton
								class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								{...props}
							>
								Theme
								<ChevronRight class="ml-auto size-4" />
							</Sidebar.MenuButton>
						{/snippet}
					</DialogTrigger>
				{/snippet}
			</ThemeCostumizer>
		</Sidebar.MenuItem>
		<Sidebar.MenuItem>
			<LanguageSwitch contentSide="right">
				{#snippet trigger()}
					<DropdownMenuTrigger>
						{#snippet child({ props })}
							<Sidebar.MenuButton
								class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								{...props}
							>
								Language
								<ChevronRight class="ml-auto size-4" />
							</Sidebar.MenuButton>
						{/snippet}
					</DropdownMenuTrigger>
				{/snippet}
			</LanguageSwitch>
		</Sidebar.MenuItem>
	</Sidebar.Menu>
</Sidebar.Group>
