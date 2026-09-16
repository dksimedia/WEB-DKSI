# Image Loading Rules — WAJIB IKUTI

Gagal ikut = gambar tidak ke-load / CLS / lambat.

## Aturan
1. LCP (above-fold): siteLogo + heroImage WAJIB `loading="eager" decoding="async" fetchpriority="high"` + explicit width/height + preload link di <head>
   - hero preload: <link rel="preload" as="image" href="...photo-145118...w=1100&q=80" fetchpriority="high">
   - hero w=1100 (bukan 1200), siteLogo 160x40
2. Below-fold: semua img WAJIB `loading="lazy" decoding="async"` + width/height + sizes
   - Solutions cards: width="600" height="450" sizes="(max-width: 768px) 100vw, 33vw"
   - Client logos: width="120" height="60"
3. Preconnect: fonts.googleapis.com + cdn.jsdelivr.net (remixicon)
4. onerror fallback WAJIB di semua dynamic img:
   - Portfolio/hero/solutions: onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'"
5. Unsplash ID rusak (404) yang sudah fix: photo-1497366811353-2533774fa78d -> ganti photo-1515378791036-0648a3ef77b2 (office). Selalu cek HEAD 200 sebelum pakai ID baru.
6. Kompresi: max longest side 400px, PNG optimize compress_level 9, logo utama quantized -> restore RGBA bila mode P (palette racun transparansi). Jangan quantize RGBA ke P tanpa cek render.
7. Server cache: css/js/png/svg -> Cache-Control public, max-age=604800, immutable ; html -> max-age=0 must-revalidate ; compression gzip aktif
8. Verifikasi: curl -I <url> cek 200 + content-type image/png + cache header ; file <img> cek PNG signature 89 50 4E 47

