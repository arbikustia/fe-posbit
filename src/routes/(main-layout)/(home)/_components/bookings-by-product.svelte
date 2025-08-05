<script>
  import Icon from '@iconify/svelte';

  const stats = [
    { name: 'Flight', value: 16, icon: 'guidance:plane' },
    { name: 'Train', value: 8, icon: 'carbon:train-speed' },
    { name: 'Hotel', value: 12, icon: 'icon-park-outline:hotel' },
    { name: 'Insurance', value: 18, icon: 'stash:shield-duotone' }
  ];

  const totalBookings = stats.reduce((sum, stat) => sum + stat.value, 0);
</script>

<div class="w-full mx-auto bg-white rounded-lg shadow-xs border border-gray-200 p-6">
  <div class="mb-2">
    <h2 class="text-lg font-semibold text-gray-900 mb-1">Bookings by Product</h2>
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-600">Total Bookings</span>
      <span class="text-lg font-semibold text-gray-900">{totalBookings}</span>
    </div>
  </div>
  
  <div class="grid grid-cols-2 gap-2 justify-center w-full items-center">
    {#each stats as stat}
      <div class="flex items-center shadow-md py-3 border rounded-md gap-5 justify-start px-5 w-full">
        <div class="shrink-0">
          <Icon icon={stat.icon} width="38" height="38" style="color: #797979" />
        </div>
        <div>
          <div class="text-lg text-gray-600 mb-0.5">{stat.name}</div>
          <div class="text-3xl font-semibold text-gray-900">{stat.value}</div>
        </div>
      </div>
    {/each}
  </div>
</div>
