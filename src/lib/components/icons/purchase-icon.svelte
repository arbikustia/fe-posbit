
<script lang="ts">
  import type { WithElementRef } from '$lib/utils';
  import type { SVGAttributes } from 'svelte/elements';

  // Semua props SVG bisa diteruskan, misal class, width, height, stroke, dll
  let { ...props }: WithElementRef<SVGAttributes<SVGSVGElement>> = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 32 32"
  {...props}
>
  <g
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="1.5"
  >
    <path
      d="M28 6H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2m0 2v3H4V8ZM4 24V13h24v11Z"
    />
    <path d="M6 20h10v2H6z" />
  </g>
</svg>
