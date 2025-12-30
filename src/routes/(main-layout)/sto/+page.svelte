<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { StoPage } from './components/page';

	const { isMobile } = getDeviceContext();
</script>

<div class="container space-y-5">
	<StoPage />
</div>
