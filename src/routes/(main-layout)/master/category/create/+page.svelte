<script lang="ts">
	import { CategoryForm } from "../_components/form/index.js";
	import { useLocationPage } from "./use-create.svelte.js";

const { form ,handleSubmit} = useLocationPage();
</script>
<CategoryForm {form} {handleSubmit} />