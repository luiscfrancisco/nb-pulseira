
// ── Dados ───
const WHATSAPP = "953400020"; 

const produtos = [
  { id:1, nome:"Pulseira Ametista Proteção",   cat:"Oferta Da Casa",  preco:1800.00, antigo:null, desconto:22, img:"img/P-14.jpeg", destaque:true },
  { id:2, nome:"Pulseira Olho Grego Prata",    cat:"Cristais",  preco:2000.00, antigo:2800.00,  desconto:0,  img:"img/P-15.jpeg", destaque:true },
  { id:3, nome:"Pulseira Sem Costura",   cat:"Macramés",  preco:900.00, antigo:1200.00, desconto:33, img:"img/P-2.jfif", destaque:true },
  { id:4, nome:"Pulseira 4 Nós De Best",  cat:"Macramés",    preco:900.00, antigo:1500.00, desconto:19, img:"img/P-3.jfif", destaque:true },
  { id:5, nome:"Pulseira Macramé De Best",   cat:"Macramés",  preco:1000.00, antigo:null,  desconto:0,  img:"img/P-4.jfif", destaque:false },
  { id:6, nome:"Pulseira Macramé",     cat:"Macramés",  preco:900.00, antigo:1300.00, desconto:18, img:"img/P-5.jfif", destaque:false },
  { id:7, nome:"Pulseira Macramé Dourada",      cat:"Macramés",    preco:1500.00, antigo:null,  desconto:0,  img:"img/P-6.jfif", destaque:false },
  { id:8, nome:"Pulseira Fita De Linon",    cat:"Macramés",  preco:1600.00, antigo:1800.00, desconto:29, img:"img/P-7.jfif", destaque:false },
  { id:9, nome:"Pulseira Macramé",        cat:"Macramés",  preco:700.00, antigo:1000.00, desconto:20, img:"img/P-13.jfif", destaque:false },
  { id:10,nome:"Pulseira Macramé ",      cat:"Macramés",  preco:800.00, antigo:null,  desconto:0,  img:"img/P-9.jfif", destaque:false },
  { id:11,nome:"Terços personalizados",         cat:"Macramés",    preco:2000.00, antigo:null, desconto:24, img:"img/P-17.jpeg", destaque:false },
  { id:12,nome:"Macramé Com Estilo De Conxa",     cat:"Macramés",  preco:1500.00, antigo:2000.00, desconto:18, img:"img/P-18.JPG", destaque:false },
];

let carrinho = [];
let filtroAtivo = "Todos";
let buscaAtiva = "";

// ── Render Slider ───
function renderSlider() {
  const el = document.getElementById("sliderEl");
  const destaques = produtos.filter(p => p.destaque);
  el.innerHTML = destaques.map(p => `
    <div style="min-width:220px; flex:0 0 220px; ">
      ${cardHTML(p)}
    </div>
  `).join("");
}

// ── Render Filtros ────
function renderFiltros() {
  const cats = ["Todos", ...new Set(produtos.map(p => p.cat))];
  document.getElementById("filtros").innerHTML = cats.map(c => `
    <button class="filtro-btn ${c === filtroAtivo ? 'active' : ''}" onclick="setFiltro('${c}')">${c}</button>
  `).join("");
}

function setFiltro(cat) {
  filtroAtivo = cat;
  renderFiltros();
  renderGrid();
}

// ── Busca ────
function filtrarBusca() {
  buscaAtiva = document.getElementById("searchInput").value.toLowerCase();
  renderGrid();
}

// ── Render Grid ────
function cardHTML(p) {
  return `
    <div class="card" id="card-${p.id}">
      <div class="card-img">
        <img src="${p.img}" alt="${p.nome}" loading="lazy">
        ${p.desconto ? `<span class="badge off">${p.desconto}% OFF</span>` : ''}
      </div>
      <div class="card-body">
        <span class="card-cat">${p.cat}</span>
        <div class="card-nome">${p.nome}</div>
        <div class="card-precos">
          <span class="preco-atual">Kz ${p.preco.toFixed(2).replace('.',',','')}</span>
          ${p.antigo ? `<span class="preco-antigo">Kz ${p.antigo.toFixed(2).replace('.',',')}</span>` : ''}
        </div>
        <button class="btn-add" onclick="addCarrinho(${p.id})">+ Adicionar</button>
      </div>
    </div>
  `;
}

function renderGrid() {
  const lista = produtos.filter(p => {
    const catOk = filtroAtivo === "Todos" || p.cat === filtroAtivo;
    const buscaOk = !buscaAtiva || p.nome.toLowerCase().includes(buscaAtiva) || p.cat.toLowerCase().includes(buscaAtiva);
    return catOk && buscaOk;
  });
  document.getElementById("grid").innerHTML = lista.length
    ? lista.map(p => cardHTML(p)).join("")
    : `<p style="grid-column:1/-1;text-align:center;color:var(--marrom-claro);padding:40px 0;">Nenhum produto encontrado 🔍</p>`;
}

// ── Slider Navegação ───
function slidePrev() {
  document.getElementById("sliderEl").scrollBy({ left: -240, behavior:'smooth' });
}
function slideNext() {
  document.getElementById("sliderEl").scrollBy({ left: 240, behavior:'smooth' });
}
let autoSlide = setInterval(slideNext, 3000);

// ── Carrinho ───
function addCarrinho(id) {
  const prod = produtos.find(p => p.id === id);
  const exist = carrinho.find(i => i.id === id);
  if (exist) exist.qty++;
  else carrinho.push({ ...prod, qty:1 });
  atualizarCarrinho();
  showToast(`${prod.nome} adicionado!`);
  // animar botão
  const btn = document.querySelector(`#card-${id} .btn-add`);
  if(btn){ btn.textContent="Adicionado ✓"; btn.classList.add("added"); setTimeout(()=>{ btn.textContent="+ Adicionar"; btn.classList.remove("added"); },1500); }
}

function removerItem(id) {
  carrinho = carrinho.filter(i => i.id !== id);
  atualizarCarrinho();
}
function changeQty(id, delta) {
  const item = carrinho.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removerItem(id);
  else atualizarCarrinho();
}

function atualizarCarrinho() {
  const total = carrinho.reduce((s, i) => s + i.preco + i.qty, 0);
  const count = carrinho.reduce((s, i) => s + i.qty, 0);
  // count badge
  const badge = document.getElementById("cartCount");
  badge.textContent = count;
  badge.classList.toggle("show", count > 0);
  // total
  document.getElementById("totalVal").textContent = "Kz " + total.toFixed(2).replace('.',',');
  // items
  const el = document.getElementById("carrinhoItems");
  const empty = document.getElementById("carrinhoEmpty");
  if (carrinho.length === 0) {
    empty.style.display = "flex";
    el.querySelectorAll(".cart-item").forEach(e=>e.remove());
  } else {
    empty.style.display = "none";
    el.querySelectorAll(".cart-item").forEach(e=>e.remove());
    carrinho.forEach(item => {
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <img class="cart-item-img" src="${item.img}" alt="${item.nome}">
        <div class="cart-item-info">
          <div class="cart-item-nome">${item.nome}</div>
          <div class="cart-item-preco">Kz ${(item.preco*item.qty).toFixed(2).replace('.',',')}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id},+1)">+</button>
          </div>
        </div>
        <button class="remove-item" onclick="removerItem(${item.id})">✕</button>
      `;
      el.appendChild(div);
    });
  }
}

// ── Abrir / Fechar Carrinho ──
document.getElementById("cartBtn").onclick = () => {
  document.getElementById("carrinhoDrawer").classList.toggle("open");
  document.getElementById("carrinhoOverlay").classList.toggle("open");
};
function fecharCarrinho() {
  document.getElementById("carrinhoDrawer").classList.remove("open");
  document.getElementById("carrinhoOverlay").classList.remove("open");
}

// ── Finalizar WHATSAPP ───
function finalizarWhatsApp() {
  if (carrinho.length === 0) { showToast("Seu carrinho está vazio!"); return; }
  const total = carrinho.reduce((s,i)=>s+i.preco+i.qty,0);
  let msg = "Olá! Gostaria de fazer um pedido:\n\n";
  carrinho.forEach(i => {
    msg += `• ${i.nome} (x${i.qty}) — Kz ${(i.preco+i.qty).toFixed(2).replace('.',',')}\n`;
  });
  msg += `\n*Total: Kz ${total.toFixed(2).replace('.',',')}*`;
  const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  window.open(url,"_blank");
}

// ── Memu Mobile ───
document.getElementById("hamBtn").onclick = () => {
  document.getElementById("hamBtn").classList.toggle("open");
  document.getElementById("mobileNav").classList.toggle("open");
};
function fecharMenu() {
  document.getElementById("hamBtn").classList.remove("open");
  document.getElementById("mobileNav").classList.remove("open");
}
document.getElementById("closeNav").onclick = fecharMenu;

// ── Toat ──
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),2400);
}

// ── Initi ───
renderSlider();
renderFiltros();
renderGrid();
