
"use strict";
/* HeySuraj 3060: static-first interactive website. No trackers, API keys or backend dependencies. */
const PROJECTS = [
 {id:"lazy-plex",title:"Lazy Plex",type:"Marketing",status:"Venture",icon:"✳",tagline:"A home for practical digital growth.",description:"My entrepreneurial journey through digital marketing, brand building, website work and, increasingly, strategy-led consulting.",focus:"Digital strategy · Brand growth · Web experiences",approach:"Translate business needs into meaningful digital systems instead of chasing vanity metrics.",learn:"Running a venture is an ongoing lesson in product thinking, communication and execution.",url:"https://lazyplex.com",detailUrl:"/projects/lazy-plex/"},
 {id:"lp-crm",title:"LP CRM",type:"Products",status:"Building",icon:"▣",tagline:"A simpler operating system for teams.",description:"An integrated CRM concept and implementation effort spanning projects, tasks, time logs, clients, invoices, approvals and business operations.",focus:"SaaS architecture · Workflows · Operations",approach:"Unify fragmented processes into a modular workspace with permissions and clear workflows.",learn:"The complexity is often in reliability, permissions and everyday usability, not the dashboard.",url:"",detailUrl:"/projects/lp-crm/"},
 {id:"lp-leados",title:"LP LeadOS",type:"Products",status:"Building",icon:"⌁",tagline:"Finding the right prospects, not just more names.",description:"A lead-discovery and research system intended to help businesses identify relevant potential customers by industry, location, needs and evidence.",focus:"Lead research · AI workflows · Data quality",approach:"Improve prospect fit, verification and traceability rather than optimise only for volume.",learn:"Lead quantity means little without qualification and accurate contact information.",url:"https://lp-leados.onrender.com",detailUrl:"/projects/lp-leados/"},
 {id:"seo-engine",title:"SEO Audit Engine",type:"Products",status:"In progress",icon:"↗",tagline:"From messy SEO data to useful decisions.",description:"An initiative to connect search performance, technical issues, content opportunity and prioritised recommendations into actionable SEO audits.",focus:"Search Console · Auditing · Analysis",approach:"Move beyond lists of errors and focus on the changes most likely to improve measurable outcomes.",learn:"Good reporting should tell someone what to do next.",url:"",detailUrl:"/projects/seo-audit-engine/"},
 {id:"custom-gpts",title:"177 Custom GPTs",type:"AI",status:"Explored",icon:"✦",tagline:"A long-running experiment in specialised AI.",description:"A collection of 177 custom GPT experiments documented across different tasks, workflows and problem types.",focus:"Prompt design · Tool behaviour · Use-case testing",approach:"Experiment with focused assistants for practical, repeatable jobs.",learn:"Useful AI starts with defining the job clearly, not with adding complexity.",url:""},
 {id:"chatbot-studio",title:"AI Chatbots",type:"AI",status:"Explored",icon:"◎",tagline:"Conversational interfaces built around tasks.",description:"Work exploring and creating task-specific chatbots, assistant experiences and workflows for business and content use cases.",focus:"Conversational UX · Automation · Custom assistants",approach:"Design around real user requests, context and safe hand-offs.",learn:"A helpful assistant must be useful when answers are uncertain, not only when they're easy.",url:""},
 {id:"automation-lab",title:"AI Automation Workflows",type:"AI",status:"Experimental",icon:"⟲",tagline:"Make the repetitive work disappear.",description:"Experiments combining AI tools, APIs, automation platforms and lightweight scripting to streamline research, content and operations.",focus:"APIs · Workflow design · Make.com · Python",approach:"Automate repeatable steps while keeping decisions and approvals understandable.",learn:"Reliability and clear fallback paths are part of automation design.",url:""},
 {id:"marketing-engine",title:"Marketing Engine Hub",type:"Marketing",status:"Venture idea",icon:"◇",tagline:"Measure. Automate. Convert. Grow.",description:"A strategy-led consultancy concept focused on helping businesses understand acquisition, conversion and the systems behind sustainable growth.",focus:"Growth systems · Analytics · Conversion",approach:"Bring strategy, tracking, campaigns and automation into one understandable operating model.",learn:"A good marketing system connects acquisition with real business outcomes.",url:""},
 {id:"describe-anything",title:"DescribeAnything.in",type:"AI",status:"Concept",icon:"⌘",tagline:"Turning inputs into clearer descriptions.",description:"An exploration of AI-powered description generation and useful content assistance.",focus:"AI content tools · Product exploration",approach:"Find specific jobs where structured AI assistance genuinely saves effort.",learn:"The narrowest useful workflow can become the strongest product.",url:""},
 {id:"omnihuman",title:"OmniHuman1.in",type:"AI",status:"Exploration",icon:"◈",tagline:"Curiosity about digital humans.",description:"A research and project exploration involving AI avatars, human-like media and new creative interfaces.",focus:"Creative AI · Digital avatars · Emerging media",approach:"Understand what generative interfaces can and cannot do reliably.",learn:"Impressive visuals only matter when the experience serves a purpose.",url:""},
 {id:"my-trend-wear",title:"My Trend Wear",type:"Creative",status:"Venture idea",icon:"≋",tagline:"Testing fashion, identity and digital commerce.",description:"An exploration of online apparel, trend-led merchandising and e-commerce branding.",focus:"E-commerce · Brand concept · Digital sales",approach:"Explore how product, brand and attention combine in online retail.",learn:"Distribution and product-market fit matter as much as design.",url:""},
 {id:"the-emotional-ceo",title:"The Emotional CEO",type:"Creative",status:"Writing project",icon:"❞",tagline:"Leadership without losing the human side.",description:"A book and writing exploration around leadership, psychology, emotional intelligence and the idea of scaling without burnout.",focus:"Leadership · Writing · Human behaviour",approach:"Turn observations about leadership into thoughtful, useful writing.",learn:"Better systems should make room for the humans inside them.",url:""},
 {id:"creator-journey",title:"Gaming & YouTube",type:"Creative",status:"Creative work",icon:"▷",tagline:"Creativity is another form of experimentation.",description:"My content-creation explorations around games, entertainment, short-form formats and creator workflows.",focus:"Video · Gaming · Storytelling",approach:"Learn by publishing, iterating and understanding attention.",learn:"A creator mindset translates surprisingly well to building products.",url:""},
 {id:"winbuzzgame",title:"WinBuzzGame.in",type:"Creative",status:"Historical",icon:"⌑",tagline:"An early affiliate-platform experiment.",description:"A historical exploration of content-driven affiliate website models and online distribution.",focus:"Affiliate models · Website experimentation",approach:"Understand discovery and distribution through hands-on experiments.",learn:"Some ventures are most valuable for the lessons they leave behind.",url:""},
 {id:"seo-growth",title:"SEO & Organic Growth",type:"Marketing",status:"Professional work",icon:"⌕",tagline:"Find what searchers need, then make it useful.",description:"Hands-on work across website audits, on-page improvements, local visibility, Search Console analysis and content strategy.",focus:"SEO · Local search · Search Console",approach:"Use evidence from queries, behaviour and business priorities to decide what to improve.",learn:"Traffic is a signal; qualified enquiries and outcomes are the real test.",url:""},
 {id:"paid-growth",title:"Performance Marketing",type:"Marketing",status:"Professional work",icon:"↗",tagline:"Creative ideas, measurable decisions.",description:"Planning, analysis and optimisation work spanning Google Ads, Meta Ads, campaigns, lead generation and conversion journeys.",focus:"Paid media · Landing pages · Measurement",approach:"Connect campaign strategy to lead quality and the experience after the click.",learn:"A low cost per lead is not automatically a good campaign.",url:""},
 {id:"analytics",title:"Marketing Analytics",type:"Marketing",status:"Professional work",icon:"▥",tagline:"Numbers are useful when they change decisions.",description:"Measurement and reporting using GA4, Search Console, business listings and performance dashboards.",focus:"GA4 · GSC · Business intelligence",approach:"Turn reporting into prioritised recommendations and better communication.",learn:"Good dashboards answer questions instead of generating more of them.",url:""},
 {id:"web-experiences",title:"Web & Conversion",type:"Marketing",status:"Professional work",icon:"▤",tagline:"Useful experiences convert attention into action.",description:"Website creation, WordPress and Elementor work, landing pages, conversion improvements and digital user journeys.",focus:"WordPress · Elementor · CRO",approach:"Improve clarity, speed and the moments where visitors decide what to do.",learn:"The best design looks obvious once the hard decisions are made.",url:""},
 {id:"paperclip-team",title:"AI Workforce / Paperclip",type:"AI",status:"Experiment",icon:"♟",tagline:"Exploring how specialist agents collaborate.",description:"An experiment in planning an AI-assisted team, defining roles and linking independent workflows through an agent-management environment.",focus:"AI agents · Delegation · Workflow orchestration",approach:"Treat agents as tools that require explicit tasks, boundaries, review and accountability.",learn:"More agents do not automatically mean a better system; coordination is the hard part.",url:""},
 {id:"seo-education",title:"Marketing & SEO Teaching",type:"Marketing",status:"Education initiative",icon:"✎",tagline:"Turning practice into lessons people can apply.",description:"A learning and training initiative around practical SEO, digital marketing, social media and business-facing digital skills.",focus:"Training design · SEO · Digital marketing",approach:"Organise real workflows into teachable lessons, examples and useful practice.",learn:"Teaching exposes the difference between knowing a term and understanding a process.",url:""},
 {id:"creative-universe",title:"AI Creative Universe",type:"Creative",status:"Concept",icon:"✺",tagline:"Stories, humour and generative creativity.",description:"A creative exploration of AI-assisted entertainment, short-form video formats, comedy concepts and character-led storytelling.",focus:"Generative media · Storytelling · Creator tools",approach:"Experiment with narrative, format and human-directed creative AI.",learn:"Good storytelling still depends on taste, timing and a human point of view.",url:""},
 {id:"heysuraj",title:"HeySuraj.com",type:"Creative",status:"Live website",icon:"⌘",tagline:"My personal digital headquarters.",description:"A static-hosted personal brand experience with evolving long-form work, motion and colour themes, project documentation and SEO foundations.",focus:"Personal branding · Web engineering · GitHub Pages",approach:"Keep an interactive visual identity while making content readable, crawlable and easy to maintain.",learn:"Technical simplicity can give creative ideas more room to grow.",url:"https://heysuraj.com",detailUrl:"/projects/heysuraj-website/"}
];
const LAB = [
 {id:"l1",title:"AI assistants that solve real tasks",phase:"Exploring",focus:"Usability over spectacle",hypothesis:"A specialist assistant designed around one clear workflow can outperform a generic chat experience for that task.",method:"Define a job, design inputs and outputs, test edge cases, document failures, then iterate.",lesson:"Useful assistants need clear boundaries and feedback loops."},
 {id:"l2",title:"Lead discovery with evidence",phase:"Building",focus:"Quality over quantity",hypothesis:"Targeted qualification and verifiable signals will make lead research more useful than indiscriminate scraping.",method:"Test industry and location filters, score fit, record sources and review contact accuracy.",lesson:"A good prospect list should be explainable, not just long."},
 {id:"l3",title:"Marketing insight engine",phase:"In progress",focus:"Data to decisions",hypothesis:"Combining query-level search data and business goals can produce better SEO priorities.",method:"Compare opportunity clusters, technical constraints, page performance and likely business value.",lesson:"A useful audit should end in a prioritised action plan."},
 {id:"l4",title:"Automating the boring bits",phase:"Exploring",focus:"Systems thinking",hypothesis:"Small, resilient automations can free more working time than overly complex autonomous systems.",method:"Map repetitive tasks, add human checkpoints and test reliability before scaling.",lesson:"An automation is successful when people can understand and trust it."},
 {id:"l5",title:"Building a mini SaaS",phase:"Building",focus:"Product craftsmanship",hypothesis:"Modular, task-centred software reduces the friction of daily team operations.",method:"Develop one workflow at a time, test access rules and observe usability.",lesson:"Production readiness includes security, data integrity and support."},
 {id:"l6",title:"The creative AI frontier",phase:"Research",focus:"New interfaces",hypothesis:"Generative media will enable compelling experiences when paired with story and clarity.",method:"Prototype avatar, content and interaction experiments; compare quality, costs and controls.",lesson:"Novelty needs intention to become memorable."}
];
const WRITING = [
 {id:"w1",category:"Marketing",title:"Digital marketing is not just about getting traffic",description:"Why commercial outcomes, intent and conversion matter more than surface-level growth.",prompt:"The most useful marketing question isn't just how many people arrived. It's what they needed and what happened next."},
 {id:"w2",category:"Marketing",title:"Why more traffic doesn't always mean more revenue",description:"A practical look at lead quality, customer journeys and measurement.",prompt:"A dashboard can celebrate traffic while a business struggles to find customers. That gap deserves attention."},
 {id:"w3",category:"AI",title:"What building 177 custom GPTs taught me",description:"A personal reflection on task design, experimentation and useful AI.",prompt:"The hard part isn't making an assistant answer. It's making it understand the job well enough to help."},
 {id:"w4",category:"AI",title:"AI tools versus AI products",description:"Where experimentation ends and dependable product design begins.",prompt:"A working demo is the start of a product, not proof that the product is finished."},
 {id:"w5",category:"Business",title:"Building a digital business with limited resources",description:"Thoughts on focus, distribution and the trade-offs of building small.",prompt:"Constraints can be useful. They force you to ask which parts of an idea are actually necessary."},
 {id:"w6",category:"Business",title:"What failed experiments teach you about business",description:"Learning from ideas that didn't become lasting ventures.",prompt:"An experiment that disproves your idea can save more time than one that flatters it."},
 {id:"w7",category:"Psychology",title:"Why people trust some brands more than others",description:"A look at social proof, clarity, perceived risk and consistency.",prompt:"Trust isn't a slogan. It's the combined effect of many small interactions."},
 {id:"w8",category:"Psychology",title:"How attention becomes a business asset",description:"Consumer behaviour, brand memory and meaningful engagement.",prompt:"Attention is easy to count but difficult to earn repeatedly."},
 {id:"w9",category:"Personal",title:"My journey from marketing to AI and automation",description:"A developing story of curiosity, work, experiments and new directions.",prompt:"I never wanted to learn technology just to collect tools. I wanted to build things I could use."}
];
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const escapeHTML = v => String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt = v => escapeHTML(v);
const byId = id => document.getElementById(id);
const safeExternal = u => /^https:\/\/[a-z0-9.-]+(?:\/|$)/i.test(u || "");
let currentCategory="All",currentQuery="",currentLab=LAB[0].id;
let lastFocused=null,selectedCommand=0,commandItems=[];
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const savedMotion = (()=>{try{return localStorage.getItem("hs-motion")}catch{return null}})();
const savedTheme = (()=>{try{return localStorage.getItem("hs-theme")}catch{return null}})();
if(savedTheme==="light"||savedTheme==="dark")document.documentElement.dataset.theme=savedTheme;
if(savedMotion==="off")document.documentElement.dataset.motion="off";
const motionEnabled = () => !reduced.matches && document.documentElement.dataset.motion!=="off";
function toast(text){
 const el=byId("toast");el.textContent=text;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2700);
}
function setTheme(){window.openExperiencePanel?.("theme")}
function setMotion(){window.openExperiencePanel?.("motion")}
function renderProjects(){
 const grid=byId("projects-grid");
 const items=PROJECTS.filter(p=>(currentCategory==="All"||p.type===currentCategory)&&[p.title,p.type,p.tagline,p.description,p.focus,p.status].join(" ").toLowerCase().includes(currentQuery));
 grid.innerHTML=items.map((p,i)=>'<button class="project-card" type="button" data-project="'+fmt(p.id)+'" aria-label="Learn about '+fmt(p.title)+'"><div class="project-top"><span class="project-code">'+fmt(p.icon)+' &nbsp; / PROJECT '+String(i+1).padStart(2,"0")+'</span><span class="project-badge">'+fmt(p.status)+'</span></div><span class="project-title">'+fmt(p.title)+'</span><span class="project-desc">'+fmt(p.tagline)+'</span><span class="project-footer"><span>'+fmt(p.type).toUpperCase()+'</span><span class="project-cta" aria-hidden="true">↗</span></span></button>').join("")||'<div class="empty-state" style="grid-column:1/-1">No projects match that search. Try another term or category.</div>';
 byId("project-count").textContent=String(items.length).padStart(2,"0")+" / "+String(PROJECTS.length).padStart(2,"0");
 grid.querySelectorAll("[data-project]").forEach(btn=>btn.addEventListener("click",()=>openProject(btn.dataset.project)));
}
function modal(content){
 lastFocused=document.activeElement;
 const root=byId("detail-overlay");
 byId("detail-content").innerHTML=content;
 root.classList.add("open");root.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");
 root.querySelector(".dialog-close").focus();
}
function closeModal(id){
 const root=byId(id);root.classList.remove("open");root.setAttribute("aria-hidden","true");
 if(!$$(".overlay.open").length)document.body.classList.remove("modal-open");
 if(lastFocused&&lastFocused.isConnected)lastFocused.focus();
}
function openProject(id){
 const p=PROJECTS.find(x=>x.id===id);if(!p)return;
 const external=safeExternal(p.url)?'<a href="'+fmt(p.url)+'" class="btn btn-primary btn-mini" target="_blank" rel="noopener noreferrer">Visit related website ↗</a>':"";
 const readMore=p.detailUrl?'<a href="'+p.detailUrl+'" class="btn btn-primary btn-mini">Read full project story ↗</a>':'';
 modal('<p class="dialog-top">PROJECT FILE // '+fmt(p.type)+' · '+fmt(p.status)+'</p><h3 id="detail-title">'+fmt(p.title)+'</h3><p>'+fmt(p.description)+'</p><div class="detail-grid"><div><b>FOCUS AREAS</b><span>'+fmt(p.focus)+'</span></div><div><b>APPROACH</b><span>'+fmt(p.approach)+'</span></div></div><p><strong class="accent">What this explores:</strong> '+fmt(p.learn)+'</p><div class="dialog-actions">'+readMore+external+'<a href="#contact" class="btn btn-outline btn-mini" data-close-and-go>Let’s connect ↗</a></div>');
 byId("detail-content").querySelectorAll("[data-close-and-go]").forEach(a=>a.addEventListener("click",()=>closeModal("detail-overlay")));
}
function renderLab(id){
 const lab=LAB.find(x=>x.id===id)||LAB[0];currentLab=lab.id;
 $$(".lab-choice").forEach(btn=>btn.setAttribute("aria-pressed",String(btn.dataset.lab===lab.id)));
 byId("lab-stage").innerHTML='<div class="term-prompt">suraj@future:~ $ open experiment/'+fmt(lab.id)+'</div><span class="lab-status">'+fmt(lab.phase).toUpperCase()+'</span><h3 class="term-title">'+fmt(lab.title)+'</h3><div class="term-label">→ '+fmt(lab.focus)+'</div><div class="term-grid"><div class="term-block"><h4>01 // HYPOTHESIS</h4><p>'+fmt(lab.hypothesis)+'</p></div><div class="term-block"><h4>02 // METHOD</h4><p>'+fmt(lab.method)+'</p></div><div class="term-block"><h4>03 // LEARNING</h4><p>'+fmt(lab.lesson)+'</p></div><div class="term-block"><h4>04 // STATUS</h4><p>This is an evolving experiment. Claims, results and prototypes are documented when validated.</p></div></div>';
}
function renderWriting(){
 const grid=byId("writing-grid");
 if(!grid)return;
 const published=[
  {title:"SEO on GitHub Pages: From Domain Setup to Search Console",cluster:"SEO & SEARCH",href:"/writing/seo-github-pages-guide/",summary:"Custom domains, indexing, canonical URLs and practical technical SEO for a static website.",words:"4,457 words",time:"22 min"},
  {title:"Why Low Cost per Lead Can Hide Poor Campaign Performance",cluster:"PAID MEDIA & ANALYTICS",href:"/writing/google-ads-lead-quality/",summary:"Understand accidental call clicks, duplicate conversions, lead quality and what happens after the enquiry.",words:"4,364 words",time:"22 min"},
  {title:"AI Agents vs Workflow Automation",cluster:"AI & AUTOMATION",href:"/writing/ai-agents-vs-automations/",summary:"When to use deterministic workflows, how to manage autonomy and why validation matters.",words:"4,160 words",time:"21 min"}
 ];
 grid.innerHTML=published.map((w,i)=>'<a class="article-card article-card--published" href="'+w.href+'"><span class="article-card-top"><span class="mono">'+fmt(w.cluster)+'</span><span class="mono muted">0'+(i+1)+'</span></span><h3>'+fmt(w.title)+'</h3><p>'+fmt(w.summary)+'</p><span class="meta"><span>'+w.words+' · '+w.time+' read</span><strong>Read article ↗</strong></span></a>').join("");
}
function openWriting(id){
 const w=WRITING.find(x=>x.id===id);if(!w)return;
 modal('<p class="dialog-top">WRITING ARCHIVE // '+fmt(w.category)+' / CONCEPT NOTE</p><h3 id="detail-title">'+fmt(w.title)+'</h3><p>'+fmt(w.description)+'</p><div class="term-block"><h4>THE STARTING IDEA</h4><p>'+fmt(w.prompt)+'</p></div><p style="margin-top:18px">This is an upcoming original essay topic, not a published article. I plan to develop it using firsthand experience and supporting evidence.</p><div class="dialog-actions"><button class="btn btn-outline btn-mini" type="button" id="idea-next">See another idea →</button></div>');
 const next=byId("idea-next");if(next)next.addEventListener("click",()=>{const i=WRITING.findIndex(x=>x.id===id);openWriting(WRITING[(i+1)%WRITING.length].id);});
}
const SECTIONS=[{id:"top",label:"Home",detail:"Return to the beginning"},{id:"about",label:"About",detail:"The person behind the work"},{id:"work",label:"Work",detail:"Professional experience and approach"},{id:"projects",label:"Projects",detail:"Explore the project universe"},{id:"lab",label:"The Lab",detail:"Experiments and prototypes"},{id:"writing",label:"Writing",detail:"Ideas and field notes"},{id:"contact",label:"Contact",detail:"Start a conversation"}];
function commandsFor(q){
 const query=q.trim().toLowerCase();const section=SECTIONS.map(s=>({title:s.label,detail:s.detail,action:()=>{location.hash=s.id==="top"?"#top":"#"+s.id;closeModal("command-overlay")},type:"Navigate"}));
 const projects=PROJECTS.map(p=>({title:p.title,detail:p.type+" · "+p.status,action:()=>{closeModal("command-overlay");setTimeout(()=>openProject(p.id),0)},type:"Project"}));
 const actions=[{title:"Choose colour theme",detail:"Open the six-palette experience studio",action:()=>{closeModal("command-overlay");setTheme()},type:"Action"},{title:"Choose animation style",detail:"Open the motion experience studio",action:()=>{closeModal("command-overlay");setMotion()},type:"Action"},{title:"Copy website link",detail:"Share heysuraj.com",action:()=>{closeModal("command-overlay");copyLink()},type:"Action"}];
 return [...section,...projects,...actions].filter(x=>[x.title,x.detail,x.type].join(" ").toLowerCase().includes(query)).slice(0,13);
}
function renderCommands(){
 commandItems=commandsFor(byId("command-search").value);selectedCommand=Math.min(selectedCommand,Math.max(0,commandItems.length-1));
 byId("command-results").innerHTML=commandItems.map((item,i)=>'<button class="command-item '+(i===selectedCommand?"selected":"")+'" type="button" data-cmd="'+i+'"><span class="cmd-icon">'+(item.type==="Project"?"✳":item.type==="Action"?"⌘":"↗")+'</span><span class="cmd-main"><b>'+fmt(item.title)+'</b><small>'+fmt(item.detail)+'</small></span><span class="mono">'+fmt(item.type)+'</span></button>').join("")||'<p class="command-help">No results. Try “AI”, “Projects” or “Contact”.</p>';
 byId("command-results").querySelectorAll("[data-cmd]").forEach(b=>{b.addEventListener("click",()=>commandItems[Number(b.dataset.cmd)]?.action());b.addEventListener("mousemove",()=>{selectedCommand=Number(b.dataset.cmd);});});
}
function openCommand(){
 lastFocused=document.activeElement;const root=byId("command-overlay");root.classList.add("open");root.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");
 byId("command-search").value="";selectedCommand=0;renderCommands();byId("command-search").focus();
}
async function copyLink(){
 const url="https://heysuraj.com/";
 try{await navigator.clipboard.writeText(url);toast("Website link copied")}catch{toast("Share this link: "+url)}
}
function initCanvas(){
 const canvas=byId("starfield");if(!canvas)return;
 const ctx=canvas.getContext("2d",{alpha:true});if(!ctx)return;
 let w=0,h=0,dpr=1,stars=[],raf=0,lastFrame=0,rgba=[110,241,223];
 let mouse={x:-1000,y:-1000};
 const mode=()=>document.documentElement.dataset.motionScene||"orbit";
 const color=a=>"rgba("+rgba.join(",")+","+Math.max(0,Math.min(1,a)).toFixed(3)+")";
 function tint(){
  const hex=getComputedStyle(document.documentElement).getPropertyValue("--accent2").trim();
  if(/^#[0-9a-f]{6}$/i.test(hex))rgba=[1,3,5].map(n=>parseInt(hex.slice(n,n+2),16));
 }
 function resize(){
  w=innerWidth;h=innerHeight;dpr=Math.min(devicePixelRatio||1,1.8);
  canvas.width=Math.floor(w*dpr);canvas.height=Math.floor(h*dpr);canvas.style.width=w+"px";canvas.style.height=h+"px";
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const count=Math.min(110,Math.max(34,Math.floor(w*h/16000)));
  stars=Array.from({length:count},(_,i)=>({
   x:((i*0.618033988749895+0.23)%1)*w,y:((i*.754877666246693+0.37)%1)*h,
   r:i%5===0?1.4:.75,s:.2+(i%9)*.09,phase:i*2.34
  }));
 }
 function star(x,y,r,alpha){
  ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=color(alpha);ctx.fill();
 }
 function draw(t){
  if(!motionEnabled()||document.hidden){raf=0;ctx.clearRect(0,0,w,h);return}
  raf=requestAnimationFrame(draw);
  if(t-lastFrame<33)return;lastFrame=t;
  ctx.clearRect(0,0,w,h);
  const time=t*.001,scene=mode();
  if(scene==="aurora"){
   ctx.save();ctx.globalCompositeOperation="screen";
   for(let band=0;band<5;band++){
    const gradient=ctx.createLinearGradient(0,h*(.13+band*.17),w,h*(.3+band*.13));
    gradient.addColorStop(0,color(0));gradient.addColorStop(.47,color(.06+band*.012));gradient.addColorStop(1,color(0));
    ctx.beginPath();
    for(let p=0;p<=22;p++){
     const x=w*p/22,y=h*(.15+band*.165)+Math.sin(p*.52+time*(.38+band*.07)+band)*28+Math.cos(p*.2-time*.33)*24;
     p===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.strokeStyle=gradient;ctx.lineWidth=35+band*8;ctx.lineCap="round";ctx.stroke();
   }
   ctx.restore();
   stars.forEach(st=>star(st.x,st.y,st.r,.08+.12*(.5+.5*Math.sin(time*.6+st.phase))));
  }else if(scene==="constellation"){
   const nodes=stars.map(st=>({x:st.x+Math.sin(time*.34+st.phase)*14,y:st.y+Math.cos(time*.23+st.phase)*12,r:st.r}));
   for(let i=0;i<nodes.length;i++){
    const a=nodes[i];
    for(let j=i+1;j<nodes.length;j++){
     const b=nodes[j],dx=a.x-b.x,dy=a.y-b.y,d2=dx*dx+dy*dy;
     if(d2<12500){
      ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
      ctx.strokeStyle=color((1-Math.sqrt(d2)/112)*.1);ctx.lineWidth=.55;ctx.stroke();
     }
    }
    const dist=Math.hypot(a.x-mouse.x,a.y-mouse.y),near=Math.max(0,1-dist/145);
    if(near>0){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(mouse.x,mouse.y);ctx.strokeStyle=color(near*.26);ctx.stroke();}
    star(a.x,a.y,a.r+near*.8,.23+near*.45);
   }
  }else if(scene==="meteor"){
   stars.forEach(st=>{
    const speed=44+st.s*130,xx=((st.x+time*speed)% (w+160))-80;
    const yy=((st.y+time*speed*.63)% (h+140))-70;
    ctx.beginPath();ctx.moveTo(xx,yy);ctx.lineTo(xx-(15+st.s*25),yy-(8+st.s*18));
    ctx.strokeStyle=color(.12+st.s*.17);ctx.lineWidth=st.r*.9;ctx.stroke();
    star(xx,yy,st.r,.25);
   });
  }else if(scene==="breathe"){
   const cx=w*.72,cy=h*.45,pulse=.5+.5*Math.sin(time*.75);
   for(let i=0;i<4;i++){
    ctx.beginPath();ctx.arc(cx,cy,65+i*105+pulse*20,0,Math.PI*2);
    ctx.strokeStyle=color(.08-i*.012+pulse*.018);ctx.lineWidth=1;ctx.stroke();
   }
   stars.forEach(st=>star(st.x,st.y,st.r*(.8+pulse*.35),.13+.12*(.5+.5*Math.sin(time*.7+st.phase))));
  }else{
   stars.forEach(st=>{
    const y=(st.y+time*st.s*9)%h;
    const x=st.x+Math.sin(time*.32+st.phase)*6;
    const near=Math.max(0,1-Math.hypot(x-mouse.x,y-mouse.y)/148);
    star(x,y,st.r+near*.8,.16+near*.42);
    if(near>.25){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(mouse.x,mouse.y);ctx.strokeStyle=color(near*.1);ctx.stroke();}
   });
  }
 }
 function start(){
  if(!motionEnabled()){cancelAnimationFrame(raf);raf=0;ctx.clearRect(0,0,w,h);return}
  if(!raf&&!document.hidden){lastFrame=0;raf=requestAnimationFrame(draw)}
 }
 addEventListener("resize",()=>{resize();start()},{passive:true});
 addEventListener("pointermove",e=>{mouse.x=e.clientX;mouse.y=e.clientY},{passive:true});
 document.addEventListener("visibilitychange",()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0}else start()});
 const observer=new MutationObserver(()=>{tint();start()});
 observer.observe(document.documentElement,{attributes:true,attributeFilter:["data-motion","data-motion-scene","data-palette","data-theme"]});
 reduced.addEventListener?.("change",()=>start());
 resize();tint();start();
}
function initMotion(){
 const stage=$(".orbit-core");const area=$(".orbit-stage");
 if(stage&&area){area.addEventListener("pointermove",e=>{if(!motionEnabled()||e.pointerType==="touch")return;const r=area.getBoundingClientRect();const x=((e.clientX-r.left)/r.width-.5)*12;const y=((e.clientY-r.top)/r.height-.5)*-12;stage.style.setProperty("--tilt-x",y+"deg");stage.style.setProperty("--tilt-y",x+"deg")},{passive:true});area.addEventListener("pointerleave",()=>{stage.style.setProperty("--tilt-x","0deg");stage.style.setProperty("--tilt-y","0deg")});}
 if("IntersectionObserver" in window){
  const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");obs.unobserve(e.target)}}),{threshold:.04,rootMargin:"0px 0px 80px 0px"});
  $(".reveal").forEach(el=>obs.observe(el));
  const navObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){const id=e.target.id;$(".nav-list a").forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+id));}}),{rootMargin:"-25% 0px -55% 0px"});
  $("main section[id],#top").forEach(el=>navObserver.observe(el));
 }else{$(".reveal").forEach(el=>el.classList.add("visible"));}
 const progress=byId("progress");let queued=false;
 addEventListener("scroll",()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{const h=document.documentElement.scrollHeight-innerHeight;progress.style.width=(h>0?Math.max(0,scrollY/h*100):0)+"%";queued=false;});},{passive:true});
}
function setup(){
 byId("year").textContent=String(new Date().getFullYear());
 renderProjects();renderWriting();renderLab(currentLab);
 $$(".tab").forEach(b=>b.addEventListener("click",()=>{currentCategory=b.dataset.category;$$(".tab").forEach(t=>t.setAttribute("aria-pressed",String(t===b)));renderProjects();}));
 byId("project-search").addEventListener("input",e=>{currentQuery=e.target.value.toLowerCase().trim();renderProjects();});
 $$(".lab-choice").forEach(b=>b.addEventListener("click",()=>renderLab(b.dataset.lab)));
 byId("command-open").addEventListener("click",openCommand);
 byId("command-search").addEventListener("input",()=>{selectedCommand=0;renderCommands()});
 byId("command-search").addEventListener("keydown",e=>{if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();selectedCommand=Math.max(0,Math.min(commandItems.length-1,selectedCommand+(e.key==="ArrowDown"?1:-1)));renderCommands();}if(e.key==="Enter"){e.preventDefault();commandItems[selectedCommand]?.action();}});
 byId("share-link")?.addEventListener("click",copyLink);
 $$(".dialog-close").forEach(b=>b.addEventListener("click",()=>closeModal(b.closest(".overlay").id)));
 $$(".overlay").forEach(o=>o.addEventListener("pointerdown",e=>{if(e.target===o)closeModal(o.id)}));
 addEventListener("keydown",e=>{
  const typing=e.target instanceof HTMLElement && (e.target.isContentEditable||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName));
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();if(byId("command-overlay").classList.contains("open"))closeModal("command-overlay");else openCommand();}
  else if(e.key==="Escape"){$$(".overlay.open").forEach(o=>closeModal(o.id));}
  else if(e.key==="/"&&!typing&&!$$(".overlay.open").length){e.preventDefault();byId("project-search").focus();location.hash="#projects";}
  else if(e.key==="Tab"){const overlay=$(".overlay.open");if(overlay){const els=Array.from(overlay.querySelectorAll('button:not([disabled]),input:not([disabled]),a[href]')).filter(el=>el.getClientRects().length);if(els.length){let i=els.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();els[els.length-1].focus()}else if(!e.shiftKey&&i===els.length-1){e.preventDefault();els[0].focus()}}}}
 });
 const toggle=byId("menu-toggle"),nav=byId("main-nav");
 toggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));});
 nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");toggle.setAttribute("aria-expanded","false")}));
 initCanvas();initMotion();
 if(location.hash&&document.querySelector(location.hash)){setTimeout(()=>document.querySelector(location.hash)?.scrollIntoView(),400);}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",setup);else setup();
