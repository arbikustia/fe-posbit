<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { UserPage } from './_components/page';

	const { isMobile } = getDeviceContext();
</script>

<div class="container space-y-5">
	<UserPage />
</div>
