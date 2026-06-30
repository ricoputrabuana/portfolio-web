import React, { useRef, useEffect } from "react";

const STAR_DATA = Array.from({ length: 120 }, () => ({
  x: Math.random(),
  y: Math.random() * 0.5,
  r: Math.random() * 1.2,
}));

const rippleData = Array.from({ length: 100 }, () => ({
  x: Math.random(),
  y: Math.random(),
  width: 0.01 + Math.random() * 0.06,
  phase: Math.random() * Math.PI * 2,
  amp: 0.5 + Math.random() * 1.5,
  speed: 0.5 + Math.random() * 1.2,
  alpha: 0.02 + Math.random() * 0.08,
}));

const auroraBeamDefs = [
  { cx: 0.51, color: [80, 255, 160],  baseWidth: 0.040, intensity: 0.72, heightRatio: 1.0,  widthScale: 1.0, verticalOffset: 0.20 },
  { cx: 0.46, color: [60, 255, 120],  baseWidth: 0.025, intensity: 0.55, heightRatio: 0.8,  widthScale: 1.0, verticalOffset: 0.22 },
  { cx: 0.57, color: [116,255, 200],  baseWidth: 0.030, intensity: 0.50, heightRatio: 1.2,  widthScale: 1.1, verticalOffset: 0.17 },
  { cx: 0.65, color: [180, 80, 255],  baseWidth: 0.035, intensity: 0.62, heightRatio: 1.0,  widthScale: 1.0, verticalOffset: 0.20 },
  { cx: 0.71, color: [200,100, 255],  baseWidth: 0.022, intensity: 0.45, heightRatio: 0.9,  widthScale: 0.8, verticalOffset: 0.24 },
  { cx: 0.42, color: [40, 220, 140],  baseWidth: 0.018, intensity: 0.40, heightRatio: 0.7,  widthScale: 1.0, verticalOffset: 0.18 },
  { cx: 0.61, color: [140,255, 180],  baseWidth: 0.020, intensity: 0.38, heightRatio: 1.1,  widthScale: 1.2, verticalOffset: 0.21 },
];

function drawStars(ctx, W, H) {
  ctx.save();
  ctx.fillStyle = "white";
  for (const s of STAR_DATA) {
    ctx.beginPath();
    ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawSkyGradient(ctx, W, H) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0,    "#150b2e");
  grad.addColorStop(0.3,  "#351c61");
  grad.addColorStop(0.65, "#7a3fa3");
  grad.addColorStop(1,    "#e48dbd");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

function drawAurora(ctx, W, H, t, rayOffCtx) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  const rand = (seed) => {
    const x = Math.sin(seed * 127.1) * 43758.5453;
    return x - Math.floor(x);
  };

  const greenLong1 = {
    x1: W * 0.88, y1: H * -0.02,
    x2: W * 0.411, y2: H * 0.315,
    color: [55, 255, 138], alpha: [0.90, 0.90, 0.62, 0],
    rayW: W * 0.030, rayScale: 1.0,
    waveAmp1: W * 0.028, waveFreq1: 1.5,
    waveAmp2: W * 0.014, waveFreq2: 2.8,
    speed: 0.36, blur: 18,
  };

  const greenLong2 = {
    x1: W * 1.01, y1: H * -0.02,
    x2: W * 0.58, y2: H * 0.36,
    color: [38, 230, 118], alpha: [0.84, 0.84, 0.58, 0],
    rayW: W * 0.027, rayScale: 1.0,
    waveAmp1: W * 0.026, waveFreq1: 1.8,
    waveAmp2: W * 0.013, waveFreq2: 3.5,
    speed: 0.40, blur: 16,
  };

  const greenShort = {
    x1: W * 0.72, y1: H * -0.06,
    x2: W * 0.411, y2: H * 0.315,
    color: [88, 255, 168], alpha: [0.72, 0.72, 0.44, 0],
    rayW: W * 0.019, rayScale: 0.45,
    waveAmp1: W * 0.020, waveFreq1: 2.2,
    waveAmp2: W * 0.010, waveFreq2: 4.5,
    speed: 0.44, blur: 13,
  };

  const purpleLong = {
    x1: W * 1.07, y1: H * -0.04,
    x2: W * 0.601, y2: H * 0.332,
    color: [172, 52, 255], alpha: [0.95, 0.95, 0.72, 0],
    rayW: W * 0.032, rayScale: 1.0,
    waveAmp1: W * 0.030, waveFreq1: 2.0,
    waveAmp2: W * 0.015, waveFreq2: 4.0,
    speed: 0.38, blur: 10,
  };

  const purpleShort = {
    x1: W * 0.82, y1: H * 0.25,
    x2: W * 0.57, y2: H * 0.38,
    color: [208, 78, 255], alpha: [0.70, 0.70, 0.58, 0.15],
    rayW: W * 0.021, rayScale: 0.45,
    waveAmp1: W * 0.024, waveFreq1: 2.6,
    waveAmp2: W * 0.012, waveFreq2: 5.2,
    speed: 0.48, blur: 14,
  };

  const pitaDefs = [
    greenLong1,
    greenLong2,
    greenShort,
    purpleLong,
    purpleShort,
  ];

  // OPT #5: steps dikurangi 80 → 50 (hampir tidak terlihat bedanya secara visual)
  const steps = 50;

  for (const {
    x1, y1, x2, y2,
    color, alpha,
    rayW, rayScale = 1.0, waveAmp1, waveFreq1, waveAmp2, waveFreq2,
    speed, blur,
  } of pitaDefs) {
    const dx  = x2 - x1;
    const dy  = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx  = -dy / len;
    const ny  =  dx / len;
    const [r, g, b] = color;

    // OPT #4: gunakan Path2D untuk beam fill (lebih efisien dari manual lineTo loop)
    const beamPath = new Path2D();
    let firstLeft = true;
    const rightXs = [];
    const rightYs = [];

    for (let i = 0; i <= steps; i++) {
      const p  = i / steps;
      const bx = x1 + dx * p;
      const by = y1 + dy * p;
      const wave =
        Math.sin(p * Math.PI * waveFreq1 + t * speed)              * waveAmp1 +
        Math.sin(p * Math.PI * waveFreq2 + t * speed * 0.55 + 2.1) * waveAmp2;
      const taper = Math.pow(1.0 - p, 0.75) * rayW;
      const lx = bx + nx * taper        + wave;
      const ly = by + ny * taper;
      const rx = bx - nx * taper * 0.25 + wave;
      const ry = by - ny * taper * 0.25;

      if (firstLeft) { beamPath.moveTo(lx, ly); firstLeft = false; }
      else            { beamPath.lineTo(lx, ly); }
      rightXs.push(rx); rightYs.push(ry);
    }
    for (let i = rightXs.length - 1; i >= 0; i--) beamPath.lineTo(rightXs[i], rightYs[i]);
    beamPath.closePath();

    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    grad.addColorStop(0,    `rgba(${r},${g},${b},${alpha[0]})`);
    grad.addColorStop(0.08, `rgba(${r},${g},${b},${alpha[1]})`);
    grad.addColorStop(0.60, `rgba(${r},${g},${b},${alpha[2]})`);
    grad.addColorStop(1,    `rgba(${r},${g},${b},${alpha[3]})`);

    ctx.filter    = `blur(${blur}px)`;
    ctx.fillStyle = grad;
    ctx.fill(beamPath);
    ctx.filter = "none";

    // OPT #2: render semua rays beam ini ke rayOffCtx dulu (tanpa blur),
    // lalu composite ke ctx dengan blur sekali — kurangi filter state changes drastis.
    const rayCount = 80;
    const rayBlur  = Math.max(1, blur * 0.18);

    rayOffCtx.clearRect(0, 0, W, H);
    rayOffCtx.save();
    rayOffCtx.globalCompositeOperation = "source-over";
    rayOffCtx.lineCap = "round";

    for (let i = 0; i <= rayCount; i++) {
      const p  = i / rayCount;
      const bx = x1 + dx * p;
      const by = y1 + dy * p;
      const wave =
        Math.sin(p * Math.PI * waveFreq1 + t * speed)              * waveAmp1 +
        Math.sin(p * Math.PI * waveFreq2 + t * speed * 0.55 + 2.1) * waveAmp2;

      const seed        = i * 17.37 + (x1 + y1) * 0.001;
      const flicker     = Math.sin(t * 0.6 + seed) * 0.12;
      const taperFactor = Math.pow(1.0 - p, 0.38);
      const heightF     = 0.18 + rand(seed) * 0.27 + flicker;
      const rayHeight   = H * heightF * taperFactor * taperFactor * rayScale;

      const baseX    = bx + wave;
      const topX     = baseX + wave * 0.4;
      const topY     = by - rayHeight;
      const rayWidth = rayW * (0.06 + rand(seed + 99) * 0.10) * taperFactor * rayScale;

      const fadeAlpha = alpha[1] * Math.pow(1.0 - p, 0.5);

      // OPT #4: Path2D untuk setiap ray
      const rayPath = new Path2D();
      rayPath.moveTo(baseX, by);
      rayPath.lineTo(topX, topY);

      const rayGrad = rayOffCtx.createLinearGradient(baseX, by, topX, topY);
      rayGrad.addColorStop(0,   `rgba(${r},${g},${b},${fadeAlpha * 0.55})`);
      rayGrad.addColorStop(0.4, `rgba(${r},${g},${b},${fadeAlpha * 0.20})`);
      rayGrad.addColorStop(1,   `rgba(${r},${g},${b},0)`);

      rayOffCtx.strokeStyle = rayGrad;
      rayOffCtx.lineWidth   = rayWidth;
      rayOffCtx.stroke(rayPath);
    }
    rayOffCtx.restore();

    // Composite rayOffCanvas ke ctx dengan blur sekali per beam (bukan per ray)
    ctx.filter = `blur(${rayBlur}px)`;
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(rayOffCtx.canvas, 0, 0);
    ctx.filter = "none";
  }

  ctx.restore();
  ctx.globalCompositeOperation = "source-over";
}

function buildRidgePts(seed, W, H, opts = {}) {
  const {
    cutoffRatio = 0.65,
    leftCutoff  = 0.12,
    mainPeakX   = 0.30,
    mainPeakH   = 0.70,
    falloffRight = 0.35,
    falloffLeft  = 0.50,
  } = opts;

  const pts   = [];
  const steps = W + 1;

  for (let i = 0; i <= steps; i++) {
    const x  = (i / steps) * W;
    const nx = (x / W) - 0.12;
    let y = 0;

    for (let o = 0; o < 6; o++) {
      const f = Math.pow(2, o);
      const a = Math.pow(0.55, o);
      y += a * Math.sin(nx * f * Math.PI * (3.5 + seed * 0.5) + seed * 2.7 + o * 1.7);
    }

    const slope     = nx * 0.10;
    const baseLevel = 0.25 + slope;
    const mainPeak  = -mainPeakH * Math.exp(-Math.pow((nx - (mainPeakX - seed * 0.03)) * 5.5, 2));
    const peak2     = -0.35      * Math.exp(-Math.pow((nx - 0.22) * 9.0, 2));
    const peak3     = -0.25      * Math.exp(-Math.pow((nx - 0.40) * 8.0, 2));
    const peak4     = -0.20      * Math.exp(-Math.pow((nx - 0.15) * 10.0, 2));
    const jagged    = Math.abs(Math.sin(nx * 38 + seed * 5.1)) * 0.12
                    + Math.abs(Math.sin(nx * 22 + seed * 3.3)) * 0.08;

    y = y * 0.10 + baseLevel + mainPeak + peak2 + peak3 + peak4 - jagged;

    let finalY  = H * (0.48 + seed * 0.055 + y * 0.30);
    const xRatio = x / W;

    if (xRatio > cutoffRatio) {
      const falloff = (xRatio - cutoffRatio) / (1.0 - cutoffRatio);
      finalY = Math.min(H + 10, finalY + falloff * falloff * H * falloffRight);
    }
    if (xRatio < leftCutoff) {
      const falloff = (leftCutoff - xRatio) / leftCutoff;
      finalY = Math.min(H + 10, finalY + falloff * falloff * H * falloffLeft);
    }
    pts.push({ x, y: finalY });
  }
  return pts;
}

function mountainRidgeGreen(seed, W, H)   { return buildRidgePts(seed, W, H, { cutoffRatio: 0.92, mainPeakH: 0.42, mainPeakX: 0.32, falloffRight: 0.18 }); }
function mountainRidgeYellow(seed, W, H)  { return buildRidgePts(seed, W, H, { cutoffRatio: 0.92, mainPeakH: 0.55, mainPeakX: 0.32, falloffRight: 0.18 }); }
function mountainRidgeMagenta(seed, W, H) { return buildRidgePts(seed, W, H, { cutoffRatio: 0.88, mainPeakH: 0.70, mainPeakX: 0.10, falloffRight: 0.18 }); }

function drawMountains(ctx, W, H, cachedRidgePoints) {
  const mountainBottom = H * 0.75;

  const ridges = [
    { pts: cachedRidgePoints[0], fill: ["#0d0d0d", "#0d3520"], mountainBottom: H * 0.66, startX: W * 0.30, endX: W * 0.95 },
    { pts: cachedRidgePoints[1], fill: ["#0d0d0d", "#0a2510"], mountainBottom: H * 0.68, startX: W * 0.15, endX: W * 0.85 },
    { pts: cachedRidgePoints[2], fill: ["#0d0d0d", "#0a1a0d"], mountainBottom: H * 0.72, startX: W * 0.15, endX: W * 0.75 },
  ];

  ridges.forEach(({ pts, fill, mountainBottom: mb, startX, endX }) => {
    const rangeW    = endX - startX;
    const mappedPts = pts.map(({ x, y }) => ({ x: startX + (x / W) * rangeW, y }));
    const minY      = Math.min(...mappedPts.map(p => p.y));
    const grad      = ctx.createLinearGradient(0, minY, 0, mb);
    grad.addColorStop(0, fill[0]);
    grad.addColorStop(1, fill[1]);

    ctx.save();
    ctx.beginPath();
    ctx.rect(startX, 0, endX - startX + W * 0.2, mb);
    ctx.clip();

    ctx.beginPath();
    ctx.moveTo(startX, mb);

    const threshold = H * 0.20;
    const highPts   = mappedPts.filter(p => p.y < mb - threshold);
    const startPt   = highPts[highPts.length - 1];

    mappedPts.forEach(({ x, y }) => { if (x <= startPt.x) ctx.lineTo(x, y); });

    if (startPt) {
      const steps = 50;
      for (let s = 1; s <= steps; s++) {
        const tl = s / steps;
        ctx.lineTo(
          startPt.x + (endX - startPt.x) * tl,
          startPt.y + (mb - startPt.y) * tl + Math.sin(tl * Math.PI * 4) * H * 0.012 * (1 - tl)
        );
      }
    }

    ctx.lineTo(endX, mb);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  });

  const markerY1  = mountainBottom;
  const markerY2  = markerY1 + H * 0.03;
  const cachedBase = buildRidgePts(0.0, W, H);

  ctx.save();
  ctx.strokeStyle = "#1a2a4a";
  ctx.lineWidth   = 2;
  ctx.beginPath(); ctx.moveTo(0, markerY1); ctx.lineTo(W * 0.43, markerY1); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, markerY2); ctx.lineTo(W * 0.28, markerY2); ctx.stroke();

  const miniDefs = [
    { baseY: markerY1, width: W * 0.44, scaleY: 0.45 },
    { baseY: markerY2, width: W * 0.38, scaleY: 0.60 },
  ];

  miniDefs.forEach(({ baseY, width, scaleY }, miniIdx) => {
    ctx.save();
    const offsetX   = miniIdx === 1 ? -W * 0.12 : 0;
    ctx.translate(offsetX, 0);
    const clipWidth = miniIdx === 0 ? W * 0.46 : W * 0.28 - offsetX;

    ctx.beginPath();
    ctx.rect(0, 0, clipWidth, baseY);
    ctx.clip();

    const fill      = miniIdx === 1 ? ["#0d0d0d", "#0d0d0d"] : ["#0d0d0d", "#0a1a0d"];
    const mappedPts = cachedBase.map(({ x, y }) => {
      const xRatio    = x / W;
      const xMapped   = xRatio * width;
      const heightFrB = H - y;
      const yMapped   = baseY - heightFrB * scaleY;
      const edge      = Math.sin(xRatio * Math.PI);
      return { x: xMapped, y: baseY - (baseY - yMapped) * edge };
    });

    const minY  = Math.min(...mappedPts.map(p => p.y));
    const grad  = ctx.createLinearGradient(0, minY, 0, baseY);
    grad.addColorStop(0, fill[0]);
    grad.addColorStop(1, fill[1]);

    ctx.beginPath();
    ctx.moveTo(0, baseY);

    const threshold = H * 0.15;
    const highPts   = mappedPts.filter(p => p.y < baseY - threshold);
    const startPt   = highPts[highPts.length - 1];

    mappedPts.forEach(({ x, y }) => { if (x <= startPt.x) ctx.lineTo(x, y); });

    if (startPt) {
      const endX2 = miniIdx === 0 ? W * 0.43 : W * 0.28 - offsetX;
      const steps  = 40;
      for (let s = 1; s <= steps; s++) {
        const tl = s / steps;
        ctx.lineTo(
          startPt.x + (endX2 - startPt.x) * tl,
          startPt.y + (baseY - startPt.y) * tl + Math.sin(tl * Math.PI * 4) * H * 0.012 * (1 - tl)
        );
      }
    }

    ctx.lineTo(clipWidth, baseY);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  });

  ctx.restore();
  return ridges;
}

function drawHills(ctx, W, H) {
  const baseY = H * 0.75;
  const grad  = ctx.createLinearGradient(0, H * 0.42, 0, baseY);
  grad.addColorStop(0, "#0d0d0d");
  grad.addColorStop(1, "#0a1a0d");

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(W * 0.54, baseY);
  ctx.bezierCurveTo(W * 0.62, H * 0.62, W * 0.72, H * 0.70, W * 0.82, H * 0.58);
  ctx.bezierCurveTo(W * 0.85, H * 0.56, W * 0.87, H * 0.58, W * 0.90, H * 0.54);
  ctx.bezierCurveTo(W * 0.92, H * 0.51, W * 0.94, H * 0.53, W * 0.96, H * 0.49);
  ctx.bezierCurveTo(W * 0.97, H * 0.47, W * 0.98, H * 0.48, W * 1.00, H * 0.46);
  ctx.lineTo(W, baseY);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();
}


const TREE_POSITIONS = [
  [0.620, 0.695, 0.059, 0.87],
  [0.641, 0.688, 0.064, 0.90],
  [0.658, 0.680, 0.057, 0.86],
  [0.682, 0.673, 0.066, 0.89],
  [0.694, 0.665, 0.060, 0.88],
  [0.718, 0.658, 0.063, 0.91],
  [0.736, 0.651, 0.058, 0.85],
  [0.748, 0.643, 0.067, 0.90],
  [0.771, 0.636, 0.061, 0.87],
  [0.786, 0.629, 0.065, 0.89],
  [0.805, 0.622, 0.058, 0.86],
  [0.824, 0.615, 0.068, 0.91],
  [0.833, 0.608, 0.062, 0.88],
  [0.856, 0.590, 0.057, 0.85],
  [0.874, 0.586, 0.066, 0.90],
  [0.890, 0.570, 0.060, 0.87],
  [0.910, 0.565, 0.064, 0.89],
  [0.921, 0.550, 0.058, 0.86],
  [0.944, 0.526, 0.067, 0.91],
  [0.963, 0.509, 0.061, 0.88],
];

let _treeImg = null;
function getTreeImg() {
  if (_treeImg) return _treeImg;
  _treeImg = new Image();
  _treeImg.src = "data:image/jpeg;base64," + TREE_B64;
  return _treeImg;
}

function getHillY(xr, W, H) {
  const anchors = [
    { x: 0.54, y: 0.75 },
    { x: 0.82, y: 0.58 },
    { x: 0.90, y: 0.54 },
    { x: 0.96, y: 0.49 },
    { x: 1.00, y: 0.46 },
  ];

  if (xr <= anchors[0].x) return anchors[0].y * H;
  if (xr >= anchors[anchors.length - 1].x) return anchors[anchors.length - 1].y * H;

  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i], b = anchors[i + 1];
    if (xr >= a.x && xr <= b.x) {
      const t = (xr - a.x) / (b.x - a.x);
      return (a.y + t * (b.y - a.y)) * H;
    }
  }
  return 0.75 * H;
}

function drawTreeline(ctx, W, H) {
  const img = getTreeImg();
  if (!img.complete || img.naturalWidth === 0) return;

  ctx.save();
  ctx.globalAlpha = 0.85; // opacity dikurangin
  const imgAspect = img.naturalWidth / img.naturalHeight;

  for (const [xr, baseYr, heightR, scaleX] of TREE_POSITIONS) {
    const treeH = H * heightR;
    const treeW = treeH * imgAspect * scaleX;
    const bx    = W * xr - treeW / 2;
    const by    = H * baseYr - treeH;

    ctx.drawImage(img, bx, by, treeW, treeH);
  }

  ctx.restore();
}

let _grassWideImg = null;
let _grassSmallImg = null;

function getGrassWideImg() {
  if (_grassWideImg) return _grassWideImg;
  _grassWideImg = new Image();
  _grassWideImg.src = "data:image/png;base64," + GRASS_WIDE_B64;
  return _grassWideImg;
}

function getGrassSmallImg() {
  if (_grassSmallImg) return _grassSmallImg;
  _grassSmallImg = new Image();
  _grassSmallImg.src = "data:image/png;base64," + GRASS_SMALL_B64;
  return _grassSmallImg;
}

function drawGrass(ctx, W, H) {
  const wideImg  = getGrassWideImg();
  const smallImg = getGrassSmallImg();

  const wideReady  = wideImg.complete  && wideImg.naturalWidth  > 0;
  const smallReady = smallImg.complete && smallImg.naturalWidth > 0;
  if (!wideReady && !smallReady) return;

  const pseudoRand = (i, offset = 0) => {
    const x = Math.sin(i * 127.1 + offset * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };

  const WATER_TOP = H * 0.725;

  ctx.save();

  // ── LAYER 1: clump per pohon (kaki pohon)
  for (let i = 0; i < TREE_POSITIONS.length; i++) {
    const [xr, baseYr, , scaleX] = TREE_POSITIONS[i];
    const cx = W * xr;
    const cy = Math.min(H * baseYr, WATER_TOP);
    const perspScale = 0.7 + (xr - 0.58) / (0.997 - 0.58) * 0.6;

    if (wideReady) {
      const wAspect    = wideImg.naturalWidth / wideImg.naturalHeight;
      const clumpCount = 2 + Math.floor(pseudoRand(i, 0) * 2);

      for (let c = 0; c < clumpCount; c++) {
        const grassH  = H * 0.026 * perspScale * scaleX * (0.85 + pseudoRand(i, c + 1) * 0.3);
        const grassW  = grassH * wAspect * (1.0 + pseudoRand(i, c + 2) * 0.5);
        const offsetX = (pseudoRand(i, c + 3) - 0.5) * W * 0.030;
        const offsetY = pseudoRand(i, c + 4) * H * 0.006 + H * 0.003;
        const finalCy = Math.min(cy + offsetY, WATER_TOP);

        ctx.globalAlpha = 0.75 + pseudoRand(i, c + 5) * 0.25;
        ctx.drawImage(wideImg, cx + offsetX - grassW / 2, finalCy - grassH, grassW, grassH);
      }
    }

    if (smallReady) {
      const sAspect    = smallImg.naturalWidth / smallImg.naturalHeight;
      const clumpCount = 3 + Math.floor(pseudoRand(i, 10) * 3);

      for (let c = 0; c < clumpCount; c++) {
        const grassH  = H * 0.016 * perspScale * scaleX * (0.7 + pseudoRand(i, c + 11) * 0.5);
        const grassW  = grassH * sAspect * (0.8 + pseudoRand(i, c + 12) * 0.5);
        const offsetX = (pseudoRand(i, c + 13) - 0.5) * W * 0.045;
        const offsetY = pseudoRand(i, c + 14) * H * 0.008;
        const finalCy = Math.min(cy + offsetY, WATER_TOP);

        ctx.globalAlpha = 0.60 + pseudoRand(i, c + 15) * 0.30;
        ctx.drawImage(smallImg, cx + offsetX - grassW / 2, finalCy - grassH, grassW, grassH);
      }
    }
  }

  // ── LAYER 2: tengah bukit, sedikit di bawah Layer 1
  const MID_WIDE_COUNT  = 140;
  const MID_SMALL_COUNT = 160;

  if (wideReady) {
    const wAspect = wideImg.naturalWidth / wideImg.naturalHeight;
    for (let i = 0; i < MID_WIDE_COUNT; i++) {
      const xr      = 0.58 + pseudoRand(i, 100) * 0.38; // 0.58–0.96
      // interpolasi baseYr dari TREE_POSITIONS, lalu geser ke bawah
      const treeIdx = Math.floor((xr - 0.58) / (0.997 - 0.58) * (TREE_POSITIONS.length - 1));
      const clampedIdx = Math.min(treeIdx, TREE_POSITIONS.length - 1);
      const baseYr  = TREE_POSITIONS[clampedIdx][1] + 0.02 + pseudoRand(i, 106) * 0.02;

      const rawCy = H * baseYr;
      if (rawCy > WATER_TOP) continue;

      const cx         = W * xr;
      const perspScale = 0.50 + (xr - 0.58) / 0.38 * 0.25;
      const grassH     = H * 0.025 * perspScale * (0.8 + pseudoRand(i, 101) * 0.4);
      const grassW     = grassH * wAspect * (1.0 + pseudoRand(i, 102) * 0.5);
      const offsetX    = (pseudoRand(i, 103) - 0.5) * W * 0.018;
      const offsetY    = pseudoRand(i, 104) * H * 0.005;
      const finalCy    = Math.min(rawCy + offsetY, WATER_TOP);

      ctx.globalAlpha = 0.45 + pseudoRand(i, 105) * 0.25;
      ctx.drawImage(wideImg, cx + offsetX - grassW / 2, finalCy - grassH, grassW, grassH);
    }
  }

  if (smallReady) {
    const sAspect = smallImg.naturalWidth / smallImg.naturalHeight;
    for (let i = 0; i < MID_SMALL_COUNT; i++) {
      const xr      = 0.58 + pseudoRand(i, 110) * 0.38;
      const treeIdx = Math.floor((xr - 0.58) / (0.997 - 0.58) * (TREE_POSITIONS.length - 1));
      const clampedIdx = Math.min(treeIdx, TREE_POSITIONS.length - 1);
      const baseYr  = TREE_POSITIONS[clampedIdx][1] + 0.02 + pseudoRand(i, 116) * 0.02;

      const rawCy = H * baseYr;
      if (rawCy > WATER_TOP) continue;

      const cx         = W * xr;
      const perspScale = 0.42 + (xr - 0.58) / 0.38 * 0.22;
      const grassH     = H * 0.018 * perspScale * (0.7 + pseudoRand(i, 111) * 0.5);
      const grassW     = grassH * sAspect * (0.8 + pseudoRand(i, 112) * 0.5);
      const offsetX    = (pseudoRand(i, 113) - 0.5) * W * 0.015;
      const offsetY    = pseudoRand(i, 114) * H * 0.006;
      const finalCy    = Math.min(rawCy + offsetY, WATER_TOP);

      ctx.globalAlpha = 0.38 + pseudoRand(i, 115) * 0.25;
      ctx.drawImage(smallImg, cx + offsetX - grassW / 2, finalCy - grassH, grassW, grassH);
    }
  }

  // ── LAYER 3: clump independen (bawah bukit, jauh dari pohon)
  const EXTRA_WIDE_COUNT  = 80;
  const EXTRA_SMALL_COUNT = 100;

  if (wideReady) {
    const wAspect = wideImg.naturalWidth / wideImg.naturalHeight;
    for (let i = 0; i < EXTRA_WIDE_COUNT; i++) {
      const xr         = 0.36 + pseudoRand(i, 50) * 0.70;
      // wide
      const treeIdx    = Math.floor((xr - 0.58) / (0.997 - 0.58) * (TREE_POSITIONS.length - 1));
      const clampedIdx = Math.min(Math.max(treeIdx, 0), TREE_POSITIONS.length - 1);
      const baseYr     = TREE_POSITIONS[clampedIdx][1] + 0.07 + pseudoRand(i, 56) * 0.02;
      const perspScale = 0.6 + (xr - 0.50) / 0.58 * 0.6; // ← tambah ini
      const rawCy      = H * baseYr;
      if (rawCy > WATER_TOP) continue;

      const cx = W * Math.min(xr, 1.0) - W * 0.04;
      if (cx < W * 0.62) continue;

      const grassH  = H * 0.022 * perspScale * (0.8 + pseudoRand(i, 51) * 0.4);
      const grassW  = grassH * wAspect * (1.0 + pseudoRand(i, 52) * 0.5);
      const offsetY = pseudoRand(i, 53) * H * 0.008 + H * 0.003;
      const finalCy = Math.min(rawCy + offsetY, WATER_TOP);

      ctx.globalAlpha = 0.55 + pseudoRand(i, 54) * 0.30;
      ctx.drawImage(wideImg, cx - grassW / 2, finalCy - grassH, grassW, grassH);
    }
  }

  if (smallReady) {
    const sAspect = smallImg.naturalWidth / smallImg.naturalHeight;
    for (let i = 0; i < EXTRA_SMALL_COUNT; i++) {
      const xr         = 0.34 + pseudoRand(i, 60) * 0.72;
      const treeIdx    = Math.floor((xr - 0.58) / (0.997 - 0.58) * (TREE_POSITIONS.length - 1));
      const clampedIdx = Math.min(Math.max(treeIdx, 0), TREE_POSITIONS.length - 1);
      const baseYr     = TREE_POSITIONS[clampedIdx][1] + 0.07 + pseudoRand(i, 66) * 0.02;
      const perspScale = 0.5 + (xr - 0.48) / 0.62 * 0.6; // ← tambah ini
      const rawCy      = H * baseYr;
      if (rawCy > WATER_TOP) continue;

      const cx = W * Math.min(xr, 1.0) - W * 0.04;
      if (cx < W * 0.62) continue;

      const grassH  = H * 0.014 * perspScale * (0.7 + pseudoRand(i, 61) * 0.5);
      const grassW  = grassH * sAspect * (0.8 + pseudoRand(i, 62) * 0.5);
      const offsetX = (pseudoRand(i, 63) - 0.5) * W * 0.020;
      const offsetY = pseudoRand(i, 64) * H * 0.006;
      const finalCy = Math.min(rawCy + offsetY, WATER_TOP);

      ctx.globalAlpha = 0.50 + pseudoRand(i, 65) * 0.30;
      ctx.drawImage(smallImg, cx + offsetX - grassW / 2, finalCy - grassH, grassW, grassH);
    }
  }

  ctx.globalAlpha = 1.0;
  ctx.restore();
}

function drawGrassBackground(ctx, W, H) {
  const wideImg = getGrassWideImg();
  if (!wideImg.complete || wideImg.naturalWidth === 0) return;

  const pseudoRand = (i, offset = 0) => {
    const x = Math.sin(i * 127.1 + offset * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };

  const WATER_TOP = H * 0.725;
  const wAspect   = wideImg.naturalWidth / wideImg.naturalHeight;
  ctx.save();

  for (let i = 0; i < 20; i++) {
    const xr         = 0.52 + pseudoRand(i, 70) * 0.55;
    const perspScale = 0.5 + (xr - 0.52) / 0.55 * 0.4;
    const baseYr     = 0.73 - (xr - 0.52) * 0.20;
    const rawCy      = H * baseYr;
    if (rawCy > WATER_TOP) continue;

    const cx = W * Math.min(xr, 1.0);
    if (cx < W * 0.62) continue; // ← skip yang terlalu kiri

    const grassH  = H * 0.016 * perspScale * (0.8 + pseudoRand(i, 71) * 0.3);
    const grassW  = grassH * wAspect * (1.0 + pseudoRand(i, 72) * 0.4);
    const finalCy = Math.min(rawCy, WATER_TOP);

    ctx.globalAlpha = 0.35 + pseudoRand(i, 73) * 0.20;
    ctx.drawImage(wideImg, cx - grassW / 2, finalCy - grassH, grassW, grassH);
  }

  ctx.globalAlpha = 1.0;
  ctx.restore();
}

function drawForegroundLand(ctx, W, H) {
  const grad = ctx.createLinearGradient(0, H * 0.75, 0, H);
  grad.addColorStop(0, "#0a1a0d");
  grad.addColorStop(1, "#050d07");

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(W * 0.60, H * 0.88);
  ctx.bezierCurveTo(W * 0.73, H * 0.85, W * 0.76, H * 0.87, W * 0.80, H * 0.84);
  ctx.bezierCurveTo(W * 0.85, H * 0.81, W * 0.88, H * 0.83, W * 0.92, H * 0.79);
  ctx.bezierCurveTo(W * 0.95, H * 0.76, W * 0.98, H * 0.77, W * 1.00, H * 0.74);
  ctx.lineTo(W, H);
  ctx.lineTo(W * 0.91, H);
  ctx.bezierCurveTo(W * 0.82, H * 0.95, W * 0.76, H * 0.93, W * 0.72, H * 0.91);
  ctx.bezierCurveTo(W * 0.70, H * 0.89, W * 0.68, H * 0.89, W * 0.59, H * 0.88);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();
}

// ── Tambahkan fungsi ini setelah drawForegroundLand() ──

function drawForegroundGrass(ctx, W, H) {
  const wideImg  = getGrassWideImg();
  const smallImg = getGrassSmallImg();

  const wideReady  = wideImg.complete  && wideImg.naturalWidth  > 0;
  const smallReady = smallImg.complete && smallImg.naturalWidth > 0;
  if (!wideReady && !smallReady) return;

  const pseudoRand = (i, offset = 0) => {
    const x = Math.sin(i * 127.1 + offset * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };

  ctx.save();
  
  const fgAnchors = [
    { xr: 0.60, yr: 0.88 },
    { xr: 0.73, yr: 0.855 },
    { xr: 0.80, yr: 0.84 },
    { xr: 0.88, yr: 0.83 },
    { xr: 0.92, yr: 0.79 },
    { xr: 0.96, yr: 0.77 },
    { xr: 1.00, yr: 0.74 },
  ];

  function getFgY(xr) {
    if (xr <= fgAnchors[0].xr) return fgAnchors[0].yr * H;
    if (xr >= fgAnchors[fgAnchors.length - 1].xr) return fgAnchors[fgAnchors.length - 1].yr * H;
    for (let i = 0; i < fgAnchors.length - 1; i++) {
      const a = fgAnchors[i], b = fgAnchors[i + 1];
      if (xr >= a.xr && xr <= b.xr) {
        const t = (xr - a.xr) / (b.xr - a.xr);
        return (a.yr + t * (b.yr - a.yr)) * H;
      }
    }
    return 0.85 * H;
  }

  // Rumput besar (wideImg) di sepanjang tepi atas foreground
  if (wideReady) {
    const wAspect = wideImg.naturalWidth / wideImg.naturalHeight;
    const COUNT = 60;
    for (let i = 0; i < COUNT; i++) {
      const xr = 0.55 + pseudoRand(i, 200) * 0.50; // 0.55 → 1.05
      const perspScale = 0.9 + (xr - 0.55) * 0.4;  // makin ke kanan makin besar
      const baseY = getFgY(xr);

      const grassH  = H * 0.048 * perspScale * (0.8 + pseudoRand(i, 201) * 0.5);
      const grassW  = grassH * wAspect * (1.0 + pseudoRand(i, 202) * 0.5);
      const offsetX = (pseudoRand(i, 203) - 0.5) * W * 0.025;
      const offsetY = (pseudoRand(i, 204) - 0.3) * H * 0.012; // slight jitter vertikal
      const cx      = W * Math.min(xr, 1.0);
      const finalCy = baseY + offsetY;

      ctx.globalAlpha = 0.70 + pseudoRand(i, 205) * 0.30;
      ctx.drawImage(wideImg, cx + offsetX - grassW / 2, finalCy - grassH, grassW, grassH);
    }
  }

  // Rumput kecil (smallImg) sebagai isian di antara rumput besar
  if (smallReady) {
    const sAspect = smallImg.naturalWidth / smallImg.naturalHeight;
    const COUNT = 80;
    for (let i = 0; i < COUNT; i++) {
      const xr = 0.55 + pseudoRand(i, 210) * 0.50;
      const perspScale = 0.85 + (xr - 0.55) * 0.35;
      const baseY = getFgY(xr);

      const grassH  = H * 0.030 * perspScale * (0.7 + pseudoRand(i, 211) * 0.5);
      const grassW  = grassH * sAspect * (0.8 + pseudoRand(i, 212) * 0.5);
      const offsetX = (pseudoRand(i, 213) - 0.5) * W * 0.030;
      const offsetY = (pseudoRand(i, 214) - 0.2) * H * 0.015;
      const cx      = W * Math.min(xr, 1.0);
      const finalCy = baseY + offsetY;

      ctx.globalAlpha = 0.55 + pseudoRand(i, 215) * 0.35;
      ctx.drawImage(smallImg, cx + offsetX - grassW / 2, finalCy - grassH, grassW, grassH);
    }
  }

// ── Layer C: tengah foreground, jumlah dan ukuran ditambah ──
if (wideReady) {
  const wAspect = wideImg.naturalWidth / wideImg.naturalHeight;
  const COUNT = 80; // dinaikkan dari 50
  for (let i = 0; i < COUNT; i++) {
    const xr = 0.75 + pseudoRand(i, 230) * 0.28;
    const perspScale = 1.0 + (xr - 0.75) * 0.4;
    const baseY = getFgY(xr) + H * (0.04 + (xr - 0.75) * 0.08 + pseudoRand(i, 231) * 0.03);

    const grassH  = H * 0.035 * perspScale * (0.8 + pseudoRand(i, 232) * 0.4); // digedein dari 0.025
    const grassW  = grassH * wAspect * (1.0 + pseudoRand(i, 233) * 0.5);
    const offsetX = (pseudoRand(i, 234) - 0.5) * W * 0.025;
    const cx      = W * Math.min(xr, 1.0);

    ctx.globalAlpha = 0.60 + pseudoRand(i, 235) * 0.30;
    ctx.drawImage(wideImg, cx + offsetX - grassW / 2, baseY - grassH, grassW, grassH);
  }
}

if (smallReady) {
  const sAspect = smallImg.naturalWidth / smallImg.naturalHeight;
  const COUNT = 100; // dinaikkan dari 70
  for (let i = 0; i < COUNT; i++) {
    const xr = 0.75 + pseudoRand(i, 240) * 0.28;
    const perspScale = 0.95 + (xr - 0.75) * 0.35;
    const baseY = getFgY(xr) + H * (0.04 + (xr - 0.75) * 0.08 + pseudoRand(i, 241) * 0.03);

    const grassH  = H * 0.022 * perspScale * (0.7 + pseudoRand(i, 242) * 0.5); // digedein dari 0.016
    const grassW  = grassH * sAspect * (0.8 + pseudoRand(i, 243) * 0.5);
    const offsetX = (pseudoRand(i, 244) - 0.5) * W * 0.030;
    const cx      = W * Math.min(xr, 1.0);

    ctx.globalAlpha = 0.50 + pseudoRand(i, 245) * 0.35;
    ctx.drawImage(smallImg, cx + offsetX - grassW / 2, baseY - grassH, grassW, grassH);
  }
}

// ── Layer D: dikurangin, geser kanan, kurang melengkung ──
if (wideReady) {
  const wAspect = wideImg.naturalWidth / wideImg.naturalHeight;
  const COUNT = 35; // dikurangin dari 60
  for (let i = 0; i < COUNT; i++) {
    const xr = 0.89 + pseudoRand(i, 250) * 0.14;
    const perspScale = 1.3 + (xr - 0.85) * 0.7;
    // kurang melengkung: 0.25 dari sebelumnya 0.50
    const baseY = getFgY(xr) + H * (0.10 + (xr - 0.85) * 0.25 + pseudoRand(i, 251) * 0.04);

    const grassH  = H * 0.038 * perspScale * (0.8 + pseudoRand(i, 252) * 0.4);
    const grassW  = grassH * wAspect * (1.0 + pseudoRand(i, 253) * 0.5);
    const offsetX = (pseudoRand(i, 254) - 0.5) * W * 0.020;
    const cx      = W * Math.min(xr, 1.0);

    ctx.globalAlpha = 0.65 + pseudoRand(i, 255) * 0.30;
    ctx.drawImage(wideImg, cx + offsetX - grassW / 2, baseY - grassH, grassW, grassH);
  }
}

if (smallReady) {
  const sAspect = smallImg.naturalWidth / smallImg.naturalHeight;
  const COUNT = 45; // dikurangin dari 80
  for (let i = 0; i < COUNT; i++) {
    const xr = 0.89 + pseudoRand(i, 260) * 0.14;
    const perspScale = 1.2 + (xr - 0.85) * 0.6;
    const baseY = getFgY(xr) + H * (0.10 + (xr - 0.85) * 0.25 + pseudoRand(i, 261) * 0.04);

    const grassH  = H * 0.024 * perspScale * (0.7 + pseudoRand(i, 262) * 0.5);
    const grassW  = grassH * sAspect * (0.8 + pseudoRand(i, 263) * 0.5);
    const offsetX = (pseudoRand(i, 264) - 0.5) * W * 0.025;
    const cx      = W * Math.min(xr, 1.0);

    ctx.globalAlpha = 0.55 + pseudoRand(i, 265) * 0.35;
    ctx.drawImage(smallImg, cx + offsetX - grassW / 2, baseY - grassH, grassW, grassH);
  }
}

// ── Layer E: rumput tepi BAWAH foreground, mengikuti sisi kanan-bawah ──
if (wideReady) {
  const wAspect = wideImg.naturalWidth / wideImg.naturalHeight;
  const COUNT = 55;

  const fgBottomAnchors = [
    { xr: 0.59, yr: 0.88 },
    { xr: 0.72, yr: 0.91 },
    { xr: 0.76, yr: 0.93 },
    { xr: 0.82, yr: 0.95 },
    { xr: 0.91, yr: 0.98 },
    { xr: 1.00, yr: 1.00 },
  ];

  function getFgBottomY(xr) {
    if (xr <= fgBottomAnchors[0].xr) return fgBottomAnchors[0].yr * H;
    if (xr >= fgBottomAnchors[fgBottomAnchors.length - 1].xr) return fgBottomAnchors[fgBottomAnchors.length - 1].yr * H;
    for (let i = 0; i < fgBottomAnchors.length - 1; i++) {
      const a = fgBottomAnchors[i], b = fgBottomAnchors[i + 1];
      if (xr >= a.xr && xr <= b.xr) {
        const t = (xr - a.xr) / (b.xr - a.xr);
        return (a.yr + t * (b.yr - a.yr)) * H;
      }
    }
    return H;
  }

  for (let i = 0; i < COUNT; i++) {
    const xr = 0.55 + pseudoRand(i, 250) * 0.48;
    const perspScale = 0.9 + (xr - 0.55) * 1.2;
    const baseY = getFgBottomY(xr) + H * (-0.01 + pseudoRand(i, 251) * 0.015);

    const grassH = H * 0.045 * perspScale * (0.8 + pseudoRand(i, 272) * 0.4);
    const grassW = grassH * wAspect * (1.1 + pseudoRand(i, 273) * 0.5);
    const offsetX = (pseudoRand(i, 274) - 0.3) * W * 0.018;
    const cx = W * Math.min(xr, 1.0);

    ctx.save();
    ctx.translate(cx + offsetX, baseY);
    ctx.rotate(0.12 + pseudoRand(i, 275) * 0.10);
    ctx.globalAlpha = 0.70 + pseudoRand(i, 276) * 0.30;
    ctx.drawImage(wideImg, -grassW / 2, -grassH, grassW, grassH);
    ctx.restore();
  }
}

if (smallReady) {
  const sAspect = smallImg.naturalWidth / smallImg.naturalHeight;
  const COUNT = 70;

  const fgBottomAnchors = [
    { xr: 0.59, yr: 0.88 },
    { xr: 0.72, yr: 0.91 },
    { xr: 0.76, yr: 0.93 },
    { xr: 0.82, yr: 0.95 },
    { xr: 0.91, yr: 0.98 },
    { xr: 1.00, yr: 1.00 },
  ];

  function getFgBottomY(xr) {
    if (xr <= fgBottomAnchors[0].xr) return fgBottomAnchors[0].yr * H;
    if (xr >= fgBottomAnchors[fgBottomAnchors.length - 1].xr) return fgBottomAnchors[fgBottomAnchors.length - 1].yr * H;
    for (let i = 0; i < fgBottomAnchors.length - 1; i++) {
      const a = fgBottomAnchors[i], b = fgBottomAnchors[i + 1];
      if (xr >= a.xr && xr <= b.xr) {
        const t = (xr - a.xr) / (b.xr - a.xr);
        return (a.yr + t * (b.yr - a.yr)) * H;
      }
    }
    return H;
  }

  for (let i = 0; i < COUNT; i++) {
    const xr = 0.55 + pseudoRand(i, 260) * 0.48;
    const perspScale = 0.85 + (xr - 0.55) * 1.1;
    const baseY = getFgBottomY(xr) + H * (-0.01 + pseudoRand(i, 261) * 0.015);

    const grassH = H * 0.028 * perspScale * (0.7 + pseudoRand(i, 282) * 0.5);
    const grassW = grassH * sAspect * (0.9 + pseudoRand(i, 283) * 0.5);
    const offsetX = (pseudoRand(i, 284) - 0.3) * W * 0.015;
    const cx = W * Math.min(xr, 1.0);

    ctx.save();
    ctx.translate(cx + offsetX, baseY);
    ctx.rotate(0.10 + pseudoRand(i, 285) * 0.12);
    ctx.globalAlpha = 0.60 + pseudoRand(i, 286) * 0.30;
    ctx.drawImage(smallImg, -grassW / 2, -grassH, grassW, grassH);
    ctx.restore();
  }
}

  ctx.globalAlpha = 1.0;
  ctx.restore();
}


let _palmTreeImg = null;
function getPalmTreeImg() {
  if (_palmTreeImg) return _palmTreeImg;
  _palmTreeImg = new Image();
  _palmTreeImg.src = "data:image/png;base64," + PALM_TREE_B64;
  return _palmTreeImg;
}


function drawPalmTrees(ctx, W, H) {
  const palmImg   = getPalmTreeImg();
  const palmReady   = palmImg.complete   && palmImg.naturalWidth   > 0 && PALM_TREE_B64 !== "";

  ctx.save();

  if (palmReady) {
    const imgAspect = palmImg.naturalWidth / palmImg.naturalHeight;
    const palms = [
      { xr: 0.91, baseYr: 0.83, heightR: 0.72 },
      { xr: 0.97, baseYr: 0.86, heightR: 0.65 },
    ];

    for (const { xr, baseYr, heightR } of palms) {
      const treeH = H * heightR;
      const treeW = treeH * imgAspect;
      const cx    = W * xr;
      const by    = H * baseYr;

      ctx.save();
      ctx.translate(cx, by);
      ctx.rotate(-0.08);
      ctx.drawImage(palmImg, -treeW / 2, -treeH, treeW, treeH);
      ctx.restore();
    }
  }

  ctx.restore();
}

function drawCrescentMoon(ctx, W, H) {
  const cx = W * 0.78;
  const cy = H * 0.10;
  const r  = Math.min(W, H) * 0.034;

  ctx.save();

  // Glow luar — biru keputihan, lembut
  const glow = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * 4.0);
  glow.addColorStop(0,   "rgba(180,220,255,0.22)");
  glow.addColorStop(0.4, "rgba(160,200,255,0.10)");
  glow.addColorStop(1,   "rgba(140,180,255,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 4.0, 0, Math.PI * 2);
  ctx.fill();

  // Sabit: offscreen canvas cukup besar menampung kedua lingkaran
  const pad  = Math.ceil(r * 1.6);
  const size = Math.ceil(r * 2) + pad * 2;
  const oc   = document.createElement("canvas");
  oc.width   = size;
  oc.height  = size;
  const oc2  = oc.getContext("2d");

  const ocx = size / 2;
  const ocy = size / 2;

  // 1) Gambar lingkaran bulan penuh — putih kebiruan
  oc2.beginPath();
  oc2.arc(ocx, ocy, r, 0, Math.PI * 2);
  oc2.fillStyle = "rgba(220,238,255,0.95)";
  oc2.fill();

  // 2) Potong bagian yang bukan sabit
  oc2.globalCompositeOperation = "destination-out";
  oc2.beginPath();
  oc2.arc(ocx + r * 0.55, ocy - r * 0.08, r * 0.82, 0, Math.PI * 2);
  oc2.fillStyle = "rgba(0,0,0,1)";
  oc2.fill();

  // 3) Composite ke canvas utama
  ctx.drawImage(oc, cx - size / 2, cy - size / 2);

  ctx.restore();
}

// ── Precompute parameter pantulan aurora di air (poin 2) ──
// Semua nilai berikut (noiseSeed, patchSeed, wiggleSeed, dst) tidak bergantung
// pada t, jadi dihitung sekali saat resize, bukan tiap frame.
function buildAuroraReflectionSegments(W, H, waterTop, waterBottom) {
  const totalH = waterBottom - waterTop;
  const segmentsByBeam = [];

  for (const beam of auroraBeamDefs) {
    const bx      = beam.cx * W;
    const beamW   = beam.baseWidth * W * (beam.widthScale ?? 1.0);
    const beamH   = totalH * (beam.heightRatio ?? 0.5);
    const beamTop = waterTop + (beam.verticalOffset ?? 0) * totalH;
    const stripeH = 4;
    const steps   = Math.ceil(beamH / stripeH);
    const list    = [];

    for (let i = 0; i < steps; i++) {
      const y = beamTop + i * stripeH;
      if (y < waterTop || y > waterBottom) continue;

      const depthRatio = (y - beamTop) / beamH;
      const baseShape  = Math.pow(1.0 - depthRatio, 1.6);

      const noiseSeed = (i * 17 + beam.cx * 1000) % 100;
      const noise     = 0.5 + 0.5 * Math.abs(Math.sin(noiseSeed * 12.9898));
      const patchSeed = (i * 53 + beam.cx * 777) % 100;
      if (Math.sin(patchSeed * 4.531) <= -0.3) continue;

      const depthW     = beamW * baseShape * noise;
      const wiggleSeed = (i * 31 + beam.cx * 500) % 100;
      const wiggle     = Math.sin(wiggleSeed * 7.233) * beamW * 0.25;
      const cxStrip    = bx + wiggle;
      const depthAlpha = Math.max(0, 1.0 - depthRatio * 1.8);
      if (depthW < 0.5) continue;

      list.push({ y, depthW, cxStrip, depthAlpha });
    }
    segmentsByBeam.push({ color: beam.color, intensity: beam.intensity, list, stripeH });
  }
  return segmentsByBeam;
}

function drawAuroraWaterReflection(ctx, segmentsByBeam) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  for (const { color, intensity, list, stripeH } of segmentsByBeam) {
    const [r, g, b] = color;
    for (const { y, depthW, cxStrip, depthAlpha } of list) {
      const sg = ctx.createLinearGradient(cxStrip - depthW, y, cxStrip + depthW, y);
      sg.addColorStop(0.00, `rgba(${r},${g},${b},0.0)`);
      sg.addColorStop(0.30, `rgba(${r},${g},${b},${intensity * depthAlpha * 0.5})`);
      sg.addColorStop(0.50, `rgba(${r},${g},${b},${intensity * depthAlpha * 0.9})`);
      sg.addColorStop(0.70, `rgba(${r},${g},${b},${intensity * depthAlpha * 0.5})`);
      sg.addColorStop(1.00, `rgba(${r},${g},${b},0.0)`);

      ctx.fillStyle = sg;
      ctx.fillRect(cxStrip - depthW, y, depthW * 2, stripeH + 1);
    }
  }

  ctx.globalCompositeOperation = "source-over";
  ctx.restore();
}

function drawWater(ctx, W, H, t, sceneImage, auroraStarCanvas, starCanvas, auroraReflectionSegments) {
  const waterTop    = H * 0.74;
  const waterBottom = H;

  const valleyLeft  = W * 0.24;
  const valleyRight = W * 0.60;
  const valleyTop   = H * 0.632;

  ctx.save();

  ctx.beginPath();
  ctx.moveTo(0, waterBottom);
  ctx.lineTo(0, waterTop);
  ctx.lineTo(valleyLeft, waterTop);
  ctx.bezierCurveTo(valleyLeft + W * 0.04, waterTop, valleyLeft + W * 0.04, valleyTop, W * 0.30, valleyTop);
  ctx.quadraticCurveTo(W * 0.40, valleyTop - H * 0.004, W * 0.48, valleyTop);
  ctx.bezierCurveTo(valleyRight - W * 0.04, valleyTop, valleyRight - W * 0.04, waterTop, valleyRight, waterTop);
  ctx.lineTo(W, waterTop);
  ctx.lineTo(W, waterBottom);
  ctx.closePath();
  ctx.clip();

  const waterGrad = ctx.createLinearGradient(0, valleyTop, 0, waterBottom);
  waterGrad.addColorStop(0,    "rgba(45, 12, 85, 0.92)");
  waterGrad.addColorStop(0.25, "rgba(30,  8, 65, 0.95)");
  waterGrad.addColorStop(0.6,  "rgba(18,  4, 45, 0.97)");
  waterGrad.addColorStop(1,    "rgba(10,  2, 28, 1.0)");
  ctx.fillStyle = waterGrad;
  ctx.fillRect(0, valleyTop, W, waterBottom - valleyTop);

  // OPT #3: ganti strip-by-strip loop dengan satu drawImage flip + blur global.
  // Efek "gelombang" dipertahankan via vertical offset sinusoidal + horizontal skew ringan.
  if (sceneImage) {
    const waveOffsetY  = Math.sin(t * 2.0) * 5;   // gerak naik-turun seluruh refleksi
    const reflectStart = waterTop - H * 0.02;
    const reflectH     = waterBottom - reflectStart;
    ctx.save();
    ctx.beginPath(); ctx.rect(0, reflectStart, W, reflectH); ctx.clip();
    ctx.filter    = "blur(4px)";
    ctx.globalAlpha = 0.4;
    // flip vertikal di sekitar waterTop
    ctx.translate(0, waterTop * 2 - H * 0.15 + waveOffsetY);
    ctx.scale(1, -1);
    ctx.drawImage(sceneImage, 0, 0, W, H);
    ctx.filter  = "none";
    ctx.restore();
  }

  if (auroraStarCanvas) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.20;
    ctx.drawImage(starCanvas, 0, waterTop - H * 0.15, W, H * 1.15);
    ctx.restore();

    // OPT #3: ganti strip loop aurora dengan satu drawImage + blur, gerak sinusoidal global
    const auroraWaveY = Math.sin(t * 1.6 + 0.8) * 7;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.filter      = "blur(6px)";
    ctx.globalAlpha = 0.35;
    ctx.translate(0, auroraWaveY);
    ctx.drawImage(auroraStarCanvas, 0, waterTop - H * 0.15, W, H * 1.15);
    ctx.filter  = "none";
    ctx.restore();

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    for (let i = 0; i < 120; i++) {
      const x     = (i * 73) % W;
      const y     = waterTop + ((i * 137) % (waterBottom - waterTop));
      const r     = 0.3 + (((i * 17) % 100) / 100) * 1.4;
      const alpha = 0.09;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    }
    ctx.restore();
  }

  drawAuroraWaterReflection(ctx, auroraReflectionSegments);

  const totalH = waterBottom - waterTop;
  ctx.save();
  for (const ripple of rippleData) {
    const startX     = ripple.x * W;
    const localY     = waterTop + ripple.y * totalH;
    const rippleWidth = ripple.width * W;

    ctx.beginPath();
    for (let x = 0; x <= rippleWidth; x += 2) {
      const p    = x / rippleWidth;
      const wave = Math.sin(p * Math.PI * 2 + t * ripple.speed + ripple.phase) * ripple.amp;
      const fade = Math.sin(p * Math.PI);
      const y    = localY + wave * fade;
      if (x === 0) ctx.moveTo(startX + x, y);
      else          ctx.lineTo(startX + x, y);
    }
    ctx.strokeStyle = `rgba(220,220,255,${ripple.alpha})`;
    ctx.lineWidth   = 0.5 + ripple.alpha * 8;
    ctx.stroke();
  }
  ctx.restore();

  const moonX  = W * 0.78;
  const moonRY = waterTop + totalH * 0.08;
  const moonR  = Math.min(W, H) * 0.014;

  ctx.save();
  const moonGlow = ctx.createRadialGradient(moonX, moonRY, 0, moonX, moonRY, moonR * 5);
  moonGlow.addColorStop(0,   `rgba(255,248,200,${0.18 + Math.sin(t * 0.7) * 0.04})`);
  moonGlow.addColorStop(0.4, `rgba(255,240,180,${0.07 + Math.sin(t * 0.7) * 0.02})`);
  moonGlow.addColorStop(1,   "rgba(255,240,180,0)");
  ctx.fillStyle = moonGlow;
  ctx.beginPath(); ctx.arc(moonX, moonRY, moonR * 5, 0, Math.PI * 2); ctx.fill();

  const wobble = Math.sin(t * 0.8) * W * 0.006;
  ctx.save();
  ctx.scale(1, 0.28);
  ctx.beginPath();
  ctx.arc(moonX + wobble, moonRY / 0.28, moonR * 1.2, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255,248,200,${0.32 + Math.sin(t * 1.1) * 0.08})`;
  ctx.fill();
  ctx.restore();
  ctx.restore();

  ctx.save();
  const mistGrad = ctx.createLinearGradient(0, waterTop - H * 0.01, 0, waterTop + totalH * 0.12);
  mistGrad.addColorStop(0,   "rgba(100, 50, 160, 0)");
  mistGrad.addColorStop(0.4, "rgba(80,  35, 130, 0.18)");
  mistGrad.addColorStop(1,   "rgba(60,  20, 100, 0)");
  ctx.filter = "blur(8px)";
  ctx.fillStyle = mistGrad;
  ctx.fillRect(0, waterTop - H * 0.01, W, totalH * 0.14);
  ctx.filter = "none";
  ctx.restore();

  ctx.restore();
}

export default function App() {
  const canvasRef = useRef();
  const [dims, setDims] = React.useState({
    W: window.innerWidth,
    H: window.innerHeight,
  });

  useEffect(() => {
    const canvas = canvasRef.current;

    window.startAuroraRecording = (seconds = 10) => {
      const stream   = canvas.captureStream(60);
      const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" });
      const chunks   = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement("a");
        a.href = url; a.download = `aurora-${Date.now()}.webm`; a.click();
        URL.revokeObjectURL(url);
      };
      recorder.start();
      setTimeout(() => recorder.stop(), seconds * 1000);
    };

    let ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = window.innerWidth;
    let H = window.innerHeight;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = W + "px";
      canvas.style.height = H + "px";
      ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);

      offCanvas.width  = W; offCanvas.height = H;
      staticCanvas.width  = W; staticCanvas.height = H;
      auroraStarCanvas.width  = W; auroraStarCanvas.height = H;
      starCanvas.width  = W; starCanvas.height = H;
      foregroundCanvas.width  = W; foregroundCanvas.height = H;
      rayOffCanvas.width  = W; rayOffCanvas.height = H;

      // OPT #1: re-cache context setelah resize (resize invalidates old context)
      asCtx     = auroraStarCanvas.getContext("2d");
      offCtx    = offCanvas.getContext("2d");
      rayOffCtx = rayOffCanvas.getContext("2d");

      const sc = starCanvas.getContext("2d");
      sc.clearRect(0, 0, W, H);
      drawStars(sc, W, H);

      cachedRidgePoints = [
        mountainRidgeGreen(0.6, W, H),
        mountainRidgeYellow(0.6, W, H),
        mountainRidgeMagenta(0.0, W, H),
      ];
      staticDirty = true;
      foregroundDirty = true;
      auroraReflectionSegments = buildAuroraReflectionSegments(W, H, H * 0.74, H);
      setDims({ W: window.innerWidth, H: window.innerHeight });
    };

    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + "px";
    canvas.style.height = H + "px";
    ctx.scale(dpr, dpr);

    let cachedRidgePoints = [
      mountainRidgeGreen(0.6, W, H),
      mountainRidgeYellow(0.6, W, H),
      mountainRidgeMagenta(0.0, W, H),
    ];

    // Precompute pola pantulan aurora di air (poin 2) — sekali saja, bukan tiap frame.
    let auroraReflectionSegments = buildAuroraReflectionSegments(W, H, H * 0.74, H);

    const starCanvas = document.createElement("canvas");
    starCanvas.width = W; starCanvas.height = H;
    drawStars(starCanvas.getContext("2d"), W, H);

    const auroraStarCanvas = document.createElement("canvas");
    auroraStarCanvas.width = W; auroraStarCanvas.height = H;

    const staticCanvas = document.createElement("canvas");
    staticCanvas.width = W; staticCanvas.height = H;

    const offCanvas = document.createElement("canvas");
    offCanvas.width = W; offCanvas.height = H;

    const foregroundCanvas = document.createElement("canvas");
    foregroundCanvas.width = W; foregroundCanvas.height = H;

    // OPT #2: dedicated off-screen canvas untuk rays aurora (di-blur sekali)
    const rayOffCanvas = document.createElement("canvas");
    rayOffCanvas.width = W; rayOffCanvas.height = H;

    // OPT #1: cache semua context di luar loop animate
    let asCtx  = auroraStarCanvas.getContext("2d");
    let offCtx = offCanvas.getContext("2d");
    let rayOffCtx = rayOffCanvas.getContext("2d");

    let staticDirty = true;
    let foregroundDirty = true;

    function rebuildStatic() {
      const sCtx = staticCanvas.getContext("2d");
      sCtx.clearRect(0, 0, W, H);
      drawSkyGradient(sCtx, W, H);
      sCtx.drawImage(starCanvas, 0, 0);
      drawMountains(sCtx, W, H, cachedRidgePoints);
      drawHills(sCtx, W, H);
      staticDirty = false;
    }

    function allForegroundImagesReady() {
      return (
        getTreeImg().complete &&
        getGrassWideImg().complete &&
        getGrassSmallImg().complete &&
        getPalmTreeImg().complete
      );
    }

    function rebuildForeground() {
      const fCtx = foregroundCanvas.getContext("2d");
      fCtx.clearRect(0, 0, W, H);
      drawMountains(fCtx, W, H, cachedRidgePoints);
      drawHills(fCtx, W, H);
      drawTreeline(fCtx, W, H);
      drawGrassBackground(fCtx, W, H);
      drawGrass(fCtx, W, H);
      drawForegroundLand(fCtx, W, H);
      drawForegroundGrass(fCtx, W, H);
      drawPalmTrees(fCtx, W, H);
      drawCrescentMoon(fCtx, W, H);

      // Kalau ada aset gambar (tree/grass/palm) yang belum kelar load,
      // tetap tandai dirty supaya frame berikutnya coba rebuild lagi.
      foregroundDirty = !allForegroundImagesReady();
    }

    let lastFrame = 0;
    const TARGET_MS = 1000 / 60;

    let rafId;

    function animate(now) {
      rafId = requestAnimationFrame(animate);
      if (now - lastFrame < TARGET_MS) return;
      lastFrame = now;

      const t = now / 1000;
      if (staticDirty) rebuildStatic();
      if (foregroundDirty) rebuildForeground();

      // OPT #1: gunakan cached context (tidak panggil getContext tiap frame)
      asCtx.clearRect(0, 0, W, H);
      drawAurora(asCtx, W, H, t, rayOffCtx);

      offCtx.clearRect(0, 0, W, H);
      offCtx.drawImage(staticCanvas, 0, 0);
      offCtx.drawImage(auroraStarCanvas, 0, 0);
      drawWater(offCtx, W, H, t, staticCanvas, auroraStarCanvas, starCanvas, auroraReflectionSegments);
      offCtx.drawImage(foregroundCanvas, 0, 0);

      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(offCanvas, 0, 0, W, H);
    }

    rafId = requestAnimationFrame(animate);

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const personH = dims.H * 0.48;
  const personW = personH * 0.5;
  const px = dims.W * 0.76;
  const py = dims.H * 0.91;

  return (
    <>
      <button
        onClick={() => window.startAuroraRecording(15)}
        style={{ position: "fixed", top: 20, right: 20, zIndex: 9999,
          background: "rgba(100,50,180,0.7)", color: "#fff", border: "none",
          borderRadius: 8, padding: "8px 16px", cursor: "pointer" }}
      >
        ⏺ Record Aurora
      </button>
      <canvas
        ref={canvasRef}
        style={{ position: "fixed", top: 0, left: 0,
          width: "100vw", height: "100vh", zIndex: 1 }}
      />
            {PERSON_GIF_B64 !== "" && (
        <img
          src={`data:image/gif;base64,${PERSON_GIF_B64}`}
          style={{
            position: "fixed",
            left: `${px - personW / 2}px`,
            top: `${py - personH}px`,
            width: `${personW}px`,
            height: `${personH}px`,
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
      )}
    </>
  );
}
