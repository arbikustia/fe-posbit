<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
	<Card.Root class="mx-auto w-96">
		<Card.Header>
			<Card.Title class="text-2xl">Forgot Password</Card.Title>
			<Card.Description>Enter your email below</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="grid gap-4">
				<div class="grid gap-2">
					<Label for="email">Email</Label>

					<Input id="email" type="email" placeholder="m@example.com" required />
				</div>

				<Button href="/" type="submit" class="w-full">Submit</Button>
			</div>
		</Card.Content>
	</Card.Root>
</div>
