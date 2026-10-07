/**
 * Parth Hospital - Custom Color Picker
 * Reference: Cybron style - colorwheel icon, 3 color pickers, live apply
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'parth-custom-colors';

  // Fixed Hospital Theme (Dark Teal - good contrast for white nav text)
  // This is the RESET default - always comes back to this
  const HOSPITAL_THEME = {
    primary: '#0d8a82',   // Darker Teal (header - white text clearly visible)
    secondary: '#1a7fc7', // Medical Blue (accent, buttons)
    dark: '#1a2d4a'       // Deep Navy (text, dark elements)
  };

  // DEFAULTS same as hospital theme
  const DEFAULTS = { ...HOSPITAL_THEME };

  let currentColors = { ...DEFAULTS };
  let activePicker = null; // 'primary' | 'secondary' | 'dark'
  let isDragging = false;

  /* ── Load saved colors ─────────────────────────────── */
  function loadColors() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        currentColors = { ...HOSPITAL_THEME, ...parsed };
      } else {
        // First load - use hospital theme
        currentColors = { ...HOSPITAL_THEME };
      }
    } catch (e) {
      currentColors = { ...HOSPITAL_THEME };
    }
  }

  function saveColors() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentColors));
    } catch (e) {}
  }

  /* ── Apply colors to CSS variables ─────────────────── */
  function applyColors(colors) {
    const root = document.documentElement;
    // Core variables
    root.style.setProperty('--primary-green', colors.primary);
    root.style.setProperty('--primary-color', colors.primary);
    root.style.setProperty('--coral-peach', colors.secondary);
    root.style.setProperty('--accent-color', colors.secondary);
    root.style.setProperty('--coral-hover', shadeColor(colors.secondary, -15));
    root.style.setProperty('--dark-green-1', shadeColor(colors.primary, 20));
    root.style.setProperty('--dark-green-2', shadeColor(colors.primary, 10));
    root.style.setProperty('--dark-green-deep', shadeColor(colors.primary, -10));
    root.style.setProperty('--text-dark', colors.dark);
    root.style.setProperty('--light-Background', colors.dark);

    // Force override header (has !important in CSS) - SKIP: header is fixed
    // Header is intentionally fixed to match footer - do not change with color picker
  }

  /* ── Shade a hex color ──────────────────────────────── */
  function shadeColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + percent * 2.55));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + percent * 2.55));
    const b = Math.min(255, Math.max(0, (num & 0xff) + percent * 2.55));
    return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
  }

  /* ── HSV <-> RGB conversions ────────────────────────── */
  function hsvToRgb(h, s, v) {
    h = h / 360;
    let r, g, b;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const diff = max - min;
    let h = 0, s = 0, v = max;
    if (diff !== 0) {
      s = diff / max;
      if (max === r) h = ((g - b) / diff) % 6;
      else if (max === g) h = (b - r) / diff + 2;
      else h = (r - g) / diff + 4;
      h = Math.round(h * 60);
      if (h < 0) h += 360;
    }
    return [h, s, v];
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 0, 0];
  }

  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
  }

  /* ── Build full UI ──────────────────────────────────── */
  function buildUI() {
    const root = document.createElement('div');
    root.id = 'ccp-root';
    root.innerHTML = `
      <!-- Toggle Button -->
      <button id="ccp-toggle" aria-label="Open color picker">
        <svg width="26" height="26" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="20" r="12" fill="#e74c3c"/>
          <circle cx="75" cy="38" r="12" fill="#e67e22"/>
          <circle cx="80" cy="65" r="12" fill="#f1c40f"/>
          <circle cx="62" cy="84" r="12" fill="#2ecc71"/>
          <circle cx="38" cy="84" r="12" fill="#1abc9c"/>
          <circle cx="20" cy="65" r="12" fill="#3498db"/>
          <circle cx="25" cy="38" r="12" fill="#9b59b6"/>
          <circle cx="50" cy="50" r="10" fill="#fff"/>
        </svg>
      </button>

      <!-- Panel -->
      <div id="ccp-panel">
        <button id="ccp-close" aria-label="Close">✕</button>
        <div id="ccp-wheel-icon">
          <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="20" r="12" fill="#e74c3c"/>
            <circle cx="75" cy="38" r="12" fill="#e67e22"/>
            <circle cx="80" cy="65" r="12" fill="#f1c40f"/>
            <circle cx="62" cy="84" r="12" fill="#2ecc71"/>
            <circle cx="38" cy="84" r="12" fill="#1abc9c"/>
            <circle cx="20" cy="65" r="12" fill="#3498db"/>
            <circle cx="25" cy="38" r="12" fill="#9b59b6"/>
            <circle cx="50" cy="50" r="10" fill="#fff"/>
          </svg>
        </div>
        <p id="ccp-label">Try your<br>colors</p>

        <div id="ccp-circles">
          <button class="ccp-circle" data-key="primary" title="Primary Color (Header)" style="background:${currentColors.primary}"></button>
          <button class="ccp-circle" data-key="secondary" title="Accent Color (Buttons)" style="background:${currentColors.secondary}"></button>
          <button class="ccp-circle" data-key="dark" title="Dark Color (Text)" style="background:${currentColors.dark}"></button>
        </div>

        <button id="ccp-reset">↺ Hospital Theme</button>
      </div>

      <!-- Color Picker Popup -->
      <div id="ccp-picker-popup">
        <div id="ccp-gradient-box">
          <canvas id="ccp-gradient-canvas"></canvas>
          <div id="ccp-gradient-cursor"></div>
        </div>
        <div id="ccp-hue-slider-wrap">
          <canvas id="ccp-hue-canvas"></canvas>
          <div id="ccp-hue-cursor"></div>
        </div>
        <div id="ccp-hex-row">
          <span id="ccp-hex-preview"></span>
          <input id="ccp-hex-input" type="text" maxlength="7" placeholder="#000000"/>
          <button id="ccp-hex-apply">Apply</button>
        </div>
      </div>
    `;
    document.body.appendChild(root);
  }

  /* ── Picker state ───────────────────────────────────── */
  let pickerHue = 180;
  let pickerSat = 0.5;
  let pickerVal = 0.8;

  function renderGradient() {
    const canvas = document.getElementById('ccp-gradient-canvas');
    if (!canvas) return;
    canvas.width = canvas.offsetWidth || 188;
    canvas.height = canvas.offsetHeight || 160;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;

    // Base hue color
    const [r, g, b] = hsvToRgb(pickerHue, 1, 1);
    const baseColor = `rgb(${r},${g},${b})`;

    // White → hue gradient (left to right)
    const gradH = ctx.createLinearGradient(0, 0, w, 0);
    gradH.addColorStop(0, '#fff');
    gradH.addColorStop(1, baseColor);
    ctx.fillStyle = gradH;
    ctx.fillRect(0, 0, w, h);

    // Transparent → black gradient (top to bottom)
    const gradV = ctx.createLinearGradient(0, 0, 0, h);
    gradV.addColorStop(0, 'rgba(0,0,0,0)');
    gradV.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = gradV;
    ctx.fillRect(0, 0, w, h);

    updateGradientCursor();
    updateHexPreview();
  }

  function renderHue() {
    const canvas = document.getElementById('ccp-hue-canvas');
    if (!canvas) return;
    canvas.width = canvas.offsetWidth || 188;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    [0, 60, 120, 180, 240, 300, 360].forEach(s => {
      const [r, g, b] = hsvToRgb(s, 1, 1);
      grad.addColorStop(s / 360, `rgb(${r},${g},${b})`);
    });
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, 16);
    updateHueCursor();
  }

  function updateGradientCursor() {
    const canvas = document.getElementById('ccp-gradient-canvas');
    const cursor = document.getElementById('ccp-gradient-cursor');
    if (!canvas || !cursor) return;
    const x = pickerSat * canvas.width;
    const y = (1 - pickerVal) * canvas.height;
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
  }

  function updateHueCursor() {
    const canvas = document.getElementById('ccp-hue-canvas');
    const cursor = document.getElementById('ccp-hue-cursor');
    if (!canvas || !cursor) return;
    cursor.style.left = (pickerHue / 360) * (canvas.width || 188) + 'px';
    cursor.style.top = '50%';
  }

  function updateHexPreview() {
    const [r, g, b] = hsvToRgb(pickerHue, pickerSat, pickerVal);
    const hex = rgbToHex(r, g, b);
    const preview = document.getElementById('ccp-hex-preview');
    const input = document.getElementById('ccp-hex-input');
    if (preview) preview.style.background = hex;
    if (input) input.value = hex;
    return hex;
  }

  function getCurrentPickerHex() {
    const [r, g, b] = hsvToRgb(pickerHue, pickerSat, pickerVal);
    return rgbToHex(r, g, b);
  }

  function setPickerFromHex(hex) {
    const [r, g, b] = hexToRgb(hex);
    const [h, s, v] = rgbToHsv(r, g, b);
    pickerHue = h;
    pickerSat = s;
    pickerVal = v;
  }

  function openPicker(key) {
    activePicker = key;
    setPickerFromHex(currentColors[key]);

    const popup = document.getElementById('ccp-picker-popup');
    popup.classList.add('visible');

    setTimeout(() => {
      renderGradient();
      renderHue();
    }, 10);
  }

  function closePicker() {
    const popup = document.getElementById('ccp-picker-popup');
    popup.classList.remove('visible');
    activePicker = null;
  }

  function applyPickerColor() {
    if (!activePicker) return;
    const hex = getCurrentPickerHex();
    currentColors[activePicker] = hex;

    // Update circle
    const circle = document.querySelector(`.ccp-circle[data-key="${activePicker}"]`);
    if (circle) circle.style.background = hex;

    applyColors(currentColors);
    saveColors();
  }

  /* ── Bind gradient canvas events ───────────────────── */
  function bindGradientEvents() {
    const canvas = document.getElementById('ccp-gradient-canvas');
    if (!canvas) return;

    function pickFromGradient(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      pickerSat = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      pickerVal = Math.min(1, Math.max(0, 1 - (clientY - rect.top) / rect.height));
      renderGradient();
      applyPickerColor();
    }

    canvas.addEventListener('mousedown', e => { isDragging = true; pickFromGradient(e); });
    canvas.addEventListener('touchstart', e => { isDragging = true; pickFromGradient(e); }, { passive: true });
    document.addEventListener('mousemove', e => { if (isDragging && activePicker) pickFromGradient(e); });
    document.addEventListener('touchmove', e => { if (isDragging && activePicker) pickFromGradient(e); }, { passive: true });
    document.addEventListener('mouseup', () => { isDragging = false; });
    document.addEventListener('touchend', () => { isDragging = false; });
  }

  /* ── Bind hue slider events ─────────────────────────── */
  function bindHueEvents() {
    const canvas = document.getElementById('ccp-hue-canvas');
    if (!canvas) return;

    function pickHue(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      pickerHue = Math.min(360, Math.max(0, ((clientX - rect.left) / rect.width) * 360));
      renderGradient();
      renderHue();
      applyPickerColor();
    }

    canvas.addEventListener('mousedown', e => { isDragging = true; pickHue(e); });
    canvas.addEventListener('touchstart', e => { isDragging = true; pickHue(e); }, { passive: true });
    document.addEventListener('mousemove', e => { if (isDragging) pickHue(e); });
    document.addEventListener('touchmove', e => { if (isDragging) pickHue(e); }, { passive: true });
  }

  /* ── Init ───────────────────────────────────────────── */
  function init() {
    loadColors();
    buildUI();
    applyColors(currentColors);

    // Toggle panel
    document.getElementById('ccp-toggle').addEventListener('click', () => {
      document.getElementById('ccp-panel').classList.toggle('visible');
      closePicker();
    });

    // Close panel
    document.getElementById('ccp-close').addEventListener('click', () => {
      document.getElementById('ccp-panel').classList.remove('visible');
      closePicker();
    });

    // Circle click → open picker
    document.querySelectorAll('.ccp-circle').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-key');
        if (activePicker === key && document.getElementById('ccp-picker-popup').classList.contains('visible')) {
          closePicker();
        } else {
          openPicker(key);
        }
      });
    });

    // Hex input apply
    document.getElementById('ccp-hex-apply').addEventListener('click', () => {
      const val = document.getElementById('ccp-hex-input').value.trim();
      if (/^#[0-9a-fA-F]{6}$/.test(val)) {
        setPickerFromHex(val);
        renderGradient();
        renderHue();
        applyPickerColor();
      }
    });

    document.getElementById('ccp-hex-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('ccp-hex-apply').click();
    });

    // Reset → always goes back to Hospital Theme (Light Blue)
    document.getElementById('ccp-reset').addEventListener('click', () => {
      currentColors = { ...HOSPITAL_THEME };
      applyColors(currentColors);
      saveColors();
      document.querySelectorAll('.ccp-circle').forEach(btn => {
        btn.style.background = currentColors[btn.getAttribute('data-key')];
      });
      closePicker();
    });

    // Bind canvas events after DOM ready
    setTimeout(() => {
      bindGradientEvents();
      bindHueEvents();
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
