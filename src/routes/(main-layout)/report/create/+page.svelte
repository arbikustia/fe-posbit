<script lang="ts">
	import { ReportForm } from "../_components/form/index.js";
	import { useReportPage } from "./use-create.svelte.js";

const { form ,handleSubmit} = useReportPage();
</script>
<ReportForm {form} {handleSubmit} />