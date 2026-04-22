import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface GlobeCanvasProps {
  className?: string;
}

export function GlobeCanvas({ className }: GlobeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getBlue = () => {
      // First try inline style (set by TweaksPanel), then CSS var, then fallback
      const portfolioEl = document.querySelector('[data-portfolio]') as HTMLElement | null;
      if (portfolioEl?.style.getPropertyValue('--blue').trim()) {
        return portfolioEl.style.getPropertyValue('--blue').trim();
      }
      if (portfolioEl) {
        const fromEl = getComputedStyle(portfolioEl).getPropertyValue('--blue').trim();
        if (fromEl) return fromEl;
      }
      return '#95B8F8';
    };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 3.2;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const s = Math.max(1, Math.min(r.width, r.height));
      if (s > 0) renderer.setSize(s, s, false);
    };
    // Defer initial size read — parent may not be laid out yet on first paint
    requestAnimationFrame(() => {
      resize();
      renderer.render(scene, camera);
    });
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const group = new THREE.Group();
    scene.add(group);

    const color = new THREE.Color(getBlue());
    const R = 1;
    const LAT = 14;
    const LON = 22;
    const SEG = 96;

    const matLat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.55 });
    const matLon = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.35 });
    const matEq  = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.90 });

    for (let i = 1; i < LAT; i++) {
      const phi = Math.PI * i / LAT;
      const y = Math.cos(phi) * R;
      const r = Math.sin(phi) * R;
      const pts: THREE.Vector3[] = [];
      for (let j = 0; j <= SEG; j++) {
        const t = (j / SEG) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r));
      }
      const mat = i === LAT / 2 ? matEq : matLat;
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
    }

    for (let i = 0; i < LON; i++) {
      const th = (i / LON) * Math.PI * 2;
      const pts: THREE.Vector3[] = [];
      for (let j = 0; j <= SEG; j++) {
        const phi = (j / SEG) * Math.PI;
        pts.push(new THREE.Vector3(
          Math.sin(phi) * Math.cos(th) * R,
          Math.cos(phi) * R,
          Math.sin(phi) * Math.sin(th) * R,
        ));
      }
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), matLon));
    }

    const dotCount = 900;
    const candidates = 2400;
    const dotPos = new Float32Array(dotCount * 3);

    const landmass = (lat: number, lon: number) => {
      const f1 = Math.sin(lat * 2 + 0.5) * Math.cos(lon * 1.3);
      const f2 = Math.sin(lat * 3 - 1.2) * Math.sin(lon * 2.1 + 0.7);
      const f3 = Math.cos(lat * 1.6 + 0.9) * Math.cos(lon * 0.9 - 0.4);
      return f1 + f2 * 0.6 + f3 * 0.5;
    };

    let idx = 0;
    const phi0 = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < candidates && idx < dotCount; i++) {
      const y = 1 - (i / (candidates - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi0 * i;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      const lat = Math.asin(y);
      const lon = Math.atan2(z, x);
      if (landmass(lat, lon) > 0.25 + (Math.random() - 0.5) * 0.2) {
        dotPos[idx * 3 + 0] = x * 1.005;
        dotPos[idx * 3 + 1] = y * 1.005;
        dotPos[idx * 3 + 2] = z * 1.005;
        idx++;
      }
    }

    const dotGeom = new THREE.BufferGeometry();
    dotGeom.setAttribute('position', new THREE.BufferAttribute(dotPos.slice(0, idx * 3), 3));
    const dotMat = new THREE.PointsMaterial({
      color, size: 0.018, sizeAttenuation: true, transparent: true, opacity: 0.95,
    });
    group.add(new THREE.Points(dotGeom, dotMat));

    group.rotation.z = -0.41;

    let rafId: number;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      group.rotation.y += dt * 0.18;

      const c = new THREE.Color(getBlue());
      matLat.color.copy(c);
      matLon.color.copy(c);
      matEq.color.copy(c);
      dotMat.color.copy(c);

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      width={500}
      height={500}
      style={{ display: 'block' }}
    />
  );
}
