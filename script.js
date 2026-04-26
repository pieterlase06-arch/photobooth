const video = document.getElementById('camera-stream');
const canvas = document.getElementById('strip-canvas');
const ctx = canvas.getContext('2d');
const finalStrip = document.getElementById('final-strip');
const captureBtn = document.getElementById('capture-btn');
const countdownEl = document.getElementById('countdown');
const downloadBtn = document.getElementById('download-btn');
const filterBtns = document.querySelectorAll('.filter-btn');

let currentFilter = 'none';

// 1. Logika Penggantian Filter
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Hapus status aktif dari semua tombol
        filterBtns.forEach(b => b.classList.remove('active'));
        // Jadikan tombol yang diklik menjadi aktif
        btn.classList.add('active');
        
        // Aplikasikan filter CSS ke video kamera
        currentFilter = btn.getAttribute('data-filter');
        video.style.filter = currentFilter;
    });
});

// 2. Setup Kamera
async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        video.srcObject = stream;
    } catch (error) {
        console.error("Kamera gagal diakses:", error);
        alert("Tolong izinkan akses kamera!");
    }
}
setupCamera();

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 3. Logika Memotret dan Merakit Photo Strip
captureBtn.addEventListener('click', async () => {
    captureBtn.disabled = true;
    captureBtn.innerText = "⏳ Sedang Memotret...";
    
    // Konfigurasi ukuran Kertas Cetakan
    const photoWidth = 640;
    const photoHeight = 480;
    const gap = 20; 
    const padding = 40; 
    const bottomPadding = 150; // Ruang ekstra untuk teks di bawah

    canvas.width = photoWidth + (padding * 2);
    canvas.height = (photoHeight * 3) + (gap * 2) + padding + bottomPadding;

    // Warnai kertas menjadi putih bersih
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ambil 3 foto
    for (let i = 0; i < 3; i++) {
        countdownEl.classList.remove('hidden');
        for (let count = 3; count > 0; count--) {
            countdownEl.innerText = count;
            await sleep(1000);
        }
        countdownEl.innerText = "📸";
        await sleep(400); // Waktu kilat saat dijepret
        countdownEl.classList.add('hidden');

        const yPos = padding + (i * (photoHeight + gap));

        // Gambar ke canvas
        ctx.save();
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1); // Balik gambar (efek cermin)
        
        // Terapkan filter warna ke canvas (sama persis dengan yang di layar)
        ctx.filter = currentFilter;
        
        ctx.drawImage(video, padding, yPos, photoWidth, photoHeight);
        ctx.restore();
        
        await sleep(700); // Jeda bernapas sebelum foto berikutnya
    }

    // Tulis Teks Logo di bagian bawah kertas
    ctx.fillStyle = "black";
    ctx.font = "bold 50px 'Poppins', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Snap Studio", canvas.width / 2, canvas.height - 70);
    
    // Tulis Tanggal hari ini
    ctx.font = "normal 30px 'Poppins', sans-serif";
    ctx.fillStyle = "#888";
    const date = new Date().toLocaleDateString('id-ID');
    ctx.fillText(date, canvas.width / 2, canvas.height - 30);

    // Tampilkan Hasilnya ke Layar
    const dataURL = canvas.toDataURL('image/png');
    finalStrip.src = dataURL;
    finalStrip.style.display = "block";
    
    downloadBtn.href = dataURL;
    downloadBtn.style.display = "block";

    // Kembalikan tombol seperti semula
    captureBtn.innerText = "📸 Mulai Sesi (3 Foto)";
    captureBtn.disabled = false;
});
