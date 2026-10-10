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

 // A tap owns one full reach/contact/lift cycle. Reuse the drawn reaching
 // pose, and keep the prop at its grip while the actor returns to standing.
 async function pickup(key,prop,onHeld){
  if(!await ready||disposed)return;
  const side=key==='grabber'?1:0;
  const standing={x:side===0?-.10:.075,y:.53};
  const reaching={x:side===0?-.16:.22,y:.88};
  const rect=hero.getBoundingClientRect();
  const floorY=rect.bottom-rect.height*.03;
  const floorX=rect.left+rect.width/2+(side===0?-.26:.28)*rect.height;
  const actorDX=floorX-(rect.left+rect.width/2+reaching.x*rect.height);
  const actorDY=floorY-(rect.top+reaching.y*rect.height);
  const gripOffset=key==='bag'?.06:key==='bottle'?.20:.10;
  function place(x,y){prop.style.left=(x-prop.offsetWidth/2)+'px';prop.style.top=(y-prop.offsetHeight*gripOffset)+'px'}
  place(floorX,floorY);
  if(reduced){draw(11);onHeld();return}
  const approach=actor.animate([{transform:'translate(0,0)'},{transform:'translate('+actorDX+'px,'+actorDY+'px)'}],{duration:500,easing:'ease-in-out',fill:'forwards'});
  activeAnimations.add(approach);
  draw(5);try{await approach.finished}catch{}
  if(disposed)return;
  await pause(250);if(disposed)return;
  // Contact occurs before the item moves; it now follows the hand.
  actor.style.transform='translate('+actorDX+'px,'+actorDY+'px)';
  approach.cancel();activeAnimations.delete(approach);
  const lift=actor.animate([{transform:actor.style.transform},{transform:'translate(0,0)'}],{duration:650,easing:'ease-in-out',fill:'forwards'});
  activeAnimations.add(lift);
  const startTime=performance.now();
  await new Promise(resolve=>{
   function tick(now){
    if(disposed){resolve();return}
    const progress=Math.min(1,(now-startTime)/650),t=progress*progress*(3-2*progress);
    const x=(1-t)*(reaching.x*rect.height+actorDX)+t*standing.x*rect.height;
    const y=(1-t)*(reaching.y*rect.height+actorDY)+t*standing.y*rect.height;
    place(rect.left+rect.width/2+x,rect.top+y);
    if(progress>=.55)draw(11);
    if(progress<1)requestAnimationFrame(tick);else resolve();
   }
   requestAnimationFrame(tick);
  });
  lift.cancel();activeAnimations.delete(lift);actor.style.transform='';
  if(disposed)return;draw(11);onHeld();
 }
 function dispose(){disposed=true;actor.style.transform='';actor.classList.remove('at-table');observer.disconnect();activeAnimations.forEach(a=>a.cancel());canvas.remove();hero.classList.remove('pose-active');actor.classList.remove('pose-motion')}
 return {ready,jump,gloves,walkToTable,pickup,dispose};
}
