import {holdScene} from './scene-transition.mjs';
import {createPosePlayer} from './pose-player.mjs';
import {createStreetMotion} from './street-motion.mjs?v=smooth-scenes-20261013';

// Photos remain private to this browser during development.
function photoStore(mode,work){
 return new Promise((resolve,reject)=>{
  const opening=indexedDB.open('street-challenge-photos',1);
  opening.onupgradeneeded=()=>opening.result.createObjectStore('before');
  opening.onerror=()=>reject(opening.error);
  opening.onsuccess=()=>{
   const db=opening.result,tx=db.transaction('before',mode),store=tx.objectStore('before');
   let result;const req=work(store);req.onsuccess=()=>{result=req.result};
   tx.oncomplete=()=>{db.close();resolve(result)};
   tx.onerror=()=>{db.close();reject(tx.error)};
  };
 });
}
export function createOutdoor({room,avatar,motionAsset,playerId,challengeId,name,gear,onExit,audio,reduced}){
 const reveal=holdScene(room,reduced);
 const backgroundReady=new Promise(resolve=>{const image=new Image();image.onload=image.onerror=resolve;image.src='street-clean.webp'});
 const key=playerId+':'+challengeId;
 const section=document.createElement('section');section.className='outdoor';
 section.setAttribute('aria-label','Your sidewalk Challenge');
 section.innerHTML=`<div class="street-world"><div class="street-player"><span class="sprite street-sprite"></span></div><img class="street-captain" src="captain-outdoor.webp" alt="Captain Can waving"><button class="street-litter" data-piece="0" aria-label="Paper wrapper" disabled></button><button class="street-litter" data-piece="1" aria-label="Empty bottle" disabled></button><button class="street-litter" data-piece="2" aria-label="Paper receipt" disabled></button></div><div class="street-dialogue" role="status" aria-live="polite"></div><div class="street-actions"><button class="game-button camera-button" type="button" aria-label="Take before photo">📷</button><button class="text-button street-back" type="button" aria-label="Return to equipment">↩</button></div><input class="before-camera" type="file" accept="image/*" capture="environment" hidden><div class="photo-review" hidden role="dialog" aria-modal="true" aria-label="Review your before photo"><img alt="Your before photo"><button class="game-button use-photo" type="button" aria-label="Use this before photo">✓</button><button class="text-button retake-photo" type="button" aria-label="Retake before photo">📷</button><button class="text-button cancel-photo" type="button" aria-label="Cancel photo">✕</button></div>`;
 room.append(section);room.classList.add('outside');
 const find=s=>section.querySelector(s),message=find('.street-dialogue'),button=find('.camera-button'),input=find('.before-camera'),review=find('.photo-review'),preview=review.querySelector('img'),sprite=find('.street-sprite'),actor=find('.street-player');
 sprite.append(avatar.cloneNode(true));
 const pose=createPosePlayer(sprite,reduced,motionAsset);
 let alive=true,busy=false,photo=null,url=null,walkAnimation=null,step='before';
 button.hidden=true;
 function say(text){message.textContent=text}
 const cue=document.createElement('div');cue.className='visual-cue';cue.setAttribute('aria-hidden','true');section.append(cue);
 const phone=document.createElement('div');phone.className='demo-phone';phone.setAttribute('aria-hidden','true');phone.innerHTML='<span>📷</span>';actor.append(phone);
 const captain=find('.street-captain');
 let introAnimation=null,captainAnimation=null,drawnMotion=null;
 const useAnnFrames=motionAsset==='teal-glasses-motion-v1.png';
 if(useAnnFrames){section.classList.add('motion-loading');actor.style.visibility='hidden';captain.style.visibility='hidden';}
 const wait=ms=>new Promise(resolve=>setTimeout(resolve,reduced?0:ms));
 async function demonstrate(){
  busy=true;button.disabled=true;button.hidden=true;
  if(useAnnFrames){
   try{
    drawnMotion=await createStreetMotion(section,reduced);
    if(!alive){drawnMotion.dispose();return}
    await backgroundReady;if(!alive)return;
    drawnMotion.showStart();await reveal();if(!alive)return;
    await drawnMotion.demonstrate();if(!alive)return;
    section.classList.add('camera-ready');button.hidden=false;button.disabled=false;busy=false;
    say('Take your before photo of the litter.');return;
   }catch{drawnMotion?.dispose();drawnMotion=null;section.classList.remove('motion-loading');actor.style.visibility='';captain.style.visibility='';}
  }
  actor.style.left='-28%';captain.style.left='-48%';
  await pose.ready;if(!alive)return;await pose.restoreGloves();
  await backgroundReady;await reveal();if(!alive)return;
  introAnimation=actor.animate([{left:'-28%'},{left:'16%'}],{duration:reduced?0:2400,fill:'forwards',easing:'linear'});
  captainAnimation=captain.animate([{left:'-48%'},{left:'45%'}],{duration:reduced?0:2400,fill:'forwards',easing:'linear'});
  await Promise.all([introAnimation.finished,captainAnimation.finished,pose.walkInPlace(reduced?0:2400)]).catch(()=>{});
  if(!alive)return;actor.style.left='16%';captain.style.left='45%';introAnimation.cancel();captainAnimation.cancel();
  section.classList.add('notice-litter');cue.textContent='☞';await wait(1400);if(!alive)return;
  section.classList.remove('notice-litter');cue.textContent='';section.classList.add('show-phone');await wait(1600);if(!alive)return;
  section.classList.add('camera-flash');await wait(280);if(!alive)return;section.classList.remove('camera-flash');await wait(700);if(!alive)return;
  section.classList.remove('show-phone');button.hidden=false;button.disabled=false;busy=false;section.classList.add('camera-ready');
 }
 function clearURL(){if(url){URL.revokeObjectURL(url);url=null}}
 function resetPhoto(){photo=null;input.value='';clearURL();review.hidden=true}
 const equipment=document.createElement('span');equipment.className='street-equipment';
 // Keep the selected player's equipment; these are the same held props used indoors.
 for(const node of gear){if(node.dataset.gear==='gloves')continue;const item=node.cloneNode(true);item.removeAttribute('style');item.className='street-prop';item.dataset.gear=node.dataset.gear;equipment.append(item)}
 actor.append(equipment);
 say('Captain Can: You’re ready, '+name+'! Look—there’s litter on the sidewalk. Take your before photo first!');
 button.onclick=()=>{if(busy)return;if(step==='before'){input.value='';input.click()}else if(step==='saved')collect()};
 input.onchange=()=>{
  const file=input.files?.[0];if(!file)return;
  if(!file.type.startsWith('image/')){say('Please take or choose a photo.');return}
  clearURL();photo=file;url=URL.createObjectURL(file);preview.src=url;section.classList.remove('camera-ready');review.hidden=false;review.querySelector('.use-photo').focus();
 };
 review.querySelector('.retake-photo').onclick=()=>{resetPhoto();input.click()};
 review.querySelector('.cancel-photo').onclick=()=>{resetPhoto();section.classList.add('camera-ready');button.focus()};
 review.querySelector('.use-photo').onclick=async()=>{
  if(!photo||busy)return;busy=true;const use=review.querySelector('.use-photo');use.disabled=true;
  try{
   await photoStore('readwrite',store=>store.put({blob:photo,name:photo.name,capturedAt:Date.now(),playerId,challengeId,stage:'saved'},key));
   if(!alive)return;resetPhoto();step='saved';button.textContent='▶';button.setAttribute('aria-label','Continue the Challenge');say('Before photo saved on this device. Let’s pick up the litter!');busy=false;await collect();
  }catch{say('The photo could not be saved. Please try again.');}
  finally{busy=false;use.disabled=false}
 };
 async function collect(){
  if(busy||!alive)return;busy=true;section.classList.remove('camera-ready');button.disabled=true;find('.street-back').disabled=true;step='walking';
  drawnMotion?.hide();actor.style.visibility='';captain.style.visibility='';
  find('.street-world').classList.add('walking');
  say(name+' is walking along the sidewalk and picking up litter.');
  try{
   for(let i=0;i<3;i++){
    if(!alive)return;
    const left=[47,62,74][i];
    walkAnimation=actor.animate([{left:actor.style.left||'16%'},{left:left+'%'}],{duration:reduced?0:1800,easing:'linear',fill:'forwards'});
    await Promise.all([walkAnimation.finished,pose.walkInPlace(reduced?0:1800)]);
    if(!alive)return;actor.style.left=left+'%';walkAnimation.cancel();
    await pose.pickup('bag',find('[data-piece="'+i+'"]'),()=>{find('[data-piece="'+i+'"]').hidden=true;audio.play('select')});
   }
   if(!alive)return;step='collected';
   const record=await photoStore('readonly',store=>store.get(key));
   if(record)await photoStore('readwrite',store=>store.put({...record,stage:'collected'},key));
   if(!alive)return;say('Great work, '+name+'! Your before photo is saved. We’ll build the after-photo step next.');button.hidden=true;audio.play('celebrate');
  }catch{if(alive){step='saved';say('Let’s try that walk again.');section.querySelectorAll('.street-litter').forEach(n=>n.hidden=false);actor.style.left='16%'}}
  finally{if(alive){busy=false;button.disabled=false;find('.street-back').disabled=false}}
 }
 find('.street-back').onclick=()=>{if(!busy)onExit()};
 pose.ready.then(ok=>{if(alive&&ok)pose.restoreGloves()});
 photoStore('readonly',store=>store.get(key)).then(async record=>{
  if(!alive)return;if(!record){demonstrate();return;}
  await backgroundReady;await reveal();if(!alive)return;
  button.hidden=false;step=record.stage==='collected'?'collected':'saved';
  if(step==='collected'){section.querySelectorAll('.street-litter').forEach(n=>n.hidden=true);actor.style.left='74%';button.hidden=true;say('Great work, '+name+'! Your before photo is saved on this device.');}
  else{button.textContent='▶';button.setAttribute('aria-label','Continue the Challenge');say('Your before photo is saved on this device. Ready to pick up the litter?')}
 }).catch(()=>{if(alive)demonstrate()});
 return {dispose(){alive=false;reveal();drawnMotion?.dispose();clearURL();introAnimation?.cancel();captainAnimation?.cancel();walkAnimation?.cancel();pose.dispose();section.remove();room.classList.remove('outside')}};
}
