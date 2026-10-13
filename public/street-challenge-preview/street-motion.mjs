// Draw approved sequential poses over the existing street background.
export async function createStreetMotion(section,reduced=false){
 const canvas=document.createElement('canvas');canvas.className='street-motion';canvas.setAttribute('aria-hidden','true');
 const ctx=canvas.getContext('2d');let alive=true,raf=0;
 const load=src=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(Error('Animation artwork unavailable'));im.src=src});
 const images=await Promise.all(['ann-forward-v1.webp','captain-forward-v1.webp','ann-turn-camera-v1.webp'].map(load));
 section.querySelector('.street-world').append(canvas);
 function bounds(im,x,y,w,h){
  const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(im,x,y,w,h,0,0,w,h);
  const pixels=g.getImageData(0,0,w,h),data=pixels.data,seen=new Uint8Array(w*h);let largest=[];
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
 const turn=[0,1].map(side=>Array.from({length:6},(_,i)=>bounds(images[2],(i%3)*512+side*256,Math.floor(i/3)*512,256,512)));
 const heights=[0,1].map(i=>Math.max(...walk[i].map(f=>f.h),...turn[i].map(f=>f.h)));
 function drawFrame(frame,x,ground,height,index){const scale=height/heights[index],half=frame.w*scale/2;x=Math.max(half+6,Math.min(section.clientWidth-half-6,x));ctx.drawImage(frame.im,frame.x,frame.y,frame.w,frame.h,x-frame.w*scale/2,ground-frame.h*scale,frame.w*scale,frame.h*scale)}
 function draw(kind,frame,progress=1){
  const W=section.clientWidth,H=section.clientHeight,dpr=Math.min(devicePixelRatio||1,2);canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
  const height=Math.min(H*.42,W*.90),ground=H*.86;
  for(let i=0;i<2;i++)drawFrame((kind==='walk'?walk:turn)[i][Math.max(0,frame)],W*(i===0?.30:.72),ground,height,i);
 }
 const play=(duration,paint)=>new Promise((resolve,reject)=>{const start=performance.now();function tick(now){if(!alive){resolve();return}const elapsed=Math.max(0,now-start),p=reduced?1:Math.min(1,elapsed/duration);try{paint(p,elapsed)}catch(error){reject(error);return}if(p<1)raf=requestAnimationFrame(tick);else resolve()}raf=requestAnimationFrame(tick)});
 return {
  async demonstrate(){section.classList.add('drawn-motion');
   await play(4200,(p,t)=>draw('walk',Math.floor(t/180)%8,p));if(!alive)return;
   for(let i=0;i<6&&alive;i++)await play(i===5?900:550,()=>draw('turn',i));
  },
  showReady(){section.classList.add('drawn-motion');draw('turn',5)},
  hide(){section.classList.remove('drawn-motion')},
  dispose(){alive=false;cancelAnimationFrame(raf);canvas.remove();section.classList.remove('drawn-motion')}
 };
}
