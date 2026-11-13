/* Pico v1 — a friendly visitor companion for HeySuraj.
   Client-only social mode is intentional: no invisible tracking, no secret keys.
   An optional private service activates AI + secure message storage. */
(async function(){
"use strict";
if(document.getElementById("pico-root"))return;
let fragment;
try {const res=await fetch("/assets/pico-widget.html");if(!res.ok)throw Error("widget");fragment=await res.text();}
catch(error){console.warn("Pico interface unavailable",error);return;}
const root=document.createElement("aside");root.id="pico-root";root.setAttribute("aria-label","Pico, the friendly red panda");root.innerHTML=fragment;document.body.append(root);
const $=id=>document.getElementById(id);
const API=String(window.PICO_CONFIG&&window.PICO_CONFIG.apiBase||"").replace(/\/+$/,"");
const PRIV="917257919567";
const store={
 read:(k,local=false)=>{try{return (local?localStorage:sessionStorage).getItem(k)}catch{return null}},
 write:(k,v,local=false)=>{try{(local?localStorage:sessionStorage).setItem(k,v)}catch{}},
 del:k=>{try{sessionStorage.removeItem(k)}catch{}}
};
function cap(t,n=900){return String(t==null?"":t).trim().slice(0,n);}
function pick(a){return a[Math.floor(Math.random()*a.length)];}
function fromSession(){try{const v=JSON.parse(store.read("hs.pico.session")||"null");return v&&Array.isArray(v.history)?v:null;}catch{return null;}}
function preferences(){const defaults={voice:false,music:false,fx:false,follow:false,quiet:false};try{const v=JSON.parse(store.read("hs.pico.prefs",true)||"null");if(v&&typeof v==="object")for(const k of Object.keys(defaults))if(typeof v[k]==="boolean")defaults[k]=v[k];}catch{}return defaults;}
let prefs=preferences();const previous=fromSession();
const state={role:previous&&previous.role||null,history:previous&&previous.history.slice(-18)||[],nudges:previous&&previous.nudges||0,lastNudge:previous&&previous.lastNudge||0,petCount:0,open:false,view:"chat",busy:false,interactions:0,section:"home",voiceRecording:null};
const voiceCapable="speechSynthesis" in window;
let audio=null,musicHandle=0,musicStep=0,animationHandle=0,nudgeHandle=0;
const spriteButton=$("pico-sprite-button"),sprite=$("pico-sprite"),panel=$("pico-panel"),chat=$("pico-chat"),input=$("pico-input"),nudge=$("pico-nudge");
const about={
 story:"Suraj's journey connects business education, banking, real estate, digital marketing, client work and building AI tools. I like that he doesn't fit neatly inside one label.",
 school:"Suraj studied PGDM / MBA at ISB&M Pune from 2022 to 2024, with Marketing and HR specialisations. He was part of the Digital Marketing Cell and college events too.",
 work:"His work includes SEO, local search, paid ads, analytics, client reporting and strategy. He cares more about meaningful enquiries than vanity numbers.",
 lazy:"Lazy Plex is his independent venture. It began with digital services and evolved toward strategic consulting and practical systems.",
 products:"He's experimenting with an SEO Audit Engine, LP LeadOS for finding relevant prospects, LP CRM and other tools. Some are experiments or works in progress—not all finished products.",
 hobby:"He has explored gaming and creative content projects too, not just marketing and AI. Curiosity doesn't obey job titles.",
 website:"A fun fact: Suraj learned he could host his personal website on GitHub Pages without buying conventional web hosting. That discovery made him excited to build more.",
 motto:"He says: 'A mix of ventures, experiments and tools — because the best way to learn is to build.' I keep repeating that to my stuffed-animal friends."
};
const modes={
 friend:{intro:["Wait, you know Suraj? 🐾 That's exciting! Are you an old friend, college friend or work friend?","Ooooh! A friend of Suraj? Now I'm curious. How do you two know each other?"],follow:["I bet you have stories I don't know. What's a fun memory?","If you'd like to leave him a surprise note, I'll help you prepare one."]},
 recruiter:{intro:["A recruiter? I'll put on my imaginary tiny blazer. What sort of role are you looking to fill?","Professional visitor detected! What kind of opportunity would you like to discuss?"],follow:["He's worked across digital marketing, client-facing roles and software experiments. What kind of position are you considering?","If you share the role, location and what matters to your team, I can help you prepare a message for Suraj."]},
 founder:{intro:["Someone building a business? I love that! What's the big idea?","Oh, a fellow builder! Are you launching, growing or fixing something?"],follow:["What part of the business is the hardest to solve right now?","Suraj likes turning ideas into practical things. What are you hoping to create?"]},
 visitor:{intro:["You're here just to hang out? Perfect. I live here for that. 🐾","No agenda? That's my favourite kind of visit. What's on your mind?"],follow:["Tell me about your day. I'm a very good listener, despite these enormous ears.","We can chat about anything, or you can ask me about Suraj. No pressure."]}
};
const sections={
 home:"Psst! This is Suraj's digital home, but I prefer making friends to giving tours.",
 about:"This is his story corner. His path has a lot of turns, and that's what I like about it.",
 work:"Here he talks about the difference between getting clicks and actually helping a business.",
 projects:"Oh, the experiments! This section makes my tail wag.",
 lab:"This is where the curious ideas live. My kind of chaos!",
 writing:"Some deep-dive guides live here. I pretend to read them but sometimes nap on the keyboard.",
 article:"You're reading. I'll stay quiet unless you want company.",
 project:"This one has a longer project story. We can talk about the real challenges behind it.",
 contact:"If there's something you'd like to tell Suraj, I can help you prepare a note."
};
function where(){
 const p=location.pathname,h=location.hash;
 if(p.startsWith("/projects/"))return "project";
 if(p.startsWith("/about/"))return "about";
 if(p.startsWith("/work/"))return "work";
 if(p.startsWith("/writing/")&&p!=="/writing/")return "article";
 if(p==="/writing/")return "writing";
 for(const key of ["about","work","projects","lab","writing","contact"])if(h==="#"+key)return key;
 return "home";
}
state.section=where();
function persist(){
 store.write("hs.pico.session",JSON.stringify({role:state.role,history:state.history.slice(-18),nudges:state.nudges,lastNudge:state.lastNudge}));
}
function mood(name,time=900){
 for(const v of ["pico-sleeping","pico-speaking","pico-petting","pico-celebrate","pico-hop","pico-curious","pico-scratch","pico-walk","pico-stretch","pico-yawn","pico-peek","pico-wiggle"])root.classList.remove(v);
 root.classList.add(name);clearTimeout(animationHandle);
 animationHandle=setTimeout(()=>{root.classList.remove(name);},time);
}
function appendMessage(who,text,quiet=false,save=true){
 const value=cap(text,900);const box=document.createElement("div");box.className="pico-turn";box.dataset.who=who;
 const label=document.createElement("small");label.textContent=who==="pico"?"Pico":"You";
 const bubble=document.createElement("div");bubble.className="pico-message";bubble.textContent=value;
 box.append(label,bubble);$("pico-choices")?.remove();chat.append(box);chat.scrollTop=chat.scrollHeight;
 if(save){state.history.push({who,text:value});state.history=state.history.slice(-18);persist();}
 if(who==="pico"&&!quiet){mood("pico-speaking",Math.min(1800,Math.max(450,value.length*17)));if(prefs.voice)speak(value);}
}
function choices(custom){
 $("pico-choices")?.remove();
 const values=custom||(state.role?[["Ask a secret","secret"],["Tell me about Suraj","about"],["Leave a message","note"]]:[["I'm a friend","friend"],["I'm a recruiter","recruiter"],["I run a business","founder"],["Just hanging out","visitor"]]);
 const div=document.createElement("div");div.className="pico-chips";div.id="pico-choices";
 for(const [label,cmd] of values){
  const button=document.createElement("button");button.className="pico-chip";button.type="button";button.textContent=label;
  button.addEventListener("click",()=>{if(cmd==="note"){showView("contact");return}if(modes[cmd]){appendMessage("visitor",label,true);setRole(cmd);return}sendText(cmd==="secret"?"Tell me a secret about Suraj":cmd==="about"?"Tell me about Suraj":label);});
  div.append(button);
 }
 chat.append(div);chat.scrollTop=chat.scrollHeight;
}
function setRole(role){
 state.role=role;persist();appendMessage("pico",pick(modes[role].intro));choices(role==="friend"?[["From college","college"],["From work","work friend"],["Send a surprise","note"]]:role==="founder"?[["Launching something","launch"],["Marketing challenge","marketing"],["Contact Suraj","note"]]:role==="recruiter"?[["Marketing role","marketing"],["AI role","ai"],["Share opportunity","note"]]:undefined);
}
function localReply(message){
 const t=message.toLowerCase();
 if(/\b(kaise ho|kya haal|kese ho)\b/.test(t))return "Main mast hoon! Bas apni poonch sambhaal raha hoon. 🐾 Tum batao, kaisa chal raha hai sab?";
 if(/\b(suraj ke bare|suraj ke baare|suraj ko jaante|suraj kaun)\b/.test(t))return "Haan, Suraj ko jaanta hoon! Usko marketing, AI aur naye experiments banana bahut pasand hai. Uski journey ke baare mein kya jaanna hai?";
 if(/\b(dost hoon|dost hun|suraj ka dost|mera dost suraj)\b/.test(t)&&state.role!=="friend"){setRole("friend");return null;}
 if(/\b(kya kar rahe|kya karte|tum kya|batao pico)\b/.test(t))return "Main? Yahin baitha hoon, visitors se dosti kar raha hoon. 🐾 Tum kya kar rahe ho?";

 if(/^(hi|hello|hey|yo|namaste|sup|good morning|good evening)\b/.test(t))return pick(["Hi, human! 🐾 What's something good about your day?","Hey hey! Pico here. Need a friend for a few minutes?","Hello. I was just pretending to be busy. How's life?"]);
 if(/\b(friend|classmate|school friend|college friend|know suraj)\b/.test(t)&&state.role!=="friend"){setRole("friend");return null;}
 if(/\b(recruiter|recruiting|hiring|job|vacancy|open role)\b/.test(t)&&state.role!=="recruiter"){setRole("recruiter");return null;}
 if(/\b(founder|startup|starting a business|launching a business|company owner)\b/.test(t)&&state.role!=="founder"){setRole("founder");return null;}
 if(/\b(message|contact|send.*suraj|leave.*note|tell suraj|share.*opportunity)\b/.test(t)){showView("contact");return "A note? I can help! You decide what to share, and I'll be clear about the delivery step.";}
 if(/\b(secret|easter egg|hidden|surprise)\b/.test(t))return pick([about.website,"A tiny Pico secret: I love meeting visitors more than giving website tours. I wasn't hired for tour-guide duty anyway. 🐾",about.motto]);
 if(/\b(education|college|mba|pgdm|isb|student)\b/.test(t))return about.school;
 if(/\b(lazy plex|lazyplex|agency|consultancy)\b/.test(t))return about.lazy;
 if(/\b(seo|ads|marketing|analytics|campaign|client|growth)\b/.test(t))return about.work+" Is this something you're working on?";
 if(/\b(ai|automation|crm|lead scraper|saas|software|project|experiment|tool)\b/.test(t))return about.products+" Which one sounds interesting?";
 if(/\b(gaming|game|hobby|free time|interest)\b/.test(t))return about.hobby;
 if(/\b(website|github|hosting|domain)\b/.test(t))return about.website;
 if(/\b(about suraj|who is suraj|his journey|story of suraj|tell me about suraj)\b/.test(t))return about.story+" "+about.motto;
 if(/\b(are you ai|are you real|who are you|what can you do|bot)\b/.test(t))return "I'm Pico, an animated red panda with conversational software behind my fluffy ears. Not a real animal, and not Suraj himself. I can chat, share approved stories and help you leave a message.";
 if(/\b(sad|lonely|stressed|bad day|tired)\b/.test(t))return "Aw, I wish I could offer a real little paw-sized hug. Want to talk about it, or should I tell you a silly joke?";
 if(/\b(happy|amazing|excited|great day)\b/.test(t))return "Ooooh! Happy human detected. ✨ Tell me the good news—my tail is already celebrating.";
 if(/\b(joke|funny|make me laugh)\b/.test(t))return "Why does a red panda never miss a software deadline? ...Because he paws-es time. Okay, that was terrible. I still like it. 🐾";
 if(/\b(voice|music|sound|speak|talk aloud|sing)\b/.test(t))return "I can read replies aloud and make tiny original sounds—only when you switch them on. Open my little settings gear. 🎵";
 if(/\b(bye|goodbye|later)\b/.test(t))return "Bye, friend! This corner will be here whenever you return. 🐾";
 if(/\b(thanks|thank you|shukriya)\b/.test(t))return pick(["Anytime! Being a good companion is my favourite job.","You're welcome. Want to stay a little longer? 🐾"]);
 if(state.role&&modes[state.role])return pick(modes[state.role].follow);
 return pick(["I'm listening. What happened next? 🐾","Interesting! Tell me a little more about that.","You seem like a curious person. What's something you've always wanted to try?","Hmm. Do you want advice, a story, or just someone to listen?"]);
}
async function remoteReply(message){
 if(!API)return null;
 const ctrl=new AbortController(),timeout=setTimeout(()=>ctrl.abort(),9500);
 try{
  const response=await fetch(API+"/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message,role:state.role||"visitor",page:where(),history:state.history.slice(-10)}),signal:ctrl.signal,credentials:"omit"});
  if(!response.ok)return null;
  const data=await response.json();return typeof data.reply==="string"?cap(data.reply,900):null;
 }catch{return null;}finally{clearTimeout(timeout);}
}
async function sendText(value){
 const text=cap(value,700);if(!text||state.busy)return;
 state.busy=true;appendMessage("visitor",text,true);state.interactions++;input.value="";$("pico-send").disabled=true;mood("pico-curious",700);
 const locally=localReply(text);
 if(locally===null||state.view!=="chat"){state.busy=false;$("pico-send").disabled=false;return;}
 const reply=await remoteReply(text)||locally;
 if(state.open&&state.view==="chat"){appendMessage("pico",reply);choices();}
 state.busy=false;$("pico-send").disabled=false;
}
function showView(view){
 state.view=view;
 $("pico-chat-view").hidden=view!=="chat";$("pico-chat-view").style.display=view==="chat"?"flex":"none";
 $("pico-contact-view").hidden=view!=="contact";$("pico-settings-view").hidden=view!=="settings";$("pico-controls").hidden=view!=="chat";
 if(view==="chat")input.focus({preventScroll:true});
 if(view==="settings")refreshSettings();
 if(view==="contact"){
  $("pico-delivery-description").textContent=API?"If the private service is connected, your note can be saved securely. Pico will confirm the result.":"The private inbox isn't connected yet. I can open your message in WhatsApp for you to send; I cannot store it automatically.";
  $("pico-contact-view").querySelector('[name="message"]').focus();
 }
}
function openPanel(next){
 state.open=next;panel.hidden=!next;root.classList.toggle("pico-is-open",next);spriteButton.setAttribute("aria-expanded",String(next));nudge.hidden=true;
 if(next){root.classList.remove("pico-sleeping");showView("chat");}
 else{window.window.speechSynthesis?.cancel();if(state.voiceRecording)try{state.voiceRecording.stop();}catch{}}
}
function showNudge(text){
 if(prefs.quiet||state.open||state.nudges>=2||Date.now()-state.lastNudge<85000)return;
 state.nudges++;state.lastNudge=Date.now();persist();
 $("pico-nudge-text").textContent=text;nudge.hidden=false;
 clearTimeout(nudgeHandle);nudgeHandle=setTimeout(()=>nudge.hidden=true,7200);
}
function sectionChange(next){
 if(state.section===next)return;
 state.section=next;
 if(state.open&&state.interactions&&Date.now()-state.lastNudge>130000){state.lastNudge=Date.now();appendMessage("pico",sections[next],true);}
 else if(!state.open)showNudge(sections[next]);
}
function observePages(){
 window.addEventListener("hashchange",()=>sectionChange(where()));
 window.addEventListener("popstate",()=>sectionChange(where()));
 if(!("IntersectionObserver" in window))return;
 const nodes=document.querySelectorAll("main section[id]");let previous="";
 const io=new IntersectionObserver(entries=>{
  const e=entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(!e||e.target.id===previous)return;
  previous=e.target.id;
  const valid=["about","work","projects","lab","writing","contact"];
  if(valid.includes(previous))sectionChange(previous);
 },{threshold:.3,rootMargin:"-15% 0px -35% 0px"});
 nodes.forEach(node=>io.observe(node));
}
function speak(message){
 if(!prefs.voice||!voiceCapable)return;
 try{speechSynthesis.cancel();const voice=new SpeechSynthesisUtterance(message.replace(/[\u{1F300}-\u{1FAFF}]/gu,""));voice.pitch=1.25;voice.rate=1.05;voice.volume=.75;
 const voices=speechSynthesis.getVoices(),match=voices.find(v=>v.lang==="en-IN")||voices.find(v=>/^en/i.test(v.lang));if(match)voice.voice=match;
 voice.onend=()=>root.classList.remove("pico-speaking");
 speechSynthesis.speak(voice);}catch{}
}
function audioContext(){
 const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;
 try{if(!audio)audio=new C();if(audio.state==="suspended")audio.resume().catch(()=>{});return audio;}catch{return null;}
}
function playTone(freq,duration=.15,volume=.012){
 const ctx=audioContext();if(!ctx)return;
 const osc=ctx.createOscillator(),gain=ctx.createGain(),at=ctx.currentTime;
 osc.type="sine";osc.frequency.setValueAtTime(freq,at);gain.gain.setValueAtTime(.0001,at);
 gain.gain.exponentialRampToValueAtTime(volume,at+.025);gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
 osc.connect(gain).connect(ctx.destination);osc.start(at);osc.stop(at+duration+.03);
}
const song=[220,329.63,392,293.66,246.94,329.63,440,392,196,293.66,369.99,293.66,220,261.63,329.63,246.94];
function music(){
 clearInterval(musicHandle);musicHandle=0;
 if(prefs.music){audioContext();musicHandle=setInterval(()=>{if(document.hidden)return;const f=song[(musicStep++)%song.length];playTone(f,.45,.008);if(musicStep%4===0)playTone(f/2,.68,.004);},850);}
}
function refreshSettings(){
 for(const k of ["voice","music","fx","follow","quiet"])$("pico-"+k+"-setting").checked=prefs[k];
 $("pico-voice-toggle").textContent=prefs.voice?"🔊 Voice on":"🔇 Voice off";
 $("pico-voice-toggle").setAttribute("aria-pressed",String(prefs.voice));
}
function setPref(key,value){
 prefs[key]=Boolean(value);store.write("hs.pico.prefs",JSON.stringify(prefs),true);refreshSettings();
 if(key==="voice"&&!value)window.speechSynthesis?.cancel();
 if(key==="music")music();
 if(key==="fx"&&value)playTone(520,.14,.02);
 if(key==="follow"&&!value){spriteButton.style.setProperty("--pico-dx","0px");spriteButton.style.setProperty("--pico-dy","0px");}
 if(key==="quiet")nudge.hidden=true;
}
async function sendNote(event){
 event.preventDefault();
 const form=event.currentTarget,fields=new FormData(form),status=$("pico-contact-status");
 const payload={
  name:cap(fields.get("name"),80),contact:cap(fields.get("contact"),120),message:cap(fields.get("message"),1600),
  role:state.role||"visitor",page:location.pathname,consent:fields.get("consent")==="on",website:cap(fields.get("website"),120)
 };
 if(!payload.consent||payload.message.length<3){status.textContent="Please add your message and choose whether to share it.";return;}
 if(payload.website){status.textContent="Unable to process the form.";return;}
 const button=$("pico-contact-submit");button.disabled=true;
 if(API){
  status.textContent="Trying to save your note securely...";
  const ctrl=new AbortController(),timeout=setTimeout(()=>ctrl.abort(),10000);
  try{
   const res=await fetch(API+"/api/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload),signal:ctrl.signal,credentials:"omit"});
   const data=await res.json().catch(()=>({}));
   if(res.ok&&data.saved){form.reset();button.disabled=false;button.textContent="Continue";
    appendMessage("pico",data.emailed?"Your note was saved and an email notification was requested. 💌":"Your note was saved for Suraj. Email delivery wasn't confirmed.");
    showView("chat");return;
   }
  }catch{}finally{clearTimeout(timeout)}
 }
 // Explicit WhatsApp handoff: this does NOT persist or automatically send a message.
 const text=["Hey Suraj! 🐾 A visitor met Pico on heysuraj.com.",payload.name?"Name: "+payload.name:null,
 "Visitor type: "+payload.role,payload.contact?"Reply contact: "+payload.contact:null,"Message: "+payload.message].filter(Boolean).join("\n");
 const href="https://wa.me/"+PRIV+"?text="+encodeURIComponent(text);
 status.textContent="Pico can't store this automatically yet. WhatsApp is ready with your draft. You'll need to press Send there.";
 const existing=form.querySelector(".pico-wa-link");existing?.remove();
 const a=document.createElement("a");a.className="pico-wa-link";a.href=href;a.target="_blank";a.rel="noopener noreferrer";
 a.textContent="Open my WhatsApp draft ↗";a.style.cssText="display:block;color:var(--pc-accent);font-weight:700;margin:10px 0;font-size:13px";
 status.after(a);button.disabled=false;button.textContent="Continue via WhatsApp ↗";
 // The separate new-tab action never silently sends anything.
 a.click();
}
function pointerFollow(event){
 if(event.pointerType==="touch"||matchMedia("(prefers-reduced-motion: reduce)").matches||document.documentElement.dataset.motion==="off")return;
 const rect=spriteButton.getBoundingClientRect(),x=rect.left+rect.width/2,y=rect.top+rect.height/2;
 const vx=Math.max(-1,Math.min(1,(event.clientX-x)/330)),vy=Math.max(-1,Math.min(1,(event.clientY-y)/270));
 sprite.style.setProperty("--pico-eye-x",vx*3+"px");sprite.style.setProperty("--pico-eye-y",vy*2+"px");sprite.style.setProperty("--pico-tilt",vx*5+"deg");
 if(prefs.follow&&matchMedia("(pointer:fine)").matches&&!state.open){
  const targetX=Math.max(12,Math.min(innerWidth-120,event.clientX-54)),targetY=Math.max(12,Math.min(innerHeight-130,event.clientY-60));
  spriteButton.style.setProperty("--pico-dx",(targetX-(innerWidth-124))+"px");
  spriteButton.style.setProperty("--pico-dy",(targetY-(innerHeight-134))+"px");
 }else if(!prefs.follow){
  const close=Math.hypot(event.clientX-x,event.clientY-y)<240;
  spriteButton.style.setProperty("--pico-dx",close?-vx*11+"px":"0px");
  spriteButton.style.setProperty("--pico-dy",close?-vy*4+"px":"0px");
 }
}
let frame=0;
document.addEventListener("pointermove",event=>{if(frame)return;const x=event.clientX,y=event.clientY,type=event.pointerType;frame=requestAnimationFrame(()=>{frame=0;pointerFollow({clientX:x,clientY:y,pointerType:type});});},{passive:true});
spriteButton.addEventListener("pointerenter",()=>{state.petCount++;mood("pico-petting",700);if(prefs.fx&&state.petCount%2===0)playTone(590,.1,.018);if(state.petCount===5)showNudge("Secret unlocked: I've decided you're my friend. 🐾");});
spriteButton.addEventListener("click",()=>{openPanel(!state.open);if(prefs.fx)playTone(490,.1,.015);});
spriteButton.addEventListener("dblclick",()=>{mood("pico-celebrate",950);if(prefs.fx)playTone(720,.16,.018);});
$("pico-close").addEventListener("click",()=>openPanel(false));
$("pico-nudge-dismiss").addEventListener("click",()=>{nudge.hidden=true;});
$("pico-settings-button").addEventListener("click",()=>showView("settings"));
$("pico-settings-back").addEventListener("click",()=>showView("chat"));
$("pico-leave-note").addEventListener("click",()=>showView("contact"));
$("pico-contact-back").addEventListener("click",()=>showView("chat"));
$("pico-story").addEventListener("click",()=>sendText("Tell me a little story about Suraj"));
$("pico-voice-toggle").addEventListener("click",()=>setPref("voice",!prefs.voice));
$("pico-clear-chat").addEventListener("click",()=>{
 state.history=[];state.role=null;store.del("hs.pico.session");chat.replaceChildren();
 appendMessage("pico","Fresh start. 🐾 I'm still Pico, still here to chat. What's on your mind?",true);choices();
});
$("pico-compose-form").addEventListener("submit",e=>{e.preventDefault();sendText(input.value);});
input.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendText(input.value);}});
$("pico-contact-view").addEventListener("submit",sendNote);
for(const k of ["voice","music","fx","follow","quiet"])$("pico-"+k+"-setting").addEventListener("change",e=>setPref(k,e.target.checked));
$("pico-mic").addEventListener("click",()=>{
 const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!Recognition){appendMessage("pico","My ears can't use voice input in this browser. You can type instead. 🐾",true);return;}
 if(state.voiceRecording){try{state.voiceRecording.stop();}catch{}return;}
 try{
  const rec=new Recognition();state.voiceRecording=rec;rec.lang=(navigator.language||"").startsWith("hi")?"hi-IN":"en-IN";rec.interimResults=false;rec.maxAlternatives=1;
  $("pico-mic").setAttribute("aria-pressed","true");
  rec.onresult=e=>{const heard=e.results&&e.results[0]&&e.results[0][0]&&e.results[0][0].transcript;if(heard){input.value=heard;sendText(heard);}};
  rec.onerror=()=>{appendMessage("pico","My ears missed that. You can always type instead.",true);};
  rec.onend=()=>{state.voiceRecording=null;$("pico-mic").setAttribute("aria-pressed","false");};
  rec.start();
 }catch{state.voiceRecording=null;$("pico-mic").setAttribute("aria-pressed","false");}
});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&state.open){if(state.view!=="chat")showView("chat");else openPanel(false);}});
document.addEventListener("visibilitychange",()=>{if(document.hidden){window.speechSynthesis?.cancel();}else if(!state.open)root.classList.add("pico-sleeping");});
fetch("/assets/pico-red-panda.svg?v=2").then(r=>r.ok?r.text():null).then(svg=>{if(svg&&svg.startsWith("<svg"))sprite.innerHTML=svg;}).catch(()=>{});
if(previous&&previous.history.length){
 for(const entry of state.history){const box=document.createElement("div");box.className="pico-turn";box.dataset.who=entry.who==="visitor"?"visitor":"pico";
 const label=document.createElement("small");label.textContent=entry.who==="visitor"?"You":"Pico";const bubble=document.createElement("div");bubble.className="pico-message";bubble.textContent=cap(entry.text);box.append(label,bubble);chat.append(box);}
}else appendMessage("pico","Psst, hello! I'm Pico, Suraj's little red-panda pal. 🐾 I'm not a tour guide. I just like spending time with visitors. Want to hang out?",true);
choices();refreshSettings();observePages();
$("pico-mode").textContent=API?"AI replies are processed by the connected API. Notes require your consent.":"Pico's chat stays in this tab. Notes can be sent using WhatsApp.";
setTimeout(()=>{if(!state.open&&!prefs.quiet)showNudge(pick(["Hey, human! Need a tiny friend for a few minutes? 🐾","Psst. I'm Pico. No tours, just good company!"]));},12500);
setTimeout(()=>{if(!state.open&&!prefs.follow)root.classList.add("pico-sleeping");},54000);
setInterval(()=>{
 if(document.hidden||state.open||prefs.quiet||state.busy||!matchMedia("(prefers-reduced-motion: no-preference)").matches||document.documentElement.dataset.motion==="off")return;
 mood(pick(["pico-yawn","pico-wiggle","pico-stretch","pico-scratch","pico-walk","pico-peek","pico-curious"]),1250);
},29000);
})();