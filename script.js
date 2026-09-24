// BEAR-bisagra — lógica home + tienda
const PROJECT_ID = "32536aca-527c-4a46-9a63-be16d1e86934";
const PRODUCTS_URLS = ["./store-products.json", "../store-products.json", "/store-products.json"];

async function loadProducts() {
  for (const u of PRODUCTS_URLS) {
    try {
      const r = await fetch(u);
      if (r.ok) {
        const j = await r.json();
        if (Array.isArray(j)) return j;
        if (j.products) return j.products;
      }
    } catch (e) { /* probar siguiente */ }
  }
  return [];
}
function money(n){ return "$" + Number(n).toFixed(0) + " MXN"; }

// Home: destacados (3 primeros)
async function renderFeatured(){
  const el = document.getElementById("featuredGrid");
  if(!el) return;
  const prods = await loadProducts();
  if(!prods.length){ el.innerHTML = "<p style='color:#b9c2c6'>Catálogo no disponible por ahora. Visita la <a href='./tienda/' style='color:var(--gold2)'>tienda</a> o pide por WhatsApp al 981 133 2914.</p>"; return; }
  const top = prods.slice(0,3);
  el.innerHTML = top.map(p=>`
    <article class="product">
      <img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" />
      <div class="product-body">
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.description)}</p>
        <div class="product-foot"><strong>${money(p.price)}</strong><a class="add" href="./tienda/">Ver en tienda</a></div>
      </div>
    </article>`).join("");
}

// Tienda: catálogo + filtros + carrito por WhatsApp
let ALL = [];
function readCart(){
  try {
    const v = JSON.parse(localStorage.getItem("bear_cart")||"[]");
    return Array.isArray(v) ? v.filter(c=>c && typeof c.id==="string") : [];
  } catch(e){ return []; }
}
let cart = readCart();
function esc(s){ return String(s??"").replace(/[&<>"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m])); }

function saveCart(){ try{ localStorage.setItem("bear_cart", JSON.stringify(cart)); }catch(e){} updateBar(); }
function updateBar(){
  const barQty = document.getElementById("cartCount");
  const barTotal = document.getElementById("cartTotal");
  const n = cart.reduce((a,c)=>a+c.qty,0);
  const t = cart.reduce((a,c)=>{ const p=ALL.find(x=>x.id===c.id); return a+(p?p.price*c.qty:0); },0);
  if(barQty) barQty.textContent = n;
  if(barTotal) barTotal.textContent = money(t);
}
async function renderCatalog(){
  const grid = document.getElementById("catalogGrid");
  if(!grid) return;
  ALL = await loadProducts();
  drawCatalog("todo");
  updateBar();
  document.querySelectorAll(".filters button").forEach(b=>{
    b.addEventListener("click",()=>{
      document.querySelectorAll(".filters button").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      drawCatalog(b.dataset.cat);
    });
  });
  const waBtn = document.getElementById("orderWa");
  if(waBtn) waBtn.addEventListener("click", orderWhatsApp);
  const clearBtn = document.getElementById("clearCart");
  if(clearBtn) clearBtn.addEventListener("click", ()=>{ cart = []; saveCart(); });
}
function drawCatalog(cat){
  const grid = document.getElementById("catalogGrid");
  const list = cat==="todo" ? ALL : ALL.filter(p=>p.category===cat);
  grid.innerHTML = list.map(p=>`
    <article class="product" data-id="${esc(p.id)}">
      ${p.badge?`<span class="tag" style="margin:12px 0 0 12px;position:absolute;background:#111;color:#ffe9b0;border-color:#111">${esc(p.badge)}</span>`:""}
      <img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy"/>
      <div class="product-body">
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.description)}</p>
        <div class="product-foot"><strong>${money(p.price)}</strong><button class="add" data-add="${esc(p.id)}">Agregar</button></div>
      </div>
    </article>`).join("") || "<p>No hay productos en esta categoría.</p>";
  grid.querySelectorAll("[data-add]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const id = btn.dataset.add;
      const found = cart.find(c=>c.id===id);
      if(found) found.qty++;
      else cart.push({id, qty:1});
      saveCart();
      btn.textContent = "¡Agregado!";
      setTimeout(()=>btn.textContent="Agregar",900);
    });
  });
}
function orderWhatsApp(){
  if(!cart.length){ alert("Tu cubeta está vacía. Agrega algo rico primero."); return; }
  const lines = cart.map(c=>{
    const p = ALL.find(x=>x.id===c.id);
    if(!p) return null;
    return `• ${c.qty}x ${p.name} — ${money(p.price*c.qty)}`;
  }).filter(Boolean);
  if(!lines.length){ alert("Tu pedido no pudo cargarse. Vacía y vuelve a agregar."); return; }
  const total = cart.reduce((a,c)=>{ const p=ALL.find(x=>x.id===c.id); return a+(p?p.price*c.qty:0); },0);
  const text = `Hola BEAR-bisagra 🍺🦐\nQuiero pedir:\n${lines.join("\n")}\nTotal: ${money(total)}\n¿Me confirman?`;
  window.open(`https://wa.me/529811332914?text=${encodeURIComponent(text)}`,"_blank");
}

// menú móvil
document.addEventListener("DOMContentLoaded",()=>{
  renderFeatured();
  renderCatalog();
  updateBar();
  const b = document.getElementById("burger");
  const l = document.getElementById("navLinks");
  if(b&&l) b.addEventListener("click",()=>l.classList.toggle("open"));
  const y = document.getElementById("year");
  if(y) y.textContent = new Date().getFullYear();
});
