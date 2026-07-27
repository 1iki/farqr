/**
 * FARQR - QR Code Generator
 * Main Application Logic
 */

(function () {
  'use strict';

  // ============================================
  // STATE
  // ============================================
  const state = {
    qrInstance: null,
    currentData: '',
    dotType: 'square',
    cornerSquareType: 'square',
    cornerDotType: 'square',
    fgColor: '#000000',
    bgColor: '#ffffff',
    ecLevel: 'M',
    margin: 4,
    logoImage: null,
    logoDataUrl: null,
    generated: false,
    currentLang: localStorage.getItem('farqr_lang') || 'en',
    currentTheme: localStorage.getItem('farqr_theme') || 'dark',
  };

  // Map shape index to qr-code-styling dot types
  const DOT_TYPES = [
    'square',          // 0
    'dots',            // 1
    'rounded',         // 2
    'extra-rounded',   // 3
    'classy',          // 4
    'classy-rounded',  // 5
  ];

  const CORNER_SQUARE_TYPES = [
    'square',          // 0
    'dot',             // 1
    'extra-rounded',   // 2
  ];

  const CORNER_DOT_TYPES = [
    'square',          // 0
    'dot',             // 1
  ];

  // ============================================
  // INITIALIZATION
  // ============================================
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    renderDotShapes();
    renderFinderShapes();
    bindEvents();
    initColorPickers();
    initLogoUpload();
    setTheme(state.currentTheme);
    setLanguage(state.currentLang);
  }

  // ============================================
  // THEME ENGINE
  // ============================================
  function setTheme(theme) {
    state.currentTheme = theme;
    localStorage.setItem('farqr_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    const toggleBtn = document.getElementById('theme-toggle');
    const toggleIcon = document.getElementById('theme-toggle-icon');

    if (theme === 'light') {
      if (toggleIcon) toggleIcon.className = 'fas fa-moon';
      if (toggleBtn) toggleBtn.setAttribute('title', getI18nText('theme_to_dark', 'Switch to Dark Mode'));
    } else {
      if (toggleIcon) toggleIcon.className = 'fas fa-sun';
      if (toggleBtn) toggleBtn.setAttribute('title', getI18nText('theme_to_light', 'Switch to Light Mode'));
    }
  }

  // ============================================
  // I18N ENGINE
  // ============================================
  function setLanguage(lang) {
    if (!window.FARQR_TRANSLATIONS || !window.FARQR_TRANSLATIONS[lang]) lang = 'en';
    state.currentLang = lang;
    localStorage.setItem('farqr_lang', lang);
    document.documentElement.lang = lang;

    const dict = window.FARQR_TRANSLATIONS[lang];

    // Update textContent
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        el.textContent = dict[key];
      }
    });

    // Update innerHTML
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    // Update placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key] !== undefined) {
        el.placeholder = dict[key];
      }
    });

    // Update title
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (dict[key] !== undefined) {
        el.title = dict[key];
      }
    });

    // Update active dropdown item
    document.querySelectorAll('.lang-option').forEach(item => {
      if (item.getAttribute('data-lang') === lang) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Refresh theme tooltip in current language
    if (state.currentTheme) setTheme(state.currentTheme);
  }

  function getI18nText(key, fallback = '') {
    const lang = state.currentLang || 'en';
    if (window.FARQR_TRANSLATIONS && window.FARQR_TRANSLATIONS[lang] && window.FARQR_TRANSLATIONS[lang][key]) {
      return window.FARQR_TRANSLATIONS[lang][key];
    }
    return fallback;
  }

  // ============================================
  // DOT SHAPE PREVIEWS
  // ============================================
  function renderDotShapes() {
    const grid = document.getElementById('dot-shapes');
    if (!grid) return;

    const shapes = [
      { type: 'square', label: 'Square', svg: dotShapeSVG('square') },
      { type: 'dots', label: 'Dots', svg: dotShapeSVG('dots') },
      { type: 'rounded', label: 'Rounded', svg: dotShapeSVG('rounded') },
      { type: 'extra-rounded', label: 'Extra Rounded', svg: dotShapeSVG('extra-rounded') },
      { type: 'classy', label: 'Classy', svg: dotShapeSVG('classy') },
      { type: 'classy-rounded', label: 'Classy Rounded', svg: dotShapeSVG('classy-rounded') },
    ];

    shapes.forEach((shape, idx) => {
      const btn = document.createElement('button');
      btn.className = 'shape-btn' + (idx === 0 ? ' active' : '');
      btn.setAttribute('data-dot-type', shape.type);
      btn.setAttribute('title', shape.label);
      btn.innerHTML = shape.svg;
      btn.addEventListener('click', () => {
        grid.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.dotType = shape.type;
        if (state.generated) generateQR();
      });
      grid.appendChild(btn);
    });
  }

  function dotShapeSVG(type) {
    const size = 60;
    const cellSize = size / 5;
    // A simple 5x5 grid pattern to preview the dot shape
    const pattern = [
      [1,1,1,0,1],
      [0,1,1,0,0],
      [0,0,1,0,1],
      [1,0,0,1,0],
      [1,1,0,1,0],
    ];
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="100%" height="100%">`;

    pattern.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) {
          const x = c * cellSize;
          const y = r * cellSize;
          svg += renderDotCell(type, x, y, cellSize);
        }
      });
    });
    svg += '</svg>';
    return svg;
  }

  function renderDotCell(type, x, y, s) {
    const half = s / 2;
    switch(type) {
      case 'dots':
        return `<circle cx="${x+half}" cy="${y+half}" r="${half*0.8}" fill="currentColor"/>`;
      case 'rounded':
        return `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s*0.33}" ry="${s*0.33}" fill="currentColor"/>`;
      case 'extra-rounded':
        return `<rect x="${x+1}" y="${y+1}" width="${s-2}" height="${s-2}" rx="${s*0.45}" ry="${s*0.45}" fill="currentColor"/>`;
      case 'classy':
        return `<path d="M${x} ${y}h${s}v${s}h${-s}z" fill="currentColor"/>`;
      case 'classy-rounded':
        return `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s*0.2}" ry="${s*0.2}" fill="currentColor"/>`;
      case 'square':
      default:
        return `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="currentColor"/>`;
    }
  }

  // ============================================
  // FINDER SHAPE PREVIEWS
  // ============================================
  function renderFinderShapes() {
    const grid = document.getElementById('finder-shapes');
    if (!grid) return;

    const combos = [
      { csType: 'square', cdType: 'square', label: 'Square' },
      { csType: 'dot', cdType: 'dot', label: 'Dot' },
      { csType: 'extra-rounded', cdType: 'square', label: 'Rounded Square' },
      { csType: 'extra-rounded', cdType: 'dot', label: 'Rounded Dot' },
      { csType: 'square', cdType: 'dot', label: 'Square + Dot' },
    ];

    combos.forEach((combo, idx) => {
      const btn = document.createElement('button');
      btn.className = 'finder-shape-btn' + (idx === 0 ? ' active' : '');
      btn.setAttribute('title', combo.label);
      btn.innerHTML = finderSVG(combo.csType, combo.cdType);
      btn.addEventListener('click', () => {
        grid.querySelectorAll('.finder-shape-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.cornerSquareType = combo.csType;
        state.cornerDotType = combo.cdType;
        if (state.generated) generateQR();
      });
      grid.appendChild(btn);
    });
  }

  function finderSVG(csType, cdType) {
    const s = 50;
    const outerSize = s;
    const innerSize = s * 0.43;
    const offset = (s - innerSize) / 2;
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}" width="100%" height="100%">`;

    // Outer
    if (csType === 'dot') {
      svg += `<circle cx="${s/2}" cy="${s/2}" r="${s/2-1}" fill="none" stroke="currentColor" stroke-width="5"/>`;
    } else if (csType === 'extra-rounded') {
      svg += `<rect x="1" y="1" width="${s-2}" height="${s-2}" rx="${s*0.3}" ry="${s*0.3}" fill="none" stroke="currentColor" stroke-width="5"/>`;
    } else {
      svg += `<rect x="1" y="1" width="${s-2}" height="${s-2}" fill="none" stroke="currentColor" stroke-width="5"/>`;
    }

    // Inner
    if (cdType === 'dot') {
      svg += `<circle cx="${s/2}" cy="${s/2}" r="${innerSize/2}" fill="currentColor"/>`;
    } else {
      svg += `<rect x="${offset}" y="${offset}" width="${innerSize}" height="${innerSize}" fill="currentColor"/>`;
    }

    svg += '</svg>';
    return svg;
  }

  // ============================================
  // COLOR PICKERS
  // ============================================
  function initColorPickers() {
    // Foreground
    const fgColor = document.getElementById('fg-color');
    const fgHex = document.getElementById('fg-hex');
    const fgPreview = document.getElementById('fg-preview');

    fgColor.addEventListener('input', (e) => {
      const val = e.target.value;
      fgHex.value = val;
      fgPreview.style.background = val;
      state.fgColor = val;
      if (state.generated) generateQR();
    });

    fgHex.addEventListener('change', (e) => {
      const val = e.target.value;
      if (/^#[0-9a-fA-F]{6}$/.test(val)) {
        fgColor.value = val;
        fgPreview.style.background = val;
        state.fgColor = val;
        if (state.generated) generateQR();
      }
    });

    // Background
    const bgColor = document.getElementById('bg-color');
    const bgHex = document.getElementById('bg-hex');
    const bgPreview = document.getElementById('bg-preview');

    bgColor.addEventListener('input', (e) => {
      const val = e.target.value;
      bgHex.value = val;
      bgPreview.style.background = val;
      state.bgColor = val;
      if (state.generated) generateQR();
    });

    bgHex.addEventListener('change', (e) => {
      const val = e.target.value;
      if (/^#[0-9a-fA-F]{6}$/.test(val)) {
        bgColor.value = val;
        bgPreview.style.background = val;
        state.bgColor = val;
        if (state.generated) generateQR();
      }
    });
  }

  // ============================================
  // LOGO UPLOAD
  // ============================================
  function initLogoUpload() {
    const area = document.getElementById('logo-upload-area');
    const fileInput = document.getElementById('logo-file');
    const previewWrapper = document.getElementById('logo-preview-wrapper');
    const previewImg = document.getElementById('logo-preview-img');
    const removeBtn = document.getElementById('logo-remove-btn');

    area.addEventListener('click', () => fileInput.click());

    area.addEventListener('dragover', (e) => {
      e.preventDefault();
      area.style.borderColor = 'var(--accent-primary)';
    });

    area.addEventListener('dragleave', () => {
      area.style.borderColor = 'var(--border-color)';
    });

    area.addEventListener('drop', (e) => {
      e.preventDefault();
      area.style.borderColor = 'var(--border-color)';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleLogoFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleLogoFile(e.target.files[0]);
      }
    });

    removeBtn.addEventListener('click', () => {
      state.logoImage = null;
      state.logoDataUrl = null;
      previewWrapper.classList.add('d-none');
      area.classList.remove('d-none');
      fileInput.value = '';
      if (state.generated) generateQR();
    });
  }

  function handleLogoFile(file) {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      state.logoDataUrl = e.target.result;

      const previewWrapper = document.getElementById('logo-preview-wrapper');
      const previewImg = document.getElementById('logo-preview-img');
      const area = document.getElementById('logo-upload-area');

      previewImg.src = e.target.result;
      previewWrapper.classList.remove('d-none');
      area.classList.add('d-none');

      if (state.generated) generateQR();
    };
    reader.readAsDataURL(file);
  }

  // ============================================
  // EVENT BINDINGS
  // ============================================
  function bindEvents() {
    // Theme toggle button click handler
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const nextTheme = state.currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
      });
    }

    // Language switcher click handler
    document.querySelectorAll('.lang-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = btn.getAttribute('data-lang');
        if (lang) setLanguage(lang);
      });
    });

    // Generate button
    document.getElementById('btn-generate').addEventListener('click', () => {
      generateQR();
    });

    // Error correction buttons
    document.querySelectorAll('.ec-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.ec-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.ecLevel = btn.getAttribute('data-level');
        if (state.generated) generateQR();
      });
    });

    // Margin slider
    const marginSlider = document.getElementById('margin-size');
    const marginValue = document.getElementById('margin-value');
    marginSlider.addEventListener('input', (e) => {
      marginValue.textContent = e.target.value;
      state.margin = parseInt(e.target.value);
      if (state.generated) generateQR();
    });

    // Preview size slider (in the preview card)
    const previewSizeRange = document.getElementById('preview-size-range');
    const sizeDisplay = document.getElementById('size-display');
    const downloadSizeInput = document.getElementById('download-size');
    if (previewSizeRange) {
      previewSizeRange.addEventListener('input', (e) => {
        const val = e.target.value;
        sizeDisplay.textContent = `${val} x ${val}`;
        if (downloadSizeInput) downloadSizeInput.value = val;
      });
    }

    // Left-panel Download buttons
    document.getElementById('dl-png').addEventListener('click', () => downloadQR('png'));
    document.getElementById('dl-svg').addEventListener('click', () => downloadQR('svg'));
    document.getElementById('dl-jpeg').addEventListener('click', () => downloadQR('jpeg'));
    document.getElementById('dl-webp').addEventListener('click', () => downloadQR('webp'));
    document.getElementById('dl-pdf').addEventListener('click', () => downloadPDF());

    // Preview card download buttons (all 10 formats)
    const previewDlMap = {
      'pdl-jpeg': 'jpeg',
      'pdl-png': 'png',
      'pdl-svg': 'svg',
      'pdl-eps': 'svg',    // EPS uses SVG as closest supported format
      'pdl-webp': 'webp',
      'pdl-tiff': 'png',   // TIFF uses PNG as closest supported format
      'pdl-gif': 'png',    // GIF uses PNG as closest supported format
      'pdl-stl': 'png',    // 3D formats show info toast
      'pdl-3mf': 'png',
      'pdl-obj': 'png',
    };

    Object.entries(previewDlMap).forEach(([id, format]) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', () => {
          if (['pdl-stl', 'pdl-3mf', 'pdl-obj'].includes(id)) {
            showToast(`${id.replace('pdl-', '').toUpperCase()} 3D format — downloading as PNG instead`, 'info');
          }
          downloadQR(format);
        });
      }
    });

    // Embed modal handler
    const embedModal = document.getElementById('embedModal');
    if (embedModal) {
      embedModal.addEventListener('show.bs.modal', () => {
        if (!state.generated) return;
        // Generate a small preview for embed modal
        const embedContainer = document.getElementById('embed-preview-qr');
        embedContainer.innerHTML = '';
        const embedQR = new QRCodeStyling({
          width: 180, height: 180,
          data: state.currentData,
          margin: state.margin,
          qrOptions: { errorCorrectionLevel: state.ecLevel },
          dotsOptions: { type: state.dotType, color: state.fgColor },
          cornersSquareOptions: { type: state.cornerSquareType, color: state.fgColor },
          cornersDotOptions: { type: state.cornerDotType, color: state.fgColor },
          backgroundOptions: { color: state.bgColor },
          imageOptions: { crossOrigin: 'anonymous', margin: 6, imageSize: 0.35 },
          image: state.logoDataUrl || undefined,
        });
        embedQR.append(embedContainer);

        // Set embed fields
        const imgSize = document.getElementById('embed-img-size').value || 500;
        const border = document.getElementById('embed-border-size').value || 2;
        const encodedData = encodeURIComponent(state.currentData);
        const imgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${imgSize}x${imgSize}&data=${encodedData}&margin=${border}`;
        document.getElementById('embed-link').value = imgUrl;
        document.getElementById('embed-html').value = `<img src="${imgUrl}" alt="QR Code" width="${imgSize}" height="${imgSize}" />`;
      });
    }

    // Login modal toggle
    const toggleAuth = document.getElementById('toggle-auth-form');
    if (toggleAuth) {
      toggleAuth.addEventListener('click', (e) => {
        e.preventDefault();
        const loginBox = document.getElementById('login-form-box');
        const registerBox = document.getElementById('register-form-box');
        loginBox.classList.toggle('d-none');
        registerBox.classList.toggle('d-none');
        if (registerBox.classList.contains('d-none')) {
          toggleAuth.textContent = 'Create an account';
          document.querySelector('#loginModal .modal-title').textContent = 'Login';
        } else {
          toggleAuth.textContent = 'Already have an account? Login';
          document.querySelector('#loginModal .modal-title').textContent = 'Sign Up';
        }
      });
    }

    // Register nav button opens register form
    const regNav = document.getElementById('openRegisterModalNav');
    if (regNav) {
      regNav.addEventListener('click', () => {
        setTimeout(() => {
          const loginBox = document.getElementById('login-form-box');
          const registerBox = document.getElementById('register-form-box');
          loginBox.classList.add('d-none');
          registerBox.classList.remove('d-none');
          document.querySelector('#loginModal .modal-title').textContent = 'Sign Up';
          document.getElementById('toggle-auth-form').textContent = 'Already have an account? Login';
        }, 200);
      });
    }

    // Enter key to generate
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        generateQR();
      }
    });
  }

  // ============================================
  // DATA COLLECTION
  // ============================================
  function getQRData() {
    const activeTab = document.querySelector('#qrTabContent .tab-pane.active');
    if (!activeTab) return '';

    const tabId = activeTab.id;

    switch (tabId) {
      case 'tab-url': {
        const url = document.getElementById('url-data').value.trim();
        return url || 'https://farqr.com';
      }

      case 'tab-text': {
        return document.getElementById('text-data').value.trim() || 'Hello World';
      }

      case 'tab-vcard': {
        const fn = document.getElementById('vc-firstname').value.trim();
        const ln = document.getElementById('vc-lastname').value.trim();
        const mob = document.getElementById('vc-mobile').value.trim();
        const ph = document.getElementById('vc-phone').value.trim();
        const fax = document.getElementById('vc-fax').value.trim();
        const email = document.getElementById('vc-email').value.trim();
        const company = document.getElementById('vc-company').value.trim();
        const title = document.getElementById('vc-title').value.trim();
        const street = document.getElementById('vc-street').value.trim();
        const city = document.getElementById('vc-city').value.trim();
        const zip = document.getElementById('vc-zipcode').value.trim();
        const st = document.getElementById('vc-state').value.trim();
        const country = document.getElementById('vc-country').value.trim();
        const website = document.getElementById('vc-website').value.trim();
        const note = document.getElementById('vc-note').value.trim();

        let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
        if (fn || ln) vcard += `N:${ln};${fn};;;\nFN:${fn} ${ln}\n`;
        if (mob) vcard += `TEL;TYPE=CELL:${mob}\n`;
        if (ph) vcard += `TEL;TYPE=WORK:${ph}\n`;
        if (fax) vcard += `TEL;TYPE=FAX:${fax}\n`;
        if (email) vcard += `EMAIL:${email}\n`;
        if (company) vcard += `ORG:${company}\n`;
        if (title) vcard += `TITLE:${title}\n`;
        if (street || city || st || zip || country) {
          vcard += `ADR:;;${street};${city};${st};${zip};${country}\n`;
        }
        if (website) vcard += `URL:${website}\n`;
        if (note) vcard += `NOTE:${note}\n`;
        vcard += 'END:VCARD';
        return vcard;
      }

      case 'tab-email': {
        const addr = document.getElementById('email-address').value.trim();
        const subj = document.getElementById('email-subject').value.trim();
        const body = document.getElementById('email-body').value.trim();
        if (!addr) return 'mailto:example@email.com';
        let mailto = `mailto:${addr}`;
        const params = [];
        if (subj) params.push(`subject=${encodeURIComponent(subj)}`);
        if (body) params.push(`body=${encodeURIComponent(body)}`);
        if (params.length) mailto += '?' + params.join('&');
        return mailto;
      }

      case 'tab-whatsapp': {
        const phone = document.getElementById('wa-phone').value.trim().replace(/[^0-9+]/g, '');
        const msg = document.getElementById('wa-message').value.trim();
        let url = `https://wa.me/${phone}`;
        if (msg) url += `?text=${encodeURIComponent(msg)}`;
        return url;
      }

      case 'tab-wifi': {
        const ssid = document.getElementById('wifi-ssid').value.trim();
        const pass = document.getElementById('wifi-password').value.trim();
        const enc = document.getElementById('wifi-encryption').value;
        const hidden = document.getElementById('wifi-hidden').checked;
        return `WIFI:T:${enc};S:${ssid};P:${pass};H:${hidden ? 'true' : 'false'};;`;
      }

      case 'tab-phone': {
        const num = document.getElementById('phone-number').value.trim();
        return `tel:${num}`;
      }

      case 'tab-sms': {
        const num = document.getElementById('sms-phone').value.trim();
        const msg = document.getElementById('sms-message').value.trim();
        return `smsto:${num}:${msg}`;
      }

      case 'tab-calendar': {
        const title = document.getElementById('cal-title').value.trim();
        const loc = document.getElementById('cal-location').value.trim();
        const start = document.getElementById('cal-start').value;
        const end = document.getElementById('cal-end').value;
        const desc = document.getElementById('cal-description').value.trim();

        const formatDate = (d) => {
          if (!d) return '';
          return d.replace(/[-:]/g, '').replace('T', 'T') + '00';
        };

        let cal = 'BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\n';
        if (title) cal += `SUMMARY:${title}\n`;
        if (loc) cal += `LOCATION:${loc}\n`;
        if (start) cal += `DTSTART:${formatDate(start)}\n`;
        if (end) cal += `DTEND:${formatDate(end)}\n`;
        if (desc) cal += `DESCRIPTION:${desc}\n`;
        cal += 'END:VEVENT\nEND:VCALENDAR';
        return cal;
      }

      case 'tab-geo': {
        const lat = document.getElementById('geo-lat').value.trim();
        const lng = document.getElementById('geo-lng').value.trim();
        return `geo:${lat || '0'},${lng || '0'}`;
      }

      case 'tab-crypto': {
        const type = document.querySelector('input[name="crypto-type"]:checked').value;
        const addr = document.getElementById('crypto-address').value.trim();
        const amt = document.getElementById('crypto-amount').value.trim();
        let uri = `${type}:${addr}`;
        if (amt) uri += `?amount=${amt}`;
        return uri;
      }

      case 'tab-social': {
        return document.getElementById('social-url').value.trim() || 'https://instagram.com';
      }

      default:
        return 'https://farqr.com';
    }
  }

  // ============================================
  // QR CODE GENERATION
  // ============================================
  function generateQR() {
    const data = getQRData();
    if (!data) {
      showToast(getI18nText('toast_enter_data', 'Please enter data for the QR code'), 'warning');
      return;
    }

    state.currentData = data;
    state.generated = true;

    const container = document.getElementById('qr-output');
    container.innerHTML = '';

    const ecMap = { 'L': 'L', 'M': 'M', 'Q': 'Q', 'H': 'H' };

    const qrOptions = {
      width: 260,
      height: 260,
      data: data,
      margin: state.margin,
      qrOptions: {
        errorCorrectionLevel: ecMap[state.ecLevel] || 'M',
      },
      dotsOptions: {
        type: state.dotType,
        color: state.fgColor,
      },
      cornersSquareOptions: {
        type: state.cornerSquareType,
        color: state.fgColor,
      },
      cornersDotOptions: {
        type: state.cornerDotType,
        color: state.fgColor,
      },
      backgroundOptions: {
        color: state.bgColor,
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 6,
        imageSize: 0.35,
      },
    };

    if (state.logoDataUrl) {
      qrOptions.image = state.logoDataUrl;
    }

    state.qrInstance = new QRCodeStyling(qrOptions);
    state.qrInstance.append(container);

    // Show preview controls (size slider, download buttons, embed)
    const previewControls = document.getElementById('preview-controls');
    if (previewControls) previewControls.style.display = '';

    showToast(getI18nText('toast_generated_success', 'QR Code generated successfully!'), 'success');
  }

  // ============================================
  // DOWNLOAD FUNCTIONS
  // ============================================
  function downloadQR(format) {
    if (!state.qrInstance || !state.generated) {
      showToast(getI18nText('toast_generate_first', 'Please generate a QR code first'), 'warning');
      return;
    }

    // Create a high-res version for download
    const previewRange = document.getElementById('preview-size-range');
    const size = parseInt(previewRange ? previewRange.value : document.getElementById('download-size').value) || 1000;

    const downloadOptions = {
      width: size,
      height: size,
      data: state.currentData,
      margin: state.margin,
      qrOptions: {
        errorCorrectionLevel: state.ecLevel,
      },
      dotsOptions: {
        type: state.dotType,
        color: state.fgColor,
      },
      cornersSquareOptions: {
        type: state.cornerSquareType,
        color: state.fgColor,
      },
      cornersDotOptions: {
        type: state.cornerDotType,
        color: state.fgColor,
      },
      backgroundOptions: {
        color: state.bgColor,
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 6,
        imageSize: 0.35,
      },
    };

    if (state.logoDataUrl) {
      downloadOptions.image = state.logoDataUrl;
    }

    const downloadQR = new QRCodeStyling(downloadOptions);

    const extMap = {
      'png': 'png',
      'jpeg': 'jpeg',
      'webp': 'webp',
      'svg': 'svg',
    };

    downloadQR.download({
      name: 'farqr-qrcode',
      extension: extMap[format] || 'png',
    });

    const dlText = getI18nText('toast_downloading', 'Downloading as');
    showToast(`${dlText} ${format.toUpperCase()}...`, 'success');
  }

  function downloadPDF() {
    if (!state.qrInstance || !state.generated) {
      showToast(getI18nText('toast_generate_first', 'Please generate a QR code first'), 'warning');
      return;
    }

    const size = parseInt(document.getElementById('download-size').value) || 1000;

    const pdfOptions = {
      width: size,
      height: size,
      data: state.currentData,
      margin: state.margin,
      qrOptions: {
        errorCorrectionLevel: state.ecLevel,
      },
      dotsOptions: {
        type: state.dotType,
        color: state.fgColor,
      },
      cornersSquareOptions: {
        type: state.cornerSquareType,
        color: state.fgColor,
      },
      cornersDotOptions: {
        type: state.cornerDotType,
        color: state.fgColor,
      },
      backgroundOptions: {
        color: state.bgColor,
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 6,
        imageSize: 0.35,
      },
    };

    if (state.logoDataUrl) {
      pdfOptions.image = state.logoDataUrl;
    }

    const pdfQR = new QRCodeStyling(pdfOptions);

    // Get canvas data and put into PDF
    pdfQR.getRawData('png').then(blob => {
      const reader = new FileReader();
      reader.onload = function () {
        const imgData = reader.result;
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        // Center the QR code on A4
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const qrSize = Math.min(pdfWidth, pdfHeight) * 0.6;
        const x = (pdfWidth - qrSize) / 2;
        const y = (pdfHeight - qrSize) / 2 - 20;

        // Title
        pdf.setFontSize(16);
        pdf.setTextColor(80, 80, 80);
        pdf.text('FARQR - QR Code', pdfWidth / 2, y - 10, { align: 'center' });

        pdf.addImage(imgData, 'PNG', x, y, qrSize, qrSize);

        // Footer
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text('Generated by FARQR - Free QR Code Generator', pdfWidth / 2, pdfHeight - 15, { align: 'center' });

        pdf.save('farqr-qrcode.pdf');
      };
      reader.readAsDataURL(blob);
    });

    showToast('Downloading as PDF...', 'success');
  }

  // ============================================
  // TOAST NOTIFICATIONS
  // ============================================
  function showToast(message, type = 'info') {
    // Remove existing toasts
    document.querySelectorAll('.toast-container').forEach(t => t.remove());

    const iconMap = {
      success: 'fas fa-check-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle',
    };

    const container = document.createElement('div');
    container.className = 'toast-container';
    container.innerHTML = `
      <div class="custom-toast">
        <i class="${iconMap[type] || iconMap.info}"></i>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(container);

    setTimeout(() => {
      container.style.opacity = '0';
      container.style.transition = 'opacity 0.3s ease';
      setTimeout(() => container.remove(), 300);
    }, 3000);
  }

})();
