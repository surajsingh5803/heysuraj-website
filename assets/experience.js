"use strict";
/* Experience Studio: six colour worlds, five motion scenes plus Still.
   The website remains fully usable without animation or storage access. */
(() => {
  const PALETTES = {
    lime:{name:"Midnight Lime",mode:"dark"},
    ivory:{name:"Ivory Atelier",mode:"light"},
    ocean:{name:"Deep Ocean",mode:"dark"},
    ember:{name:"Ember Studio",mode:"dark"},
    orchid:{name:"Orchid Night",mode:"dark"},
    rose:{name:"Rose Paper",mode:"light"}
  };
  const SCENES = {
    orbit:{name:"Orbit"},
    constellation:{name:"Constellation"},
    aurora:{name:"Aurora"},
    meteor:{name:"Meteor"},
    breathe:{name:"Breathe"},
    still:{name:"Still"}
  };
  const root=document.documentElement;
  const read=k=>{try{return localStorage.getItem(k)}catch{return null}};
  const save=(k,v)=>{try{localStorage.setItem(k,v)}catch{}};
  const by=id=>document.getElementById(id);
  const themeBtn=by("theme-toggle"),motionBtn=by("motion-toggle"),panel=by("experience-panel");
  if(!themeBtn||!motionBtn||!panel)return;
  const tabBtns=Array.from(panel.querySelectorAll("[data-studio-tab]"));
  const paletteBtns=Array.from(panel.querySelectorAll("[data-palette-option]"));
  const sceneBtns=Array.from(panel.querySelectorAll("[data-scene-option]"));
  const lightModes=new Set(["ivory","rose"]);
  let palette=PALETTES[read("hs-palette")]?read("hs-palette"):read("hs-theme")==="light"?"ivory":"lime";
  let scene=SCENES[read("hs-scene")]?read("hs-scene"):read("hs-motion")==="off"?"still":"orbit";
  let openTab="theme";
  let lastTrigger=null;

  function refreshChoiceLabels(){
    paletteBtns.forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.paletteOption===palette)));
    sceneBtns.forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.sceneOption===scene)));
    const current=by("studio-selection");
    if(current)current.textContent=openTab==="theme"?PALETTES[palette].name:SCENES[scene].name;
    themeBtn.title="Colour theme: "+PALETTES[palette].name;
    motionBtn.title="Animation: "+SCENES[scene].name;
  }
  function setPalette(value,announce=true){
    if(!PALETTES[value])return;
    palette=value;
    root.dataset.palette=value;
    root.dataset.theme=lightModes.has(value)?"light":"dark";
    const backgrounds={lime:"#070b12",ivory:"#f7f6f0",ocean:"#06121c",ember:"#150e0e",orchid:"#100d20",rose:"#fcf3f0"};
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content",backgrounds[value]);
    save("hs-palette",value);save("hs-theme",root.dataset.theme);
    refreshChoiceLabels();
    if(announce&&typeof toast==="function")toast(PALETTES[value].name+" theme applied");
  }
  function setScene(value,announce=true){
    if(!SCENES[value])return;
    scene=value;
    root.dataset.motionScene=value;
    root.dataset.motion=value==="still"?"off":"on";
    save("hs-scene",value);save("hs-motion",root.dataset.motion);
    refreshChoiceLabels();
    if(announce&&typeof toast==="function")toast(SCENES[value].name+" motion selected");
  }
  function setTab(which){
    openTab=which==="motion"?"motion":"theme";
    tabBtns.forEach(b=>b.setAttribute("aria-selected",String(b.dataset.studioTab===openTab)));
    by("studio-themes").hidden=openTab!=="theme";
    by("studio-motions").hidden=openTab!=="motion";
    refreshChoiceLabels();
  }
  function closePanel(focus=false){
    if(panel.hidden)return;
    panel.hidden=true;
    themeBtn.setAttribute("aria-expanded","false");motionBtn.setAttribute("aria-expanded","false");
    if(focus&&lastTrigger?.isConnected)lastTrigger.focus();
  }
  function openPanel(which){
    const isOpen=!panel.hidden;
    if(isOpen&&openTab===which){closePanel(true);return}
    lastTrigger=which==="theme"?themeBtn:motionBtn;
    setTab(which);
    panel.hidden=false;
    themeBtn.setAttribute("aria-expanded",String(which==="theme"));
    motionBtn.setAttribute("aria-expanded",String(which==="motion"));
  }
  // Initialise synchronously so controls and styles are in agreement.
  setPalette(palette,false);
  setScene(scene,false);
  themeBtn.addEventListener("click",()=>openPanel("theme"));
  motionBtn.addEventListener("click",()=>openPanel("motion"));
  by("studio-close").addEventListener("click",()=>closePanel(true));
  panel.querySelectorAll("[data-studio-tab]").forEach(b=>b.addEventListener("click",()=>setTab(b.dataset.studioTab)));
  paletteBtns.forEach(b=>b.addEventListener("click",()=>setPalette(b.dataset.paletteOption)));
  sceneBtns.forEach(b=>b.addEventListener("click",()=>setScene(b.dataset.sceneOption)));
  by("studio-reset").addEventListener("click",()=>{setPalette("lime",false);setScene("orbit",false);if(typeof toast==="function")toast("Original appearance restored")});
  document.addEventListener("pointerdown",e=>{
    if(!panel.hidden&&!panel.contains(e.target)&&!themeBtn.contains(e.target)&&!motionBtn.contains(e.target))closePanel();
  });
  document.addEventListener("keydown",e=>{
    if(panel.hidden)return;
    if(e.key==="Escape"){e.preventDefault();closePanel(true)}
    const active=document.activeElement;
    if(tabBtns.includes(active)&&(e.key==="ArrowLeft"||e.key==="ArrowRight")){
      e.preventDefault();const target=active.dataset.studioTab==="theme"?"motion":"theme";
      setTab(target);tabBtns.find(b=>b.dataset.studioTab===target)?.focus();
    }
  });
  // A global function is intentionally exposed for the existing command palette.
  window.openExperiencePanel=which=>openPanel(which);

  // Subtle cursor lighting for cards; no scrolling, resizing or DOM mutation.
  const canHover=matchMedia("(hover:hover) and (pointer:fine)");
  if(canHover.matches){
    let pending=false,focus=null,x=0,y=0;
    document.addEventListener("pointermove",e=>{
      const target=e.target.closest?.(".project-card,.article-card,.glass-card");
      if(!target)return;
      focus=target;x=e.clientX;y=e.clientY;
      if(pending)return;
      pending=true;
      requestAnimationFrame(()=>{
        pending=false;
        if(!focus||!focus.isConnected)return;
        const rect=focus.getBoundingClientRect();
        focus.style.setProperty("--spot-x",(x-rect.left)+"px");
        focus.style.setProperty("--spot-y",(y-rect.top)+"px");
      });
    },{passive:true});
  }
  // Magnetic navigation affordances: a few pixels, never a layout change.
  if(canHover.matches){
    document.querySelectorAll(".hero-actions .btn,.contact-actions .btn").forEach(btn=>{
      let rect=null;
      btn.addEventListener("pointerenter",()=>{rect=btn.getBoundingClientRect()});
      btn.addEventListener("pointermove",e=>{
        if(!rect||root.dataset.motion==="off"||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
        const dx=Math.max(-7,Math.min(7,(e.clientX-rect.left-rect.width/2)*.11));
        const dy=Math.max(-6,Math.min(6,(e.clientY-rect.top-rect.height/2)*.11));
        btn.style.setProperty("--magnet-x",dx.toFixed(1)+"px");
        btn.style.setProperty("--magnet-y",dy.toFixed(1)+"px");
      },{passive:true});
      btn.addEventListener("pointerleave",()=>{
        rect=null;btn.style.removeProperty("--magnet-x");btn.style.removeProperty("--magnet-y");
      });
    });
  }
})();