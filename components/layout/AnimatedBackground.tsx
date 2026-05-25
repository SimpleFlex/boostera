"use client";

import { useEffect, useRef, useState } from "react";

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    let animationId: number;
    let particles: Particle[] = [];
    let gridLines: GridLine[] = [];
    
    // Particle class for glowing dots
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      alpha: number;
      pulse: number;
      pulseSpeed: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.alpha = Math.random() * 0.5 + 0.3;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulse += this.pulseSpeed;
        
        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }
      
      draw(ctx: CanvasRenderingContext2D, time: number) {
        const glowSize = this.size + Math.sin(this.pulse) * 1;
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowSize * 2);
        gradient.addColorStop(0, `rgba(96, 165, 250, ${this.alpha + Math.sin(this.pulse) * 0.1})`);
        gradient.addColorStop(1, `rgba(96, 165, 250, 0)`);
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, glowSize * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167, 139, 250, ${this.alpha + 0.2})`;
        ctx.fill();
      }
    }
    
    // Grid line for network effect
    class GridLine {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      alpha: number;
      
      constructor(x1: number, y1: number, x2: number, y2: number) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.alpha = Math.random() * 0.15 + 0.05;
      }
      
      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.strokeStyle = `rgba(96, 165, 250, ${this.alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
    
    // Large glowing orbs that float
    class GlowingOrb {
      x: number;
      y: number;
      radius: number;
      color: string;
      speedX: number;
      speedY: number;
      phase: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 200 + 150;
        const colors = [
          "rgba(59, 130, 246, 0.08)",
          "rgba(139, 92, 246, 0.08)",
          "rgba(236, 72, 153, 0.06)",
          "rgba(16, 185, 129, 0.06)"
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.speedX = (Math.random() - 0.5) * 0.05;
        this.speedY = (Math.random() - 0.5) * 0.05;
        this.phase = Math.random() * Math.PI * 2;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.phase += 0.005;
        
        // Wrap around
        if (this.x < -this.radius) this.x = canvas.width + this.radius;
        if (this.x > canvas.width + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = canvas.height + this.radius;
        if (this.y > canvas.height + this.radius) this.y = -this.radius;
      }
      
      draw(ctx: CanvasRenderingContext2D) {
        const pulse = Math.sin(this.phase) * 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + pulse, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }
    
    // Shooting star effect
    class ShootingStar {
      x: number;
      y: number;
      length: number;
      speed: number;
      alpha: number;
      active: boolean;
      
      constructor() {
        this.reset();
      }
      
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = 0;
        this.length = Math.random() * 80 + 40;
        this.speed = Math.random() * 5 + 3;
        this.alpha = Math.random() * 0.6 + 0.2;
        this.active = true;
      }
      
      update() {
        if (!this.active) return;
        
        this.x += this.speed;
        this.y += this.speed * 0.5;
        
        if (this.x > canvas.width + 100 || this.y > canvas.height + 100) {
          this.active = false;
          // Random chance to respawn
          if (Math.random() < 0.01) {
            this.reset();
          }
        }
      }
      
      draw(ctx: CanvasRenderingContext2D) {
        if (!this.active) return;
        
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x - this.length, this.y - this.length * 0.5);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.alpha})`);
        gradient.addColorStop(1, `rgba(96, 165, 250, 0)`);
        
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.length, this.y - this.length * 0.5);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
    
    let orbs: GlowingOrb[] = [];
    let shootingStars: ShootingStar[] = [];
    
    function init() {
      const particleCount = isMobile ? 60 : 120;
      particles = [];
      orbs = [];
      shootingStars = [];
      
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
      
      for (let i = 0; i < 3; i++) {
        orbs.push(new GlowingOrb());
      }
      
      for (let i = 0; i < 3; i++) {
        shootingStars.push(new ShootingStar());
      }
      
      // Create grid lines
      gridLines = [];
      const spacing = 80;
      for (let x = 0; x < canvas.width; x += spacing) {
        for (let y = 0; y < canvas.height; y += spacing) {
          if (x + spacing < canvas.width) {
            gridLines.push(new GridLine(x, y, x + spacing, y));
          }
          if (y + spacing < canvas.height) {
            gridLines.push(new GridLine(x, y, x, y + spacing));
          }
        }
      }
    }
    
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    }
    
    let time = 0;
    
    function animate() {
      time++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Deep space gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#0a0a0f");
      gradient.addColorStop(0.5, "#0f0f1a");
      gradient.addColorStop(1, "#050508");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw orbs
      orbs.forEach(orb => {
        orb.update();
        orb.draw(ctx);
      });
      
      // Draw grid lines (subtle)
      gridLines.forEach(line => line.draw(ctx));
      
      // Draw shooting stars
      shootingStars.forEach(star => {
        star.update();
        star.draw(ctx);
      });
      
      // Draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx, time);
      });
      
      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(96, 165, 250, ${0.05 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      
      animationId = requestAnimationFrame(animate);
    }
    
    resizeCanvas();
    animate();
    
    window.addEventListener("resize", resizeCanvas);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isMobile]);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-20"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
