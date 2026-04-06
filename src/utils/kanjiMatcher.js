const getSegmentEndPoint = (segment) => {
    const len = segment.length;
    return { x: segment[len - 2], y: segment[len - 1] };
};

export const compareStrokes = (userStrokes, dbStrokes) => {
    if (userStrokes.length === 0 || !dbStrokes || dbStrokes.length === 0) return 0;

    let totalScore = 0;
    const matchCount = Math.min(userStrokes.length, dbStrokes.length);

    for (let i = 0; i < matchCount; i++) {
        const uPath = userStrokes[i].points;
        const dPathString = dbStrokes[i];

        const dCoords = dPathString.match(/-?\d+(\.\d+)?/g)?.map(Number);
        if (!dCoords || dCoords.length < 4 || uPath.length < 1) continue;

        // Ambil start/end user dengan helper yang aman
        const uStart = { x: uPath[0][1], y: uPath[0][2] };
        const uEnd = getSegmentEndPoint(uPath[uPath.length - 1]);

        // Ambil start/end database
        const dStart = { x: dCoords[0], y: dCoords[1] };
        const dEnd = { x: dCoords[dCoords.length - 2], y: dCoords[dCoords.length - 1] };

        // Guard: jika masih undefined, skip stroke ini
        if (uEnd.x === undefined || uEnd.y === undefined) continue;

        const distForward = (Math.hypot(uStart.x - dStart.x, uStart.y - dStart.y) +
            Math.hypot(uEnd.x - dEnd.x, uEnd.y - dEnd.y)) / 2;

        const distReverse = (Math.hypot(uStart.x - dEnd.x, uStart.y - dEnd.y) +
            Math.hypot(uEnd.x - dStart.x, uEnd.y - dStart.y)) / 2;

        const bestDist = Math.min(distForward, distReverse);
        const strokeScore = Math.max(0, 100 - bestDist);
        totalScore += strokeScore;
    }

    let finalScore = totalScore / matchCount;
    const diff = Math.abs(userStrokes.length - dbStrokes.length);
    finalScore -= (diff * 15);

    return Math.max(0, Math.round(finalScore));
};