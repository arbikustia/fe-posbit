<script lang="ts">
	import { modalService } from '@/services/modalService';
	import { FormModalAwal } from '../dashboard/_components/form-modal-awal';
	import { PurchasePage } from './_components/page';
	import { onMount } from 'svelte';
	import { getUserRole } from '@/rbacUtils';


</script>

<div class="p-2 space-y-5">
	<PurchasePage />

</div>
