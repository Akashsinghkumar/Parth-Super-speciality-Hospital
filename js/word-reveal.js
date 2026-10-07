/**
 * Word Reveal On Scroll Animation
 * Reveals headings word-by-word with smooth slide up & fade on scroll
 * Optimized for both Desktop and Mobile devices across all pages
 */
(function () {
  'use strict';

  const SELECTORS = [
    'h1.hero-title',
    'h2.section-title',
    'h2.section-title-dark',
    'h2.section-title-light',
    'h2.patient-review-main-title',
    'h2.dept-section-title',
    'h2.speciality-title',
    'h2.dept-banner-title',
    'h1.dept-banner-title',
    'h2.cta-banner-title',
    'h2.page-about-title',
    'h2.text-anime-style-3',
    'h3.text-anime-style-3',
    '.section-title h2',
    '.section-title h3',
    '.word-reveal-target',
    // Paragraph and descriptive text — added for all-page coverage
    '.hero-desc',
    '.section-desc-gray',
    '.page-about-text',
    '.improving-body p',
    '.health-services-content p',
    '.dept-intro-text',
    '.about-page-text',
    'p.section-desc',
    '.services-content p',
    '.blog-desc p',
    '.cta-banner-desc',
    '.health-info-content p',
    '.dept-card-desc',
    '.director-text p',
    '.contact-info-text',
  ];

  const HEADING_SELECTOR = 'h1, h2, h3';
  const EXCLUDED_ANCESTORS = 'header, nav, aside, footer, .parth-header, .site-header, [role="dialog"], .appointment-modal, .modal, .modal-content-custom, .modal-overlay, .dropdown-menu-custom, .parth-footer';

  function wrapWords(el) {
    if (el.dataset.wordRevealDone) return;
    el.dataset.wordRevealDone = 'true';

    // Preserve inner HTML with spans/tags — process text nodes only
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      if (node.textContent.trim().length > 0) textNodes.push(node);
    }

    textNodes.forEach(function (textNode) {
      const words = textNode.textContent.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      words.forEach(function (part) {
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
        } else if (part.length > 0) {
          const word = document.createElement('span');
          const wordInner = document.createElement('span');
          word.className = 'reveal-word';
          wordInner.className = 'reveal-word-inner';
          wordInner.textContent = part;
          word.appendChild(wordInner);
          frag.appendChild(word);
        }
      });
      textNode.parentNode.replaceChild(frag, textNode);
    });

    el.classList.add('word-reveal-container');
  }

  function revealWords(el) {
    if (!el) return;
    const words = el.querySelectorAll('.reveal-word:not(.revealed)');
    words.forEach(function (word, i) {
      setTimeout(function () {
        word.classList.add('revealed');
      }, i * 65);
    });
  }

  function init() {
    // Add CSS fallback if not already present
    if (!document.getElementById('word-reveal-style')) {
      const style = document.createElement('style');
      style.id = 'word-reveal-style';
      style.textContent = `
        .word-reveal-container { overflow: visible; }
        .word-reveal-enabled .reveal-word {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
          line-height: inherit;
          padding-bottom: 0.12em;
          margin-bottom: -0.12em;
        }
        .word-reveal-enabled .reveal-word-inner {
          display: inline-block;
          opacity: 0;
          transform: translateY(115%);
          transition: opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .word-reveal-enabled .reveal-word.revealed .reveal-word-inner {
          opacity: 1;
          transform: translateY(0);
        }
      `;
      document.head.appendChild(style);
    }

    const targets = new Set();
    SELECTORS.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (!el.closest(EXCLUDED_ANCESTORS)) targets.add(el);
      });
    });

    document.querySelectorAll(HEADING_SELECTOR).forEach(function (el) {
      if (!el.closest(EXCLUDED_ANCESTORS)) targets.add(el);
    });

    const allTargets = Array.from(targets).filter(function (el) {
      return !el.closest(EXCLUDED_ANCESTORS);
    });

    if (allTargets.length === 0) return;

    allTargets.forEach(wrapWords);

    const reducedMotion = window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !('IntersectionObserver' in window)) {
      allTargets.forEach(revealWords);
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          revealWords(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -30px 0px'
    });

    document.documentElement.classList.add('word-reveal-enabled');
    allTargets.forEach(function (el) {
      observer.observe(el);
    });

    // Safety fallback: reveal all after 3.5s in case of edge cases
    setTimeout(function () {
      allTargets.forEach(revealWords);
    }, 3500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
