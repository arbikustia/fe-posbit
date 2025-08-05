<script>
	import { getDeviceContext } from '$lib/context/device';
	import LoginV2 from './login-v2.svelte';
	import MLoginV2 from './m-login-v2.svelte';


	const { isMobile } = getDeviceContext();
	export let data;
</script>

{#if isMobile}
	<MLoginV2 {data} />
{:else}
	<LoginV2 {data} />
{/if}
