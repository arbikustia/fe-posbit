<script lang="ts">
	import { PurchaseReportForm } from "../_components/form/index.js";
	import { usePurchasePage } from "./use-create.svelte.js";

const { form ,handleSubmit} = usePurchasePage();
</script>
<PurchaseReportForm {form} {handleSubmit} />