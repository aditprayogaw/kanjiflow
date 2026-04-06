export const normalizeStroke = (fabricPath) => {
    const path = fabricPath.path;
    if (!path || path.length === 0) return [];

    // Kumpulkan semua koordinat dulu untuk hitung bounding box yang akurat
    const allX = [];
    const allY = [];

    path.forEach(segment => {
        const coords = segment.slice(1);
        for (let i = 0; i < coords.length; i += 2) {
            allX.push(coords[i]);
            allY.push(coords[i + 1]);
        }
    });

    const minX = Math.min(...allX);
    const minY = Math.min(...allY);
    const maxX = Math.max(...allX);
    const maxY = Math.max(...allY);
    const size = Math.max(maxX - minX, maxY - minY, 1);

    return path.map(segment => {
        const command = segment[0];
        const coords = segment.slice(1);
        const normalizedCoords = [];

        for (let i = 0; i < coords.length; i += 2) {
            const nx = ((coords[i] - minX) / size) * 100;
            const ny = ((coords[i + 1] - minY) / size) * 100;
            normalizedCoords.push(Number(nx.toFixed(2)), Number(ny.toFixed(2)));
        }

        return [command, ...normalizedCoords];
    });
};