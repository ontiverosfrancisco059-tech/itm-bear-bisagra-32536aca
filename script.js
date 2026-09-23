// BEAR-bisagra — interacciones generales (sin sistema propio de login/comentarios)
(function(){
  var toggle = document.getElementById('navToggle');
  var mobile = document.getElementById('mobileNav');
  if(toggle && mobile){
    toggle.addEventListener('click', function(){
      var open = mobile.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobile.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ mobile.classList.remove('open'); });
    });
  }

  // Filtro de carta
  var tabs = document.querySelectorAll('.tab[data-filter]');
  var dishes = document.querySelectorAll('#menuGrid .dish');
  tabs.forEach(function(btn){
    btn.addEventListener('click', function(){
      tabs.forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.getAttribute('data-filter');
      dishes.forEach(function(d){
        d.style.display = (f === 'all' || d.getAttribute('data-cat') === f) ? '' : 'none';
      });
    });
  });

  // Formulario de contacto -> resumen para confirmar por teléfono
  var form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var data = new FormData(form);
      var nombre = (data.get('nombre')||'').toString().trim();
      var tel = (data.get('telefono')||'').toString().trim();
      var msg = (data.get('mensaje')||'').toString().trim();
      var hint = document.getElementById('contactHint');
      if(hint){
        hint.textContent = 'Gracias, ' + (nombre || 'visita') + '. Llámanos al 981 133 2914 para confirmar: "' + msg.slice(0,120) + '"' + (tel ? ' (te contactaremos al ' + tel + ').' : '.');
      }
      form.reset();
    });
  }

  // Filtro de tienda (solo para catálogo inicial visible; el runtime ITM carga el catálogo activo aparte)
  var q = document.getElementById('storeSearch');
  var cat = document.getElementById('storeCat');
  function applyStoreFilter(){
    var term = q ? q.value.toLowerCase().trim() : '';
    var c = cat ? cat.value : 'all';
    document.querySelectorAll('[data-store-card]').forEach(function(card){
      var name = (card.getAttribute('data-name')||'').toLowerCase();
      var cc = card.getAttribute('data-cat')||'';
      var ok = (c === 'all' || cc === c) && (!term || name.indexOf(term) !== -1);
      card.style.display = ok ? '' : 'none';
    });
  }
  if(q) q.addEventListener('input', applyStoreFilter);
  if(cat) cat.addEventListener('change', applyStoreFilter);

  // Año dinámico si existe
  var y = document.getElementById('year');
  if(y) y.textContent = new Date().getFullYear();
})();
