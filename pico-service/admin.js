"use strict";
(()=>{let token="",items=[];const $=id=>document.getElementById(id);
const status=$("access-status"),login=$("login"),inbox=$("inbox"),list=$("messages");
const make=(tag,text,cls)=>{const el=document.createElement(tag);if(text!=null)el.textContent=String(text);if(cls)el.className=cls;return el;};
function lock(){token="";$("token").value="";inbox.hidden=true;login.hidden=false;list.replaceChildren();items=[];}
async function api(path,options={}){const r=await fetch(path,{...options,headers:{Authorization:"Bearer "+token,...options.headers},credentials:"omit"});if(!r.ok)throw Error(r.status===401?"Token incorrect or expired":("HTTP "+r.status));return r.json();}
async function fetchMessages(){try{const payload=await api("/api/messages");items=payload.items||[];inbox.hidden=false;login.hidden=true;$("updated").textContent="Updated "+new Date().toLocaleTimeString();render();}catch(e){status.textContent=e.message;lock();}}
function render(){
 const filtered=items.filter(item=>$("filter").value==="all"||item.status===$("filter").value);
 $("count").textContent=items.length+" total notes · "+items.filter(i=>i.status==="new").length+" new";
 list.replaceChildren();
 if(!filtered.length){list.append(make("div","No messages found in this view.","empty"));return;}
 for(const item of filtered){
  const card=make("article",null,"note"),head=make("div",null,"note-head"),title=make("h2",item.name||"Anonymous visitor"),time=make("time",new Date(item.created_at).toLocaleString());
  head.append(title,time);card.append(head);
  const meta=make("div",null,"note-meta");
  for(const [k,v] of [["Visitor",item.visitor_role],["Contact",item.contact||"None provided"],["From",item.source_page],["Notification",item.emailed?"Email attempted":"No email confirmation"]])meta.append(make("span",k+": "+v));
  card.append(meta,make("p",item.message));
  const controls=make("div",null,"controls");
  const state=make("select");state.setAttribute("aria-label","Status for "+(item.name||"visitor"));
  for(const value of ["new","reviewed","replied","archived"]){const option=make("option",value);option.value=value;option.selected=value===item.status;state.append(option);}
  state.addEventListener("change",async()=>{const next=state.value;state.disabled=true;try{await api("/api/messages/"+item.id,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:next})});item.status=next;render();}catch(e){alert("Could not save status: "+e.message);render();}});
  controls.append(make("span","Status: "),state);card.append(controls);list.append(card);
 }
}
$("access-form").addEventListener("submit",e=>{e.preventDefault();token=$("token").value.trim();status.textContent="Unlocking...";fetchMessages();});
$("refresh").addEventListener("click",fetchMessages);$("filter").addEventListener("change",render);$("lock").addEventListener("click",lock);
})();