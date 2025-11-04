<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import { onMount } from 'svelte';

	const { row } = $props();

	let jsPDF: any = null;
	let isGenerating = false;

	// Preload jsPDF
	onMount(async () => {
		try {
			const jsPDFModule = await import('jspdf');
			jsPDF = jsPDFModule.jsPDF || jsPDFModule.default;
			console.log('jsPDF loaded successfully');
		} catch (error) {
			console.error('Failed to load jsPDF:', error);
		}
	});

	async function generateInvoice() {
		if (isGenerating) return;
		
		try {
			isGenerating = true;

			// Ensure jsPDF is loaded
			if (!jsPDF) {
				const jsPDFModule = await import('jspdf');
				jsPDF = jsPDFModule.jsPDF || jsPDFModule.default;
			}

			// Create PDF instance dengan cara yang lebih aman
			const doc = new jsPDF({
				orientation: 'portrait',
				unit: 'pt',
				format: 'a4',
				compress: true
			});

			const margin = 40;
			const pageWidth = 595.28; // A4 width in points
			let y = margin;

			// === HEADER ===
			doc.setFontSize(36);
			doc.setFont('helvetica', 'bold');
			doc.setTextColor(0, 0, 0);
			doc.text('INVOICE', margin, y);
			
			// Right side header
			doc.setFontSize(14);
			doc.setFont('helvetica', 'bold');
			doc.text('DA.ALUS', pageWidth - margin, y, { align: 'right' });
			doc.setFontSize(10);
			doc.setFont('helvetica', 'normal');
			doc.text('RUKO MGT BLOK 6733', pageWidth - margin, y + 15, { align: 'right' });
			
			// Header line
			doc.setDrawColor(0, 0, 0);
			doc.setLineWidth(1);
			doc.line(margin, y + 30, pageWidth - margin, y + 30);
			
			y += 60;

			// === Invoice & Customer Info ===
			doc.setFontSize(11);
			doc.setFont('helvetica', 'bold');
			doc.text('TO', margin, y);
			doc.setFont('helvetica', 'normal');
			doc.text(row.customer_name || 'FIONA', margin, y + 15);
			doc.text(row.customer_address || 'MGT BLOK A14', margin, y + 30);
			doc.text(row.telephone || '', margin, y + 45);
			
			// Right side info
			doc.setFont('helvetica', 'bold');
			doc.text('TANGGAL :', pageWidth - margin, y, { align: 'right' });
			doc.setFont('helvetica', 'normal');
			
			// Format tanggal
			const formatDate = (dateString: string) => {
				if (!dateString) return 'Senin, 23 Oktober 2025';
				try {
					const date = new Date(dateString);
					return date.toLocaleDateString('id-ID', {
						weekday: 'long',
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					});
				} catch {
					return 'Senin, 23 Oktober 2025';
				}
			};
			
			doc.text(formatDate(row.created_at), pageWidth - margin, y + 15, { align: 'right' });
			
			doc.setFont('helvetica', 'bold');
			doc.text('NO INVOICE :', pageWidth - margin, y + 45, { align: 'right' });
			doc.setFont('helvetica', 'normal');
			doc.text(row.inv_number || '001', pageWidth - margin, y + 60, { align: 'right' });
			
			y += 90;

			// === TABLE HEADER ===
			doc.setFillColor(240, 240, 240);
			doc.rect(margin, y - 10, pageWidth - (margin * 2), 20, 'F');
			doc.setTextColor(0, 0, 0);
			doc.setFont('helvetica', 'bold');
			doc.setFontSize(10);
			doc.text('KETERANGAN', margin + 5, y + 5);
			doc.text('HARGA', 260, y + 5);
			doc.text('JML', 380, y + 5);
			doc.text('TOTAL', 450, y + 5);
			
			y += 20;

			// === TABLE ITEMS ===
			doc.setFont('helvetica', 'normal');
			const items = row.purchase_order_details || [];
			let subtotal = 0;

			items.forEach((item: any) => {
				const price = Number(item.price) || 0;
				const qty = Number(item.qty) || 0;
				const total = price * qty;
				subtotal += total;

				// Handle long item names
				const itemName = item.name || item.description || '';
				const maxNameLength = 40;
				const truncatedName = itemName.length > maxNameLength 
					? itemName.substring(0, maxNameLength - 3) + '...' 
					: itemName;

				doc.text(truncatedName, margin + 5, y);
				doc.text(`RP ${price.toLocaleString('id-ID')}`, 260, y);
				doc.text(`${qty}`, 380, y);
				doc.text(`RP ${total.toLocaleString('id-ID')}`, 450, y);

				doc.setDrawColor(200);
				doc.setLineWidth(0.3);
				doc.line(margin, y + 5, pageWidth - margin, y + 5);
				y += 20;

				// Check if we need a new page
				if (y > 700) {
					doc.addPage();
					y = margin;
				}
			});

			y += 15;

			// === PAYMENT INFO ===
			doc.setFont('helvetica', 'normal');
			doc.text('PEMBAYARAN :', margin, y);
			doc.text(`Nama : ${row.payment_name || 'Bintaya Zahristi Khayah'}`, margin, y + 15);
			doc.text(`No Rek : ${row.account_number || '0030903617'}`, margin, y + 30);

			// === TOTALS (right side) ===
			const sisa = 0;
			const grandTotal = subtotal;

			doc.setFont('helvetica', 'normal');
			doc.text('SUB TOTAL :', 420, y);
			doc.text(`RP ${subtotal.toLocaleString('id-ID')}`, pageWidth - margin, y, { align: 'right' });
			
			y += 15;
			doc.text('SISA :', 420, y);
			doc.text(`RP ${sisa.toLocaleString('id-ID')}`, pageWidth - margin, y, { align: 'right' });
			
			y += 15;
			doc.setFont('helvetica', 'bold');
			doc.text('TOTAL :', 420, y);
			doc.text(`RP ${grandTotal.toLocaleString('id-ID')}`, pageWidth - margin, y, { align: 'right' });
			y += 40;

			// === FOOTER SIGNATURE ===
			const footerY = 650;
			
			doc.setFont('helvetica', 'bold');
			doc.setFontSize(10);
			doc.text('TERIMAKASIH ATAS', margin, footerY);
			doc.text('PEMBELIAN ANDA', margin, footerY + 15);
			
			// Signature area on the right
			doc.setFont('helvetica', 'italic');
			doc.setFontSize(20);
			doc.text('', pageWidth - margin, footerY + 30, { align: 'right' });
			
			doc.setFont('helvetica', 'normal');
			doc.setFontSize(10);
			doc.text('Juliana Silva', pageWidth - margin, footerY + 50, { align: 'right' });

			// Open PDF
			const pdfBlob = doc.output('blob');
			const blobUrl = URL.createObjectURL(pdfBlob);
			
			// Create download link
			const link = document.createElement('a');
			link.href = blobUrl;
			link.download = `invoice-${row.inv_number || '001'}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			
			// Clean up
			setTimeout(() => URL.revokeObjectURL(blobUrl), 100);

		} catch (error) {
			console.error('Error generating invoice:', error);
			alert('Gagal membuat invoice. Silakan coba lagi.');
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