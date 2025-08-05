<script lang="ts">
	import Quill from 'quill';
	import 'quill/dist/quill.snow.css';
	import { onMount } from 'svelte';

	let { value = $bindable('') } = $props();

	let quillInstance: Quill;

	const toolbarOptions = [
		['bold', 'italic', 'underline', 'strike'],
		['blockquote', 'code-block'],
		['link', 'image', 'video', 'formula'],
		[{ header: 1 }, { header: 2 }],
		[{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
		[{ script: 'sub' }, { script: 'super' }],
		[{ indent: '-1' }, { indent: '+1' }],
		[{ direction: 'rtl' }],
		[{ size: ['small', false, 'large', 'huge'] }],
		[{ header: [1, 2, 3, 4, 5, 6, false] }],
		[{ color: [] }, { background: [] }],
		[{ font: [] }],
		[{ align: [] }],
		['clean']
	];

	onMount(() => {
		quillInstance = new Quill('#editor', {
			debug: 'warn',
			modules: {
				toolbar: toolbarOptions
			},
			placeholder: 'Type article...',
			theme: 'snow'
		});

		// Set initial content
		quillInstance.root.innerHTML = value;

		// Listen for content change and update `value`
		quillInstance.on('text-change', () => {
			value = quillInstance.root.innerHTML;
		});
	});
</script>

<div id="editor"></div>

<style>
	:global(.ql-editor) {
		min-height: 200px;
	}
</style>
