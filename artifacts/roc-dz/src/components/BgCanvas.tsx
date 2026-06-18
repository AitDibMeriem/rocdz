import { useEffect, useRef } from "react";

export function BgCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    let width = 0, height = 0;

    interface Particle {
      x: number; y: number;
      size: number;
      speedX: number; speedY: number;
      opacity: number;
    }
    interface Wave {
      y: number; amplitude: number;
      frequency: number; speed: number; phase: number;
    }

    let particles: Particle[] = [];
    let waves: Wave[] = [];

    function resize() {
      width = canvas!.width = window.innerWidth;
      height = canvas!.height = window.innerHeight;
    }

    function init() {
      resize();
      particles = [];
      waves = [];
      for (let i = 0; i < 80; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
      for (let i = 0; i < 3; i++) {
        waves.push({
          y: height * 0.3 + i * 150,
          amplitude: 50 + i * 20,
          frequency: 0.002 + i * 0.001,
          speed: 0.01 + i * 0.005,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function drawWave(wave: Wave, time: number) {
      ctx.beginPath();
      ctx.moveTo(0, wave.y);
      for (let x = 0; x < width; x += 2) {
        const y = wave.y + Math.sin(x * wave.frequency + time * wave.speed + wave.phase) * wave.amplitude;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(184,41,221,0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    const mouse = { x: -9999, y: -9999 };
    const onMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onMouseLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    function animate(time: number) {
      ctx.clearRect(0, 0, width, height);
      waves.forEach(w => drawWave(w, time * 0.001));
      particles.forEach(p => {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 120;
        if (dist < repelRadius && dist > 0) {
          const force = (repelRadius - dist) / repelRadius;
          p.x += (dx / dist) * force * 3;
          p.y += (dy / dist) * force * 3;
        }
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        const nearMouse = dist < repelRadius;
        ctx.beginPath();
        ctx.arc(p.x, p.y, nearMouse ? p.size * 1.8 : p.size, 0, Math.PI * 2);
        ctx.fillStyle = nearMouse
          ? `rgba(233,30,140,${Math.min(1, p.opacity * 2)})`
          : `rgba(233,30,140,${p.opacity})`;
        ctx.fill();
      });
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x, dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(184,41,221,${(1 - dist / 120) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(animate);
    }

    init();
    animId = requestAnimationFrame(animate);
    window.addEventListener("resize", init);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
