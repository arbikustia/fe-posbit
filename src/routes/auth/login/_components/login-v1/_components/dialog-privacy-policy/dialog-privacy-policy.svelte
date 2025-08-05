<script lang="ts">
	import { OSGPrivacyPolicy } from '$lib/components/privacy-policy';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
</script>

<Dialog.Root>
	<Dialog.Trigger class="p-0">Privacy Policy</Dialog.Trigger>
	<Dialog.Content class="h-screen overflow-auto sm:max-w-[425px]">
		<OSGPrivacyPolicy hiddenClose={true} close={() => {}} />
	</Dialog.Content>
</Dialog.Root>
