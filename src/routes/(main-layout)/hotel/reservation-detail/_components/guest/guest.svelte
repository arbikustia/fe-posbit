<script>
  let guests = [
    { room: 1, no: 1, name: "Mr. John Doe", phone: "09124567", voucher: "" },
    { room: 1, no: 2, name: "Mr. John Doe", phone: "09124567", voucher: "HNDJE1JA123" },
    { room: 2, no: 1, name: "Mr. John Doe", phone: "09124567", voucher: "" }
  ];
</script>

<div class="max-w-4xl w-full text-sm space-y-2 mt-5">
  <h2 class="font-bold text-lg">Guest</h2>

  <div class="overflow-x-auto rounded border border-gray-200 shadow-md">
    <table class="min-w-full table-auto border-collapse">
      <thead class="bg-gray-100 text-left text-sm">
        <tr>
          <th class="border px-4 py-2">Room</th>
          <th class="border px-4 py-2">No.</th>
          <th class="border px-4 py-2">Name</th>
          <th class="border px-4 py-2">Phone Number</th>
          <th class="border px-4 py-2">Voucher Number</th>
        </tr>
      </thead>
      <tbody>
        {#each guests as guest}
          <tr>
            <td class="border px-4 py-2">{guest.room}</td>
            <td class="border px-4 py-2">{guest.no}</td>
            <td class="border px-4 py-2">{guest.name}</td>
            <td class="border px-4 py-2">{guest.phone}</td>
            <td class="px-4 py-2">{guest.voucher}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
