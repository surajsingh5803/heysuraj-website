import {spawn} from "node:child_process";
import {setTimeout as pause} from "node:timers/promises";
const base="http://127.0.0.1:8767";
const child=spawn(process.execPath,["pico-service/server.mjs"],{env:{...process.env,PORT:"8767",NODE_ENV:"test",DATABASE_URL:"",OPENAI_API_KEY:"",RESEND_API_KEY:"",PICO_ADMIN_TOKEN:""},stdio:["ignore","pipe","pipe"]});
let log="";child.stdout.on("data",c=>log+=c.toString());child.stderr.on("data",c=>log+=c.toString());
const issues=[];
async function verify(name,fn){try{await fn();console.log("PASS "+name);}catch(err){issues.push(name+": "+err.message);console.error("FAIL "+name+": "+err.message);}}
function equals(a,b){if(a!==b)throw Error("Expected "+b+", received "+a);}
try{
 let alive=false;
 for(let i=0;i<40;i++){try{const r=await fetch(base+"/health");if(r.ok){alive=true;break}}catch{}await pause(150);}
 if(!alive)throw Error("Pico API failed to start. "+log);
 await verify("health reports unconnected optional services",async()=>{const d=await (await fetch(base+"/health")).json();equals(d.ok,true);equals(d.ai,false);equals(d.inbox,false);});
 await verify("admin page served with noindex and CSP",async()=>{const r=await fetch(base+"/admin");equals(r.status,200);if(!r.headers.get("content-security-policy")?.includes("frame-ancestors"))throw Error("Missing CSP");const html=await r.text();if(!html.includes("Pico's Inbox"))throw Error("Wrong HTML");});
 await verify("owner assets served",async()=>{for(const path of ["/admin.js","/admin.css"]){const r=await fetch(base+path);equals(r.status,200);}});
 await verify("private inbox requires owner authentication",async()=>{const r=await fetch(base+"/api/messages",{headers:{Origin:"https://heysuraj.com"}});equals(r.status,401);});
 await verify("cross-origin web requests rejected",async()=>{const r=await fetch(base+"/api/chat",{method:"POST",headers:{Origin:"https://attacker.invalid","Content-Type":"application/json"},body:JSON.stringify({message:"hi"})});equals(r.status,403);});
 await verify("AI responds honestly when not configured",async()=>{const r=await fetch(base+"/api/chat",{method:"POST",headers:{Origin:"https://heysuraj.com","Content-Type":"application/json"},body:JSON.stringify({message:"hi"})});equals(r.status,503);});
 await verify("consent mandatory before message processing",async()=>{const r=await fetch(base+"/api/messages",{method:"POST",headers:{Origin:"https://heysuraj.com","Content-Type":"application/json"},body:JSON.stringify({message:"Hello",consent:false})});equals(r.status,400);});
 await verify("inbox reports unconfigured database",async()=>{const r=await fetch(base+"/api/messages",{method:"POST",headers:{Origin:"https://heysuraj.com","Content-Type":"application/json"},body:JSON.stringify({message:"Hello, Suraj!",consent:true})});equals(r.status,503);});
 await verify("allowed CORS preflight",async()=>{const r=await fetch(base+"/api/messages",{method:"OPTIONS",headers:{Origin:"https://heysuraj.com","Access-Control-Request-Method":"POST"}});equals(r.status,204);});
}finally{child.kill("SIGTERM");}
console.log("PICO API smoke: "+(9-issues.length)+"/9 assertions passed");
if(issues.length)process.exitCode=1;
