import React, { useEffect, useRef } from 'react';

interface FluidBackgroundProps {
  variant: 'login' | 'investor' | 'broker';
}

interface Node {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  depth: number; // 0.2 (far) to 1.0 (near) for parallax
  color: string;
  shape: 'circle' | 'diamond' | 'cross';
  alpha: number;
  pulseSpeed: number;
  pulsePhase: number;
}

export const FluidBackground: React.FC<FluidBackgroundProps> = ({ variant }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = window.innerWidth;
    let height = window.innerHeight;

    const setupCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    setupCanvasSize();

    // Mouse tracking with smooth interpolation
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;
    let mouseMoved = false;

    // Scroll tracking with velocity
    let scrollY = window.scrollY || 0;
    let targetScrollY = scrollY;
    let lastScrollY = scrollY;
    let scrollVelocity = 0;

    // Primary palette
    const isInvestor = variant === 'investor';
    const isLogin = variant === 'login';

    const goldColor = '#C9A24D';
    const steelColor = '#94A3AE';

    // Generate sharp constellation nodes
    const nodeCount = isLogin ? 65 : isInvestor ? 75 : 55;
    const nodes: Node[] = [];

    const initNodes = () => {
      nodes.length = 0;
      for (let i = 0; i < nodeCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const depth = 0.25 + Math.random() * 0.75; // parallax depth
        const isGold = isInvestor
          ? Math.random() > 0.3
          : isLogin
          ? Math.random() > 0.45
          : Math.random() > 0.75;

        nodes.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: depth > 0.7 ? 2.5 : depth > 0.4 ? 1.8 : 1.2,
          depth,
          color: isGold ? goldColor : steelColor,
          shape: Math.random() > 0.65 ? 'diamond' : Math.random() > 0.5 ? 'cross' : 'circle',
          alpha: 0.25 + Math.random() * 0.5,
          pulseSpeed: 0.0015 + Math.random() * 0.002,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    initNodes();

    const handleResize = () => {
      setupCanvasSize();
      initNodes();
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
      mouseMoved = true;
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY || 0;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min(time - lastTime, 40);
      lastTime = time;

      // Smooth interpolation for mouse and scroll
      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      const prevScroll = scrollY;
      scrollY += (targetScrollY - scrollY) * 0.08;
      scrollVelocity = (scrollY - prevScroll) * 0.8;

      // Clear sharp background without any blur
      ctx.clearRect(0, 0, width, height);

      // --- SECTION 1: ELEGANT SHARP GEOMETRIC GRID & HORIZON LINES (SCROLL & HOVER REACTIVE) ---
      if (!isLogin) {
        // Grid spacing that reacts subtly to scroll
        const gridStepY = 56;
        const gridStepX = 140;

        // Interactive scroll offset for parallax grid
        const gridScrollOffsetY = (scrollY * 0.35) % gridStepY;

        ctx.lineWidth = 1;

        // Subtle horizontal latitude lines across the screen with parallax shift
        for (let y = -gridStepY; y < height + gridStepY; y += gridStepY) {
          const currentY = y - gridScrollOffsetY;

          // React to mouse proximity: line bends subtly towards cursor when near
          const dy = mouseY - currentY;
          const distY = Math.abs(dy);

          ctx.beginPath();
          ctx.strokeStyle =
            distY < 80 && isInvestor
              ? `rgba(201, 162, 77, ${0.12 + (1 - distY / 80) * 0.15})`
              : 'rgba(255, 255, 255, 0.035)';

          // Draw sharp line across screen
          ctx.moveTo(0, currentY);
          ctx.lineTo(width, currentY);
          ctx.stroke();

          // Subtle measurement ticks along the horizontal line
          for (let x = 60; x < width; x += gridStepX) {
            const dx = mouseX - x;
            const dist = Math.hypot(dx, dy);

            // Tick height expands slightly when cursor is near
            const isNear = dist < 120;
            const tickH = isNear ? 5 : 2.5;

            // Vertical measurement ticks (opacity reduced by 50%)
            ctx.beginPath();
            ctx.strokeStyle = isNear && isInvestor ? 'rgba(201, 162, 77, 0.225)' : 'rgba(255, 255, 255, 0.035)';
            ctx.moveTo(x, currentY - tickH);
            ctx.lineTo(x, currentY + tickH);
            ctx.stroke();

            // Near cursor: draw sharp micro-crosshair
            if (isNear && dist < 70 && isInvestor) {
              ctx.beginPath();
              ctx.strokeStyle = 'rgba(201, 162, 77, 0.7)';
              ctx.moveTo(x - 4, currentY);
              ctx.lineTo(x + 4, currentY);
              ctx.stroke();
            }
          }
        }
      } else {
        // LOGIN & ADMIN MODE: Sharp geometric matrix & diamond grid background
        const step = 80;
        ctx.lineWidth = 1;

        // Vertical lines with 50% reduced opacity (from 0.025 to 0.0125)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.0125)';
        for (let x = 0; x < width; x += step) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }

        // Horizontal lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
        for (let y = 0; y < height; y += step) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Interactive intersection highlights near cursor
        for (let x = 0; x < width; x += step) {
          for (let y = 0; y < height; y += step) {
            const dx = mouseX - x;
            const dy = mouseY - y;
            const dist = Math.hypot(dx, dy);
            if (dist < 140) {
              const alpha = (1 - dist / 140) * 0.4;
              ctx.fillStyle = `rgba(201, 162, 77, ${alpha})`;
              ctx.fillRect(x - 1, y - 1, 3, 3);
            }
          }
        }
      }

      // --- SECTION 2: INTERACTIVE CONSTELLATION NODES ---
      const maxLineDistance = isLogin ? 120 : 130;
      const mouseInfluenceRadius = isLogin ? 180 : 200;

      // Update node positions with drift, scroll parallax, and mouse interaction
      nodes.forEach((node) => {
        node.baseX += node.vx * (dt / 16);
        node.baseY += node.vy * (dt / 16);

        // Wrap around boundaries
        if (node.baseX < 0) node.baseX = width;
        if (node.baseX > width) node.baseX = 0;
        if (node.baseY < 0) node.baseY = height;
        if (node.baseY > height) node.baseY = 0;

        // Apply scroll offset with depth parallax
        const parallaxScroll = (scrollY * node.depth * 0.45) % height;
        let renderedY = node.baseY - parallaxScroll;
        if (renderedY < 0) renderedY += height;
        if (renderedY > height) renderedY -= height;

        // Velocity stretch effect from rapid scrolling
        if (Math.abs(scrollVelocity) > 0.5) {
          renderedY += scrollVelocity * node.depth * 1.5;
        }

        // Mouse hover interaction: gentle spring attraction/repulsion
        const dx = mouseX - node.baseX;
        const dy = mouseY - renderedY;
        const dist = Math.hypot(dx, dy);

        let finalX = node.baseX;
        let finalY = renderedY;

        if (dist < mouseInfluenceRadius && dist > 0) {
          const force = (1 - dist / mouseInfluenceRadius) * 24 * node.depth;
          finalX += (dx / dist) * force;
          finalY += (dy / dist) * force;
        }

        node.x = finalX;
        node.y = finalY;

        // Dynamic pulsing alpha (sharp, no blur)
        node.pulsePhase += node.pulseSpeed * dt;
        const pulse = (Math.sin(node.pulsePhase) + 1) / 2;
        const currentAlpha = 0.25 + pulse * 0.45;

        // Draw node
        ctx.fillStyle = node.color;
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 1;

        const isHighlighted = dist < mouseInfluenceRadius;
        const nodeAlpha = isHighlighted
          ? Math.min(1, currentAlpha + (1 - dist / mouseInfluenceRadius) * 0.5)
          : currentAlpha * (node.depth * 0.8 + 0.2);

        ctx.globalAlpha = nodeAlpha;

        if (node.shape === 'diamond') {
          // Sharp diamond
          const r = node.radius * (isHighlighted ? 1.4 : 1.0);
          ctx.beginPath();
          ctx.moveTo(node.x, node.y - r);
          ctx.lineTo(node.x + r, node.y);
          ctx.lineTo(node.x, node.y + r);
          ctx.lineTo(node.x - r, node.y);
          ctx.closePath();
          ctx.fill();
        } else if (node.shape === 'cross') {
          // Sharp precision cross
          const r = node.radius * (isHighlighted ? 1.5 : 1.1);
          ctx.beginPath();
          ctx.moveTo(node.x - r, node.y);
          ctx.lineTo(node.x + r, node.y);
          ctx.moveTo(node.x, node.y - r);
          ctx.lineTo(node.x, node.y + r);
          ctx.stroke();
        } else {
          // Sharp circle
          const r = node.radius * (isHighlighted ? 1.3 : 1.0);
          ctx.beginPath();
          ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = 1.0;
      });

      // --- SECTION 3: CRISP CONSTELLATION INTERCONNECTING VECTORS ---
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];

          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxLineDistance) {
            // Distance between midpoint and mouse
            const midX = (n1.x + n2.x) / 2;
            const midY = (n1.y + n2.y) / 2;
            const distToMouse = Math.hypot(mouseX - midX, mouseY - midY);

            const isMouseNear = distToMouse < mouseInfluenceRadius;
            const baseAlpha = (1 - dist / maxLineDistance) * 0.12;
            const hoverBonus = isMouseNear ? (1 - distToMouse / mouseInfluenceRadius) * 0.28 : 0;

            const totalAlpha = baseAlpha + hoverBonus;

            if (totalAlpha > 0.02) {
              ctx.beginPath();
              ctx.strokeStyle =
                isMouseNear && (isInvestor || isLogin)
                  ? `rgba(201, 162, 77, ${totalAlpha})`
                  : `rgba(148, 163, 174, ${totalAlpha * 0.8})`;
              ctx.moveTo(n1.x, n1.y);
              ctx.lineTo(n2.x, n2.y);
              ctx.stroke();
            }
          }
        }
      }

      // --- SECTION 4: MOUSE HOVER RAYS & TARGETING RETICLE (INTERACTIVE TO HOVER) ---
      if (mouseMoved) {
        // Find 5 closest nodes to mouse and draw crisp laser rays
        const sortedNodes = [...nodes]
          .map((n) => ({ node: n, dist: Math.hypot(mouseX - n.x, mouseY - n.y) }))
          .filter((item) => item.dist < mouseInfluenceRadius)
          .sort((a, b) => a.dist - b.dist)
          .slice(0, 5);

        sortedNodes.forEach(({ node, dist }) => {
          const alpha = (1 - dist / mouseInfluenceRadius) * 0.4;
          ctx.beginPath();
          ctx.strokeStyle =
            isInvestor || isLogin
              ? `rgba(201, 162, 77, ${alpha})`
              : `rgba(148, 163, 174, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(mouseX, mouseY);
          ctx.lineTo(node.x, node.y);
          ctx.stroke();

          // Small indicator ring around connected node
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 3, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(201, 162, 77, ${alpha * 0.7})`;
          ctx.stroke();
        });

        // Sharp Precision Coordinate Reticle tracking the mouse
        const reticleRadius = 16;
        const tickLength = 5;

        ctx.save();
        ctx.strokeStyle = isInvestor || isLogin ? 'rgba(201, 162, 77, 0.4)' : 'rgba(148, 163, 174, 0.35)';
        ctx.lineWidth = 1;

        // Center reticle ring
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, reticleRadius, 0, Math.PI * 2);
        ctx.stroke();

        // 4 crosshair ticks
        ctx.beginPath();
        // Top
        ctx.moveTo(mouseX, mouseY - reticleRadius - tickLength);
        ctx.lineTo(mouseX, mouseY - reticleRadius + 2);
        // Bottom
        ctx.moveTo(mouseX, mouseY + reticleRadius - 2);
        ctx.lineTo(mouseX, mouseY + reticleRadius + tickLength);
        // Left
        ctx.moveTo(mouseX - reticleRadius - tickLength, mouseY);
        ctx.lineTo(mouseX - reticleRadius + 2, mouseY);
        // Right
        ctx.moveTo(mouseX + reticleRadius - 2, mouseY);
        ctx.lineTo(mouseX + reticleRadius + tickLength, mouseY);
        ctx.stroke();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [variant]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
