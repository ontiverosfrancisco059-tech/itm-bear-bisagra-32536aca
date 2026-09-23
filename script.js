// BEAR-bisagra interacciones
(function(){
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');
  if(toggle && nav){
    toggle.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ nav.classList.remove('open'); });
    });
  }
  // Filtros tienda (si existen)
  var btns = document.querySelectorAll('.filter-btn');
  var cards = document.querySelectorAll('[data-cat]');
  btns.forEach(function(b){
    b.addEventListener('click', function(){
      btns.forEach(function(x){ x.classList.remove('active'); });
      b.classList.add('active');
      var cat = b.getAttribute('data-filter');
      cards.forEach(function(c){
        c.style.display = (cat === 'todo' || c.getAttribute('data-cat') === cat) ? '' : 'none';
      });
    });
  });
  // Cantidad en producto
  var q = document.getElementById('qtyVal');
  if(q){
    var n = 1;
    document.getElementById('qtyMinus').addEventListener('click', function(){ n = Math.max(1, n-1); q.textContent = n; upd(); });
    document.getElementById('qtyPlus').addEventListener('click', function(){ n = Math.min(20, n+1); q.textContent = n; upd(); });
    function upd(){
      var total = document.getElementById('orderTotal');
      var price = parseFloat(document.getElementById('orderTotal').getAttribute('data-price') || '449');
      if(total) total.textContent = '$' + (price*n).toFixed(0) + ' MXN';
      var msg = document.getElementById('orderMsg');
      if(msg) msg.value = 'Hola BEAR-bisagra, quiero ' + n + ' x Camisa BEAR esencial negra. Mi nombre es: ';
    }
    upd();
  }
})();
