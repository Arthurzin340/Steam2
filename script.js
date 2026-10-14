
const games = [
  {
    n: "Counter-Strike 2",
    img: "img/cs2.png",
    d: "21/ago./2012",
    rev: "Muito positivas",
    c: "544.357",
    pop: "Em 8º na sua região",
    price: "Gratuito para jogar",
    desc: "Há mais de duas décadas, Counter-Strike oferece uma experiência competitiva moldada por milhões de jogadores. Este jogo reúne estratégia, precisão e trabalho em equipe.",
    tags: ["Tiro em Primeira Pessoa (FPS)", "Tiro", "Multijogador"],
    bg: "linear-gradient(135deg,#284a76,#142238 60%,#b78640)"
  },
  {
    n: "Planet Zoo 2",
    img: "img/planet-zoo.png",
    d: "2026",
    rev: "Muito positivas",
    c: "12.480",
    pop: "Em 2º na sua região",
    price: "Já disponível",
    desc: "Construa e administre o zoológico dos seus sonhos, cuide de animais de todo o mundo e crie habitats incríveis.",
    tags: ["Simulação", "Construção", "Animais"],
    bg: "linear-gradient(135deg,#2f6a3a,#1d8d93 60%,#d0872e)"
  },
  {
    n: "Palworld",
    img: "img/palworld.png",
    d: "19/jan./2024",
    rev: "Muito positivas",
    c: "310.552",
    pop: "Em 15º na sua região",
    price: "Consulte o preço",
    desc: "Lute, crie, construa e sobreviva ao lado dos misteriosos Pals em um mundo aberto cheio de aventuras.",
    tags: ["Sobrevivência", "Mundo aberto", "Multijogador"],
    bg: "linear-gradient(135deg,#1f6fb0,#7fc4e8 60%,#f2c14e)"
  },
  {
    n: "Path of Exile",
    img: "img/poe.png",
    d: "23/out./2013",
    rev: "Muito positivas",
    c: "215.904",
    pop: "Em 22º na sua região",
    price: "Gratuito para jogar",
    desc: "Um RPG de ação online gratuito, ambientado no sombrio mundo de Wraeclast, com itens e possibilidades de personalização.",
    tags: ["RPG de ação", "Hack and Slash", "Sombrio"],
    bg: "linear-gradient(135deg,#3a1414,#7a2323 60%,#1a1a1a)"
  },
  {
    n: "Terraria",
    img: "img/terraria.png",
    d: "16/mai./2011",
    rev: "Extremamente positivas",
    c: "1.020.311",
    pop: "Em 30º na sua região",
    price: "Consulte o preço",
    desc: "Escave, lute, explore e construa! Descubra um mundo de aventura cheio de exploração, criaturas e possibilidades.",
    tags: ["Sandbox", "Aventura", "Pixel Art"],
    bg: "linear-gradient(135deg,#2b7a2b,#6ec1e4 55%,#6b4423)"
  }
];

const $ = id => document.getElementById(id);

const homePage = $("homePage");
const gamePage = $("gamePage");
const input = $("searchInput");
const results = $("results");
const modal = $("modal");

let cur = 0;
let timer;
let currentGame = null;

function toast(message) {
  const t = $("toast");
  t.textContent = message;
  t.classList.add("show");
  clearTimeout(toast.timeout);
  toast.timeout = setTimeout(() => t.classList.remove("show"), 2400);
}

function gameImage(game) {
  return `url("${game.img}") center/cover no-repeat, ${game.bg}`;
}

function openGame(game) {
  if (!game) return;

  currentGame = game;
  clearInterval(timer);

  homePage.hidden = true;
  gamePage.hidden = false;
  results.classList.remove("open");

  $("gameTitle").textContent = game.n;
  $("sideTitle").textContent = game.n;
  $("gamePrice").textContent = game.price;
  $("gameDescription").textContent = game.desc;
  $("gameReview").textContent = `${game.rev} (${game.c} análises)`;
  $("gameDate").textContent = game.d;
  $("gamePopularity").textContent = game.pop;

  $("gameCover").style.background = gameImage(game);
  $("gameMiniCover").style.background = gameImage(game);

  $("gameTags").replaceChildren();
  game.tags.forEach(tag => {
    const span = document.createElement("span");
    span.textContent = tag;
    $("gameTags").append(span);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });

  // Atualiza a URL sem sair do site.
  const slug = encodeURIComponent(game.n.toLowerCase().replaceAll(" ", "-"));
  history.pushState({ game: game.n }, "", `?jogo=${slug}`);
}

function showHome(updateUrl = true) {
  currentGame = null;
  gamePage.hidden = true;
  homePage.hidden = false;
  results.classList.remove("open");

  if (updateUrl) {
    history.pushState({}, "", location.pathname);
  }

  restart();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

$("backBtn").addEventListener("click", () => showHome());
$("homeLink").addEventListener("click", e => {
  e.preventDefault();
  showHome();
});
$("navHome").addEventListener("click", e => {
  e.preventDefault();
  showHome();
});

$("playBtn").addEventListener("click", () => {
  toast("Esta é uma página demonstrativa. Nenhum jogo será instalado.");
});

// Menus locais: nenhum item envia para a Steam oficial.
const menus = {
  "Explorar": ["Página inicial", "Mais vendidos", "Lançamentos", "Em breve"],
  "Recomendações": ["Jogos populares", "Recomendados", "Lista de desejos"],
  "Categorias": ["Ação", "Aventura", "RPG", "Simulação", "Estratégia"],
  "Formas de jogar": ["Multijogador", "Um jogador", "Cooperativo"],
  "Seções especiais": ["Gratuitos para jogar", "Promoções", "Demos"]
};

const menuList = $("menus");

Object.entries(menus).forEach(([name, items]) => {
  const li = document.createElement("li");
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = `${name} ▾`;

  const menu = document.createElement("ul");
  menu.className = "dd-menu";

  items.forEach(item => {
    const option = document.createElement("li");
    const link = document.createElement("a");
    link.href = "#";
    link.textContent = item;

    link.addEventListener("click", e => {
      e.preventDefault();
      input.value = item;
      searchGames(item);
      input.focus();
    });

    option.append(link);
    menu.append(option);
  });

  button.addEventListener("click", () => {
    const wasOpen = menu.classList.contains("open");
    closeMenus();
    if (!wasOpen) {
      menu.classList.add("open");
      li.classList.add("on");
    }
  });

  li.append(button, menu);
  menuList.append(li);
});

function closeMenus() {
  document.querySelectorAll(".menus .dd-menu").forEach(menu => {
    menu.classList.remove("open");
    menu.parentElement.classList.remove("on");
  });
}

document.addEventListener("click", e => {
  if (!e.target.closest("#menus")) closeMenus();
  if (!e.target.closest(".search")) results.classList.remove("open");
});

$("langMenu").addEventListener("click", e => {
  const option = e.target.closest("[data-lang]");
  if (!option) return;

  document.querySelector("[data-dd]").textContent =
    option.textContent + " ▾";

  toast("Idioma selecionado: " + option.textContent);
});

document.querySelector("[data-dd]").addEventListener("click", () => {
  $("langMenu").classList.toggle("open");
});

// Carrossel
const dots = $("dots");

games.forEach((game, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("aria-label", `Slide ${index + 1}`);
  dot.addEventListener("click", () => {
    go(index);
    restart();
  });
  dots.append(dot);
});

function go(index) {
  cur = (index + games.length) % games.length;
  const game = games[cur];

  $("slideArt").style.background = gameImage(game);
  $("slideArt").textContent = game.n;
  $("slideArt").onclick = e => {
    e.preventDefault();
    openGame(game);
  };

  $("sTitle").textContent = game.n;
  $("sRev").textContent = `${game.rev} (${game.c} análises)`;
  $("sPop").textContent = game.pop;
  $("sPrice").textContent = game.price;

  $("tTitle").textContent = game.n;
  $("tDate").textContent = "Lançamento: " + game.d;
  $("tDesc").textContent = game.desc;
  $("tRev").textContent = `${game.rev} (${game.c} análises)`;

  $("tTags").replaceChildren();
  game.tags.forEach(tag => {
    const span = document.createElement("span");
    span.textContent = tag;
    $("tTags").append(span);
  });

  [...dots.children].forEach((dot, i) => {
    dot.classList.toggle("on", i === cur);
  });

  $("heroBadge").textContent = "VER DETALHES";
}

function restart() {
  clearInterval(timer);
  if (!currentGame && !homePage.hidden) {
    timer = setInterval(() => go(cur + 1), 7000);
  }
}

$("prev").addEventListener("click", () => {
  go(cur - 1);
  restart();
});

$("next").addEventListener("click", () => {
  go(cur + 1);
  restart();
});

$("carousel").addEventListener("mouseenter", () => clearInterval(timer));
$("carousel").addEventListener("mouseleave", restart);

$("heroBadge").addEventListener("click", e => {
  e.preventDefault();
  openGame(games[1]);
});

$("promoLink").addEventListener("click", e => {
  e.preventDefault();
  showHome();
  input.focus();
  toast("Pesquise um jogo para ver seus detalhes.");
});

$("giftBtn").addEventListener("click", () => {
  toast("A área de vale-presente ainda não está disponível.");
});

// Pesquisa local
function searchGames(query) {
  const q = query.trim().toLocaleLowerCase("pt-BR");

  if (!q) {
    results.classList.remove("open");
    results.replaceChildren();
    return;
  }

  const matches = games.filter(game =>
    game.n.toLocaleLowerCase("pt-BR").includes(q)
  );

  results.replaceChildren();

  if (matches.length === 0) {
    const empty = document.createElement("li");
    empty.className = "none";
    empty.textContent = "Nenhum jogo encontrado no catálogo.";
    results.append(empty);
  } else {
    matches.forEach(game => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      const name = document.createElement("span");
      const price = document.createElement("span");

      name.textContent = game.n;
      price.textContent = game.price;

      link.href = "#";
      link.append(name, price);
      link.addEventListener("click", e => {
        e.preventDefault();
        input.value = game.n;
        openGame(game);
      });

      item.append(link);
      results.append(item);
    });
  }

  results.classList.add("open");
}

input.addEventListener("input", () => searchGames(input.value));

$("searchForm").addEventListener("submit", e => {
  e.preventDefault();

  const q = input.value.trim();
  if (!q) {
    toast("Digite o nome de um jogo.");
    return;
  }

  const exact = games.find(game =>
    game.n.toLocaleLowerCase("pt-BR") === q.toLocaleLowerCase("pt-BR")
  );

  const match = exact || games.find(game =>
    game.n.toLocaleLowerCase("pt-BR").includes(q.toLocaleLowerCase("pt-BR"))
  );

  if (match) {
    openGame(match);
  } else {
    searchGames(q);
    toast("Esse jogo ainda não está no catálogo.");
  }
});

// Login demonstrativo
$("loginBtn").addEventListener("click", () => {
  modal.hidden = false;
  $("modalMsg").textContent = "Demonstração: este login não cria uma conta.";
  $("user").focus();
});

$("closeModal").addEventListener("click", () => {
  modal.hidden = true;
});

modal.addEventListener("click", e => {
  if (e.target === modal) modal.hidden = true;
});

$("loginForm").addEventListener("submit", e => {
  e.preventDefault();
  const username = $("user").value.trim();

  if (!username) return;

  $("loginBtn").textContent = username;
  $("modalMsg").textContent = `Olá, ${username}! Login apenas demonstrativo.`;

  setTimeout(() => {
    modal.hidden = true;
  }, 1400);
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    modal.hidden = true;
    results.classList.remove("open");
    closeMenus();
  }

  if (gamePage.hidden && !modal.hidden) return;

  if (gamePage.hidden && e.key === "ArrowLeft") $("prev").click();
  if (gamePage.hidden && e.key === "ArrowRight") $("next").click();
});

// Navegação voltar/avançar do navegador
window.addEventListener("popstate", () => {
  const params = new URLSearchParams(location.search);
  const slug = params.get("jogo");

  if (!slug) {
    showHome(false);
    return;
  }

  const game = games.find(g =>
    g.n.toLowerCase().replaceAll(" ", "-") ===
    decodeURIComponent(slug).replaceAll("%20", " ")
  );

  if (game) {
    // Não adiciona outra entrada ao histórico.
    openGameFromHistory(game);
  } else {
    showHome(false);
  }
});

function openGameFromHistory(game) {
  currentGame = game;
  clearInterval(timer);
  homePage.hidden = true;
  gamePage.hidden = false;

  $("gameTitle").textContent = game.n;
  $("sideTitle").textContent = game.n;
  $("gamePrice").textContent = game.price;
  $("gameDescription").textContent = game.desc;
  $("gameReview").textContent = `${game.rev} (${game.c} análises)`;
  $("gameDate").textContent = game.d;
  $("gamePopularity").textContent = game.pop;
  $("gameCover").style.background = gameImage(game);
  $("gameMiniCover").style.background = gameImage(game);

  $("gameTags").replaceChildren();
  game.tags.forEach(tag => {
    const span = document.createElement("span");
    span.textContent = tag;
    $("gameTags").append(span);
  });
}

// Inicialização: também permite abrir diretamente ?jogo=terraria
go(0);

const initialSlug = new URLSearchParams(location.search).get("jogo");
if (initialSlug) {
  const initialGame = games.find(game =>
    game.n.toLowerCase().replaceAll(" ", "-") ===
    decodeURIComponent(initialSlug).replaceAll("%20", " ")
  );

  if (initialGame) openGameFromHistory(initialGame);
  else restart();
} else {
  restart();
}
