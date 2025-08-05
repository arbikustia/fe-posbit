<script>
  let isOpen = true;

  const paymentDetails = [
    { label: "Net to Agent", value: "IDR 9.950.000" },
    { label: "Room Category - 1", value: "IDR 9.950.000" },
    { label: "Net to Agent", value: "IDR 25.000" },
    { label: "Value Added Tax (VAT)", value: "IDR 25.000" }
  ];

  const total = "IDR 10.000.000";
</script>

<div class="w-full text-sm space-y-2 mt-5">
  <h2 class="font-bold text-lg">Payment</h2>

  <div class="bg-white shadow-md rounded-md border border-gray-200">
    <!-- Header -->
    <button
      on:click={() => (isOpen = !isOpen)}
      class="w-full px-4 py-2 flex justify-between items-center font-medium"
    >
      <span>Payment Details</span>
      <svg
        class="w-4 h-4 transition-transform duration-200"
        style:transform={isOpen ? 'rotate(180deg)' : ''}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Details -->
    {#if isOpen}
      <div class="px-4 pb-2 space-y-1">
        {#each paymentDetails as item}
          <div class="flex justify-between">
            <span>{item.label}</span>
            <span>{item.value}</span>
          </div>
        {/each}

        <hr class="my-2" />

        <div class="flex justify-between font-semibold">
          <span>Total Payment</span>
          <span>{total}</span>
        </div>
      </div>
    {/if}
  </div>
</div>
