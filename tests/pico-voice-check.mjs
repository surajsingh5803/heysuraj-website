/* Browser regression suite. Uses synthetic microphone and speech responses, never real visitor audio. */
import {chromium} from "playwright";
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const assert=(condition,message)=>{if(!condition)throw Error(message)};
let browser,failed=false;
try{
 try{browser=await chromium.launch({channel:"chrome",headless:true,args:["--no-sandbox"]});}
 catch{browser=await chromium.launch({headless:true,args:["--no-sandbox"]});}
 const page=await browser.newPage({viewport:{width:390,height:844}});
 const errors=[];
 page.on("pageerror",e=>errors.push(e.message));
 await page.addInitScript(()=>{
  window.__picoRecs=[];window.__picoUtterances=[];
  window.SpeechRecognition=class FakeSpeechRecognition{
   constructor(){window.__picoRecs.push(this);}
   start(){this.onstart?.();}
   abort(){this.onend?.();}
   stop(){this.onend?.();}
   emit(text){this.onresult?.({resultIndex:0,results:[{isFinal:true,0:{transcript:text}}]});}
   noSpeech(){this.onerror?.({error:"no-speech"});}
  };
  window.SpeechSynthesisUtterance=class {constructor(text){this.text=text;}};
  Object.defineProperty(window,"speechSynthesis",{configurable:true,value:{
   cancel(){},
   getVoices(){return [{name:"Microsoft David - English",lang:"en-US"},{name:"Microsoft Aria Online (Natural)",lang:"en-US"}];},
   speak(utterance){
    window.__picoUtterances.push({text:utterance.text,pitch:utterance.pitch,rate:utterance.rate,voice:utterance.voice?.name||""});
    setTimeout(()=>utterance.onend?.(),75);
   }
  }});
 });
 await page.goto("http://127.0.0.1:8765/",{waitUntil:"domcontentloaded"});
 await page.locator("#pico-sprite-button").waitFor({state:"visible",timeout:15000});
 await page.locator("#pico-sprite-button").click();
 const mic=page.locator("#pico-mic");
 assert(await mic.getAttribute("aria-pressed")==="false","Voice mode should be disabled initially");
 await mic.click();
 assert(await mic.getAttribute("aria-pressed")==="true","Mic click should enter voice mode");
 assert(await page.locator("#pico-input").isHidden(),"Typing UI must hide in voice mode");
 console.log("PASS: voice mode is explicitly opt-in");
 await page.evaluate(()=>window.__picoRecs.at(-1).emit("hi"));
 await sleep(1000);
 assert(await page.evaluate(()=>window.__picoRecs.length)>=2,"Listening should restart after a spoken response");
 await page.evaluate(()=>window.__picoRecs.at(-1).emit("roast me gently"));
 await sleep(1000);
 const utterances=await page.evaluate(()=>window.__picoUtterances);
 assert(utterances.length>=2,"Pico should speak after two user phrases");
 assert(utterances.every(u=>u.pitch>1.5&&u.pitch<=1.8&&u.rate>1.05),"Pico's voice should be bright and lively");
 assert(utterances.every(u=>u.voice.includes("Aria")),"Pico should prefer a brighter voice over a clearly male alternative");
 assert(await mic.getAttribute("aria-pressed")==="true","Voice mode should remain active over multiple turns");
 console.log("PASS: multi-turn voice with youthful voice preference");
 await page.evaluate(()=>window.__picoRecs.at(-1).noSpeech());
 await sleep(150);
 assert(await page.locator("#pico-resume-mic").isVisible(),"Silence should expose Resume mic");
 const count=await page.evaluate(()=>window.__picoRecs.length);
 await sleep(800);
 assert(await page.evaluate(()=>window.__picoRecs.length)===count,"Silent mic should not continuously restart");
 await page.locator("#pico-resume-mic").click();
 assert(await page.evaluate(()=>window.__picoRecs.length)===count+1,"Resume mic must start recognition");
 console.log("PASS: silence pauses microphone without repeated questioning");
 await mic.click();
 assert(await mic.getAttribute("aria-pressed")==="false","Switching to typing must stop mic");
 assert(await page.locator("#pico-input").isVisible(),"Typing input should be available");
 assert(await page.locator("#pico-voice-setting").isChecked()===false,"Previous spoken-reply preference should be restored");
 console.log("PASS: typing resumes and previous voice preference restored");
 const write=async text=>{await page.locator("#pico-input").fill(text);await page.locator("#pico-input").press("Enter");await sleep(220);};
 const picoTurns=()=>page.locator('#pico-chat .pico-turn[data-who="pico"]').count();
 const before=await picoTurns();
 await write("no");await write("no");await write("no");
 const after=await picoTurns();
 assert(after-before===2,"Three refusals should get only two short acknowledgements, not repeated questions: "+(after-before));
 assert(await page.locator("#pico-choices").count()===0,"Repeated no should remove proactive prompts");
 console.log("PASS: three refusals mean acknowledgement, then silence");
 await write("What does Lazy Plex do for property developers?");
 const lazyLink=page.locator('#pico-chat a[href^="https://lazyplex.com/"]');
 assert(await lazyLink.count()>=1,"Lazy Plex knowledge should link its official public source");
 const message=await page.locator('#pico-chat .pico-turn[data-who="pico"]').last().innerText();
 assert(/growth|demand|buyer|sales/i.test(message),"Business answer should be relevant, not generic");
 console.log("PASS: Lazy Plex contextual business guidance with source link");
 await write("Where is Suraj's LinkedIn?");
 assert(await page.locator('a[href="https://www.linkedin.com/in/surajkumarmarketing/"]').count()>=1,"Official LinkedIn link should be present");
 console.log("PASS: relevant professional profile is discoverable");
 await write("What's the latest tech news?");
 assert(await page.locator("#pico-chat .pico-turn").last().isVisible(),"News query should receive a dated or honest unavailable reply");
 const newsText=await page.locator('#pico-chat .pico-turn[data-who="pico"]').last().innerText();
 assert(/news|headline|fresh|source|verified|available/i.test(newsText),"News should be attributed or clearly unavailable");
 console.log("PASS: news answer gives dated sources or freshness disclaimer");
 const music=page.locator("#pico-site-music"),effects=page.locator("#pico-site-fx");
 assert(await music.isVisible()&&await effects.isVisible(),"Music and effects controls must be visible");
 assert(await music.getAttribute("aria-pressed")==="false","Music must be off by default");
 await music.click();assert(await music.getAttribute("aria-pressed")==="true","Music should enable");
 assert(await page.locator("#pico-music-setting").isChecked(),"Music setting must stay in sync");
 await effects.click();assert(await effects.getAttribute("aria-pressed")==="true","Effects should enable");
 await music.click();await effects.click();
 assert(await music.getAttribute("aria-pressed")==="false"&&await effects.getAttribute("aria-pressed")==="false","Audio must switch off");
 console.log("PASS: audible original music and effects are opt-in with visible controls");
 await mic.click();assert(await mic.getAttribute("aria-pressed")==="true","Voice mode should restart on request");
 await page.locator("#pico-close").click();assert(await mic.getAttribute("aria-pressed")==="false","Closing panel must turn mic off");
 assert(errors.length===0,"JavaScript errors: "+errors.join(" | "));
 console.log("PICO REGRESSION: all tests passed");
}catch(error){failed=true;console.error("PICO TEST FAILED:",error.stack||error);}
finally{await browser?.close();}
if(failed)process.exitCode=1;
