'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { CMSData } from '@/lib/cms';

export default function HeroSection({ data }: { data: CMSData['homepage'] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [mouse, setMouse] = useState<{ x: number | null, y: number | null }>({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    const particles: any[] = [];
    const particleCount = 80;
    const maxDistance = 150;

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    class Particle {
      x: number; y: number; vx: number; vy: number; radius: number;
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDistance) {
            const angle = Math.atan2(dy, dx);
            this.vx = Math.cos(angle) * 1.5;
            this.vy = Math.sin(angle) * 1.5;
          }
        }
      }
      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx!.fillStyle = 'rgba(74, 117, 194, 0.6)';
        ctx!.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    let animationFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.update();
        p.draw();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(74, 117, 194, ${0.2 * (1 - dist / maxDistance)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, [mouse]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const r = canvasRef.current.getBoundingClientRect();
    setMouse({
      x: e.clientX - r.left,
      y: e.clientY - r.top
    });
  };

  const handleMouseLeave = () => setMouse({ x: null, y: null });

  return (
    <section 
      id="home" 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[92vh] flex items-center overflow-hidden bg-[var(--bg)]"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 dark:bg-blue-400/10 blur-[120px] animate-pulse-glow" />
        <div className="absolute top-[40%] -right-[10%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 dark:bg-cyan-400/15 blur-[100px] animate-pulse-glow" style={{ animationDuration: '10s' }} />
      </div>
      
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full opacity-40 dark:opacity-60" 
      />

      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-8 pt-28 pb-12 w-full z-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="animate-p2m-reveal">
            <div className="inline-flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-full px-3 py-1 text-[10px] font-bold tracking-widest text-[var(--brand)] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="uppercase">{data.eyebrow || 'Solusi ICT Terintegrasi'}</span>
            </div>
            
            <h1 className="mt-6 text-[42px] sm:text-[52px] lg:text-[68px] font-extrabold leading-[0.9] tracking-tight text-[var(--brand)]">
              <span>{data.headline || 'Dukung'}</span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                {data.headlineAccent || 'Bisnis Anda'}
              </span>{' '}
              <span>{data.headlineSuffix || 'dengan ICT'}</span>
            </h1>
            
            <p className="mt-6 max-w-xl text-[18px] leading-relaxed text-[var(--text-soft)]">
              {data.description || 'Menghadirkan solusi ICT terintegrasi untuk membantu pendidikan, pemerintahan, dan enterprise menjadi lebih terkoneksi, aman, dan efisien.'}
            </p>
            
            <div className="mt-8 flex flex-wrap gap-3">
              {data.primaryCtaText && (
                <Link 
                  href={data.primaryCtaLink || '#contact'} 
                  className="bg-blue-700 dark:bg-cyan-600 text-white dark:text-gray-950 px-8 py-4 rounded-full text-xs font-extrabold tracking-widest hover:brightness-110 transition shadow-lg uppercase inline-flex items-center gap-2"
                >
                  {data.primaryCtaText} <i className="ri-arrow-right-line" />
                </Link>
              )}
              {data.secondaryCtaText && (
                <Link 
                  href={data.secondaryCtaLink || '#solutions'} 
                  className="bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text)] px-8 py-4 rounded-full text-xs font-extrabold tracking-widest hover:bg-[var(--bg-soft)] transition uppercase"
                >
                  {data.secondaryCtaText}
                </Link>
              )}
            </div>
          </div>

          <div className="relative animate-p2m-reveal" style={{ animationDelay: '200ms' }}>
            <div className="relative rounded-[32px] overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] shadow-2xl group">
              <Image 
                src={data.heroImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1100&q=80'}
                alt="Enterprise ICT"
                width={1100}
                height={440}
                className="w-full h-[440px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              
              <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-2 z-10">
                {(data.heroBadges || ['AI', 'IoT', 'SECURITY', 'NETWORK', 'DATA', 'SMART']).map((badge, i) => {
                  const text = typeof badge === 'string' ? badge : badge.text;
                  return (
                    <span key={i} className="backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 text-white text-[10px] font-bold py-2 px-1 text-center rounded-xl uppercase tracking-tighter">
                      {text}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
