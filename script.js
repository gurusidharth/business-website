const header=document.getElementById("header"), menu=document.querySelector(".menu"), nav=document.querySelector(".nav nav");
menu?.addEventListener("click",()=>nav.classList.toggle("open"));
document.querySelectorAll("nav a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
window.addEventListener("scroll",()=>header.classList.toggle("scrolled",scrollY>15));

const reveals=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(x=>reveals.observe(x));

const hero=document.getElementById("hero"), visual=document.getElementById("heroVisual");
hero.addEventListener("pointermove",e=>{
 const r=hero.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
 visual.style.transform=`translate(${x*10}px,${y*8}px)`;
});
hero.addEventListener("pointerleave",()=>visual.style.transform="translate(0,0)");

const currencies={
 INR:{name:"Indian Rupee",symbol:"₹",rate:1,base:"INR",decimals:0},
 AED:{name:"UAE Dirham",symbol:"د.إ",rate:.044,base:"INR",decimals:0},
 USD:{name:"US Dollar",symbol:"$",rate:.0118,base:"INR",decimals:2},
 GBP:{name:"British Pound",symbol:"£",rate:.0091,base:"INR",decimals:2},
 EUR:{name:"Euro",symbol:"€",rate:.0109,base:"INR",decimals:2},
 SAR:{name:"Saudi Riyal",symbol:"﷼",rate:.0442,base:"INR",decimals:0},
 SGD:{name:"Singapore Dollar",symbol:"S$",rate:.0152,base:"INR",decimals:2},
 AUD:{name:"Australian Dollar",symbol:"A$",rate:.0182,base:"INR",decimals:2},
 CAD:{name:"Canadian Dollar",symbol:"C$",rate:.0161,base:"INR",decimals:2}
};
const basePrices={solo:999,team:2499,scale:4999};
let currency="INR", billing="monthly";

function detectCurrency(){
 const tz=Intl.DateTimeFormat().resolvedOptions().timeZone||"";
 const locale=navigator.language||"";
 if(tz==="Asia/Kolkata"||tz==="Asia/Calcutta"||locale.endsWith("-IN")) return "INR";
 if(tz==="Asia/Dubai"||tz==="Asia/Abu_Dhabi"||locale.endsWith("-AE")) return "AED";
 if(tz==="Asia/Riyadh"||locale.endsWith("-SA")) return "SAR";
 if(tz==="Europe/London"||locale==="en-GB") return "GBP";
 if(tz.startsWith("Europe/")||locale.endsWith("-DE")||locale.endsWith("-FR")||locale.endsWith("-IT")||locale.endsWith("-ES")) return "EUR";
 if(tz==="Asia/Singapore"||locale.endsWith("-SG")) return "SGD";
 if(tz==="Australia/Sydney"||tz==="Australia/Melbourne"||locale.endsWith("-AU")) return "AUD";
 if(tz==="America/Toronto"||tz==="America/Vancouver"||locale.endsWith("-CA")) return "CAD";
 return "USD";
}
currency=detectCurrency();

function formatMoney(n){
 const c=currencies[currency];
 return new Intl.NumberFormat(undefined,{minimumFractionDigits:c.decimals,maximumFractionDigits:c.decimals}).format(n*c.rate);
}
function updatePricing(){
 const c=currencies[currency];
 document.getElementById("currencyName").textContent=c.name;
 document.getElementById("currencySelect").value=currency;
 document.querySelectorAll(".price-card").forEach(card=>{
   const key=card.querySelector("[data-price]")?.dataset.price;if(!key)return;
   const raw=basePrices[key]*(billing==="annual"?.8:1);
   card.querySelector("[data-price]").textContent=formatMoney(raw);
   card.querySelector(".currency-symbol").textContent=c.symbol;
 });
}
document.getElementById("currencySelect").addEventListener("change",e=>{currency=e.target.value;localStorage.setItem("os_currency",currency);updatePricing()});
document.querySelectorAll(".billing-toggle button").forEach(b=>b.addEventListener("click",()=>{
 document.querySelectorAll(".billing-toggle button").forEach(x=>x.classList.remove("active"));b.classList.add("active");billing=b.dataset.billing;updatePricing();
}));
const saved=localStorage.getItem("os_currency");if(saved&&currencies[saved])currency=saved;
updatePricing();

document.getElementById("contactForm").addEventListener("submit",e=>{
 e.preventDefault();
 document.getElementById("formMessage").textContent="Thanks — your enquiry is ready to be connected to your email or CRM backend.";
 e.target.reset();
});

/* ===== PREMIUM MOTION ENGINE ===== */
(function(){
  const hero=document.getElementById("hero");
  if(hero){
    const video=document.createElement("video");
    video.className="hero-video";
    video.autoplay=true; video.muted=true; video.loop=true; video.playsInline=true;
    video.setAttribute("aria-hidden","true");
    video.innerHTML='<source src="hero-premium-bg.mp4" type="video/mp4">';
    hero.prepend(video);
  }

  const cards=[...document.querySelectorAll(".service-demo,.price-card,.principles>div,.form,.workflow-step")];
  cards.forEach(card=>{
    card.addEventListener("pointermove",e=>{
      if(window.innerWidth<800)return;
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(1000px) rotateX(${(-y*4).toFixed(2)}deg) rotateY(${(x*5).toFixed(2)}deg) translateY(-6px)`;
    });
    card.addEventListener("pointerleave",()=>{card.style.transform=""});
  });

  // Subtle mouse parallax for the hero visual.
  const hv=document.getElementById("heroVisual");
  if(hv && hero){
    hero.addEventListener("pointermove",e=>{
      if(innerWidth<800)return;
      const r=hero.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      hv.style.transform=`translate3d(${x*12}px,${y*8}px,0)`;
      const d=hv.querySelector(".dashboard");
      if(d)d.style.transform=`rotateY(${(-12+x*9).toFixed(2)}deg) rotateX(${(6-y*6).toFixed(2)}deg) rotateZ(-1deg) translateZ(10px)`;
    });
    hero.addEventListener("pointerleave",()=>{
      hv.style.transform="";
      const d=hv.querySelector(".dashboard");
      if(d)d.style.transform="";
    });
  }
})();

/* Interactive service switcher: click a tab, or scroll to a detail section, to change the active panel. */
(function(){
  const map={ai:"ss-ai",crm:"ss-crm",marketing:"ss-marketing",analytics:"ss-analytics",erp:"ss-erp"};
  function activate(target){
    document.querySelectorAll(".ss-tab").forEach(t=>t.classList.toggle("active",t.dataset.target===target));
    document.querySelectorAll(".ss-panel").forEach(p=>p.classList.toggle("active",p.id===target));
  }
  document.querySelectorAll(".ss-tab").forEach(tab=>tab.addEventListener("click",()=>activate(tab.dataset.target)));

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      activate(map[entry.target.id]);
    });
  },{rootMargin:"-30% 0px -50% 0px"});
  Object.keys(map).forEach(id=>{const el=document.getElementById(id);if(el)observer.observe(el)});
})();
