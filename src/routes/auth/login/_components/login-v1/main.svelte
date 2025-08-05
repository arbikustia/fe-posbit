<script>
	import { getDeviceContext } from '$lib/context/device';
	import LoginV1 from './login-v1.svelte';
	import MLoginV1 from './m-login-v1.svelte';

	const { isMobile } = getDeviceContext();
	export let data;
</script>

{#if isMobile}
	<MLoginV1 {data} />
{:else}
	<LoginV1 {data} />
{/if}
