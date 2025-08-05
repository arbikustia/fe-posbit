<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import Icon from '@iconify/svelte';
	import article, { related_articles } from '$lib/dummy/article.json';

	const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
	const shareText = 'Cek artikel menarik ini!';

	const platforms = [
		{
			id: 'whatsapp',
			icon: 'logos:whatsapp-icon',
			classIcon: 'text-2xl',
			label: 'WhatsApp'
		},
		{
			id: 'facebook',
			icon: 'logos:facebook',
			classIcon: 'text-xl',
			label: 'Facebook'
		},
		{
			id: 'twitter',
			icon: 'pajamas:twitter',
			classIcon: 'text-xl',
			label: 'X'
		},
		{
			id: 'telegram',
			icon: 'logos:telegram',
			classIcon: 'text-xl',
			label: 'Telagram'
		},
		{
			id: 'copy',
			icon: 'mingcute:link-fill',
			classIcon: 'text-xl',
			label: 'Copy Link'
		}
	];

	function share(platform: string) {
		const encodedUrl = encodeURIComponent(shareUrl);
		const encodedText = shareText;
		let url = '';

		switch (platform) {
			case 'whatsapp':
				url = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
				break;
			case 'facebook':
				url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
				break;
			case 'twitter':
				url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
				break;
			case 'telegram':
				url = `https://telegram.me/share/url?url=${encodedUrl}&text=${encodedText}`;
				break;
			default:
				navigator.clipboard.writeText(shareUrl);
				return;
		}
		window.open(url, '_blank');
	}
</script>

<svelte:head>
	<title>{article.title}</title>
</svelte:head>

<div class="mt-2 bg-white">
	<div class="container mx-auto text-gray-800">
		<!-- Breadcrumb -->
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/">Fitur & Layanan Keuangan</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page class="capitalize">{article.title}</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>

		<!-- Title -->
		<h1 class="article-title">{article.title}</h1>
		<div class="article-info">
			<div class="text-sm text-gray-600">
				Diperbarui {article.updatedAt} · Baca {article.readCount}
			</div>
			{@render shareSocmed()}
		</div>

		<!-- Content -->
		<article class="article-content">
			{@html article.content}
		</article>

		<div class="article-tags">
			<Icon icon="solar:tag-outline" /><span> <strong>Tags:</strong> {article.tags} </span>
		</div>

		{@render relatedArticles()}
	</div>
</div>

{#snippet relatedArticles()}
	<section class="py-6">
		<h2 class="related-article-title">Artikel Terkait</h2>
		<div class="grid gap-4 lg:grid-cols-3">
			{#each related_articles as article}
				<div class="rounded-xl bg-white">
					<img src={article.image} alt={article.title} class="w-full object-cover lg:h-48" />
					<div class="p-4">
						<h3 class="mb-2 text-sm leading-snug font-semibold">{article.title}</h3>
						<p class="text-xs text-gray-500">
							{article.category} • Diperbarui {article.updatedAt} • Baca {article.readCount} menit
						</p>
					</div>
				</div>
			{/each}
		</div>
	</section>
{/snippet}

{#snippet shareSocmed()}
	<div class="flex gap-3">
		{#each platforms as { id, icon, label, classIcon }}
			<button
				onclick={() => share(id)}
				class="rounded-sm bg-white px-3 py-[10px] shadow"
				aria-label={`Bagikan ke ${label}`}
			>
				<Icon {icon} class={classIcon} />
			</button>
		{/each}
	</div>
{/snippet}

<style>
	@reference '$appCss';
	.article-title {
		@apply mt-6 mb-4 text-xl font-bold md:text-3xl;
	}
	.article-info {
		@apply mb-4 flex items-center justify-between;
	}
	.article-content {
		@apply space-y-4 text-sm leading-relaxed md:text-base;
	}
	.article-tags {
		@apply mt-4 inline-flex items-center gap-2 text-sm md:text-base;
	}
	.related-article-title {
		@apply mb-4 text-xl font-semibold md:text-2xl;
	}
</style>
