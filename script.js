// BEAR-bisagra interacciones
(function(){
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');
  if(menuBtn && nav){
    menuBtn.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ nav.classList.remove('open'); });
    });
  }
  var form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var data = new FormData(form);
      var msg = 'Hola BEAR-bisagra, soy ' + (data.get('nombre')||'') + '. ' + (data.get('mensaje')||'') + ' Tel: ' + (data.get('telefono')||'');
      var url = 'https://wa.me/529811332914?text=' + encodeURIComponent(msg);
      document.getElementById('contactNote').textContent = 'Abriendo WhatsApp…';
      window.open(url, '_blank');
    });
  }
  // Filtros tienda
  var filterBtns = document.querySelectorAll('.filter-btn');
  var cards = document.querySelectorAll('[data-cat]');
  filterBtns.forEach(function(btn){
    btn.addEventListener('click', function(){
      filterBtns.forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      var cat = btn.getAttribute('data-filter');
      cards.forEach(function(c){
        c.style.display = (cat === 'todo' || c.getAttribute('data-cat') === cat) ? '' : 'none';
      });
    });
  });
  // Cantidad producto
  var qty = document.getElementById('qtyVal');
  if(qty){
    var n = 1;
    document.getElementById('qtyMinus').addEventListener('click', function(){ n = Math.max(1, n-1); qty.textContent = n; });
    document.getElementById('qtyPlus').addEventListener('click', function(){ n = Math.min(20, n+1); qty.textContent = n; });
    document.getElementById('askBtn').addEventListener('click', function(){
      var name = document.querySelector('.product-detail h1').textContent;
      window.open('https://wa.me/529811332914?text=' + encodeURIComponent('Hola, me interesa ' + name + ' x' + n + '. ¿Sigue disponible?'), '_blank');
    });
  }
})();
