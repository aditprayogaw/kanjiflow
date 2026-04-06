export const compareStrokes = (userStrokes, dbStrokes) => {
    if (userStrokes.length === 0 || !dbStrokes || dbStrokes.length === 0) return 0;

    let totalScore = 0;
    // Kita bandingkan stroke demi stroke sesuai urutan
    const matchCount = Math.min(userStrokes.length, dbStrokes.length);

    for (let i = 0; i < matchCount; i++) {
        const uPath = userStrokes[i].points; // Array dari Normalizer [ ['M', x, y], ['L', x, y]... ]
        const dPathString = dbStrokes[i];   // String JSON "M 10,50 L 90,50"

        // Parsing semua angka dari string DB
        const dCoords = dPathString.match(/-?\d+(\.\d+)?/g).map(Number);
        if (dCoords.length < 4 || uPath.length < 1) continue;

        // Ambil Titik Awal & Akhir User
        // uPath[0] adalah ['M', x, y], uPath[last] adalah ['L', x, y] atau ['Q', ...]
        const uStart = { x: uPath[0][1], y: uPath[0][2] };
        const uEnd = {
            x: uPath[uPath.length - 1][uPath[uPath.length - 1].length - 2],
            y: uPath[uPath.length - 1][uPath[uPath.length - 1].length - 1]
        };

        // Ambil Titik Awal & Akhir Database
        const dStart = { x: dCoords[0], y: dCoords[1] };
        const dEnd = { x: dCoords[dCoords.length - 2], y: dCoords[dCoords.length - 1] };

        // HITUNG DUA ARAH (Untuk jaga-jaga jika user menggambar terbalik)
        // 1. Searah (Normal)
        const distForward = (Math.hypot(uStart.x - dStart.x, uStart.y - dStart.y) +
            Math.hypot(uEnd.x - dEnd.x, uEnd.y - dEnd.y)) / 2;

        // 2. Terbalik (Reverse)
        const distReverse = (Math.hypot(uStart.x - dEnd.x, uStart.y - dEnd.y) +
            Math.hypot(uEnd.x - dStart.x, uEnd.y - dStart.y)) / 2;

        // Ambil jarak terkecil (paling mendekati)
        const bestDist = Math.min(distForward, distReverse);

        // Skor: Makin kecil jarak, makin tinggi skor (Skala 0-100)
        const strokeScore = Math.max(0, 100 - bestDist);
        totalScore += strokeScore;
    }

    // Rata-rata skor berdasarkan jumlah garis yang dibandingkan
    let finalScore = totalScore / matchCount;

    // PENALTI: Jika jumlah garis di kanvas berbeda dengan di database
    // Contoh: User gambar 5 garis untuk Kanji yang aslinya cuma 2 garis
    const diff = Math.abs(userStrokes.length - dbStrokes.length);
    finalScore -= (diff * 15);

    return Math.max(0, Math.round(finalScore));
};