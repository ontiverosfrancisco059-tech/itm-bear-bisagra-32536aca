// BEAR-bisagra — interacciones generales + teaser de tienda
(function(){
  const menuBtn = document.querySelector('[data-menu-btn]');
  const nav = document.querySelector('[data-nav]');
  if(menuBtn && nav){
    menuBtn.addEventListener('click', ()=> nav.classList.toggle('open'));
    nav.addEventListener('click', (e)=>{ if(e.target.tagName==='A') nav.classList.remove('open'); });
  }

  document.querySelectorAll('[data-year]').forEach(el=>{ el.textContent = new Date().getFullYear(); });

  // Teaser tienda en home: lee store-products.json y muestra destacados
  const teaserGrid = document.querySelector('[data-featured-products]');
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  async function loadFeatured(){
    if(!teaserGrid) return;
    try{
      const res = await fetch('store-products.json', { cache: 'no-store' });
      if(!res.ok) throw new Error('http '+res.status);
      const products = await res.json();
      const featured = products.filter(p=>p.featured && p.available !== false).slice(0,3);
      if(!featured.length) throw new Error('empty');
      teaserGrid.innerHTML = featured.map(p=>`
        <div class="mini">
          <img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" />
          <div>${esc(p.name)}<br><span class="price">$${esc(p.price)} MXN</span></div>
        </div>`).join('');
    }catch(err){
      teaserGrid.innerHTML = '<p class="privacy">Visita la tienda para ver el menú completo.</p>';
    }
  }
  loadFeatured();

  // Carrito compartido (tienda + teaser): guarda en localStorage
  window.BEAR_cart = {
    read(){ try{ return JSON.parse(localStorage.getItem('bear_cart')||'[]'); }catch{ return []; } },
    write(items){ localStorage.setItem('bear_cart', JSON.stringify(items)); document.dispatchEvent(new CustomEvent('bear:cart')); }
  };
})();
