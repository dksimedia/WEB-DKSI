# Rules Agar Tidak Mengulangi

1. Jangan ubah desain trusted carousel / logo size — sudah sesuai request "pertahankan desain sebelumnya dan jangan berubah", "tidak perlu ada border kotak, ukuran sudah sesuai"
2. Semua gambar wajib ke-load cepat & mulus — cek logika di IMAGE_RULES.md
3. Code bersih, efisien, profesional — tim mudah paham
4. Logo klien pakai aset asli D:\CUSTOMER LOGO -> frontend/assets/clients, jangan placeholder text
5. Animasi logo pakai pixel2motion prinsip low energy slow in/out (Trustworthy/Professional)
6. Commit tertib: feat(layout), fix(nav), feat(admin), feat(trusted), feat(logo), perf(images), fix(lcp), fix(images) — push ke origin main
7. Jangan duplikat cms-data.js — single source truth di frontend/cms/
8. Backend jangan lupa compression dep di package.json + STATIC_OPTS
9. Selalu verifikasi: node -c server.js, curl 200 index.html + asset, git status ahead check

