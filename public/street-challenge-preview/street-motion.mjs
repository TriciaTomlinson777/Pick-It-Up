// Draw approved sequential poses over the existing street background.
export async function createStreetMotion(section,reduced=false){
 const canvas=document.createElement('canvas');canvas.className='street-motion';canvas.setAttribute('aria-hidden','true');
 const ctx=canvas.getContext('2d');let alive=true,raf=0;
 const load=src=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(Error('Animation artwork unavailable'));im.src=src});
 const images=await Promise.all(['ann-forward-v1.webp','captain-forward-v1.webp','ann-turn-camera-v1.webp'].map(load));
 const [bag,heldGear]=await Promise.all(['recycle-bag.png','held-gear.webp'].map(load));
 section.querySelector('.street-world').append(canvas);
 function bounds(im,x,y,w,h,divider=null,side=0){
  const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(im,x,y,w,h,0,0,w,h);
  const pixels=g.getImageData(0,0,w,h),data=pixels.data,seen=new Uint8Array(w*h);let largest=[];
  // Hair and capes cross the midpoint of the paired turn artwork.
  if(divider)for(let yy=0;yy<h;yy++){
   let j=1;while(j<divider.length-1&&yy>divider[j][0])j++;
   const [ya,xa]=divider[j-1],[yb,xb]=divider[j],edge=xa+(xb-xa)*Math.max(0,Math.min(1,(yy-ya)/(yb-ya)));
   for(let xx=0;xx<w;xx++)if(side===0?xx>=edge:xx<edge)data[(yy*w+xx)*4+3]=0;
  }
  // A neighboring pose can peek into a sheet cell. Isolate the character's
  // largest connected silhouette instead of drawing every opaque sheet pixel.
  for(let n=0;n<w*h;n++){
   if(seen[n]||data[n*4+3]<=32)continue;
   const component=[],queue=[n];seen[n]=1;
   for(let k=0;k<queue.length;k++){
    const p=queue[k];component.push(p);const xx=p%w,yy=Math.floor(p/w);
    for(const q of [xx? p-1:-1,xx<w-1?p+1:-1,yy?p-w:-1,yy<h-1?p+w:-1]){
     if(q<0||seen[q]||data[q*4+3]<=32)continue;seen[q]=1;queue.push(q);
    }
   }
   if(component.length>largest.length)largest=component;
  }
  if(!largest.length)throw Error('Empty animation pose');
  let l=w,t=h,r=0,b=0;const keep=new Uint8Array(w*h);
  for(const p of largest){keep[p]=1;const xx=p%w,yy=Math.floor(p/w);l=Math.min(l,xx);r=Math.max(r,xx);t=Math.min(t,yy);b=Math.max(b,yy)}
  for(let p=0;p<w*h;p++)if(!keep[p])data[p*4+3]=0;
  g.putImageData(pixels,0,0);
  return {im:c,x:l,y:t,w:r-l+1,h:b-t+1};
 }
 const walk=images.slice(0,2).map(im=>Array.from({length:8},(_,i)=>bounds(im,(i%4)*384,Math.floor(i/4)*512,384,512)));
 const dividers=[
 [[0,290],[180,288],[270,265],[512,270]],
 [[0,315],[180,311],[230,292],[290,266],[512,264]],
 [[0,313],[180,302],[250,275],[330,256],[512,256]],
 [[0,273],[220,273],[320,266],[512,271]],
 [[0,276],[180,275],[250,272],[340,268],[512,270]],
 [[0,270],[180,271],[260,270],[350,267],[512,270]]
 ];
 const turn=[0,1].map(side=>Array.from({length:6},(_,i)=>bounds(images[2],(i%3)*512,Math.floor(i/3)*512,512,512,dividers[i],side)));
 // Glove grip coordinates measured in each 384×512 walking cell.
 const bagGrips=[[166,255],[96,289],[85,280],[85,292],[160,258],[128,273],[87,290],[145,253]];
 const heights=[0,1].map(i=>Math.max(...walk[i].map(f=>f.h)));
 function drawFrame(frame,x,ground,height,index,standing=false,carry=1){
  const reference=standing?Math.max(...turn[index].map(f=>f.h)):heights[index];
  const scale=height/reference,half=frame.w*scale/2;
  x=Math.max(half+6,Math.min(section.clientWidth-half-6,x));
  ctx.save();ctx.translate(x,ground-2);ctx.scale(height*.20,height*.023);
  const shadow=ctx.createRadialGradient(0,0,0,0,0,1);shadow.addColorStop(0,'rgba(66,39,23,.32)');shadow.addColorStop(1,'rgba(66,39,23,0)');
  ctx.fillStyle=shadow;ctx.beginPath();ctx.arc(0,0,1,0,Math.PI*2);ctx.fill();ctx.restore();
  // Paint Ann first so her bag cannot disappear behind her legs.
  if(index===0)ctx.drawImage(frame.im,frame.x,frame.y,frame.w,frame.h,x-half,ground-frame.h*scale,frame.w*scale,frame.h*scale);
  // Carry props travel and scale with the same grounded character.
  if(index===0){
   const bw=height*.24,bh=height*.28;
   // The handle meets Ann's lowered glove while walking. During the
   // first turn poses she lowers the bag to the sidewalk before using the phone.
   const poseIndex=walk[0].indexOf(frame);
   const grip=bagGrips[Math.max(0,poseIndex)];
   const handX=x-half+(grip[0]-frame.x)*scale;
   const handY=ground-frame.h*scale+(grip[1]-frame.y)*scale;
   // Anchor the front handle's crown under the glove (55% across, 10.5% down).
   // Use the character's exact scale
   // and crop. A generic sine wave cannot follow separately drawn arm poses.
   const restingX=x-height*.31,restingY=ground-bh;
   const bx=standing?restingX:handX-bw*.55;
   const by=standing?restingY-height*.19*carry:handY-bh*.105;
   if(carry<.1){
    ctx.save();ctx.fillStyle='rgba(66,39,23,.16)';ctx.beginPath();
    ctx.ellipse(bx+bw/2,ground-1,bw*.55,height*.012,0,0,Math.PI*2);ctx.fill();ctx.restore();
   }
   ctx.drawImage(bag,bx,by,bw,bh);
   if(!standing){
    // Keep the gripping glove above the handle while the bag follows each pose.
    ctx.save();ctx.beginPath();ctx.arc(handX,handY,22*scale,0,Math.PI*2);ctx.clip();
    ctx.drawImage(frame.im,frame.x,frame.y,frame.w,frame.h,x-half,ground-frame.h*scale,frame.w*scale,frame.h*scale);
    ctx.restore();
   }
  }
  if(index===1||standing)ctx.drawImage(frame.im,frame.x,frame.y,frame.w,frame.h,x-half,ground-frame.h*scale,frame.w*scale,frame.h*scale);
  if(index===1){
   // Captain holds the grip; the jaws point down beside his boot.
   const gripX=x+height*.21,gripY=ground-height*.49;
   const gw=height*.18,gh=height*.50;
   ctx.drawImage(heldGear,heldGear.width*.75,0,heldGear.width*.25,heldGear.height,
    gripX-gw*.50,gripY-gh*.12,gw,gh);
  }
 }
 function draw(kind,frame,progress=1,carry=1){
  const W=section.clientWidth,H=section.clientHeight,dpr=Math.min(devicePixelRatio||1,2);canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
  // The litter lies at 79–80% of the sidewalk height. Start behind it,
  // then pass it before turning at the original, approved photo position.
  // Keep the same perspective for the body, feet, and contact shadow.
  const travel=kind==='walk'?Math.max(0,Math.min(1,progress)):1;
  const height=Math.min(H*.42,W*.90)*(.70+.30*travel);
  const ground=H*(.705+.18*travel);
  for(let i=0;i<2;i++){
   const start=i===0?.38:.65,end=i===0?.30:.72;
   // Open space beside the litter before crossing its ground plane, then
   // ease back to the approved photo marks without stopping the steps.
   const bend=Math.sin(Math.PI*travel)*(.055)*(i===0?-1:1);
   drawFrame((kind==='walk'?walk:turn)[i][Math.max(0,frame)],
    W*(start+(end-start)*travel+bend),ground,height,i,kind!=='walk',carry);
  }
 }
 const play=(duration,paint)=>new Promise((resolve,reject)=>{const start=performance.now();function tick(now){if(!alive){resolve();return}const elapsed=Math.max(0,now-start),p=reduced?1:Math.min(1,elapsed/duration);try{paint(p,elapsed)}catch(error){reject(error);return}if(p<1)raf=requestAnimationFrame(tick);else resolve()}raf=requestAnimationFrame(tick)});
 return {
  async demonstrate(){section.classList.add('drawn-motion');
   // Move from the last step into the turn without a frontal idle pose.
   await play(3840,(p,t)=>draw('walk',Math.floor(Math.min(t,3839)/160)%8,p));if(!alive)return;
   const durations=[0,160,180,220,360,900];
   for(let i=1;i<6&&alive;i++)await play(durations[i],p=>draw('turn',i,1,i===1?1-p:i===2?0:0));
  },
  showReady(){section.classList.add('drawn-motion');draw('turn',5,1,0)},
  hide(){section.classList.remove('drawn-motion')},
  dispose(){alive=false;cancelAnimationFrame(raf);canvas.remove();section.classList.remove('drawn-motion')}
 };
}
