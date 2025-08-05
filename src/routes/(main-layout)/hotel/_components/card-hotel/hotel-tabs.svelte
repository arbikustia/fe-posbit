<script>
    export let hotel;
  
    let active = 'description';
    const tabs = ['description', 'facilities', 'location', 'reviews'];
  </script>
  
  <div class="bg-white rounded-2xl shadow-md border mb-6 overflow-hidden">
    <div class="flex border-b px-6 pt-4 space-x-4">
      {#each tabs as tab}
        <button
          on:click={() => active = tab}
          class={`capitalize pb-3 text-sm font-medium transition 
            ${active === tab 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-500 hover:text-blue-500'}
          `}
        >
          {tab}
        </button>
      {/each}
    </div>
  
    <div class="p-6 text-sm text-gray-700">
      {#if active === 'description'}
        <p>{hotel.description}</p>
      {:else if active === 'facilities'}
        <ul class="list-disc pl-5 grid grid-cols-2 gap-1">
          {#each hotel.facilities as item}
            <li>{item}</li>
          {/each}
        </ul>
      {:else if active === 'location'}
        <p>{hotel.address}</p>
      {:else if active === 'reviews'}
        <p>No reviews available yet.</p>
      {/if}
    </div>
  </div>
  