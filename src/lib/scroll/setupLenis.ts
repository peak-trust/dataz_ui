import Lenis from '@studio-freight/lenis';

let lenisInstance: Lenis | null = null;

export function setupLenis(): Lenis {
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time: number) {
    if (lenisInstance) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
  }

  if (typeof window !== 'undefined') {
    requestAnimationFrame(raf);
  }

  return lenisInstance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function destroyLenis() {
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}

