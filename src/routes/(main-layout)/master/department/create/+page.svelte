<script lang="ts">
	import { DepartmentForm } from "../_components/form";
	import { useDepartmentPage } from "./use-create.svelte.js";

const { form ,handleSubmit} = useDepartmentPage();
</script>
<DepartmentForm {form} {handleSubmit} />