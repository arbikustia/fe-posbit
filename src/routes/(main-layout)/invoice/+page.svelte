<div class="mx-auto w-full max-w-2xl py-10">
	<!-- Invoice Card -->
	<div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
		<!-- Header -->
		<div class="bg-gradient-to-r from-amber-500 to-yellow-500 p-6 text-white">
			<div class="flex items-start justify-between">
				<div>
					<h1 class="text-2xl font-bold md:text-3xl">INVOICE</h1>
					<p class="mt-1 text-amber-100">Transaksi Emas & Perhiasan</p>
				</div>
				<div class="text-right">
					<p class="text-amber-100">No. INV/2024/08/001</p>
					<p class="mt-1 text-sm" id="currentDate">14 Agustus 2024</p>
				</div>
			</div>
		</div>

		<!-- Company & Client Info -->
		<div class="grid grid-cols-1 gap-6 border-b border-gray-200 p-6 md:grid-cols-2">
			<div>
				<h3 class="mb-2 flex items-center font-semibold text-gray-800">
					<i class="fas fa-store mr-2 text-amber-500"></i> Toko Emas Murni
				</h3>
				<p class="text-sm text-gray-600">Jl. Kemakmuran No. 123</p>
				<p class="text-sm text-gray-600">Jakarta Pusat, 10110</p>
				<p class="text-sm text-gray-600">Telp: (021) 555-0123</p>
			</div>
			<div>
				<h3 class="mb-2 flex items-center font-semibold text-gray-800">
					<i class="fas fa-user mr-2 text-amber-500"></i> Kepada:
				</h3>
				<p class="text-sm text-gray-600">Pelanggan</p>
				<p class="text-sm text-gray-600">Transaksi Retail</p>
			</div>
		</div>

		<!-- Products Section -->
		<div class="p-6">
			<h2 class="mb-4 flex items-center text-xl font-semibold text-gray-800">
				<i class="fas fa-gem mr-2 text-amber-500"></i> Detail Produk
			</h2>

			<!-- Product List -->
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="bg-gray-50">
							<th class="px-4 py-3 text-left font-medium text-gray-700">Produk</th>
							<th class="px-4 py-3 text-center font-medium text-gray-700">Berat</th>
							<th class="px-4 py-3 text-right font-medium text-gray-700">Harga</th>
							<th class="px-4 py-3 text-right font-medium text-gray-700">Subtotal</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200">
						<tr>
							<td class="px-4 py-4">
								<div>
									<h3 class="font-medium text-gray-900">Cincin Emas 22K</h3>
									<p class="text-sm text-gray-600">Model: Classic Ring</p>
								</div>
							</td>
							<td class="px-4 py-4 text-center text-gray-700">2gr</td>
							<td class="px-4 py-4 text-right text-gray-700">Rp 950.000</td>
							<td class="px-4 py-4 text-right font-semibold text-gray-900">Rp 1.900.000</td>
						</tr>
						<tr>
							<td class="px-4 py-4">
								<div>
									<h3 class="font-medium text-gray-900">Anting Emas 23K</h3>
									<p class="text-sm text-gray-600">Model: Drop Earrings</p>
								</div>
							</td>
							<td class="px-4 py-4 text-center text-gray-700">1.5gr</td>
							<td class="px-4 py-4 text-right text-gray-700">Rp 980.000</td>
							<td class="px-4 py-4 text-right font-semibold text-gray-900">Rp 1.470.000</td>
						</tr>
						<tr>
							<td class="px-4 py-4">
								<div>
									<h3 class="font-medium text-gray-900">Anting Emas 23K</h3>
									<p class="text-sm text-gray-600">Model: Drop Earrings</p>
								</div>
							</td>
							<td class="px-4 py-4 text-center text-gray-700">1.5gr</td>
							<td class="px-4 py-4 text-right text-gray-700">Rp 980.000</td>
							<td class="px-4 py-4 text-right font-semibold text-gray-900">Rp 1.470.000</td>
						</tr>
						<tr>
							<td class="px-4 py-4">
								<div>
									<h3 class="font-medium text-gray-900">Anting Emas 23K</h3>
									<p class="text-sm text-gray-600">Model: Drop Earrings</p>
								</div>
							</td>
							<td class="px-4 py-4 text-center text-gray-700">1.5gr</td>
							<td class="px-4 py-4 text-right text-gray-700">Rp 980.000</td>
							<td class="px-4 py-4 text-right font-semibold text-gray-900">Rp 1.470.000</td>
						</tr>
					</tbody>
				</table>
			</div>

			<!-- Total Transaksi -->
			<div class="mt-8 border-t border-gray-200 pt-6">
				<div class="flex items-center justify-between">
					<h3 class="text-lg font-semibold text-gray-800">Total Transaksi</h3>
					<p class="text-2xl font-bold text-amber-600">Rp 6.310.000</p>
				</div>
			</div>
		</div>

		<!-- Payment Section -->
		<div class="border-t border-gray-200 bg-gray-50 p-6">
			<h2 class="mb-4 flex items-center text-xl font-semibold text-gray-800">
				<i class="fas fa-credit-card mr-2 text-amber-500"></i> Informasi Pembayaran
			</h2>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div class="space-y-4">
					<div class="flex justify-between">
						<span class="text-gray-600">Metode Pembayaran</span>
						<span
							class="flex items-center rounded-full bg-amber-100 px-3 py-1 font-medium text-gray-900"
						>
							<i class="fas fa-money-bill-wave mr-2 text-amber-600"></i> Cash
						</span>
					</div>

					<div class="flex justify-between">
						<span class="text-gray-600">Status Pembayaran</span>
						<span
							class="flex items-center rounded-full bg-green-100 px-3 py-1 font-medium text-green-700"
						>
							<i class="fas fa-check-circle mr-2"></i> Lunas
						</span>
					</div>
				</div>

				<div class="rounded-lg border border-gray-200 bg-white p-4">
					<div class="mb-2 flex items-center justify-between">
						<span class="text-lg font-bold text-gray-800">TOTAL</span>
						<span class="text-xl font-bold text-amber-600">Rp 6.310.000</span>
					</div>
					<p class="mt-2 text-center text-sm text-gray-600">Terima kasih atas pembayaran Anda</p>
				</div>
			</div>
		</div>

		<!-- Footer -->
		<div class="bg-gray-800 p-6 text-center text-gray-300">
			<div class="flex flex-col items-center justify-between md:flex-row">
				<p class="mb-2 md:mb-0">Toko Emas Murni • Terpercaya sejak 1995</p>
				<div class="flex space-x-4">
					<a href="#" class="text-gray-300 transition hover:text-white"
						><i class="fab fa-whatsapp"></i></a
					>
					<a href="#" class="text-gray-300 transition hover:text-white"
						><i class="fab fa-instagram"></i></a
					>
					<a href="#" class="text-gray-300 transition hover:text-white"
						><i class="fas fa-globe"></i></a
					>
				</div>
			</div>
			<p class="mt-4 text-sm">Invoice ini sah dan diterbitkan secara elektronik</p>
		</div>
	</div>

	<!-- Action Buttons -->
	<div class="mt-6 flex flex-col justify-center space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
		<button
			class="flex items-center justify-center rounded-lg bg-amber-500 px-6 py-2 font-medium text-white transition hover:bg-amber-600"
		>
			<i class="fas fa-print mr-2"></i> Cetak Invoice
		</button>
		<button
			class="flex items-center justify-center rounded-lg border border-amber-500 bg-white px-6 py-2 font-medium text-amber-600 transition hover:bg-gray-100"
		>
			<i class="fas fa-download mr-2"></i> Unduh PDF
		</button>
		<button
			class="flex items-center justify-center rounded-lg bg-gray-800 px-6 py-2 font-medium text-white transition hover:bg-gray-900"
		>
			<i class="fas fa-share-alt mr-2"></i> Bagikan
		</button>
	</div>
</div>
