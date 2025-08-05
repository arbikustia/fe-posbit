<script lang="ts">
  let guests = [
    { no: 1, name: "Remark for Internal Use", remark: "" },
    { no: 2, name: "Remark for Hotel", remark: "" },
    { no: 3, name: "Attachments", remark: "No Attachments Added" }
  ];

  function addRemark(index:number) {
    const remark = prompt("Enter remark:");
    if (remark !== null) {
      guests[index].remark = remark;
    }
  }
</script>

<div class="max-w-xl w-full space-y-3 mt-10">
  <h2 class="font-bold px-3 text-md">Remarks for Internal Use</h2>

  <div class="bg-white rounded shadow-lg p-4 space-y-4 text-sm">
    {#each guests as guest, index}
      <div class="space-y-1 border-b pb-4 last:border-none last:pb-0">
        <div class="flex items-center justify-between">
          <span class="font-semibold">{index + 1}. {guest.name}</span>
          <button
            class="bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600"
            on:click={() => addRemark(index)}
          >
            + Add Remark
          </button>
        </div>
        <p class="pl-4 text-gray-400 italic">
          {guest.remark || "No Remarks Added"}
        </p>
      </div>
    {/each}
  </div>
</div>
