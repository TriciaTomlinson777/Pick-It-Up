// Preview-only local adapter. Never authenticates or writes to the server.
export function createGuestSession(storage){
 const key='street-challenge-guest-session-v1';
 let state;try{state=JSON.parse(storage.getItem(key))}catch{}
 state=state&&Array.isArray(state.heroes)?state:{heroes:[],entries:{}};
 state.entries ||= {};
 const save=()=>{try{storage.setItem(key,JSON.stringify(state))}catch{}};
 const current=()=>({signedIn:true,hero:state.heroes[0]||null,heroes:state.heroes,email:''});
 return {
 async account(action,data={}){
  if(action==='save'){
   let hero=state.heroes.find(h=>h.id===data.heroId);
   if(hero)Object.assign(hero,{name:data.name,avatar:data.avatar});
   else{hero={id:'guest-'+crypto.randomUUID(),name:data.name,avatar:data.avatar};state.heroes.push(hero)}
   save();return {...current(),hero};
  }
  if(action&&action!=='resume')throw Error('This action is unavailable in guest testing.');
  return current();
 },
 async challenge(heroId,action,data={}){
  if(!state.heroes.some(h=>h.id===heroId))throw Error('Choose a guest player first.');
  if(action==='join')state.entries[heroId] ||= {gear:[],done:false};
  if(action==='progress')state.entries[heroId]={...state.entries[heroId],gear:data.gear,done:data.done,screen:data.screen};
  if(action&&action!=='join'&&action!=='progress')throw Error('Guest tests cannot submit to the site.');
  save();return {serverNow:new Date().toISOString(),challenge:{id:'guest-test',ends_at:'2099-01-01T00:00:00Z',timezone:'America/Phoenix',results_status:'pending'},entry:state.entries[heroId]||null};
 }
 };
}
