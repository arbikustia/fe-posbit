<script lang="ts">
	import { PurchaseReportForm } from "../_components/form/index.js";
	import { usePurchaseReportPage } from "./use-create.svelte.js";

const { form ,handleSubmit} = usePurchaseReportPage();
</script>
<PurchaseReportForm {form} {handleSubmit} />