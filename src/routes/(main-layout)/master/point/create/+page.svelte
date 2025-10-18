<script lang="ts">
	import { PointForm } from "../_components/form/index.js";
	import { usePointPage } from "./use-create.svelte.js";

const { form ,handleSubmit} = usePointPage();
</script>
<PointForm {form} {handleSubmit} />