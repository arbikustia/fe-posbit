<script lang="ts">
	import AuditPlanForm from "../_components/form/audit-plan-form.svelte";
	import { useAuditPlanPage } from "./use-create.svelte";

const { form ,handleSubmit} = useAuditPlanPage();
</script>
<AuditPlanForm {form} {handleSubmit} />