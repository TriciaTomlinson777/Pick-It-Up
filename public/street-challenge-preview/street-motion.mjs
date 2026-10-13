// Draw approved sequential poses over the existing street background.
export async function createStreetMotion(section,reduced=false){
 const canvas=document.createElement('canvas');canvas.className='street-motion';canvas.setAttribute('aria-hidden','true');
 const ctx=canvas.getContext('2d');let alive=true,raf=0;
 const load=src=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(Error('Animation artwork unavailable'));im.src=src});
 const images=await Promise.all(['ann-forward-v1.webp','captain-forward-v1.webp','ann-turn-camera-v1.webp'].map(load));
 section.querySelector('.street-world').append(canvas);
 function bounds(im,x,y,w,h){
  const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(im,x,y,w,h,0,0,w,h);const data=g.getImageData(0,0,w,h).data;
  let l=w,t=h,r=0,b=0;for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++)if(data[(yy*w+xx)*4+3]>160){l=Math.min(l,xx);r=Math.max(r,xx);t=Math.min(t,yy);b=Math.max(b,yy)}
  return {im,x:x+l,y:y+t,w:r-l+1,h:b-t+1};
 }
 const walk=images.slice(0,2).map(im=>Array.from({length:8},(_,i)=>bounds(im,(i%4)*384,Math.floor(i/4)*512,384,512)));
 const turn=[0,1].map(side=>Array.from({length:6},(_,i)=>bounds(images[2],(i%3)*512+side*256,Math.floor(i/3)*512,256,512)));
 const heights=[0,1].map(i=>Math.max(...walk[i].map(f=>f.h),...turn[i].map(f=>f.h)));
 function drawFrame(frame,x,ground,height,index){const scale=height/heights[index];ctx.drawImage(frame.im,frame.x,frame.y,frame.w,frame.h,x-frame.w*scale/2,ground-frame.h*scale,frame.w*scale,frame.h*scale)}
 function draw(kind,frame,progress=1){
  const W=section.clientWidth,H=section.clientHeight,dpr=Math.min(devicePixelRatio||1,2);canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
  const height=Math.min(H*.32,W*.57)*(kind==='walk'?.70+.30*progress:1),ground=H*(kind==='walk'?.66+.25*progress:.91);
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
