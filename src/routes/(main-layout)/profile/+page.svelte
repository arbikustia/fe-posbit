<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import MProfile from './_components/page/m-profile.svelte';
	import Profile from './_components/page/profile.svelte';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
	<MProfile />
{:else}
	<Profile />
{/if}
