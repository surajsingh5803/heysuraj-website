/* Rebuild the static HeySuraj part of Pico's public knowledge from published HTML.
   External Lazy Plex/social records are curated; don't scrape login-gated profiles. */
import {readdir,readFile,writeFile} from "node:fs/promises";
import path from "node:path";
const output="assets/pico-knowledge.json";
const existing=JSON.parse(await readFile(output,"utf8"));
const keep=(existing.records||[]).filter(x=>x.kind!=="heysuraj");
const directories=["","about","work","projects/lazy-plex","projects/lp-leados","projects/lp-crm","projects/seo-audit-engine","projects/heysuraj-website","writing","writing/seo-github-pages-guide","writing/google-ads-lead-quality","writing/ai-agents-vs-automations"];
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
  url:"https://heysuraj.com/"+(dir?dir+"/":""),summary:desc,keywords:categoryKeywords[dir]||dir.split("/"),content,
  source:"Official HeySuraj website",updated:new Date().toISOString().slice(0,10)});
}
const result={version:1,generatedAt:new Date().toISOString(),policy:existing.policy,records:[...records,...keep]};
await writeFile(output,JSON.stringify(result,null,2)+"\n");
console.log("Updated public Pico knowledge:",records.length,"site pages +",keep.length,"curated external records");
