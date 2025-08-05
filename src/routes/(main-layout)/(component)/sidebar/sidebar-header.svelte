<script lang="ts">
	import { page } from '$app/state';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sidebar from '$lib/components/ui/sidebar';

	const segments = $derived.by(() => {
		const parts = page.url.pathname.split('/').filter(Boolean);

		return parts.map((part, index) => ({
			name: formatSegmentName(decodeURIComponent(part)),
			href: '/' + parts.slice(0, index + 1).join('/')
		}));
	});

	function formatSegmentName(segment: string) {
		return segment
			.replace(/[-_]/g, ' ') // Replace dash/underscore with space
			.replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
	}
</script>

<header
	class="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear"
>
	<div class="flex items-center gap-2 px-4">
		<Sidebar.Trigger class="-ml-1" />
		<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item class="hidden md:block">
					<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
				</Breadcrumb.Item>
				{#each segments as segment, i}
					{@const isLast = i === segments.length - 1}
					{#if isLast}
						<Breadcrumb.Separator class="hidden md:block" />
						<Breadcrumb.Item>
							<Breadcrumb.Page class="capitalize">{segment.name}</Breadcrumb.Page>
						</Breadcrumb.Item>
					{:else}
						<Breadcrumb.Separator class="hidden md:block" />
						<Breadcrumb.Item class="hidden md:block">
							<Breadcrumb.Link class="capitalize" href={segment.href}
								>{segment.name}</Breadcrumb.Link
							>
						</Breadcrumb.Item>
					{/if}
				{/each}
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>
</header>
