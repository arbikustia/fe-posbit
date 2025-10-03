<script lang="ts">
	import { ParticipantForm } from "../_components/form/index.js";
	import { useParticipantPage } from "./use-create.svelte.js";

const { form ,handleSubmit} = useParticipantPage();
</script>
<ParticipantForm {form} {handleSubmit} />