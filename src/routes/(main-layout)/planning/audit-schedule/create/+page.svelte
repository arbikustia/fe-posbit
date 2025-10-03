<script lang="ts">
	import { AuditScheduleForm } from "../_components/form";
	import { useAuditSchedulePage } from "./use-create.svelte";

const { form ,handleSubmit} = useAuditSchedulePage();
</script>
<AuditScheduleForm {form} {handleSubmit} />