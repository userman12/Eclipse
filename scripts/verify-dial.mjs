/**
 * Renders the same geometry EclipseDial draws, as a PNG strip of eight
 * phases, so a graphic whose correctness is otherwise invisible can actually
 * be looked at.  Run with:
 *
 *   npm run verify:dial            (writes dial-phases.png)
 *   npm run verify:dial -- out.png
 *
 * What to check: the bite must start on one side, reach a ringed corona at
 * totality, then reopen on the OPPOSITE side — the Moon crosses the Sun, it
 * does not back out the way it came.
 */
import {deflateSync} from 'node:zlib'; import {writeFileSync} from 'node:fs';
const zo=(i,tz)=>{const p=new Intl.DateTimeFormat('en-US',{timeZone:tz,hourCycle:'h23',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'}).formatToParts(new Date(i));const g=t=>Number(p.find(x=>x.type===t).value);return Date.UTC(g('year'),g('month')-1,g('day'),g('hour'),g('minute'),g('second'))-i;};
const toUtc=(d,t,tz='Europe/Madrid')=>{const[y,m,dd]=d.split('-').map(Number);const[h,mi,s=0]=t.split(':').map(Number);const n=Date.UTC(y,m-1,dd,h,mi,s);return n-zo(n-zo(n,tz),tz);};
const D='2026-08-12';
const T={partialStart:toUtc(D,'19:30:51'),totalityStart:toUtc(D,'20:27:35'),maximum:toUtc(D,'20:28:13'),totalityEnd:toUtc(D,'20:28:51'),partialEnd:toUtc(D,'21:21:54')};
const K=1.04,DP=K+1,DT=K-1;
const th=(T.totalityStart-T.maximum)/1000,ph=(T.partialStart-T.maximum)/1000,r=th/ph;
const IMPACT=Math.sqrt(Math.max(0,Math.min((DT**2-r**2*DP**2)/(1-r**2),DT**2*0.999)));
const XP=Math.sqrt(DP**2-IMPACT**2),XT=Math.sqrt(DT**2-IMPACT**2);
const A=[{t:T.partialStart,x:-XP},{t:T.totalityStart,x:-XT},{t:T.maximum,x:0},{t:T.totalityEnd,x:XT},{t:T.partialEnd,x:XP}];
const mx=n=>{if(n<=A[0].t)return -XP;if(n>=A[4].t)return XP;for(let i=1;i<A.length;i++){const a=A[i-1],b=A[i];if(n<=b.t)return a.x+(b.x-a.x)*((n-a.t)/(b.t-a.t));}return XP;};
function crc32(buf){let c;const tb=crc32.t??(crc32.t=Array.from({length:256},(_,n)=>{c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0;}));let cr=0xffffffff;for(const b of buf)cr=tb[(cr^b)&255]^(cr>>>8);return (cr^0xffffffff)>>>0;}
const chunk=(ty,da)=>{const l=Buffer.alloc(4);l.writeUInt32BE(da.length);const td=Buffer.concat([Buffer.from(ty,'ascii'),da]);const c=Buffer.alloc(4);c.writeUInt32BE(crc32(td));return Buffer.concat([l,td,c]);};
function png(w,h,rgb){const raw=Buffer.alloc(h*(1+w*3));for(let y=0;y<h;y++){const rs=y*(1+w*3);raw[rs]=0;for(let x=0;x<w;x++){const i=(y*w+x)*3;raw[rs+1+x*3]=rgb[i];raw[rs+2+x*3]=rgb[i+1];raw[rs+3+x*3]=rgb[i+2];}}
 const ih=Buffer.alloc(13);ih.writeUInt32BE(w,0);ih.writeUInt32BE(h,4);ih[8]=8;ih[9]=2;
 return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('IDAT',deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))]);}

const CELL=110, R_SUN=21*(CELL/96), SS=3; // supersample
const times=[['19:30',toUtc(D,'19:30:51')],['19:50',toUtc(D,'19:50:00')],['20:10',toUtc(D,'20:10:00')],['20:25',toUtc(D,'20:25:00')],
 ['TOT',T.maximum],['20:31',toUtc(D,'20:31:00')],['20:50',toUtc(D,'20:50:00')],['21:22',T.partialEnd]];
const W=CELL*times.length,H=CELL;
const buf=Buffer.alloc(W*H*3);
for(let i=0;i<times.length;i++){
 const [,t]=times[i]; const cx=CELL/2+i*CELL, cy=CELL/2;
 const x=mx(t), mX=cx+x*R_SUN, mY=cy+IMPACT*R_SUN, rM=R_SUN*1.04;
 const total=t>=T.totalityStart&&t<=T.totalityEnd;
 for(let py=0;py<H;py++) for(let px=i*CELL;px<(i+1)*CELL;px++){
  let sun=0,cor=0;
  for(let sy=0;sy<SS;sy++)for(let sx=0;sx<SS;sx++){
   const X=px+(sx+.5)/SS, Y=py+(sy+.5)/SS;
   const dS=Math.hypot(X-cx,Y-cy), dM=Math.hypot(X-mX,Y-mY);
   if(dS<=R_SUN&&dM>rM) sun++;
   if(total&&dS>R_SUN*1.0&&dS<R_SUN*1.9&&dM>rM) cor++;
  }
  const f=sun/(SS*SS), cf=cor/(SS*SS);
  let R=7,G=27,B=43; // atlantic
  if(cf>0){const a=cf*0.45;R+=(220-R)*a;G+=(228-G)*a;B+=(232-B)*a;}
  if(f>0){R=R+(255-R)*f;G=G+(214-G)*f;B=B+(107-B)*f;}
  const o=(py*W+px)*3; buf[o]=R;buf[o+1]=G;buf[o+2]=B;
 }
}
const out=process.argv[2]??'dial-phases.png';
writeFileSync(out,png(W,H,buf));
console.log(`✓ ${out}`);
console.log('  fasi:',times.map(([l])=>l).join('  '));
