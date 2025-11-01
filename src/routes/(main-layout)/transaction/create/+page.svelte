<script lang="ts">
	import { TransactionForm } from "../_components/form/index.js";
	import { useTransactionPage } from "./use-create.svelte.js";

const { form ,handleSubmit,} = useTransactionPage();
</script>
<TransactionForm {form} {handleSubmit} />