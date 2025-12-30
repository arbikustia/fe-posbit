<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { StoActualComponent } from '../components/actual';
	import { StoDetailComponent } from '../components/detail';
	import { get } from 'svelte/store';
	import { page } from '$app/stores';

	const url = get(page).url;
	const qp = url.searchParams;
	const id = qp.get('id') || '';
</script>

<div class="container space-y-5">
	<Tabs.Root value="detail" class="w-full">
		<Tabs.List>
			<Tabs.Trigger value="detail">Detail</Tabs.Trigger>
			<Tabs.Trigger value="actual">Selisih</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="detail">
			<StoDetailComponent {id} />
		</Tabs.Content>
		<Tabs.Content value="actual">
			<StoActualComponent {id} />
		</Tabs.Content>
	</Tabs.Root>
</div>
