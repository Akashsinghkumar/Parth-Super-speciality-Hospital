

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // Header Scrolled State
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#' && document.querySelector(targetId)) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        window.scrollTo({
          top: targetElement.offsetTop - 85,
          behavior: 'smooth'
        });
      }
    });
  });

  // Number Counter Animation for Hero Stats
  const statsElements = document.querySelectorAll('.stat-number');
  let counted = false;

  function countUp(element) {
    const target = parseInt(element.getAttribute('data-count'), 10) || 0;
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.floor(ease * target);

      element.textContent = currentVal.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        statsElements.forEach(el => countUp(el));
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.mecare-counter-strip') || document.querySelector('.hero-stats-cards');
  if (statsSection) {
    observer.observe(statsSection);
  }

  // Interactive 3D Tilt for Facility and Highlight Cards
  const tiltCards = document.querySelectorAll('.facility-card, .stat-glass-card, .ranchi-hospital-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // Patient Reviews Carousel
  const reviews = [
    {
      avatar: 'W',
      bg: 'linear-gradient(135deg, #e91e63, #ff4081)',
      name: 'Waquar Ansari',
      time: '6 months ago',
      rating: 5,
      text: 'Good hospital. Doctors and nursing staff are extremely polite and supportive. Complete diagnostics and medicines were available right here.'
    },
    {
      avatar: 'P',
      bg: 'linear-gradient(135deg, #0070f3, #00d2ff)',
      name: 'Priya Sharma',
      time: '2 months ago',
      rating: 5,
      text: 'Visited Parth Super Speciality Hospital for my father’s cardiac checkup and 2D Colour Doppler. Best facilities and world-class care in Ranchi!'
    },
    {
      avatar: 'R',
      bg: 'linear-gradient(135deg, #10b981, #059669)',
      name: 'Rajesh Verma',
      time: '4 months ago',
      rating: 5,
      text: 'State of the art operation facility and 24 hrs pharmacy. The doctors explained every procedure transparently. Truly compassionate healthcare.'
    },
    {
      avatar: 'A',
      bg: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
      name: 'Anjali Devi',
      time: '1 month ago',
      rating: 5,
      text: 'Clean modern environment, courteous staff, and very nominal charges. Best super speciality hospital along Ranchi Ring Road.'
    }
  ];

  let currentReviewIndex = 0;
  const reviewAvatar = document.getElementById('review-avatar');
  const reviewName = document.getElementById('review-name');
  const reviewTime = document.getElementById('review-time');
  const reviewText = document.getElementById('review-text');
  const reviewPrevBtn = document.getElementById('review-prev');
  const reviewNextBtn = document.getElementById('review-next');

  function renderReview(index) {
    const item = reviews[index];
    if (!item || !reviewName) return;

    // Fade out
    const card = document.querySelector('.review-card-modern');
    if (card) card.style.opacity = '0.3';

    setTimeout(() => {
      reviewAvatar.textContent = item.avatar;
      reviewAvatar.style.background = item.bg;
      reviewName.textContent = item.name;
      reviewTime.textContent = item.time;
      reviewText.textContent = item.text;
      if (card) card.style.opacity = '1';
    }, 180);
  }

  if (reviewPrevBtn && reviewNextBtn) {
    reviewPrevBtn.addEventListener('click', () => {
      currentReviewIndex = (currentReviewIndex - 1 + reviews.length) % reviews.length;
      renderReview(currentReviewIndex);
    });

    reviewNextBtn.addEventListener('click', () => {
      currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
      renderReview(currentReviewIndex);
    });

    // Auto rotate every 6 seconds
    setInterval(() => {
      currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
      renderReview(currentReviewIndex);
    }, 6000);
  }

  // Facility Details Database & Modal
  const facilitiesData = {
    'ecg': {
      title: 'ECG (Electrocardiography)',
      badge: 'Cardiac Diagnostics',
      desc: 'High-precision 12-lead digital ECG recording electrical signals of the heart with instantaneous computerised analysis. Detects arrhythmias, heart attacks, and conduction disorders 24/7.',
      specs: ['12-Lead Digital Interpretation', 'Instant Emergency Printout', 'Bedside Portability Available', '24x7 Diagnostic Availability']
    },
    'ambulatory-bp': {
      title: 'Ambulatory BP Monitoring',
      badge: 'Hypertension Clinic',
      desc: '24-hour continuous automated blood pressure monitoring while you go about normal daily activities. Accurately diagnoses white-coat hypertension, nocturnal dipping, and medication efficacy.',
      specs: ['24-Hour Automated Recording', 'Oscillometric High Accuracy', 'Circadian Rhythm Profiling', 'Comprehensive Graph Report']
    },
    'medicine-deptt': {
      title: 'Medicine Deptt',
      badge: 'Super Speciality',
      desc: 'Comprehensive clinical diagnosis and internal medicine management led by senior physicians. Expert care for diabetes, hypertension, infectious diseases, and multi-organ conditions.',
      specs: ['Senior MD Consultants', 'Evidence-based Protocol', 'Inpatient & Outpatient Care', 'Integrated Multi-speciality Support']
    },
    'operation-facility': {
      title: 'Operation Facility',
      badge: 'Surgical Suites',
      desc: 'Ultra-modern modular operation theatres equipped with laminar airflow, HEPA filtration, advanced anesthesia workstations, and C-arm fluoroscopy for minimally invasive and open surgeries.',
      specs: ['Laminar Airflow & HEPA Clean Room', 'High-definition Laparoscopy Suites', 'Advanced Anesthesia Workstation', 'Dedicated Post-Op Recovery ICU']
    },
    'gynaecology': {
      title: 'Gynaecology Deptt.',
      badge: 'Women & Child Health',
      desc: 'Compassionate and comprehensive healthcare for women at every stage of life. High-risk pregnancy management, painless delivery, fetal monitoring, and gynecological laparoscopic surgeries.',
      specs: ['Dedicated Delivery Suites', 'High-Risk Pregnancy Unit', 'Laparoscopic Hysterectomy', 'Fetal Doppler Monitoring']
    },
    'ultrasound': {
      title: 'Ultrasound (USG)',
      badge: 'Advanced Imaging',
      desc: 'High-definition 3D/4D ultrasound imaging for abdominal, pelvic, obstetrics, vascular, and musculoskeletal diagnostics. Performed by certified specialist radiologists.',
      specs: ['High-Definition 3D/4D Transducers', 'Abdominal & Pelvic Sonography', 'Anomaly Scans for Pregnancy', 'Color Doppler Integration']
    },
    'orthopedic': {
      title: 'Orthopedic Deptt.',
      badge: 'Bone & Joint Care',
      desc: 'Advanced care for fractures, joint replacements (knee & hip), sports injuries, spine care, and arthritis management by experienced orthopedic surgeons.',
      specs: ['Complex Trauma & Fracture Fixation', 'Joint Replacement (Knee & Hip)', 'Arthroscopy & Sports Medicine', 'Digital C-Arm Precision']
    },
    'x-ray': {
      title: 'X-Ray (Digital Radiography)',
      badge: 'Radiology',
      desc: 'High-frequency digital radiography offering ultra-sharp skeletal and chest imaging with minimal radiation dosage. Instant digital delivery to consulting doctors.',
      specs: ['Low-Dose Digital Radiography (DR)', 'Instant PACS Image Viewing', 'Chest, Spine & Extremity Scans', '24x7 Emergency X-Ray']
    },
    'lab-pharmacy': {
      title: 'Lab Facility | Pharmacy 24 Hrs',
      badge: '24/7 Diagnostics & Meds',
      desc: 'Fully automated pathology, biochemistry, hematology, and microbiology testing lab, alongside an in-house pharmacy stocked 24x7 with authentic medications and surgical supplies.',
      specs: ['Automated Biochemistry & Hematology', 'Strict Quality Controls (EQAS)', '24x7 In-House Open Pharmacy', 'Cold Chain Medicine Storage']
    },
    'ent-dental-eye': {
      title: 'ENT-Dental-Eye',
      badge: 'Specialized Clinics',
      desc: 'Dedicated suites for Ear, Nose, Throat diagnosis and endoscopic procedures, digital dental care (root canal, implants, smile design), and advanced ophthalmic eye examinations.',
      specs: ['Video Endoscopy for ENT', 'Digital Dental RVG & Chair', 'Ophthalmic Slit Lamp & Refraction', 'Microsurgical Equipment']
    },
    'physiotherapist': {
      title: 'Physiotherapist',
      badge: 'Rehabilitation & Recovery',
      desc: 'Modern rehabilitation and physical therapy center. Specializing in post-operative recovery, stroke rehabilitation, sports injury rehab, and spine/joint pain relief.',
      specs: ['Electrotherapy & Ultrasound Therapy', 'Traction & Manual Mobilization', 'Post-Op Orthopedic Rehabilitation', 'Custom Exercise Regimens']
    },
    'doppler-echo': {
      title: '2 D Colour Doppler Echocardiography',
      badge: 'Advanced Cardiology',
      desc: 'Gold-standard non-invasive cardiac evaluation evaluating heart chamber dimensions, wall motion, valve functionality, ejection fraction, and blood flow velocity with vivid color Doppler.',
      specs: ['Real-Time Color Flow Mapping', 'Valve Regurgitation & Stenosis Assessment', 'Left Ventricular Ejection Fraction (EF)', 'Pediatric & Adult Cardiology']
    }
  };

  const facilityModal = document.getElementById('facility-modal');
  const facilityModalTitle = document.getElementById('facility-modal-title');
  const facilityModalBadge = document.getElementById('facility-modal-badge');
  const facilityModalDesc = document.getElementById('facility-modal-desc');
  const facilityModalSpecs = document.getElementById('facility-modal-specs');

  window.openFacilityModal = function(facilityKey) {
    const data = facilitiesData[facilityKey];
    if (!data || !facilityModal) return;

    facilityModalTitle.textContent = data.title;
    facilityModalBadge.textContent = data.badge;
    facilityModalDesc.textContent = data.desc;

    facilityModalSpecs.innerHTML = '';
    data.specs.forEach(spec => {
      const li = document.createElement('li');
      li.style.cssText = 'display: flex; align-items: center; gap: 8px; font-size: 0.9rem; margin-bottom: 8px; font-weight: 600; color: #1e293b;';
      li.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0070f3" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> ${spec}`;
      facilityModalSpecs.appendChild(li);
    });

    facilityModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Modal Close Handlers
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', function (e) {
      if (e.target === this || e.target.closest('.modal-close-btn')) {
        this.classList.remove('active');
        document.body.style.overflow = 'auto';

        // Stop video playback if video modal
        const iframe = this.querySelector('iframe');
        if (iframe) {
          const src = iframe.getAttribute('src');
          iframe.setAttribute('src', src);
        }
      }
    });
  });

  // Appointment Booking Modal Triggers & Form Handler
  const appointmentModal = document.getElementById('appointment-modal');
  window.openAppointmentModal = function(preselectedDept) {
    if (appointmentModal) {
      if (preselectedDept) {
        const deptSelect = document.getElementById('apt-department');
        if (deptSelect) deptSelect.value = preselectedDept;
      }
      appointmentModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const aptForm = document.getElementById('appointment-form');
  const aptSuccessMsg = document.getElementById('appointment-success');
  if (aptForm) {
    aptForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const patientName = document.getElementById('apt-name').value;
      const patientPhone = document.getElementById('apt-phone').value;
      const dept = document.getElementById('apt-department').value;
      const date = document.getElementById('apt-date').value;

      // Generate realistic booking reference
      const token = 'PRTH-' + Math.floor(1000 + Math.random() * 9000);

      if (aptSuccessMsg) {
        aptForm.style.display = 'none';
        aptSuccessMsg.style.display = 'block';
        aptSuccessMsg.innerHTML = `
          <div style="text-align: center; padding: 20px 0;">
            <div style="width: 70px; height: 70px; border-radius: 50%; background: #e6f9f0; color: #10b981; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h3 style="font-size: 1.5rem; font-weight: 800; color: #081b33; margin-bottom: 8px;">Appointment Confirmed!</h3>
            <p style="color: #64748b; font-size: 0.95rem; margin-bottom: 16px;">Thank you, <strong>${patientName}</strong>. Your appointment in <strong>${dept}</strong> is scheduled for <strong>${date}</strong>.</p>
            <div style="background: #f1f5f9; padding: 12px; border-radius: 8px; display: inline-block; font-family: monospace; font-weight: 800; font-size: 1.1rem; color: #0070f3; margin-bottom: 20px;">
              Booking ID: ${token}
            </div>
            <p style="font-size: 0.82rem; color: #8899a6;">Our patient care team will contact you at <strong>${patientPhone}</strong> shortly.</p>
            <button onclick="closeAllModals()" class="btn-pill-primary" style="margin-top: 20px; width: 100%;">Done</button>
          </div>
        `;
      }
    });
  }

  // Story Video Modal
  const storyModal = document.getElementById('story-modal');
  window.openStoryModal = function() {
    if (storyModal) {
      storyModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  // Search Modal
  const searchModal = document.getElementById('search-modal');
  window.openSearchModal = function() {
    if (searchModal) {
      searchModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      const input = document.getElementById('search-input');
      if (input) setTimeout(() => input.focus(), 100);
    }
  };

  window.closeAllModals = function() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.classList.remove('active');
    });
    document.body.style.overflow = 'auto';
  };

  // Blog Reader Modal
  const blogModal = document.getElementById('blog-modal');
  const blogModalTitle = document.getElementById('blog-modal-title');
  const blogModalBody = document.getElementById('blog-modal-body');

  const blogsData = {
    'excellence': {
      title: 'Redefining Healthcare Excellence in Jharkhand',
      date: '30 August 2024',
      author: 'Dr. Parth Medical Board',
      body: `
        <p>At Parth Super Speciality Hospital, healthcare excellence is defined by our commitment to delivering tertiary-level medical care accessible to every patient across Ranchi and surrounding regions.</p>
        <p>By blending compassionate human touch with state-of-the-art diagnostic machinery—including high-resolution 12-lead ECG, digital radiography, ultrasound, and dedicated 2D Colour Doppler—we ensure timely diagnoses that save lives.</p>
        <p>Our modular operation theatres with HEPA laminar air control provide infection-free surgical environments for orthopedic trauma, gynecological interventions, and general surgery.</p>
      `
    },
    'exceptional-care': {
      title: 'Discover Exceptional Care at Parth SuperSpeciality Hospital',
      date: '30 August 2024',
      author: 'Editorial Desk',
      body: `
        <p>Strategically situated along Ranchi Ring Road, Parth Hospital was established with the express vision to decentralize super-speciality health care and bring metropolitan clinical standards directly to Jharkhand.</p>
        <p>Equipped with 24-hour round-the-clock emergency support, in-house pharmacy, comprehensive pathology, and intensive cardiac monitoring, patients no longer need to travel outside the state for advanced treatments.</p>
        <p>Our multidisciplinary team of 500+ affiliated doctors and empathetic nursing staff treat every patient with dignity, honesty, and tender loving care.</p>
      `
    }
  };

  window.openBlogModal = function(slug) {
    const data = blogsData[slug];
    if (!data || !blogModal) return;

    blogModalTitle.textContent = data.title;
    blogModalBody.innerHTML = `
      <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 16px; font-weight: 600;">
        📅 ${data.date} &nbsp;|&nbsp; ✍️ ${data.author}
      </div>
      <div style="font-size: 1.02rem; line-height: 1.8; color: #334155;">
        ${data.body}
      </div>
      <button onclick="closeAllModals()" class="btn-pill-primary" style="margin-top: 24px;">Close Article</button>
    `;
    blogModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Search filter functionality
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  if (searchInput && searchResults) {
    const searchableItems = [
      { name: 'ECG (Electrocardiography)', cat: 'Facilities', key: 'ecg' },
      { name: 'Ambulatory BP Monitoring', cat: 'Facilities', key: 'ambulatory-bp' },
      { name: 'Cardiology & 2D Echo', cat: 'Departments', key: 'doppler-echo' },
      { name: 'Medicine Deptt', cat: 'Departments', key: 'medicine-deptt' },
      { name: 'Operation Facility (Modular OTs)', cat: 'Facilities', key: 'operation-facility' },
      { name: 'Gynaecology & Maternity', cat: 'Departments', key: 'gynaecology' },
      { name: 'Ultrasound / 4D USG', cat: 'Facilities', key: 'ultrasound' },
      { name: 'Orthopedics & Joint Replacement', cat: 'Departments', key: 'orthopedic' },
      { name: 'Digital X-Ray', cat: 'Facilities', key: 'x-ray' },
      { name: '24 Hour Pharmacy & Pathology Lab', cat: 'Facilities', key: 'lab-pharmacy' },
      { name: 'ENT - Dental - Eye', cat: 'Clinics', key: 'ent-dental-eye' },
      { name: 'Physiotherapy & Rehabilitation', cat: 'Facilities', key: 'physiotherapist' }
    ];

    searchInput.addEventListener('input', function () {
      const q = this.value.toLowerCase().trim();
      searchResults.innerHTML = '';

      if (q.length === 0) {
        searchResults.innerHTML = '<p style="color: #94a3b8; font-size: 0.9rem; text-align: center; padding: 20px;">Type a facility, specialty, or test name...</p>';
        return;
      }

      const matches = searchableItems.filter(item =>
        item.name.toLowerCase().includes(q) || item.cat.toLowerCase().includes(q)
      );

      if (matches.length === 0) {
        searchResults.innerHTML = '<p style="color: #94a3b8; font-size: 0.9rem; text-align: center; padding: 20px;">No matching facilities found.</p>';
        return;
      }

      matches.forEach(item => {
        const div = document.createElement('div');
        div.style.cssText = 'padding: 12px 16px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: background 0.2s;';
        div.innerHTML = `
          <div>
            <div style="font-weight: 700; color: #081b33; font-size: 0.95rem;">${item.name}</div>
            <div style="font-size: 0.75rem; color: #0070f3; font-weight: 600;">${item.cat}</div>
          </div>
          <span style="color: #0070f3; font-size: 0.85rem; font-weight: 700;">View Details →</span>
        `;
        div.addEventListener('mouseenter', () => div.style.background = '#f8fafc');
        div.addEventListener('mouseleave', () => div.style.background = 'transparent');
        div.addEventListener('click', () => {
          closeAllModals();
          openFacilityModal(item.key);
        });
        searchResults.appendChild(div);
      });
    });
  }

  // Scroll To Top Function
  window.scrollToTop = function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Mobile Nav Drawer Toggle
  window.toggleMobileNav = function() {
    const nav = document.querySelector('.parth-nav');
    const toggle = document.querySelector('.mobile-menu-toggle');
    if (nav) {
      const isOpen = nav.classList.toggle('mobile-open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      if (toggle) toggle.setAttribute('aria-expanded', String(isOpen));
      if (toggle) toggle.setAttribute('aria-label', isOpen ? 'Close Navigation' : 'Open Navigation');

      if (!isOpen) {
        nav.querySelectorAll('.nav-item-dropdown.dropdown-open').forEach(function(item) {
          item.classList.remove('dropdown-open');
        });
      }
    }
  };

  window.addEventListener('resize', function() {
    const nav = document.querySelector('.parth-nav');
    if (window.innerWidth > 1024 && nav && nav.classList.contains('mobile-open')) {
      window.toggleMobileNav();
    }
  });

  // Mobile Dropdown Sub-menu Click Toggle
  document.querySelectorAll('.nav-item-dropdown > a').forEach(function(link) {
    link.addEventListener('click', function(e) {
      // On mobile, toggle the dropdown instead of navigating immediately.
      const nav = document.querySelector('.parth-nav');
      if (nav && nav.classList.contains('mobile-open')) {
        e.preventDefault();
        const parent = this.closest('.nav-item-dropdown');
        const wasOpen = parent.classList.contains('dropdown-open');
        // Close all other dropdowns
        document.querySelectorAll('.nav-item-dropdown.dropdown-open').forEach(function(el) {
          el.classList.remove('dropdown-open');
        });
        if (!wasOpen) {
          parent.classList.add('dropdown-open');
        }
      }
    });
  });

  // Close mobile nav when clicking outside
  document.addEventListener('click', function(e) {
    const nav = document.querySelector('.parth-nav');
    const toggle = document.querySelector('.mobile-menu-toggle');
    if (nav && toggle && nav.classList.contains('mobile-open')) {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('mobile-open');
        document.body.style.overflow = '';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open Navigation');
        nav.querySelectorAll('.nav-item-dropdown.dropdown-open').forEach(function(item) {
          item.classList.remove('dropdown-open');
        });
      }
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const nav = document.querySelector('.parth-nav');
      if (nav && nav.classList.contains('mobile-open')) {
        window.toggleMobileNav();
      }
    }
  });

  // FAQ Accordion Toggle
  window.toggleFaq = function(button) {
    const item = button.closest('.faq-item');
    if (!item) return;
    const isActive = item.classList.contains('active');

    // Close other FAQ items
    document.querySelectorAll('.faq-item').forEach(el => {
      el.classList.remove('active');
      const icon = el.querySelector('.faq-icon');
      if (icon) icon.textContent = '+';
    });

    if (!isActive) {
      item.classList.add('active');
      const icon = item.querySelector('.faq-icon');
      if (icon) icon.textContent = '—';
    }
  };

  // Parth Split Contact Form Handler
  window.handleParthForm = function(event) {
    event.preventDefault();
    const name = document.getElementById('cf-name').value;
    const phone = document.getElementById('cf-phone').value;
    const successMsg = document.getElementById('contact-form-success');
    if (successMsg) {
      successMsg.style.display = 'block';
      successMsg.textContent = `✓ Thank you, ${name}! Your appointment request has been scheduled. Our team will call you at ${phone}.`;
    }
    const form = document.getElementById('parth-booking-form');
    if (form) form.reset();
  };

  // Modal Appointment Submission Handler
  window.handleAppointmentSubmit = function(event) {
    event.preventDefault();
    const name = document.getElementById('apt-name').value;
    const phone = document.getElementById('apt-phone').value;
    const dept = document.getElementById('apt-department').value;
    const date = document.getElementById('apt-date').value;
    const token = 'PRTH-' + Math.floor(1000 + Math.random() * 9000);

    const form = document.getElementById('appointment-form');
    const successMsg = document.getElementById('appointment-success');

    if (form && successMsg) {
      form.style.display = 'none';
      successMsg.style.display = 'block';
      successMsg.innerHTML = `
        <div style="text-align: center; padding: 10px 0;">
          <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(242, 142, 107, 0.2); color: #f28e6b; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 28px; font-weight: 800;">
            ✓
          </div>
          <h3 style="font-size: 1.4rem; font-weight: 800; color: #0c2d28; margin-bottom: 8px;">Appointment Confirmed!</h3>
          <p style="color: #61736e; font-size: 0.95rem; margin-bottom: 16px;">Thank you, <strong>${name}</strong>. Your visit in <strong>${dept}</strong> is requested for <strong>${date}</strong>.</p>
          <div style="background: #f1f5f3; padding: 10px 20px; border-radius: 6px; display: inline-block; font-family: monospace; font-weight: 800; font-size: 1.1rem; color: #0c2d28; margin-bottom: 20px;">
            Booking ID: ${token}
          </div>
          <p style="font-size: 0.82rem; color: #8aa89f;">Our patient care team will contact you at <strong>${phone}</strong> shortly.</p>
          <button onclick="closeAllModals()" class="btn-coral-pill" style="margin-top: 15px; width: 100%; justify-content: center;">Done</button>
        </div>
      `;
    }
  };
  // Global Floating Action Helpline Buttons (Call, WhatsApp, Gmail)
  if (!document.querySelector('.parth-floating-actions')) {
    const floatWrap = document.createElement('div');
    floatWrap.className = 'parth-floating-actions';
    floatWrap.setAttribute('aria-label', 'Floating Action Helpline');
    floatWrap.innerHTML = `
      <a href="tel:+916202747361" class="float-btn float-call" title="Call Emergency Desk" aria-label="Call Emergency">
        <span class="float-tooltip">Call: +91 6202747361</span>
        <i class="fa-solid fa-phone"></i>
      </a>
      <a href="https://api.whatsapp.com/send?phone=+916202747361&text=Hello%20Parth%20Hospital,%20I%20would%20like%20to%20inquire%20about%20appointments." target="_blank" rel="noopener noreferrer" class="float-btn float-whatsapp" title="WhatsApp Chat" aria-label="Chat on WhatsApp">
        <span class="float-tooltip">WhatsApp Chat</span>
        <i class="fa-brands fa-whatsapp"></i>
      </a>
      <a href="mailto:parthsuperspecialityhospital@gmail.com?subject=Inquiry%20regarding%20Parth%20Hospital" class="float-btn float-gmail" title="Send Email" aria-label="Send Email">
        <span class="float-tooltip">Email Us</span>
        <i class="fa-solid fa-envelope"></i>
      </a>
    `;
    document.body.appendChild(floatWrap);
  }
});
