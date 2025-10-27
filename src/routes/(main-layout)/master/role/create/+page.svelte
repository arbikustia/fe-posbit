<script lang="ts">
	import { RoleForm } from "../_components/form/index.js";
	import { useRolePage } from "./use-create.svelte.js";

const { form ,handleSubmit} = useRolePage();
</script>
<RoleForm {form} {handleSubmit} />