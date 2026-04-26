// script.js
const video = document.getElementById('camera-stream');
const canvas = document.getElementById('photo-canvas');
const ctx = canvas.getContext('2d');
const photoResult = document.getElementById('photo-result');
const captureBtn = document.getElementById('capture-btn');

// 1. Fungsi menyalakan Kamera
async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 1280, height: 720 },
            audio: false
        });
        video.srcObject = stream;
    } catch (error) {
        console.error("Gagal akses kamera:", error);
        alert("Tolong izinkan akses kamera di browser Anda saat muncul pop-up.");
    }
}

// Jalankan fungsi kamera saat web dimuat
setupCamera();

// 2. Fungsi mengambil foto saat tombol ditekan
captureBtn.addEventListener('click', () => {
    // Sesuaikan ukuran canvas dengan ukuran resolusi video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Membalik gambar di canvas agar hasilnya sama seperti yang kita lihat di layar cermin
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    
    // Gambar jepretan ke canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Ubah jadi gambar PNG dan tampilkan
    const dataURL = canvas.toDataURL('image/png');
    photoResult.src = dataURL;
    
    // Munculkan elemen gambar yang tadi disembunyikan
    photoResult.style.display = 'block'; 
});
