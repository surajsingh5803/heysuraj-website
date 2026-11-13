/* Simulated browser microphone tests: no visitor audio is captured or retained. */
import {chromium} from "playwright";
let browser;
const issues=[];
const assert=(value,message)=>{if(!value)throw Error(message)};
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
try{
 browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 const page=await browser.newPage({viewport:{width:390,height:844}});
 const pageErrors=[];
 page.on("pageerror",e=>pageErrors.push(e.message));
 await page.addInitScript(()=>{
  window.__picoRecs=[];window.__picoUtterances=[];
  window.SpeechRecognition=class MockSpeechRecognition{
   constructor(){window.__picoRecs.push(this);this.continuous=false;this.interimResults=false;this.resultIndex=0;}
   start(){this.onstart?.()}
   abort(){this.onend?.()}
   stop(){this.onend?.()}
   emit(text){this.onresult?.({resultIndex:0,results:[{isFinal:true,0:{transcript:text}}]})}
  };
  window.SpeechSynthesisUtterance=class {constructor(text){this.text=text;}};
  Object.defineProperty(window,"speechSynthesis",{configurable:true,value:{
   cancel(){},getVoices(){return [{name:"Test synthetic youthful",lang:"en-IN"}]},
   speak(utterance){window.__picoUtterances.push({text:utterance.text,pitch:utterance.pitch,rate:utterance.rate});setTimeout(()=>utterance.onend?.(),90);}
  }});
 });
 await page.goto("http://127.0.0.1:8765/",{waitUntil:"domcontentloaded"});
 await page.locator("#pico-sprite-button").waitFor({state:"visible",timeout:15000});
 await page.locator("#pico-sprite-button").click();
 const mic=page.locator("#pico-mic"),hint=page.locator("#pico-voice-hint");
 assert(await mic.getAttribute("aria-pressed")==="false","Mic should start off");
 await mic.click();
 assert(await mic.getAttribute("aria-pressed")==="true","Mic should stay on after one click");
 assert(await page.locator("#pico-root").evaluate(el=>el.classList.contains("pico-voice-mode")),"Voice mode class missing");
 assert(await page.locator("#pico-input").isHidden(),"Typing area should hide in voice mode");
 assert((await hint.textContent()).length>0,"Listening status should be announced");
 console.log("PASS mic enters persistent voice mode and hides typing UI");
 await page.evaluate(()=>window.__picoRecs.at(-1).emit("hi"));
 await sleep(1300);
 assert(await mic.getAttribute("aria-pressed")==="true","Mic turned off after first phrase");
 let count=await page.evaluate(()=>window.__picoRecs.length);
 assert(count>=2,"Mic did not automatically re-arm after first reply");
 console.log("PASS mic remains on after first response and listening restarts");
 await page.evaluate(()=>window.__picoRecs.at(-1).emit("roast me gently"));
 await sleep(1300);
 count=await page.evaluate(()=>window.__picoRecs.length);
 assert(await mic.getAttribute("aria-pressed")==="true","Mic turned off after second phrase");
 assert(count>=3,"Mic did not re-arm after second reply");
 const voices=await page.evaluate(()=>window.__picoUtterances);
 assert(voices.length>=2,"Pico did not speak in voice mode");
 assert(voices.every(v=>v.pitch>1.25&&v.pitch<1.7),"Synthetic playful voice pitch outside configured range");
 console.log("PASS repeated conversation with pitched synthetic voice");
 const text=await page.locator("#pico-chat").textContent();
 assert(/cartoon red panda|browser|panda|productivity app|roast|joke|lawyers/i.test(text||""),"No playful local banter in conversation");
 console.log("PASS visitor-first light sarcasm rather than repetitive portfolio pitches");
 await mic.click();
 assert(await mic.getAttribute("aria-pressed")==="false","Second mic click did not exit voice mode");
 assert(await page.locator("#pico-input").isVisible(),"Text entry was not restored");
 const before=await page.evaluate(()=>window.__picoRecs.length);
 await sleep(900);
 assert((await page.evaluate(()=>window.__picoRecs.length))===before,"Mic restarted after visitor opted out");
 console.log("PASS second mic click switches back to typing and stops rearming");
 await mic.click();
 assert(await mic.getAttribute("aria-pressed")==="true","Mic should start again when visitor opts in");
 await page.locator("#pico-close").click();
 assert(await mic.getAttribute("aria-pressed")==="false","Closing Pico must turn the microphone off");
 console.log("PASS closing Pico stops the microphone for privacy");
 assert(pageErrors.length===0,"Runtime errors: "+pageErrors.join(" / "));
 console.log("PICO VOICE: all simulated browser tests passed");
}catch(e){console.error("PICO VOICE FAILURE: "+e.stack);issues.push(e.message);}
finally{await browser?.close();}
if(issues.length)process.exitCode=1;
