<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import { Row } from '@/components/ui/table';
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
			doc.text('INVOICE', margin, y + 35);

			// Right side header
			doc.setFontSize(14);
			doc.setFont('helvetica', 'bold');
			doc.text('DA.ALUS', pageWidth - margin, y, { align: 'right' });
			doc.setFontSize(10);
			doc.setFont('helvetica', 'normal');
			doc.text('Ruko B-15 no 17', pageWidth - margin, y + 15, { align: 'right' });
			doc.text('Mutiara Gading Timur, Mustikajaya, Bekasi', pageWidth - margin, y + 25, {
				align: 'right'
			});
			doc.text('085817346722 / 0895372220952', pageWidth - margin, y + 40, { align: 'right' });

			// Header line
			doc.setDrawColor(0, 0, 0);
			doc.setLineWidth(1);
			doc.line(margin, y + 45, pageWidth - margin, y + 45);

			y += 60;

			// === Invoice & Customer Info ===
			doc.setFontSize(11);
			doc.setFont('helvetica', 'bold');
			doc.text('TO', margin, y);
			doc.setFont('helvetica', 'normal');
			doc.text(row.customer_name || 'FIONA', margin, y + 15);
			doc.text(row.telephone || '', margin, y + 30);

			// Right side info
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

			doc.text(formatDate(row.created_at), pageWidth - margin, y, { align: 'right' });

			doc.setFont('helvetica', 'bold');
			doc.text('NO INVOICE ', pageWidth - margin, y + 35, { align: 'right' });
			doc.setFont('helvetica', 'normal');
			doc.text(row.inv_number || '001', pageWidth - margin, y + 50, { align: 'right' });

			y += 90;

			// === TABLE HEADER ===
			doc.setDrawColor(192, 192, 192);
			doc.rect(margin, y - 10, pageWidth - margin * 2, 20);
			doc.setTextColor(0, 0, 0);
			doc.setFont('helvetica', 'bold');
			doc.setFontSize(10);
			doc.text('ITEM', margin + 5, y + 5);
			doc.text('HARGA', 260, y + 5);
			doc.text('JML', 380, y + 5);
			doc.text('TOTAL', 450, y + 5);

			y += 20;

			// === TABLE ITEMS ===
			doc.setFont('helvetica', 'normal');
			const items = row.purchase_order_details || [];
			let subtotal = 0;

			items
				.sort((a: any, b: any) => {
					const nameA = (a.name + ' ' + (a.description || '')).toLowerCase();
					const nameB = (b.name + ' ' + (b.description || '')).toLowerCase();
					return nameA.localeCompare(nameB);
				})
				.forEach((item: any) => {
					const price = Number(item.price) || 0;
					const qty = Number(item.qty) || 0;
					const total = price * qty;
					subtotal += total;

					// Handle long item names
					const itemName = item.name + ' ' + (item.description || '');
					const maxNameLength = 40;
					const truncatedName =
						itemName.length > maxNameLength
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
			doc.setFont('helvetica', 'bold');
			doc.text(`PEMBAYARAN : ${row.payment_method}`, margin, y);
			doc.setFont('helvetica', 'normal');
			doc.text(`Nama : Bintaya Zahriati Khayah`, margin, y + 25);
			doc.text(`No Rek : 0030903617 - BCA `, margin, y + 40);
			doc.text(`MOHON CHECK KEMBALI QUANTITY DAN  `, margin, y + 85);
			doc.text(`NOMINAL ORDERAN NYA `, margin, y + 100);
			doc.text(`UANG YANG SUDAH DI TRANSFER TIDAK DAPAT  `, margin, y + 115);
			doc.text(`DI REFUND. `, margin, y + 130);
			doc.text(`TERIMAKASIH ATAS `, margin, y + 165);
			doc.text(`PEMBELIAN ANDA `, margin, y + 180);

			// === CALCULATE TOTALS ===
			const labelArray = row.label || [];
			const totalLabel = labelArray.reduce((sum: number, label: any) => {
				return sum + (Number(label.price * label.qty) || 0);
			}, 0);

			const totalOngkir = Number(row.ongkir) || 0;
			let totalBayar = 0;
			if (row.biaya_label !== null) {
				if (row.package_name.toLowerCase() == 'shopee') {
					totalBayar = row.total_amount + totalLabel + totalOngkir + row.biaya_label;
				} else {
					totalBayar = subtotal + totalLabel + totalOngkir + row.biaya_label;
				}
			} else {
				if (row.package_name.toLowerCase() == 'shopee') {
					totalBayar = row.total_amount + totalLabel + totalOngkir ;
				} else {
					totalBayar = subtotal + totalLabel + totalOngkir ;
				}
			}
			const downPayment = Number(row.down_payment) || 0;
			const discount = Number(row.discount_amount) || 0;
			totalBayar = totalBayar - discount;
			const sisaBayar = totalBayar - downPayment;

			// === TOTALS (right side) ===
			doc.setFont('helvetica', 'normal');
			doc.text('TOTAL QTY :', 320, y);
			doc.text(
				`${row.purchase_order_details.reduce((total: number, item: any) => total + (item.qty || 0), 0)}`,
				pageWidth - margin,
				y,
				{ align: 'right' }
			);
			y += 15;

			doc.setFont('helvetica', 'normal');
			doc.text('SUB TOTAL :', 320, y);
			doc.text(
				`RP ${row.package_name.toLowerCase() == 'shopee' ? row.total_amount.toLocaleString('id-ID') : subtotal.toLocaleString('id-ID')}`,
				pageWidth - margin,
				y,
				{ align: 'right' }
			);
			y += 15;

			// === LABEL SECTION ===
			if (labelArray.length > 0) {
				doc.setFont('helvetica', 'normal');
				labelArray.forEach((label: any) => {
					const labelName = label.name || 'Unknown Label';
					const labelPrice = Number(label.price * label.qty) || 0;

					doc.text(`${labelName} ${label.qty} :`, 320, y);
					doc.text(`RP ${labelPrice.toLocaleString('id-ID')}`, pageWidth - margin, y, {
						align: 'right'
					});
					y += 15;

					// Check if we need a new page
					if (y > 700) {
						doc.addPage();
						y = margin;
					}
				});
			} else {
				// Jika tidak ada label, tampilkan 0
				doc.setFont('helvetica', 'normal');
				doc.text('LABEL :', 320, y);
				doc.text(`RP 0`, pageWidth - margin, y, { align: 'right' });
				y += 15;
			}

			if (row.biaya_label !== null || row.biaya_label !== 0) {
				// biaya_label
				doc.setFont('helvetica', 'normal');
				doc.text('BIAYA PASANG LABEL :', 320, y);
				doc.text(`RP ${row.biaya_label.toLocaleString('id-ID')}`, pageWidth - margin, y, {
					align: 'right'
				});
				y += 15;
			}
			// ONGKIR
			doc.setFont('helvetica', 'normal');
			doc.text('ONGKIR :', 320, y);
			doc.text(`RP ${totalOngkir.toLocaleString('id-ID')}`, pageWidth - margin, y, {
				align: 'right'
			});
			y += 15;

			// DISKON	
			doc.setFont('helvetica', 'bold');
			doc.setFontSize(11);
			doc.text('DISKON :', 320, y);
			doc.text(`RP ${row.discount_amount?.toLocaleString('id-ID') || 0}`, pageWidth - margin, y, {
				align: 'right'
			});
			y += 15;

			// TOTAL BAYAR
			doc.setFont('helvetica', 'bold');
			doc.setFontSize(11);
			doc.text('TOTAL BAYAR :', 320, y);
			doc.text(`RP ${totalBayar.toLocaleString('id-ID')}`, pageWidth - margin, y, {
				align: 'right'
			});
			y += 15;

			if (downPayment > 0) {
				// DP
				doc.setFont('helvetica', 'normal');
				doc.setFontSize(10);
				doc.text('DP :', 320, y);
				doc.text(`RP ${downPayment.toLocaleString('id-ID')}`, pageWidth - margin, y, {
					align: 'right'
				});
				y += 15;

				// SISA
				doc.setFont('helvetica', 'bold');
				doc.text('SISA :', 320, y);
				doc.text(`RP ${sisaBayar.toLocaleString('id-ID')}`, pageWidth - margin, y, {
					align: 'right'
				});
				y += 40;
			}

			// === FOOTER SIGNATURE ===
			const footerY = 650;


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
	class="text-primary cursor-pointer underline disabled:cursor-not-allowed disabled:opacity-50"
	disabled={isGenerating}
>
	{isGenerating ? 'Loading...' : row.inv_number}
</button>
