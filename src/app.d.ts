// See https://svelte.dev/docs/kit/types#app.d.ts

import type { UserLogin } from '$lib/types/UserLogin';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface Locals {
			currentUser: UserLogin | null;
			isMobile: boolean;
		}
	}
}

export {};
