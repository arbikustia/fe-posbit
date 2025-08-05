<script lang="ts">
	import { Share } from '$lib/components/icons';
	import { OSGHtmlToImage } from '$lib/components/opsigo-ui/html-to-image';
	import { buttonVariants } from '$lib/components/ui/button/';
	import * as Popover from '$lib/components/ui/popover';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { formatThousand } from '$lib/helpers/number-helper';
	import { copyToClipboard } from '$lib/utils';
	import dayjs from 'dayjs';
	import { Clipboard, Image } from '@lucide/svelte';

	let { insurance } = $props();

	function copyRegularFormat() {
		let text = `Insurance Options\n\n${insurance.length} insurance plans found\n\n`;

		insurance.forEach((item: any, idx: number) => {
			text += `${idx + 1}. ${item.provider} - ${item.planName}\nCoverage: ${item.coverage.filter((c: any) => c.checked).map((c: any) => c.name).join(', ')}\nAge Range: ${item.ageRange[0]}-${item.ageRange[1]}\nType: ${item.type}\nPrice: ${formatThousand(item.price)} ${item.currency}\n\n`;
		});

		copyToClipboard(text);
	}

	function copySimpleFormat() {
		let text = '';
		insurance.forEach((item: any) => {
			text += `${item.provider} - ${item.planName}, ${item.coverage.filter((c: any) => c.checked).map((c: any) => c.name).join(', ')}, Age ${item.ageRange[0]}-${item.ageRange[1]}, ${formatThousand(item.price)} ${item.currency}`;
			text += '\n';
		});

		copyToClipboard(text);
	}

	function copyFormattedFormat() {
		let text = `*Insurance Options*\n\n_${insurance.length} insurance plans found_\n\n`;

		insurance.forEach((item: any, idx: number) => {
			text += `*${idx + 1}. ${item.provider} - ${item.planName}*\n🌍 ${item.coverage.filter((c: any) => c.checked).map((c: any) => c.name).join(', ')}\n👵 Age: ${item.ageRange[0]}-${item.ageRange[1]}\n📝 Type: ${item.type}\n💰 *${formatThousand(item.price)} ${item.currency}*\n\n`;
		});

		copyToClipboard(text);
	}
</script>

<Popover.Root>
	<Popover.Trigger class={buttonVariants({ variant: 'outline' })}>
		<Share />
	</Popover.Trigger>
	<Popover.Content class="w-48 p-2">
		<div class="flex flex-col gap-1">
			<OSGHtmlToImage
				filename="opsigo-insurance-options-{dayjs().format('YYYY-MM-DD')}.png"
				variant="ghost"
			>
				{#snippet html()}
					<div class="w-[1000px] bg-white p-6">
						<!-- Header -->
						<div class="mb-6">
							<img class="mb-5 block h-8 w-auto" src="/images/opsigo-logo.png" alt="Opsigo" />
							<h2 class="text-2xl font-bold text-black">Insurance Options</h2>
							<p class="mt-1 text-gray-600">Generated on {dayjs().format('dddd, DD MMM YYYY HH:mm')}</p>
						</div>

						<!-- Insurance Table -->
						<table class="w-full border-collapse">
							<thead class="">
								<tr class="text-md border-b bg-blue-700 text-left font-bold text-white">
									<th class="px-4 py-3">No</th>
									<th class="px-4 py-3">Product</th>
									<th class="px-4 py-3">Coverage Area</th>
									<th class="px-4 py-3">Age Claim</th>
									<th class="px-4 py-3 text-right">Price</th>
								</tr>
							</thead>
							<tbody>
								{#each insurance as item, i}
									<tr class={`border-b ${i % 2 == 0 ? '' : 'bg-blue-50'}`}>
										<td class="border-b border-gray-200 px-4 py-3 text-left">{i + 1}</td>
										<td class="border-b border-gray-200 px-4 py-3 text-left">
											<div class="font-medium">{item.provider}</div>
											<div class="text-sm text-gray-600">{item.planName}</div>
										</td>
										<td class="border-b border-gray-200 px-4 py-3 text-left">
											{#each item.coverage.filter((c: any) => c.checked) as coverage}
												<div>{coverage.name}</div>
											{/each}
										</td>
										<td class="border-b border-gray-200 px-4 py-3 text-left">{item.ageRange[0]} - {item.ageRange[1]}</td>
										<td class="border-b border-gray-200 px-4 py-3 text-right">{formatThousand(item.price)} {item.currency}</td>
									</tr>
								{/each}
							</tbody>
						</table>

						<!-- Footer -->
						<div class="mt-6 text-right text-sm text-gray-500">
							<span>
								Generated on {dayjs().format('dddd, DD MMM YYYY HH:mm')}
							</span>
						</div>
					</div>
				{/snippet}
				{#snippet actionContent()}
					<Image class="mr-2 h-4 w-4" />
					Download as Image
				{/snippet}
			</OSGHtmlToImage>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger
					class="inline-flex w-full font-medium gap-2 items-center justify-start rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
				>
					<Clipboard class="mr-2 h-4 w-4" />
					Select Copy Style
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="w-48" side="right" align="start">
					<DropdownMenu.Group>
						<DropdownMenu.Item onSelect={copyRegularFormat}>Regular Format</DropdownMenu.Item>
						<DropdownMenu.Item onSelect={copySimpleFormat}>Simple Format</DropdownMenu.Item>
						<DropdownMenu.Item onSelect={copyFormattedFormat}>Formatted Format</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</Popover.Content>
</Popover.Root>