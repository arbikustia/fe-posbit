<script lang="ts">
	import { CustomerForm } from "../_components/form/index.js";
	import { useCustomerPage } from "./use-create.svelte.js";

const { form ,handleSubmit} = useCustomerPage();
</script>
<CustomerForm {form} {handleSubmit} />