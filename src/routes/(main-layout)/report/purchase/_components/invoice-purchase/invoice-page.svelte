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

			// === TABLE ===
			const tableX = margin;
			const tableRight = pageWidth - margin;
			const columnX = {
				item: tableX,
				price: tableX + 190,
				discount: tableX + 285,
				qty: tableX + 380,
				total: tableX + 425
			};
			const columnWidth = {
				item: 180,
				price: 90,
				discount: 90,
				qty: 45,
				total: tableRight - columnX.total
			};
			const tableTop = y - 10;
			const headerHeight = 24;

			const drawTableHeader = (top: number) => {
				doc.setFillColor(245, 245, 245);
				doc.setDrawColor(180, 180, 180);
				doc.setLineWidth(1);
				doc.rect(tableX, top, tableRight - tableX, headerHeight, 'FD');
				doc.setTextColor(0, 0, 0);
				doc.setFont('helvetica', 'bold');
				doc.setFontSize(8);
				doc.text('ITEM', tableX + 6, top + 15);
				doc.text('HARGA', columnX.price + columnWidth.price - 6, top + 15, { align: 'right' });
				doc.text('DISKON', columnX.discount + columnWidth.discount - 6, top + 15, {
					align: 'right'
				});
				doc.text('JML', columnX.qty + columnWidth.qty / 2, top + 15, { align: 'center' });
				doc.text('TOTAL', tableRight - 6, top + 15, { align: 'right' });
			};
			drawTableHeader(tableTop);

			const drawColumnLines = (top: number, bottom: number) => {
				doc.setDrawColor(220, 220, 220);
				[columnX.price, columnX.discount, columnX.qty, columnX.total].forEach((x) =>
					doc.line(x, top, x, bottom)
				);
			};
			const drawTableOuterLines = (top: number, bottom: number, drawTop = false) => {
				doc.setDrawColor(150, 150, 150);
				doc.setLineWidth(1);
				if (drawTop) doc.line(tableX, top, tableRight, top);
				doc.line(tableX, top, tableX, bottom);
				doc.line(tableRight, top, tableRight, bottom);
			};
			drawColumnLines(tableTop, tableTop + headerHeight);
			let tableSegmentTop = tableTop;
			y = tableTop + headerHeight;

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
					const itemDiscount = Number(item.discount) || 0;
					const total = Math.max(price * qty - itemDiscount, 0);
					subtotal += total;

					const itemName = `${item.name || ''} ${item.description || ''}`.trim();
					const itemLines = doc.splitTextToSize(itemName, columnWidth.item - 12);
					const rowHeight = Math.max(24, itemLines.length * 10 + 12);

					if (y + rowHeight > 700) {
						drawTableOuterLines(tableSegmentTop, y);
						doc.addPage();
						drawTableHeader(margin);
						tableSegmentTop = margin;
						y = margin + headerHeight;
						drawColumnLines(margin, y);
						drawTableOuterLines(tableSegmentTop, tableSegmentTop, true);
					}

					const textY = y + 15;
					const right = (value: string, x: number) => doc.text(value, x, textY, { align: 'right' });

					doc.setFont('helvetica', 'normal');
					doc.setFontSize(8);
					doc.text(itemLines, tableX + 6, textY);
					right(`RP ${price.toLocaleString('id-ID')}`, columnX.price + columnWidth.price - 6);
					right(
						`RP ${itemDiscount.toLocaleString('id-ID')}`,
						columnX.discount + columnWidth.discount - 6
					);
					doc.text(`${qty}`, columnX.qty + columnWidth.qty / 2, textY, { align: 'center' });
					right(`RP ${total.toLocaleString('id-ID')}`, tableRight - 6);

					doc.setDrawColor(210, 210, 210);
					doc.line(tableX, y + rowHeight, tableRight, y + rowHeight);
					drawColumnLines(y, y + rowHeight);
					y += rowHeight;
				});

			drawTableOuterLines(tableSegmentTop, y);

			// Keep payment info, left notice, and totals on same page.
			const labelArray = row.label || [];
			const paymentSectionHeight = 220 + labelArray.length * 15;
			if (y + paymentSectionHeight > 780) {
				doc.addPage();
				y = margin;
			}
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
			const totalLabel = labelArray.reduce((sum: number, label: any) => {
				return sum + (Number(label.price * label.qty) || 0);
			}, 0);

			const totalItemDiscount = items.reduce(
				(sum: number, item: any) => sum + (Number(item.discount) || 0),
				0
			);
			const totalOngkir = Number(row.ongkir) || 0;
			const downPayment = Number(row.down_payment) || 0;
			const biayaLabel = Number(row.biaya_label) || 0;
			const discount = Number(row.discount_amount) || 0;
			const totalBayar = Math.max(subtotal + totalLabel + biayaLabel + totalOngkir - discount, 0);
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
			doc.text(`RP ${subtotal.toLocaleString('id-ID')}`, pageWidth - margin, y, {
				align: 'right'
			});
			y += 15;

			doc.setFont('helvetica', 'normal');
			doc.text('TOTAL DISKON ITEM :', 320, y);
			doc.text(`RP ${totalItemDiscount.toLocaleString('id-ID')}`, pageWidth - margin, y, {
				align: 'right'
			});
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
			doc.setFont('helvetica', 'normal');
			doc.setFontSize(8);
			doc.text('DISKON :', 320, y);
			doc.text(`RP ${row.discount_amount?.toLocaleString('id-ID') || 0}`, pageWidth - margin, y, {
				align: 'right'
			});
			y += 15;

			// TOTAL BAYAR
			doc.setFont('helvetica', 'normal');
			doc.setFontSize(8);
			doc.text('TOTAL BAYAR :', 320, y);
			doc.text(`RP ${totalBayar.toLocaleString('id-ID')}`, pageWidth - margin, y, {
				align: 'right'
			});
			y += 15;

			if (downPayment > 0) {
				// DP
				doc.setFont('helvetica', 'normal');
				doc.setFontSize(8);
				doc.text('DP :', 320, y);
				doc.text(`RP ${downPayment.toLocaleString('id-ID')}`, pageWidth - margin, y, {
					align: 'right'
				});
				y += 15;

				// SISA
				doc.setFont('helvetica', 'bold');
				doc.setFontSize(8);
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
