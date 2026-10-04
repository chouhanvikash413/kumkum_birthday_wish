/* =========================================================
   BIRTHDAY SURPRISE — PERSONALIZATION
   Change ONLY these values to make the website yours.
   ========================================================= */
const birthdayPerson = "Kumkum";
const senderName = "Big Bro";
const birthdayMessage = `Today is not just another day.
It's the day someone truly special came into this world.

May your life always be filled with happiness,
beautiful memories, endless smiles and everything
your heart wishes for.

Happy Birthday! ❤️`;
const birthdayMusic = "Birthday.mpeg";

const photos = [
  "photo1.jpeg",
  "photo2.jpeg",
  "photo3.jpeg",
  "photo4.jpeg"
];

/* Optional: edit these memory cards if you want different dates/titles. */
const memoryData = [
  {date:"01 · First chapter", title:"The beginning", text:"Some of the most beautiful stories begin quietly, then become impossible to forget."},
  {date:"02 · Favorite day", title:"A moment to remember", text:"Smiles, silly conversations and memories that somehow became our favorites."},
  {date:"03 · Forever growing", title:"More to come", text:"The best part of memories is knowing there are still so many beautiful ones ahead."},
  {date:"04 · Today", title:"Your special day", text:"Today deserves to be remembered too—because you deserve to be celebrated."}
];

/* -------------------- DOM -------------------- */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const pages = $$(".page");
const progressBar = $("#progressBar");
const pageNav = $("#pageNav");
const audio = $("#birthdayAudio");
let currentPage = 0;
let musicStarted = false;
let muted = false;

/* -------------------- PERSONALIZE -------------------- */
document.title = `Happy Birthday, ${birthdayPerson} ❤️`;
$$(".person-name").forEach(el => el.textContent = birthdayPerson);
$("#senderName").textContent = senderName;
$("#finalSender").textContent = senderName;
$("#birthdayMessage").innerHTML = birthdayMessage.replace(/\n/g, "<br>");

/* -------------------- LOADING -------------------- */
window.addEventListener("load", () => {
  document.body.classList.add("locked");
  setTimeout(() => {
    $("#loader").classList.add("hide");
    document.body.classList.remove("locked");
    createAmbient();
  }, 2200);
});

/* -------------------- PAGE NAVIGATION -------------------- */
pages.forEach((_, i) => {
  const b = document.createElement("button");
  b.setAttribute("aria-label", `Go to page ${i + 1}`);
  b.addEventListener("click", () => goToPage(i));
  pageNav.appendChild(b);
});

function goToPage(index, animate = true) {
  index = Math.max(0, Math.min(pages.length - 1, index));
  if (index === currentPage && pages[index].classList.contains("active")) return;
  pages[currentPage].classList.remove("active");
  currentPage = index;
  pages[currentPage].classList.add("active");
  progressBar.style.width = `${((index + 1) / pages.length) * 100}%`;
  $$("#pageNav button").forEach((b, i) => b.classList.toggle("active", i === index));
  window.scrollTo({top:0, behavior: animate ? "smooth" : "auto"});
  observeCurrentPage();
}

function nextPage(){ goToPage(currentPage + 1); }

$$(".next-btn").forEach(btn => btn.addEventListener("click", nextPage));
$("#brandBtn").addEventListener("click", () => goToPage(0));

/* Keyboard navigation */
document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") nextPage();
  if (e.key === "ArrowLeft") goToPage(currentPage - 1);
});

/* -------------------- OPEN SURPRISE -------------------- */
$("#openSurprise").addEventListener("click", () => {
  startMusic();
  confetti(130);
  burstHearts(12);
  setTimeout(() => goToPage(1), 550);
});

/* -------------------- MUSIC -------------------- */
audio.src = birthdayMusic;

async function startMusic() {
  if (musicStarted) return;
  try {
    await audio.play();
    musicStarted = true;
    $("#musicBtn").textContent = "❚❚";
    $("#musicBtn").setAttribute("aria-label", "Pause music");
  } catch (err) {
    /* Browser may require another interaction or the file may be missing. */
  }
}

$("#musicBtn").addEventListener("click", async () => {
  if (audio.paused) {
    try {
      await audio.play();
      musicStarted = true;
      $("#musicBtn").textContent = "❚❚";
    } catch(e) {}
  } else {
    audio.pause();
    $("#musicBtn").textContent = "♫";
  }
});

$("#muteBtn").addEventListener("click", () => {
  muted = !muted;
  audio.muted = muted;
  $("#muteBtn").textContent = muted ? "🔇" : "🔊";
  $("#muteBtn").setAttribute("aria-label", muted ? "Unmute music" : "Mute music");
});

/* -------------------- PHOTOS -------------------- */
const track = $("#photoTrack");
const dots = $("#photoDots");
let photoIndex = 0;

function makePhoto(src, i) {
  const fig = document.createElement("figure");
  fig.className = "photo-card";
  fig.innerHTML = `
    <img src="${src}" alt="Birthday memory ${i + 1}" loading="${i === 0 ? "eager" : "lazy"}"
         onerror="this.src='data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000">
            <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#32183d"/><stop offset="1" stop-color="#ff5f8a"/></linearGradient></defs>
            <rect width="100%" height="50%" fill="url(#g)"/>
            <text x="50%" y="48%" fill="white" font-size="42" font-family="Arial" text-anchor="middle">Your Photo</text>
            <text x="50%" y="54%" fill="#ffd7e5" font-size="24" font-family="Arial" text-anchor="middle">Replace ${src}</text>
          </svg>`)}'">
    <figcaption>Memory ${i + 1} · ${birthdayPerson} ❤️</figcaption>
  `;
  return fig;
}
photos.forEach((src, i) => {
  track.appendChild(makePhoto(src, i));
  const d = document.createElement("button");
  d.setAttribute("aria-label", `Show photo ${i + 1}`);
  d.addEventListener("click", () => showPhoto(i));
  dots.appendChild(d);
});
function showPhoto(i) {
  photoIndex = (i + photos.length) % photos.length;
  track.scrollTo({left: track.clientWidth * photoIndex, behavior:"smooth"});
  $$("#photoDots button").forEach((d,j) => d.classList.toggle("active", j === photoIndex));
}
$(".carousel-btn.next").addEventListener("click", () => showPhoto(photoIndex + 1));
$(".carousel-btn.prev").addEventListener("click", () => showPhoto(photoIndex - 1));
track.addEventListener("scroll", () => {
  const i = Math.round(track.scrollLeft / track.clientWidth);
  if (i !== photoIndex) {
    photoIndex = i;
    $$("#photoDots button").forEach((d,j) => d.classList.toggle("active", j === photoIndex));
  }
});
showPhoto(0);

/* Touch/swipe support */
let touchStartX = 0;
track.addEventListener("touchstart", e => touchStartX = e.changedTouches[0].screenX, {passive:true});
track.addEventListener("touchend", e => {
  const delta = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(delta) > 45) showPhoto(photoIndex + (delta < 0 ? 1 : -1));
}, {passive:true});

/* -------------------- MEMORY DATA -------------------- */
const memoryCards = $$(".memory-card");
memoryCards.forEach((card, i) => {
  const m = memoryData[i];
  if (!m) return;
  card.querySelector(".memory-date").textContent = m.date;
  card.querySelector("h3").textContent = m.title;
  card.querySelector("p").textContent = m.text;
});

/* -------------------- GIFT -------------------- */
$("#gift").addEventListener("click", () => {
  const gift = $("#gift");
  if (gift.classList.contains("open")) return;
  gift.classList.add("open");
  $("#giftHint").textContent = "A little happiness, just for you ✨";
  $("#giftMessage").classList.add("show");
  confetti(180);
  burstHearts(22);
});

/* -------------------- CAKE -------------------- */
function blowCandles() {
  const cake = $("#bigCake");
  if (cake.classList.contains("blown")) return;
  cake.classList.add("blown");
  $("#wishMessage").textContent = "Make a Wish! ✨ May it come true.";
  confetti(170);
  burstHearts(16);
}
$("#bigCake").addEventListener("click", blowCandles);
$("#bigCake").addEventListener("keydown", e => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    blowCandles();
  }
});

/* -------------------- REPLAY -------------------- */
$("#replay").addEventListener("click", () => {
  currentPage = 0;
  pages.forEach(p => p.classList.remove("active"));
  pages[0].classList.add("active");
  progressBar.style.width = "12.5%";
  $$("#pageNav button").forEach((b,i) => b.classList.toggle("active", i === 0));

  $("#gift").classList.remove("open");
  $("#giftMessage").classList.remove("show");
  $("#giftHint").textContent = "Tap the gift to open it";
  $("#bigCake").classList.remove("blown");
  $("#wishMessage").textContent = "Click the candles and make a wish! 🕯️";
  showPhoto(0);
  confetti(90);
  window.scrollTo({top:0, behavior:"smooth"});
});

/* -------------------- SCROLL REVEALS -------------------- */
let observer;
function observeCurrentPage() {
  if (observer) observer.disconnect();
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, {threshold:.15});
  $$(".reveal-on-scroll").forEach(el => observer.observe(el));
}
observeCurrentPage();

/* -------------------- AMBIENT PARTICLES -------------------- */
function createAmbient() {
  const ambient = $("#ambient");
  for (let i = 0; i < 26; i++) {
    const p = document.createElement("i");
    p.className = "particle";
    p.style.left = `${Math.random()*100}%`;
    p.style.animationDuration = `${8 + Math.random()*14}s`;
    p.style.animationDelay = `${-Math.random()*15}s`;
    p.style.opacity = `${.15 + Math.random()*.55}`;
    p.style.transform = `scale(${.5 + Math.random()*1.8})`;
    ambient.appendChild(p);
  }
  setInterval(() => {
    if (document.hidden) return;
    const h = document.createElement("span");
    h.className = "float-heart";
    h.textContent = Math.random() > .25 ? "♥" : "✦";
    h.style.left = `${5 + Math.random()*90}%`;
    h.style.bottom = "-30px";
    h.style.fontSize = `${10 + Math.random()*14}px`;
    h.style.animationDuration = `${5 + Math.random()*6}s`;
    ambient.appendChild(h);
    setTimeout(() => h.remove(), 12000);
  }, 900);
}

/* -------------------- CONFETTI CANVAS -------------------- */
const canvas = $("#confettiCanvas");
const ctx = canvas.getContext("2d");
let pieces = [];
let animationFrame = null;

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function confetti(count=100) {
  const shapes = ["rect","circle","heart"];
  for (let i=0;i<count;i++) {
    pieces.push({
      x: innerWidth/2 + (Math.random()-.5)*90,
      y: innerHeight*.42 + (Math.random()-.5)*40,
      vx:(Math.random()-.5)*11, vy:-Math.random()*10-4,
      size:4+Math.random()*7, rot:Math.random()*6.28,
      vr:(Math.random()-.5)*.25, life:1,
      shape:shapes[Math.floor(Math.random()*shapes.length)],
      hue:Math.floor(Math.random()*360)
    });
  }
  if (!animationFrame) animateConfetti();
}
function animateConfetti() {
  ctx.clearRect(0,0,innerWidth,innerHeight);
  pieces = pieces.filter(p => p.life > 0);
  pieces.forEach(p => {
    p.vy += .23;p.x += p.vx;p.y += p.vy;p.rot += p.vr;p.life -= .009;
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);
    ctx.globalAlpha = Math.max(0,p.life);
    ctx.fillStyle = `hsl(${p.hue} 85% 70%)`;
    if (p.shape === "circle") {
      ctx.beginPath();ctx.arc(0,0,p.size/2,0,Math.PI*2);ctx.fill();
    } else if (p.shape === "heart") {
      ctx.font = `${p.size*2.5}px serif`;ctx.textAlign="center";ctx.fillText("♥",0,p.size);
    } else ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*1.6);
    ctx.restore();
  });
  if (pieces.length) animationFrame = requestAnimationFrame(animateConfetti);
  else {cancelAnimationFrame(animationFrame);animationFrame=null}
}

/* -------------------- HEART BURST -------------------- */
function burstHearts(count=12) {
  const ambient = $("#ambient");
  for(let i=0;i<count;i++){
    const h=document.createElement("span");
    h.className="float-heart";
    h.textContent="♥";
    h.style.left="50%";
    h.style.bottom="42%";
    h.style.fontSize=`${10+Math.random()*20}px`;
    h.style.animationDuration=`${2+Math.random()*2}s`;
    h.style.animationName="heartBurst";
    h.style.setProperty("--x", `${(Math.random()-.5)*70}vw`);
    ambient.appendChild(h);
    setTimeout(()=>h.remove(),4500);
  }
}

/* Dynamic heart burst animation */
const burstStyle = document.createElement("style");
burstStyle.textContent = `@keyframes heartBurst{from{transform:translate(0,0) scale(.5);opacity:1}to{transform:translate(var(--x),-65vh) scale(1.4) rotate(25deg);opacity:0}}`;
document.head.appendChild(burstStyle);

/* -------------------- SWIPE BETWEEN PAGES ON MOBILE -------------------- */
let pageTouchX = 0;
let pageTouchY = 0;
document.addEventListener("touchstart", e => {
  pageTouchX = e.changedTouches[0].screenX;
  pageTouchY = e.changedTouches[0].screenY;
}, {passive:true});
document.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].screenX - pageTouchX;
  const dy = e.changedTouches[0].screenY - pageTouchY;
  if (Math.abs(dx) > 80 && Math.abs(dx) > Math.abs(dy)*1.5) {
    goToPage(currentPage + (dx < 0 ? 1 : -1));
  }
}, {passive:true});

/* Initial nav state */
$$("#pageNav button").forEach((b,i) => b.classList.toggle("active", i === 0));
