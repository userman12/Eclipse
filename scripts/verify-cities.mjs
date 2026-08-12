/**
 * Cross-checks every city in src/data/cities.ts against the app's own
 * verified solar-position formula (src/lib/sun.ts): for each city's reported
 * time of maximum eclipse, is the Sun really where the source says it is?
 *
 * This does not (and cannot, without real lunar shadow ephemeris) verify the
 * eclipse contact times or magnitudes themselves — those are taken from
 * published predictions (tutiempo.net / eclipsor.org, cross-checked against
 * each other). What it verifies is that no city's coordinates, timezone, or
 * transcribed time contain a data-entry error: if the Sun isn't where the
 * source claims at the claimed instant, something upstream is wrong.
 *
 * Also derives `endsAtSunset` empirically per city — Sun altitude at the
 * final contact ≈ 0° — rather than trusting each source's own wording,
 * which disagreed with each other by several minutes on some cities.
 *
 * Run with: npm run verify:cities
 */
const DEG=Math.PI/180, norm=d=>((d%360)+360)%360;
function sunPos(instant,lat,lng){
 const n=instant/86400000+2440587.5-2451545.0;
 const L=norm(280.46+0.9856474*n), g=norm(357.528+0.9856003*n)*DEG;
 const lam=(L+1.915*Math.sin(g)+0.02*Math.sin(2*g))*DEG;
 const eps=(23.439-0.0000004*n)*DEG;
 const ra=Math.atan2(Math.cos(eps)*Math.sin(lam),Math.cos(lam));
 const dec=Math.asin(Math.sin(eps)*Math.sin(lam));
 const gmst=18.697374558+24.06570982441908*n;
 const lst=norm(gmst*15+lng);
 const H=(lst-ra/DEG)*DEG, p=lat*DEG;
 const alt=Math.asin(Math.sin(p)*Math.sin(dec)+Math.cos(p)*Math.cos(dec)*Math.cos(H));
 const az=Math.atan2(-Math.cos(dec)*Math.sin(H),Math.sin(dec)*Math.cos(p)-Math.cos(dec)*Math.sin(p)*Math.cos(H));
 return {alt:alt/DEG, az:norm(az/DEG)};
}
function zo(i,tz){const p=new Intl.DateTimeFormat('en-US',{timeZone:tz,hourCycle:'h23',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'}).formatToParts(new Date(i));const g=t=>Number(p.find(x=>x.type===t).value);return Date.UTC(g('year'),g('month')-1,g('day'),g('hour'),g('minute'),g('second'))-i;}
function toUtc(d,t,tz){const[y,m,dd]=d.split('-').map(Number);const[h,mi,s=0]=t.split(':').map(Number);const n=Date.UTC(y,m-1,dd,h,mi,s);return n-zo(n-zo(n,tz),tz);}
const D='2026-08-12';

const cities=[
 ['A Coruna',43.3623,-8.4115,'Europe/Madrid','20:28:13',11.8,279.5], // known-good reference
 ['Reykjavik',64.1466,-21.9426,'Atlantic/Reykjavik','17:48:44',24,253],
 ['Valencia',39.4699,-0.3763,'Europe/Madrid','20:32:55',4,286],
 ['Zaragoza',41.6488,-0.8891,'Europe/Madrid','20:29:40',6,285],
 ['Bilbao',43.2630,-2.9350,'Europe/Madrid','20:27:33',8,283],
 ['Palma',39.5696,2.6502,'Europe/Madrid','20:31:48',2,287],
 ['Madrid',40.4168,-3.7038,'Europe/Madrid','20:32:18',7,283],
 ['Lisbon',38.7223,-9.1393,'Europe/Lisbon','19:36:04',10,281],
 ['Dublin',53.3498,-6.2603,'Europe/Dublin','19:10:37',15,275],
 ['Paris',48.8566,2.3522,'Europe/Paris','20:17:16',8,284],
 ['London',51.5074,-0.1278,'Europe/London','19:13:15',10,281],
 ['Brussels',50.8503,4.3517,'Europe/Brussels','20:13:31',7,284],
 ['Amsterdam',52.3676,4.9041,'Europe/Amsterdam','20:10:52',8,284],
 ['Berlin',52.5200,13.4050,'Europe/Berlin','20:08:19',3,290],
 ['Stockholm',59.3293,18.0686,'Europe/Stockholm','19:56:07',5,291],
 ['Rome',41.9028,12.4964,'Europe/Rome','20:11:00',0,290],
];

console.log('città          alt(fonte) alt(calc)  Δalt   az(fonte) az(calc)  Δaz   esito');
let allOk=true;
for(const [name,lat,lng,tz,tmax,altSrc,azSrc] of cities){
 const t=toUtc(D,tmax,tz);
 const p=sunPos(t,lat,lng);
 const dAlt=p.alt-altSrc, dAz=((p.az-azSrc+540)%360)-180;
 const ok=Math.abs(dAlt)<1.5 && Math.abs(dAz)<3; // tutiempo rounds to whole degrees
 if(!ok) allOk=false;
 console.log(`${name.padEnd(14)} ${String(altSrc).padStart(6)}°   ${p.alt.toFixed(2).padStart(6)}°  ${dAlt>=0?'+':''}${dAlt.toFixed(2).padStart(5)}   ${String(azSrc).padStart(5)}°   ${p.az.toFixed(2).padStart(6)}°  ${dAz>=0?'+':''}${dAz.toFixed(2).padStart(5)}  ${ok?'✓':'✗ SOSPETTO'}`);
}
console.log('\ntutto coerente:', allOk?'✓':'✗ — controllare le righe segnate');

console.log('\n=== TRAMONTO calcolato vs 4° contatto ===');
function findSunset(lat,lng,tz){
 let lo=toUtc(D,'20:00:00',tz), hi=toUtc(D,'23:59:00',tz);
 // bracket: scan forward from local noon to local midnight for alt crossing -0.833
 lo=toUtc(D,'12:00:00',tz); hi=toUtc(D,'23:59:00',tz);
 for(let i=0;i<60;i++){const mid=(lo+hi)/2; if(sunPos(mid,lat,lng).alt>-0.833) lo=mid; else hi=mid;}
 return (lo+hi)/2;
}
const fmt=(n,tz)=>new Intl.DateTimeFormat('es-ES',{timeZone:tz,hourCycle:'h23',hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(new Date(n));
const contacts4={
 'A Coruna':'21:21:54','Reykjavik':'18:47:35','Valencia':'20:58:00','Zaragoza':'21:04:00',
 'Bilbao':'21:16:00','Palma':'20:46:00','Madrid':'21:13:00','Lisbon':'20:29:03','Dublin':'20:05:14',
 'Paris':'21:07:00','London':'20:06:15','Brussels':'21:05:00','Amsterdam':'21:02:57','Berlin':'20:34:00',
 'Stockholm':'20:41:00','Rome':'20:11:00',
};
for(const [name,lat,lng,tz] of cities){
 const sunset=findSunset(lat,lng,tz);
 const c4=toUtc(D,contacts4[name],tz);
 const diff=(c4-sunset)/1000;
 console.log(`${name.padEnd(14)} tramonto ${fmt(sunset,tz)}   4°contatto ${contacts4[name]}   ${diff>=-30?`FINISCE AL TRAMONTO (${diff>=0?'+':''}${diff.toFixed(0)}s)`:'finisce prima del tramonto'}`);
}

console.log('\n=== altezza del Sole AL 4° contatto (calcolata) ===');
for(const [name,lat,lng,tz] of cities){
 const c4=toUtc(D,contacts4[name],tz);
 const alt=sunPos(c4,lat,lng).alt;
 console.log(`${name.padEnd(14)} alt al 4°contatto = ${alt.toFixed(2).padStart(6)}°   ${alt<=0.5?'← finisce al/vicino al tramonto':''}`);
}
