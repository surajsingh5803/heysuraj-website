/* Pico's public-data brain: useful sourced responses without pretending to have a live AI API.
   No external tracking. Only documented published resources and dated news links. */
export function createPicoBrain(){
 const cache={knowledge:null,news:null};
 let lastRecord=null,lastNews=null;
 const ALLOWED=["heysuraj.com","lazyplex.com","www.lazyplex.com","www.linkedin.com","www.instagram.com","github.com","www.bbc.com","www.bbc.co.uk","www.reuters.com"];
 const safeUrl=url=>{
  try{const u=new URL(url);return u.protocol==="https:"&&ALLOWED.includes(u.hostname);}catch{return false;}
 };
 const normal=s=>String(s||"").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9\s]/g," ").replace(/\s+/g," ").trim();
 const stem=s=>normal(s).replace(/\b(please|could|would|can|you|pico|the|a|an|me|my|what|how|does|do|is|are|tell|about|for|more|some|something|any|on|in|of|i|want|know|and|your|his|her|with)\b/g," ").replace(/\s+/g," ").trim();
 const fetchJSON=async path=>{
  const c=new AbortController(),timeout=setTimeout(()=>c.abort(),4500);
  try{const r=await fetch(path,{signal:c.signal,cache:"no-cache"});return r.ok?await r.json():null;}
  catch{return null;}finally{clearTimeout(timeout);}
 };
 async function knowledge(){
  if(cache.knowledge)return cache.knowledge;
  const data=await fetchJSON("/assets/pico-knowledge.json?v=1");
  cache.knowledge=Array.isArray(data?.records)?data.records.filter(r=>safeUrl(r.url)):[];return cache.knowledge;
 }
 async function news(){
  if(cache.news)return cache.news;
  const data=await fetchJSON("/assets/pico-news.json?v=1");
  cache.news=data&&Array.isArray(data.items)?data:{generatedAt:"",items:[]};return cache.news;
 }
 function score(record,query){
  const q=normal(query),terms=stem(query).split(" ").filter(w=>w.length>2);
  if(!q||!terms.length)return 0;
  const kws=record.keywords||[];
  let rank=0;
  for(const key of kws){
   const k=normal(key);if(!k)continue;
   if(q===k)rank+=42;
   else if(q.includes(k))rank+=Math.min(24,8+k.length*.5);
   else if(k.includes(q)&&q.length>=5)rank+=4;
  }
  const title=normal(record.title),summary=normal(record.summary||"");
  for(const term of terms){
   if(title.includes(term))rank+=2.9;
   if(summary.includes(term))rank+=1.2;
  }
  if(/lazy\s*plex|property\s*developer|residential|real estate|growth audit/i.test(q)&&record.kind==="lazyplex")rank+=9;
  if(/\b(suraj|career|education|portfolio)\b/i.test(q)&&record.kind==="heysuraj")rank+=2;
  if(/\b(linkedin)\b/i.test(q)&&record.id==="linkedin")rank+=25;
  return rank;
 }
 function knowledgeRequested(query){
  return /\b(suraj|heysuraj|lazy\s*plex|linkedin|instagram|github|portfolio|seo audit|lp crm|leados|lead os|agency|consultancy|consultant|client|marketing service|seo service|project|blog|articles|pricing|service|offer|help my business|help with|business growth|advertis(?:e|ing)|digital marketing|automation|lead generation|growth audit|real estate|property developer|resume|recruit|hire|experience|college|mba|education|career|contact|website)\b/i.test(query);
 }
 function businessReply(query,record){
  const q=normal(query);
  if(/(?:real estate|property|residential|developer|builder|housing)/.test(q))
   return "Real-estate growth is Lazy Plex's main focus. Instead of just buying more leads, its approach connects buyer demand, qualification, sales follow-up and revenue measurement. If that's your world, their Growth Audit is a sensible first conversation. 🐾";
  if(/(?:lead|crm|sales|follow.up|convert|conversion|followup)/.test(q))
   return "If leads arrive but sales teams lose track, Lazy Plex looks at qualification, CRM handoffs, follow-up automation and measurement—not just extra ads. The growth audit helps locate the real bottleneck.";
  if(/(?:search|seo|ads|campaign|customer|acquisition)/.test(q))
   return "Lazy Plex can look at acquisition channels, SEO and paid campaigns, but always alongside landing pages and lead quality. No magic ranking button—sadly I checked behind the sofa. 🐾";
  if(/(?:price|pricing|cost|fee|budget|quote)/.test(q))
   return "No reliable public price list is published for a tailored growth system. It depends on the problem and scope. You can share your challenge through Lazy Plex's Growth Audit rather than trust a made-up price.";
  return "Lazy Plex works on connected growth systems: get the right customers, convert enquiries, automate follow-up and measure results. Residential developers are its core focus; other growth-focused businesses can be a fit too. Want the official details?";
 }
 async function answerKnowledge(query){
  if(!knowledgeRequested(query)&&!(lastRecord&&/^(?:and|what about|tell me more|how does it|why|where|can it)/i.test(query)))return null;
  if(/\b(hire|work with suraj|work with lazy plex|work with you|book a call|growth audit|request a quote|request proposal|business enquiry|want marketing help|need leads|need a consultant)\b/i.test(query)){
   const business=/lazy\s*plex|growth audit|marketing|business|lead|consultant/i.test(query);
   return {reply:business?"Sounds like a real project. Lazy Plex starts by understanding where demand, follow-up or measurement is getting stuck. You can explore the Growth Audit, or leave Suraj a note if you'd rather explain your situation privately. No pressure. 🐾":"Interested in working together? Suraj's LinkedIn is the best professional starting point. You can also use Leave a note here; Pico won't send anything without your consent.",links:business?[{title:"See Lazy Plex's Growth Audit",url:"https://lazyplex.com/"},{title:"Suraj's professional profile",url:"https://www.linkedin.com/in/surajkumarmarketing/"}]:[{title:"Suraj's LinkedIn",url:"https://www.linkedin.com/in/surajkumarmarketing/"}]};
  }

  const list=await knowledge();if(!list.length)return null;
  const q=normal(query);
  if(/^(?:and|what about|tell me more|how does it|why|where)/i.test(query)&&lastRecord&&q.length<50&&!/\b(crm|leados|seo|linkedin|lazy\s*plex|suraj|marketing|website|ads|project|automation)\b/i.test(query)){
   return {reply:lastRecord.content.slice(0,530)+(lastRecord.content.length>530?"…":""),links:[{title:lastRecord.title,url:lastRecord.url}]};
  }
  const ranked=list.map(r=>({record:r,rank:score(r,query)})).sort((a,b)=>b.rank-a.rank);
  let best=ranked[0];if(best.rank<7)return null;
  // Prefer the professional profile for explicit LinkedIn requests and the business service page for commercial requests.
  if(/linkedin/i.test(query))best=ranked.find(r=>r.record.id==="linkedin")||best;
  else if(/(?:business|agency|lazy plex|lazyplex|services|growth audit|property developer)/i.test(query))
   best=ranked.find(r=>r.record.id==="lazyplex-solutions")||best;
  const r=best.record;lastRecord=r;
  let reply;
  if(r.kind==="lazyplex")reply=businessReply(query,r);
  else if(r.id==="linkedin")reply="His official LinkedIn is the best place to see current professional experience, recent posts and connect directly. His public work spans SEO, performance marketing and AI-powered workflows. I'll link it rather than pretend I know every new update.";
  else if(r.id==="instagram")reply="For the more personal, off-duty side, Suraj's official Instagram is the place to visit. I haven't memorised every photo—I have paws, not an infinite hard drive.";
  else if(r.id==="github")reply="His GitHub is where you can explore the repositories and experiments behind the projects. Some are prototypes, so check the current status before treating a feature as production-ready.";
  else if(r.id==="home"||r.url==="https://heysuraj.com/")reply="Suraj works across marketing, AI automation and independent products. His website is a place for projects, practical writing and experiments—not just a résumé. Want to explore a specific area?";
  else if(/(?:who|where|what|how|why|career|college|experience|education|mba|degree|bank|story)/i.test(query)&&r.url.includes("/about/"))
   reply="Suraj studied Marketing and HR at ISB&M Pune, then built experience across banking, real estate, digital marketing, consulting and software experiments. His full story is on the About page.";
  else reply=r.summary+(r.content&&r.summary.length<140?" "+r.content.slice(0,230).trim():"");
  reply=reply.slice(0,850);
  const links=[{title:r.title,url:r.url}];
  if(r.kind==="lazyplex"&&r.id!=="lazyplex-main")links.push({title:"Lazy Plex growth audit",url:"https://lazyplex.com/"});
  if(/(?:recruit|job|hire|career)/i.test(query))links.push({title:"Suraj's LinkedIn profile",url:"https://www.linkedin.com/in/surajkumarmarketing/"});
  return {reply,links:links.filter((v,i,a)=>safeUrl(v.url)&&a.findIndex(x=>x.url===v.url)===i).slice(0,2)};
 }
 const NEWS_Q=/\b(news|headlines|trending|latest updates?|what happened today|today.?s news|current events?|ai news|tech news|technology news|business news|world news|breaking news|samachar|khabar)\b/i;
 function dateLabel(date){try{return new Date(date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});}catch{return "unknown date";}}
 async function answerNews(query){
  const q=normal(query);
  const data=await news();
  const age=Date.now()-Date.parse(data.generatedAt);
  if(!Number.isFinite(age)||age>48*60*60*1000){
   return {reply:"I don't have a fresh verified news update right now, so I won't invent headlines. You can check the linked newsroom and ask me again later. 📰",links:[{title:"BBC News – Technology",url:"https://www.bbc.com/news/technology"}]};
  }
  const items=data.items.filter(x=>safeUrl(x.url)&&Date.now()-Date.parse(x.publishedAt)<5*86400000);
  const topic=/\b(ai|artificial intelligence|technology|tech|software|gadgets)\b/i.test(query)?"Technology":
   /\b(business|marketing|startup|economy|market)\b/i.test(query)?"Business":
   /\b(world|global|international)\b/i.test(query)?"World":null;
  const weighted=items.map(x=>({item:x,score:(topic===x.category?12:0)+stem(query).split(" ").filter(t=>t.length>3&&normal(x.title).includes(t)).length*4})).sort((a,b)=>b.score-a.score||b.item.publishedAt.localeCompare(a.item.publishedAt));
  let chosen=weighted.map(x=>x.item).slice(0,3);
  if(!chosen.length)return {reply:"My news shelf is empty right now. I won't pretend I saw a headline that I can't verify.",links:[{title:"BBC News",url:"https://www.bbc.com/news"}]};
  // A follow-up mentioning a specific headline can use its short, already sourced summary.
  if(lastNews&&/\b(that|this|more about|explain|why|details)\b/i.test(q)&&!NEWS_Q.test(q)){
   const item=lastNews;return {reply:item.title+" ("+dateLabel(item.publishedAt)+", "+item.source+"). "+(item.summary||"The headline alone isn't enough for a complete explanation; read the original source."),links:[{title:"Read original report",url:item.url}]};
  }
  lastNews=chosen[0];
  return {reply:"Here's what my news shelf has as of "+dateLabel(data.generatedAt)+" (headlines, not a live broadcast):\n"+
   chosen.map((x,i)=>(i+1)+". "+x.title+" — "+x.source+", "+dateLabel(x.publishedAt)).join("\n")+
   "\nWant one of these explained? I'm happy to discuss what the sourced brief says.",links:chosen.map(x=>({title:x.title,url:x.url}))};
 }
 async function tryAnswer(query){
  if(NEWS_Q.test(query))return answerNews(query);
  if(lastNews&&/\b(more about that|explain that news|tell me about that story)\b/i.test(query))
   return {reply:lastNews.title+": "+(lastNews.summary||"Only the headline is available in my feed. Check the original article for detail."),links:[{title:"Original news source",url:lastNews.url}]};
  return answerKnowledge(query);
 }
 return {tryAnswer,knowledge,news,isNewsQuery:q=>NEWS_Q.test(q)};
}
