<script lang="ts">
	import { InvoiceForm } from "../_components/form/index.js";
	import { useInvoicePage } from "./use-create.svelte.js";

const { form ,handleSubmit} = useInvoicePage();
</script>
<InvoiceForm {form} {handleSubmit} />