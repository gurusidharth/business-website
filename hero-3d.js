import * as THREE from "three";

const stage = document.getElementById("hero3dStage");
if (stage && window.WebGLRenderingContext) {
  try {
    initHero3D(stage);
  } catch (err) {
    console.warn("Hero 3D scene failed to start:", err);
  }
}

function initHero3D(stage) {
  const canvas = document.createElement("canvas");
  canvas.className = "hero-3d-canvas";
  stage.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 6.2);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  function size() {
    const w = stage.clientWidth, h = stage.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  const group = new THREE.Group();
  scene.add(group);

  // Wireframe icosahedron core
  const coreGeo = new THREE.IcosahedronGeometry(1.55, 1);
  const coreMat = new THREE.MeshBasicMaterial({ color: 0x5aa2ff, wireframe: true, transparent: true, opacity: 0.55 });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  // Glowing points on the same vertices
  const pointsGeo = new THREE.IcosahedronGeometry(1.55, 1);
  const pointsMat = new THREE.PointsMaterial({ color: 0x9fd8ff, size: 0.05, transparent: true, opacity: 0.95, sizeAttenuation: true });
  const points = new THREE.Points(pointsGeo, pointsMat);
  group.add(points);

  // A tighter inner core for depth
  const innerGeo = new THREE.IcosahedronGeometry(0.85, 0);
  const innerMat = new THREE.MeshBasicMaterial({ color: 0x7a5cff, wireframe: true, transparent: true, opacity: 0.4 });
  const inner = new THREE.Mesh(innerGeo, innerMat);
  group.add(inner);

  // Two tilted orbit rings
  const ringGeo = new THREE.TorusGeometry(2.5, 0.008, 8, 128);
  const ring1 = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0x8f6bff, transparent: true, opacity: 0.55 }));
  ring1.rotation.x = Math.PI / 2.3;
  group.add(ring1);

  const ring2 = new THREE.Mesh(ringGeo.clone(), new THREE.MeshBasicMaterial({ color: 0x55e1ff, transparent: true, opacity: 0.5 }));
  ring2.rotation.x = -Math.PI / 3.2;
  ring2.rotation.y = Math.PI / 5;
  group.add(ring2);

  // Scattered dust particles for depth
  const dustCount = 140;
  const dustPositions = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    const r = 3.2 + Math.random() * 2.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    dustPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    dustPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    dustPositions[i * 3 + 2] = r * Math.cos(phi);
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.022, transparent: true, opacity: 0.4 }));
  scene.add(dust);

  let targetX = 0, targetY = 0, curX = 0, curY = 0;
  const onMove = e => {
    const rect = stage.getBoundingClientRect();
    targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  };
  window.addEventListener("pointermove", onMove);

  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let raf;
  function animate(t) {
    raf = requestAnimationFrame(animate);
    curX += (targetX - curX) * 0.04;
    curY += (targetY - curY) * 0.04;

    if (!reduceMotion) {
      group.rotation.y += 0.0018;
      group.rotation.x = Math.sin(t * 0.00018) * 0.12 + curY * 0.22;
      group.rotation.y += curX * 0.0005;
      inner.rotation.y -= 0.003;
      inner.rotation.x += 0.0015;
      ring1.rotation.z += 0.0016;
      ring2.rotation.z -= 0.0012;
      dust.rotation.y += 0.00035;
    }
    renderer.render(scene, camera);
  }

  size();
  raf = requestAnimationFrame(animate);

  const ro = new ResizeObserver(size);
  ro.observe(stage);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(animate);
  });
}
