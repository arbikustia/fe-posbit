<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import * as Card from '$lib/components/ui/card';
	import type { BookingContactProps } from './types';
	import { Mail, Phone, User } from '$lib/components/icons';

	let { contact }: Pick<BookingContactProps, 'contact'> = $props();
</script>

<Card.Root class="rounded-none py-0">
	<Card.Content class="p-2 px-0">
		<div class="px-4">Booking Contact</div>
		<Separator class="my-2" />
		<div class="space-y-2 px-4 py-2">
			<div class="flex items-center gap-2">
				<User class="h-5 w-5" />
				<p class="font-semibold">{contact.name}</p>
			</div>
			<div class="flex items-center gap-2">
				<Mail class="h-5 w-5" />
				<a href="mailto:{contact.email}">{contact.email}</a>
			</div>
			<div class="flex items-center gap-2">
				<Phone class="h-5 w-5" />
				<a href="tel:{contact.phone}">{contact.phone}</a>
			</div>
		</div>
	</Card.Content>
</Card.Root>
