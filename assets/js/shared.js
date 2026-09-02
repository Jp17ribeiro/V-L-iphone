(function () {
  'use strict';
  const config = window.VL_CONFIG;
  const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  window.VL = {
    money: value => money.format(Number(value) || 0),
    whatsapp(message) {
      if (!/^\d{12,13}$/.test(config.whatsapp)) {
        window.dispatchEvent(new CustomEvent('vl:notice', { detail: 'WhatsApp ainda nao configurado. Use a secao de contato para falar com a loja.' }));
        return false;
      }
      window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
      return true;
    }
  };

  const menuButton = document.querySelector('[data-menu-button]');
  const menu = document.querySelector('[data-menu]');
  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('click', event => {
      if (event.target.closest('a')) { menu.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false'); }
    });
  }
  const header = document.querySelector('.site-header');
  const updateHeader = () => header && header.classList.toggle('is-scrolled', scrollY > 20);
  addEventListener('scroll', updateHeader, { passive: true }); updateHeader();
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  document.querySelectorAll('.faq details').forEach(detail => {
    const summary = detail.querySelector('summary');
    if (!summary) return;
    summary.setAttribute('aria-expanded', String(detail.open));
    detail.addEventListener('toggle', () => summary.setAttribute('aria-expanded', String(detail.open)));
  });
  document.querySelectorAll('[data-whatsapp]').forEach(el => el.addEventListener('click', event => {
    event.preventDefault();
    window.VL.whatsapp(el.dataset.message || 'Ola! Gostaria de mais informacoes sobre os iPhones da V&L Imports.');
  }));
  const toast = document.querySelector('[data-toast]');
  addEventListener('vl:notice', event => {
    if (!toast) return;
    toast.textContent = event.detail; toast.hidden = false;
    clearTimeout(window.vlToastTimer); window.vlToastTimer = setTimeout(() => { toast.hidden = true; }, 5000);
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(e => e.target.classList.toggle('revealed', e.isIntersecting)), { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
})();
