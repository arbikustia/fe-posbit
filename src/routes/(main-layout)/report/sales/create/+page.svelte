<script lang="ts">
	import { SalesForm } from "../_components/form/index.js";
	import { useSalesPage } from "./use-create.svelte.js";

const { form ,handleSubmit} = useSalesPage();
</script>
<SalesForm {form} {handleSubmit} />