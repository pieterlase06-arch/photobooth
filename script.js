const video = document.getElementById('camera-stream');
const canvas = document.getElementById('strip-canvas');
const ctx = canvas.getContext('2d');
const finalStrip = document.getElementById('final-strip');
const captureBtn = document.getElementById('capture-btn');
const countdownEl = document.getElementById('countdown');
const downloadBtn = document.getElementById('download-btn');

// Nyalakan Kamera
async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        video.srcObject = stream;
    } catch (error) {
        console.error("Gagal akses kamera", error);
    }
}
setupCamera();

// Fungsi Jeda Waktu (Delay)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

captureBtn.addEventListener('click', async () => {
    captureBtn.disabled = true;
    
    // Setting Ukuran Template (Lebar 640px, Tinggi disesuaikan untuk 3 foto + jarak)
    const photoWidth = 640;
    const photoHeight = 480;
    const gap = 20; // Jarak antar foto
    const padding = 40; // Frame luar putih
    const bottomPadding = 120; // Ruang putih di bawah untuk teks/logo

    canvas.width = photoWidth + (padding * 2);
    canvas.height = (photoHeight * 3) + (gap * 2) + padding + bottomPadding;

    // Warnai background template jadi putih
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Looping ambil 3 foto
    for (let i = 0; i < 3; i++) {
        // Hitung Mundur 3, 2, 1
        countdownEl.classList.remove('hidden');
        for (let count = 3; count > 0; count--) {
            countdownEl.innerText = count;
            await sleep(1000);
        }
        countdownEl.innerText = "📸 Cekrek!";
        await sleep(500);
        countdownEl.classList.add('hidden');

        // Kalkulasi posisi Y untuk menempelkan foto ke-1, 2, 3 ke bawah
        const yPos = padding + (i * (photoHeight + gap));

        // Gambar ke canvas (Dibalik agar tidak mirror)
        ctx.save();
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, padding, yPos, photoWidth, photoHeight);
        ctx.restore();
    }

    // Tulis teks / tanggal di bagian bawah template
    ctx.fillStyle = "black";
    ctx.font = "bold 40px 'Segoe UI'";
    ctx.textAlign = "center";
    ctx.fillText("My Photobooth", canvas.width / 2, canvas.height - 40);

    // Tampilkan Hasil Template
    const dataURL = canvas.toDataURL('image/png');
    finalStrip.src = dataURL;
    finalStrip.style.display = "block";
    
    // Siapkan tombol download
    downloadBtn.href = dataURL;
    downloadBtn.style.display = "inline-block";

    captureBtn.disabled = false;
});
