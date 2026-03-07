(function () {
    const canvas = document.getElementById('globe-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const section = canvas.closest('.about-section-1');

    const LAT_STEP = 20;
    const LON_STEP = 20;
    const POINTS_PER_RING = 72;
    const ROTATION_SPEED = 0.002;
    const PERSPECTIVE = 2.5;

    let angle = 0;
    let animId = null;
    let isVisible = false;
    let strokeColor = getStrokeColor();

    function getStrokeColor() {
        const theme = document.documentElement.getAttribute('data-theme');
        return theme === 'dark'
            ? 'rgba(255, 255, 255, 0.5)'
            : 'rgba(30, 32, 34, 0.45)';
    }

    function spherePoint(lat, lon) {
        const latRad = lat * Math.PI / 180;
        const lonRad = lon * Math.PI / 180;
        return [
            Math.cos(latRad) * Math.sin(lonRad),
            Math.sin(latRad),
            Math.cos(latRad) * Math.cos(lonRad)
        ];
    }

    function rotateY(x, y, z, a) {
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        return [x * cos + z * sin, y, -x * sin + z * cos];
    }

    function project(x, y, z, cx, cy, radius) {
        const scale = PERSPECTIVE / (PERSPECTIVE + z);
        return [cx + x * radius * scale, cy - y * radius * scale, scale];
    }

    const latRings = [];
    for (let lat = -80; lat <= 80; lat += LAT_STEP) {
        const ring = [];
        for (let i = 0; i <= POINTS_PER_RING; i++) {
            const lon = (i / POINTS_PER_RING) * 360;
            ring.push(spherePoint(lat, lon));
        }
        latRings.push(ring);
    }

    const lonRings = [];
    for (let lon = 0; lon < 360; lon += LON_STEP) {
        const ring = [];
        for (let i = 0; i <= POINTS_PER_RING; i++) {
            const lat = -90 + (i / POINTS_PER_RING) * 180;
            ring.push(spherePoint(lat, lon));
        }
        lonRings.push(ring);
    }

    function resize() {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawRing(ring, cx, cy, radius) {
        ctx.beginPath();
        let started = false;
        for (let i = 0; i < ring.length; i++) {
            const [x, y, z] = rotateY(ring[i][0], ring[i][1], ring[i][2], angle);
            if (z < -PERSPECTIVE + 0.1) {
                started = false;
                continue;
            }
            const [px, py] = project(x, y, z, cx, cy, radius);
            if (!started) {
                ctx.moveTo(px, py);
                started = true;
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.stroke();
    }

    function draw() {
        const w = canvas.getBoundingClientRect().width;
        const h = canvas.getBoundingClientRect().height;
        ctx.clearRect(0, 0, w, h);

        const radius = Math.min(w, h) * 0.45;
        const cx = w * 0.82;
        const cy = h * 0.5;

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1;

        for (const ring of latRings) drawRing(ring, cx, cy, radius);
        for (const ring of lonRings) drawRing(ring, cx, cy, radius);
    }

    function frame() {
        angle += ROTATION_SPEED;
        draw();
        if (isVisible) animId = requestAnimationFrame(frame);
    }

    function start() {
        if (animId) return;
        isVisible = true;
        resize();
        animId = requestAnimationFrame(frame);
    }

    function stop() {
        isVisible = false;
        if (animId) {
            cancelAnimationFrame(animId);
            animId = null;
        }
    }

    const resizeObserver = new ResizeObserver(() => {
        resize();
        if (!isVisible) draw();
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) start();
            else stop();
        },
        { threshold: 0 }
    );
    intersectionObserver.observe(section);

    const themeObserver = new MutationObserver(() => {
        strokeColor = getStrokeColor();
    });
    themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
})();
