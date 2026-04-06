export const normalizeStroke = (fabricPath) => {
    // Ambil data koordinat mentah dari Fabric.js
    const path = fabricPath.path;
    if (!path || path.length === 0) return [];

    // Ambil dimensi bounding box garis tersebut
    const { left, top, width, height } = fabricPath;

    // Gunakan dimensi terbesar sebagai pembagi agar aspek rasio terjaga
    const size = Math.max(width, height, 1);

    console.log("🛠️ Normalizing stroke at:", { left, top, size });

    return path.map(segment => {
        const command = segment[0]; // 'M', 'L', atau 'Q'
        const coords = segment.slice(1);
        const normalizedCoords = [];

        for (let i = 0; i < coords.length; i += 2) {
            // Rumus normalisasi ke skala 0-100
            const nx = ((coords[i] - left) / size) * 100;
            const ny = ((coords[i + 1] - top) / size) * 100;

            normalizedCoords.push(Number(nx.toFixed(2)), Number(ny.toFixed(2)));
        }

        return [command, ...normalizedCoords];
    });
};