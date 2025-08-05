<script lang="ts">
	import { OSGDisclaimer } from '$lib/components/disclaimer';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

</script>

<Dialog.Root>
	<Dialog.Trigger class='p-0'>Disclaimer</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px] h-screen overflow-auto">
		<OSGDisclaimer hiddenClose={true} close={() => {}} />
	</Dialog.Content>
</Dialog.Root>
