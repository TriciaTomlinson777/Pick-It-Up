import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createPosePlayer} from '../public/street-challenge-preview/pose-player.mjs';

function fixture(t) {
 const draws=[], classes=new Set(), actorClasses=new Set(), animations=[];
 const canvas={setAttribute(){},remove(){},getContext(){return {setTransform(){},clearRect(){},save(){},restore(){},translate(){},rotate(){},drawImage(...args){draws.push(args)}}}};
 const replacements={document:{createElement:()=>canvas},window:{devicePixelRatio:1},ResizeObserver:class{observe(){} disconnect(){}},Image:class{set src(v){queueMicrotask(()=>this.onload())}},fetch:async()=>({ok:true,json:async()=>JSON.parse(fs.readFileSync(new URL('../public/street-challenge-preview/motion-poses.json',import.meta.url)))})};
 for(const [key,value] of Object.entries(replacements)){const previous=globalThis[key];globalThis[key]=value;t.after(()=>{if(previous===undefined)delete globalThis[key];else globalThis[key]=previous})}
 const hero={closest:()=>({getBoundingClientRect:()=>({top:0,height:760})}),getBoundingClientRect:()=>({top:100,height:240}),clientWidth:170,clientHeight:240,prepend(){},classList:{add:c=>classes.add(c),remove:c=>classes.delete(c)},parentElement:{style:{},classList:{add:c=>actorClasses.add(c),remove:c=>actorClasses.delete(c)},animate(){const animation={cancelled:false,cancel(){this.cancelled=true}};animations.push(animation);return animation}}};
 return {hero,draws,classes,animations,actorClasses};
}

test('reduced motion enters a standing pose and finishes with fitted gloves',async t=>{
 const {hero,draws,classes}=fixture(t);const player=createPosePlayer(hero,true);
 assert.equal(await player.ready,true);await player.jump();await player.gloves();
 assert.equal(draws.length,3);assert(classes.has('pose-active'));
 const data=JSON.parse(fs.readFileSync(new URL('../public/street-challenge-preview/motion-poses.json',import.meta.url)));
 assert.deepEqual(draws.at(-1).slice(1,5),data['blonde-motion-v1.png'].poses[11]);
 player.dispose();assert(!classes.has('pose-active'));
});

test('starting again during a jump cancels movement and prevents late pose updates',async t=>{
 const {hero,draws,animations,classes}=fixture(t);const player=createPosePlayer(hero);
 await player.ready;const jump=player.jump();await Promise.resolve();player.dispose();const count=draws.length;await jump;
 assert.equal(draws.length,count);assert(animations.every(a=>a.cancelled));assert(!classes.has('pose-active'));
});

test('an unavailable pose asset reports failure so the existing avatar remains usable',async t=>{
 const {hero,draws,classes}=fixture(t);const player=createPosePlayer(hero,false,'missing.png');
 assert.equal(await player.ready,false);assert.equal(draws.length,0);assert(!classes.has('pose-active'));player.dispose();
});


test('reduced motion reaches the table without stepping and reset clears its position',async t=>{
 const {hero,actorClasses}=fixture(t);const player=createPosePlayer(hero,true);
 await player.ready;await player.gloves();await player.walkToTable();
 assert(actorClasses.has('at-table'));assert.match(hero.parentElement.style.transform,/^translate\(12px,/);
 player.dispose();assert.equal(hero.parentElement.style.transform,'');assert(!actorClasses.has('at-table'));
});

test('all avatar frames contain full bodies rather than isolated sprite fragments',()=>{
 const data=JSON.parse(fs.readFileSync(new URL('../public/street-challenge-preview/motion-poses.json',import.meta.url)));
 const sheets=Object.entries(data).filter(([name])=>name.includes('-motion-'));
 assert.equal(sheets.length,9);
 for(const [name,sheet] of sheets){assert.equal(sheet.poses.length,12);for(const [x,y,w,h] of sheet.poses){assert(x>=0&&y>=0&&w>50&&h>100,name)}}
});
