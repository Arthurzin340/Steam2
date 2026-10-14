const S = "https://store.steampowered.com";
const games = [
  {n:"Counter-Strike 2",img:"img/cs2.png",id:730,d:"21/ago./2012",rev:"Muito positivas",c:"544.357",pop:"Em 8º na sua região",price:"Gratuito para jogar",
   desc:"Há mais de duas décadas, o Counter-Strike oferece uma experiência competitiva de elite moldada por milhões de jogadores mundialmente. Agora, o próximo capítulo da história do CS vai começar. Isso é Counter-Strike 2.",
   tags:["Tiro em Primeira Pessoa (FPS)","Tiro","Multijogador"],bg:"url(img/cs2.png) center/cover no-repeat, linear-gradient(135deg,#2a4a86,#12203c 60%,#d19a3c)"},
  {n:"Planet Zoo 2",img:"img/planet-zoo.png",id:null,q:"planet zoo 2",d:"2026",rev:"Muito positivas",c:"12.480",pop:"Em 2º na sua região",price:"Já disponível",
   desc:"Construa e administre o zoológico dos seus sonhos, cuide de animais de todo o mundo e crie habitats incríveis.",
   tags:["Simulação","Construção de cidades","Animais"],bg:"url(img/planet-zoo.png) center/cover no-repeat, linear-gradient(135deg,#2f6a3a,#1d8d93 60%,#d0872e)"},
  {n:"Palworld",img:"img/palworld.png",id:1623730,d:"19/jan./2024",rev:"Muito positivas",c:"310.552",pop:"Em 15º na sua região",price:"Consulte o preço",
   desc:"Lute, crie, construa e sobreviva ao lado dos misteriosos Pals em um mundo aberto cheio de aventuras.",
   tags:["Sobrevivência","Mundo aberto","Multijogador"],bg:"url(img/palworld.png) center/cover no-repeat, linear-gradient(135deg,#1f6fb0,#7fc4e8 60%,#f2c14e)"},
  {n:"Path of Exile",img:"img/poe.png",id:238960,d:"23/out./2013",rev:"Muito positivas",c:"215.904",pop:"Em 22º na sua região",price:"Gratuito para jogar",
   desc:"Um RPG de ação online gratuito, ambientado no sombrio mundo de Wraeclast, com itens e builds quase infinitos.",
   tags:["RPG de ação","Hack and Slash","Sombrio"],bg:"url(img/poe.png) center/cover no-repeat, linear-gradient(135deg,#3a1414,#7a2323 60%,#1a1a1a)"},
  {n:"Terraria",img:"img/terraria.png",id:105600,d:"16/mai./2011",rev:"Extremamente positivas",c:"1.020.311",pop:"Em 30º na sua região",price:"Consulte o preço",
   desc:"Escave, lute, explore, construa! Nada é impossível neste jogo de aventura cheio de ação.",
   tags:["Sandbox","Aventura","Pixel Art"],bg:"url(img/terraria.png) center/cover no-repeat, linear-gradient(135deg,#2b7a2b,#6ec1e4 55%,#6b4423)"}
];
const url = g => g.id ? `${S}/app/${g.id}/` : `${S}/search/?term=${encodeURIComponent(g.q)}`;
const $ = id => document.getElementById(id);
const toast = m => { const t=$("toast"); t.textContent=m; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),2200); };

/* Menus */
const menus = {
  "Explorar":[["Página inicial",S],["Mais vendidos",`${S}/charts/topsellers/`],["Lançamentos",`${S}/explore/new/`],["Em breve",`${S}/explore/upcoming/`]],
  "Recomendações":[["Fila de descobrimento",`${S}/explore/`],["Curadores",`${S}/curators/`],["Lista de desejos",`${S}/wishlist/`]],
  "Categorias":[["Ação",`${S}/category/action/`],["Aventura",`${S}/category/adventure/`],["RPG",`${S}/category/rpg/`],["Simulação",`${S}/category/simulation/`],["Estratégia",`${S}/category/strategy/`]],
  "Formas de jogar":[["Multijogador",`${S}/category/multiplayer_all/`],["Um jogador",`${S}/category/singleplayer/`],["Cooperativo",`${S}/category/co_op/`]],
  "Seções especiais":[["Gratuitos para jogar",`${S}/genre/Free%20to%20Play/`],["Promoções",`${S}/specials/`],["Demos",`${S}/demos/`]]
};
const ul = $("menus");
for (const [name,items] of Object.entries(menus)) {
  const li = document.createElement("li");
  li.innerHTML = `<button>${name} ▾</button><ul class="dd-menu">${items.map(([t,h])=>`<li><a href="${h}" target="_blank" rel="noopener">${t}</a></li>`).join("")}</ul>`;
  ul.append(li);
}
function closeMenus(except){document.querySelectorAll(".dd-menu.open").forEach(m=>{if(m!==except){m.classList.remove("open");m.parentElement.classList.remove("on")}})}
document.addEventListener("click",e=>{
  const b=e.target.closest(".menus>li>button,[data-dd]");
  if(b){const m=b.parentElement.querySelector(".dd-menu");const open=m.classList.toggle("open");b.parentElement.classList.toggle("on",open);closeMenus(m);return}
  closeMenus();
  if(!e.target.closest(".search"))$("results").classList.remove("open");
});
$("langMenu").addEventListener("click",e=>{const l=e.target.closest("li");if(l){toast("Idioma: "+l.textContent);document.querySelector("[data-dd]").textContent=l.textContent+" ▾"}});

/* Carrossel */
let cur=0,timer;
const dots=$("dots");
games.forEach((_,i)=>{const b=document.createElement("button");b.ariaLabel="Slide "+(i+1);b.onclick=()=>{go(i);restart()};dots.append(b)});
function go(i){
  cur=(i+games.length)%games.length;const g=games[cur];
  const a=$("slideArt");a.style.background=g.img?`url('${g.img}') center/contain no-repeat, ${g.bg}`:g.bg;a.textContent=g.img?"":g.n;a.setAttribute("aria-label",g.n);a.href=url(g);
  $("sTitle").textContent=g.n;
  $("sRev").innerHTML=`${g.rev} <span>(${g.c} análises)</span>`;
  $("sPop").textContent=g.pop;$("sPrice").textContent=g.price;
  $("tTitle").textContent=g.n;$("tDate").textContent="Lançamento: "+g.d;$("tDesc").textContent=g.desc;
  $("tRev").innerHTML=`${g.rev} <span style="color:#c6d4df">(${g.c} análises)</span>`;
  $("tTags").innerHTML=g.tags.map(t=>`<span>${t}</span>`).join("");
  [...dots.children].forEach((d,k)=>d.classList.toggle("on",k===cur));
}
function restart(){clearInterval(timer);timer=setInterval(()=>go(cur+1),7000)}
$("prev").onclick=()=>{go(cur-1);restart()};
$("next").onclick=()=>{go(cur+1);restart()};
$("carousel").addEventListener("mouseenter",()=>clearInterval(timer));
$("carousel").addEventListener("mouseleave",restart);
document.addEventListener("keydown",e=>{if(e.key==="ArrowLeft")$("prev").click();if(e.key==="ArrowRight")$("next").click();if(e.key==="Escape")$("modal").hidden=true});
go(0);restart();
$("slideArt").addEventListener("click",()=>{});

/* Busca */
const input=$("searchInput"),res=$("results");
input.addEventListener("input",()=>{
  const q=input.value.trim().toLowerCase();
  if(!q){res.classList.remove("open");return}
  const m=games.filter(g=>g.n.toLowerCase().includes(q));
  res.innerHTML=m.length?m.map(g=>`<a href="${url(g)}" target="_blank" rel="noopener"><span>${g.n}</span><span>${g.price}</span></a>`).join(""):`<div class="none">Nenhum resultado. Pressione Enter para buscar na Steam.</div>`;
  res.classList.add("open");
});
$("searchForm").addEventListener("submit",e=>{
  e.preventDefault();const q=input.value.trim();
  if(q)window.open(`${S}/search/?term=${encodeURIComponent(q)}`,"_blank","noopener");
});

/* Botões */
$("giftBtn").onclick=()=>window.open(`${S}/digitalgiftcards/`,"_blank","noopener");
const modal=$("modal");
$("loginBtn").onclick=()=>{modal.hidden=false;$("modalMsg").textContent="";$("user").focus()};
$("closeModal").onclick=()=>modal.hidden=true;
modal.addEventListener("click",e=>{if(e.target===modal)modal.hidden=true});
$("loginForm").addEventListener("submit",e=>{
  e.preventDefault();const u=$("user").value;
  $("loginBtn").textContent=u;$("modalMsg").textContent="Login simulado: bem-vindo, "+u+"!";
  setTimeout(()=>modal.hidden=true,900);
});
