<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    
    const fruits = [
     { value: "all type", label: "All Type" },
     { value: "superior room", label: "Superior Room" },
     { value: "deluxe room", label: "Deluxe Room" },
    ];
    
    let value = $state("");
    
    const triggerContent = $derived(
     fruits.find((f) => f.value === value)?.label ?? "All Type"
    );
   </script>
    
   <Select.Root type="single" name="favoriteFruit" bind:value>
    <Select.Trigger class="w-[180px]">
     {triggerContent}
    </Select.Trigger>
    <Select.Content>
     <Select.Group>
      {#each fruits as fruit (fruit.value)}
       <Select.Item value={fruit.value} label={fruit.label}
        >{fruit.label}</Select.Item
       >
      {/each}
     </Select.Group>
    </Select.Content>
   </Select.Root>