// Layout regression check for all indexable pages of heysuraj.com.
// Runs against a local HTTP server on GitHub Actions, so no production changes are needed.
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
const origin="http://127.0.0.1:8765";
const paths=["/","/about/","/work/","/writing/","/writing/seo-github-pages-guide/","/writing/google-ads-lead-quality/","/writing/ai-agents-vs-automations/","/projects/lazy-plex/","/projects/lp-crm/","/projects/lp-leados/","/projects/seo-audit-engine/","/projects/heysuraj-website/"];
const widths=[{name:"desktop",width:1440,height:900},{name:"laptop",width:1024,height:768},{name:"tablet",width:768,height:900},{name:"mobile",width:390,height:844},{name:"small-mobile",width:320,height:720}];
const fails=[];
let browser;
try{browser=await chromium.launch({channel:"chrome",headless:true,args:["--no-sandbox"]});}
catch(error){console.log("Chrome channel unavailable, testing bundled Chromium: "+error.message);browser=await chromium.launch({headless:true,args:["--no-sandbox"]});}
const context=await browser.newContext({reducedMotion:"reduce"});
await mkdir("layout-screenshots",{recursive:true});
for(const v of widths){
 const page=await context.newPage({viewport:{width:v.width,height:v.height}});
 const errors=[];
 page.on("pageerror",e=>errors.push(e.message));
 // This is a layout test, not a third-party network test.
 await page.route("https://fonts.googleapis.com/**",route=>route.abort());
 await page.route("https://fonts.gstatic.com/**",route=>route.abort());
 for(const path of paths){
  errors.length=0;
  try{
   const response=await page.goto(origin+path,{waitUntil:"domcontentloaded",timeout:12000});
   await page.waitForTimeout(250);
   const metrics=await page.evaluate(()=>{
    const width=document.documentElement.clientWidth;
    const pageWidth=document.documentElement.scrollWidth;
    const main=document.querySelector("main");
    const cards=[...document.querySelectorAll(".article-card--published,.article-featured")];
    const emptyReveal=[...document.querySelectorAll(".reveal")].filter(el=>getComputedStyle(el).opacity==="0").length;
    const heading=document.querySelector("main h1");
    const header=document.querySelector(".site-header");
    const r=main?.getBoundingClientRect();
    return {width,pageWidth,mainWidth:r?.width,mainLeft:r?.left,headingText:heading?.innerText,headerHeight:header?.getBoundingClientRect().height,cards:cards.length,emptyReveal,projects:document.querySelectorAll(".project-card").length,topics:document.querySelectorAll(".roadmap-list li").length,hasH1:!!heading,details:document.querySelectorAll("details.roadmap-group").length};
   });
   if(response?.status()!==200)fails.push(path+" "+v.name+" HTTP "+response?.status());
   if(metrics.pageWidth>metrics.width+3)fails.push(path+" "+v.name+" horizontal overflow "+metrics.pageWidth+" > "+metrics.width);
   if(!metrics.hasH1)fails.push(path+" "+v.name+" no H1");
   if(metrics.emptyReveal)fails.push(path+" "+v.name+" hidden reveal panels: "+metrics.emptyReveal);
   if(path==="/"&&metrics.projects!==22)fails.push("Home "+v.name+" projects "+metrics.projects+" expected 22");
   if(path==="/"&&metrics.cards!==3)fails.push("Home "+v.name+" article cards "+metrics.cards+" expected 3");
   if(path==="/writing/"&&(metrics.cards!==3||metrics.topics!==27||metrics.details!==5))fails.push("Writing "+v.name+" incorrect card/roadmap counts "+JSON.stringify(metrics));
   if(v.name==="mobile"||v.name==="desktop"){
    if(path==="/"||path==="/writing/"){
      const id=path==="/"?"home":"writing";
      await page.screenshot({path:"layout-screenshots/"+id+"-"+v.name+".png",fullPage:true});
    }
   }
   if(errors.length)fails.push(path+" "+v.name+" runtime error: "+errors.join(" | ").slice(0,600));
   console.log("PASS "+v.name.padEnd(12)+" "+path.padEnd(44)+" "+metrics.width+"px viewport / "+metrics.pageWidth+"px content");
  }catch(e){fails.push(path+" "+v.name+" "+e.message);}
 }
 await page.close();
}
await browser.close();
console.log("\nAUDIT: "+(widths.length*paths.length)+" browser visits, "+fails.length+" issues");
if(fails.length){fails.forEach(x=>console.error("FAIL "+x));process.exitCode=1;}
