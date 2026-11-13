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
const state={role:previous&&previous.role||null,history:previous&&previous.history.slice(-18)||[],nudges:previous&&previous.nudges||0,lastNudge:previous&&previous.lastNudge||0,petCount:0,open:false,view:"chat",busy:false,interactions:0,section:"home",voiceRecording:null,voiceMode:false,speaking:false,voiceFailures:0};
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
 friend:{intro:["Oho, an insider! 😂 Did you come with gossip or snacks?","A friend! Finally, someone who might know where my missing biscuits went. How do you know Suraj?"],follow:["Okay, enough about my human. How has YOUR day been?","What is the most ridiculous thing that happened to you recently? I promise to laugh respectfully. Mostly.","You can leave a surprise note if you want. Otherwise, let’s gossip about life."]},
 recruiter:{intro:["A recruiter? One second, putting on my tiny invisible tie. How’s the hiring universe treating you?","Recruiter spotted! 📋 I can be professional. For at least twelve seconds. What brings you here?"],follow:["Tell me, what’s the toughest part of finding good people?","Got a role in mind, or are you here for a much-needed snack break?","Want help leaving the details? No rush; I’m not sending you a calendar invite."]},
 founder:{intro:["Founder! So you also say ‘just one small change’ and accidentally work until midnight? 😂","Building a business? Brave. I once tried running a biscuit startup. Ate the inventory. What are you making?"],follow:["What’s your latest big idea? I promise not to pitch a subscription for it.","Tell me your weirdest startup problem. I’m excellent at listening and questionable at accounting.","Want to brainstorm, or should we just complain about meetings for a minute?"]},
 visitor:{intro:["No agenda? Fantastic. This is officially a meeting-free zone. 🐾","Just hanging out? Perfect. I was about to start a very important nap. Want to talk instead?"],follow:["How’s life? You can tell me the fun stuff or the messy stuff.","Important question: are we chatting, ranting, or inventing a terrible business idea?","You can vent here. My only qualification is extremely large ears."]}
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
 const values=custom||(state.role?[["Roast me (gently)","roast"],["Surprise me","surprise"],["Leave a message","note"]]:[["I'm a friend","friend"],["I'm a recruiter","recruiter"],["I run a business","founder"],["Just hanging out","visitor"]]);
 const div=document.createElement("div");div.className="pico-chips";div.id="pico-choices";
 for(const [label,cmd] of values){
  const button=document.createElement("button");button.className="pico-chip";button.type="button";button.textContent=label;
  button.addEventListener("click",()=>{if(cmd==="note"){showView("contact");return}if(modes[cmd]){appendMessage("visitor",label,true);setRole(cmd);return}sendText(cmd==="roast"?"Roast me gently":cmd==="surprise"?"Surprise me with something funny":cmd==="secret"?"Tell me a secret about Suraj":cmd==="about"?"Tell me about Suraj":label);});
  div.append(button);
 }
 chat.append(div);chat.scrollTop=chat.scrollHeight;
}
function setRole(role){
 state.role=role;persist();appendMessage("pico",pick(modes[role].intro));choices(role==="friend"?[["From college","college"],["From work","work friend"],["Send a surprise","note"]]:role==="founder"?[["Launching something","launch"],["Marketing challenge","marketing"],["Contact Suraj","note"]]:role==="recruiter"?[["Marketing role","marketing"],["AI role","ai"],["Share opportunity","note"]]:undefined);
}
function localReply(message){
 const t=message.toLowerCase();
 if(/\b(dost hoon|dost hun|suraj ka dost|mera dost suraj)\b/.test(t)&&state.role!=="friend"){setRole("friend");return null;}
 if(/\b(friend|classmate|school friend|college friend|know suraj)\b/.test(t)&&state.role!=="friend"){setRole("friend");return null;}
 if(/\b(recruiter|recruiting|hiring|job|vacancy|open role)\b/.test(t)&&state.role!=="recruiter"){setRole("recruiter");return null;}
 if(/\b(founder|startup|starting a business|launching a business|company owner)\b/.test(t)&&state.role!=="founder"){setRole("founder");return null;}
 if(/\b(message|contact|send.*suraj|leave.*note|tell suraj|share.*opportunity)\b/.test(t)){
  showView("contact");return "Ooh, post office duty! 💌 I'll help you write it. Nothing sends without your say-so.";
 }
 if(/\b(sad|lonely|stressed|bad day|anxious|feeling down)\b/.test(t)){
  return pick(["Oof, that sounds like a lot. Want to tell me what happened? I can just listen. 🐾",
   "I can't fix the entire universe with tiny paws, but I can listen. What's bothering you?"]);
 }
 if(/\b(roast me|roast my|make fun of me|roast please)\b/.test(t))
  return pick(["You came here to get roasted by a cartoon red panda. I think your browser already won. 😂",
   "Your productivity app has a productivity app. And somehow you're still here chatting with a tiny panda.",
   "I'd roast you harder, but I'm five inches tall. My lawyers are two biscuits and a leaf."]);
 if(/\b(roast suraj|make fun of suraj)\b/.test(t))
  return pick(["He builds tools to save time, then spends all the saved time building more tools. Genius or side quest? Yes. 😂",
   "Suraj once gave his website more themes than my wardrobe has leaves. And I don't even wear clothes."]);
 if(/\b(roast|sarcasm|sarcastic)\b/.test(t))
  return "Sarcasm? My favourite free service. Unlike certain apps, I won't ask for your card number. 😌";
 if(/\b(joke|funny|make me laugh|surprise me|something funny)\b/.test(t))
  return pick(["I tried being an influencer. My first post got three likes. Two were from me. 🐾",
   "My to-do list says 'eat, nap, repeat'. HR says I need more ambition. HR is a squirrel.",
   "Why do developers hate nature? Too many bugs. Sorry. I'm legally required to make one bad joke.",
   "I applied for a job as a search engine. They said I had too many tabs open. Honestly, fair."]);
 if(/\b(kaise ho|kya haal|kese ho|how are you|how's it going)\b/.test(t))
  return pick(["Main mast! Bas duniya ke saare biscuits ka audit kar raha hoon. Tum batao? 🐾",
   "Alive, fluffy, and underqualified for taxes. Tumhara din kaisa gaya?"]);
 if(/^(hi|hello|hey|yo|namaste|sup|good morning|good evening)\b/.test(t))
  return pick(["Arre hello! I was in the middle of an important nap. Kya scene hai? 🐾",
   "Well well well. A human! Please tell me you brought gossip or snacks.",
   "Hi! No sales pitch, promise. What's going on?"]);
 if(/\b(bye|goodbye|later|good night)\b/.test(t))return "Okay, go be legendary. I’ll be here judging the furniture. Bye! 🐾";
 if(/\b(thanks|thank you|shukriya)\b/.test(t))return pick(["Anytime. Payment accepted in compliments and biscuits. 🐾","Shukriya accepted. My ego has grown three sizes."]);
 if(/\b(are you ai|are you real|who are you|what can you do|bot)\b/.test(t))
  return "I'm Pico, a cartoon red panda with opinions, zero rent and some actual software. Let's chat—what's on your mind?";
 if(/\b(secret|easter egg|hidden)\b/.test(t))
  return pick(["Pssst. My greatest secret? I sometimes pretend the mouse cursor is a butterfly. Don't tell anyone.",
   "I once stole a snack from my own emergency snack drawer. It was an inside job.",
   about.website]);
 if(/\b(voice|microphone|mic|sound|speak|talk aloud|music)\b/.test(t))
  return "Tap my little mic and we can talk out loud. Tap it again to return to typing. I'll do my best squeaky-panda impression. 🎙";
 if(/\b(tell me a story about suraj|about suraj|who is suraj|suraj ke bare|suraj ke baare|suraj kaun)\b/.test(t))return about.story;
 if(/\b(college|mba|pgdm|education|isb)\b/.test(t))return about.school;
 if(/\b(lazy plex|lazyplex|consultancy|agency)\b/.test(t))return about.lazy;
 if(/\b(seo|ads|marketing|analytics|campaign|growth)\b/.test(t))return about.work+" Got a challenge in that area?";
 if(/\b(ai|automation|crm|lead scraper|saas|software|experiment|tool)\b/.test(t))return about.products;
 if(/\b(gaming|game|hobby|free time)\b/.test(t))return about.hobby;
 if(/\b(website|github|hosting|domain)\b/.test(t))return about.website;
 if(/\b(what are you doing|what's up|bored|bore ho raha|kya kar rahe)\b/.test(t))
  return pick(["Trying to look busy. Difficult when your entire career is sitting in a corner. 😂",
   "Thinking about snacks. What are you up to?",
   "Planning a very serious heist. Target: one biscuit. Wanna join?"]);
 if(/\b(tell me a story|story time)\b/.test(t))
  return "Once upon a time, a red panda opened 42 browser tabs to find one biscuit recipe. He found an SEO audit instead. The end. Dramatic, no?";
 if(state.role&&modes[state.role])return pick(modes[state.role].follow);
 return pick([
  "Interesting. Tell me the part you left out—I have giant ears for a reason. 🐾",
  "Okay wait, that sounds like a story. What happened next?",
  "I have two questions: how did we get here, and are snacks involved?",
  "You're not boring, which is rude because I was planning a nap. Go on.",
  "Fair point. Are we solving something, venting, or just hanging out?"
 ]);
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