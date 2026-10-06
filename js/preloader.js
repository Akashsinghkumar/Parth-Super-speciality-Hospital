
(function() {
  'use strict';

  // Configurable preloader settings
  const CONFIG = {
    title: 'PARTH SUPERSPECIALITY HOSPITAL',
    tagline: 'Compassionate Care Meets Medical Excellence',
    logoSrc: 'assets/images/logo-parth.png',
    logoAlt: 'Parth Superspeciality Hospital Logo',
    displayDelay: 500, // 0.5s (.5 sec) snappy delay so user doesn't wait too long
    fadeDuration: 600, // ms for fade-out CSS animation
    maxTimeout: 2000   // Safety fallback in case window.load takes long
  };

  // Preloader Template Generator
  function createPreloaderTemplate() {
    return `
  <div id="preloader" class="preloader">
    <div class="preloader-content">
      <div class="preloader-logo-ring">
        <div class="preloader-logo-disc">
          <img src="${CONFIG.logoSrc}" alt="${CONFIG.logoAlt}" class="preloader-logo" />
        </div>
        <div class="pulse-ring"></div>
        <div class="pulse-ring delay"></div>
      </div>
      <div class="heartbeat-line">
        <svg viewBox="0 0 300 60" preserveAspectRatio="none">
          <path class="ecg-path" d="M0,30 L70,30 L80,10 L90,50 L100,20 L110,40 L120,30 L160,30 L170,5 L180,55 L190,20 L200,40 L210,30 L300,30" />
        </svg>
      </div>
      <h2 class="preloader-title">${CONFIG.title}</h2>
      <p class="preloader-tagline">${CONFIG.tagline}</p>
    </div>
  </div>`;
  }

  // Inject Preloader into DOM
  function injectPreloader() {
    let preloader = document.getElementById('preloader');
    if (!preloader) {
      if (document.body) {
        document.body.insertAdjacentHTML('afterbegin', createPreloaderTemplate());
        preloader = document.getElementById('preloader');
      }
    }
    return preloader;
  }

  // Preloader Lifecycle Management
  function initPreloader() {
    const preloader = injectPreloader();
    if (!preloader) return;

    // If navigated directly to a section hash, dismiss immediately
    if (window.location.hash) {
      preloader.classList.add('fade-out');
      preloader.style.display = 'none';
      return;
    }

    let isDismissed = false;
    function dismiss() {
      if (isDismissed) return;
      isDismissed = true;
      setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, CONFIG.fadeDuration);
      }, CONFIG.displayDelay);
    }

    if (document.readyState === 'complete') {
      dismiss();
    } else {
      window.addEventListener('load', dismiss);
      setTimeout(dismiss, CONFIG.maxTimeout);
    }
  }

  // Initialize immediately or upon DOM readiness
  if (document.body) {
    initPreloader();
  } else {
    document.addEventListener('DOMContentLoaded', initPreloader);
  }

  // Expose global controller
  window.ParthPreloader = {
    init: initPreloader,
    config: CONFIG
  };
})();
