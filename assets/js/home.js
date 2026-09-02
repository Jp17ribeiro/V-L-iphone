(function () {
  'use strict';
  const grid = document.querySelector('[data-products]');
  if (!grid) return;
  const catalog = window.VL_CATALOG;
  const filters = document.querySelector('[data-filters]');
  const count = document.createElement('p');
  count.className = 'product-count';
  count.setAttribute('aria-live', 'polite');
  filters.insertAdjacentElement('afterend', count);
  const escape = value => String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  function render(items) {
    grid.textContent = '';
    count.textContent = `${items.length} ${items.length === 1 ? 'aparelho encontrado' : 'aparelhos encontrados'}`;
    if (!items.length) { const p=document.createElement('p'); p.className='empty-state'; p.textContent='Nenhum aparelho corresponde aos filtros.'; grid.append(p); return; }
    items.forEach(product => {
      const article = document.createElement('article'); article.className='product-card reveal revealed';
      article.innerHTML = `<div class="product-media"><img src="${escape(product.image)}" alt="${escape(product.model)} ${escape(product.color)}" width="640" height="640" loading="lazy"><span class="status">${escape(product.condition)}</span></div><div class="product-body"><p class="eyebrow">${escape(product.storage)} · ${escape(product.color)}</p><h3>${escape(product.model)}</h3><p class="price">${window.VL.money(product.price)}</p><p class="installment">Referencia publicada · consulte condicoes</p><div class="card-actions"><a class="button secondary" href="orcamento.html?produto=${encodeURIComponent(product.id)}">Ver detalhes</a><button class="button primary" type="button">Comprar pelo WhatsApp</button></div></div>`;
      article.querySelector('button').addEventListener('click', () => window.VL.whatsapp(`Ola! Tenho interesse no ${product.model}, ${product.storage}, cor ${product.color}, anunciado por ${window.VL.money(product.price)}. Gostaria de confirmar disponibilidade e formas de pagamento.`));
      grid.append(article);
    });
  }
  function applyFilters() {
    const data = new FormData(filters);
    const max = Number(data.get('price')) || Infinity;
    render(catalog.filter(p => (!data.get('condition') || p.condition===data.get('condition')) && (!data.get('model') || p.model===data.get('model')) && (!data.get('storage') || p.storage===data.get('storage')) && p.price<=max));
  }
  [...new Set(catalog.map(p=>p.model))].forEach(v => filters.elements.model.add(new Option(v,v)));
  [...new Set(catalog.map(p=>p.storage))].forEach(v => filters.elements.storage.add(new Option(v,v)));
  filters.addEventListener('change', applyFilters); filters.addEventListener('reset', () => setTimeout(applyFilters));
  render(catalog);
})();
