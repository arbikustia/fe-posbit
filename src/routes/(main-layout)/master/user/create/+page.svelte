<script lang="ts">
	import { UserForm } from "../_components/form/index.js";
	import { useUserPage } from "./use-create.svelte.js";

const { form ,handleSubmit} = useUserPage();
</script>
<UserForm {form} {handleSubmit} />