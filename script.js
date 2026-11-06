var PAL = {
  R: "#c8312b",
  W: "#eaf6ff",
  S: "#f6c9a0",
  H: "#7a4a2a",
  K: "#2a1a14",
  P: "#f08a8a",
  G: "#3f7d4e",
  B: "#5a3a2a",
  O: "#f08a1c",
  T: "#8b5a2b",
};
var S = PAL;

function spr(rows) {
  var c = document.createElement("canvas");
  c.width = 12;
  c.height = rows.length;
  var x = c.getContext("2d");
  rows.forEach(function (r, y) {
    for (var i = 0; i < 12; i++) {
      var ch = r[i];
      if (ch !== ".") {
        x.fillStyle = PAL[ch];
        x.fillRect(i, y, 1, 1);
      }
    }
  });
  return c.toDataURL();
}

var KEY = "adwent_v1",
  ST = {
    g: null,
    open: {},
    done: {},
    hdone: {},
    test: null,
    v: null,
    xpBonus: 0,
  },
  tab = 0;

try {
  var raw = localStorage.getItem(KEY);
  if (raw) ST = Object.assign(ST, JSON.parse(raw));
} catch (e) {}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(ST));
  } catch (e) {}
}

function today() {
  if (ST.test !== null) return ST.test;
  var n = new Date();
  if (n.getMonth() < 11) return 0;
  return Math.min(n.getDate(), 24);
}

function cnt(o) {
  return Object.keys(o).length;
}

function xp() {
  return cnt(ST.open) * 10 + cnt(ST.done) * 15 + cnt(ST.hdone) * 10;
}

var LV = [
  "Śnieżynka",
  "Pomocnik Elfa",
  "Mistrz Piernika",
  "Strażnik Choinki",
  "Bohater Świąt",
];

function left(d) {
  var n = 24 - d;
  if (n === 0) return "Dziś Wigilia!";
  if (n === 1) return "Został 1 dzień do świąt!";
  if (n < 5) return "Zostały " + n + " dni do świąt!";
  return "Zostało " + n + " dni do świąt!";
}

function snow() {
  var s = document.getElementById("snow");
  for (var i = 0; i < 26; i++) {
    var e = document.createElement("i");
    e.style.left = Math.random() * 100 + "%";
    e.style.animationDuration = 8 + Math.random() * 10 + "s";
    e.style.animationDelay = -Math.random() * 14 + "s";
    e.style.transform = "scale(" + (0.6 + Math.random()) + ")";
    s.appendChild(e);
  }
}

function render() {
  var a = document.getElementById("app");
  if (!ST.g) {
    a.innerHTML =
      '<div style="text-align:center;padding-top:20px"><h1 class="pf" style="font-size:18px">ADWENTOWA<br>PRZYGODA</h1><p>Kalendarz adwentowy dla dwojga. Kim jesteś?</p><div class="pick"><button data-a="pick" data-g="k"><img src="' +
      spr(GIRL) +
      '" alt=""><div class="pf" style="font-size:11px">ONA</div></button><button data-a="pick" data-g="m"><img src="' +
      spr(MAN) +
      '" alt=""><div class="pf" style="font-size:11px">ON</div></button></div><p class="small">Wybór zapamiętamy na stałe.</p></div>';
    return;
  }
  var x = xp(),
    lv = Math.min(4, Math.floor(x / 60)),
    pct = Math.min(100, ((x % 60) / 60) * 100);
  if (lv === 4) pct = 100;
  var h =
    '<div class="top"><div style="flex:1"><h1 class="pf">ADWENT</h1><div class="small">Poziom ' +
    (lv + 1) +
    ": " +
    LV[lv] +
    " · " +
    x +
    ' XP</div><div class="xp"><div style="width:' +
    pct +
    '%"></div></div></div><img src="' +
    spr(ST.g === "k" ? GIRL : MAN) +
    '" style="width:56px;image-rendering:pixelated" alt=""></div>';
  h += tab === 0 ? tToday() : tab === 1 ? tRoad() : tInspo();
  h +=
    '<nav><button class="' +
    (tab === 0 ? "on" : "") +
    '" data-a="tab" data-i="0">🎁 DZIŚ</button><button class="' +
    (tab === 1 ? "on" : "") +
    '" data-a="tab" data-i="1">🛷 DROGA</button><button class="' +
    (tab === 2 ? "on" : "") +
    '" data-a="tab" data-i="2">🎄 INSPO</button></nav>';
  a.innerHTML = h;
}

function tToday() {
  var t = today(),
    d = ST.v || t;
  if (t === 0) {
    return '<div class="px b"><h2 class="pf">JESZCZE CHWILA!</h2><p>Okienka otworzą się 1 grudnia. Do tego czasu odpocznij i przygotuj ciepłą herbatę.</p><button class="btn" data-a="test" data-d="1">PODEJRZYJ OKIENKO 1</button><p class="small">Tryb testowy tylko do podglądu aplikacji.</p></div>';
  }
  if (d > t) d = t;
  var h = "";
  if (!ST.open[d]) {
    return (
      '<div class="px"><h2 class="pf">OKIENKO NR ' +
      d +
      '</h2><button class="door" data-a="open" data-d="' +
      d +
      '"><b>' +
      d +
      '</b><span class="pf" style="font-size:10px">KLIKNIJ, ABY OTWORZYĆ</span></button></div>' +
      testBox(t)
    );
  }
  var task = (ST.g === "k" ? K : M)[d - 1];
  h +=
    '<div class="px r"><h2 class="pf">DZIEŃ ' +
    d +
    '</h2><p class="big">' +
    left(d) +
    '</p><label class="row"><input type="checkbox" data-a="done" data-d="' +
    d +
    '" ' +
    (ST.done[d] ? "checked" : "") +
    "><span>" +
    task +
    "</span></label></div>";
  h +=
    '<div class="px g"><h2 class="pf">BOJOWE WYZWANIE</h2><label class="row"><input type="checkbox" data-a="hdone" data-d="' +
    d +
    '" ' +
    (ST.hdone[d] ? "checked" : "") +
    "><span>" +
    H[d - 1] +
    "</span></label></div>";
  h +=
    '<div class="px"><h2 class="pf">CYTAT DNIA</h2><p><i>„' +
    Q[d - 1] +
    "”</i></p></div>";
  h +=
    '<div class="px b"><h2 class="pf">CIEKAWOSTKA</h2><p>' +
    F[d - 1] +
    "</p></div>";
  return h + testBox(t);
}

function testBox(t) {
  return ST.test !== null
    ? '<p class="small">Tryb testowy aktywny (dzień ' +
        ST.test +
        '). <button class="chip" data-a="test" data-d="' +
        Math.min(24, ST.test + 1) +
        '">dzień +</button> <button class="chip" data-a="test" data-d="' +
        Math.max(1, ST.test - 1) +
        '">dzień −</button> <button class="chip" data-a="test" data-d="off">wyłącz</button></p>'
    : "";
}

function tRoad() {
  var t = today(),
    h =
      '<div class="px"><h2 class="pf">DROGA DO WIGILII</h2><p class="small">Dotknij otwartego dnia, aby wrócić do jego zadań. Każdy otwarty dzień to +10 XP.</p><div class="road">';
  for (var i = 1; i <= 24; i++) {
    var c =
      i > t
        ? "lock"
        : ST.done[i] && ST.hdone[i]
          ? "done"
          : i === t
            ? "now"
            : "";
    var ic =
      i > t
        ? "🔒"
        : i === 24
          ? "⭐"
          : ST.done[i] && ST.hdone[i]
            ? "✅"
            : i === t
              ? "🛷"
              : i === 6
                ? "🎅"
                : i === 13
                  ? "🕯️"
                  : "❄️";
    h +=
      '<button class="node ' +
      c +
      '" data-a="go" data-d="' +
      i +
      '" ' +
      (i > t ? "disabled" : "") +
      ">" +
      i +
      "<span>" +
      ic +
      "</span></button>";
  }
  h += '</div></div><div class="px g"><h2 class="pf">OSIĄGNIĘCIA</h2>';
  var b = [];
  if (cnt(ST.open) >= 1) b.push("Pierwsze okienko");
  if (cnt(ST.done) >= 5) b.push("5 gestów miłości");
  if (cnt(ST.hdone) >= 5) b.push("5 domowych bitew");
  if (cnt(ST.open) >= 12) b.push("Półmetek adwentu");
  if (cnt(ST.open) >= 24) b.push("Wigilijny bohater");
  h += b.length
    ? b
        .map(function (x) {
          return '<span class="badge">🏅 ' + x + "</span>";
        })
        .join("")
    : '<p class="small">Otwieraj okienka i wykonuj zadania, aby zdobyć odznaki.</p>';
  h +=
    '<p class="small">Gestów miłości: ' +
    cnt(ST.done) +
    "/24 · Domowych wyzwań: " +
    cnt(ST.hdone) +
    "/24</p></div>";
  h +=
    '<div class="px"><button class="chip" data-a="reset">Zmień rolę lub zacznij od nowa</button></div>';
  return h;
}
var PK = {},
  PLAY = {};
function ytId(u) {
  var m = u && u.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
  return m ? m[1] : null;
}
function tInspo() {
  var h = "";
  ["film", "song", "dish"].forEach(function (k) {
    var o = INS[k],
      p = PK[k] !== undefined ? PK[k] : 0;

    // Pobieramy aktualnie wybraną pozycję (obsługujemy zarówno stringi, jak i obiekty dla piosenek)
    var currentItem = o.l[p];
    var currentText =
      typeof currentItem === "object" ? currentItem.name : currentItem;
    var currentUrl = typeof currentItem === "object" ? currentItem.url : null;

    h +=
      '<div class="px ' +
      (k === "film" ? "r" : k === "song" ? "b" : "g") +
      '"><h2 class="pf">' +
      o.i +
      " " +
      o.t.toUpperCase() +
      '</h2><p class="big">' +
      currentText +
      "</p>";

    // Jeśli piosenka ma link do YouTube, dodajemy przycisk otwierający klip
    // if (currentUrl) {
    //   h +=
    //     '<a href="' +
    //     currentUrl +
    //     '" target="_blank" class="btn s" style="display:inline-block;text-decoration:none;margin-bottom:10px;background:#c8312b;color:#fff;">▶ POSŁUCHAJ NA YT</a><br>';
    // }

    var vid = ytId(currentUrl);
    if (vid) {
      if (PLAY[k] === p) {
        h +=
          '<iframe src="https://www.youtube-nocookie.com/embed/' +
          vid +
          '?autoplay=1&rel=0&playsinline=1" title="Odtwarzacz YouTube" ' +
          'style="width:100%;aspect-ratio:16/9;border:4px solid var(--brown);background:#000;margin-bottom:8px" ' +
          'allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>' +
          '<p class="small"><a href="' +
          currentUrl +
          '" target="_blank" rel="noopener">Nie działa? Otwórz w YouTube</a></p>';
      } else {
        h +=
          '<button class="btn s" data-a="play" data-k="' +
          k +
          '" style="margin-bottom:10px">▶ POSŁUCHAJ</button><br>';
      }
    }

    h +=
      '<button class="btn s" data-a="rnd" data-k="' +
      k +
      '">LOSUJ</button><div class="chips">' +
      // // Generowanie małych przycisków na dole
      // h +=
      //   o.l
      //     // .map(function (x, i) {
      //     //   var label = typeof x === "object" ? x.name : x;
      //     //   return (
      //     //     '<button class="chip" data-a="sel" data-k="' +
      //     //     k +
      //     //     '" data-i="' +
      //     //     i +
      //     //     '">' +
      //     //     label.split(" –")[0] +
      //     //     "</button>"
      //     //   );
      //     // })
      //     .join("")
      "</div></div>";
  });
  h +=
    '<div class="px g"><h2 class="pf">💿 ŚWIĄTECZNE ALBUMY</h2><p class="small">Otwiera się w Spotify.</p><div class="chips">';
  ALB.forEach(function (x) {
    h +=
      '<a class="chip" style="text-decoration:none" href="' +
      spUrl(x) +
      '" target="_blank" rel="noopener">▶ ' +
      x.n +
      "</a>";
  });
  h += "</div></div>";
  return h;
}

document.addEventListener("click", function (e) {
  var el = e.target.closest("[data-a]");
  if (!el) return;
  var a = el.dataset.a,
    d = +el.dataset.d;
  if (a === "pick") {
    ST.g = el.dataset.g;
  } else if (a === "tab") {
    tab = +el.dataset.i;
  } else if (a === "open") {
    ST.open[d] = 1;
    ST.v = d;
  } else if (a === "go") {
    ST.v = d;
    tab = 0;
  } else if (a === "test") {
    if (el.dataset.d === "off") {
      ST.test = null;
      ST.v = null;
    } else {
      ST.test = d;
      ST.v = d;
    }
  } else if (a === "play") {
    PLAY[el.dataset.k] = PK[el.dataset.k] || 0;
  } else if (a === "rnd") {
    var o = INS[el.dataset.k];
    PK[el.dataset.k] = Math.floor(Math.random() * o.l.length);
    PLAY[el.dataset.k] = undefined;
  } else if (a === "sel") {
    PK[el.dataset.k] = +el.dataset.i;
    PLAY[el.dataset.k] = undefined;
  } else if (a === "reset") {
    if (confirm("Na pewno? Cały postęp zostanie usunięty.")) {
      ST = {
        g: null,
        open: {},
        done: {},
        hdone: {},
        test: null,
        v: null,
      };
      tab = 0;
    }
  } else return;
  save();
  render();
});

document.addEventListener("change", function (e) {
  var el = e.target;
  if (!el.dataset || !el.dataset.a) return;
  var d = +el.dataset.d,
    m = el.dataset.a === "done" ? ST.done : ST.hdone;
  if (el.dataset.a !== "done" && el.dataset.a !== "hdone") return;
  if (el.checked) m[d] = 1;
  else delete m[d];
  save();
  render();
});

snow();
render();
