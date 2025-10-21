<script lang="ts">
    import Icon from '@iconify/svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import { goto } from '$app/navigation';
    import { fly } from 'svelte/transition';
    import { cn } from '$lib/utils';
    import { tick, onMount } from 'svelte';
    import * as Pagination from '$lib/components/ui/pagination/index.js';
    import { useCustomerPage } from '../../create/use-create.svelte';

    const { state, handleGetPaged } = useCustomerPage();

    async function toggleSearch() {
        state.showSearch = !state.showSearch;
        if (state.showSearch) {
            await tick();
            state.searchEl?.focus();
        }
    }

    type Customer = {
        id: number;
        customer_name: string;
        phone: string;
        is_member: boolean;
        member_since?: string;
        member_code?: string;
        point?: number;
        open?: boolean;
    };

    onMount(() => {
        handleGetPaged();
    });

    // 🧩 DELETE MODAL
    function openDeleteModal(customer: Customer) {
        state.selectedCustomer = customer;
        state.showDeleteModal = true;
    }

    function closeDeleteModal() {
        state.showDeleteModal = false;
        state.selectedCustomer = null;
    }

    function confirmDelete() {
        if (state.selectedCustomer) {
            // local remove — service call can be added if needed
            state.table = state.table.filter((c: any) => c.id !== state.selectedCustomer?.id);
            closeDeleteModal();
        }
    }
</script>

<div class="w-full">
    <div class="mx-auto max-w-7xl">
        <!-- HEADER -->
        <header class="mb-4 sm:mb-6 md:mb-8">
            <div class="flex items-center justify-between">
                <h1 class="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl lg:text-2xl">
                    Customer List
                </h1>
            </div>

            <div
                class="mt-3 flex flex-row gap-3 sm:mt-4 sm:flex-row sm:items-center sm:justify-between md:mt-6"
            >
                <!-- New Customer Button -->
                <Button
                    onclick={() => goto('/master/customer/create')}
                    class="flex w-32 items-center justify-center gap-2 rounded-full px-3 py-2 text-xs sm:w-auto sm:px-4 md:w-fit md:text-sm"
                >
                    <Icon icon="ic:round-plus" width="20" height="20" class="md:h-6 md:w-6" />
                    <span>New Customer</span>
                </Button>

                <!-- Search Container -->
                <div class="relative flex w-full items-center justify-end sm:w-auto">
                    <div class="overflow-hidden">
                        {#if state.showSearch}
                            <input
                                bind:this={state.searchEl}
                                transition:fly={{ x: 120, duration: 250 }}
                                placeholder="Search customer..."
                                class="bg-primary/10 w-full rounded-full border-none px-3 py-2 pr-10 text-sm shadow-sm transition outline-none sm:w-48 md:w-56"
                            />
                        {/if}
                    </div>

                    <button
                        type="button"
                        class="absolute right-0 rounded-full p-2 transition hover:bg-gray-100 dark:hover:bg-gray-800"
                        onclick={toggleSearch}
                    >
                        <Icon
                            icon="majesticons:search-line"
                            width="20"
                            height="20"
                            class="text-gray-600 md:h-[22px] md:w-[22px]"
                        />
                    </button>
                </div>
            </div>
        </header>

        <!-- TABLE - Horizontal Scroll Container -->
        <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <div class="inline-block min-w-full align-middle">
                <div class="overflow-hidden">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-100">
                            <tr>
                                <th
                                    class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
                                >
                                    No
                                </th>
                                <th
                                    class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
                                >
                                    Customer Name
                                </th>
                                <th
                                    class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
                                >
                                    Phone
                                </th>
                                <th
                                    class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
                                >
                                    Member
                                </th>
                                <th
                                    class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
                                >
                                    Member Since
                                </th>
                                <th
                                    class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
                                >
                                    Member Code
                                </th>
                                <th
                                    class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
                                >
                                    Point
                                </th>
                                <th
                                    class="px-3 py-2.5 text-center text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
                                >
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 bg-white">
                            {#each state.table as c, index}
                                <tr class="transition hover:bg-gray-50">
                                    <td
                                        class="px-3 py-2.5 text-xs whitespace-nowrap text-gray-500 sm:px-4 sm:py-3 md:text-sm"
                                    >
                                        {index + 1}
                                    </td>
                                    <td
                                        class="px-3 py-2.5 text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
                                    >
                                        {c.customer_name}
                                    </td>
                                    <td class="px-3 py-2.5 whitespace-nowrap sm:px-4 sm:py-3 md:text-sm">{c.phone}</td>
                                    <td class="px-3 py-2.5 whitespace-nowrap sm:px-4 sm:py-3 md:text-sm">
                                        <span
                                            class={cn(
                                                'inline-flex rounded-md px-2 py-0.5 text-xs font-medium md:py-1 md:text-sm',
                                                c.is_member
                                                    ? 'bg-green-500/10 text-green-700'
                                                    : 'bg-red-500/10 text-red-700'
                                            )}
                                        >
                                            {c.is_member ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td class="px-3 py-2.5 whitespace-nowrap sm:px-4 sm:py-3 md:text-sm">
                                        {c.member_since || '-'}
                                    </td>
                                    <td class="px-3 py-2.5 whitespace-nowrap sm:px-4 sm:py-3 md:text-sm">
                                        {c.member_code || '-'}
                                    </td>
                                    <td class="px-3 py-2.5 whitespace-nowrap sm:px-4 sm:py-3 md:text-sm">{c.point}</td>
                                    <td class="px-3 py-2.5 text-center whitespace-nowrap sm:px-4 sm:py-3">
                                        {#if c.open}
                                            <div class="flex items-center justify-center gap-2 md:gap-3">
                                                <button
                                                    type="button"
                                                    onclick={() => openDeleteModal(c)}
                                                    class="rounded-full p-1.5 transition hover:scale-110 hover:bg-red-50 md:p-2"
                                                    aria-label="Delete customer"
                                                >
                                                    <Icon
                                                        icon="material-symbols-light:delete-rounded"
                                                        width="18"
                                                        height="18"
                                                        class="md:h-5 md:w-5"
                                                        style="color: #ff0f22"
                                                    />
                                                </button>
                                                <button
                                                    type="button"
                                                    class="rounded-full p-1.5 transition hover:scale-110 hover:bg-yellow-50 md:p-2"
                                                    aria-label="Edit customer"
                                                    onclick={() =>
                                                        goto(
                                                            `/master/customer/create?id=${encodeURIComponent(String(c.id ?? ''))}&customer_name=${encodeURIComponent(
                                                                String(c.customer_name ?? '')
                                                            )}&phone=${encodeURIComponent(String(c.phone ?? ''))}&is_member=${encodeURIComponent(
                                                                String(c.is_member ?? '')
                                                            )}&member_since=${encodeURIComponent(String(c.member_since ?? ''))}&member_code=${encodeURIComponent(
                                                                String(c.member_code ?? '')
                                                            )}&point=${encodeURIComponent(String(c.point ?? ''))}`
                                                        )
                                                    }
                                                >
                                                    <Icon
                                                        icon="lucide:edit"
                                                        width="16"
                                                        height="16"
                                                        class="md:h-[18px] md:w-[18px]"
                                                        style="color: #cea200"
                                                    />
                                                </button>
                                            </div>
                                        {/if}
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- PAGINATION -->
        <div class="w-full">
            <Pagination.Root count={100} perPage={10}>
                {#snippet children({ pages, currentPage })}
                    <div class="mt-4 flex w-full justify-end">
                        <Pagination.Content>
                            <Pagination.Item class="hidden md:block"><Pagination.PrevButton /></Pagination.Item>
                            {#each pages as page (page.key)}
                                {#if page.type === 'ellipsis'}
                                    <Pagination.Item><Pagination.Ellipsis /></Pagination.Item>
                                {:else}
                                    <Pagination.Item>
                                        <Pagination.Link {page} isActive={currentPage === page.value}>
                                            {page.value}
                                        </Pagination.Link>
                                    </Pagination.Item>
                                {/if}
                            {/each}
                            <Pagination.Item class="hidden md:block"><Pagination.NextButton /></Pagination.Item>
                        </Pagination.Content>
                    </div>
                {/snippet}
            </Pagination.Root>
        </div>
    </div>
</div>

<!-- 🧩 DELETE CONFIRM MODAL -->
{#if state.showDeleteModal}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
        onclick={closeDeleteModal}
        transition:fly={{ y: 10, duration: 250 }}
    >
        <div
            class="relative w-full max-w-[90%] rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:max-w-md sm:p-6 dark:border-gray-700 dark:bg-gray-900"
            onclick={(e) => e.stopPropagation()}
            transition:fly={{ y: 15, duration: 200 }}
        >
            <div
                class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 sm:mb-4 sm:h-14 sm:w-14"
            >
                <Icon
                    icon="material-symbols:warning-rounded"
                    width="28"
                    height="28"
                    class="sm:h-8 sm:w-8"
                />
            </div>

            <h2
                class="mb-2 text-center text-base font-semibold text-gray-800 sm:text-lg dark:text-gray-100"
            >
                Delete Confirmation
            </h2>

            <p class="mb-5 text-center text-sm text-gray-600 sm:mb-6 dark:text-gray-400">
                Are you sure you want to delete
                <span class="font-semibold text-gray-800 dark:text-gray-100"
                    >{state.selectedCustomer?.customer_name}</span
                >?
                <span class="block sm:inline">This action cannot be undone.</span>
            </p>

            <div class="flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-3">
                <Button
                    variant="outline"
                    class="w-full rounded-full px-4 py-2 text-sm transition hover:bg-gray-100 sm:w-auto dark:hover:bg-gray-800"
                    onclick={closeDeleteModal}
                >
                    Cancel
                </Button>

                <Button
                    class="w-full rounded-full bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700 sm:w-auto"
                    onclick={confirmDelete}
                >
                    Delete
                </Button>
            </div>
        </div>
    </div>
{/if}