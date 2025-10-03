<script>
	import {  OSGLoginV1 } from './_components/login-v1';
	import { LoginV2, LoginV2Left, LoginV2Right } from './_components/login-v2';
	import { page } from '$app/state';
	import { LoginV3 } from './_components/login-v3';
	export let data;

	const searchParam = Object.fromEntries(page.url.searchParams);
</script>

{#if searchParam.id == 'v2'}
	{#if searchParam.layout == 'right'}
		<LoginV2Right {data} />
	{:else if searchParam.layout == 'left'}
		<LoginV2Left {data} />
	{:else}
		<LoginV2 {data} />
	{/if}
{:else if searchParam.id == 'v3'}
	<LoginV3 {data} />
{:else}
	<!-- <OSGLoginV1 {data} /> -->
	 <LoginV2 {data} />
{/if}
