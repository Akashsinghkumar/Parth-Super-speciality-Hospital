/**
 * Color Switcher for Parth Super Speciality Hospital
 * Allows users to switch between 16 different color themes
 */
(function() {
    'use strict';

    // Theme definitions
    const THEMES = [
        { id: 'parth-original', label: 'Parth Original', primary: '#0c2d28', accent: '#F7A582' },
        { id: 'medicoz-blue', label: 'Medical Blue', primary: '#1370b5', accent: '#13bfb3' },
        { id: 'teal-blue', label: 'Teal', primary: '#13bfb3', accent: '#1370b5' },
        { id: 'scarlet-coral', label: 'Scarlet Coral', primary: '#ef5b3f', accent: '#f79783' },
        { id: 'kelly-green', label: 'Kelly Green', primary: '#7fc540', accent: '#a7dc72' },
        { id: 'dodger-blue', label: 'Dodger Blue', primary: '#105abf', accent: '#5493ea' },
        { id: 'medical-red', label: 'Medical Red', primary: '#c90f40', accent: '#e85c80' },
        { id: 'amber-gold', label: 'Amber Gold', primary: '#dab600', accent: '#f5d847' },
        { id: 'deep-maroon', label: 'Deep Maroon', primary: '#70012c', accent: '#b53c69' },
        { id: 'warm-brown', label: 'Warm Brown', primary: '#562424', accent: '#965858' },
        { id: 'emerald-green', label: 'Emerald Green', primary: '#018f55', accent: '#3ec28a' },
        { id: 'duchess-blue', label: 'Duchess Blue', primary: '#00154e', accent: '#1370b5' },
        { id: 'light-blue', label: 'Light Blue', primary: '#007caf', accent: '#42b2df' },
        { id: 'french-slate', label: 'French Slate', primary: '#353f4b', accent: '#6e7f94' },
        { id: 'magenta', label: 'Magenta', primary: '#ec008b', accent: '#f75ab5' },
        { id: 'signal-violet', label: 'Signal Violet', primary: '#65365a', accent: '#9e6090' }
    ];

    // Constants
    const DEFAULT_THEME = 'parth-original';
    const STORAGE_KEY = 'parth-hospital-theme';

    // State
    let container = null;
    let toggleBtn = null;
    let panel = null;
    let overlay = null;

    /**
     * Build the color switcher HTML structure
     */
    function buildSwitcherHTML() {
        // Create main container
        container = document.createElement('div');
        container.className = 'cs-container';

        // Create overlay
        overlay = document.createElement('div');
        overlay.className = 'cs-overlay';

        // Create toggle button with gear icon
        toggleBtn = document.createElement('button');
        toggleBtn.className = 'cs-toggle-btn';
        toggleBtn.setAttribute('aria-label', 'Open color theme switcher');
        toggleBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 12.88V11.12C2 10.08 2.85 9.22 3.9 9.22C5.71 9.22 6.45 7.94 5.54 6.37C5.02 5.47 5.33 4.3 6.24 3.78L7.97 2.79C8.76 2.32 9.78 2.6 10.25 3.39L10.36 3.58C11.26 5.15 12.74 5.15 13.65 3.58L13.76 3.39C14.23 2.6 15.25 2.32 16.04 2.79L17.77 3.78C18.68 4.3 18.99 5.47 18.47 6.37C17.56 7.94 18.3 9.22 20.11 9.22C21.15 9.22 22.01 10.07 22.01 11.12V12.88C22.01 13.92 21.16 14.78 20.11 14.78C18.3 14.78 17.56 16.06 18.47 17.63C18.99 18.54 18.68 19.7 17.77 20.22L16.04 21.21C15.25 21.68 14.23 21.4 13.76 20.61L13.65 20.42C12.75 18.85 11.27 18.85 10.36 20.42L10.25 20.61C9.78 21.4 8.76 21.68 7.97 21.21L6.24 20.22C5.33 19.7 5.02 18.53 5.54 17.63C6.45 16.06 5.71 14.78 3.9 14.78C2.85 14.78 2 13.92 2 12.88Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

        // Create panel
        panel = document.createElement('div');
        panel.className = 'cs-panel';

        // Panel header
        const header = document.createElement('div');
        header.className = 'cs-header';
        
        const title = document.createElement('h3');
        title.textContent = 'Color Themes';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'cs-close-btn';
        closeBtn.setAttribute('aria-label', 'Close color theme switcher');
        closeBtn.innerHTML = '&times;';
        
        header.appendChild(title);
        header.appendChild(closeBtn);

        // Panel body
        const body = document.createElement('div');
        body.className = 'cs-body';
        
        const label = document.createElement('p');
        label.className = 'cs-label';
        label.textContent = 'Choose a Theme';
        
        const swatches = document.createElement('div');
        swatches.className = 'cs-swatches';

        // Create swatches for each theme
        THEMES.forEach(theme => {
            const swatch = document.createElement('div');
            swatch.className = 'cs-swatch';
            swatch.setAttribute('data-theme', theme.id);
            swatch.setAttribute('title', theme.label);
            swatch.setAttribute('role', 'button');
            swatch.setAttribute('tabindex', '0');
            swatch.setAttribute('aria-label', theme.label + ' theme');

            const primaryDiv = document.createElement('div');
            primaryDiv.className = 'cs-swatch-primary';
            primaryDiv.style.backgroundColor = theme.primary;

            const accentDiv = document.createElement('div');
            accentDiv.className = 'cs-swatch-accent';
            accentDiv.style.backgroundColor = theme.accent;

            swatch.appendChild(primaryDiv);
            swatch.appendChild(accentDiv);
            swatches.appendChild(swatch);
        });

        body.appendChild(label);
        body.appendChild(swatches);

        // Reset button
        const resetBtn = document.createElement('button');
        resetBtn.className = 'cs-reset-btn';
        resetBtn.textContent = 'Reset to Default (Parth Original)';
        body.appendChild(resetBtn);

        // Assemble panel
        panel.appendChild(header);
        panel.appendChild(body);

        // Assemble container
        container.appendChild(overlay);
        container.appendChild(toggleBtn);
        container.appendChild(panel);

        // Add to body
        document.body.appendChild(container);
    }

    /**
     * Apply a theme
     * @param {string} themeId - The theme ID to apply
     * @param {boolean} save - Whether to save to localStorage
     */
    function applyTheme(themeId, save) {
        const theme = THEMES.find(t => t.id === themeId);
        if (!theme) {
            console.warn('Theme not found:', themeId);
            return;
        }

        // Set data attribute on root element
        document.documentElement.setAttribute('data-theme', themeId);

        // Save to localStorage if requested
        if (save) {
            localStorage.setItem(STORAGE_KEY, themeId);
        }

        // Update toggle button color
        if (toggleBtn) {
            toggleBtn.style.backgroundColor = theme.primary;
        }

        // Update active swatch
        const swatches = document.querySelectorAll('.cs-swatch');
        swatches.forEach(swatch => {
            if (swatch.getAttribute('data-theme') === themeId) {
                swatch.classList.add('cs-active');
            } else {
                swatch.classList.remove('cs-active');
            }
        });
    }

    /**
     * Open the color switcher panel
     */
    function openPanel() {
        if (panel) {
            panel.classList.add('cs-open');
        }
        if (overlay) {
            overlay.classList.add('cs-visible');
        }
        document.body.classList.add('cs-panel-open');
    }

    /**
     * Close the color switcher panel
     */
    function closePanel() {
        if (panel) {
            panel.classList.remove('cs-open');
        }
        if (overlay) {
            overlay.classList.remove('cs-visible');
        }
        document.body.classList.remove('cs-panel-open');
    }

    /**
     * Initialize the color switcher
     */
    function init() {
        // Build the HTML
        buildSwitcherHTML();

        // Load saved theme or default
        const savedTheme = localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
        applyTheme(savedTheme, false);

        // Bind toggle button
        if (toggleBtn) {
            toggleBtn.addEventListener('click', openPanel);
        }

        // Bind close button
        const closeBtn = document.querySelector('.cs-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closePanel);
        }

        // Bind overlay
        if (overlay) {
            overlay.addEventListener('click', closePanel);
        }

        // Bind swatches
        const swatches = document.querySelectorAll('.cs-swatch');
        swatches.forEach(swatch => {
            // Click event
            swatch.addEventListener('click', function() {
                const themeId = this.getAttribute('data-theme');
                applyTheme(themeId, true);
                closePanel();
            });

            // Keyboard event (Enter or Space)
            swatch.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const themeId = this.getAttribute('data-theme');
                    applyTheme(themeId, true);
                    closePanel();
                }
            });
        });

        // Bind reset button
        const resetBtn = document.querySelector('.cs-reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                applyTheme(DEFAULT_THEME, true);
            });
        }

        // Bind escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closePanel();
            }
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
