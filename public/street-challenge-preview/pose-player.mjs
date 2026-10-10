// Drawn full-body poses: arm, knee and torso changes are part of each frame.
export function createPosePlayer(hero, reduced=false, asset="blonde-motion-v1.png") {
 const canvas=document.createElement('canvas');canvas.className='pose-canvas';canvas.setAttribute('aria-hidden','true');
 hero.prepend(canvas);const ctx=canvas.getContext('2d');const sheet=new Image();let disposed=false,frame=0,activeAnimations=new Set();
 const actor=hero.parentElement;let metadata, allMetadata, legPhase=null;
 function paintPose(source,pose,standingHeight,phase=null){
  const w=hero.clientWidth,h=hero.clientHeight,dpr=Math.min(window.devicePixelRatio||1,2);
  canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  const [x,y,pw,ph]=pose,scale=h/standingHeight,left=w/2-pw*scale/2,top=h-ph*scale;
  if(phase===null){ctx.drawImage(source,x,y,pw,ph,left,top,pw*scale,ph*scale);return}
  const hip=.60,legHeight=ph*(1-hip),legWidth=pw/2;
  for(let side=0;side<2;side++){
   const swing=Math.sin(phase)*(side===0?1:-1),pivotX=left+(side+.5)*legWidth*scale,pivotY=top+ph*hip*scale;
   ctx.save();ctx.translate(pivotX,pivotY);ctx.rotate(swing*.09);
   ctx.drawImage(source,x+side*legWidth,y+ph*hip,legWidth,legHeight,-legWidth*scale/2,Math.max(0,swing)*-5,legWidth*scale,legHeight*scale);ctx.restore();
  }
  ctx.drawImage(source,x,y,pw,ph*.63,left,top-Math.abs(Math.sin(phase))*2,pw*scale,ph*.63*scale);
 }
 function draw(index){if(disposed||!metadata)return;frame=index;paintPose(sheet,metadata.poses[index],metadata.standingHeight,legPhase)}
 const observer=new ResizeObserver(()=>draw(frame));observer.observe(hero);
 const ready=fetch('motion-poses.json').then(r=>{if(!r.ok)throw new Error('Motion metadata unavailable');return r.json()}).then(data=>new Promise(resolve=>{
  allMetadata=data;metadata=data[asset];if(!metadata){resolve(false);return}
  sheet.onload=()=>{if(disposed){resolve(false);return}hero.classList.add('pose-active');actor.classList.add('pose-motion');draw(0);resolve(true)};
  sheet.onerror=()=>resolve(false);sheet.src=asset;
 })).catch(()=>false);
 function pause(ms){return new Promise(resolve=>setTimeout(resolve,ms))}
 async function play(sequence){for(const [index,ms] of sequence){if(disposed)return;draw(index);await pause(ms)}}
 async function jump(){if(!await ready||disposed)return;if(reduced){draw(4);return}
  const roomRect=hero.closest('.room').getBoundingClientRect(),rect=hero.getBoundingClientRect();
  const wallY=Math.min(-55,roomRect.top+roomRect.height*.65-rect.bottom);
  const animation=actor.animate([
   {transform:'translateY('+wallY+'px) scale(.73)',offset:0},
   {transform:'translateY('+wallY+'px) scale(.73)',offset:.2},
   {transform:'translateY('+(wallY-45)+'px) scale(.85)',offset:.42},
   {transform:'translateY(0) scale(1)',offset:.72},
   {transform:'translateY(0) scale(1)',offset:1}
  ],{duration:1500,easing:'linear'});activeAnimations.add(animation);
  await play([[0,200],[1,170],[2,620],[3,330],[4,180]]);activeAnimations.delete(animation);
 }
 async function gloves(){if(!await ready||disposed)return;if(reduced){draw(11);return}
  await play([[5,650],[6,480],[7,650],[8,550],[9,650],[10,550],[11,250]]);
 }
 async function walkToTable(){
  if(!await ready||disposed)return;
  const room=hero.closest('.room'),rect=hero.getBoundingClientRect(),roomRect=room.getBoundingClientRect();
  const distance=Math.max(0,roomRect.top+roomRect.height*.676-(rect.top+rect.height*.53));
  const transform='translate(12px,'+distance+'px)';
  let walkSheet,walkMeta;
  if(asset==='blonde-motion-v1.png'&&allMetadata['blonde-walk-v1.png']){
   walkSheet=new Image();walkMeta=allMetadata['blonde-walk-v1.png'];
   await new Promise(resolve=>{walkSheet.onload=resolve;walkSheet.onerror=()=>{walkMeta=null;resolve()};walkSheet.src='blonde-walk-v1.png'});
  }
  if(disposed)return;
  function step(i){
   if(!walkMeta){legPhase=i*Math.PI/2;draw(11);return}
   paintPose(walkSheet,walkMeta.poses[i%2],walkMeta.standingHeight,i*Math.PI/2);
  }
  if(!reduced){
   const animation=actor.animate([{transform:'translate(0,0)'},{transform}],{duration:1500,easing:'ease-in-out',fill:'forwards'});activeAnimations.add(animation);
   for(let i=0;i<10;i++){if(disposed)return;step(i);await pause(150)}
   actor.style.transform=transform;animation.cancel();activeAnimations.delete(animation);
  }else actor.style.transform=transform;
  if(disposed)return;legPhase=null;draw(11);actor.classList.add('at-table');
 }

 // Match the approved glove pickup: drawn bend, grasp, then stand.
 // Props stay hidden until contact instead of travelling in from the floor.
 async function pickup(key,prop,onHeld){
  if(!await ready||disposed)return;
  prop.style.visibility='hidden';
  if(reduced){draw(11);onHeld();return}
  const held=[...hero.querySelectorAll('.attached')].filter(n=>n.style.visibility!=='hidden');
  held.forEach(n=>n.style.visibility='hidden');
  try{
   draw(5);await pause(650);if(disposed)return;
   // The same standing grasp pose used immediately after the glove bend.
   draw(6);onHeld();await pause(480);if(disposed)return;
   draw(11);await pause(250);
  }finally{
   if(!disposed)held.forEach(n=>n.style.visibility='visible');
  }
 }
 function dispose(){disposed=true;actor.style.transform='';actor.classList.remove('at-table');observer.disconnect();activeAnimations.forEach(a=>a.cancel());canvas.remove();hero.classList.remove('pose-active');actor.classList.remove('pose-motion')}
 return {ready,jump,gloves,walkToTable,pickup,dispose};
}
