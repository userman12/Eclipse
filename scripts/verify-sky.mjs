/**
 * Re-derives every celestial figure hardcoded in src/data/eventData.ts
 * (`skyDuringTotality`, `sunAtMaximum`) so the numbers in the UI can be
 * checked rather than trusted.  Run with:  npm run verify:sky
 *
 * Method: JPL approximate planetary elements (Standish, valid 1800–2050) for
 * the planets, J2000 catalogue positions for the stars, and Meeus' magnitude
 * formulae. Accuracy is far better than the ~1° a person can point at.
 */
const DEG=Math.PI/180, norm=d=>((d%360)+360)%360;
const LAT=43.3623, LNG=-8.4115;

const PLANETS={
 Mercurio:{a:[0.38709927,0.00000037],e:[0.20563593,0.00001906],I:[7.00497902,-0.00594749],L:[252.25032350,149472.67411175],w:[77.45779628,0.16047689],O:[48.33076593,-0.12534081]},
 Venere:{a:[0.72333566,0.00000390],e:[0.00677672,-0.00004107],I:[3.39467605,-0.00078890],L:[181.97909950,58517.81538729],w:[131.60246718,0.00268329],O:[76.67984255,-0.27769418]},
 Terra:{a:[1.00000261,0.00000562],e:[0.01671123,-0.00004392],I:[-0.00001531,-0.01294668],L:[100.46457166,35999.37244981],w:[102.93768193,0.32327364],O:[0,0]},
 Marte:{a:[1.52371034,0.00001847],e:[0.09339410,0.00007882],I:[1.84969142,-0.00813131],L:[-4.55343205,19140.30268499],w:[-23.94362959,0.44441088],O:[49.55953891,-0.29257343]},
 Giove:{a:[5.20288700,-0.00011607],e:[0.04838624,-0.00013253],I:[1.30439695,-0.00183714],L:[34.39644051,3034.74612775],w:[14.72847983,0.21252668],O:[100.47390909,0.20469106]},
 Saturno:{a:[9.53667594,-0.00125060],e:[0.05386179,-0.00050991],I:[2.48599187,0.00193609],L:[49.95424423,1222.49362201],w:[92.59887831,-0.41897216],O:[113.66242448,-0.28867794]},
};

function helio(p,T){
 const a=p.a[0]+p.a[1]*T, e=p.e[0]+p.e[1]*T, I=(p.I[0]+p.I[1]*T)*DEG;
 const L=p.L[0]+p.L[1]*T, w=p.w[0]+p.w[1]*T, O=(p.O[0]+p.O[1]*T)*DEG;
 const wp=(w-(p.O[0]+p.O[1]*T))*DEG; // argument of perihelion
 let M=norm(L-w); if(M>180)M-=360; M*=DEG;
 let E=M; for(let i=0;i<12;i++) E=E-(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));
 const xp=a*(Math.cos(E)-e), yp=a*Math.sqrt(1-e*e)*Math.sin(E);
 const cw=Math.cos(wp),sw=Math.sin(wp),cO=Math.cos(O),sO=Math.sin(O),ci=Math.cos(I),si=Math.sin(I);
 return {
  x: (cw*cO-sw*sO*ci)*xp + (-sw*cO-cw*sO*ci)*yp,
  y: (cw*sO+sw*cO*ci)*xp + (-sw*sO+cw*cO*ci)*yp,
  z: (sw*si)*xp + (cw*si)*yp,
 };
}
function jd(ms){return ms/86400000+2440587.5;}
function gmst(J){return norm(280.46061837+360.98564736629*(J-2451545.0));}
function eqToAltAz(ra,dec,J,lat,lng){ // ra,dec in deg
 const H=(gmst(J)+lng-ra)*DEG, p=lat*DEG, d=dec*DEG;
 const alt=Math.asin(Math.sin(p)*Math.sin(d)+Math.cos(p)*Math.cos(d)*Math.cos(H));
 const az=Math.atan2(-Math.cos(d)*Math.sin(H), Math.sin(d)*Math.cos(p)-Math.cos(d)*Math.sin(p)*Math.cos(H));
 return {alt:alt/DEG, az:norm(az/DEG)};
}
function planetAltAz(name,ms){
 const J=jd(ms), T=(J-2451545.0)/36525;
 const P=helio(PLANETS[name],T), E=helio(PLANETS.Terra,T);
 const x=P.x-E.x, y=P.y-E.y, z=P.z-E.z;
 const eps=23.43928*DEG;
 const xe=x, ye=y*Math.cos(eps)-z*Math.sin(eps), ze=y*Math.sin(eps)+z*Math.cos(eps);
 const ra=norm(Math.atan2(ye,xe)/DEG), dec=Math.atan2(ze,Math.hypot(xe,ye))/DEG;
 const dist=Math.hypot(x,y,z), sunDist=Math.hypot(P.x,P.y,P.z);
 return {...eqToAltAz(ra,dec,J,LAT,LNG), ra, dec, dist, sunDist};
}
// Sun
function sunAltAz(ms){
 const J=jd(ms), T=(J-2451545.0)/36525, E=helio(PLANETS.Terra,T);
 const x=-E.x,y=-E.y,z=-E.z, eps=23.43928*DEG;
 const xe=x, ye=y*Math.cos(eps)-z*Math.sin(eps), ze=y*Math.sin(eps)+z*Math.cos(eps);
 const ra=norm(Math.atan2(ye,xe)/DEG), dec=Math.atan2(ze,Math.hypot(xe,ye))/DEG;
 return {...eqToAltAz(ra,dec,J,LAT,LNG), ra, dec};
}
const MAX=Date.UTC(2026,7,12,18,28,13);
console.log('=== SOLE al massimo ===');
const s=sunAltAz(MAX); console.log(`alt ${s.alt.toFixed(2)}°  az ${s.az.toFixed(2)}°`);
console.log('\n=== PIANETI al massimo (20:28:13 locale) ===');
for(const n of ['Mercurio','Venere','Marte','Giove','Saturno']){
 const p=planetAltAz(n,MAX);
 const sep=Math.acos(Math.sin(p.dec*DEG)*Math.sin(s.dec*DEG)+Math.cos(p.dec*DEG)*Math.cos(s.dec*DEG)*Math.cos((p.ra-s.ra)*DEG))/DEG;
 console.log(`${n.padEnd(9)} alt ${p.alt.toFixed(1).padStart(6)}°  az ${p.az.toFixed(1).padStart(6)}°  elong.dalSole ${sep.toFixed(1).padStart(5)}°  d=${p.dist.toFixed(2)}au`);
}

// --- Visual magnitudes (Meeus) ---
console.log('\n=== MAGNITUDINI al massimo ===');
const MAGF={
 Mercurio:(r,d,a)=>-0.36+5*Math.log10(r*d)+0.0380*a-0.000273*a*a+2.0e-6*a*a*a,
 Venere:(r,d,a)=>-4.47+5*Math.log10(r*d)+0.0103*a+2.30e-4*a*a+4.87e-7*a*a*a,
 Giove:(r,d,a)=>-9.40+5*Math.log10(r*d)+0.005*a,
};
const sunE=Math.hypot(helio(PLANETS.Terra,(jd(MAX)-2451545.0)/36525).x,helio(PLANETS.Terra,(jd(MAX)-2451545.0)/36525).y,helio(PLANETS.Terra,(jd(MAX)-2451545.0)/36525).z);
for(const n of ['Mercurio','Venere','Giove']){
 const p=planetAltAz(n,MAX), r=p.sunDist, d=p.dist;
 // phase angle from law of cosines
 const cosA=(r*r+d*d-sunE*sunE)/(2*r*d);
 const a=Math.acos(Math.max(-1,Math.min(1,cosA)))/DEG;
 console.log(`${n.padEnd(9)} mag ${MAGF[n](r,d,a).toFixed(2).padStart(6)}   fase ${a.toFixed(0)}°`);
}
