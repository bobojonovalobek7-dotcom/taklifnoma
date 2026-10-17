/**
 * TAKLIFET ULTRA-LUXURY ANIMATION CONTROLLER
 * Muxammad & Maxsuda — 1-Noyabr 2026
 * 3D Envelope, Botanical Draw, Blur Reveals, Falling Leaves & Modal
 */

// Global navigation hook for HTML inline onclick
let goToPage = null;

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // CONFIGURATION & STATE
  // =========================================================================
  const WEDDING_DATE = new Date('2026-11-01T18:00:00+05:00'); // 1-noyabr 2026, 18:00
  const TELEGRAM_USERNAME = 'Muxammad_Erimbetov';
  
  const TELEGRAM_BOT_CONFIG = {
    token: '',
    chatId: ''
  };

  let currentPage = 0;
  const TOTAL_PAGES = 6;
  let isThrottled = false;
  let touchStartY = 0;
  let touchStartX = 0;

  // DOM Elements
  const pagesWrapper = document.getElementById('pagesWrapper');
  const pageSlides = document.querySelectorAll('.page-slide');
  const pageDotsNav = document.getElementById('pageDotsNav');
  const dotButtons = document.querySelectorAll('.dot-btn');
  const weddingAudio = document.getElementById('weddingAudio');
  const audioPill = document.getElementById('audioPill');
  const soundWave = document.getElementById('soundWave');
  const audioDisc = document.getElementById('audioDisc');
  const audioStatusText = document.getElementById('audioStatusText');

  // Envelope & Dove Elements
  const envelopeOverlay = document.getElementById('envelopeOverlay');
  const envelopeCard = document.getElementById('envelopeCard');
  const waxSealBtn = document.getElementById('waxSealBtn');
  const sealBurst = document.getElementById('sealBurst');
  const flyingDove = document.getElementById('flyingDove');
  const doveCarriedLetter = document.getElementById('doveCarriedLetter');
  const doveSparkles = document.getElementById('doveSparkles');
  const envelopeHint = document.getElementById('envelopeHint');

  // Modal Elements
  const btnOpenWishes = document.getElementById('btnOpenWishes');
  const wishesModal = document.getElementById('wishesModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const wishesForm = document.getElementById('wishesForm');
  const guestNameInput = document.getElementById('guestName');
  const guestWishInput = document.getElementById('guestWish');
  const submitBtnText = document.getElementById('submitBtnText');

  // =========================================================================
  // 1. PAGE-BY-PAGE SLIDER NAVIGATION WITH TAKLIFET REVEAL CONTROLLER
  // =========================================================================
  goToPage = function(targetIndex) {
    if (targetIndex < 0 || targetIndex >= TOTAL_PAGES) return;
    currentPage = targetIndex;

    // Slide container smoothly by 100dvh per page
    if (pagesWrapper) {
      pagesWrapper.style.transform = `translateY(-${currentPage * 100}dvh)`;
    }

    // Trigger Reveal System: Set data-inview on active page smoothly
    pageSlides.forEach((slide, idx) => {
      slide.scrollTop = 0;
      if (idx === currentPage) {
        slide.setAttribute('data-inview', 'true');
      } else {
        slide.setAttribute('data-inview', 'false');
      }
    });

    // Update Dots indicator if present
    if (dotButtons && dotButtons.length > 0) {
      dotButtons.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentPage);
      });
    }
  };

  // Dot buttons click listener (if exists)
  if (dotButtons) {
    dotButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        goToPage(idx);
      });
    });
  }

  // Wheel listener: Single wheel turn switches exactly ONE page
  window.addEventListener('wheel', (e) => {
    if (!envelopeOverlay.classList.contains('opened')) return;
    if (wishesModal && wishesModal.classList.contains('open')) return;
    if (isThrottled) return;

    if (Math.abs(e.deltaY) > 20) {
      if (e.deltaY > 0) {
        if (currentPage < TOTAL_PAGES - 1) {
          goToPage(currentPage + 1);
          triggerScrollThrottle(520);
        }
      } else {
        if (currentPage > 0) {
          goToPage(currentPage - 1);
          triggerScrollThrottle(520);
        }
      }
    }
  }, { passive: true });

  // Touch swipe listener for smartphones
  let isSwiping = false;

  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
    isSwiping = true;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (!envelopeOverlay.classList.contains('opened')) return;
    if (wishesModal && wishesModal.classList.contains('open')) return;
    if (isThrottled || !isSwiping) return;
    isSwiping = false;

    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const diffY = touchStartY - touchEndY;
    const diffX = touchStartX - touchEndX;

    if (Math.abs(diffY) > 35 && Math.abs(diffY) > Math.abs(diffX) * 1.1) {
      if (diffY > 0) {
        if (currentPage < TOTAL_PAGES - 1) {
          goToPage(currentPage + 1);
          triggerScrollThrottle(520);
        }
      } else {
        if (currentPage > 0) {
          goToPage(currentPage - 1);
          triggerScrollThrottle(520);
        }
      }
    }
  }, { passive: true });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (wishesModal && wishesModal.classList.contains('open')) {
      if (e.key === 'Escape') closeModal();
      return;
    }

    if (!envelopeOverlay.classList.contains('opened')) return;

    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      if (currentPage < TOTAL_PAGES - 1) goToPage(currentPage + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      if (currentPage > 0) goToPage(currentPage - 1);
    }
  });

  function triggerScrollThrottle(ms) {
    isThrottled = true;
    setTimeout(() => {
      isThrottled = false;
    }, ms);
  }

  // =========================================================================
  // DOVE FLIGHT & ENVELOPE DELIVERY TIMING
  // =========================================================================
  let isEnvelopeDelivered = false;

  // Sparkle Trail behind Dove
  if (doveSparkles && flyingDove) {
    const starSymbols = ['✦', '✧', '⋆', '•'];
    let count = 0;
    const sparkleInterval = setInterval(() => {
      count++;
      if (count > 25 || !envelopeOverlay || envelopeOverlay.classList.contains('opened')) {
        clearInterval(sparkleInterval);
        return;
      }
      const rect = flyingDove.getBoundingClientRect();
      if (rect.width > 0 && rect.left < window.innerWidth) {
        const star = document.createElement('span');
        star.className = 'dove-sparkle-star';
        star.textContent = starSymbols[Math.floor(Math.random() * starSymbols.length)];
        star.style.left = `${rect.left + rect.width * 0.35 + (Math.random() * 20 - 10)}px`;
        star.style.top = `${rect.top + rect.height * 0.55 + (Math.random() * 20 - 10)}px`;
        star.style.fontSize = `${Math.floor(Math.random() * 10 + 10)}px`;
        doveSparkles.appendChild(star);
        setTimeout(() => star.remove(), 1200);
      }
    }, 110);
  }

  // 1900ms: Dove arrives at center and drops envelope
  setTimeout(() => {
    if (doveCarriedLetter) {
      doveCarriedLetter.classList.add('dropped');
    }
    if (envelopeCard) {
      envelopeCard.classList.remove('dove-delivery');
      envelopeCard.classList.add('dove-delivered');
    }
    isEnvelopeDelivered = true;
  }, 1900);

  // 2700ms: Envelope settles, show hint to click wax seal
  setTimeout(() => {
    if (envelopeHint) {
      envelopeHint.classList.add('visible');
    }
  }, 2700);

  // =========================================================================
  // 2. INTRO: 3D WAX SEAL & ENVELOPE OPENING ANIMATION
  // =========================================================================
  function openEnvelope() {
    if (!isEnvelopeDelivered) return; // Wait until dove drops the letter!
    if (envelopeCard.classList.contains('open')) return;

    // 1. Flap & inner letter animation
    envelopeCard.classList.add('open');

    // 2. Particle burst from seal
    createSealBurst();

    // 3. Audio playback
    if (weddingAudio) {
      weddingAudio.volume = 0.85;
      weddingAudio.play().then(() => {
        updateAudioUI(true);
      }).catch(err => {
        console.log('Audio autoplay blocked by browser policy:', err);
      });
    }

    // 4. Smooth dissolve into Page 1
    setTimeout(() => {
      envelopeOverlay.classList.add('opened');
      if (audioPill) audioPill.classList.remove('hidden');
      if (pageDotsNav) pageDotsNav.classList.remove('hidden');
      goToPage(0); // Trigger Page 1 animations
    }, 950);
  }

  if (waxSealBtn) waxSealBtn.addEventListener('click', openEnvelope);
  if (envelopeCard) envelopeCard.addEventListener('click', openEnvelope);

  function createSealBurst() {
    if (!sealBurst) return;
    sealBurst.innerHTML = '';
    const colors = ['#ffd700', '#fcedb2', '#c89e34', '#ffffff'];

    for (let i = 0; i < 30; i++) {
      const dot = document.createElement('span');
      dot.className = 'burst-dot';
      const angle = (Math.PI * 2 / 30) * i;
      const dist = Math.random() * 80 + 40;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      const rot = Math.random() * 180;

      dot.style.setProperty('--motif-tx', `${tx}px`);
      dot.style.setProperty('--motif-ty', `${ty}px`);
      dot.style.setProperty('--motif-rot', `${rot}deg`);
      dot.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      sealBurst.appendChild(dot);
    }
  }

  // =========================================================================
  // 3. AUDIO PILL TOGGLE
  // =========================================================================
  function updateAudioUI(playing) {
    if (playing) {
      soundWave.classList.add('playing');
      audioDisc.classList.add('spinning');
      audioStatusText.textContent = 'Kuy';
    } else {
      soundWave.classList.remove('playing');
      audioDisc.classList.remove('spinning');
      audioStatusText.textContent = 'Pauza';
    }
  }

  if (audioPill) {
    audioPill.addEventListener('click', () => {
      if (!weddingAudio) return;
      if (weddingAudio.paused) {
        weddingAudio.play().then(() => updateAudioUI(true)).catch(console.error);
      } else {
        weddingAudio.pause();
        updateAudioUI(false);
      }
    });
  }

  // =========================================================================
  // 4. COUNTDOWN TIMER WITH ROLL-IN TICK ANIMATION
  // =========================================================================
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMinutes = document.getElementById('cdMinutes');
  const cdSeconds = document.getElementById('cdSeconds');
  let lastSec = '';

  function updateCountdown() {
    const now = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      if (cdDays) cdDays.textContent = '00';
      if (cdHours) cdHours.textContent = '00';
      if (cdMinutes) cdMinutes.textContent = '00';
      if (cdSeconds) cdSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const sStr = String(seconds).padStart(2, '0');
    if (cdDays) cdDays.textContent = String(days).padStart(2, '0');
    if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
    if (cdMinutes) cdMinutes.textContent = String(minutes).padStart(2, '0');

    if (cdSeconds && sStr !== lastSec) {
      cdSeconds.textContent = sStr;
      cdSeconds.classList.remove('ticking');
      void cdSeconds.offsetWidth; // Force reflow
      cdSeconds.classList.add('ticking');
      lastSec = sStr;
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // =========================================================================
  // 5. CALENDAR ACTIONS (GOOGLE CALENDAR & ICAL .ICS)
  // =========================================================================
  const btnGoogleCalendar = document.getElementById('btnGoogleCalendar');
  const btnAppleCalendar = document.getElementById('btnAppleCalendar');

  if (btnGoogleCalendar) {
    const title = encodeURIComponent("Muxammad & Maxsuda — Nikoh To'yi Tantanasi");
    const details = encodeURIComponent("Muxammad va Maxsudaning nikoh to'yi tantanasi. Sizni ushbu quvonchli oqshomda ko'rishdan behad mamnun bo'lamiz!");
    const location = encodeURIComponent("“Kristal” to'yxonasi, Beruniy tumani");
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261101T130000Z/20261101T170000Z&details=${details}&location=${location}`;
    btnGoogleCalendar.href = gCalUrl;
  }

  if (btnAppleCalendar) {
    btnAppleCalendar.addEventListener('click', () => {
      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Taklifnoma//Muxammad va Maxsuda To\'yi//UZ',
        'BEGIN:VEVENT',
        'UID:muxammad-maxsuda-wedding-20261101@taklifnoma',
        'DTSTAMP:20261101T130000Z',
        'DTSTART:20261101T130000Z',
        'DTEND:20261101T170000Z',
        'SUMMARY:Muxammad & Maxsuda — Nikoh To\'yi',
        'DESCRIPTION:Muxammad va Maxsudaning nikoh to\'yi tantanasi. Beruniy tumani Kristal to\'yxonasi.',
        'LOCATION:Kristal to\'yxonasi, Beruniy tumani',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'Muxammad_Maxsuda_Toyi.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // =========================================================================
  // 6. SUYUNCHI BANK CARD 3D TILT & 1-CLICK COPY
  // =========================================================================
  const bankCard = document.getElementById('bankCard');
  const btnCopyCard = document.getElementById('btnCopyCard');
  const copyToast = document.getElementById('copyToast');
  const copyBtnText = document.getElementById('copyBtnText');

  if (bankCard) {
    const handleMove = (e) => {
      const rect = bankCard.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      if (!clientX || !clientY) return;

      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 12;

      bankCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    };

    const handleLeave = () => {
      bankCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    };

    bankCard.addEventListener('mousemove', handleMove);
    bankCard.addEventListener('mouseleave', handleLeave);
    bankCard.addEventListener('touchmove', handleMove, { passive: true });
    bankCard.addEventListener('touchend', handleLeave);
  }

  if (btnCopyCard) {
    btnCopyCard.addEventListener('click', () => {
      const rawCardNumber = '9860010408879400';

      navigator.clipboard.writeText(rawCardNumber).then(() => {
        showCopyToast();
      }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = rawCardNumber;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showCopyToast();
      });
    });
  }

  function showCopyToast() {
    if (!copyToast) return;
    copyToast.classList.add('show');
    if (copyBtnText) copyBtnText.textContent = 'Nusxa olindi! ✓';

    setTimeout(() => {
      copyToast.classList.remove('show');
      if (copyBtnText) copyBtnText.textContent = 'Karta raqamidan nusxa olish';
    }, 2800);
  }

  // =========================================================================
  // 7. WISHES MODAL POPUP & DIRECT TELEGRAM SENDING
  // =========================================================================
  function openModal() {
    if (!wishesModal) return;
    wishesModal.classList.add('open');
    wishesModal.setAttribute('aria-hidden', 'false');
    setTimeout(() => {
      if (guestNameInput) guestNameInput.focus();
    }, 200);
  }

  function closeModal() {
    if (!wishesModal) return;
    wishesModal.classList.remove('open');
    wishesModal.setAttribute('aria-hidden', 'true');
  }

  if (btnOpenWishes) btnOpenWishes.addEventListener('click', openModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  if (wishesForm) {
    wishesForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = guestNameInput.value.trim();
      const wish = guestWishInput.value.trim();
      const relationChecked = document.querySelector('input[name="relation"]:checked');
      const relation = relationChecked ? relationChecked.value : 'Mehmon';

      if (!name || !wish) return;

      const tgMessage = `💍 NIKOH TO'YI UCHUN YANGI TILAK!\n\n` +
                        `👤 Kimdan: ${name}\n` +
                        `🏷 Aloqasi: ${relation}\n` +
                        `💌 Tilak: "${wish}"\n\n` +
                        `✨ Muxammad & Maxsuda baxtli bo'linglar!`;

      if (TELEGRAM_BOT_CONFIG.token && TELEGRAM_BOT_CONFIG.chatId) {
        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_CONFIG.token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_BOT_CONFIG.chatId,
            text: tgMessage
          })
        }).catch(err => console.log('Telegram API silent error:', err));
      }

      const directTgUrl = `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(tgMessage)}`;
      
      if (submitBtnText) submitBtnText.textContent = 'Yuborilmoqda...';

      window.open(directTgUrl, '_blank');

      guestWishInput.value = '';
      guestNameInput.value = '';

      setTimeout(() => {
        if (submitBtnText) submitBtnText.textContent = 'Yuborildi! ✓';
        setTimeout(() => {
          closeModal();
          if (submitBtnText) submitBtnText.textContent = 'Tilakni yuborish';
        }, 1200);
      }, 800);
    });
  }

  // =========================================================================
  // 8. RSVP CHOICES (ALBATTA BORAMAN / KELA OLMAYMAN)
  // =========================================================================
  const btnRsvpYes = document.getElementById('btnRsvpYes');
  const btnRsvpNo = document.getElementById('btnRsvpNo');
  const rsvpStatusMsg = document.getElementById('rsvpStatusMsg');

  function handleRsvp(isAttending) {
    if (btnRsvpYes) btnRsvpYes.classList.toggle('selected', isAttending);
    if (btnRsvpNo) btnRsvpNo.classList.toggle('selected', !isAttending);

    if (rsvpStatusMsg) {
      rsvpStatusMsg.style.display = 'block';
      if (isAttending) {
        rsvpStatusMsg.innerHTML = '✨ Tashakkur! Sizni to\'yimizda quvonch bilan kutib olamiz!';
      } else {
        rsvpStatusMsg.innerHTML = '🕊️ E\'tiboringiz va samimiy tilaklaringiz uchun minnatdormiz!';
      }
    }
  }

  if (btnRsvpYes) btnRsvpYes.addEventListener('click', () => handleRsvp(true));
  if (btnRsvpNo) btnRsvpNo.addEventListener('click', () => handleRsvp(false));

  // =========================================================================
  // 9. SELF-DRAWING BOTANICAL CORNER SVGS INJECTION
  // =========================================================================
  fetch('botanical_gold.svg')
    .then(res => res.text())
    .then(svgText => {
      document.querySelectorAll('.botanical-corner').forEach(corner => {
        corner.innerHTML = svgText;
      });
    })
    .catch(err => console.log('Botanical SVG load note:', err));

});
