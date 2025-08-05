<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import Icon from '@iconify/svelte';
    const {variant, tooltipContent} = $props();

</script>


<Tooltip.Provider>
    <Tooltip.Root>
        <Tooltip.Trigger>
            {#if variant === 'red'}
            <Icon icon="proicons:info" width="24" height="24" style="color: #c10303" />
                {:else}
            <Icon icon="proicons:info" width="24" height="24" style="color: #029f31" />
            {/if}
        </Tooltip.Trigger>
		<Tooltip.Content class="w-56">
            {@render tooltipContent()}
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
