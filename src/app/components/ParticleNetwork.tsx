import { useEffect, useRef } from 'react';

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
}

/** Lightweight canvas background. Any active app window can become a network anchor. */
export default function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const pointer = { x: -1000, y: -1000, active: false };
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastTime = 0;
    let nodes: NodePoint[] = [];
    let dpr = 1;

    const buildNodes = () => {
      const spacing = width < 680 ? 110 : 86;
      const count = Math.min(170, Math.max(24, Math.floor((width * height) / (spacing * spacing))));
      nodes = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        radius: 1.35 + Math.random() * 1.15,
        phase: index * 0.7,
      }));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNodes();
      draw(0, true);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer) return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };
    const onPointerLeave = () => { pointer.active = false; };

    const getWindowAnchors = () => {
      const rects = Array.from(document.querySelectorAll<HTMLElement>('[data-floating-window="true"]'))
        .filter((element) => !element.dataset.minimized && element.getAttribute('aria-hidden') !== 'true')
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return [
            { x: rect.left + rect.width * 0.5, y: rect.top },
            { x: rect.left + rect.width, y: rect.top + rect.height * 0.5 },
            { x: rect.left + rect.width * 0.5, y: rect.bottom },
            { x: rect.left, y: rect.top + rect.height * 0.5 },
          ];
        });
      return rects.flat();
    };

    const draw = (time: number, staticFrame = false) => {
      if (document.hidden) {
        frame = 0;
        return;
      }
      const delta = Math.min((time - (lastTime || time)) / 16.67, 2.4);
      lastTime = time;
      context.clearRect(0, 0, width, height);
      const anchors = getWindowAnchors();
      const limit = width < 680 ? 112 : 132;
      const cursorRadius = 165;
      for (const node of nodes) {
        if (!staticFrame && !reducedMotion) {
          node.x += node.vx * delta;
          node.y += node.vy * delta;
          if (node.x < -10) node.x = width + 10;
          if (node.x > width + 10) node.x = -10;
          if (node.y < -10) node.y = height + 10;
          if (node.y > height + 10) node.y = -10;
        }
        if (pointer.active && !reducedMotion) {
          const dx = node.x - pointer.x;
          const dy = node.y - pointer.y;
          const distance = Math.hypot(dx, dy) || 1;
          if (distance < cursorRadius) {
            const force = (1 - distance / cursorRadius) * 0.026 * delta;
            node.vx += (-dx / distance) * force;
            node.vy += (-dy / distance) * force;
          }
        }
        node.vx *= 0.999;
        node.vy *= 0.999;
      }

      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        let nearestWindowDistance = Infinity;
        for (const anchor of anchors) {
          const distance = Math.hypot(a.x - anchor.x, a.y - anchor.y);
          nearestWindowDistance = Math.min(nearestWindowDistance, distance);
          if (distance < 170) {
            context.beginPath();
            context.moveTo(a.x, a.y);
            context.lineTo(anchor.x, anchor.y);
            context.strokeStyle = `rgba(65, 111, 158, ${(1 - distance / 170) * 0.36})`;
            context.lineWidth = 1.05;
            context.stroke();
          }
        }
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance < limit) {
            const alpha = (1 - distance / limit) * 0.34;
            context.beginPath();
            context.moveTo(a.x, a.y);
            context.lineTo(b.x, b.y);
            context.strokeStyle = `rgba(91, 111, 134, ${alpha})`;
            context.lineWidth = 0.9;
            context.stroke();
          }
        }
        const nearCursor = pointer.active && Math.hypot(a.x - pointer.x, a.y - pointer.y) < cursorRadius;
        const nearWindow = nearestWindowDistance < 180;
        context.beginPath();
        context.arc(a.x, a.y, nearCursor || nearWindow ? a.radius + 1.0 : a.radius, 0, Math.PI * 2);
        context.fillStyle = nearCursor ? 'rgba(48, 105, 164, 0.98)' : nearWindow ? 'rgba(63, 111, 160, 0.86)' : 'rgba(82, 103, 127, 0.69)';
        context.fill();
      }
      if (!staticFrame && !reducedMotion) frame = window.requestAnimationFrame(draw);
    };

    const onVisibilityChange = () => {
      if (document.hidden && frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      } else if (!document.hidden && !frame && !reducedMotion) {
        lastTime = 0;
        frame = window.requestAnimationFrame(draw);
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibilityChange);
    resize();
    if (!reducedMotion) frame = window.requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />;
}
