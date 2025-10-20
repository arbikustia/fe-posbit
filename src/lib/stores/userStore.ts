import { writable, get } from 'svelte/store';
import type { UserLogin } from '$lib/types/UserLogin';

function createStore() {
	const store = writable<UserLogin | null>(null);

	return {
		subscribe: store.subscribe,
		set: function (usr: UserLogin) {
			store.set(usr);
		},
		clear: function () {
			store.set(null);
		},
		getToken: function () {
			return get(store)?.token;
		},
		setToken: function (token: string) {
			const storeVal = get(store);
			if (storeVal) {
				this.set({
					...storeVal,
					token
				});
			}
		}
	};
}

export const userStore = createStore();
