<script>
	import Icon from '@iconify/svelte';

	export let name = 'Mr. John Doe';
	export let email = 'johndoe@gmail.com';
	export let phone = '+6286543893453';
</script>

<div class="w-full space-y-2 pt-5 text-sm">
	<h2 class="text-lg font-bold">Booking Contact</h2>

	<div class="space-y-2 rounded-md p-4 border border-gray-200 shadow-md">
		<div class="font-bold">{name}</div>

		<div class="flex items-center space-x-5">
			<Icon icon="mdi:email" width="18" height="18" style="color: #6c6c6c" />
			<span>{email}</span>
		</div>

		<div class="flex items-center space-x-5">
			<Icon icon="iconoir:phone" width="18" height="18" style="color: #6c6c6c" />
			<span>{phone}</span>
		</div>
	</div>
</div>
