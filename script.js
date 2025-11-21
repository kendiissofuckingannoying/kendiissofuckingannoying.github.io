// Timestamp
const ts = document.getElementById('timestamp');
const formatTime = (d) =>
  `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
ts.textContent = formatTime(new Date());

// Tabs with URL hash routing
const tabs = Array.from(document.querySelectorAll('.tab'));
const panels = Array.from(document.querySelectorAll('.panel'));

const setActive = (name) => {
  tabs.forEach(t => {
    const active = t.id === `tab-${name}`;
    t.classList.toggle('is-active', active);
    t.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  panels.forEach(p => p.classList.toggle('is-active', p.id === `panel-${name}`));
};

const initial = location.hash.replace('#', '') || 'apps';
setActive(initial);
tabs.forEach(t => {
  t.addEventListener('click', () => {
    const name = t.id.replace('tab-', '');
    history.replaceState(null, '', `#${name}`);
    setActive(name);
  });
});

// Keyboard accessibility for tabs
document.querySelector('.tabs').addEventListener('keydown', (e) => {
  const i = tabs.findIndex(t => t.classList.contains('is-active'));
  if (e.key === 'ArrowRight') tabs[(i + 1) % tabs.length].click();
  if (e.key === 'ArrowLeft') tabs[(i - 1 + tabs.length) % tabs.length].click();
});

// Theme toggle with persistence
const toggleTheme = document.getElementById('toggleTheme');
const PREF_KEY = 'nyx-theme';

const applyTheme = (mode) => {
  document.body.classList.toggle('theme-dark', mode === 'dark');
  document.body.classList.toggle('theme-light', mode === 'light');
  toggleTheme.textContent = mode === 'dark' ? 'Dark' : 'Light';
  localStorage.setItem(PREF_KEY, mode);
};

applyTheme(localStorage.getItem(PREF_KEY) || 'dark');

toggleTheme.addEventListener('click', () => {
  const isDark = document.body.classList.contains('theme-dark');
  const next = isDark ? 'light' : 'dark';
  applyTheme(next);
});

// Reduce motion preference
const reducedMotion = document.getElementById('prefReducedMotion');

const applyMotionPref = () => {
  const reduce = reducedMotion.checked;
  document.documentElement.style.setProperty('scroll-behavior', reduce ? 'auto' : 'smooth');
  document.body.style.setProperty('--panelIn-duration', reduce ? '0ms' : '420ms');
};

reducedMotion.addEventListener('change', applyMotionPref);
applyMotionPref();

// Optional: Vanta Fog background
let vantaInstance = null;
const prefParallax = document.getElementById('prefParallax');

const initVanta = () => {
  try {
    if (vantaInstance && vantaInstance.destroy) vantaInstance.destroy();
    if (!prefParallax.checked || typeof VANTA === 'undefined') return;
    vantaInstance = VANTA.FOG({
      el: '#vanta-bg',
      highlightColor: 0x92ffd9,
      midtoneColor: 0x6ae3ff,
      lowlightColor: 0x0b0d12,
      baseColor: 0x0b0d12,
      blurFactor: 0.6,
      speed: 1.2,
      zoom: 0.9,
    });
  } catch (e) {}
};
initVanta();
prefParallax.addEventListener('change', initVanta);

// Magnetic buttons interaction
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const r = btn.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 6;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 6;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// Optional: mobile haptics
const prefHaptics = document.getElementById('prefHaptics');
document.addEventListener('click', () => {
  if (!prefHaptics.checked) return;
  if (navigator.vibrate) navigator.vibrate(8);
});
