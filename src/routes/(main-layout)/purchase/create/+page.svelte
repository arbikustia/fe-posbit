<script lang="ts">
	import { PurchaseForm } from "../_components/form/index.js";
	import { usePurchasePage } from "./use-create.svelte.js";

const { form ,handleSubmit} = usePurchasePage();
</script>
<PurchaseForm  />