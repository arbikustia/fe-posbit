<script>
  let roomRemarks = [
    { room: 1, remark: "No Smoking Room" },
    { room: 2, remark: "Double Bed" }
  ];
</script>

<div class="max-w-xl w-full space-y-3 mt-5">
  <h2 class="font-bold text-lg">Remarks for Hotel</h2>

  <div class="bg-white rounded-lg shadow-md border border-gray-200 p-4 space-y-4 text-sm">
    {#each roomRemarks as item, index}
      <div class="space-y-1 border-b pb-4 last:border-none last:pb-0">
        <p class="font-semibold">{index + 1}. Room {item.room}</p>
        <p class="pl-4 text-gray-700">{item.remark}</p>
      </div>
    {/each}
  </div>
</div>
