
/* ══════════════════════════════════
   CONFETTI
══════════════════════════════════ */
const CC = document.getElementById('confetti-canvas');
const ctx = CC.getContext('2d');
let pieces = [];
const COLORS = ['#ffd700','#ff4d8d','#4dd9ff','#00f0a0','#ff9f6b','#d085ff','#fff','#f472b6'];

function resizeCanvas(){
  CC.width = window.innerWidth;
  CC.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function spawnConfetti(n=180){
  for(let i=0;i<n;i++){
    pieces.push({
      x: Math.random()*CC.width,
      y: Math.random()*-CC.height*.5 - 20,
      w: Math.random()*9+4,
      h: Math.random()*5+3,
      color: COLORS[Math.floor(Math.random()*COLORS.length)],
      angle: Math.random()*Math.PI*2,
      spin: (Math.random()-.5)*.18,
      vx: (Math.random()-.5)*3.5,
      vy: Math.random()*3.5+2,
      life:1
    });
  }
}
spawnConfetti(200);

function drawConfetti(){
  ctx.clearRect(0,0,CC.width,CC.height);
  pieces = pieces.filter(p=>p.y < CC.height+40 && p.life>0);
  pieces.forEach(p=>{
    ctx.save();
    ctx.translate(p.x,p.y);
    ctx.rotate(p.angle);
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
    ctx.restore();
    p.x += p.vx; p.y += p.vy;
    p.angle += p.spin;
    p.vy += .04;
    p.vx *= .99;
  });
  requestAnimationFrame(drawConfetti);
}
drawConfetti();

/* ══════════════════════════════════
   FIREWORKS
══════════════════════════════════ */
const FC = document.getElementById('fireworks-canvas');
const fctx = FC.getContext('2d');
FC.width = window.innerWidth;
FC.height = window.innerHeight;
window.addEventListener('resize',()=>{FC.width=window.innerWidth;FC.height=window.innerHeight;});

let rockets = [], sparks = [], fwActive = false;

function launchFirework(x,y){
  const hue = Math.random()*360;
  for(let i=0;i<90;i++){
    const angle = (i/90)*Math.PI*2;
    const speed = Math.random()*7+3;
    sparks.push({
      x, y,
      vx: Math.cos(angle)*speed,
      vy: Math.sin(angle)*speed,
      color:`hsla(${hue+Math.random()*60},100%,70%,1)`,
      alpha:1, size: Math.random()*3+1.5,
      tail:[]
    });
  }
}

let fwTimer;
function startFireworks(){
  fwActive = true;
  function burst(){
    if(!fwActive) return;
    launchFirework(FC.width*.2+Math.random()*FC.width*.6, FC.height*.1+Math.random()*FC.height*.5);
    fwTimer = setTimeout(burst, 300+Math.random()*400);
  }
  burst();
  setTimeout(()=>{fwActive=false;clearTimeout(fwTimer);},6000);
}

function drawFireworks(){
  fctx.fillStyle='rgba(0,0,0,.18)';
  fctx.fillRect(0,0,FC.width,FC.height);
  sparks = sparks.filter(s=>s.alpha>.01);
  sparks.forEach(s=>{
    s.tail.push({x:s.x,y:s.y,a:s.alpha});
    if(s.tail.length>5)s.tail.shift();
    s.tail.forEach((t,i)=>{
      fctx.beginPath();
      fctx.arc(t.x,t.y,s.size*(i/s.tail.length),0,Math.PI*2);
      fctx.fillStyle=s.color.replace(/,1\)/,`,${t.a*.5})`);
      fctx.fill();
    });
    fctx.beginPath();
    fctx.arc(s.x,s.y,s.size,0,Math.PI*2);
    fctx.fillStyle=s.color;
    fctx.fill();
    s.x+=s.vx; s.y+=s.vy;
    s.vx*=.96; s.vy*=.96; s.vy+=.1;
    s.alpha-=.017;
  });
  if(!fwActive && sparks.length===0) fctx.clearRect(0,0,FC.width,FC.height);
  requestAnimationFrame(drawFireworks);
}
drawFireworks();

document.getElementById('celebrateBtn').addEventListener('click',()=>{
  startFireworks();
  spawnConfetti(160);
  document.getElementById('celebrateBtn').textContent='🎇 Woohoo! 🎇';
  setTimeout(()=>document.getElementById('celebrateBtn').textContent='🎆 Celebrate! 🎆',7000);
});

/* ══════════════════════════════════
   BALLOONS
══════════════════════════════════ */
const BW = document.getElementById('balloons-wrap');
const BCOLORS = [
  'radial-gradient(circle at 35% 30%,#ff91cacc,#ff4d8d)',
  'radial-gradient(circle at 35% 30%,#ffe98ecc,#ffd700)',
  'radial-gradient(circle at 35% 30%,#b3f0ffcc,#4dd9ff)',
  'radial-gradient(circle at 35% 30%,#a3ffddcc,#00f0a0)',
  'radial-gradient(circle at 35% 30%,#ffc9a3cc,#ff9f6b)',
  'radial-gradient(circle at 35% 30%,#e5b3ffcc,#d085ff)',
];
for(let i=0;i<18;i++){
  const b = document.createElement('div');
  b.className = 'balloon';
  b.style.cssText=`
    left:${Math.random()*94+1}%;
    background:${BCOLORS[i%BCOLORS.length]};
    --spd:${(Math.random()*7+9).toFixed(1)}s;
    --dly:${(Math.random()*12).toFixed(1)}s;
    width:${Math.random()*20+46}px;
  `;
  const shine = document.createElement('div');
  shine.className='balloon-shine';
  b.appendChild(shine);
  BW.appendChild(b);
}

/* ══════════════════════════════════
   CANDLES
══════════════════════════════════ */
const WCOLORS=['#ff4d8d','#ffd700','#d085ff','#4dd9ff','#00f0a0','#ff9f6b'];
const candlesRow = document.getElementById('candlesRow');
const N_CANDLES = 6;
let candlesOut = 0;

for(let i=0;i<N_CANDLES;i++){
  const unit = document.createElement('div');
  unit.className='candle-unit';
  unit.innerHTML=`
    <div class="flame-el" id="fl${i}"></div>
    <div class="smoke-el" id="sm${i}"></div>
    <div class="wax" id="wax${i}" style="background:linear-gradient(90deg,${WCOLORS[i]}99,${WCOLORS[i]},${WCOLORS[i]}99);"></div>
  `;
  candlesRow.appendChild(unit);
}

let allBlown=false;
document.getElementById('cakeOuter').addEventListener('click',()=>{
  if(allBlown){
    for(let i=0;i<N_CANDLES;i++){
      document.getElementById('fl'+i).classList.remove('blown');
      document.getElementById('sm'+i).classList.remove('puffing');
    }
    allBlown=false;
    candlesOut=0;
    document.getElementById('cakeHint').textContent='🕯️ Click the cake to blow out the candles!';
    return;
  }
  for(let i=0;i<N_CANDLES;i++){
    setTimeout(()=>{
      document.getElementById('fl'+i).classList.add('blown');
      const sm=document.getElementById('sm'+i);
      sm.classList.remove('puffing');
      void sm.offsetWidth;
      sm.classList.add('puffing');
      candlesOut++;
      if(candlesOut===N_CANDLES){
        document.getElementById('cakeHint').textContent='✨ Wish made! Click again to relight. ✨';
        spawnConfetti(100);
        allBlown=true;
      }
    },i*150);
  }
});

/* ══════════════════════════════════
   COUNTDOWN
══════════════════════════════════ */
function nextBirthday(){
  const now=new Date();
  let bd=new Date(now.getFullYear(), 6, 15); // July 15 — change as needed
  if(bd<=now) bd=new Date(now.getFullYear()+1, 6, 15);
  return bd;
}
function pad(n){return String(n).padStart(2,'0');}
function updateCD(){
  const diff=nextBirthday()-new Date();
  const d=Math.floor(diff/864e5);
  const h=Math.floor((diff%864e5)/36e5);
  const m=Math.floor((diff%36e5)/6e4);
  const s=Math.floor((diff%6e4)/1e3);
  document.getElementById('cd-days').textContent=pad(d);
  document.getElementById('cd-hours').textContent=pad(h);
  document.getElementById('cd-mins').textContent=pad(m);
  document.getElementById('cd-secs').textContent=pad(s);
}
updateCD();
setInterval(updateCD,1000);

/* ══════════════════════════════════
   TYPING TEXT
══════════════════════════════════ */
const messages=[
  "Wishing you a wonderful birthday filled with happiness and love 🌸",
  "May every dream you hold close come true this year ✨",
  "You make the world brighter just by being in it 🌟",
  "Here's to another year of adventures, laughter, and joy 🥂",
  "Today is YOUR day — celebrate every beautiful moment of it! 🎉",
];
let msgIdx=0, charIdx=0, deleting=false, typingEl=document.getElementById('typing-text');

function type(){
  const msg=messages[msgIdx];
  if(!deleting){
    charIdx++;
    typingEl.innerHTML=msg.slice(0,charIdx)+'<span class="cursor"></span>';
    if(charIdx===msg.length){
      deleting=true;
      setTimeout(type,2400);
      return;
    }
    setTimeout(type,48);
  } else {
    charIdx--;
    typingEl.innerHTML=msg.slice(0,charIdx)+'<span class="cursor"></span>';
    if(charIdx===0){
      deleting=false;
      msgIdx=(msgIdx+1)%messages.length;
      setTimeout(type,500);
      return;
    }
    setTimeout(type,22);
  }
}
setTimeout(type,900);

/* ══════════════════════════════════
   GALLERY
══════════════════════════════════ */
const memories=[
  {emoji:'🎂',caption:'First Birthday Party',c1:'#ff4d8d',c2:'#ff9f6b'},
  {emoji:'🎈',caption:'Balloon Fun',c1:'#4dd9ff',c2:'#d085ff'},
  {emoji:'🎁',caption:'Unwrapping Gifts',c1:'#ffd700',c2:'#00f0a0'},
  {emoji:'🌟',caption:'Starlight Wishes',c1:'#d085ff',c2:'#4dd9ff'},
  {emoji:'🎶',caption:'Dance & Music',c1:'#00f0a0',c2:'#ffd700'},
  {emoji:'🍰',caption:'Cake Time!',c1:'#ff9f6b',c2:'#ff4d8d'},
  {emoji:'🎊',caption:'Party Vibes',c1:'#4dd9ff',c2:'#ff9f6b'},
  {emoji:'💖',caption:'All the Love',c1:'#d085ff',c2:'#ff4d8d'},
];
const grid=document.getElementById('galleryGrid');
memories.forEach((m,i)=>{
  const card=document.createElement('div');
  card.className='gallery-card reveal';
  card.style.animationDelay=(i*.08)+'s';
  card.innerHTML=`
    <div class="gallery-placeholder" style="--c1:${m.c1};--c2:${m.c2};">${m.emoji}</div>
    <div class="g-caption">${m.caption}</div>
  `;
  grid.appendChild(card);
});

/* ══════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════ */
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting) e.target.classList.add('visible');});
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

/* ══════════════════════════════════
   MUSIC (Web Audio API)
══════════════════════════════════ */
const fab=document.getElementById('musicFab');
let audioCtx=null, masterGain=null, musicOn=false;

const MELODY=[
  // Happy Birthday tune: [freq, dur_beats]
  [261.6,.5],[261.6,.25],[293.7,.75],[261.6,.75],[349.2,.75],[329.6,1.5],
  [261.6,.5],[261.6,.25],[293.7,.75],[261.6,.75],[392.0,.75],[349.2,1.5],
  [261.6,.5],[261.6,.25],[523.2,.75],[440.0,.75],[349.2,.75],[329.6,.75],[293.7,1.5],
  [466.2,.5],[466.2,.25],[440.0,.75],[349.2,.75],[392.0,.75],[349.2,1.75],
];

function playMelody(startT){
  let t=startT, beat=0.42;
  MELODY.forEach(([f,d])=>{
    const osc=audioCtx.createOscillator();
    const env=audioCtx.createGain();
    const rev=audioCtx.createGain();
    osc.type='triangle';
    osc.frequency.setValueAtTime(f,t);
    env.gain.setValueAtTime(0,t);
    env.gain.linearRampToValueAtTime(.55,t+.04);
    env.gain.linearRampToValueAtTime(0,t+d*beat-.04);
    osc.connect(env); env.connect(masterGain);
    osc.start(t); osc.stop(t+d*beat);
    t+=d*beat;
  });
  return t;
}

fab.addEventListener('click',()=>{
  if(!musicOn){
    musicOn=true;
    fab.textContent='🎶';
    fab.classList.add('on');
    startMusic();
  } else {
    musicOn=false;
    fab.textContent='🎵';
    fab.classList.remove('on');
    if(audioCtx){audioCtx.close();audioCtx=null;}
  }
});

// Auto-start on first user interaction
window.addEventListener('click',function autoStart(){
  if(!musicOn){
    musicOn=true;
    fab.textContent='🎶';
    fab.classList.add('on');
    startMusic();
  }
  window.removeEventListener('click',autoStart);
},{once:true,capture:true});
