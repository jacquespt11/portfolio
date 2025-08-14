// ==============================
// Helpers
// ==============================
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', () => {
  // 1) Scroll reveal animations
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => io.observe(el));
  } else {
    // Fallback si IO n'est pas supporté
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // 2) Smooth scroll interne + focus accessibilité
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      const heading = target.querySelector('h2, h1, [tabindex]');
      setTimeout(() => {
        (heading || target).setAttribute('tabindex', '-1');
        (heading || target).focus({ preventScroll: true });
      }, 450);
    });
  });

  // 3) Form validation & feedback
  const form = $('#contactForm');
  if (form) {
    const nameEl = $('#name');
    const emailEl = $('#email');
    const msgEl = $('#message');
    const feedback = $('#formMessage');

    const ensureErrorNode = (el) => {
      let node = el.nextElementSibling;
      if (!node || !node.classList || !node.classList.contains('field-error')) {
        node = document.createElement('div');
        node.className = 'field-error';
        node.setAttribute('aria-live', 'polite');
        el.insertAdjacentElement('afterend', node);
      }
      return node;
    };

    const setError = (el, message = '') => {
      const node = ensureErrorNode(el);
      node.textContent = message;
      el.setAttribute('aria-invalid', message ? 'true' : 'false');
    };

    const isEmail = (val) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val.trim());

    const validateName = () => {
      const v = nameEl.value.trim();
      if (v.length < 2) { setError(nameEl, 'Nom trop court.'); return false; }
      setError(nameEl, ''); return true;
    };

    const validateEmail = () => {
      const v = emailEl.value.trim();
      if (!isEmail(v)) { setError(emailEl, 'Email invalide.'); return false; }
      setError(emailEl, ''); return true;
    };

    const validateMsg = () => {
      const v = msgEl.value.trim();
      if (v.length < 10) { setError(msgEl, 'Message trop court (min. 10 caractères).'); return false; }
      setError(msgEl, ''); return true;
    };

    nameEl.addEventListener('input', validateName);
    emailEl.addEventListener('input', validateEmail);
    msgEl.addEventListener('input', validateMsg);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const ok = [validateName(), validateEmail(), validateMsg()].every(Boolean);

      if (!ok) {
        feedback.textContent = 'Veuillez corriger les champs indiqués.';
        feedback.classList.remove('success'); 
        feedback.classList.add('error');
        return;
      }

      const subject = encodeURIComponent('Contact Portfolio – Perfect TSHIBANGU JACQUES');
      const body = encodeURIComponent(
        `Nom: ${nameEl.value}\nEmail: ${emailEl.value}\n\nMessage:\n${msgEl.value}`
      );

      feedback.textContent = 'Merci, votre message a été envoyé !';
      feedback.classList.remove('error');
      feedback.classList.add('success');

      form.reset();
      [nameEl, emailEl, msgEl].forEach(el => setError(el, ''));
    });
  }

  // 4) Highlight de la section active
  const sections = $$('section[id]');
  const navLinks = $$('a[href^="#"]');
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(a => {
            const match = a.getAttribute('href').slice(1) === id;
            a.classList.toggle('active', match);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });
    sections.forEach(sec => spy.observe(sec));
  }

  // 5) Animation du footer au scroll
  const footer = document.querySelector(".footer");
  if (footer && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          footer.classList.add("visible");
        }
      });
    }, { threshold: 0.2 });

    observer.observe(footer);
  }
});
