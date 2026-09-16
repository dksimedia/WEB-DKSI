"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface HeroProps {
  data: {
    eyebrow?: string;
    headline: string;
    headlineAccent?: string;
    headlineSuffix?: string;
    description: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    heroImage?: string;
    heroBadges?: Array<{ text: string; color?: string }>;
  };
}

export default function HeroSection({ data }: HeroProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles();
    };

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
    }

    const initParticles = () => {
      particles = [];
      const particleCount = 80;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          alpha: Math.random() * 0.5 + 0.5,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // Mouse interaction
        const dx = mousePos.x - p.x;
        const dy = mousePos.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          const force = (150 - distance) / 150;
          p.vx -= (dx / distance) * force * 0.02;
          p.vy -= (dy / distance) * force * 0.02;
        }

        // Boundary check
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(26, 54, 93, ${p.alpha})`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (dist2 < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(26, 54, 93, ${0.3 * (1 - dist2 / 150)})`;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isClient, mousePos]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  if (!isClient) return null;

  return (
    <section id="home" className="relative min-h-[92vh] pt-28 pb-12 overflow-hidden">
      {/* Canvas particle background */}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[rgba(255,255,255,0.6)] to-[rgba(255,255,255,1)] dark:from-[rgba(7,7,7,0.7)] dark:to-[rgba(7,7,7,1)]" />

      <div className="relative z-10 container mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="space-y-8 text-center lg:text-left">
            {data.eyebrow && (
              <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-bold tracking-wider uppercase">
                {data.eyebrow}
              </span>
            )}

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
              {data.headline}
              {data.headlineAccent && (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
                  {data.headlineAccent}
                </span>
              )}
              {data.headlineSuffix}
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0">
              {data.description}
            </p>

            {/* Badges */}
            {data.heroBadges && data.heroBadges.length > 0 && (
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {data.heroBadges.map((badge, i) => (
                  <div
                    key={i}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium border",
                      badge.color === "blue" && "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300",
                      badge.color === "green" && "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300",
                      badge.color === "purple" && "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300",
                      badge.color === "orange" && "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300",
                      badge.color === "red" && "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300",
                      badge.color === "cyan" && "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300",
                      (!badge.color || ["blue", "green", "purple", "orange", "red", "cyan"].includes(badge.color)) &&
                        "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                    )}
                  >
                    {badge.text}
                  </div>
                ))}
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href={data.primaryCtaLink || "#"}
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-300 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                {data.primaryCtaText}
              </Link>
              {data.secondaryCtaText && data.secondaryCtaLink && (
                <Link
                  href={data.secondaryCtaLink}
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-full transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  {data.secondaryCtaText}
                </Link>
              )}
            </div>
          </div>

          {/* Hero image */}
          <div className="relative mx-auto lg:ml-auto max-w-md lg:max-w-full">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-600/20 dark:shadow-blue-600/10 aspect-[4/3] group">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 group-hover:opacity-75 transition-opacity duration-500" />
              
              <Image
                src={data.heroImage || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop"}
                alt="Hero illustration"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
