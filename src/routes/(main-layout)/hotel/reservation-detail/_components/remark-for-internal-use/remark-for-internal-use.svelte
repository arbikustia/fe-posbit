<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";

  let guests = [
    { no: 1, name: "Mr. John Doe", remark: "" },
    { no: 2, name: "Mr. John Doe", remark: "" },
    { no: 3, name: "Mr. John Doe", remark: "" }
  ];

  function addRemark(index:number) {
    const remark = prompt("Enter remark:");
    if (remark !== null) {
      guests[index].remark = remark;
    }
  }
</script>

<div class="max-w-xl w-full space-y-3 mt-5">
  <h2 class="font-bold text-lg">Remarks for Internal Use</h2>

  <div class="bg-white rounded shadow-md border border-gray-200 p-4 space-y-4 text-sm">
    {#each guests as guest, index}
      <div class="space-y-1 border-b pb-4 last:border-none last:pb-0">
        <div class="flex items-center justify-between">
          <span class="font-semibold">{index + 1}. {guest.name}</span>
          <Button
            class="text-white h-8 text-xs px-3 py-1 rounded "
            onclick={() => addRemark(index)}
          >
            + Add Remark
          </Button>
        </div>
        <p class="pl-4 text-gray-400 italic">
          {guest.remark || "No Remarks Added"}
        </p>
      </div>
    {/each}
  </div>
</div>
