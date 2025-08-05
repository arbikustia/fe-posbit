<script>
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

  const statuses = [
    { name: 'Reserved', value: 31, color: 'bg-blue-500' },
    { name: 'Ticketed', value: 50, color: 'bg-green-500' },
    { name: 'Expired', value: 15, color: 'bg-gray-300' },
    { name: 'Cancelled', value: 40, color: 'bg-orange-500' },
    { name: 'Error', value: 41, color: 'bg-red-500' }
  ];

  const maxValue = 60; // Maximum scale for chart
  const scaleMarks = [10, 20, 30, 40, 50];
  
  // Calculate percentage width for each bar
  const getBarWidth = (/** @type {number} */ value) => (value / maxValue) * 100;
</script>

<Card class="w-full">
  <CardHeader class="pb-4">
    <CardTitle class="text-lg font-semibold text-gray-900">Bookings by Status</CardTitle>
  </CardHeader>
  <CardContent class="space-y-3">
    {#each statuses as status}
      <div class="flex items-center gap-3">
        <!-- Status Label -->
        <div class="w-20 text-sm text-gray-700 text-right">
          {status.name}
        </div>
        
        <!-- Bar Container -->
        <div class="flex-1 relative">
          <div class="h-5 bg-gray-100 rounded-sm overflow-hidden">
            <div 
              class="h-full rounded-sm transition-all duration-500 ease-out {status.color}" 
              style="width: {getBarWidth(status.value)}%"
            ></div> <div></div>
            
          </div>
          
        </div>
        
        <!-- Value Label -->
        <div class="w-6 text-sm text-gray-500 text-left">
          {status.value}
        </div>
      </div>
    {/each}
    
    <!-- Scale/X-axis -->
    <div class="flex items-center gap-3 mt-4">
      <div class="w-20"></div> <!-- Spacer for label column -->
      <div class="flex-1 relative">
        <div class="flex justify-between text-xs text-gray-400 mt-1">
          {#each scaleMarks as mark}
            <span>{mark}</span>
          {/each}
        </div>
      </div>
      <div class="w-6"></div> <!-- Spacer for value column -->
    </div>
  </CardContent>
</Card>

<style>
  :global(.bg-blue-500) {
    background-color: #3b82f6;
  }
  :global(.bg-green-500) {
    background-color: #10b981;
  }
  :global(.bg-gray-300) {
    background-color: #d1d5db;
  }
  :global(.bg-orange-500) {
    background-color: #f97316;
  }
  :global(.bg-red-500) {
    background-color: #ef4444;
  }
</style>