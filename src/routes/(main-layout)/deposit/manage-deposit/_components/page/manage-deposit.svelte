<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { DepositLog } from '../deposit-log';
	import { ListOfDeposit } from '../list-of-deposit';
	import { RequestForApproval } from '../request-for-approval';

	const tabList = [
		{ key: 'list-of-deposit', label: 'List of Deposit' },
		{ key: 'deposit-log', label: 'Deposit Log' },
		{ key: 'request-for-approval', label: 'Request for Approval' }
	];
</script>

<div class="mb-1 text-xl font-medium">Manage Deposit</div>
<div class="font-thin">Create, update, and delete deposit data</div>

<Card.Root class="mt-10">
	<Card.Content>
		<Tabs.Root value="list-of-deposit" class="w-full">
			<!-- <Tabs.List>
				<Tabs.Trigger value="list-of-deposit" class="">List of Deposit</Tabs.Trigger>
				<Tabs.Trigger value="deposit-log">Deposit Log</Tabs.Trigger>
				<Tabs.Trigger value="request-for-approval">Request for Approval</Tabs.Trigger>
			</Tabs.List> -->
			<Tabs.List class="mb-5 flex w-full justify-start space-x-4 border-b bg-transparent">
				<div class="w-[40%]">
					{#each tabList as view (view.key)}
						<Tabs.Trigger
							value={view.key}
							class="data-[state=active]:border-primary h-10 rounded-none border-0 font-semibold data-[state=active]:!border-b-4 data-[state=active]:shadow-none"
						>
							{view.label}
							{#if view.key == 'request-for-approval'}
								<Badge variant="outline">5</Badge>
							{/if}
						</Tabs.Trigger>
					{/each}
				</div>
			</Tabs.List>
			<Tabs.Content value="list-of-deposit">
				<ListOfDeposit />
			</Tabs.Content>
			<Tabs.Content value="deposit-log">
				<DepositLog />
			</Tabs.Content>
			<Tabs.Content value="request-for-approval">
				<RequestForApproval />
			</Tabs.Content>
		</Tabs.Root>
	</Card.Content>
</Card.Root>
