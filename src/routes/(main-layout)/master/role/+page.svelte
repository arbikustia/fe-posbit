<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { RolePage } from './_components/page';

	const { isMobile } = getDeviceContext();
</script>

<div class="container space-y-5">
	<RolePage />
</div>
