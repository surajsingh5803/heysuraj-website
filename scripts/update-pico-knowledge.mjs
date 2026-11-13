/* Rebuild the static HeySuraj part of Pico's public knowledge from published HTML.
   External Lazy Plex/social records are curated; don't scrape login-gated profiles. */
import {readdir,readFile,writeFile} from "node:fs/promises";
import path from "node:path";
const output="assets/pico-knowledge.json";
const existing=JSON.parse(await readFile(output,"utf8"));
const keep=(existing.records||[]).filter(x=>x.kind!=="heysuraj"&&x.kind!=="project");
// Discover every published HTML page rather than maintaining an article list manually.
const directories=[];
const excluded=new Set(["assets","tests","scripts","tools","pico-service",".github","node_modules","seo"]);
async function discover(dir="",depth=0){
 if(depth>5)return;
 const entries=await readdir(dir||".",{withFileTypes:true});
 if(entries.some(x=>x.isFile()&&x.name==="index.html"))directories.push(dir);
 for(const item of entries){
  if(!item.isDirectory()||excluded.has(item.name)||item.name.startsWith("."))continue;
  await discover(path.posix.join(dir,item.name),depth+1);
 }
}
await discover();
directories.sort((a,b)=>a.length-b.length||a.localeCompare(b));
const categoryKeywords={
"":["suraj","personal website","heysuraj","portfolio","digital marketing","builder","ai","projects"],
"about":["about suraj","suraj","education","career","mba","work experience","icici bank","college","who is suraj"],
"work":["digital marketing","seo","paid ads","analytics","campaigns","performance marketing","growth","marketing services"],
"projects/lazy-plex":["lazy plex","lazyplex","agency","founder","consultancy","growth"],
"projects/lp-leados":["lp leados","prospecting","lead intelligence","research tool","scraper"],
"projects/lp-crm":["lp crm","crm","business operations","software","invoices","client records"],
"projects/seo-audit-engine":["seo audit engine","seo software","technical audit","crawl"],
"projects/heysuraj-website":["heysuraj website","github pages","personal portfolio","website hosting"],
"writing":["writing","blog","articles","guides"],
"writing/seo-github-pages-guide":["seo github pages","dns","https","canonicals","search console","indexing"],
"writing/google-ads-lead-quality":["google ads","lead quality","cpl","cost per lead","conversion measurement"],
"writing/ai-agents-vs-automations":["ai agents","automation","workflow","tools","guardrails"]
};
const text=html=>String(html).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi," ")
 .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi," ").replace(/<(?:nav|footer|header)\b[^>]*>[\s\S]*?<\/(?:nav|footer|header)>/gi," ")
 .replace(/<[^>]*>/g," ").replace(/&amp;/g,"&").replace(/&nbsp;/g," ").replace(/&rsquo;|&#8217;/g,"'")
 .replace(/&quot;/g,'"').replace(/&mdash;/g,"—").replace(/&ndash;/g,"–").replace(/\s+/g," ").trim();
const records=[];
for(const dir of directories){
 const html=await readFile(path.join(dir,"index.html"),"utf8");
 const title=text((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[])[1]||dir);
 const desc=text((html.match(/<meta name="description" content="([^"]+)"/i)||[])[1]||"");
 const main=(html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)||[])[1]||html;
 const article=(main.match(/<article class="prose"[^>]*>([\s\S]*?)<\/article>/i)||[])[1];
 const content=text(article||main).slice(0,dir.startsWith("writing/")?4700:6500);
 records.push({id:dir.replace(/[^a-z0-9]+/gi,"-")||"home",kind:"heysuraj",title,
  url:"https://heysuraj.com/"+(dir?dir+"/":""),summary:desc,keywords:categoryKeywords[dir]||[title,...dir.split("/")].filter(Boolean),content,
  source:"Official HeySuraj website",updated:new Date().toISOString().slice(0,10)});
}
const app=await readFile("assets/app.js","utf8");
const beg=app.indexOf("const PROJECTS = ["),end=app.indexOf("const LAB = [",beg);
const projects=[];
if(beg>=0&&end>beg){
 for(const line of app.slice(beg,end).split("\n").filter(x=>x.trim().startsWith("{id:"))){
  const obj={};
  for(const m of line.matchAll(/([a-zA-Z]+):"((?:\\"|[^"])*)"/g))obj[m[1]]=m[2].replace(/\\"/g,'"');
  if(!obj.id||!obj.title)continue;
  projects.push({id:"project-"+obj.id,kind:"project",title:obj.title,
   url:obj.detailUrl?"https://heysuraj.com"+obj.detailUrl:"https://heysuraj.com/#projects",
   summary:obj.description||"",keywords:[obj.title,obj.id.replaceAll("-"," "),obj.type||"",obj.focus||""],
   content:["Project status: "+(obj.status||"unspecified"),"Tagline: "+(obj.tagline||""),"What it is: "+(obj.description||""),"Focus: "+(obj.focus||""),"Approach: "+(obj.approach||""),"Lessons: "+(obj.learn||"")].join(". "),
   source:"HeySuraj published project archive",updated:new Date().toISOString().slice(0,10)});
 }
}
const result={version:1,generatedAt:new Date().toISOString(),policy:existing.policy,records:[...records,...projects,...keep]};
await writeFile(output,JSON.stringify(result,null,2)+"\n");
console.log("Updated public Pico knowledge:",records.length,"site pages +",projects.length,"project cards +",keep.length,"external records");
