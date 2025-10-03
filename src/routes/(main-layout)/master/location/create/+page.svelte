<script lang="ts">
	import { LocationForm } from "../_components/form/index.js";
	import { useLocationPage } from "./use-create.svelte.js";

const { form ,handleSubmit} = useLocationPage();
</script>
<LocationForm {form} {handleSubmit} />