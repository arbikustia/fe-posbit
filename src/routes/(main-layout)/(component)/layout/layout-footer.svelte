<script lang="ts">
	import { ThemeCostumizer } from '../theme-costumizer';
	import * as m from '$lib/paraglide/messages.js';
	import { LanguageSwitch } from '../language-switch';
	import { APP_VERSION } from '$lib/constants/app';
</script>

<footer class="sticky top-[100lvh] bg-gray-100 py-10">
	<div class="mx-auto max-w-6xl px-4">
		<div class="flex items-center">
			<div class="text-center">
				<div class="flex items-center gap-x-4">
					<!-- <LanguageSwitch />
					<ThemeCostumizer /> -->
				</div>
			</div>

			<div class="ml-auto">
				<div class="mt-3 text-right text-sm text-gray-500">
					<span class=" inline">&copy; {new Date().getFullYear()} Bantuit</span>
					<span class=" inline">All rights reserved.</span>
					<div class="ml-4 items-end text-gray-400">v.{APP_VERSION}</div>
				</div>
			</div>
		</div>
	</div>
</footer>
