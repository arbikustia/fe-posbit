#!/bin/bash

echo "[startup.sh] Memulai script startup..."

cd /home/site/wwwroot

# Tangani jika 'node_modules' adalah FILE, bukan folder
if [ -f "node_modules" ]; then
  echo "[startup.sh] ⚠️ Ada FILE bernama 'node_modules', akan dihapus."
  rm -f node_modules
fi

# Cek apakah folder node_modules sudah ada
if [ -d "node_modules" ]; then
  echo "[startup.sh] ✅ Folder node_modules sudah ada, lewati extract."
else
  if [ -f "node_modules.tar.gz" ]; then
    echo "[startup.sh] 📦 Menemukan node_modules.tar.gz, extract sekarang..."
    mkdir -p node_modules
    tar -xzf node_modules.tar.gz -C node_modules
    echo "[startup.sh] 🧹 Hapus node_modules.tar.gz setelah extract."
    rm -f node_modules.tar.gz
  else
    echo "[startup.sh] ⚠️ node_modules.tar.gz tidak ditemukan, tidak ada yang diextract."
  fi
fi

# Jalankan aplikasi kamu di bawah ini
echo "[startup.sh] 🚀 Menjalankan aplikasi..."
node build/index.js  # ⬅️ Ganti jika entry point kamu berbeda

