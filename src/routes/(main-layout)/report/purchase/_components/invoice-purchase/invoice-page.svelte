<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import { onMount } from 'svelte';

	const { row } = $props();

	let jsPDF: any = null;
	let isGenerating = false;

	// Preload jsPDF saat komponen mount
	onMount(async () => {
		try {
			const jsPDFModule = await import('jspdf');
			jsPDF = jsPDFModule.jsPDF || jsPDFModule.default;
			console.log('✅ jsPDF loaded successfully:', jsPDF);
		} catch (error) {
			console.error('❌ Failed to load jsPDF:', error);
		}
	});

	async function generateInvoice() {
		if (isGenerating) return;
		isGenerating = true;

		try {
			// Pastikan jsPDF sudah siap
			if (!jsPDF) {
				console.warn('⚠️ jsPDF not loaded yet, re-importing...');
				const jsPDFModule = await import('jspdf');
				jsPDF = jsPDFModule.jsPDF || jsPDFModule.default;
			}

			if (typeof jsPDF !== 'function') {
				throw new Error('jsPDF constructor not found');
			}

			// Coba buat instance jsPDF
			let doc;
			try {
				doc = new jsPDF({
					orientation: 'portrait',
					unit: 'pt',
					format: 'a4',
					compress: true,
				});
			} catch (err) {
				console.error('⚠️ jsPDF instantiation error:', err);
				throw new Error('Gagal membuat instance jsPDF');
			}

			const margin = 40;
			const pageWidth = 595.28;
			let y = margin;

			// ========== HEADER ==========
			doc.setFontSize(36);
			doc.setFont('helvetica', 'bold');
			doc.text('INVOICE', margin, y);
			doc.setFontSize(14);
			doc.text('DA.ALUS', pageWidth - margin, y, { align: 'right' });

			y += 40;

			// ========== CUSTOMER INFO ==========
			doc.setFontSize(11);
			doc.setFont('helvetica', 'bold');
			doc.text('TO', margin, y);
			doc.setFont('helvetica', 'normal');
			doc.text(row?.customer_name || 'FIONA', margin, y + 15);
			doc.text(row?.customer_address || 'MGT BLOK A14', margin, y + 30);
			doc.text(row?.telephone || '', margin, y + 45);

			y += 70;

			// ========== TABLE HEADER ==========
			doc.setFontSize(10);
			doc.setFont('helvetica', 'bold');
			doc.setFillColor(240, 240, 240);
			doc.rect(margin, y - 10, pageWidth - (margin * 2), 20, 'F');
			doc.text('KETERANGAN', margin + 5, y + 5);
			doc.text('HARGA', 260, y + 5);
			doc.text('JML', 380, y + 5);
			doc.text('TOTAL', 450, y + 5);

			y += 25;

			// ========== ITEMS ==========
			const items = Array.isArray(row?.purchase_order_details)
				? row.purchase_order_details
				: [];
			let subtotal = 0;

			items.forEach((item) => {
				const price = Number(item.price) || 0;
				const qty = Number(item.qty) || 0;
				const total = price * qty;
				subtotal += total;

				const name = item.name || item.description || 'Item';
				const truncated = name.length > 40 ? name.slice(0, 37) + '...' : name;

				doc.setFont('helvetica', 'normal');
				doc.text(truncated, margin + 5, y);
				doc.text(`RP ${price.toLocaleString('id-ID')}`, 260, y);
				doc.text(`${qty}`, 380, y);
				doc.text(`RP ${total.toLocaleString('id-ID')}`, 450, y);

				y += 20;
				if (y > 720) {
					doc.addPage();
					y = margin;
				}
			});

			y += 20;

			// ========== TOTAL ==========
			doc.setFont('helvetica', 'bold');
			doc.text('TOTAL :', 420, y);
			doc.text(`RP ${subtotal.toLocaleString('id-ID')}`, pageWidth - margin, y, { align: 'right' });

			y += 50;

			// ========== FOOTER ==========
			doc.setFontSize(10);
			doc.text('TERIMA KASIH ATAS PEMBELIAN ANDA', margin, y);

			// Generate blob
			const pdfBlob = doc.output('blob');
			if (!(pdfBlob instanceof Blob)) {
				throw new Error('Invalid PDF blob generated');
			}

			const blobUrl = URL.createObjectURL(pdfBlob);
			const link = document.createElement('a');
			link.href = blobUrl;
			link.download = `invoice-${row?.inv_number || '001'}.pdf`;
			link.click();

			setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

			console.log('✅ Invoice generated successfully');
		} catch (error) {
			console.error('❌ Error generating invoice:', error);
			alert(`Gagal membuat invoice. ${error.message}`);
		} finally {
			isGenerating = false;
		}
	}
</script>

<button
	onclick={generateInvoice}
	class="cursor-pointer underline text-primary disabled:opacity-50 disabled:cursor-not-allowed"
	disabled={isGenerating}
>
	{isGenerating ? 'Loading...' : row.inv_number}
</button>
 