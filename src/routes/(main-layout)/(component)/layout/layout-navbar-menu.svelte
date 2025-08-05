<script lang="ts">
	import LayoutNavBarMenuItem from './layout-navbar-menu-item.svelte';
	import * as m from '$lib/paraglide/messages.js';
</script>

<nav class="flex items-center justify-center">
	<LayoutNavBarMenuItem href="/flight" label={m.flight()}>
		<svg
			class="size-5!"
			slot="icon"
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			{...$$props}
		>
			<path
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="1.5"
				d="M15.867 3.78c.926-.748 1.964-.794 3.097-.778c.587.009.88.013 1.115.104c.373.145.67.442.815.815c.091.235.095.528.104 1.115c.016 1.133-.03 2.17-.778 3.097c-.63.78-1.714 1.188-2.235 2.05c-.398.656-.213 1.337-.042 2.038l1.28 5.245c.255 1.046.06 1.715-.67 2.446c-.389.39-.713.37-1.028-.133l-3.862-6.154l-1.845 1.466c-.669.532-1.003.798-1.179 1.172c-.411.876-.15 2.192-.137 3.142c.008.525-.446 1.56-1.088 1.594c-.396.022-.531-.452-.66-.743l-1.232-2.802c-.294-.67-.306-.682-.976-.976l-2.802-1.233c-.29-.128-.765-.263-.743-.659c.035-.642 1.07-1.096 1.594-1.088c.95.013 2.266.274 3.142-.137c.374-.176.64-.51 1.172-1.18l1.466-1.844l-6.154-3.862c-.503-.316-.522-.639-.133-1.028c.73-.73 1.4-.925 2.446-.67l5.245 1.28c.7.171 1.382.356 2.039-.042c.861-.52 1.269-1.604 2.049-2.235"
				color="currentColor"
			/>
		</svg>
	</LayoutNavBarMenuItem>

	<LayoutNavBarMenuItem href="/hotel" label="Hotel">
		<svg
			slot="icon"
			class="size-5!"
			xmlns="http://www.w3.org/2000/svg"
			width="144"
			height="144"
			viewBox="0 0 24 24"
		>
			<g
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="1.5"
				color="currentColor"
			>
				<path
					d="M3 4v16c0 .943 0 1.414.293 1.707S4.057 22 5 22h14c.943 0 1.414 0 1.707-.293S21 20.943 21 20V4M10.5 8v1.5m0 1.5V9.5m3-1.5v1.5m0 1.5V9.5m-3 0h3"
				/>
				<path
					d="M14 22v-4a2 2 0 1 0-4 0v4M2 4h6c.64-1.173 2.19-2 4-2s3.36.827 4 2h6M6 8h1m-1 4h1m-1 4h1m10-8h1m-1 4h1m-1 4h1"
				/>
			</g>
		</svg>
	</LayoutNavBarMenuItem>

	<LayoutNavBarMenuItem href="/train" label={m.train()}>
		<svg
			class="size-5!"
			slot="icon"
			xmlns="http://www.w3.org/2000/svg"
			width="144"
			height="144"
			viewBox="0 0 32 32"
		>
			<path
				fill="currentColor"
				d="M30 25H2v2h2v2h2v-2h5v2h2v-2h5v2h2v-2h5v2h2v-2h3zm-.286-8.41L18.15 8.64A14.93 14.93 0 0 0 9.652 6H2v2h7.652a12.95 12.95 0 0 1 7.365 2.287l1.036.713H9v2h11.962l7.62 5.238A.966.966 0 0 1 28.033 20H2v2h26.034a2.966 2.966 0 0 0 1.68-5.41"
			/>
		</svg>
	</LayoutNavBarMenuItem>

	<LayoutNavBarMenuItem href="/insurance" label={m.insurance()}>
		<svg
			class="size-5!"
			slot="icon"
			xmlns="http://www.w3.org/2000/svg"
			width="144"
			height="144"
			viewBox="0 0 24 24"
		>
			<path
				fill="currentColor"
				d="M12.558 2.982a1.75 1.75 0 0 0-1.122 0L4.66 5.277a1.19 1.19 0 0 0-.817 1.019c-.337 4.226.248 7.351 1.637 9.712c1.344 2.285 3.494 3.946 6.517 5.184c3.026-1.238 5.178-2.899 6.522-5.184c1.39-2.36 1.975-5.486 1.638-9.712a1.19 1.19 0 0 0-.817-1.019zm-1.603-1.42a3.25 3.25 0 0 1 2.084-.001l6.782 2.295a2.69 2.69 0 0 1 1.83 2.32c.353 4.41-.24 7.876-1.839 10.593c-1.604 2.725-4.161 4.598-7.54 5.929a.75.75 0 0 1-.55 0c-3.376-1.331-5.932-3.204-7.535-5.929c-1.598-2.717-2.191-6.184-1.839-10.593a2.69 2.69 0 0 1 1.83-2.32z"
			/>
			<path
				fill="currentColor"
				d="M12 20c5.032-2.04 7.406-5.618 6.943-12.367c-.052-.767-.576-1.416-1.303-1.669l-4.82-1.678a2.5 2.5 0 0 0-.82-.139z"
				opacity="0.5"
			/>
		</svg>
	</LayoutNavBarMenuItem>
</nav>
