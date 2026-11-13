"use strict";
(()=>{
 const root=document.documentElement;
 const palettes=["lime","ivory","ocean","ember","orchid","rose"];
 const isLight=p=>p==="ivory"||p==="rose";
 const get=(k)=>{try{return localStorage.getItem(k)}catch{return null}};
 const put=(k,v)=>{try{localStorage.setItem(k,v)}catch{}};
 let palette=palettes.includes(get("hs-palette"))?get("hs-palette"):"lime";
 root.dataset.palette=palette;root.dataset.theme=isLight(palette)?"light":"dark";
 root.dataset.motion=get("hs-motion")==="off"?"off":"on";
 const ui=document.querySelector("[data-cycle-palette]");
 if(ui){
  ui.title="Switch colour world";
  ui.addEventListener("click",()=>{
   palette=palettes[(palettes.indexOf(palette)+1)%palettes.length];
   root.dataset.palette=palette;root.dataset.theme=isLight(palette)?"light":"dark";
   put("hs-palette",palette);put("hs-theme",root.dataset.theme);
   ui.title="Colour world: "+palette;
  });
 }
 const toggle=document.querySelector("[data-mobile-menu]");
 const nav=document.querySelector("[data-inner-nav]");
 if(toggle&&nav){
  toggle.addEventListener("click",()=>{
   const expanded=toggle.getAttribute("aria-expanded")==="true";
   toggle.setAttribute("aria-expanded",String(!expanded));
   nav.classList.toggle("open",!expanded);
  });
 }
 const progress=document.getElementById("progress");let waiting=false;
 window.addEventListener("scroll",()=>{
  if(waiting||!progress)return;waiting=true;
  requestAnimationFrame(()=>{waiting=false;const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max?Math.min(100,scrollY/max*100):0)+"%"});
 },{passive:true});
 const year=document.getElementById("year");if(year)year.textContent=String(new Date().getFullYear());
})();
