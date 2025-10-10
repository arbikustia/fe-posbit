<script lang="ts">
	import { ProductForm } from "../_components/form/index.js";
	import { useLocationPage } from "./use-create.svelte.js";

const { form ,handleSubmit} = useLocationPage();
</script>
<ProductForm {form} {handleSubmit} />