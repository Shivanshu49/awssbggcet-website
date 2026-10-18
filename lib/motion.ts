// Shared rules for decorative animation loops: pause when nobody can see
// them, and skip them entirely for users who asked for reduced motion.

// Calls onChange(true) while el is on screen in a visible tab, onChange(false) otherwise.
export function watchVisibility(el: Element, onChange: (visible: boolean) => void) {
  let onScreen = false;
  const update = () => onChange(onScreen && !document.hidden);
  const io = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    update();
  });
  io.observe(el);
  document.addEventListener("visibilitychange", update);
  return () => {
    io.disconnect();
    document.removeEventListener("visibilitychange", update);
  };
}

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
