const canvas = document.getElementById('photo-canvas');
const ctx = canvas.getContext('2d');
const photoResult = document.getElementById('photo-result');
const captureBtn = document.getElementById('capture-btn');

captureBtn.addEventListener('click', () => {
    // Samakan ukuran canvas dengan ukuran asli video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Gambar frame video ke canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Ubah data canvas menjadi URL gambar dan tampilkan
    const dataURL = canvas.toDataURL('image/jpeg', 0.9); // Kualitas 90%
    photoResult.src = dataURL;
});
