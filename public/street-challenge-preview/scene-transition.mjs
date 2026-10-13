// Hold a visual snapshot until the next scene has finished preparing.
export function holdScene(room,reduced=false){
 if(reduced||room.classList.contains('booting'))return async()=>{};
 const rect=room.getBoundingClientRect(),copy=room.cloneNode(true);
 const originals=[room,...room.querySelectorAll('*')],clones=[copy,...copy.querySelectorAll('*')];
 originals.forEach((node,i)=>{
  const clone=clones[i],style=getComputedStyle(node);
  clone.removeAttribute('id');
  for(const property of style)clone.style.setProperty(property,style.getPropertyValue(property));
  clone.style.setProperty('animation','none','important');
  clone.style.setProperty('transition','none','important');
  if(node instanceof HTMLCanvasElement){
   clone.width=node.width;clone.height=node.height;
   clone.getContext('2d')?.drawImage(node,0,0);
  }
 });
 copy.setAttribute('aria-hidden','true');copy.inert=true;
 Object.assign(copy.style,{position:'fixed',left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',height:rect.height+'px',minHeight:'0',margin:'0',zIndex:'1000',pointerEvents:'none'});
 document.body.append(copy);
 let released=false;
 return async()=>{
  if(released)return;released=true;
  try{
   await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
   await copy.animate([{opacity:1},{opacity:0}],{duration:340,easing:'ease-in-out',fill:'forwards'}).finished;
  }finally{copy.remove()}
 };
}
