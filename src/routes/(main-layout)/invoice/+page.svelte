<script lang="ts">
  import { onMount } from "svelte";
  import dayjs from "dayjs";

  // Data transaksi bisa kamu ganti sesuai kebutuhan
  const notaData = $state({
    nomor: "INV/2024/08/001",
    tanggal: dayjs().format("DD/MM/YYYY HH:mm"),
    kasir: "Admin",
    toko: {
      nama: "TOKO EMAS MURNI",
      alamat: "Jl. Kemakmuran No. 123, Jakarta Pusat",
      telp: "(021) 555-0123",
    },
    items: [
      { nama: "Cincin Emas 22K", berat: "2gr", harga: 950000, subtotal: 1900000 },
      { nama: "Anting Emas 23K", berat: "1.5gr", harga: 980000, subtotal: 1470000 },
      { nama: "Anting Emas 23K", berat: "1.5gr", harga: 980000, subtotal: 1470000 },
      { nama: "Anting Emas 23K", berat: "1.5gr", harga: 980000, subtotal: 1470000 },
    ],
    metode: "Cash",
    status: "Lunas",
  });

  $derived notaData.total = notaData.items.reduce((a, b) => a + b.subtotal, 0);

  function cetakNota() {
    window.print();
  }
</script>

<style>
  * {
    font-family: "Courier New", monospace;
    font-size: 12px;
    margin: 0;
    padding: 0;
  }

  body, :global(body) {
    width: 58mm;
    margin: 0 auto;
    color: #000;
  }

  .center {
    text-align: center;
  }

  .bold {
    font-weight: bold;
  }

  hr {
    border: none;
    border-top: 1px dashed #000;
    margin: 4px 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 4px;
  }

  td {
    vertical-align: top;
  }

  .right {
    text-align: right;
  }

  .total {
    font-weight: bold;
    font-size: 13px;
  }

  .footer {
    text-align: center;
    margin-top: 10px;
    font-size: 11px;
  }

  @media print {
    button {
      display: none;
    }
    body {
      margin: 0;
    }
  }
</style>

<div>
  <div class="center bold">{notaData.toko.nama}</div>
  <div class="center">{notaData.toko.alamat}</div>
  <div class="center">Telp: {notaData.toko.telp}</div>
  <hr />
  <div>No: {notaData.nomor}</div>
  <div>Tanggal: {notaData.tanggal}</div>
  <div>Kasir: {notaData.kasir}</div>
  <hr />

  <table>
    {#each notaData.items as item}
      <tr>
        <td>{item.nama}</td>
        <td class="right">{item.berat}</td>
      </tr>
      <tr>
        <td>Rp {item.harga.toLocaleString()}</td>
        <td class="right">Rp {item.subtotal.toLocaleString()}</td>
      </tr>
    {/each}
  </table>

  <hr />
  <table>
    <tr>
      <td class="bold">TOTAL</td>
      <td class="right total">Rp {notaData.total.toLocaleString()}</td>
    </tr>
    <tr>
      <td>Metode</td>
      <td class="right">{notaData.metode}</td>
    </tr>
    <tr>
      <td>Status</td>
      <td class="right">{notaData.status}</td>
    </tr>
  </table>

  <hr />
  <div class="footer">
    Terima kasih atas pembelian Anda!<br />
    Barang yang sudah dibeli tidak dapat dikembalikan.<br /><br />
    <b>{notaData.toko.nama}</b><br />
    Sejak 1995
  </div>

  <button on:click={cetakNota} style="margin-top: 10px; width: 100%">🖨️ Cetak Nota</button>
</div>
