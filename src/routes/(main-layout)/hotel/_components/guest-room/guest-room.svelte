<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import { SelectWrapper } from '../select-wrapper';
	import { SelectNationality } from '../select-nationality';
	import dummy from '$lib/dummy/hotel.json';
	export let state;
	export let increaseGuest;
	export let decreaseGuest;
	export let variant;
</script>

<div class="w-full">
	<Popover.Root>
		<span class="text-sm font-semibold text-gray-500"
			>{variant == 'default' ? 'Guest & Room' : ''}
		</span>
		<div
			class={`flex w-full flex-col gap-1 ${variant == 'default' ? 'h-11 rounded-md border border-gray-200 p-1' : variant == 'combination' ? "h-11" : 'h-9 rounded-md '} `}
		>
			{#if variant == 'combination'}
				<Popover.Trigger
					class={cn(
						buttonVariants({ variant: 'secondary' }),
						'flex h-full w-full justify-between  rounded-md p-2'
					)}
				>
					<div class="flex items-center justify-center gap-3">
						<Icon icon="fa6-solid:person" width="25" height="30" class="text-primary" />
						<div>
							{`${state.searchModel.guest} ${state.searchModel.guest > 1 ? 'Guests' : 'Guest'} ${state.searchModel.room} ${state.searchModel.room > 1 ? 'Rooms' : 'Room'}`}
						</div>
					</div>
					<div>
						<Icon icon={state.searchModel.nationalityIcon} width="24" height="24" />
					</div>
				</Popover.Trigger>
			{:else if variant == 'default'}
				<Popover.Trigger
					class={cn(
						buttonVariants({ variant: 'ghost' }),
						'flex h-full w-full justify-between  rounded-md'
					)}
					><div>
						{`${state.searchModel.guest} ${state.searchModel.guest > 1 ? 'Guests' : 'Guest'} ${state.searchModel.room} ${state.searchModel.room > 1 ? 'Rooms' : 'Room'}`}
					</div>
					<div>
						<Icon icon={state.searchModel.nationalityIcon} width="24" height="24" />
					</div>
				</Popover.Trigger>
			{:else}
				<Popover.Trigger
					class={cn(
						buttonVariants({ variant: 'outline' }),
						'flex h-full w-full justify-between  rounded-md'
					)}
					><div>
						{`${state.searchModel.guest} ${state.searchModel.guest > 1 ? 'Guests' : 'Guest'} ${state.searchModel.room} ${state.searchModel.room > 1 ? 'Rooms' : 'Room'}`}
					</div>
					<div>
						<Icon icon={state.searchModel.nationalityIcon} width="24" height="24" />
					</div>
				</Popover.Trigger>
			{/if}
		</div>
		<Popover.Content class=" h-full w-[340px] gap-5 space-y-6">
			<div class="flex h-full flex-col justify-between space-y-5">
				<div class="flex flex-col gap-7">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<Icon
								icon="fa6-solid:person"
								width="25"
								height="30"
								class="text-muted-foreground"
								style="color: #605d5d"
							/>
							<span>Adult</span>
						</div>
						<div class="flex items-center space-x-2">
							<Button onclick={() => decreaseGuest('guest')} class="h-8 w-8" variant="outline">
								<Icon icon="ic:round-minus" width="24" height="24" style="color: #605d5d" />
							</Button>
							<span class="text-md w-5 text-center">{state.searchModel.guest}</span>
							<Button onclick={() => increaseGuest('guest')} class="h-8 w-8" variant="outline">
								<Icon icon="tabler:plus" width="24" height="24" style="color: #605d5d" />
							</Button>
						</div>
					</div>

					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-2">
							<Icon icon="lucide:hotel" width="24" height="24" style="color: #605d5d" />
							<span>Room</span>
						</div>
						<div class="flex items-center space-x-2">
							<Button onclick={() => increaseGuest('room')} class="h-8 w-8" variant="outline">
								<Icon icon="ic:round-minus" width="24" height="24" style="color: #605d5d" />
							</Button>
							<span class="text-md w-5 text-center">{state.searchModel.room}</span>
							<Button onclick={() => increaseGuest('room')} class="h-8 w-8" variant="outline">
								<Icon icon="tabler:plus" width="24" height="24" style="color: #605d5d" />
							</Button>
						</div>
					</div>
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-2">
							<Icon
								icon="material-symbols-light:flag-rounded"
								width="26"
								height="26"
								style="color: #605d5d"
							/>
							<span>Nationality</span>
						</div>
						<div class="flex items-center space-x-2">
							<SelectWrapper
								options={dummy.nationality}
								variant="default"
								title=""
								placeholder="Search Nationality"
								bind:value={state.searchModel.nationalityName}
							>
								{#snippet icon()}
									<Icon icon={state.searchModel.nationalityIcon} width="24" height="24" />
								{/snippet}
								{#snippet outlet({ item, onSelect }: any)}
									<SelectNationality {state} {item} {onSelect} />
								{/snippet}
							</SelectWrapper>
						</div>
					</div>
				</div>
				<div class="flex justify-end pt-2">
					<Popover.Close>
						<Button class="w-[120px]">Done</Button>
					</Popover.Close>
				</div>
			</div>
		</Popover.Content>
	</Popover.Root>
</div>
