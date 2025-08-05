<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { defaults, superForm, type SuperForm } from 'sveltekit-superforms';
	import { articleSchema } from './article-schema';
	import { zod } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { ChevronLeft } from '@lucide/svelte';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { TextEditor } from '$lib/components/opsigo-ui/text-editor';
	import dayjs from 'dayjs';
	import { onMount } from 'svelte';
	import { TagsInput, TextField } from '$lib/components/opsigo-ui/input';
	import { Switch } from '$lib/components/ui/switch';
	import { OSGDatePicker } from '$lib/components/opsigo-ui/date-picker';

	let currentDate = $derived(dayjs().format('dddd, DD MMM YYYY HH:mm'));

	let isPreview = $state(false);
	const form = superForm(defaults(zod(articleSchema)), {
		SPA: true,
		validators: zod(articleSchema),
		dataType: 'json',
		resetForm: false
	});

	let { form: formData, enhance, validateForm, errors } = form;

	async function handleSubmit(preview = false) {
		const result = await validateForm({ update: true });
		if (result.valid) {
			isPreview = preview;
			console.log($formData, 'formdata');
			if (!isPreview) toast.success('Success create article');
		} else {
			toast.error('Please check your input');
		}
	}

	const handleBack = () => {
		if (!isPreview) return history.back();
		isPreview = false;
	};
</script>

<div class="container">
	<div class="mb-6 flex items-center justify-between">
		<div class="flex items-center gap-3">
			<button class="rounded-full border border-gray-300 p-1" onclick={() => handleBack()}>
				<ChevronLeft class="h-6! w-6!" />
			</button>
			<h3 class="text-lg font-bold text-gray-800">{isPreview ? 'Preview' : 'Create'} Article</h3>
		</div>
	</div>

	{#if !isPreview}
		{@render formArticle()}
	{:else}
		{@render previewArticle()}
	{/if}
</div>

{#snippet formArticle()}
	<form use:enhance onsubmit={() => handleSubmit()}>
		<div class="grid grid-cols-3 gap-5">
			<Card.Root class="@container/card col-span-2">
				<Card.Content class="space-y-1 px-4 pt-0">
					<TextField {form} name="title" required bind:value={$formData.title} label="Title" />
					<Form.Field {form} name="content">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label required>Content</Form.Label>
								<TextEditor {...props} bind:value={$formData.content} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</Card.Content>
			</Card.Root>
			<div class="flex flex-col gap-5">
				<Card.Root class="@container/card ">
					<Card.Content class="px-4 pt-0">
						<div class="mb-5 flex items-center justify-between">
							<Label class="text-sm font-semibold" for="publish-status">Publish Status</Label>
							<Switch bind:checked={$formData.isPublish} id="publish-status" />
						</div>
						<Form.Field {form} name="publishDate">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label required>Set Publish Date</Form.Label>
									<OSGDatePicker
										{...props}
										triggerClass="border rounded shadow hover:bg-transparent"
										bind:value={$formData.publishDate}
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
						<TextField {form} name="author" required bind:value={$formData.author} label="Author" />
					</Card.Content>
				</Card.Root>
				<Card.Root class="@container/card h-full">
					<Card.Content class="space-y-1 px-4 pt-0">
						<TagsInput {form} name="tags" required bind:value={$formData.tags} label="Tags" />
					</Card.Content>
				</Card.Root>
			</div>
		</div>

		<div class="mt-6 flex justify-end gap-2">
			<!-- <Button
				class="w-max px-8"
				size="lg"
				onclick={() => history.back()}
				variant="outline"
				type="button"
			>
				Cancel
			</Button> -->
			<Button
				class="border-primary text-primary w-max px-8"
				size="lg"
				onclick={() => handleSubmit(true)}
				variant="outline"
			>
				Preview Article
			</Button>
			<Button
				class="border-primary text-primary w-max px-8"
				size="lg"
				onclick={() => handleSubmit(true)}
				variant="outline"
			>
				Save as Draft
			</Button>
			<Button class="w-max px-8" size="lg" type="submit">Save</Button>
		</div>
	</form>
{/snippet}

{#snippet previewArticle()}
	<Card.Root class="@container/card px-6">
		<Card.Content class="px-2 pt-0">
			<div class="article-preview">
				<h1 class="text-2xl font-semibold">{$formData.title}</h1>
				<p class="mb-5 text-sm text-gray-500">{currentDate}</p>
				{@html $formData.content}
				<p class="mt-5"><strong>Tags:</strong> {$formData.tags}</p>
			</div>
		</Card.Content>
	</Card.Root>
{/snippet}
