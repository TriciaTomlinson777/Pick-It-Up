import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const html=readFileSync(new URL('../public/street-challenge-preview/index.html',import.meta.url),'utf8');
function lifecycle(){
 const listeners={};let checks=0;const emailSent={hidden:true};
 const context={window:{addEventListener:(event,cb)=>listeners[event]=cb},document:{visibilityState:'visible',addEventListener:(event,cb)=>listeners[event]=cb},$:()=>emailSent,restoreAccount:()=>checks++};
 vm.createContext(context);
 const start=html.indexOf("window.addEventListener('pageshow'");
 vm.runInContext(html.slice(start,html.indexOf("$('reset').onclick",start)),context);
 return {listeners,context,emailSent,checks:()=>checks};
}
test('a page restored from browser cache rechecks the server login',()=>{
 const c=lifecycle();c.listeners.pageshow({persisted:false});assert.equal(c.checks(),0);
 c.listeners.pageshow({persisted:true});assert.equal(c.checks(),1);
});
test('returning from email rechecks pending sign-in without interrupting equipped players',()=>{
 const c=lifecycle();c.listeners.visibilitychange();assert.equal(c.checks(),0);
 c.emailSent.hidden=false;c.context.document.visibilityState='hidden';c.listeners.visibilitychange();assert.equal(c.checks(),0);
 c.context.document.visibilityState='visible';c.listeners.visibilitychange();assert.equal(c.checks(),1);
});
