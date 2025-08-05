<script>
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<svelte:head>
	<title>Help Center</title>
</svelte:head>

<div class="text-column">
	<h1 class="text-xl">Help Center</h1>

	<p>
		This is a <a href="https://svelte.dev/docs/kit">SvelteKit</a> app. You can make your own by typing
		the following into your command line and following the prompts:
	</p>

	<pre>npx sv create</pre>

	<p>
		The page you're looking at is purely static HTML, with no client-side interactivity needed.
		Because of that, we don't need to load any JavaScript. Try viewing the page's source, or opening
		the devtools network panel and reloading.
	</p>
</div>
<button on:click={() => alert('Button clicked!')}>wwaaa</button>
<Button onclick={(e) => alert('Button clickeddd!' + e.x)}>waw</Button>
