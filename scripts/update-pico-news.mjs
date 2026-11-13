/* Refresh public news headlines for Pico. Run by GitHub Actions.
   No AI-generated news, no paywalled full text and no visitor tracking. */
import {readFile,writeFile} from "node:fs/promises";
const path="assets/pico-news.json";
const feeds=[
 ["Technology","https://feeds.bbci.co.uk/news/technology/rss.xml"],
 ["Business","https://feeds.bbci.co.uk/news/business/rss.xml"],
 ["World","https://feeds.bbci.co.uk/news/world/rss.xml"]
];
const decode=s=>String(s||"").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,"$1")
 .replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&apos;/g,"'")
 .replace(/&#39;|&#x27;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">")
 .replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim();
const tag=(item,name)=>decode((item.match(new RegExp("<"+name+"(?:\\s[^>]*)?>([\\s\\S]*?)<\\/"+name+">","i"))||[])[1]);
const items=[];
for(const [category,uri] of feeds){
 try{
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),13000);
  let response;
  try{response=await fetch(uri,{signal:controller.signal,headers:{"User-Agent":"HeySurajPico/1.0 (+https://heysuraj.com/)","Accept":"application/rss+xml, application/xml, text/xml"}});}
  finally{clearTimeout(timer);}
  if(!response.ok)throw Error("RSS status "+response.status);
  const xml=await response.text();
  if(!xml.includes("<rss")&&!xml.includes("<channel"))throw Error("Unexpected feed format");
  for(const block of xml.match(/<item>[\s\S]*?<\/item>/g)||[]){
   const title=tag(block,"title"),url=tag(block,"link"),published=tag(block,"pubDate");
   const publishedAt=new Date(published).toISOString?.();
   if(!title||!url.startsWith("https://")||!Number.isFinite(Date.parse(published))||!publishedAt)continue;
   if(Date.now()-Date.parse(published)>4*86400000)continue;
   const parsed=new URL(url);
   if(!["bbc.com","bbc.co.uk","www.bbc.com","www.bbc.co.uk"].includes(parsed.hostname))continue;
   items.push({title:title.slice(0,180),url,publishedAt,category,source:"BBC News",summary:tag(block,"description").slice(0,240)});
   if(items.filter(i=>i.category===category).length>=7)break;
  }
  console.log(category,items.filter(i=>i.category===category).length,"fresh headlines");
 }catch(e){console.warn("Feed unavailable:",category,e.message);}
}
const dedup=[...new Map(items.map(item=>[item.url,item])).values()].sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt)).slice(0,18);
if(dedup.length<3){console.error("Not enough fresh verified stories; keeping previously published file.");process.exitCode=1;}
else{
 const output={generatedAt:new Date().toISOString(),sourceMethod:"Scheduled source-linked RSS headline feed. No full article retrieval. Verify the linked article for details.",items:dedup};
 await writeFile(path,JSON.stringify(output,null,2)+"\n");
 console.log("Updated Pico news with",dedup.length,"source-linked items");
}
