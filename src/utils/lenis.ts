import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

export function setLenisInstance(instance: Lenis | null) {
  lenisInstance = instance;
}

export function getLenis() {
  return lenisInstance;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);

  if (!el) return;

  if (lenisInstance) {
    lenisInstance.scrollTo(el, {
      offset: 0,
      duration: 2.5,
    });
    return;
  }

  el.scrollIntoView({
    behavior: 'smooth',
  });
}
