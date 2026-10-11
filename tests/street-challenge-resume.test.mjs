import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../public/street-challenge-preview/index.html',import.meta.url),'utf8');
test('restoring a completed entry preserves gear and ready screen without replaying pickups',async()=>{
 const source=html.slice(html.indexOf('async function resumeHero('),html.indexOf('\n\nconst draftKey'));
 const nodes=new Map();const node=id=>{if(!nodes.has(id))nodes.set(id,{style:{},hidden:false,value:'',textContent:''});return nodes.get(id)};
 const attached=[],restored=[],stored=[];
 const buttons=['gloves','grabber','bottle','bag'].map(key=>({dataset:{gear:key},setAttribute(){},querySelector(){return {textContent:''}}}));
 const context={$:node,equipped:new Set(),document:{querySelectorAll:()=>attached},gearButtons:buttons,posePlayer:null,room:{classList:{remove(){}}},select(){},refreshGear(){},attachGear:key=>restored.push(key),tickClock(){},activeHeroId:null,restoringProgress:false,
 enterEquipment:async restoring=>{assert.equal(restoring,true);stored.push(context.restoringProgress)},
 storeProgress:()=>stored.push({gear:[...context.equipped],done:node('gearDone').hidden})};
 vm.createContext(context);vm.runInContext(source+';this.resume=resumeHero;',context);
 await context.resume({id:'hero-one',avatar:2,name:'Hero'},{gear:['gloves','grabber','bottle','bag'],done:true});
 assert.deepEqual(restored,['gloves','grabber','bottle','bag']);assert.equal(node('gearDone').hidden,true);
 assert.equal(node('gearStatus').textContent,'Ready for the challenge!');assert.equal(stored[0],true);
 assert.equal(stored[1].gear.length,4);assert.equal(context.restoringProgress,false);
});
test('a second hero starts with separate equipment state',async()=>{
 const source=html.slice(html.indexOf('async function resumeHero('),html.indexOf('\n\nconst draftKey'));
 const nodes=new Map(),node=id=>{if(!nodes.has(id))nodes.set(id,{style:{},hidden:false,value:''});return nodes.get(id)};
 const context={$:node,equipped:new Set(['gloves','grabber','bottle','bag']),document:{querySelectorAll:()=>[]},gearButtons:[],posePlayer:null,room:{classList:{remove(){}}},select(){},refreshGear(){},attachGear(){},tickClock(){},activeHeroId:'hero-one',restoringProgress:false,enterEquipment:async restoring=>assert.equal(restoring,false),storeProgress(){}};
 vm.createContext(context);vm.runInContext(source+';this.resume=resumeHero;',context);
 await context.resume({id:'hero-two',avatar:0,name:'Second'},null);
 assert.equal(context.equipped.size,0);assert.equal(context.activeHeroId,'hero-two');assert.equal(node('gearDone').hidden,false);
});
