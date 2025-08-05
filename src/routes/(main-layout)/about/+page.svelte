<script>
	import { Button } from '$lib/components/ui/button';
	import { flip } from 'svelte/animate';
	import { slide } from 'svelte/transition';
	import Popover from './Popover.svelte';
	import * as Card from '$lib/components/ui/card/index';
	import Icon from '@iconify/svelte';

	let sortBy = $state('name');
	let people = $state([
		{ name: 'John', age: 25 },
		{ name: 'Jane', age: 20 },
		{ name: 'Doe', age: 30 },
		{ name: 'Alice', age: 28 },
		{ name: 'Bob', age: 22 },
		{ name: 'Charlie', age: 35 },
		{ name: 'Eve', age: 27 },
		{ name: 'Frank', age: 24 },
		{ name: 'Grace', age: 29 },
		{ name: 'Hank', age: 31 },
		{ name: 'Ivy', age: 26 },
		{ name: 'Jack', age: 23 },
		{ name: 'Kelly', age: 32 }
	]);

	let sortedPeople = $derived(() => {
		//return [...people].sort((a, b) => a.age - b.age);
		if (sortBy == 'name') {
			return [...people].sort((a, b) => a.name.localeCompare(b.name));
		} else {
			return [...people].sort((a, b) => a.age - b.age);
		}
	});

	let i = 1;
	function add() {
		people.push({
			name: 'New ' + i++,
			age: Math.floor(Math.random() * 100)
		});
	}

	function toggleSort() {
		if (sortBy == 'name') {
			sortBy = 'age';
		} else sortBy = 'name';
	}

	// @ts-ignore
	function delItem(name2) {
		people = people.filter((item) => item.name !== name2); // Hapus angka 3
	}
</script>

<Button onclick={add}>Add</Button>
<Button onclick={toggleSort}>Sort By : {sortBy}</Button>

<Popover />
<Popover />
<Popover />

<div class="mt-5 flex max-w-[300px] flex-col gap-y-3 rounded-lg bg-gray-100 p-3">
	{#each sortedPeople() as person (person.name)}
		<div animate:flip={{ duration: 300 }} transition:slide>
			<Card.Root>
				<Card.Content class="flex items-center justify-between px-5 py-2">
					{person.name} - {person.age}
					<Button
						onclick={() => {
							delItem(person.name);
						}}
						variant="ghost"
						size="icon"><Icon icon="tabler:trash" /></Button
					>
				</Card.Content>
			</Card.Root>
		</div>
	{/each}

	<Button>Test</Button>
</div>
