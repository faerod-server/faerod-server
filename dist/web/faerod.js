(()=>{var Df=Object.defineProperty;var Ol=(i,t,e)=>()=>{if(e)throw e[0];try{return i&&(t=i(i=0)),t}catch(n){throw e=[n],n}};var Nf=(i,t)=>{for(var e in t)Df(i,e,{get:t[e],enumerable:!0})};function ii(i,t=0){let e=Math.imul(i|0,374761393)+Math.imul(t|0,668265263)|0;return e=Math.imul(e^e>>>13,1274126177),(e^e>>>16)>>>0}function zd(i){let t=new DataView(i),e=new TextDecoder;if(String.fromCharCode(t.getUint8(0),t.getUint8(1),t.getUint8(2),t.getUint8(3))!=="FRG1")throw new Error("region.bin: bad magic");let s={center:{lat:t.getFloat64(8,!0),lon:t.getFloat64(16,!0)},buildings:[],roads:[],areas:[],points:[],strings:[],places:[],hm:null},r=t.getUint32(24,!0),o=32,a=c=>{let h=new Float32Array(c*2);for(let d=0;d<c*2;d++)h[d]=t.getInt16(o,!0)*.5,o+=2;return h},l=c=>{let h=1/0,d=1/0,u=-1/0,m=-1/0;for(let g=0;g<c.pts.length;g+=2)h=Math.min(h,c.pts[g]),d=Math.min(d,c.pts[g+1]),u=Math.max(u,c.pts[g]),m=Math.max(m,c.pts[g+1]);return c.minX=h,c.minZ=d,c.maxX=u,c.maxZ=m,c};for(let c=0;c<r;c++){let h=t.getUint32(o,!0),d=t.getUint32(o+4,!0),u=o+8;if(o=u,h===1){let m=t.getUint32(o,!0);o+=4;for(let g=0;g<m;g++){let x={id:g,kind:t.getUint8(o),levels:t.getUint8(o+1),heightDm:t.getUint16(o+2,!0),minDm:t.getUint16(o+4,!0),roof:t.getUint8(o+6),color:t.getUint8(o+7)},f=t.getUint16(o+8,!0);o+=10,x.pts=a(f),x.height=zy(x,g),s.buildings.push(l(x))}}else if(h===2){let m=t.getUint32(o,!0);o+=4;for(let g=0;g<m;g++){let x={id:g,kind:t.getUint8(o),lanes:t.getUint8(o+1),width:t.getUint8(o+2)*.25,flags:t.getUint8(o+3),nameIdx:t.getUint16(o+4,!0)},f=t.getUint16(o+6,!0);o+=8,x.pts=a(f),x.width||(x.width=ky[x.kind]??6),s.roads.push(l(x))}}else if(h===3){let m=t.getUint32(o,!0);o+=4;for(let g=0;g<m;g++){let x={id:g,kind:t.getUint8(o)},f=t.getUint16(o+2,!0);o+=4,x.pts=a(f),s.areas.push(l(x))}}else if(h===4){let m=t.getUint32(o,!0);o+=4;for(let g=0;g<m;g++)s.points.push({kind:t.getUint8(o),x:t.getInt16(o+2,!0)*.5,z:t.getInt16(o+4,!0)*.5}),o+=6}else if(h===5){let m=t.getUint32(o,!0);o+=4;for(let g=0;g<m;g++){let x=t.getUint16(o,!0);o+=2,s.strings.push(e.decode(new Uint8Array(i,o,x))),o+=x}}else if(h===6){let m=t.getUint32(o,!0);o+=4;for(let g=0;g<m;g++)s.places.push({nameIdx:t.getUint16(o,!0),x:t.getInt16(o+2,!0)*.5,z:t.getInt16(o+4,!0)*.5,buildings:t.getUint16(o+6,!0)}),o+=8}else if(h===7){let m=t.getUint16(o,!0),g=t.getUint16(o+2,!0),x={w:m,h:g,x0:t.getFloat32(o+4,!0),z0:t.getFloat32(o+8,!0),cell:t.getFloat32(o+12,!0),min:t.getFloat32(o+16,!0),scale:t.getFloat32(o+20,!0)};o+=24,x.data=new Float32Array(m*g);for(let f=0;f<m*g;f++)x.data[f]=x.min+t.getUint16(o,!0)*x.scale,o+=2;s.hm=x}o=u+d}for(let c of s.places)c.name=s.strings[c.nameIdx]||"";for(let c of s.roads)c.name=c.nameIdx!==65535&&s.strings[c.nameIdx]||"";return s}function zy(i,t){if(i.heightDm)return i.heightDm/10;if(i.levels)return i.levels*3+(i.kind===pe.APARTMENTS?1.2:.6);let e=ii(t,77)%1e3/1e3;switch(i.kind){case pe.APARTMENTS:return(5+Math.floor(e*4))*3+1.2;case pe.HOUSE:return(1+Math.floor(e*2))*3+.6;case pe.COMMERCIAL:return(2+Math.floor(e*3))*3.6;case pe.INDUSTRIAL:return 7+e*5;case pe.SCHOOL:return 3*3.4;case pe.RELIGIOUS:return 10;case pe.HOSPITAL:return 5*3.5;case pe.SMALL:return 3;case pe.HOTEL:return 21;case pe.PUBLIC:return 3*3.6;default:{let n=0;for(let s=0,r=i.pts.length;s<r;s+=2){let o=(s+2)%r;n+=i.pts[s]*i.pts[o+1]-i.pts[o]*i.pts[s+1]}return n=Math.abs(n)/2,n<40?3:n<120?(1+Math.floor(e*2))*3+.6:(4+Math.floor(e*4))*3+1.2}}}function Hd(i){if(i.levels)return i.levels;let t=i.kind===pe.COMMERCIAL?3.6:3;return Math.max(1,Math.round((i.height-.6)/t))}function Vd(i,t=200){let n=Math.ceil(21200/t),s=new Map,r=(o,a,l)=>{let c=Math.max(0,Math.floor((a.minX+10600)/t)),h=Math.min(n-1,Math.floor((a.maxX+10600)/t)),d=Math.max(0,Math.floor((a.minZ+10600)/t)),u=Math.min(n-1,Math.floor((a.maxZ+10600)/t));for(let m=d;m<=u;m++)for(let g=c;g<=h;g++){let x=m*n+g,f=s.get(x);f||s.set(x,f={b:[],r:[],a:[],p:[]}),f[o].push(l)}};return i.buildings.forEach((o,a)=>r("b",o,a)),i.roads.forEach((o,a)=>r("r",o,a)),i.areas.forEach((o,a)=>r("a",o,a)),i.points.forEach((o,a)=>r("p",{minX:o.x,maxX:o.x,minZ:o.z,maxZ:o.z},a)),{query(o,a,l,c){let h={b:new Set,r:new Set,a:new Set,p:new Set},d=Math.max(0,Math.floor((o+10600)/t)),u=Math.min(n-1,Math.floor((l+10600)/t)),m=Math.max(0,Math.floor((a+10600)/t)),g=Math.min(n-1,Math.floor((c+10600)/t));for(let x=m;x<=g;x++)for(let f=d;f<=u;f++){let p=s.get(x*n+f);if(p)for(let y of["b","r","a","p"])for(let S of p[y])h[y].add(S)}return{b:[...h.b].sort((x,f)=>x-f),r:[...h.r].sort((x,f)=>x-f),a:[...h.a].sort((x,f)=>x-f),p:[...h.p].sort((x,f)=>x-f)}}}}function Zs(i,t,e){let n=i.hm;if(!n)return 0;let s=Math.max(0,Math.min(n.w-1.001,(t-n.x0)/n.cell)),r=Math.max(0,Math.min(n.h-1.001,(e-n.z0)/n.cell)),o=Math.floor(s),a=Math.floor(r),l=s-o,c=r-a,h=n.data,d=n.w,u=h[a*d+o],m=h[a*d+o+1],g=h[(a+1)*d+o],x=h[(a+1)*d+o+1];return(u*(1-l)+m*l)*(1-c)+(g*(1-l)+x*l)*c}function Oi(i,t,e){let n=!1;for(let s=0,r=i.length/2,o=r-1;s<r;o=s++){let a=i[s*2],l=i[s*2+1],c=i[o*2],h=i[o*2+1];l>e!=h>e&&t<(c-a)*(e-l)/(h-l)+a&&(n=!n)}return n}function hh(i){let t=0;for(let e=0,n=i.length;e<n;e+=2){let s=(e+2)%n;t+=i[e]*i[s+1]-i[s]*i[e+1]}return t/2}var pe,Ge,sn,ch,ky,Kr=Ol(()=>{pe={GENERIC:0,APARTMENTS:1,HOUSE:2,COMMERCIAL:3,INDUSTRIAL:4,SCHOOL:5,RELIGIOUS:6,HOSPITAL:7,SMALL:8,CONSTRUCTION:9,PUBLIC:10,HOTEL:11},Ge={MOTORWAY:0,TRUNK:1,PRIMARY:2,SECONDARY:3,TERTIARY:4,RESIDENTIAL:5,SERVICE:6,TRACK:7,FOOTWAY:8,RAIL:10,WALL:30,FENCE:31},sn={PARK:0,GRASS:1,FOREST:2,FARM:3,WATER:4,PARKING:5,PITCH:6,RESIDENTIAL:7,COMMERCIAL:8,INDUSTRIAL:9,SCHOOL:10,CEMETERY:11,CONSTRUCTION:12,SCRUB:13},ch={TREE:0,SIGNALS:1,LAMP:2,BUS_STOP:3,CROSSING:4,BENCH:5,SHOP:6,FOOD:7,PHARMACY:8,BANK:9,FUEL:10},ky={0:22,1:18,2:16,3:12,4:9,5:7,6:4.5,7:3.5,8:2.2,10:4,30:.3,31:.1}});var Ae,Ne,Gn,Gd,ul,Ks=Ol(()=>{Ae={radius:.38,height:1.8,crouchHeight:1.25,eye:1.64,crouchEye:1.16,gravity:20,jumpSpeed:6.4,accel:55,airAccel:10,friction:7,stopSpeed:2,walkMul:.52,crouchMul:.34,stepHeight:.45},Ne={bomb:{id:"bomb",name:{tr:"Bomba Senaryosu",en:"Bomb Defusal"},rounds:!0,teams:!0,respawn:!1},tdm:{id:"tdm",name:{tr:"Tak\u0131m \xD6l\xFCm Ma\xE7\u0131",en:"Team Deathmatch"},rounds:!1,teams:!0,respawn:!0},dm:{id:"dm",name:{tr:"Herkes Tek (FFA)",en:"Deathmatch (FFA)"},rounds:!1,teams:!1,respawn:!0},gungame:{id:"gungame",name:{tr:"Silah Yar\u0131\u015F\u0131",en:"Gun Game"},rounds:!1,teams:!1,respawn:!0}},Gn={T:{tr:"Sald\u0131r\u0131 Timi",en:"Attackers"},CT:{tr:"Savunma Timi",en:"Defenders"},SPEC:{tr:"\u0130zleyici",en:"Spectator"}},Gd={name:{type:"string",def:"Faerod Odas\u0131",max:32},mode:{type:"enum",def:"bomb",values:Object.keys(Ne)},maxPlayers:{type:"int",def:10,min:2,max:16},password:{type:"string",def:"",max:24},isPublic:{type:"bool",def:!0},mapX:{type:"num",def:0,min:-9800,max:9800},mapZ:{type:"num",def:0,min:-9800,max:9800},mapName:{type:"string",def:"\xD6zl\xFCce",max:40},mapSize:{type:"enum",def:"medium",values:["small","medium","large"]},maxRounds:{type:"enum",def:16,values:[8,12,16,24,30]},roundTime:{type:"int",def:115,min:60,max:300},freezeTime:{type:"int",def:8,min:0,max:20},buyTime:{type:"int",def:20,min:5,max:60},bombTime:{type:"int",def:40,min:25,max:60},startMoney:{type:"int",def:800,min:800,max:16e3},timeLimit:{type:"int",def:10,min:3,max:30},killLimit:{type:"int",def:50,min:10,max:200},friendlyFire:{type:"bool",def:!1},autoBalance:{type:"bool",def:!0},bots:{type:"int",def:4,min:0,max:14},botLevel:{type:"enum",def:"normal",values:["easy","normal","hard"]},timeOfDay:{type:"enum",def:"day",values:["day","evening","night"]},weather:{type:"enum",def:"clear",values:["clear","cloudy","fog"]}},ul={small:170,medium:240,large:340}});var Yd={};Nf(Yd,{addProps:()=>xh,buildArena:()=>gh,cellsAround:()=>ml,collideCircle:()=>yh,groundAt:()=>vh,raycast:()=>gl,visible:()=>xl});function gh(i,t,{cx:e,cz:n,size:s}){e=Math.round(e*2)/2,n=Math.round(n*2)/2;let r=typeof s=="number"?s:ul[s]||240,o=r/2,a=Zs(i,e,n),l=(f,p)=>Zs(i,e+f,n+p)-a,c=o+Gy,h=t.query(e-c,n-c,e+c,n+c),d=f=>{let p=new Float32Array(f.length);for(let y=0;y<f.length;y+=2)p[y]=f[y]-e,p[y+1]=f[y+1]-n;return p},u={cx:e,cz:n,size:r,half:o,baseElev:a,ground:l,buildings:[],barriers:[],roads:[],areas:[],points:[],segs:[],props:[],cells:new Map,cellSize:Je};for(let f of h.b){let p=i.buildings[f],y=d(p.pts),S=1/0,v=-1/0;for(let I=0;I<y.length;I+=2){let P=l(y[I],y[I+1]);S=Math.min(S,P),v=Math.max(v,P)}let b=1/0,E=1/0,R=-1/0,_=-1/0;for(let I=0;I<y.length;I+=2)b=Math.min(b,y[I]),R=Math.max(R,y[I]),E=Math.min(E,y[I+1]),_=Math.max(_,y[I+1]);let T=S-.4,A=Math.abs(hh(y));u.buildings.push({id:f,kind:p.kind,roof:p.roof,color:p.color,pts:y,base:T,ground:(S+v)/2,height:p.height,top:v+p.height,levels:Hd(p),area:A,minX:b,minZ:E,maxX:R,maxZ:_,ccw:hh(y)>0})}for(let f of h.r){let p=i.roads[f],y=d(p.pts);p.kind===Ge.WALL||p.kind===Ge.FENCE?u.barriers.push({id:f,kind:p.kind,pts:y,height:p.kind===Ge.WALL?1.9:1.6}):p.flags&4||u.roads.push({id:f,kind:p.kind,width:p.width,lanes:p.lanes,flags:p.flags,name:p.name,pts:y})}for(let f of h.a){let p=i.areas[f];u.areas.push({id:f,kind:p.kind,pts:d(p.pts)})}for(let f of h.p){let p=i.points[f];u.points.push({kind:p.kind,x:p.x-e,z:p.z-n})}let m=(f,p)=>f*73856093^p*19349663,g=(f,p,y,S,v,b)=>{for(let E=Math.floor(y/Je);E<=Math.floor(v/Je);E++)for(let R=Math.floor(p/Je);R<=Math.floor(S/Je);R++){let _=m(R,E),T=u.cells.get(_);T||u.cells.set(_,T={s:[],b:[],p:[]}),T[f].push(b)}};u.cellKey=m,u.cellAdd=g;let x=(f,p,y,S,v,b,E)=>{let R=y-f,_=S-p,T=Math.hypot(R,_);if(T<.01)return;let A={ax:f,az:p,bx:y,bz:S,len:T,ux:R/T,uz:_/T,base:v,top:b,bld:E},I=u.segs.length;u.segs.push(A),g("s",Math.min(f,y),Math.min(p,S),Math.max(f,y),Math.max(p,S),I)};u.buildings.forEach((f,p)=>{let y=f.pts,S=y.length/2;for(let v=0;v<S;v++){let b=(v+1)%S;x(y[v*2],y[v*2+1],y[b*2],y[b*2+1],f.base,f.top,p)}g("b",f.minX,f.minZ,f.maxX,f.maxZ,p)});for(let f of u.barriers){let p=f.pts;for(let y=0;y+3<p.length;y+=2){let S=Math.min(l(p[y],p[y+1]),l(p[y+2],p[y+3]));x(p[y],p[y+1],p[y+2],p[y+3],S-.3,S+f.height,-1)}}return u}function xh(i,t){for(let e of t){let n=i.props.length;e.cos=Math.cos(e.a||0),e.sin=Math.sin(e.a||0),e.r?(e.bx=e.r,e.bz=e.r):(e.bx=Math.abs(e.hx*e.cos)+Math.abs(e.hz*e.sin),e.bz=Math.abs(e.hx*e.sin)+Math.abs(e.hz*e.cos)),i.props.push(e),e.solid!==!1&&i.cellAdd("p",e.x-e.bx,e.z-e.bz,e.x+e.bx,e.z+e.bz,n)}}function ml(i,t,e,n,s){let r=[];for(let o=Math.floor(e/Je);o<=Math.floor(s/Je);o++)for(let a=Math.floor(t/Je);a<=Math.floor(n/Je);a++){let l=i.cells.get(i.cellKey(a,o));l&&r.push(l)}return r}function qd(i,t,e){let n=t-i.x,s=e-i.z;return[n*i.cos+s*i.sin,-n*i.sin+s*i.cos]}function yh(i,t,e,n,s,r,o=.45){for(let a=0;a<4;a++){let l=!1,c=new Set,h=new Set;for(let d of ml(i,t-n,e-n,t+n,e+n)){for(let u of d.s){if(c.has(u))continue;c.add(u);let m=i.segs[u];if(s>=m.top-.02||r<=m.base)continue;let g=(t-m.ax)*m.ux+(e-m.az)*m.uz;g=Math.max(0,Math.min(m.len,g));let x=m.ax+m.ux*g,f=m.az+m.uz*g,p=t-x,y=e-f,S=p*p+y*y;if(S<n*n){let v=Math.sqrt(S);v<1e-5&&(p=-m.uz,y=m.ux,v=1),t=x+p/v*n,e=f+y/v*n,l=!0}}for(let u of d.p){if(h.has(u))continue;h.add(u);let m=i.props[u];if(!(s>=m.y1-o||r<=m.y0))if(m.r){let g=t-m.x,x=e-m.z,f=Math.hypot(g,x),p=n+m.r;if(f<p){let y=f<1e-5?1:f;t=m.x+g/y*p,e=m.z+x/y*p,l=!0}}else{let[g,x]=qd(m,t,e),f=Math.max(-m.hx,Math.min(m.hx,g)),p=Math.max(-m.hz,Math.min(m.hz,x)),y=g-f,S=x-p,v=y*y+S*S;if(v<n*n){let b,E;if(v<1e-8){let R=m.hx-Math.abs(g),_=m.hz-Math.abs(x);R<_?(b=Math.sign(g||1)*(m.hx+n),E=x):(b=g,E=Math.sign(x||1)*(m.hz+n))}else{let R=Math.sqrt(v);b=f+y/R*n,E=p+S/R*n}t=m.x+b*m.cos-E*m.sin,e=m.z+b*m.sin+E*m.cos,l=!0}}}}if(!l)break}for(let a of ml(i,t,e,t,e))for(let l of a.b){let c=i.buildings[l];if(t>c.minX&&t<c.maxX&&e>c.minZ&&e<c.maxZ&&s<c.top&&Oi(c.pts,t,e)){let[h,d]=Wy(c.pts,t,e),u=h-t,m=d-e,g=Math.hypot(u,m)||1;t=h+u/g*(n+.01),e=d+m/g*(n+.01)}}return[t,e]}function Wy(i,t,e){let n=1/0,s=t,r=e;for(let o=0,a=i.length/2;o<a;o++){let l=(o+1)%a,c=i[o*2],h=i[o*2+1],d=i[l*2],u=i[l*2+1],m=d-c,g=u-h,x=m*m+g*g||1,f=Math.max(0,Math.min(1,((t-c)*m+(e-h)*g)/x)),p=c+m*f,y=h+g*f,S=(p-t)**2+(y-e)**2;S<n&&(n=S,s=p,r=y)}return[s,r]}function vh(i,t,e,n,s,r=.45){let o=i.ground(t,e);for(let a of ml(i,t-n,e-n,t+n,e+n))for(let l of a.p){let c=i.props[l];if(c.y1>s+r||c.y1<=o)continue;let h;if(c.r)h=Math.hypot(t-c.x,e-c.z)<n+c.r;else{let[d,u]=qd(c,t,e);h=Math.abs(d)<c.hx+n*.7&&Math.abs(u)<c.hz+n*.7}h&&(o=c.y1)}return o}function gl(i,t,e,n,s,r,o,a){let l=a,c=null,h=Math.hypot(s,o),d=new Set,u=new Set,m=new Set,g=A=>{for(let I of A.s){if(d.has(I))continue;d.add(I);let P=i.segs[I],N=P.bx-P.ax,L=P.bz-P.az,F=s*L-o*N;if(Math.abs(F)<1e-9)continue;let H=P.ax-t,W=P.az-n,Q=(H*L-W*N)/F,q=(H*o-W*s)/F;if(Q<0||Q>=l||q<0||q>1)continue;let K=e+r*Q;if(K<P.base||K>P.top)continue;l=Q;let j=-P.uz,st=P.ux;j*s+st*o>0&&(j=-j,st=-st),c={t:Q,nx:j,ny:0,nz:st,what:P.bld>=0?"building":"barrier",id:P.bld}}for(let I of A.b){if(m.has(I)||r>=0)continue;m.add(I);let P=i.buildings[I],N=(P.top-e)/r;if(N<0||N>=l)continue;let L=t+s*N,F=n+o*N;L<P.minX||L>P.maxX||F<P.minZ||F>P.maxZ||!Oi(P.pts,L,F)||(l=N,c={t:N,nx:0,ny:1,nz:0,what:"building",id:I})}for(let I of A.p){if(u.has(I))continue;u.add(I);let P=i.props[I];if(P.bulletproof===!1)continue;let N=P.r?qy(P,t,e,n,s,r,o):Xy(P,t,e,n,s,r,o);N&&N.t<l&&(l=N.t,c={...N,what:"prop",id:I})}},x=Math.floor(t/Je),f=Math.floor(n/Je),p=Math.sign(s),y=Math.sign(o),S=p?Math.abs(Je/(s||1e-9)):1/0,v=y?Math.abs(Je/(o||1e-9)):1/0,b=p>0?((x+1)*Je-t)/s:p<0?(x*Je-t)/s:1/0,E=y>0?((f+1)*Je-n)/o:y<0?(f*Je-n)/o:1/0,R=0;for(let A=0;A<400;A++){let I=i.cells.get(i.cellKey(x,f));if(I&&g(I),h<1e-6)break;let P=Math.min(b,E);if(P>l||P>a)break;R=P,b<E?(x+=p,b+=S):(f+=y,E+=v)}let _=1.5,T=0;for(let A=.2;A<l;A+=_){let I=t+s*A,P=e+r*A,N=n+o*A;if(P<i.ground(I,N)){let L=T,F=A;for(let H=0;H<8;H++){let W=(L+F)/2;e+r*W<i.ground(t+s*W,n+o*W)?F=W:L=W}l=F,c={t:F,nx:0,ny:1,nz:0,what:"ground",id:-1};break}T=A}return c}function Xy(i,t,e,n,s,r,o){let a=t-i.x,l=n-i.z,c=a*i.cos+l*i.sin,h=-a*i.sin+l*i.cos,d=s*i.cos+o*i.sin,u=-s*i.sin+o*i.cos,m=0,g=1/0,x=-1,f=0,p=(b,E,R,_,T)=>{if(Math.abs(E)<1e-9)return b>=R&&b<=_;let A=(R-b)/E,I=(_-b)/E,P=-1;if(A>I){let N=A;A=I,I=N,P=1}return A>m&&(m=A,x=T,f=P),g=Math.min(g,I),m<=g};if(!p(c,d,-i.hx,i.hx,0)||!p(e,r,i.y0,i.y1,1)||!p(h,u,-i.hz,i.hz,2)||m<=0)return null;let y=0,S=0,v=0;return x===0?y=f:x===1?S=f:v=f,y*d+S*r+v*u>0&&(y=-y,S=-S,v=-v),{t:m,nx:y*i.cos-v*i.sin,ny:S,nz:y*i.sin+v*i.cos}}function qy(i,t,e,n,s,r,o){let a=t-i.x,l=n-i.z,c=s*s+o*o,h=2*(a*s+l*o),d=a*a+l*l-i.r*i.r,u=h*h-4*c*d;if(u<0||c<1e-9)return null;let m=(-h-Math.sqrt(u))/(2*c);if(m<=0)return null;let g=e+r*m;if(g<i.y0||g>i.y1)return null;let x=a+s*m,f=l+o*m,p=Math.hypot(x,f)||1;return{t:m,nx:x/p,ny:0,nz:f/p}}function xl(i,t,e,n,s,r,o){let a=s-t,l=r-e,c=o-n,h=Math.hypot(a,l,c);return h<.001?!0:!gl(i,t,e,n,a/h,l/h,c/h,h-.05)}var Je,Gy,jr=Ol(()=>{Kr();Ks();Je=4,Gy=45});var bu=0,yc=1,Su=2;var Ki=1,fa=2,Hs=3,Pi=0,Ke=1,En=2,Qn=0,Ii=1,ti=2,vc=3,_c=4,wu=5;var Ji=100,Tu=101,Eu=102,Au=103,Ru=104,Cu=200,Pu=201,Iu=202,Lu=203,Mc=204,bc=205,Du=206,Nu=207,Uu=208,Fu=209,Ou=210,Bu=211,ku=212,zu=213,Hu=214,Fo=0,Oo=1,Bo=2,Ts=3,ko=4,zo=5,Ho=6,Vo=7,pa=0,Vu=1,Gu=2,kn=0,Sc=1,wc=2,Tc=3,Or=4,Ec=5,Ac=6,Rc=7;var Cc=300,Li=301,ji=302,ma=303,ga=304,Br=306,Es=1e3,Yn=1001,Go=1002,Xe=1003,Wu=1004;var kr=1005;var Ze=1006,xa=1007;var Di=1008;var dn=1009,Pc=1010,Ic=1011,Vs=1012,ya=1013,zn=1014,An=1015,Hn=1016,va=1017,_a=1018,Gs=1020,Lc=35902,Dc=35899,Nc=1021,Uc=1022,Rn=1023,$n=1026,Ni=1027,Ma=1028,ba=1029,Ui=1030,Sa=1031;var wa=1033,zr=33776,Hr=33777,Vr=33778,Gr=33779,Ta=35840,Ea=35841,Aa=35842,Ra=35843,Ca=36196,Pa=37492,Ia=37496,La=37488,Da=37489,Wr=37490,Na=37491,Ua=37808,Fa=37809,Oa=37810,Ba=37811,ka=37812,za=37813,Ha=37814,Va=37815,Ga=37816,Wa=37817,Xa=37818,qa=37819,Ya=37820,$a=37821,Za=36492,Ka=36494,Ja=36495,ja=36283,Qa=36284,Xr=36285,tl=36286;var dr=2300,Wo=2301,Do=2302,oc=2303,ac=2400,lc=2401,cc=2402;var Xu=3200;var qr=0,qu=1,Vn="",Be="srgb",fr="srgb-linear",pr="linear",oe="srgb";var No=7680;var Yu=519,$u=512,Zu=513,Ku=514,el=515,Ju=516,ju=517,nl=518,Qu=519,Fc=35044;var Oc="300 es",Fn=2e3,As=2001;function Uf(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Ff(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Rs(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function td(){let i=Rs("canvas");return i.style.display="block",i}var Wh={},Cs=null;function mr(...i){let t="THREE."+i.shift();Cs?Cs("log",t,...i):console.log(t,...i)}function ed(i){let t=i[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=i[1];e&&e.isStackTrace?i[0]+=" "+e.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Dt(...i){i=ed(i);let t="THREE."+i.shift();if(Cs)Cs("warn",t,...i);else{let e=i[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...i)}}function Ot(...i){i=ed(i);let t="THREE."+i.shift();if(Cs)Cs("error",t,...i);else{let e=i[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...i)}}function Wi(...i){let t=i.join(" ");t in Wh||(Wh[t]=!0,Dt(...i))}function nd(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var id={[Fo]:Oo,[Bo]:Ho,[ko]:Vo,[Ts]:zo,[Oo]:Fo,[Ho]:Bo,[Vo]:ko,[zo]:Ts},Zn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let s=n[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},Qe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Xh=1234567,hr=Math.PI/180,Ps=180/Math.PI;function ui(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Qe[i&255]+Qe[i>>8&255]+Qe[i>>16&255]+Qe[i>>24&255]+"-"+Qe[t&255]+Qe[t>>8&255]+"-"+Qe[t>>16&15|64]+Qe[t>>24&255]+"-"+Qe[e&63|128]+Qe[e>>8&255]+"-"+Qe[e>>16&255]+Qe[e>>24&255]+Qe[n&255]+Qe[n>>8&255]+Qe[n>>16&255]+Qe[n>>24&255]).toLowerCase()}function jt(i,t,e){return Math.max(t,Math.min(e,i))}function Bc(i,t){return(i%t+t)%t}function Of(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Bf(i,t,e){return i!==t?(e-i)/(t-i):0}function ur(i,t,e){return(1-e)*i+e*t}function kf(i,t,e,n){return ur(i,t,1-Math.exp(-e*n))}function zf(i,t=1){return t-Math.abs(Bc(i,t*2)-t)}function Hf(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Vf(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Gf(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Wf(i,t){return i+Math.random()*(t-i)}function Xf(i){return i*(.5-Math.random())}function qf(i){i!==void 0&&(Xh=i);let t=Xh+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Yf(i){return i*hr}function $f(i){return i*Ps}function Zf(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function Kf(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Jf(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function jf(i,t,e,n,s){let r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),d=r((t-n)/2),u=o((t-n)/2),m=r((n-t)/2),g=o((n-t)/2);switch(s){case"XYX":i.set(a*h,l*d,l*u,a*c);break;case"YZY":i.set(l*u,a*h,l*d,a*c);break;case"ZXZ":i.set(l*d,l*u,a*h,a*c);break;case"XZX":i.set(a*h,l*g,l*m,a*c);break;case"YXY":i.set(l*m,a*h,l*g,a*c);break;case"ZYZ":i.set(l*g,l*m,a*h,a*c);break;default:Dt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Un(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function ce(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var il={DEG2RAD:hr,RAD2DEG:Ps,generateUUID:ui,clamp:jt,euclideanModulo:Bc,mapLinear:Of,inverseLerp:Bf,lerp:ur,damp:kf,pingpong:zf,smoothstep:Hf,smootherstep:Vf,randInt:Gf,randFloat:Wf,randFloatSpread:Xf,seededRandom:qf,degToRad:Yf,radToDeg:$f,isPowerOfTwo:Zf,ceilPowerOfTwo:Kf,floorPowerOfTwo:Jf,setQuaternionFromProperEuler:jf,normalize:ce,denormalize:Un},Gc=class Gc{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=jt(this.x,t.x,e.x),this.y=jt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=jt(this.x,t,e),this.y=jt(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(jt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(jt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Gc.prototype.isVector2=!0;var Lt=Gc,ln=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3],u=r[o+0],m=r[o+1],g=r[o+2],x=r[o+3];if(d!==x||l!==u||c!==m||h!==g){let f=l*u+c*m+h*g+d*x;f<0&&(u=-u,m=-m,g=-g,x=-x,f=-f);let p=1-a;if(f<.9995){let y=Math.acos(f),S=Math.sin(y);p=Math.sin(p*y)/S,a=Math.sin(a*y)/S,l=l*p+u*a,c=c*p+m*a,h=h*p+g*a,d=d*p+x*a}else{l=l*p+u*a,c=c*p+m*a,h=h*p+g*a,d=d*p+x*a;let y=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=y,c*=y,h*=y,d*=y}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[o],u=r[o+1],m=r[o+2],g=r[o+3];return t[e]=a*g+h*d+l*m-c*u,t[e+1]=l*g+h*u+c*d-a*m,t[e+2]=c*g+h*m+a*u-l*d,t[e+3]=h*g-a*d-l*u-c*m,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),d=a(r/2),u=l(n/2),m=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=u*h*d+c*m*g,this._y=c*m*d-u*h*g,this._z=c*h*g+u*m*d,this._w=c*h*d-u*m*g;break;case"YXZ":this._x=u*h*d+c*m*g,this._y=c*m*d-u*h*g,this._z=c*h*g-u*m*d,this._w=c*h*d+u*m*g;break;case"ZXY":this._x=u*h*d-c*m*g,this._y=c*m*d+u*h*g,this._z=c*h*g+u*m*d,this._w=c*h*d-u*m*g;break;case"ZYX":this._x=u*h*d-c*m*g,this._y=c*m*d+u*h*g,this._z=c*h*g-u*m*d,this._w=c*h*d+u*m*g;break;case"YZX":this._x=u*h*d+c*m*g,this._y=c*m*d+u*h*g,this._z=c*h*g-u*m*d,this._w=c*h*d-u*m*g;break;case"XZY":this._x=u*h*d-c*m*g,this._y=c*m*d-u*h*g,this._z=c*h*g+u*m*d,this._w=c*h*d+u*m*g;break;default:Dt("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],d=e[10],u=n+a+d;if(u>0){let m=.5/Math.sqrt(u+1);this._w=.25/m,this._x=(h-l)*m,this._y=(r-c)*m,this._z=(o-s)*m}else if(n>a&&n>d){let m=2*Math.sqrt(1+n-a-d);this._w=(h-l)/m,this._x=.25*m,this._y=(s+o)/m,this._z=(r+c)/m}else if(a>d){let m=2*Math.sqrt(1+a-n-d);this._w=(r-c)/m,this._x=(s+o)/m,this._y=.25*m,this._z=(l+h)/m}else{let m=2*Math.sqrt(1+d-n-a);this._w=(o-s)/m,this._x=(r+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(jt(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=this.dot(t);a<0&&(n=-n,s=-s,r=-r,o=-o,a=-a);let l=1-e;if(a<.9995){let c=Math.acos(a),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Wc=class Wc{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(qh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(qh.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),h=2*(a*e-r*s),d=2*(r*n-o*e);return this.x=e+l*c+o*d-a*h,this.y=n+l*h+a*c-r*d,this.z=s+l*d+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=jt(this.x,t.x,e.x),this.y=jt(this.y,t.y,e.y),this.z=jt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=jt(this.x,t,e),this.y=jt(this.y,t,e),this.z=jt(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(jt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Bl.copy(this).projectOnVector(t),this.sub(Bl)}reflect(t){return this.sub(Bl.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(jt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Wc.prototype.isVector3=!0;var U=Wc,Bl=new U,qh=new ln,Xc=class Xc{constructor(t,e,n,s,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){let h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],m=n[5],g=n[8],x=s[0],f=s[3],p=s[6],y=s[1],S=s[4],v=s[7],b=s[2],E=s[5],R=s[8];return r[0]=o*x+a*y+l*b,r[3]=o*f+a*S+l*E,r[6]=o*p+a*v+l*R,r[1]=c*x+h*y+d*b,r[4]=c*f+h*S+d*E,r[7]=c*p+h*v+d*R,r[2]=u*x+m*y+g*b,r[5]=u*f+m*S+g*E,r[8]=u*p+m*v+g*R,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=h*o-a*c,u=a*l-h*r,m=c*r-o*l,g=e*d+n*u+s*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/g;return t[0]=d*x,t[1]=(s*c-h*n)*x,t[2]=(a*n-s*o)*x,t[3]=u*x,t[4]=(h*e-s*l)*x,t[5]=(s*r-a*e)*x,t[6]=m*x,t[7]=(n*l-c*e)*x,t[8]=(o*e-n*r)*x,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return Wi("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(kl.makeScale(t,e)),this}rotate(t){return Wi("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(kl.makeRotation(-t)),this}translate(t,e){return Wi("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(kl.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};Xc.prototype.isMatrix3=!0;var zt=Xc,kl=new zt,Yh=new zt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),$h=new zt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Qf(){let i={enabled:!0,workingColorSpace:fr,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===oe&&(s.r=di(s.r),s.g=di(s.g),s.b=di(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===oe&&(s.r=ws(s.r),s.g=ws(s.g),s.b=ws(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Vn?pr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Wi("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Wi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[fr]:{primaries:t,whitePoint:n,transfer:pr,toXYZ:Yh,fromXYZ:$h,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Be},outputColorSpaceConfig:{drawingBufferColorSpace:Be}},[Be]:{primaries:t,whitePoint:n,transfer:oe,toXYZ:Yh,fromXYZ:$h,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Be}}}),i}var Jt=Qf();function di(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ws(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var rs,Xo=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{rs===void 0&&(rs=Rs("canvas")),rs.width=t.width,rs.height=t.height;let s=rs.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=rs}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Rs("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=di(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(di(e[n]/255)*255):e[n]=di(e[n]);return{data:e,width:t.width,height:t.height}}else return Dt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},tp=0,Is=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:tp++}),this.uuid=ui(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(zl(s[o].image)):r.push(zl(s[o]))}else r=zl(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function zl(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Xo.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Dt("Texture: Unable to serialize Texture."),{})}var ep=0,Hl=new U,en=class i extends Zn{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=Yn,s=Yn,r=Ze,o=Di,a=Rn,l=dn,c=i.DEFAULT_ANISOTROPY,h=Vn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ep++}),this.uuid=ui(),this.name="",this.source=new Is(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Lt(0,0),this.repeat=new Lt(1,1),this.center=new Lt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new zt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Hl).x}get height(){return this.source.getSize(Hl).y}get depth(){return this.source.getSize(Hl).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){Dt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Dt(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Cc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Es:t.x=t.x-Math.floor(t.x);break;case Yn:t.x=t.x<0?0:1;break;case Go:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Es:t.y=t.y-Math.floor(t.y);break;case Yn:t.y=t.y<0?0:1;break;case Go:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};en.DEFAULT_IMAGE=null;en.DEFAULT_MAPPING=Cc;en.DEFAULT_ANISOTROPY=1;var qc=class qc{constructor(t=0,e=0,n=0,s=1){this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,l=t.elements,c=l[0],h=l[4],d=l[8],u=l[1],m=l[5],g=l[9],x=l[2],f=l[6],p=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-x)<.01&&Math.abs(g-f)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+x)<.1&&Math.abs(g+f)<.1&&Math.abs(c+m+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let S=(c+1)/2,v=(m+1)/2,b=(p+1)/2,E=(h+u)/4,R=(d+x)/4,_=(g+f)/4;return S>v&&S>b?S<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(S),s=E/n,r=R/n):v>b?v<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),n=E/s,r=_/s):b<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(b),n=R/r,s=_/r),this.set(n,s,r,e),this}let y=Math.sqrt((f-g)*(f-g)+(d-x)*(d-x)+(u-h)*(u-h));return Math.abs(y)<.001&&(y=1),this.x=(f-g)/y,this.y=(d-x)/y,this.z=(u-h)/y,this.w=Math.acos((c+m+p-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=jt(this.x,t.x,e.x),this.y=jt(this.y,t.y,e.y),this.z=jt(this.z,t.z,e.z),this.w=jt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=jt(this.x,t,e),this.y=jt(this.y,t,e),this.z=jt(this.z,t,e),this.w=jt(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(jt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};qc.prototype.isVector4=!0;var be=qc,qo=class extends Zn{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ze,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new be(0,0,t,e),this.scissorTest=!1,this.viewport=new be(0,0,t,e),this.textures=[];let s={width:t,height:e,depth:n.depth},r=new en(s),o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:Ze,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new Is(s)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},un=class extends qo{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},gr=class extends en{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Xe,this.minFilter=Xe,this.wrapR=Yn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Yo=class extends en{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Xe,this.minFilter=Xe,this.wrapR=Yn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var da=class da{constructor(t,e,n,s,r,o,a,l,c,h,d,u,m,g,x,f){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,h,d,u,m,g,x,f)}set(t,e,n,s,r,o,a,l,c,h,d,u,m,g,x,f){let p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=d,p[14]=u,p[3]=m,p[7]=g,p[11]=x,p[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new da().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,n=t.elements,s=1/os.setFromMatrixColumn(t,0).length(),r=1/os.setFromMatrixColumn(t,1).length(),o=1/os.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){let u=o*h,m=o*d,g=a*h,x=a*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=m+g*c,e[5]=u-x*c,e[9]=-a*l,e[2]=x-u*c,e[6]=g+m*c,e[10]=o*l}else if(t.order==="YXZ"){let u=l*h,m=l*d,g=c*h,x=c*d;e[0]=u+x*a,e[4]=g*a-m,e[8]=o*c,e[1]=o*d,e[5]=o*h,e[9]=-a,e[2]=m*a-g,e[6]=x+u*a,e[10]=o*l}else if(t.order==="ZXY"){let u=l*h,m=l*d,g=c*h,x=c*d;e[0]=u-x*a,e[4]=-o*d,e[8]=g+m*a,e[1]=m+g*a,e[5]=o*h,e[9]=x-u*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let u=o*h,m=o*d,g=a*h,x=a*d;e[0]=l*h,e[4]=g*c-m,e[8]=u*c+x,e[1]=l*d,e[5]=x*c+u,e[9]=m*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let u=o*l,m=o*c,g=a*l,x=a*c;e[0]=l*h,e[4]=x-u*d,e[8]=g*d+m,e[1]=d,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=m*d+g,e[10]=u-x*d}else if(t.order==="XZY"){let u=o*l,m=o*c,g=a*l,x=a*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=u*d+x,e[5]=o*h,e[9]=m*d-g,e[2]=g*d-m,e[6]=a*h,e[10]=x*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(np,t,ip)}lookAt(t,e,n){let s=this.elements;return xn.subVectors(t,e),xn.lengthSq()===0&&(xn.z=1),xn.normalize(),vi.crossVectors(n,xn),vi.lengthSq()===0&&(Math.abs(n.z)===1?xn.x+=1e-4:xn.z+=1e-4,xn.normalize(),vi.crossVectors(n,xn)),vi.normalize(),ro.crossVectors(xn,vi),s[0]=vi.x,s[4]=ro.x,s[8]=xn.x,s[1]=vi.y,s[5]=ro.y,s[9]=xn.y,s[2]=vi.z,s[6]=ro.z,s[10]=xn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],m=n[13],g=n[2],x=n[6],f=n[10],p=n[14],y=n[3],S=n[7],v=n[11],b=n[15],E=s[0],R=s[4],_=s[8],T=s[12],A=s[1],I=s[5],P=s[9],N=s[13],L=s[2],F=s[6],H=s[10],W=s[14],Q=s[3],q=s[7],K=s[11],j=s[15];return r[0]=o*E+a*A+l*L+c*Q,r[4]=o*R+a*I+l*F+c*q,r[8]=o*_+a*P+l*H+c*K,r[12]=o*T+a*N+l*W+c*j,r[1]=h*E+d*A+u*L+m*Q,r[5]=h*R+d*I+u*F+m*q,r[9]=h*_+d*P+u*H+m*K,r[13]=h*T+d*N+u*W+m*j,r[2]=g*E+x*A+f*L+p*Q,r[6]=g*R+x*I+f*F+p*q,r[10]=g*_+x*P+f*H+p*K,r[14]=g*T+x*N+f*W+p*j,r[3]=y*E+S*A+v*L+b*Q,r[7]=y*R+S*I+v*F+b*q,r[11]=y*_+S*P+v*H+b*K,r[15]=y*T+S*N+v*W+b*j,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],d=t[6],u=t[10],m=t[14],g=t[3],x=t[7],f=t[11],p=t[15],y=l*m-c*u,S=a*m-c*d,v=a*u-l*d,b=o*m-c*h,E=o*u-l*h,R=o*d-a*h;return e*(x*y-f*S+p*v)-n*(g*y-f*b+p*E)+s*(g*S-x*b+p*R)-r*(g*v-x*E+f*R)}determinantAffine(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[1],o=t[5],a=t[9],l=t[2],c=t[6],h=t[10];return e*(o*h-a*c)-n*(r*h-a*l)+s*(r*c-o*l)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=t[9],u=t[10],m=t[11],g=t[12],x=t[13],f=t[14],p=t[15],y=e*a-n*o,S=e*l-s*o,v=e*c-r*o,b=n*l-s*a,E=n*c-r*a,R=s*c-r*l,_=h*x-d*g,T=h*f-u*g,A=h*p-m*g,I=d*f-u*x,P=d*p-m*x,N=u*p-m*f,L=y*N-S*P+v*I+b*A-E*T+R*_;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let F=1/L;return t[0]=(a*N-l*P+c*I)*F,t[1]=(s*P-n*N-r*I)*F,t[2]=(x*R-f*E+p*b)*F,t[3]=(u*E-d*R-m*b)*F,t[4]=(l*A-o*N-c*T)*F,t[5]=(e*N-s*A+r*T)*F,t[6]=(f*v-g*R-p*S)*F,t[7]=(h*R-u*v+m*S)*F,t[8]=(o*P-a*A+c*_)*F,t[9]=(n*A-e*P-r*_)*F,t[10]=(g*E-x*v+p*y)*F,t[11]=(d*v-h*E-m*y)*F,t[12]=(a*T-o*I-l*_)*F,t[13]=(e*I-n*T+s*_)*F,t[14]=(x*S-g*b-f*y)*F,t[15]=(h*b-d*S+u*y)*F,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,d=a+a,u=r*c,m=r*h,g=r*d,x=o*h,f=o*d,p=a*d,y=l*c,S=l*h,v=l*d,b=n.x,E=n.y,R=n.z;return s[0]=(1-(x+p))*b,s[1]=(m+v)*b,s[2]=(g-S)*b,s[3]=0,s[4]=(m-v)*E,s[5]=(1-(u+p))*E,s[6]=(f+y)*E,s[7]=0,s[8]=(g+S)*R,s[9]=(f-y)*R,s[10]=(1-(u+x))*R,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let o=os.set(s[0],s[1],s[2]).length(),a=os.set(s[4],s[5],s[6]).length(),l=os.set(s[8],s[9],s[10]).length();r<0&&(o=-o),In.copy(this);let c=1/o,h=1/a,d=1/l;return In.elements[0]*=c,In.elements[1]*=c,In.elements[2]*=c,In.elements[4]*=h,In.elements[5]*=h,In.elements[6]*=h,In.elements[8]*=d,In.elements[9]*=d,In.elements[10]*=d,e.setFromRotationMatrix(In),n.x=o,n.y=a,n.z=l,this}makePerspective(t,e,n,s,r,o,a=Fn,l=!1){let c=this.elements,h=2*r/(e-t),d=2*r/(n-s),u=(e+t)/(e-t),m=(n+s)/(n-s),g,x;if(l)g=r/(o-r),x=o*r/(o-r);else if(a===Fn)g=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===As)g=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=m,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=Fn,l=!1){let c=this.elements,h=2/(e-t),d=2/(n-s),u=-(e+t)/(e-t),m=-(n+s)/(n-s),g,x;if(l)g=1/(o-r),x=o/(o-r);else if(a===Fn)g=-2/(o-r),x=-(o+r)/(o-r);else if(a===As)g=-1/(o-r),x=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=d,c[9]=0,c[13]=m,c[2]=0,c[6]=0,c[10]=g,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};da.prototype.isMatrix4=!0;var ie=da,os=new U,In=new ie,np=new U(0,0,0),ip=new U(1,1,1),vi=new U,ro=new U,xn=new U,Zh=new ie,Kh=new ln,Kn=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],d=s[2],u=s[6],m=s[10];switch(e){case"XYZ":this._y=Math.asin(jt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-jt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(jt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,m),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-jt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(jt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-jt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:Dt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Zh.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Zh,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Kh.setFromEuler(this),this.setFromQuaternion(Kh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Kn.DEFAULT_ORDER="XYZ";var xr=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},sp=0,Jh=new U,as=new ln,ri=new ie,oo=new U,tr=new U,rp=new U,op=new ln,jh=new U(1,0,0),Qh=new U(0,1,0),tu=new U(0,0,1),eu={type:"added"},ap={type:"removed"},ls={type:"childadded",child:null},Vl={type:"childremoved",child:null},qe=class i extends Zn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:sp++}),this.uuid=ui(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new U,e=new Kn,n=new ln,s=new U(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ie},normalMatrix:{value:new zt}}),this.matrix=new ie,this.matrixWorld=new ie,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new xr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return as.setFromAxisAngle(t,e),this.quaternion.multiply(as),this}rotateOnWorldAxis(t,e){return as.setFromAxisAngle(t,e),this.quaternion.premultiply(as),this}rotateX(t){return this.rotateOnAxis(jh,t)}rotateY(t){return this.rotateOnAxis(Qh,t)}rotateZ(t){return this.rotateOnAxis(tu,t)}translateOnAxis(t,e){return Jh.copy(t).applyQuaternion(this.quaternion),this.position.add(Jh.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(jh,t)}translateY(t){return this.translateOnAxis(Qh,t)}translateZ(t){return this.translateOnAxis(tu,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ri.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?oo.copy(t):oo.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),tr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ri.lookAt(tr,oo,this.up):ri.lookAt(oo,tr,this.up),this.quaternion.setFromRotationMatrix(ri),s&&(ri.extractRotation(s.matrixWorld),as.setFromRotationMatrix(ri),this.quaternion.premultiply(as.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Ot("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(eu),ls.child=t,this.dispatchEvent(ls),ls.child=null):Ot("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(ap),Vl.child=t,this.dispatchEvent(Vl),Vl.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ri.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ri.multiply(t.parent.matrixWorld)),t.applyMatrix4(ri),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(eu),ls.child=t,this.dispatchEvent(ls),ls.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(tr,t,rp),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(tr,op,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,n=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*s,r[13]+=n-r[1]*e-r[5]*n-r[9]*s,r[14]+=s-r[2]*e-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){let s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),d=o(t.shapes),u=o(t.skeletons),m=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};qe.DEFAULT_UP=new U(0,1,0);qe.DEFAULT_MATRIX_AUTO_UPDATE=!0;qe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Ce=class extends qe{constructor(){super(),this.isGroup=!0,this.type="Group"}},lp={type:"move"},Ls=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ce,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ce,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ce,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let x of t.hand.values()){let f=e.getJointPose(x,n),p=this._getHandJoint(c,x);f!==null&&(p.matrix.fromArray(f.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=f.radius),p.visible=f!==null}let h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),m=.02,g=.005;c.inputState.pinching&&u>m+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=m-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(lp)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Ce;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},sd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},_i={h:0,s:0,l:0},ao={h:0,s:0,l:0};function Gl(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var Ct=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Be){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Jt.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=Jt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Jt.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=Jt.workingColorSpace){if(t=Bc(t,1),e=jt(e,0,1),n=jt(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Gl(o,r,t+1/3),this.g=Gl(o,r,t),this.b=Gl(o,r,t-1/3)}return Jt.colorSpaceToWorking(this,s),this}setStyle(t,e=Be){function n(r){r!==void 0&&parseFloat(r)<1&&Dt("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Dt("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);Dt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Be){let n=sd[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Dt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=di(t.r),this.g=di(t.g),this.b=di(t.b),this}copyLinearToSRGB(t){return this.r=ws(t.r),this.g=ws(t.g),this.b=ws(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Be){return Jt.workingToColorSpace(tn.copy(this),t),Math.round(jt(tn.r*255,0,255))*65536+Math.round(jt(tn.g*255,0,255))*256+Math.round(jt(tn.b*255,0,255))}getHexString(t=Be){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Jt.workingColorSpace){Jt.workingToColorSpace(tn.copy(this),e);let n=tn.r,s=tn.g,r=tn.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Jt.workingColorSpace){return Jt.workingToColorSpace(tn.copy(this),e),t.r=tn.r,t.g=tn.g,t.b=tn.b,t}getStyle(t=Be){Jt.workingToColorSpace(tn.copy(this),t);let e=tn.r,n=tn.g,s=tn.b;return t!==Be?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(_i),this.setHSL(_i.h+t,_i.s+e,_i.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(_i),t.getHSL(ao);let n=ur(_i.h,ao.h,e),s=ur(_i.s,ao.s,e),r=ur(_i.l,ao.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},tn=new Ct;Ct.NAMES=sd;var Ds=class i{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ct(t),this.near=e,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},fi=class extends qe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Kn,this.environmentIntensity=1,this.environmentRotation=new Kn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}},Ln=new U,oi=new U,Wl=new U,ai=new U,cs=new U,hs=new U,nu=new U,Xl=new U,ql=new U,Yl=new U,$l=new be,Zl=new be,Kl=new be,hi=class i{constructor(t=new U,e=new U,n=new U){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Ln.subVectors(t,e),s.cross(Ln);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Ln.subVectors(s,e),oi.subVectors(n,e),Wl.subVectors(t,e);let o=Ln.dot(Ln),a=Ln.dot(oi),l=Ln.dot(Wl),c=oi.dot(oi),h=oi.dot(Wl),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;let u=1/d,m=(c*l-a*h)*u,g=(o*h-a*l)*u;return r.set(1-m-g,g,m)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,ai)===null?!1:ai.x>=0&&ai.y>=0&&ai.x+ai.y<=1}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,ai)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,ai.x),l.addScaledVector(o,ai.y),l.addScaledVector(a,ai.z),l)}static getInterpolatedAttribute(t,e,n,s,r,o){return $l.setScalar(0),Zl.setScalar(0),Kl.setScalar(0),$l.fromBufferAttribute(t,e),Zl.fromBufferAttribute(t,n),Kl.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector($l,r.x),o.addScaledVector(Zl,r.y),o.addScaledVector(Kl,r.z),o}static isFrontFacing(t,e,n,s){return Ln.subVectors(n,e),oi.subVectors(t,e),Ln.cross(oi).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Ln.subVectors(this.c,this.b),oi.subVectors(this.a,this.b),Ln.cross(oi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,o,a;cs.subVectors(s,n),hs.subVectors(r,n),Xl.subVectors(t,n);let l=cs.dot(Xl),c=hs.dot(Xl);if(l<=0&&c<=0)return e.copy(n);ql.subVectors(t,s);let h=cs.dot(ql),d=hs.dot(ql);if(h>=0&&d<=h)return e.copy(s);let u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(cs,o);Yl.subVectors(t,r);let m=cs.dot(Yl),g=hs.dot(Yl);if(g>=0&&m<=g)return e.copy(r);let x=m*c-l*g;if(x<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(hs,a);let f=h*g-m*d;if(f<=0&&d-h>=0&&m-g>=0)return nu.subVectors(r,s),a=(d-h)/(d-h+(m-g)),e.copy(s).addScaledVector(nu,a);let p=1/(f+x+u);return o=x*p,a=u*p,e.copy(n).addScaledVector(cs,o).addScaledVector(hs,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Jn=class{constructor(t=new U(1/0,1/0,1/0),e=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Dn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Dn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=Dn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Dn):Dn.fromBufferAttribute(r,o),Dn.applyMatrix4(t.matrixWorld),this.expandByPoint(Dn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),lo.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),lo.copy(n.boundingBox)),lo.applyMatrix4(t.matrixWorld),this.union(lo)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Dn),Dn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(er),co.subVectors(this.max,er),us.subVectors(t.a,er),ds.subVectors(t.b,er),fs.subVectors(t.c,er),Mi.subVectors(ds,us),bi.subVectors(fs,ds),zi.subVectors(us,fs);let e=[0,-Mi.z,Mi.y,0,-bi.z,bi.y,0,-zi.z,zi.y,Mi.z,0,-Mi.x,bi.z,0,-bi.x,zi.z,0,-zi.x,-Mi.y,Mi.x,0,-bi.y,bi.x,0,-zi.y,zi.x,0];return!Jl(e,us,ds,fs,co)||(e=[1,0,0,0,1,0,0,0,1],!Jl(e,us,ds,fs,co))?!1:(ho.crossVectors(Mi,bi),e=[ho.x,ho.y,ho.z],Jl(e,us,ds,fs,co))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Dn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Dn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(li[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),li[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),li[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),li[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),li[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),li[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),li[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),li[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(li),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},li=[new U,new U,new U,new U,new U,new U,new U,new U],Dn=new U,lo=new Jn,us=new U,ds=new U,fs=new U,Mi=new U,bi=new U,zi=new U,er=new U,co=new U,ho=new U,Hi=new U;function Jl(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Hi.fromArray(i,r);let a=s.x*Math.abs(Hi.x)+s.y*Math.abs(Hi.y)+s.z*Math.abs(Hi.z),l=t.dot(Hi),c=e.dot(Hi),h=n.dot(Hi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var Le=new U,uo=new Lt,cp=0,$e=class extends Zn{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:cp++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Fc,this.updateRanges=[],this.gpuType=An,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)uo.fromBufferAttribute(this,e),uo.applyMatrix3(t),this.setXY(e,uo.x,uo.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Le.fromBufferAttribute(this,e),Le.applyMatrix3(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Le.fromBufferAttribute(this,e),Le.applyMatrix4(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Le.fromBufferAttribute(this,e),Le.applyNormalMatrix(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Le.fromBufferAttribute(this,e),Le.transformDirection(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Un(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ce(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Un(e,this.array)),e}setX(t,e){return this.normalized&&(e=ce(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Un(e,this.array)),e}setY(t,e){return this.normalized&&(e=ce(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Un(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ce(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Un(e,this.array)),e}setW(t,e){return this.normalized&&(e=ce(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ce(e,this.array),n=ce(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=ce(e,this.array),n=ce(n,this.array),s=ce(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=ce(e,this.array),n=ce(n,this.array),s=ce(s,this.array),r=ce(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}};var Xi=class extends $e{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var qi=class extends $e{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var fe=class extends $e{constructor(t,e,n){super(new Float32Array(t),e,n)}},hp=new Jn,nr=new U,jl=new U,pi=class{constructor(t=new U,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):hp.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;nr.subVectors(t,this.center);let e=nr.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(nr,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(jl.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(nr.copy(t.center).add(jl)),this.expandByPoint(nr.copy(t.center).sub(jl))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},up=0,wn=new ie,Ql=new qe,ps=new U,yn=new Jn,ir=new Jn,We=new U,ke=class i extends Zn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:up++}),this.uuid=ui(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Uf(t)?qi:Xi)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new zt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return wn.makeRotationFromQuaternion(t),this.applyMatrix4(wn),this}rotateX(t){return wn.makeRotationX(t),this.applyMatrix4(wn),this}rotateY(t){return wn.makeRotationY(t),this.applyMatrix4(wn),this}rotateZ(t){return wn.makeRotationZ(t),this.applyMatrix4(wn),this}translate(t,e,n){return wn.makeTranslation(t,e,n),this.applyMatrix4(wn),this}scale(t,e,n){return wn.makeScale(t,e,n),this.applyMatrix4(wn),this}lookAt(t){return Ql.lookAt(t),Ql.updateMatrix(),this.applyMatrix4(Ql.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ps).negate(),this.translate(ps.x,ps.y,ps.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let s=0,r=t.length;s<r;s++){let o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new fe(n,3))}else{let n=Math.min(t.length,e.count);for(let s=0;s<n;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&Dt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Jn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ot("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];yn.setFromBufferAttribute(r),this.morphTargetsRelative?(We.addVectors(this.boundingBox.min,yn.min),this.boundingBox.expandByPoint(We),We.addVectors(this.boundingBox.max,yn.max),this.boundingBox.expandByPoint(We)):(this.boundingBox.expandByPoint(yn.min),this.boundingBox.expandByPoint(yn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ot('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new pi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ot("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(t){let n=this.boundingSphere.center;if(yn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];ir.setFromBufferAttribute(a),this.morphTargetsRelative?(We.addVectors(yn.min,ir.min),yn.expandByPoint(We),We.addVectors(yn.max,ir.max),yn.expandByPoint(We)):(yn.expandByPoint(ir.min),yn.expandByPoint(ir.max))}yn.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)We.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(We));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)We.fromBufferAttribute(a,c),l&&(ps.fromBufferAttribute(t,c),We.add(ps)),s=Math.max(s,n.distanceToSquared(We))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ot('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Ot("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,s=e.normal,r=e.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new $e(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));let a=[],l=[];for(let _=0;_<n.count;_++)a[_]=new U,l[_]=new U;let c=new U,h=new U,d=new U,u=new Lt,m=new Lt,g=new Lt,x=new U,f=new U;function p(_,T,A){c.fromBufferAttribute(n,_),h.fromBufferAttribute(n,T),d.fromBufferAttribute(n,A),u.fromBufferAttribute(r,_),m.fromBufferAttribute(r,T),g.fromBufferAttribute(r,A),h.sub(c),d.sub(c),m.sub(u),g.sub(u);let I=1/(m.x*g.y-g.x*m.y);isFinite(I)&&(x.copy(h).multiplyScalar(g.y).addScaledVector(d,-m.y).multiplyScalar(I),f.copy(d).multiplyScalar(m.x).addScaledVector(h,-g.x).multiplyScalar(I),a[_].add(x),a[T].add(x),a[A].add(x),l[_].add(f),l[T].add(f),l[A].add(f))}let y=this.groups;y.length===0&&(y=[{start:0,count:t.count}]);for(let _=0,T=y.length;_<T;++_){let A=y[_],I=A.start,P=A.count;for(let N=I,L=I+P;N<L;N+=3)p(t.getX(N+0),t.getX(N+1),t.getX(N+2))}let S=new U,v=new U,b=new U,E=new U;function R(_){b.fromBufferAttribute(s,_),E.copy(b);let T=a[_];S.copy(T),S.sub(b.multiplyScalar(b.dot(T))).normalize(),v.crossVectors(E,T);let I=v.dot(l[_])<0?-1:1;o.setXYZW(_,S.x,S.y,S.z,I)}for(let _=0,T=y.length;_<T;++_){let A=y[_],I=A.start,P=A.count;for(let N=I,L=I+P;N<L;N+=3)R(t.getX(N+0)),R(t.getX(N+1)),R(t.getX(N+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new $e(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,m=n.count;u<m;u++)n.setXYZ(u,0,0,0);let s=new U,r=new U,o=new U,a=new U,l=new U,c=new U,h=new U,d=new U;if(t)for(let u=0,m=t.count;u<m;u+=3){let g=t.getX(u+0),x=t.getX(u+1),f=t.getX(u+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,x),o.fromBufferAttribute(e,f),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,f),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(f,c.x,c.y,c.z)}else for(let u=0,m=e.count;u<m;u+=3)s.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),o.fromBufferAttribute(e,u+2),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)We.fromBufferAttribute(t,e),We.normalize(),t.setXYZ(e,We.x,We.y,We.z)}toNonIndexed(){function t(a,l){let c=a.array,h=a.itemSize,d=a.normalized,u=new c.constructor(l.length*h),m=0,g=0;for(let x=0,f=l.length;x<f;x++){a.isInterleavedBufferAttribute?m=l[x]*a.data.stride+a.offset:m=l[x]*h;for(let p=0;p<h;p++)u[g++]=c[m++]}return new $e(u,h,d)}if(this.index===null)return Dt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=t(l,n);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,d=c.length;h<d;h++){let u=c[h],m=t(u,n);l.push(m)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){let m=c[d];h.push(m.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let s=t.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],d=r[c];for(let u=0,m=d.length;u<m;u++)h.push(d[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,h=o.length;c<h;c++){let d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},$o=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Fc,this.updateRanges=[],this.version=0,this.uuid=ui()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ui()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ui()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let e={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return e.usage=this.usage,e}},an=new U,yr=class i{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)an.fromBufferAttribute(this,e),an.applyMatrix4(t),this.setXYZ(e,an.x,an.y,an.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)an.fromBufferAttribute(this,e),an.applyNormalMatrix(t),this.setXYZ(e,an.x,an.y,an.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)an.fromBufferAttribute(this,e),an.transformDirection(t),this.setXYZ(e,an.x,an.y,an.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=Un(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ce(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=ce(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ce(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ce(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ce(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Un(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Un(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Un(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Un(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=ce(e,this.array),n=ce(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ce(e,this.array),n=ce(n,this.array),s=ce(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=ce(e,this.array),n=ce(n,this.array),s=ce(s,this.array),r=ce(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){mr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new $e(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new i(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){mr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},tc=new U,dp=new U,fp=new zt,Nn=class{constructor(t=new U(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=tc.subVectors(n,e).cross(dp.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){let s=t.delta(tc),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let o=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:e.copy(t.start).addScaledVector(s,o)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||fp.getNormalMatrix(t),s=this.coplanarPoint(tc).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},pp=0,On=class extends Zn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:pp++}),this.uuid=ui(),this.name="",this.type="Material",this.blending=Ii,this.side=Pi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Mc,this.blendDst=bc,this.blendEquation=Ji,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ct(0,0,0),this.blendAlpha=0,this.depthFunc=Ts,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Yu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=No,this.stencilZFail=No,this.stencilZPass=No,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){Dt(`Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Dt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new Ct().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(n=>new Nn().fromJSON(n))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Lt().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Lt().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},vn=class extends On{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ct(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},ms,sr=new U,gs=new U,xs=new U,ys=new Lt,rr=new Lt,rd=new ie,fo=new U,or=new U,po=new U,iu=new Lt,ec=new Lt,su=new Lt,Tn=class extends qe{constructor(t=new vn){if(super(),this.isSprite=!0,this.type="Sprite",ms===void 0){ms=new ke;let e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new $o(e,5);ms.setIndex([0,1,2,0,2,3]),ms.setAttribute("position",new yr(n,3,0,!1)),ms.setAttribute("uv",new yr(n,2,3,!1))}this.geometry=ms,this.material=t,this.center=new Lt(.5,.5),this.count=1}intersectsFrustum(t){return t.intersectsSprite(this)}raycast(t,e){t.camera===null&&Ot('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),gs.setFromMatrixScale(this.matrixWorld),rd.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),xs.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&gs.multiplyScalar(-xs.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let o=this.center;mo(fo.set(-.5,-.5,0),xs,o,gs,s,r),mo(or.set(.5,-.5,0),xs,o,gs,s,r),mo(po.set(.5,.5,0),xs,o,gs,s,r),iu.set(0,0),ec.set(1,0),su.set(1,1);let a=t.ray.intersectTriangle(fo,or,po,!1,sr);if(a===null&&(mo(or.set(-.5,.5,0),xs,o,gs,s,r),ec.set(0,1),a=t.ray.intersectTriangle(fo,po,or,!1,sr),a===null))return;let l=t.ray.origin.distanceTo(sr);l<t.near||l>t.far||e.push({distance:l,point:sr.clone(),uv:hi.getInterpolation(sr,fo,or,po,iu,ec,su,new Lt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}};function mo(i,t,e,n,s,r){ys.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(rr.x=r*ys.x-s*ys.y,rr.y=s*ys.x+r*ys.y):rr.copy(ys),i.copy(t),i.x+=rr.x,i.y+=rr.y,i.applyMatrix4(rd)}var ci=new U,nc=new U,go=new U,xo=new U,vr=class{constructor(t=new U,e=new U(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,ci)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=ci.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(ci.copy(this.origin).addScaledVector(this.direction,e),ci.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){nc.copy(t).add(e).multiplyScalar(.5),go.copy(e).sub(t).normalize(),xo.copy(this.origin).sub(nc);let r=t.distanceTo(e)*.5,o=-this.direction.dot(go),a=xo.dot(this.direction),l=-xo.dot(go),c=xo.lengthSq(),h=Math.abs(1-o*o),d,u,m,g;if(h>0)if(d=o*l-a,u=o*a-l,g=r*h,d>=0)if(u>=-g)if(u<=g){let x=1/h;d*=x,u*=x,m=d*(d+o*u+2*a)+u*(o*d+u+2*l)+c}else u=r,d=Math.max(0,-(o*u+a)),m=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(o*u+a)),m=-d*d+u*(u+2*l)+c;else u<=-g?(d=Math.max(0,-(-o*r+a)),u=d>0?-r:Math.min(Math.max(-r,-l),r),m=-d*d+u*(u+2*l)+c):u<=g?(d=0,u=Math.min(Math.max(-r,-l),r),m=u*(u+2*l)+c):(d=Math.max(0,-(o*r+a)),u=d>0?r:Math.min(Math.max(-r,-l),r),m=-d*d+u*(u+2*l)+c);else u=o>0?-r:r,d=Math.max(0,-(o*u+a)),m=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(nc).addScaledVector(go,u),m}intersectSphere(t,e){if(t.radius<0)return null;ci.subVectors(t.center,this.origin);let n=ci.dot(this.direction),s=ci.dot(ci)-n*n,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,s=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,s=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,o=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,o=(t.min.y-u.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(t.min.z-u.z)*d,l=(t.max.z-u.z)*d):(a=(t.max.z-u.z)*d,l=(t.min.z-u.z)*d),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,ci)!==null}intersectTriangle(t,e,n,s,r){let o=this.origin,a=this.direction,l=a.x,c=a.y,h=a.z,d=t.x-o.x,u=t.y-o.y,m=t.z-o.z,g=e.x-o.x,x=e.y-o.y,f=e.z-o.z,p=n.x-o.x,y=n.y-o.y,S=n.z-o.z,v=Math.abs(l),b=Math.abs(c),E=Math.abs(h),R,_,T,A,I,P,N,L,F,H,W,Q;if(v>=b&&v>=E?(T=l,P=d,F=g,Q=p,l>=0?(R=c,_=h,A=u,I=m,N=x,L=f,H=y,W=S):(R=h,_=c,A=m,I=u,N=f,L=x,H=S,W=y)):b>=E?(T=c,P=u,F=x,Q=y,c>=0?(R=h,_=l,A=m,I=d,N=f,L=g,H=S,W=p):(R=l,_=h,A=d,I=m,N=g,L=f,H=p,W=S)):(T=h,P=m,F=f,Q=S,h>=0?(R=l,_=c,A=d,I=u,N=g,L=x,H=p,W=y):(R=c,_=l,A=u,I=d,N=x,L=g,H=y,W=p)),T===0)return null;let q=R/T,K=_/T,j=1/T,st=A-q*P,at=I-K*P,$t=N-q*F,Pt=L-K*F,kt=H-q*Q,$=W-K*Q,et=kt*Pt-$*$t,vt=st*$-at*kt,Nt=$t*at-Pt*st;if(s){if(et<0||vt<0||Nt<0)return null}else if((et<0||vt<0||Nt<0)&&(et>0||vt>0||Nt>0))return null;let yt=et+vt+Nt;if(yt===0)return null;let Ut=j*(et*P+vt*F+Nt*Q);return(yt>0?Ut<0:Ut>0)?null:this.at(Ut/yt,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Bn=class extends On{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ct(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Kn,this.combine=pa,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},ru=new ie,Vi=new vr,yo=new pi,ou=new U,vo=new U,_o=new U,Mo=new U,ic=new U,bo=new U,au=new U,So=new U,Ht=class extends qe{constructor(t=new ke,e=new Bn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){bo.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],d=r[l];h!==0&&(ic.fromBufferAttribute(d,t),o?bo.addScaledVector(ic,h):bo.addScaledVector(ic.sub(e),h))}e.add(bo)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),yo.copy(n.boundingSphere),yo.applyMatrix4(r),Vi.copy(t.ray).recast(t.near),!(yo.containsPoint(Vi.origin)===!1&&(Vi.intersectSphere(yo,ou)===null||Vi.origin.distanceToSquared(ou)>(t.far-t.near)**2))&&(ru.copy(r).invert(),Vi.copy(t.ray).applyMatrix4(ru),!(n.boundingBox!==null&&Vi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Vi)))}_computeIntersections(t,e,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,m=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,x=u.length;g<x;g++){let f=u[g],p=o[f.materialIndex],y=Math.max(f.start,m.start),S=Math.min(a.count,Math.min(f.start+f.count,m.start+m.count));for(let v=y,b=S;v<b;v+=3){let E=a.getX(v),R=a.getX(v+1),_=a.getX(v+2);s=wo(this,p,t,n,c,h,d,E,R,_),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=f.materialIndex,e.push(s))}}else{let g=Math.max(0,m.start),x=Math.min(a.count,m.start+m.count);for(let f=g,p=x;f<p;f+=3){let y=a.getX(f),S=a.getX(f+1),v=a.getX(f+2);s=wo(this,o,t,n,c,h,d,y,S,v),s&&(s.faceIndex=Math.floor(f/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,x=u.length;g<x;g++){let f=u[g],p=o[f.materialIndex],y=Math.max(f.start,m.start),S=Math.min(l.count,Math.min(f.start+f.count,m.start+m.count));for(let v=y,b=S;v<b;v+=3){let E=v,R=v+1,_=v+2;s=wo(this,p,t,n,c,h,d,E,R,_),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=f.materialIndex,e.push(s))}}else{let g=Math.max(0,m.start),x=Math.min(l.count,m.start+m.count);for(let f=g,p=x;f<p;f+=3){let y=f,S=f+1,v=f+2;s=wo(this,o,t,n,c,h,d,y,S,v),s&&(s.faceIndex=Math.floor(f/3),e.push(s))}}}};function mp(i,t,e,n,s,r,o,a){let l;if(t.side===Ke?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===Pi,a),l===null)return null;So.copy(a),So.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(So);return c<e.near||c>e.far?null:{distance:c,point:So.clone(),object:i}}function wo(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,vo),i.getVertexPosition(l,_o),i.getVertexPosition(c,Mo);let h=mp(i,t,e,n,vo,_o,Mo,au);if(h){let d=new U;hi.getBarycoord(au,vo,_o,Mo,d),s&&(h.uv=hi.getInterpolatedAttribute(s,a,l,c,d,new Lt)),r&&(h.uv1=hi.getInterpolatedAttribute(r,a,l,c,d,new Lt)),o&&(h.normal=hi.getInterpolatedAttribute(o,a,l,c,d,new U),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a,b:l,c,normal:new U,materialIndex:0};hi.getNormal(vo,_o,Mo,u.normal),h.face=u,h.barycoord=d}return h}var _r=class extends en{constructor(t=null,e=1,n=1,s,r,o,a,l,c=Xe,h=Xe,d,u){super(null,o,a,l,c,h,s,r,d,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Mr=class extends $e{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},vs=new ie,lu=new ie,To=[],cu=new Jn,gp=new ie,ar=new Ht,lr=new pi,Yi=class extends Ht{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Mr(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,gp)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Jn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,vs),cu.copy(t.boundingBox).applyMatrix4(vs),this.boundingBox.union(cu)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new pi),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,vs),lr.copy(t.boundingSphere).applyMatrix4(vs),this.boundingSphere.union(lr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(t,e){let n=this.matrixWorld,s=this.count;if(ar.geometry=this.geometry,ar.material=this.material,ar.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),lr.copy(this.boundingSphere),lr.applyMatrix4(n),t.ray.intersectsSphere(lr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,vs),lu.multiplyMatrices(n,vs),ar.matrixWorld=lu,ar.raycast(t,To);for(let o=0,a=To.length;o<a;o++){let l=To[o];l.instanceId=r,l.object=this,e.push(l)}To.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new Mr(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){let n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new _r(new Float32Array(s*this.count),s,this.count,Ma,An));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=s*t;return r[l]=a,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Gi=new pi,xp=new Lt(.5,.5),Eo=new U,Ns=class{constructor(t=new Nn,e=new Nn,n=new Nn,s=new Nn,r=new Nn,o=new Nn){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Fn,n=!1){let s=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],d=r[5],u=r[6],m=r[7],g=r[8],x=r[9],f=r[10],p=r[11],y=r[12],S=r[13],v=r[14],b=r[15];if(s[0].setComponents(c-o,m-h,p-g,b-y).normalize(),s[1].setComponents(c+o,m+h,p+g,b+y).normalize(),s[2].setComponents(c+a,m+d,p+x,b+S).normalize(),s[3].setComponents(c-a,m-d,p-x,b-S).normalize(),n)s[4].setComponents(l,u,f,v).normalize(),s[5].setComponents(c-l,m-u,p-f,b-v).normalize();else if(s[4].setComponents(c-l,m-u,p-f,b-v).normalize(),e===Fn)s[5].setComponents(c+l,m+u,p+f,b+v).normalize();else if(e===As)s[5].setComponents(l,u,f,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Gi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Gi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Gi)}intersectsSprite(t){Gi.center.set(0,0,0);let e=xp.distanceTo(t.center);return Gi.radius=.7071067811865476+e,Gi.applyMatrix4(t.matrixWorld),this.intersectsSphere(Gi)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(Eo.x=s.normal.x>0?t.max.x:t.min.x,Eo.y=s.normal.y>0?t.max.y:t.min.y,Eo.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Eo)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Us=class extends On{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ct(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},hu=new ie,hc=new vr,Ao=new pi,Ro=new U,br=class extends qe{constructor(t=new ke,e=new Us){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ao.copy(n.boundingSphere),Ao.applyMatrix4(s),Ao.radius+=r,t.ray.intersectsSphere(Ao)===!1)return;hu.copy(s).invert(),hc.copy(t.ray).applyMatrix4(hu);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,d=n.attributes.position;if(c!==null){let u=Math.max(0,o.start),m=Math.min(c.count,o.start+o.count);for(let g=u,x=m;g<x;g++){let f=c.getX(g);Ro.fromBufferAttribute(d,f),uu(Ro,f,l,s,t,e,this)}}else{let u=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let g=u,x=m;g<x;g++)Ro.fromBufferAttribute(d,g),uu(Ro,g,l,s,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function uu(i,t,e,n,s,r,o){let a=hc.distanceSqToPoint(i);if(a<e){let l=new U;hc.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var Sr=class extends en{constructor(t=[],e=Li,n,s,r,o,a,l,c,h){super(t,e,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},wr=class extends en{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var wi=class extends en{constructor(t,e,n=zn,s,r,o,a=Xe,l=Xe,c,h=$n,d=1){if(h!==$n&&h!==Ni)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:t,height:e,depth:d};super(u,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Is(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}},Zo=class extends wi{constructor(t,e=zn,n=Li,s,r,o=Xe,a=Xe,l,c=$n){let h={width:t,height:t,depth:1},d=[h,h,h,h,h,h];super(t,t,e,n,s,r,o,a,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},Tr=class extends en{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},ze=class i extends ke{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],d=[],u=0,m=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new fe(c,3)),this.setAttribute("normal",new fe(h,3)),this.setAttribute("uv",new fe(d,2));function g(x,f,p,y,S,v,b,E,R,_,T){let A=v/R,I=b/_,P=v/2,N=b/2,L=E/2,F=R+1,H=_+1,W=0,Q=0,q=new U;for(let K=0;K<H;K++){let j=K*I-N;for(let st=0;st<F;st++){let at=st*A-P;q[x]=at*y,q[f]=j*S,q[p]=L,c.push(q.x,q.y,q.z),q[x]=0,q[f]=0,q[p]=E>0?1:-1,h.push(q.x,q.y,q.z),d.push(st/R),d.push(1-K/_),W+=1}}for(let K=0;K<_;K++)for(let j=0;j<R;j++){let st=u+j+F*K,at=u+j+F*(K+1),$t=u+(j+1)+F*(K+1),Pt=u+(j+1)+F*K;l.push(st,at,Pt),l.push(at,$t,Pt),Q+=6}a.addGroup(m,Q,T),m+=Q,u+=W}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var jn=class i extends ke{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],d=[],u=[],m=[],g=0,x=[],f=n/2,p=0;y(),o===!1&&(t>0&&S(!0),e>0&&S(!1)),this.setIndex(h),this.setAttribute("position",new fe(d,3)),this.setAttribute("normal",new fe(u,3)),this.setAttribute("uv",new fe(m,2));function y(){let v=new U,b=new U,E=0,R=(e-t)/n;for(let _=0;_<=r;_++){let T=[],A=_/r,I=A*(e-t)+t;for(let P=0;P<=s;P++){let N=P/s,L=N*l+a,F=Math.sin(L),H=Math.cos(L);b.x=I*F,b.y=-A*n+f,b.z=I*H,d.push(b.x,b.y,b.z),v.set(F,R,H).normalize(),u.push(v.x,v.y,v.z),m.push(N,1-A),T.push(g++)}x.push(T)}for(let _=0;_<s;_++)for(let T=0;T<r;T++){let A=x[T][_],I=x[T+1][_],P=x[T+1][_+1],N=x[T][_+1];(t>0||T!==0)&&(h.push(A,I,N),E+=3),(e>0||T!==r-1)&&(h.push(I,P,N),E+=3)}c.addGroup(p,E,0),p+=E}function S(v){let b=g,E=new Lt,R=new U,_=0,T=v===!0?t:e,A=v===!0?1:-1;for(let P=1;P<=s;P++)d.push(0,f*A,0),u.push(0,A,0),m.push(.5,.5),g++;let I=g;for(let P=0;P<=s;P++){let L=P/s*l+a,F=Math.cos(L),H=Math.sin(L);R.x=T*H,R.y=f*A,R.z=T*F,d.push(R.x,R.y,R.z),u.push(0,A,0),E.x=F*.5+.5,E.y=H*.5*A+.5,m.push(E.x,E.y),g++}for(let P=0;P<s;P++){let N=b+P,L=I+P;v===!0?h.push(L,L+1,N):h.push(L+1,L,N),_+=3}c.addGroup(p,_,v===!0?1:2),p+=_}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Er=class i extends jn{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new i(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Ko=class i extends ke{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};let r=[],o=[];a(s),c(n),h(),this.setAttribute("position",new fe(r,3)),this.setAttribute("normal",new fe(r.slice(),3)),this.setAttribute("uv",new fe(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(y){let S=new U,v=new U,b=new U;for(let E=0;E<e.length;E+=3)m(e[E+0],S),m(e[E+1],v),m(e[E+2],b),l(S,v,b,y)}function l(y,S,v,b){let E=b+1,R=[];for(let _=0;_<=E;_++){R[_]=[];let T=y.clone().lerp(v,_/E),A=S.clone().lerp(v,_/E),I=E-_;for(let P=0;P<=I;P++)P===0&&_===E?R[_][P]=T:R[_][P]=T.clone().lerp(A,P/I)}for(let _=0;_<E;_++)for(let T=0;T<2*(E-_)-1;T++){let A=Math.floor(T/2);T%2===0?(u(R[_][A+1]),u(R[_+1][A]),u(R[_][A])):(u(R[_][A+1]),u(R[_+1][A+1]),u(R[_+1][A]))}}function c(y){let S=new U;for(let v=0;v<r.length;v+=3)S.x=r[v+0],S.y=r[v+1],S.z=r[v+2],S.normalize().multiplyScalar(y),r[v+0]=S.x,r[v+1]=S.y,r[v+2]=S.z}function h(){let y=new U;for(let S=0;S<r.length;S+=3){y.x=r[S+0],y.y=r[S+1],y.z=r[S+2];let v=f(y)/2/Math.PI+.5,b=p(y)/Math.PI+.5;o.push(v,1-b)}g(),d()}function d(){for(let y=0;y<o.length;y+=6){let S=o[y+0],v=o[y+2],b=o[y+4],E=Math.max(S,v,b),R=Math.min(S,v,b);E>.9&&R<.1&&(S<.2&&(o[y+0]+=1),v<.2&&(o[y+2]+=1),b<.2&&(o[y+4]+=1))}}function u(y){r.push(y.x,y.y,y.z)}function m(y,S){let v=y*3;S.x=t[v+0],S.y=t[v+1],S.z=t[v+2]}function g(){let y=new U,S=new U,v=new U,b=new U,E=new Lt,R=new Lt,_=new Lt;for(let T=0,A=0;T<r.length;T+=9,A+=6){y.set(r[T+0],r[T+1],r[T+2]),S.set(r[T+3],r[T+4],r[T+5]),v.set(r[T+6],r[T+7],r[T+8]),E.set(o[A+0],o[A+1]),R.set(o[A+2],o[A+3]),_.set(o[A+4],o[A+5]),b.copy(y).add(S).add(v).divideScalar(3);let I=f(b);x(E,A+0,y,I),x(R,A+2,S,I),x(_,A+4,v,I)}}function x(y,S,v,b){b<0&&y.x===1&&(o[S]=y.x-1),v.x===0&&v.z===0&&(o[S]=b/2/Math.PI+.5)}function f(y){return Math.atan2(y.z,-y.x)}function p(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.vertices,t.indices,t.radius,t.detail)}};function yp(i,t,e=2){let n=t&&t.length,s=n?t[0]*e:i.length,r=od(i,0,s,e,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(n&&(r=Sp(i,t,r,e)),i.length>80*e){a=i[0],l=i[1];let h=a,d=l;for(let u=e;u<s;u+=e){let m=i[u],g=i[u+1];m<a&&(a=m),g<l&&(l=g),m>h&&(h=m),g>d&&(d=g)}c=Math.max(h-a,d-l),c=c!==0?32767/c:0}return Ar(r,o,e,a,l,c,0),o}function od(i,t,e,n,s){let r;if(s===Np(i,t,e,n)>0)for(let o=t;o<e;o+=n)r=du(o/n|0,i[o],i[o+1],r);else for(let o=e-n;o>=t;o-=n)r=du(o/n|0,i[o],i[o+1],r);return r&&Fs(r,r.next)&&(Cr(r),r=r.next),r}function $i(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Fs(e,e.next)||we(e.prev,e,e.next)===0)){if(Cr(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Ar(i,t,e,n,s,r,o){if(!i)return;!o&&r&&Rp(i,n,s,r);let a=i;for(;i.prev!==i.next;){let l=i.prev,c=i.next;if(r?_p(i,n,s,r):vp(i)){t.push(l.i,i.i,c.i),Cr(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=Mp($i(i),t),Ar(i,t,e,n,s,r,2)):o===2&&bp(i,t,e,n,s,r):Ar($i(i),t,e,n,s,r,1);break}}}function vp(i){let t=i.prev,e=i,n=i.next;if(we(t,e,n)>=0)return!1;let s=t.x,r=e.x,o=n.x,a=t.y,l=e.y,c=n.y,h=Math.min(s,r,o),d=Math.min(a,l,c),u=Math.max(s,r,o),m=Math.max(a,l,c),g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=u&&g.y>=d&&g.y<=m&&cr(s,a,r,l,o,c,g.x,g.y)&&we(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function _p(i,t,e,n){let s=i.prev,r=i,o=i.next;if(we(s,r,o)>=0)return!1;let a=s.x,l=r.x,c=o.x,h=s.y,d=r.y,u=o.y,m=Math.min(a,l,c),g=Math.min(h,d,u),x=Math.max(a,l,c),f=Math.max(h,d,u),p=uc(m,g,t,e,n),y=uc(x,f,t,e,n),S=i.prevZ,v=i.nextZ;for(;S&&S.z>=p&&v&&v.z<=y;){if(S.x>=m&&S.x<=x&&S.y>=g&&S.y<=f&&S!==s&&S!==o&&cr(a,h,l,d,c,u,S.x,S.y)&&we(S.prev,S,S.next)>=0||(S=S.prevZ,v.x>=m&&v.x<=x&&v.y>=g&&v.y<=f&&v!==s&&v!==o&&cr(a,h,l,d,c,u,v.x,v.y)&&we(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;S&&S.z>=p;){if(S.x>=m&&S.x<=x&&S.y>=g&&S.y<=f&&S!==s&&S!==o&&cr(a,h,l,d,c,u,S.x,S.y)&&we(S.prev,S,S.next)>=0)return!1;S=S.prevZ}for(;v&&v.z<=y;){if(v.x>=m&&v.x<=x&&v.y>=g&&v.y<=f&&v!==s&&v!==o&&cr(a,h,l,d,c,u,v.x,v.y)&&we(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function Mp(i,t){let e=i;do{let n=e.prev,s=e.next.next;!Fs(n,s)&&ld(n,e,e.next,s)&&Rr(n,s)&&Rr(s,n)&&(t.push(n.i,e.i,s.i),Cr(e),Cr(e.next),e=i=s),e=e.next}while(e!==i);return $i(e)}function bp(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Ip(o,a)){let l=cd(o,a);o=$i(o,o.next),l=$i(l,l.next),Ar(o,t,e,n,s,r,0),Ar(l,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function Sp(i,t,e,n){let s=[];for(let r=0,o=t.length;r<o;r++){let a=t[r]*n,l=r<o-1?t[r+1]*n:i.length,c=od(i,a,l,n,!1);c===c.next&&(c.steiner=!0),s.push(Pp(c))}s.sort(wp);for(let r=0;r<s.length;r++)e=Tp(s[r],e);return e}function wp(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function Tp(i,t){let e=Ep(i,t);if(!e)return t;let n=cd(e,i);return $i(n,n.next),$i(e,e.next)}function Ep(i,t){let e=t,n=i.x,s=i.y,r=-1/0,o;if(Fs(i,e))return e;do{if(Fs(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){let d=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=n&&d>r&&(r=d,o=e.x<e.next.x?e:e.next,d===n))return o}e=e.next}while(e!==t);if(!o)return null;let a=o,l=o.x,c=o.y,h=1/0;e=o;do{if(n>=e.x&&e.x>=l&&n!==e.x&&ad(s<c?n:r,s,l,c,s<c?r:n,s,e.x,e.y)){let d=Math.abs(s-e.y)/(n-e.x);Rr(e,i)&&(d<h||d===h&&(e.x>o.x||e.x===o.x&&Ap(o,e)))&&(o=e,h=d)}e=e.next}while(e!==a);return o}function Ap(i,t){return we(i.prev,i,t.prev)<0&&we(t.next,i,i.next)<0}function Rp(i,t,e,n){let s=i;do s.z===0&&(s.z=uc(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Cp(s)}function Cp(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let o=n,a=0;for(let c=0;c<e&&(a++,o=o.nextZ,!!o);c++);let l=e;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||n.z<=o.z)?(s=n,n=n.nextZ,a--):(s=o,o=o.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=o}r.nextZ=null,e*=2}while(t>1);return i}function uc(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function Pp(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function ad(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function cr(i,t,e,n,s,r,o,a){return!(i===o&&t===a)&&ad(i,t,e,n,s,r,o,a)}function Ip(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!Lp(i,t)&&(Rr(i,t)&&Rr(t,i)&&Dp(i,t)&&(we(i.prev,i,t.prev)||we(i,t.prev,t))||Fs(i,t)&&we(i.prev,i,i.next)>0&&we(t.prev,t,t.next)>0)}function we(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Fs(i,t){return i.x===t.x&&i.y===t.y}function ld(i,t,e,n){let s=Po(we(i,t,e)),r=Po(we(i,t,n)),o=Po(we(e,n,i)),a=Po(we(e,n,t));return!!(s!==r&&o!==a||s===0&&Co(i,e,t)||r===0&&Co(i,n,t)||o===0&&Co(e,i,n)||a===0&&Co(e,t,n))}function Co(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Po(i){return i>0?1:i<0?-1:0}function Lp(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&ld(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Rr(i,t){return we(i.prev,i,i.next)<0?we(i,t,i.next)>=0&&we(i,i.prev,t)>=0:we(i,t,i.prev)<0||we(i,i.next,t)<0}function Dp(i,t){let e=i,n=!1,s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function cd(i,t){let e=dc(i.i,i.x,i.y),n=dc(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function du(i,t,e,n){let s=dc(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Cr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function dc(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Np(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var fc=class{static triangulate(t,e,n=2){return yp(t,e,n)}},Pr=class i{static area(t){let e=t.length,n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return i.area(t)<0}static triangulateShape(t,e){let n=[],s=[],r=[];fu(t),pu(n,t);let o=t.length;e.forEach(fu);for(let l=0;l<e.length;l++)s.push(o),o+=e[l].length,pu(n,e[l]);let a=fc.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function fu(i){let t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function pu(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}var Ir=class i extends Ko{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new i(t.radius,t.detail)}};var _n=class i extends ke{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,d=t/a,u=e/l,m=[],g=[],x=[],f=[];for(let p=0;p<h;p++){let y=p*u-o;for(let S=0;S<c;S++){let v=S*d-r;g.push(v,-y,0),x.push(0,0,1),f.push(S/a),f.push(1-p/l)}}for(let p=0;p<l;p++)for(let y=0;y<a;y++){let S=y+c*p,v=y+c*(p+1),b=y+1+c*(p+1),E=y+1+c*p;m.push(S,v,E),m.push(v,b,E)}this.setIndex(m),this.setAttribute("position",new fe(g,3)),this.setAttribute("normal",new fe(x,3)),this.setAttribute("uv",new fe(f,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}};var Lr=class i extends ke{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],d=new U,u=new U,m=[],g=[],x=[],f=[];for(let p=0;p<=n;p++){let y=[],S=p/n,v=o+S*a,b=t*Math.cos(v),E=Math.sqrt(t*t-b*b),R=0;p===0&&o===0?R=.5/e:p===n&&l===Math.PI&&(R=-.5/e);for(let _=0;_<=e;_++){let T=_/e,A=s+T*r;d.x=-E*Math.cos(A),d.y=b,d.z=E*Math.sin(A),g.push(d.x,d.y,d.z),u.copy(d).normalize(),x.push(u.x,u.y,u.z),f.push(T+R,1-S),y.push(c++)}h.push(y)}for(let p=0;p<n;p++)for(let y=0;y<e;y++){let S=h[p][y+1],v=h[p][y],b=h[p+1][y],E=h[p+1][y+1];(p!==0||o>0)&&m.push(S,v,E),(p!==n-1||l<Math.PI)&&m.push(v,b,E)}this.setIndex(m),this.setAttribute("position",new fe(g,3)),this.setAttribute("normal",new fe(x,3)),this.setAttribute("uv",new fe(f,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};function Qi(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];if(mu(s))s.isRenderTargetTexture?(Dt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone();else if(Array.isArray(s))if(mu(s[0])){let r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();t[e][n]=r}else t[e][n]=s.slice();else t[e][n]=s}}return t}function nn(i){let t={};for(let e=0;e<i.length;e++){let n=Qi(i[e]);for(let s in n)t[s]=n[s]}return t}function mu(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function Up(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function kc(i){let t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Jt.workingColorSpace}var sl={clone:Qi,merge:nn},Fp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Op=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,cn=class extends On{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Fp,this.fragmentShader=Op,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Qi(t.uniforms),this.uniformsGroups=Up(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let n in t.uniforms){let s=t.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=e[s.value]||null;break;case"c":this.uniforms[n].value=new Ct().setHex(s.value);break;case"v2":this.uniforms[n].value=new Lt().fromArray(s.value);break;case"v3":this.uniforms[n].value=new U().fromArray(s.value);break;case"v4":this.uniforms[n].value=new be().fromArray(s.value);break;case"m3":this.uniforms[n].value=new zt().fromArray(s.value);break;case"m4":this.uniforms[n].value=new ie().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},Jo=class extends cn{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Ee=class extends On{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ct(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ct(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=qr,this.normalScale=new Lt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Kn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};var Os=class extends On{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Ct(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ct(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=qr,this.normalScale=new Lt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Kn,this.combine=pa,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.envMapIntensity=t.envMapIntensity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},jo=class extends On{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Xu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Qo=class extends On{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function _s(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function sc(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}var Ti=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},ta=class extends Ti{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ac,endingEnd:ac}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case lc:r=t,a=2*e-n;break;case cc:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case lc:o=t,l=2*n-e;break;case cc:o=1,l=n+s[1]-s[0];break;default:o=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,m=this._weightNext,g=(n-e)/(s-e),x=g*g,f=x*g,p=-u*f+2*u*x-u*g,y=(1+u)*f+(-1.5-2*u)*x+(-.5+u)*g+1,S=(-1-m)*f+(1.5+m)*x+.5*g,v=m*f-m*x;for(let b=0;b!==a;++b)r[b]=p*o[h+b]+y*o[c+b]+S*o[l+b]+v*o[d+b];return r}},ea=class extends Ti{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(n-e)/(s-e),d=1-h;for(let u=0;u!==a;++u)r[u]=o[c+u]*d+o[l+u]*h;return r}},na=class extends Ti{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},ia=class extends Ti{interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this.inTangents,d=this.outTangents;if(!h||!d){let g=(n-e)/(s-e),x=1-g;for(let f=0;f!==a;++f)r[f]=o[c+f]*x+o[l+f]*g;return r}let u=a*2,m=t-1;for(let g=0;g!==a;++g){let x=o[c+g],f=o[l+g],p=m*u+g*2,y=d[p],S=d[p+1],v=t*u+g*2,b=h[v],E=h[v+1],R=kp(n,e,y,b,s);r[g]=hd(R,x,S,E,f)}return r}};function hd(i,t,e,n,s){let r=1-i;return r*r*r*t+3*r*r*i*e+3*r*i*i*n+i*i*i*s}function Bp(i,t,e,n,s){let r=1-i;return 3*r*r*(e-t)+6*r*i*(n-e)+3*i*i*(s-n)}function kp(i,t,e,n,s){let r=(i-t)/(s-t);for(let o=0;o<8;o++){let a=hd(r,t,e,n,s)-i;if(Math.abs(a)<1e-10)break;let l=Bp(r,t,e,n,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-a/l))}return r}var Mn=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=_s(e,this.TimeBufferType),this.values=_s(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:_s(t.times,Array),values:_s(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s),sc(t.settings)&&(n.settings={inTangents:_s(t.settings.inTangents,Array),outTangents:_s(t.settings.outTangents,Array)})}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new na(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new ea(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new ta(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new ia(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case dr:e=this.InterpolantFactoryMethodDiscrete;break;case Wo:e=this.InterpolantFactoryMethodLinear;break;case Do:e=this.InterpolantFactoryMethodSmooth;break;case oc:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Dt("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return dr;case this.InterpolantFactoryMethodLinear:return Wo;case this.InterpolantFactoryMethodSmooth:return Do;case this.InterpolantFactoryMethodBezier:return oc}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t;sc(this.settings)&&(gu(this.settings.inTangents,t),gu(this.settings.outTangents,t))}return this}trim(t,e){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(Ot("KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(Ot("KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){Ot("KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){Ot("KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(s!==void 0&&Ff(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){Ot("KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Do,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(s)l=!0;else{let d=a*n,u=d-n,m=d+n;for(let g=0;g!==n;++g){let x=e[d+g];if(x!==e[u+g]||x!==e[m+g]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let d=a*n,u=o*n;for(let m=0;m!==n;++m)e[u+m]=e[d+m]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,sc(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function gu(i,t){for(let e=0,n=i.length;e!==n;e+=2)i[e]*=t}Mn.prototype.ValueTypeName="";Mn.prototype.TimeBufferType=Float32Array;Mn.prototype.ValueBufferType=Float32Array;Mn.prototype.DefaultInterpolation=Wo;var Ei=class extends Mn{constructor(t,e,n){super(t,e,n)}};Ei.prototype.ValueTypeName="bool";Ei.prototype.ValueBufferType=Array;Ei.prototype.DefaultInterpolation=dr;Ei.prototype.InterpolantFactoryMethodLinear=void 0;Ei.prototype.InterpolantFactoryMethodSmooth=void 0;var sa=class extends Mn{constructor(t,e,n,s){super(t,e,n,s)}};sa.prototype.ValueTypeName="color";var ra=class extends Mn{constructor(t,e,n,s){super(t,e,n,s)}};ra.prototype.ValueTypeName="number";var oa=class extends Ti{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-e)/(s-e),c=t*a;for(let h=c+a;c!==h;c+=4)ln.slerpFlat(r,0,o,c-a,o,c,l);return r}},Dr=class extends Mn{constructor(t,e,n,s){super(t,e,n,s)}InterpolantFactoryMethodLinear(t){return new oa(this.times,this.values,this.getValueSize(),t)}};Dr.prototype.ValueTypeName="quaternion";Dr.prototype.InterpolantFactoryMethodSmooth=void 0;var Ai=class extends Mn{constructor(t,e,n){super(t,e,n)}};Ai.prototype.ValueTypeName="string";Ai.prototype.ValueBufferType=Array;Ai.prototype.DefaultInterpolation=dr;Ai.prototype.InterpolantFactoryMethodLinear=void 0;Ai.prototype.InterpolantFactoryMethodSmooth=void 0;var aa=class extends Mn{constructor(t,e,n,s){super(t,e,n,s)}};aa.prototype.ValueTypeName="vector";var Uo={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(xu(i)||(this.files[i]=t))},get:function(i){if(this.enabled!==!1&&!xu(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};function xu(i){try{let t=i.slice(i.indexOf(":")+1);return new URL(t).protocol==="blob:"}catch{return!1}}var la=class{constructor(t,e,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){let d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=c.length;d<u;d+=2){let m=c[d],g=c[d+1];if(m.global&&(m.lastIndex=0),m.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},ud=new la,Bs=class{constructor(t){this.manager=t!==void 0?t:ud,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};Bs.DEFAULT_MATERIAL_NAME="__DEFAULT";var Ms=new WeakMap,ca=class extends Bs{constructor(t){super(t)}load(t,e,n,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=this,o=Uo.get(`image:${t}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(t),setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0);else{let d=Ms.get(o);d===void 0&&(d=[],Ms.set(o,d)),d.push({onLoad:e,onError:s})}return o}let a=Rs("img");function l(){h(),e&&e(this);let d=Ms.get(this)||[];for(let u=0;u<d.length;u++){let m=d[u];m.onLoad&&m.onLoad(this)}Ms.delete(this),r.manager.itemEnd(t)}function c(d){h(),s&&s(d),Uo.remove(`image:${t}`);let u=Ms.get(this)||[];for(let m=0;m<u.length;m++){let g=u[m];g.onError&&g.onError(d)}Ms.delete(this),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),Uo.add(`image:${t}`,a),r.manager.itemStart(t),a.src=t,a}};var Nr=class extends Bs{constructor(t){super(t)}load(t,e,n,s){let r=new en,o=new ca(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(t,function(a){r.image=a,r.needsUpdate=!0,e!==void 0&&e(r)},n,s),r}},ks=class extends qe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ct(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}},Ri=class extends ks{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(qe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ct(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){let e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}},rc=new ie,yu=new U,vu=new U,Ur=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Lt(512,512),this.mapType=dn,this.map=null,this.mapPass=null,this.matrix=new ie,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ns,this._frameExtents=new Lt(1,1),this._viewportCount=1,this._viewports=[new be(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera;yu.setFromMatrixPosition(t.matrixWorld),e.position.copy(yu),vu.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(vu),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,n,s){rc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),n.setFromProjectionMatrix(rc,t.coordinateSystem,t.reversedDepth);let r=this._frameExtents,o=s?s.z/r.x:1,a=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;t.coordinateSystem===As||t.reversedDepth?e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,1,0,0,0,0,1):e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,.5,.5,0,0,0,1),e.multiply(rc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},Io=new U,Lo=new ln,qn=new U,Fr=class extends qe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ie,this.projectionMatrix=new ie,this.projectionMatrixInverse=new ie,this.coordinateSystem=Fn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(Io,Lo,qn),qn.x===1&&qn.y===1&&qn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Io,Lo,qn.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(Io,Lo,qn),qn.x===1&&qn.y===1&&qn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Io,Lo,qn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Si=new U,_u=new Lt,Mu=new Lt,De=class extends Fr{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Ps*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(hr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ps*2*Math.atan(Math.tan(hr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Si.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Si.x,Si.y).multiplyScalar(-t/Si.z),Si.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Si.x,Si.y).multiplyScalar(-t/Si.z)}getViewSize(t,e){return this.getViewBounds(t,_u,Mu),e.subVectors(Mu,_u)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(hr*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};var pc=class extends Ur{constructor(){super(new De(90,1,.5,500)),this.isPointLightShadow=!0}},Zi=class extends ks{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new pc}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}},zs=class extends Fr{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},mc=class extends Ur{constructor(){super(new zs(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ci=class extends ks{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(qe.DEFAULT_UP),this.updateMatrix(),this.target=new qe,this.shadow=new mc}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}};var bs=-90,Ss=1,ha=class extends qe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new De(bs,Ss,t,e);s.layers=this.layers,this.add(s);let r=new De(bs,Ss,t,e);r.layers=this.layers,this.add(r);let o=new De(bs,Ss,t,e);o.layers=this.layers,this.add(o);let a=new De(bs,Ss,t,e);a.layers=this.layers,this.add(a);let l=new De(bs,Ss,t,e);l.layers=this.layers,this.add(l);let c=new De(bs,Ss,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===Fn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===As)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),m=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let f=!1;t.isWebGLRenderer===!0?f=t.state.buffers.depth.getReversed():f=t.reversedDepthBuffer,t.setRenderTarget(n,0,s),f&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,s),f&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,2,s),f&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,3,s),f&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,s),f&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,s),f&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(d,u,m),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},ua=class extends De{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var zc="\\[\\]\\.:\\/",zp=new RegExp("["+zc+"]","g"),Hc="[^"+zc+"]",Hp="[^"+zc.replace("\\.","")+"]",Vp=/((?:WC+[\/:])*)/.source.replace("WC",Hc),Gp=/(WCOD+)?/.source.replace("WCOD",Hp),Wp=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Hc),Xp=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Hc),qp=new RegExp("^"+Vp+Gp+Wp+Xp+"$"),Yp=["material","materials","bones","map"],gc=class{constructor(t,e,n){let s=n||Me.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},Me=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(zp,"")}static parseTrackName(t){let e=qp.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Yp.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=n(a.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Dt("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){Ot("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Ot("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Ot("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Ot("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Ot("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){Ot("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){Ot("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[s];if(o===void 0){let c=e.nodeName;Ot("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){Ot("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Ot("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Me.Composite=gc;Me.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Me.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Me.prototype.GetterByBindingType=[Me.prototype._getValue_direct,Me.prototype._getValue_array,Me.prototype._getValue_arrayElement,Me.prototype._getValue_toArray];Me.prototype.SetterByBindingTypeAndVersioning=[[Me.prototype._setValue_direct,Me.prototype._setValue_direct_setNeedsUpdate,Me.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Me.prototype._setValue_array,Me.prototype._setValue_array_setNeedsUpdate,Me.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Me.prototype._setValue_arrayElement,Me.prototype._setValue_arrayElement_setNeedsUpdate,Me.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Me.prototype._setValue_fromArray,Me.prototype._setValue_fromArray_setNeedsUpdate,Me.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var av=new Float32Array(1);var Yc=class Yc{constructor(t,e,n,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,s){let r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=s,this}};Yc.prototype.isMatrix2=!0;var xc=Yc;function Vc(i,t,e,n){let s=$p(n);switch(e){case Nc:return i*t;case Ma:return i*t/s.components*s.byteLength;case ba:return i*t/s.components*s.byteLength;case Ui:return i*t*2/s.components*s.byteLength;case Sa:return i*t*2/s.components*s.byteLength;case Uc:return i*t*3/s.components*s.byteLength;case Rn:return i*t*4/s.components*s.byteLength;case wa:return i*t*4/s.components*s.byteLength;case zr:case Hr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Vr:case Gr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Ea:case Ra:return Math.max(i,16)*Math.max(t,8)/4;case Ta:case Aa:return Math.max(i,8)*Math.max(t,8)/2;case Ca:case Pa:case La:case Da:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ia:case Wr:case Na:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Ua:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Fa:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Oa:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Ba:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case ka:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case za:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Ha:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Va:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Ga:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Wa:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Xa:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case qa:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Ya:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case $a:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Za:case Ka:case Ja:return Math.ceil(i/4)*Math.ceil(t/4)*16;case ja:case Qa:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Xr:case tl:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function $p(i){switch(i){case dn:case Pc:return{byteLength:1,components:1};case Vs:case Ic:case Hn:return{byteLength:2,components:1};case va:case _a:return{byteLength:2,components:4};case zn:case ya:case An:return{byteLength:4,components:1};case Lc:case Dc:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Dt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function Dd(){let i=null,t=!1,e=null,n=null;function s(r,o){n=i.requestAnimationFrame(s),e(r,o)}return{start:function(){t!==!0&&e!==null&&i!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Kp(i){let t=new WeakMap;function e(a,l){let c=a.array,h=a.usage,d=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),a.onUploadCallback();let m;if(c instanceof Float32Array)m=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)m=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=i.SHORT;else if(c instanceof Uint32Array)m=i.UNSIGNED_INT;else if(c instanceof Int32Array)m=i.INT;else if(c instanceof Int8Array)m=i.BYTE;else if(c instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,l,c){let h=l.array,d=l.updateRanges;if(i.bindBuffer(c,a),d.length===0)i.bufferSubData(c,0,h);else{d.sort((m,g)=>m.start-g.start);let u=0;for(let m=1;m<d.length;m++){let g=d[u],x=d[m];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++u,d[u]=x)}d.length=u+1;for(let m=0,g=d.length;m<g;m++){let x=d[m];i.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var Jp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,jp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Qp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,tm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,em=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,nm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,im=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,sm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,rm=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,om=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,am=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,lm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,cm=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,hm=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,um=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,dm=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,fm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,pm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,mm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,gm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,xm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,ym=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,vm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,_m=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Mm=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,bm=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Sm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,wm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Tm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Em=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Am="gl_FragColor = linearToOutputTexel( gl_FragColor );",Rm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Cm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Pm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Im=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Lm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Dm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Nm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Um=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Fm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Om=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Bm=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,km=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,zm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Hm=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Vm=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Gm=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,Wm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Xm=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,qm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ym=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,$m=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Zm=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Km=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Jm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,jm=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Qm=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,t0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,e0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,n0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,i0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,s0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,r0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,o0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,a0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,l0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,c0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,h0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,u0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,d0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,f0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,p0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,m0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,g0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,x0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,y0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,v0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,_0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,M0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,b0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,S0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,w0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,T0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,E0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,A0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,R0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,C0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,P0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,I0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,L0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,D0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,N0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,U0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,F0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,O0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,B0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,k0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,z0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,H0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,V0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,G0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,W0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,X0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,q0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Y0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,$0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Z0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,K0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,J0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,j0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Q0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,tg=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,eg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ng=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ig=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,sg=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,rg=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,og=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,ag=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,lg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cg=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,hg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ug=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,dg=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,pg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,mg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,gg=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,yg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,vg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_g=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Mg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,bg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Sg=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,wg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Tg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Eg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Ag=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Rg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Cg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Pg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,qt={alphahash_fragment:Jp,alphahash_pars_fragment:jp,alphamap_fragment:Qp,alphamap_pars_fragment:tm,alphatest_fragment:em,alphatest_pars_fragment:nm,aomap_fragment:im,aomap_pars_fragment:sm,batching_pars_vertex:rm,batching_vertex:om,begin_vertex:am,beginnormal_vertex:lm,bsdfs:cm,iridescence_fragment:hm,bumpmap_pars_fragment:um,clipping_planes_fragment:dm,clipping_planes_pars_fragment:fm,clipping_planes_pars_vertex:pm,clipping_planes_vertex:mm,color_fragment:gm,color_pars_fragment:xm,color_pars_vertex:ym,color_vertex:vm,common:_m,cube_uv_reflection_fragment:Mm,defaultnormal_vertex:bm,displacementmap_pars_vertex:Sm,displacementmap_vertex:wm,emissivemap_fragment:Tm,emissivemap_pars_fragment:Em,colorspace_fragment:Am,colorspace_pars_fragment:Rm,envmap_fragment:Cm,envmap_common_pars_fragment:Pm,envmap_pars_fragment:Im,envmap_pars_vertex:Lm,envmap_physical_pars_fragment:Gm,envmap_vertex:Dm,fog_vertex:Nm,fog_pars_vertex:Um,fog_fragment:Fm,fog_pars_fragment:Om,gradientmap_pars_fragment:Bm,lightmap_pars_fragment:km,lights_lambert_fragment:zm,lights_lambert_pars_fragment:Hm,lights_pars_begin:Vm,lights_toon_fragment:Wm,lights_toon_pars_fragment:Xm,lights_phong_fragment:qm,lights_phong_pars_fragment:Ym,lights_physical_fragment:$m,lights_physical_pars_fragment:Zm,lights_fragment_begin:Km,lights_fragment_maps:Jm,lights_fragment_end:jm,lightprobes_pars_fragment:Qm,logdepthbuf_fragment:t0,logdepthbuf_pars_fragment:e0,logdepthbuf_pars_vertex:n0,logdepthbuf_vertex:i0,map_fragment:s0,map_pars_fragment:r0,map_particle_fragment:o0,map_particle_pars_fragment:a0,metalnessmap_fragment:l0,metalnessmap_pars_fragment:c0,morphinstance_vertex:h0,morphcolor_vertex:u0,morphnormal_vertex:d0,morphtarget_pars_vertex:f0,morphtarget_vertex:p0,normal_fragment_begin:m0,normal_fragment_maps:g0,normal_pars_fragment:x0,normal_pars_vertex:y0,normal_vertex:v0,normalmap_pars_fragment:_0,clearcoat_normal_fragment_begin:M0,clearcoat_normal_fragment_maps:b0,clearcoat_pars_fragment:S0,iridescence_pars_fragment:w0,opaque_fragment:T0,packing:E0,premultiplied_alpha_fragment:A0,project_vertex:R0,dithering_fragment:C0,dithering_pars_fragment:P0,roughnessmap_fragment:I0,roughnessmap_pars_fragment:L0,shadowmap_pars_fragment:D0,shadowmap_pars_vertex:N0,shadowmap_vertex:U0,shadowmask_pars_fragment:F0,skinbase_vertex:O0,skinning_pars_vertex:B0,skinning_vertex:k0,skinnormal_vertex:z0,specularmap_fragment:H0,specularmap_pars_fragment:V0,tonemapping_fragment:G0,tonemapping_pars_fragment:W0,transmission_fragment:X0,transmission_pars_fragment:q0,uv_pars_fragment:Y0,uv_pars_vertex:$0,uv_vertex:Z0,worldpos_vertex:K0,background_vert:J0,background_frag:j0,backgroundCube_vert:Q0,backgroundCube_frag:tg,cube_vert:eg,cube_frag:ng,depth_vert:ig,depth_frag:sg,distance_vert:rg,distance_frag:og,equirect_vert:ag,equirect_frag:lg,linedashed_vert:cg,linedashed_frag:hg,meshbasic_vert:ug,meshbasic_frag:dg,meshlambert_vert:fg,meshlambert_frag:pg,meshmatcap_vert:mg,meshmatcap_frag:gg,meshnormal_vert:xg,meshnormal_frag:yg,meshphong_vert:vg,meshphong_frag:_g,meshphysical_vert:Mg,meshphysical_frag:bg,meshtoon_vert:Sg,meshtoon_frag:wg,points_vert:Tg,points_frag:Eg,shadow_vert:Ag,shadow_frag:Rg,sprite_vert:Cg,sprite_frag:Pg},pt={common:{diffuse:{value:new Ct(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new zt},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new zt}},envmap:{envMap:{value:null},envMapRotation:{value:new zt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new zt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new zt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new zt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new zt},normalScale:{value:new Lt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new zt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new zt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new zt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new zt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ct(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new U},probesMax:{value:new U},probesResolution:{value:new U}},points:{diffuse:{value:new Ct(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0},uvTransform:{value:new zt}},sprite:{diffuse:{value:new Ct(16777215)},opacity:{value:1},center:{value:new Lt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new zt},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0}}},ni={basic:{uniforms:nn([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.fog]),vertexShader:qt.meshbasic_vert,fragmentShader:qt.meshbasic_frag},lambert:{uniforms:nn([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new Ct(0)},envMapIntensity:{value:1}}]),vertexShader:qt.meshlambert_vert,fragmentShader:qt.meshlambert_frag},phong:{uniforms:nn([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new Ct(0)},specular:{value:new Ct(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:qt.meshphong_vert,fragmentShader:qt.meshphong_frag},standard:{uniforms:nn([pt.common,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.roughnessmap,pt.metalnessmap,pt.fog,pt.lights,{emissive:{value:new Ct(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:qt.meshphysical_vert,fragmentShader:qt.meshphysical_frag},toon:{uniforms:nn([pt.common,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.gradientmap,pt.fog,pt.lights,{emissive:{value:new Ct(0)}}]),vertexShader:qt.meshtoon_vert,fragmentShader:qt.meshtoon_frag},matcap:{uniforms:nn([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,{matcap:{value:null}}]),vertexShader:qt.meshmatcap_vert,fragmentShader:qt.meshmatcap_frag},points:{uniforms:nn([pt.points,pt.fog]),vertexShader:qt.points_vert,fragmentShader:qt.points_frag},dashed:{uniforms:nn([pt.common,pt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:qt.linedashed_vert,fragmentShader:qt.linedashed_frag},depth:{uniforms:nn([pt.common,pt.displacementmap]),vertexShader:qt.depth_vert,fragmentShader:qt.depth_frag},normal:{uniforms:nn([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,{opacity:{value:1}}]),vertexShader:qt.meshnormal_vert,fragmentShader:qt.meshnormal_frag},sprite:{uniforms:nn([pt.sprite,pt.fog]),vertexShader:qt.sprite_vert,fragmentShader:qt.sprite_frag},background:{uniforms:{uvTransform:{value:new zt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:qt.background_vert,fragmentShader:qt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new zt}},vertexShader:qt.backgroundCube_vert,fragmentShader:qt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:qt.cube_vert,fragmentShader:qt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:qt.equirect_vert,fragmentShader:qt.equirect_frag},distance:{uniforms:nn([pt.common,pt.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:qt.distance_vert,fragmentShader:qt.distance_frag},shadow:{uniforms:nn([pt.lights,pt.fog,{color:{value:new Ct(0)},opacity:{value:1}}]),vertexShader:qt.shadow_vert,fragmentShader:qt.shadow_frag}};ni.physical={uniforms:nn([ni.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new zt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new zt},clearcoatNormalScale:{value:new Lt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new zt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new zt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new zt},sheen:{value:0},sheenColor:{value:new Ct(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new zt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new zt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new zt},transmissionSamplerSize:{value:new Lt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new zt},attenuationDistance:{value:0},attenuationColor:{value:new Ct(0)},specularColor:{value:new Ct(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new zt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new zt},anisotropyVector:{value:new Lt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new zt}}]),vertexShader:qt.meshphysical_vert,fragmentShader:qt.meshphysical_frag};var rl={r:0,b:0,g:0},Ig=new ie,Nd=new zt;Nd.set(-1,0,0,0,1,0,0,0,1);function Lg(i,t,e,n,s,r){let o=new Ct(0),a=s===!0?0:1,l,c,h=null,d=0,u=null;function m(y){let S=y.isScene===!0?y.background:null;if(S&&S.isTexture){let v=y.backgroundBlurriness>0;S=t.get(S,v)}return S}function g(y){let S=!1,v=m(y);v===null?f(o,a):v&&v.isColor&&(f(v,1),S=!0);let b=i.xr.getEnvironmentBlendMode();b==="additive"?e.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(i.autoClear||S)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function x(y,S){let v=m(S);v&&(v.isCubeTexture||v.mapping===Br)?(c===void 0&&(c=new Ht(new ze(1,1,1),new cn({name:"BackgroundCubeMaterial",uniforms:Qi(ni.backgroundCube.uniforms),vertexShader:ni.backgroundCube.vertexShader,fragmentShader:ni.backgroundCube.fragmentShader,side:Ke,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(b,E,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=v,c.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Ig.makeRotationFromEuler(S.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Nd),c.material.toneMapped=Jt.getTransfer(v.colorSpace)!==oe,(h!==v||d!==v.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,h=v,d=v.version,u=i.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new Ht(new _n(2,2),new cn({name:"BackgroundMaterial",uniforms:Qi(ni.background.uniforms),vertexShader:ni.background.vertexShader,fragmentShader:ni.background.fragmentShader,side:Pi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.toneMapped=Jt.getTransfer(v.colorSpace)!==oe,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(h!==v||d!==v.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=v,d=v.version,u=i.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function f(y,S){y.getRGB(rl,kc(i)),e.buffers.color.setClear(rl.r,rl.g,rl.b,S,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(y,S=1){o.set(y),a=S,f(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(y){a=y,f(o,a)},render:g,addToRenderList:x,dispose:p}}function Dg(i,t){let e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null),r=s,o=!1;function a(I,P,N,L,F){let H=!1,W=d(I,L,N,P);r!==W&&(r=W,c(r.object)),H=m(I,L,N,F),H&&g(I,L,N,F),F!==null&&t.update(F,i.ELEMENT_ARRAY_BUFFER),(H||o)&&(o=!1,v(I,P,N,L),F!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(F).buffer))}function l(){return i.createVertexArray()}function c(I){return i.bindVertexArray(I)}function h(I){return i.deleteVertexArray(I)}function d(I,P,N,L){let F=L.wireframe===!0,H=n[P.id];H===void 0&&(H={},n[P.id]=H);let W=I.isInstancedMesh===!0?I.id:0,Q=H[W];Q===void 0&&(Q={},H[W]=Q);let q=Q[N.id];q===void 0&&(q={},Q[N.id]=q);let K=q[F];return K===void 0&&(K=u(l()),q[F]=K),K}function u(I){let P=[],N=[],L=[];for(let F=0;F<e;F++)P[F]=0,N[F]=0,L[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:N,attributeDivisors:L,object:I,attributes:{},index:null}}function m(I,P,N,L){let F=r.attributes,H=P.attributes,W=0,Q=N.getAttributes();for(let q in Q)if(Q[q].location>=0){let j=F[q],st=H[q];if(st===void 0&&(q==="instanceMatrix"&&I.instanceMatrix&&(st=I.instanceMatrix),q==="instanceColor"&&I.instanceColor&&(st=I.instanceColor)),j===void 0||j.attribute!==st||st&&j.data!==st.data)return!0;W++}return r.attributesNum!==W||r.index!==L}function g(I,P,N,L){let F={},H=P.attributes,W=0,Q=N.getAttributes();for(let q in Q)if(Q[q].location>=0){let j=H[q];j===void 0&&(q==="instanceMatrix"&&I.instanceMatrix&&(j=I.instanceMatrix),q==="instanceColor"&&I.instanceColor&&(j=I.instanceColor));let st={};st.attribute=j,j&&j.data&&(st.data=j.data),F[q]=st,W++}r.attributes=F,r.attributesNum=W,r.index=L}function x(){let I=r.newAttributes;for(let P=0,N=I.length;P<N;P++)I[P]=0}function f(I){p(I,0)}function p(I,P){let N=r.newAttributes,L=r.enabledAttributes,F=r.attributeDivisors;N[I]=1,L[I]===0&&(i.enableVertexAttribArray(I),L[I]=1),F[I]!==P&&(i.vertexAttribDivisor(I,P),F[I]=P)}function y(){let I=r.newAttributes,P=r.enabledAttributes;for(let N=0,L=P.length;N<L;N++)P[N]!==I[N]&&(i.disableVertexAttribArray(N),P[N]=0)}function S(I,P,N,L,F,H,W){W===!0?i.vertexAttribIPointer(I,P,N,F,H):i.vertexAttribPointer(I,P,N,L,F,H)}function v(I,P,N,L){x();let F=L.attributes,H=N.getAttributes(),W=P.defaultAttributeValues;for(let Q in H){let q=H[Q];if(q.location>=0){let K=F[Q];if(K===void 0&&(Q==="instanceMatrix"&&I.instanceMatrix&&(K=I.instanceMatrix),Q==="instanceColor"&&I.instanceColor&&(K=I.instanceColor)),K!==void 0){let j=K.normalized,st=K.itemSize,at=t.get(K);if(at===void 0)continue;let $t=at.buffer,Pt=at.type,kt=at.bytesPerElement,$=Pt===i.INT||Pt===i.UNSIGNED_INT||K.gpuType===ya;if(K.isInterleavedBufferAttribute){let et=K.data,vt=et.stride,Nt=K.offset;if(et.isInstancedInterleavedBuffer){for(let yt=0;yt<q.locationSize;yt++)p(q.location+yt,et.meshPerAttribute);I.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=et.meshPerAttribute*et.count)}else for(let yt=0;yt<q.locationSize;yt++)f(q.location+yt);i.bindBuffer(i.ARRAY_BUFFER,$t);for(let yt=0;yt<q.locationSize;yt++)S(q.location+yt,st/q.locationSize,Pt,j,vt*kt,(Nt+st/q.locationSize*yt)*kt,$)}else{if(K.isInstancedBufferAttribute){for(let et=0;et<q.locationSize;et++)p(q.location+et,K.meshPerAttribute);I.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let et=0;et<q.locationSize;et++)f(q.location+et);i.bindBuffer(i.ARRAY_BUFFER,$t);for(let et=0;et<q.locationSize;et++)S(q.location+et,st/q.locationSize,Pt,j,st*kt,st/q.locationSize*et*kt,$)}}else if(W!==void 0){let j=W[Q];if(j!==void 0)switch(j.length){case 2:i.vertexAttrib2fv(q.location,j);break;case 3:i.vertexAttrib3fv(q.location,j);break;case 4:i.vertexAttrib4fv(q.location,j);break;default:i.vertexAttrib1fv(q.location,j)}}}}y()}function b(){T();for(let I in n){let P=n[I];for(let N in P){let L=P[N];for(let F in L){let H=L[F];for(let W in H)h(H[W].object),delete H[W];delete L[F]}}delete n[I]}}function E(I){if(n[I.id]===void 0)return;let P=n[I.id];for(let N in P){let L=P[N];for(let F in L){let H=L[F];for(let W in H)h(H[W].object),delete H[W];delete L[F]}}delete n[I.id]}function R(I){for(let P in n){let N=n[P];for(let L in N){let F=N[L];if(F[I.id]===void 0)continue;let H=F[I.id];for(let W in H)h(H[W].object),delete H[W];delete F[I.id]}}}function _(I){for(let P in n){let N=n[P],L=I.isInstancedMesh===!0?I.id:0,F=N[L];if(F!==void 0){for(let H in F){let W=F[H];for(let Q in W)h(W[Q].object),delete W[Q];delete F[H]}delete N[L],Object.keys(N).length===0&&delete n[P]}}}function T(){A(),o=!0,r!==s&&(r=s,c(r.object))}function A(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:T,resetDefaultState:A,dispose:b,releaseStatesOfGeometry:E,releaseStatesOfObject:_,releaseStatesOfProgram:R,initAttributes:x,enableAttribute:f,disableUnusedAttributes:y}}function Ng(i,t,e){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),e.update(c,n,1)}function o(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),e.update(c,n,h))}function a(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let m=0;m<h;m++)u+=c[m];e.update(u,n,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function Ug(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let R=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(R){return!(R!==Rn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){let _=R===Hn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(R!==dn&&R!==An&&!_&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(Dt("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let d=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&u===!1&&Dt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),f=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),y=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),S=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),b=i.getParameter(i.MAX_SAMPLES),E=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:m,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:f,maxAttributes:p,maxVertexUniforms:y,maxVaryings:S,maxFragmentUniforms:v,maxSamples:b,samples:E}}function Fg(i){let t=this,e=null,n=0,s=!1,r=!1,o=new Nn,a=new zt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){let m=d.length!==0||u||n!==0||s;return s=u,n=d.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,m){let g=d.clippingPlanes,x=d.clipIntersection,f=d.clipShadows,p=i.get(d);if(!s||g===null||g.length===0||r&&!f)r?h(null):c();else{let y=r?0:n,S=y*4,v=p.clippingState||null;l.value=v,v=h(g,u,S,m);for(let b=0;b!==S;++b)v[b]=e[b];p.clippingState=v,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,u,m,g){let x=d!==null?d.length:0,f=null;if(x!==0){if(f=l.value,g!==!0||f===null){let p=m+x*4,y=u.matrixWorldInverse;a.getNormalMatrix(y),(f===null||f.length<p)&&(f=new Float32Array(p));for(let S=0,v=m;S!==x;++S,v+=4)o.copy(d[S]).applyMatrix4(y,a),o.normal.toArray(f,v),f[v+3]=o.constant}l.value=f,l.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,f}}var Xs=4,Og=6,Bg=20,kg=256,Yr=new zs,dd=new Ct,$c=null,Zc=0,Kc=0,Jc=!1,zg=new U,ts=new U,Ys=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,s=100,r={}){let{size:o=256,position:a=zg}=r;$c=this._renderer.getRenderTarget(),Zc=this._renderer.getActiveCubeFace(),Kc=this._renderer.getActiveMipmapLevel(),Jc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=md(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=pd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget($c,Zc,Kc),this._renderer.xr.enabled=Jc,t.scissorTest=!1,Ws(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Li||t.mapping===ji?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),$c=this._renderer.getRenderTarget(),Zc=this._renderer.getActiveCubeFace(),Kc=this._renderer.getActiveMipmapLevel(),Jc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Ze,minFilter:Ze,generateMipmaps:!1,type:Hn,format:Rn,colorSpace:fr,depthBuffer:!1},s=fd(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=fd(t,e,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Hg(r)),this._blurMaterial=Gg(r,t,e),this._ggxMaterial=Vg(r,t,e)}return s}_compileMaterial(t){let e=new Ht(new ke,t);this._renderer.compile(e,Yr)}_sceneToCubeUV(t,e,n,s,r){let l=new De(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,m=d.toneMapping;d.getClearColor(dd),d.toneMapping=kn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Ht(new ze,new Bn({name:"PMREM.Background",side:Ke,depthWrite:!1,depthTest:!1})));let x=this._backgroundBox,f=x.material,p=!1,y=t.background;y?y.isColor&&(f.color.copy(y),t.background=null,p=!0):(f.color.copy(dd),p=!0);for(let S=0;S<6;S++){let v=S%3;v===0?(l.up.set(0,c[S],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[S],r.y,r.z)):v===1?(l.up.set(0,0,c[S]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[S],r.z)):(l.up.set(0,c[S],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[S]));let b=this._cubeSize;Ws(s,v*b,S>2?b:0,b,b),d.setRenderTarget(s),p&&d.render(x,l),d.render(t,l)}d.toneMapping=m,d.autoClear=u,t.background=y}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===Li||t.mapping===ji;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=md()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=pd());let r=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;let a=r.uniforms;a.envMap.value=t;let l=this._cubeSize;Ws(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Yr)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){let s=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[n];a.material=o;let l=o.uniforms,c=n/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),d=Math.sqrt(c*c-h*h),u=c*1.25,m=d*u,{_lodMax:g}=this,x=this._sizeLods[n],f=3*x*(n>g-Xs?n-g+Xs:0),p=4*(this._cubeSize-x);l.envMap.value=t.texture,l.roughness.value=m,l.mipInt.value=g-e,Ws(r,f,p,3*x,2*x),s.setRenderTarget(r),s.render(a,Yr),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-n,Ws(t,f,p,3*x,2*x),s.setRenderTarget(t),s.render(a,Yr)}_blur(t,e,n,s){let r=this._pingPongRenderTarget,o=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(t,r,e,n,o),this._blurPass(r,t,n,n,o)}_blurPass(t,e,n,s,r){let o=this._renderer,a=this._blurMaterial,l=this._lodMeshes[s];l.material=a;let c=a.uniforms;c.envMap.value=t.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;let h=this._sizeLods[s],d=3*h*(s>this._lodMax-Xs?s-this._lodMax+Xs:0),u=4*(this._cubeSize-h);Ws(e,d,u,3*h,2*h),o.setRenderTarget(e),o.render(l,Yr)}};function Hg(i){let t=[],e=[],n=i,s=i-Xs+1+Og;for(let r=0;r<s;r++){let o=Math.pow(2,n);t.push(o);let a=1/(o-2),l=-a,c=1+a,h=[l,l,c,l,c,c,l,l,c,c,l,c],d=6,u=6,m=3,g=new Float32Array(m*u*d),x=new Float32Array(m*u*d);for(let p=0;p<d;p++){let y=p%3*2/3-1,S=p>2?0:-1,v=[y,S,0,y+2/3,S,0,y+2/3,S+1,0,y,S,0,y+2/3,S+1,0,y,S+1,0];g.set(v,m*u*p);for(let b=0;b<u;b++){let E=h[b*2]*2-1,R=h[b*2+1]*2-1;p===0?ts.set(1,R,E):p===1?ts.set(-E,1,-R):p===2?ts.set(-E,R,1):p===3?ts.set(-1,R,-E):p===4?ts.set(-E,-1,R):ts.set(E,R,-1),ts.toArray(x,(p*u+b)*m)}}let f=new ke;f.setAttribute("position",new $e(g,m)),f.setAttribute("outputDirection",new $e(x,m)),e.push(new Ht(f,null)),n>Xs&&n--}return{lodMeshes:e,sizeLods:t}}function fd(i,t,e){let n=new un(i,t,e);return n.texture.mapping=Br,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ws(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Vg(i,t,e){return new cn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:kg,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:cl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Qn,depthTest:!1,depthWrite:!1})}function Gg(i,t,e){return new cn({name:"SphericalGaussianBlur",defines:{SAMPLES:Bg,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:cl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:Qn,depthTest:!1,depthWrite:!1})}function pd(){return new cn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:cl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Qn,depthTest:!1,depthWrite:!1})}function md(){return new cn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:cl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Qn,depthTest:!1,depthWrite:!1})}function cl(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var al=class extends un{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Sr(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new ze(5,5,5),r=new cn({name:"CubemapFromEquirect",uniforms:Qi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ke,blending:Qn});r.uniforms.tEquirect.value=e;let o=new Ht(s,r),a=e.minFilter;return e.minFilter===Di&&(e.minFilter=Ze),new ha(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}};function Wg(i){let t=new WeakMap,e=new WeakMap,n=null;function s(u,m=!1){return u==null?null:m?o(u):r(u)}function r(u){if(u&&u.isTexture){let m=u.mapping;if(m===ma||m===ga)if(t.has(u)){let g=t.get(u).texture;return a(g,u.mapping)}else{let g=u.image;if(g&&g.height>0){let x=new al(g.height);return x.fromEquirectangularTexture(i,u),t.set(u,x),u.addEventListener("dispose",c),a(x.texture,u.mapping)}else return null}}return u}function o(u){if(u&&u.isTexture){let m=u.mapping,g=m===ma||m===ga,x=m===Li||m===ji;if(g||x){let f=e.get(u),p=f!==void 0?f.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==p)return n===null&&(n=new Ys(i)),f=g?n.fromEquirectangular(u,f):n.fromCubemap(u,f),f.texture.pmremVersion=u.pmremVersion,e.set(u,f),f.texture;if(f!==void 0)return f.texture;{let y=u.image;return g&&y&&y.height>0||x&&y&&l(y)?(n===null&&(n=new Ys(i)),f=g?n.fromEquirectangular(u):n.fromCubemap(u),f.texture.pmremVersion=u.pmremVersion,e.set(u,f),u.addEventListener("dispose",h),f.texture):null}}}return u}function a(u,m){return m===ma?u.mapping=Li:m===ga&&(u.mapping=ji),u}function l(u){let m=0,g=6;for(let x=0;x<g;x++)u[x]!==void 0&&m++;return m===g}function c(u){let m=u.target;m.removeEventListener("dispose",c);let g=t.get(m);g!==void 0&&(t.delete(m),g.dispose())}function h(u){let m=u.target;m.removeEventListener("dispose",h);let g=e.get(m);g!==void 0&&(e.delete(m),g.dispose())}function d(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:d}}function Xg(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s=i.getExtension(n);return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let s=e(n);return s===null&&Wi("WebGLRenderer: "+n+" extension not supported."),s}}}function qg(i,t,e,n){let s={},r=new WeakMap;function o(d){let u=d.target;u.index!==null&&t.remove(u.index);for(let g in u.attributes)t.remove(u.attributes[g]);u.removeEventListener("dispose",o),delete s[u.id];let m=r.get(u);m&&(t.remove(m),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function a(d,u){return s[u.id]===!0||(u.addEventListener("dispose",o),s[u.id]=!0,e.memory.geometries++),u}function l(d){let u=d.attributes;for(let m in u)t.update(u[m],i.ARRAY_BUFFER)}function c(d){let u=[],m=d.index,g=d.attributes.position,x=0;if(g===void 0)return;if(m!==null){let y=m.array;x=m.version;for(let S=0,v=y.length;S<v;S+=3){let b=y[S+0],E=y[S+1],R=y[S+2];u.push(b,E,E,R,R,b)}}else{let y=g.array;x=g.version;for(let S=0,v=y.length/3-1;S<v;S+=3){let b=S+0,E=S+1,R=S+2;u.push(b,E,E,R,R,b)}}let f=new(g.count>=65535?qi:Xi)(u,1);f.version=x;let p=r.get(d);p&&t.remove(p),r.set(d,f)}function h(d){let u=r.get(d);if(u){let m=d.index;m!==null&&u.version<m.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:h}}function Yg(i,t,e){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,u){i.drawElements(n,u,r,d*o),e.update(u,n,1)}function c(d,u,m){m!==0&&(i.drawElementsInstanced(n,u,r,d*o,m),e.update(u,n,m))}function h(d,u,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,d,0,m);let x=0;for(let f=0;f<m;f++)x+=u[f];e.update(x,n,1)}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function $g(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:Ot("WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Zg(i,t,e){let n=new WeakMap,s=new be;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0,u=n.get(a);if(u===void 0||u.count!==d){let T=function(){R.dispose(),n.delete(a),a.removeEventListener("dispose",T)};u!==void 0&&u.texture.dispose();let m=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,f=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],y=a.morphAttributes.color||[],S=0;m===!0&&(S=1),g===!0&&(S=2),x===!0&&(S=3);let v=a.attributes.position.count*S,b=1;v>t.maxTextureSize&&(b=Math.ceil(v/t.maxTextureSize),v=t.maxTextureSize);let E=new Float32Array(v*b*4*d),R=new gr(E,v,b,d);R.type=An,R.needsUpdate=!0;let _=S*4;for(let A=0;A<d;A++){let I=f[A],P=p[A],N=y[A],L=v*b*4*A;for(let F=0;F<I.count;F++){let H=F*_;m===!0&&(s.fromBufferAttribute(I,F),E[L+H+0]=s.x,E[L+H+1]=s.y,E[L+H+2]=s.z,E[L+H+3]=0),g===!0&&(s.fromBufferAttribute(P,F),E[L+H+4]=s.x,E[L+H+5]=s.y,E[L+H+6]=s.z,E[L+H+7]=0),x===!0&&(s.fromBufferAttribute(N,F),E[L+H+8]=s.x,E[L+H+9]=s.y,E[L+H+10]=s.z,E[L+H+11]=N.itemSize===4?s.w:1)}}u={count:d,texture:R,size:new Lt(v,b)},n.set(a,u),a.addEventListener("dispose",T)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let m=0;for(let x=0;x<c.length;x++)m+=c[x];let g=a.morphTargetsRelative?1:1-m;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function Kg(i,t,e,n,s){let r=new WeakMap;function o(c){let h=s.render.frame,d=c.geometry,u=t.get(c,d);if(r.get(u)!==h&&(t.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let m=c.skeleton;r.get(m)!==h&&(m.update(),r.set(m,h))}return u}function a(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:o,dispose:a}}var Jg={[Sc]:"LINEAR_TONE_MAPPING",[wc]:"REINHARD_TONE_MAPPING",[Tc]:"CINEON_TONE_MAPPING",[Or]:"ACES_FILMIC_TONE_MAPPING",[Ac]:"AGX_TONE_MAPPING",[Rc]:"NEUTRAL_TONE_MAPPING",[Ec]:"CUSTOM_TONE_MAPPING"};function jg(i,t,e,n,s,r){let o=new un(t,e,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=new ke;c.setAttribute("position",new fe([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new fe([0,2,0,0,2,0],2));let h=new Jo({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new Ht(c,h),u=new zs(-1,1,1,-1,0,1),m=null,g=null,x=!1,f,p=null,y=[],S=!1;this.setSize=function(v,b){o.setSize(v,b),a!==null&&a.setSize(v,b),l!==null&&l.setSize(v,b);for(let E=0;E<y.length;E++){let R=y[E];R.setSize&&R.setSize(v,b)}},this.setEffects=function(v){y=v,S=y.length>0&&y[0].isRenderPass===!0;let b=o.width,E=o.height;y.length>0&&a===null&&(a=new un(b,E,{type:Hn,depthBuffer:!1,stencilBuffer:!1}),l=new un(b,E,{type:Hn,depthBuffer:!1,stencilBuffer:!1}));for(let R=0;R<y.length;R++){let _=y[R];_.setSize&&_.setSize(b,E)}},this.begin=function(v,b){if(x||v.toneMapping===kn&&y.length===0)return!1;if(p=b,b!==null){let E=b.width,R=b.height;(o.width!==E||o.height!==R)&&this.setSize(E,R)}return S===!1&&v.setRenderTarget(o),f=v.toneMapping,v.toneMapping=kn,!0},this.hasRenderPass=function(){return S},this.end=function(v,b){v.toneMapping=f,x=!0;let E=o,R=a;for(let _=0;_<y.length;_++){let T=y[_];T.enabled!==!1&&(T.render(v,R,E,b),T.needsSwap!==!1&&(E=R,R=R===a?l:a))}if(m!==v.outputColorSpace||g!==v.toneMapping){m=v.outputColorSpace,g=v.toneMapping,h.defines={},Jt.getTransfer(m)===oe&&(h.defines.SRGB_TRANSFER="");let _=Jg[g];_&&(h.defines[_]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=E.texture,v.setRenderTarget(p),v.render(d,u),p=null,x=!1},this.isCompositing=function(){return x},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}var Ud=new en,th=new wi(1,1),Fd=new gr,Od=new Yo,Bd=new Sr,gd=[],xd=[],yd=new Float32Array(16),vd=new Float32Array(9),_d=new Float32Array(4);function $s(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=gd[s];if(r===void 0&&(r=new Float32Array(s),gd[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function He(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ve(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function hl(i,t){let e=xd[t];e===void 0&&(e=new Int32Array(t),xd[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Qg(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function tx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(He(e,t))return;i.uniform2fv(this.addr,t),Ve(e,t)}}function ex(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(He(e,t))return;i.uniform3fv(this.addr,t),Ve(e,t)}}function nx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(He(e,t))return;i.uniform4fv(this.addr,t),Ve(e,t)}}function ix(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(He(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ve(e,t)}else{if(He(e,n))return;_d.set(n),i.uniformMatrix2fv(this.addr,!1,_d),Ve(e,n)}}function sx(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(He(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ve(e,t)}else{if(He(e,n))return;vd.set(n),i.uniformMatrix3fv(this.addr,!1,vd),Ve(e,n)}}function rx(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(He(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ve(e,t)}else{if(He(e,n))return;yd.set(n),i.uniformMatrix4fv(this.addr,!1,yd),Ve(e,n)}}function ox(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function ax(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(He(e,t))return;i.uniform2iv(this.addr,t),Ve(e,t)}}function lx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(He(e,t))return;i.uniform3iv(this.addr,t),Ve(e,t)}}function cx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(He(e,t))return;i.uniform4iv(this.addr,t),Ve(e,t)}}function hx(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function ux(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(He(e,t))return;i.uniform2uiv(this.addr,t),Ve(e,t)}}function dx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(He(e,t))return;i.uniform3uiv(this.addr,t),Ve(e,t)}}function fx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(He(e,t))return;i.uniform4uiv(this.addr,t),Ve(e,t)}}function px(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(th.compareFunction=e.isReversedDepthBuffer()?nl:el,r=th):r=Ud,e.setTexture2D(t||r,s)}function mx(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Od,s)}function gx(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Bd,s)}function xx(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Fd,s)}function yx(i){switch(i){case 5126:return Qg;case 35664:return tx;case 35665:return ex;case 35666:return nx;case 35674:return ix;case 35675:return sx;case 35676:return rx;case 5124:case 35670:return ox;case 35667:case 35671:return ax;case 35668:case 35672:return lx;case 35669:case 35673:return cx;case 5125:return hx;case 36294:return ux;case 36295:return dx;case 36296:return fx;case 35678:case 36198:case 36298:case 36306:case 35682:return px;case 35679:case 36299:case 36307:return mx;case 35680:case 36300:case 36308:case 36293:return gx;case 36289:case 36303:case 36311:case 36292:return xx}}function vx(i,t){i.uniform1fv(this.addr,t)}function _x(i,t){let e=$s(t,this.size,2);i.uniform2fv(this.addr,e)}function Mx(i,t){let e=$s(t,this.size,3);i.uniform3fv(this.addr,e)}function bx(i,t){let e=$s(t,this.size,4);i.uniform4fv(this.addr,e)}function Sx(i,t){let e=$s(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function wx(i,t){let e=$s(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Tx(i,t){let e=$s(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Ex(i,t){i.uniform1iv(this.addr,t)}function Ax(i,t){i.uniform2iv(this.addr,t)}function Rx(i,t){i.uniform3iv(this.addr,t)}function Cx(i,t){i.uniform4iv(this.addr,t)}function Px(i,t){i.uniform1uiv(this.addr,t)}function Ix(i,t){i.uniform2uiv(this.addr,t)}function Lx(i,t){i.uniform3uiv(this.addr,t)}function Dx(i,t){i.uniform4uiv(this.addr,t)}function Nx(i,t,e){let n=this.cache,s=t.length,r=hl(e,s);He(n,r)||(i.uniform1iv(this.addr,r),Ve(n,r));let o;this.type===i.SAMPLER_2D_SHADOW?o=th:o=Ud;for(let a=0;a!==s;++a)e.setTexture2D(t[a]||o,r[a])}function Ux(i,t,e){let n=this.cache,s=t.length,r=hl(e,s);He(n,r)||(i.uniform1iv(this.addr,r),Ve(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Od,r[o])}function Fx(i,t,e){let n=this.cache,s=t.length,r=hl(e,s);He(n,r)||(i.uniform1iv(this.addr,r),Ve(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Bd,r[o])}function Ox(i,t,e){let n=this.cache,s=t.length,r=hl(e,s);He(n,r)||(i.uniform1iv(this.addr,r),Ve(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Fd,r[o])}function Bx(i){switch(i){case 5126:return vx;case 35664:return _x;case 35665:return Mx;case 35666:return bx;case 35674:return Sx;case 35675:return wx;case 35676:return Tx;case 5124:case 35670:return Ex;case 35667:case 35671:return Ax;case 35668:case 35672:return Rx;case 35669:case 35673:return Cx;case 5125:return Px;case 36294:return Ix;case 36295:return Lx;case 36296:return Dx;case 35678:case 36198:case 36298:case 36306:case 35682:return Nx;case 35679:case 36299:case 36307:return Ux;case 35680:case 36300:case 36308:case 36293:return Fx;case 36289:case 36303:case 36311:case 36292:return Ox}}var eh=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=yx(e.type)}},nh=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Bx(e.type)}},ih=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],n)}}},jc=/(\w+)(\])?(\[|\.)?/g;function Md(i,t){i.seq.push(t),i.map[t.id]=t}function kx(i,t,e){let n=i.name,s=n.length;for(jc.lastIndex=0;;){let r=jc.exec(n),o=jc.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Md(e,c===void 0?new eh(a,i,t):new nh(a,i,t));break}else{let d=e.map[a];d===void 0&&(d=new ih(a),Md(e,d)),e=d}}}var qs=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){let a=t.getActiveUniform(e,o),l=t.getUniformLocation(e,a.name);kx(a,l,this)}let s=[],r=[];for(let o of this.seq)o.type===t.SAMPLER_2D_SHADOW||o.type===t.SAMPLER_CUBE_SHADOW||o.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&n.push(o)}return n}};function bd(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var zx=37297,Hx=0;function Vx(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}var Sd=new zt;function Gx(i){Jt._getMatrix(Sd,Jt.workingColorSpace,i);let t=`mat3( ${Sd.elements.map(e=>e.toFixed(4))} )`;switch(Jt.getTransfer(i)){case pr:return[t,"LinearTransferOETF"];case oe:return[t,"sRGBTransferOETF"];default:return Dt("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function wd(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+Vx(i.getShaderSource(t),a)}else return r}function Wx(i,t){let e=Gx(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}var Xx={[Sc]:"Linear",[wc]:"Reinhard",[Tc]:"Cineon",[Or]:"ACESFilmic",[Ac]:"AgX",[Rc]:"Neutral",[Ec]:"Custom"};function qx(i,t){let e=Xx[t];return e===void 0?(Dt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var ol=new U;function Yx(){Jt.getLuminanceCoefficients(ol);let i=ol.x.toFixed(4),t=ol.y.toFixed(4),e=ol.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function $x(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Zr).join(`
`)}function Zx(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Kx(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Zr(i){return i!==""}function Td(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Ed(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Jx=/^[ \t]*#include +<([\w\d./]+)>/gm;function sh(i){return i.replace(Jx,Qx)}var jx=new Map;function Qx(i,t){let e=qt[t];if(e===void 0){let n=jx.get(t);if(n!==void 0)e=qt[n],Dt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return sh(e)}var ty=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ad(i){return i.replace(ty,ey)}function ey(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Rd(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}var ny={[Ki]:"SHADOWMAP_TYPE_PCF",[Hs]:"SHADOWMAP_TYPE_VSM"};function iy(i){return ny[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var sy={[Li]:"ENVMAP_TYPE_CUBE",[ji]:"ENVMAP_TYPE_CUBE",[Br]:"ENVMAP_TYPE_CUBE_UV"};function ry(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":sy[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var oy={[ji]:"ENVMAP_MODE_REFRACTION"};function ay(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":oy[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var ly={[pa]:"ENVMAP_BLENDING_MULTIPLY",[Vu]:"ENVMAP_BLENDING_MIX",[Gu]:"ENVMAP_BLENDING_ADD"};function cy(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":ly[i.combine]||"ENVMAP_BLENDING_NONE"}function hy(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function uy(i,t,e,n){let s=i.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=iy(e),c=ry(e),h=ay(e),d=cy(e),u=hy(e),m=$x(e),g=Zx(r),x=s.createProgram(),f,p,y=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Zr).join(`
`),f.length>0&&(f+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Zr).join(`
`),p.length>0&&(p+=`
`)):(f=[Rd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Zr).join(`
`),p=[Rd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==kn?"#define TONE_MAPPING":"",e.toneMapping!==kn?qt.tonemapping_pars_fragment:"",e.toneMapping!==kn?qx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",qt.colorspace_pars_fragment,Wx("linearToOutputTexel",e.outputColorSpace),Yx(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Zr).join(`
`)),o=sh(o),o=Td(o,e),o=Ed(o,e),a=sh(a),a=Td(a,e),a=Ed(a,e),o=Ad(o),a=Ad(a),e.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,f=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,p=["#define varying in",e.glslVersion===Oc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Oc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let S=y+f+o,v=y+p+a,b=bd(s,s.VERTEX_SHADER,S),E=bd(s,s.FRAGMENT_SHADER,v);s.attachShader(x,b),s.attachShader(x,E),e.index0AttributeName!==void 0?s.bindAttribLocation(x,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function R(I){if(i.debug.checkShaderErrors){let P=s.getProgramInfoLog(x)||"",N=s.getShaderInfoLog(b)||"",L=s.getShaderInfoLog(E)||"",F=P.trim(),H=N.trim(),W=L.trim(),Q=!0,q=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(Q=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,b,E);else{let K=wd(s,b,"vertex"),j=wd(s,E,"fragment");Ot("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+F+`
`+K+`
`+j)}else F!==""?Dt("WebGLProgram: Program Info Log:",F):(H===""||W==="")&&(q=!1);q&&(I.diagnostics={runnable:Q,programLog:F,vertexShader:{log:H,prefix:f},fragmentShader:{log:W,prefix:p}})}s.deleteShader(b),s.deleteShader(E),_=new qs(s,x),T=Kx(s,x)}let _;this.getUniforms=function(){return _===void 0&&R(this),_};let T;this.getAttributes=function(){return T===void 0&&R(this),T};let A=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return A===!1&&(A=s.getProgramParameter(x,zx)),A},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Hx++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=b,this.fragmentShader=E,this}var dy=0,rh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){let s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new oh(t),e.set(t,n)),n}},oh=class{constructor(t){this.id=dy++,this.code=t,this.usedTimes=0}};function fy(i){return i===Ui||i===Wr||i===Xr}function py(i,t,e,n,s,r){let o=new xr,a=new rh,l=new Set,c=[],h=new Map,d=n.logarithmicDepthBuffer,u=n.precision,m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(_){return l.add(_),_===0?"uv":`uv${_}`}function x(_,T,A,I,P,N){let L=I.fog,F=P.geometry,H=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?I.environment:null,W=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,Q=t.get(_.envMap||H,W),q=Q&&Q.mapping===Br?Q.image.height:null,K=m[_.type];_.precision!==null&&(u=n.getMaxPrecision(_.precision),u!==_.precision&&Dt("WebGLProgram.getParameters:",_.precision,"not supported, using",u,"instead."));let j=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,st=j!==void 0?j.length:0,at=0;F.morphAttributes.position!==void 0&&(at=1),F.morphAttributes.normal!==void 0&&(at=2),F.morphAttributes.color!==void 0&&(at=3);let $t,Pt,kt,$;if(K){let ge=ni[K];$t=ge.vertexShader,Pt=ge.fragmentShader}else{$t=_.vertexShader,Pt=_.fragmentShader;let ge=a.getVertexShaderStage(_),se=a.getFragmentShaderStage(_);a.update(_,ge,se),kt=ge.id,$=se.id}let et=i.getRenderTarget(),vt=i.state.buffers.depth.getReversed(),Nt=P.isInstancedMesh===!0,yt=P.isBatchedMesh===!0,Ut=!!_.map,Zt=!!_.matcap,Bt=!!Q,Vt=!!_.aoMap,Yt=!!_.lightMap,Ft=!!_.bumpMap&&_.wireframe===!1,Qt=!!_.normalMap,he=!!_.displacementMap,Pe=!!_.emissiveMap,te=!!_.metalnessMap,ue=!!_.roughnessMap,O=_.anisotropy>0,ve=_.clearcoat>0,ee=_.dispersion>0,C=_.retroreflectivity>0,M=_.iridescence>0,z=_.sheen>0,X=_.transmission>0,Z=O&&!!_.anisotropyMap,rt=ve&&!!_.clearcoatMap,lt=ve&&!!_.clearcoatNormalMap,J=ve&&!!_.clearcoatRoughnessMap,nt=M&&!!_.iridescenceMap,ct=M&&!!_.iridescenceThicknessMap,Et=z&&!!_.sheenColorMap,ft=z&&!!_.sheenRoughnessMap,ht=!!_.specularMap,At=!!_.specularColorMap,It=!!_.specularIntensityMap,Wt=X&&!!_.transmissionMap,k=X&&!!_.thicknessMap,ut=!!_.gradientMap,tt=!!_.alphaMap,dt=_.alphaTest>0,xt=!!_.alphaHash,it=!!_.extensions,Rt=kn;_.toneMapped&&(et===null||et.isXRRenderTarget===!0)&&(Rt=i.toneMapping);let wt={shaderID:K,shaderType:_.type,shaderName:_.name,vertexShader:$t,fragmentShader:Pt,defines:_.defines,customVertexShaderID:kt,customFragmentShaderID:$,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:u,batching:yt,batchingColor:yt&&P._colorsTexture!==null,instancing:Nt,instancingColor:Nt&&P.instanceColor!==null,instancingMorph:Nt&&P.morphTexture!==null,outputColorSpace:et===null?i.outputColorSpace:et.isXRRenderTarget===!0?et.texture.colorSpace:Jt.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:Ut,matcap:Zt,envMap:Bt,envMapMode:Bt&&Q.mapping,envMapCubeUVHeight:q,aoMap:Vt,lightMap:Yt,bumpMap:Ft,normalMap:Qt,displacementMap:he,emissiveMap:Pe,normalMapObjectSpace:Qt&&_.normalMapType===qu,normalMapTangentSpace:Qt&&_.normalMapType===qr,packedNormalMap:Qt&&_.normalMapType===qr&&fy(_.normalMap.format),metalnessMap:te,roughnessMap:ue,anisotropy:O,anisotropyMap:Z,clearcoat:ve,clearcoatMap:rt,clearcoatNormalMap:lt,clearcoatRoughnessMap:J,dispersion:ee,retroreflection:C,iridescence:M,iridescenceMap:nt,iridescenceThicknessMap:ct,sheen:z,sheenColorMap:Et,sheenRoughnessMap:ft,specularMap:ht,specularColorMap:At,specularIntensityMap:It,transmission:X,transmissionMap:Wt,thicknessMap:k,gradientMap:ut,opaque:_.transparent===!1&&_.blending===Ii&&_.alphaToCoverage===!1,alphaMap:tt,alphaTest:dt,alphaHash:xt,combine:_.combine,mapUv:Ut&&g(_.map.channel),aoMapUv:Vt&&g(_.aoMap.channel),lightMapUv:Yt&&g(_.lightMap.channel),bumpMapUv:Ft&&g(_.bumpMap.channel),normalMapUv:Qt&&g(_.normalMap.channel),displacementMapUv:he&&g(_.displacementMap.channel),emissiveMapUv:Pe&&g(_.emissiveMap.channel),metalnessMapUv:te&&g(_.metalnessMap.channel),roughnessMapUv:ue&&g(_.roughnessMap.channel),anisotropyMapUv:Z&&g(_.anisotropyMap.channel),clearcoatMapUv:rt&&g(_.clearcoatMap.channel),clearcoatNormalMapUv:lt&&g(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:J&&g(_.clearcoatRoughnessMap.channel),iridescenceMapUv:nt&&g(_.iridescenceMap.channel),iridescenceThicknessMapUv:ct&&g(_.iridescenceThicknessMap.channel),sheenColorMapUv:Et&&g(_.sheenColorMap.channel),sheenRoughnessMapUv:ft&&g(_.sheenRoughnessMap.channel),specularMapUv:ht&&g(_.specularMap.channel),specularColorMapUv:At&&g(_.specularColorMap.channel),specularIntensityMapUv:It&&g(_.specularIntensityMap.channel),transmissionMapUv:Wt&&g(_.transmissionMap.channel),thicknessMapUv:k&&g(_.thicknessMap.channel),alphaMapUv:tt&&g(_.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(Qt||O),vertexNormals:!!F.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,pointsUvs:P.isPoints===!0&&!!F.attributes.uv&&(Ut||tt),fog:!!L,useFog:_.fog===!0,fogExp2:!!L&&L.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||F.attributes.normal===void 0&&Qt===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:vt,skinning:P.isSkinnedMesh===!0,hasPositionAttribute:F.attributes.position!==void 0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:st,morphTextureStride:at,numSunLights:T.sun.length,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numSunLightShadows:T.sunShadowMap.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numLightProbeGrids:N.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&A.length>0,shadowMapType:i.shadowMap.type,toneMapping:Rt,decodeVideoTexture:Ut&&_.map.isVideoTexture===!0&&Jt.getTransfer(_.map.colorSpace)===oe,decodeVideoTextureEmissive:Pe&&_.emissiveMap.isVideoTexture===!0&&Jt.getTransfer(_.emissiveMap.colorSpace)===oe,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===En,flipSided:_.side===Ke,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:it&&_.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(it&&_.extensions.multiDraw===!0||yt)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return wt.vertexUv1s=l.has(1),wt.vertexUv2s=l.has(2),wt.vertexUv3s=l.has(3),l.clear(),wt}function f(_){let T=[];if(_.shaderID?T.push(_.shaderID):(T.push(_.customVertexShaderID),T.push(_.customFragmentShaderID)),_.defines!==void 0)for(let A in _.defines)T.push(A),T.push(_.defines[A]);return _.isRawShaderMaterial===!1&&(p(T,_),y(T,_),T.push(i.outputColorSpace)),T.push(_.customProgramCacheKey),T.join()}function p(_,T){_.push(T.precision),_.push(T.outputColorSpace),_.push(T.envMapMode),_.push(T.envMapCubeUVHeight),_.push(T.mapUv),_.push(T.alphaMapUv),_.push(T.lightMapUv),_.push(T.aoMapUv),_.push(T.bumpMapUv),_.push(T.normalMapUv),_.push(T.displacementMapUv),_.push(T.emissiveMapUv),_.push(T.metalnessMapUv),_.push(T.roughnessMapUv),_.push(T.anisotropyMapUv),_.push(T.clearcoatMapUv),_.push(T.clearcoatNormalMapUv),_.push(T.clearcoatRoughnessMapUv),_.push(T.iridescenceMapUv),_.push(T.iridescenceThicknessMapUv),_.push(T.sheenColorMapUv),_.push(T.sheenRoughnessMapUv),_.push(T.specularMapUv),_.push(T.specularColorMapUv),_.push(T.specularIntensityMapUv),_.push(T.transmissionMapUv),_.push(T.thicknessMapUv),_.push(T.combine),_.push(T.fogExp2),_.push(T.sizeAttenuation),_.push(T.morphTargetsCount),_.push(T.morphAttributeCount),_.push(T.numSunLights),_.push(T.numDirLights),_.push(T.numPointLights),_.push(T.numSpotLights),_.push(T.numSpotLightMaps),_.push(T.numHemiLights),_.push(T.numRectAreaLights),_.push(T.numSunLightShadows),_.push(T.numDirLightShadows),_.push(T.numPointLightShadows),_.push(T.numSpotLightShadows),_.push(T.numSpotLightShadowsWithMaps),_.push(T.numLightProbes),_.push(T.shadowMapType),_.push(T.toneMapping),_.push(T.numClippingPlanes),_.push(T.numClipIntersection),_.push(T.depthPacking)}function y(_,T){o.disableAll(),T.instancing&&o.enable(0),T.instancingColor&&o.enable(1),T.instancingMorph&&o.enable(2),T.matcap&&o.enable(3),T.envMap&&o.enable(4),T.normalMapObjectSpace&&o.enable(5),T.normalMapTangentSpace&&o.enable(6),T.clearcoat&&o.enable(7),T.iridescence&&o.enable(8),T.alphaTest&&o.enable(9),T.vertexColors&&o.enable(10),T.vertexAlphas&&o.enable(11),T.vertexUv1s&&o.enable(12),T.vertexUv2s&&o.enable(13),T.vertexUv3s&&o.enable(14),T.vertexTangents&&o.enable(15),T.anisotropy&&o.enable(16),T.alphaHash&&o.enable(17),T.batching&&o.enable(18),T.dispersion&&o.enable(19),T.retroreflection&&o.enable(24),T.batchingColor&&o.enable(20),T.gradientMap&&o.enable(21),T.packedNormalMap&&o.enable(22),T.vertexNormals&&o.enable(23),_.push(o.mask),o.disableAll(),T.fog&&o.enable(0),T.useFog&&o.enable(1),T.flatShading&&o.enable(2),T.logarithmicDepthBuffer&&o.enable(3),T.reversedDepthBuffer&&o.enable(4),T.skinning&&o.enable(5),T.morphTargets&&o.enable(6),T.morphNormals&&o.enable(7),T.morphColors&&o.enable(8),T.premultipliedAlpha&&o.enable(9),T.shadowMapEnabled&&o.enable(10),T.doubleSided&&o.enable(11),T.flipSided&&o.enable(12),T.useDepthPacking&&o.enable(13),T.dithering&&o.enable(14),T.transmission&&o.enable(15),T.sheen&&o.enable(16),T.opaque&&o.enable(17),T.pointsUvs&&o.enable(18),T.decodeVideoTexture&&o.enable(19),T.decodeVideoTextureEmissive&&o.enable(20),T.alphaToCoverage&&o.enable(21),T.numLightProbeGrids>0&&o.enable(22),T.hasPositionAttribute&&o.enable(23),_.push(o.mask)}function S(_){let T=m[_.type],A;if(T){let I=ni[T];A=sl.clone(I.uniforms)}else A=_.uniforms;return A}function v(_,T){let A=h.get(T);return A!==void 0?++A.usedTimes:(A=new uy(i,T,_,s),c.push(A),h.set(T,A)),A}function b(_){if(--_.usedTimes===0){let T=c.indexOf(_);c[T]=c[c.length-1],c.pop(),h.delete(_.cacheKey),_.destroy()}}function E(_){a.remove(_)}function R(){a.dispose()}return{getParameters:x,getProgramCacheKey:f,getUniforms:S,acquireProgram:v,releaseProgram:b,releaseShaderCache:E,programs:c,dispose:R}}function my(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function gy(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.materialVariant!==t.materialVariant?i.materialVariant-t.materialVariant:i.z!==t.z?i.z-t.z:i.id-t.id}function Cd(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Pd(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u){let m=0;return u.isInstancedMesh&&(m+=2),u.isSkinnedMesh&&(m+=1),m}function a(u,m,g,x,f,p){let y=i[t];return y===void 0?(y={id:u.id,object:u,geometry:m,material:g,materialVariant:o(u),groupOrder:x,renderOrder:u.renderOrder,z:f,group:p},i[t]=y):(y.id=u.id,y.object=u,y.geometry=m,y.material=g,y.materialVariant=o(u),y.groupOrder=x,y.renderOrder=u.renderOrder,y.z=f,y.group=p),t++,y}function l(u,m,g,x,f,p,y){y.reversedDepth===!0&&(f=-f);let S=a(u,m,g,x,f,p);g.transmission>0?n.push(S):g.transparent===!0?s.push(S):e.push(S)}function c(u,m,g,x,f,p){let y=a(u,m,g,x,f,p);g.transmission>0?n.unshift(y):g.transparent===!0?s.unshift(y):e.unshift(y)}function h(u,m){e.length>1&&e.sort(u||gy),n.length>1&&n.sort(m||Cd),s.length>1&&s.sort(m||Cd)}function d(){for(let u=t,m=i.length;u<m;u++){let g=i[u];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:d,sort:h}}function xy(){let i=new WeakMap;function t(n,s){let r=i.get(n),o;return r===void 0?(o=new Pd,i.set(n,[o])):s>=r.length?(o=new Pd,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function yy(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new U,color:new Ct};break;case"SpotLight":e={position:new U,direction:new U,color:new Ct,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new U,color:new Ct,distance:0,decay:0};break;case"HemisphereLight":e={direction:new U,skyColor:new Ct,groundColor:new Ct};break;case"RectAreaLight":e={color:new Ct,position:new U,halfWidth:new U,halfHeight:new U};break}return i[t.id]=e,e}}}function vy(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Lt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Lt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Lt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var _y=0;function My(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function by(i){let t=new yy,e=vy(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new U);let s=new U,r=new ie,o=new ie;function a(c){let h=0,d=0,u=0;for(let P=0;P<9;P++)n.probe[P].set(0,0,0);let m=0,g=0,x=0,f=0,p=0,y=0,S=0,v=0,b=0,E=0,R=0,_=0,T=0,A=0;c.sort(My);for(let P=0,N=c.length;P<N;P++){let L=c[P],F=L.color,H=L.intensity,W=L.distance,Q=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===Ui?Q=L.shadow.map.texture:Q=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)h+=F.r*H,d+=F.g*H,u+=F.b*H;else if(L.isLightProbe){for(let q=0;q<9;q++)n.probe[q].addScaledVector(L.sh.coefficients[q],H);A++}else if(L.isSunLight){let q=t.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let K=L.shadow,j=e.get(L);j.shadowIntensity=K.intensity,j.shadowBias=K.bias,j.shadowNormalBias=K.normalBias,j.shadowRadius=K.radius,j.shadowMapSize.copy(K.mapSize).multiply(K.getFrameExtents()),n.sunShadow[g]=j,n.sunShadowMap[g]=Q;let st=K.getViewportCount();for(let at=0;at<st;at++)n.sunShadowMatrix[x+at]=K.getMatrix(at),n.sunShadowCascade[x+at]=K._cascadeData[at];x+=st,g++}n.sun[m]=q,m++}else if(L.isDirectionalLight){let q=t.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let K=L.shadow,j=e.get(L);j.shadowIntensity=K.intensity,j.shadowBias=K.bias,j.shadowNormalBias=K.normalBias,j.shadowRadius=K.radius,j.shadowMapSize=K.mapSize,n.directionalShadow[f]=j,n.directionalShadowMap[f]=Q,n.directionalShadowMatrix[f]=L.shadow.matrix,b++}n.directional[f]=q,f++}else if(L.isSpotLight){let q=t.get(L);q.position.setFromMatrixPosition(L.matrixWorld),q.color.copy(F).multiplyScalar(H),q.distance=W,q.coneCos=Math.cos(L.angle),q.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),q.decay=L.decay,n.spot[y]=q;let K=L.shadow;if(L.map&&(n.spotLightMap[_]=L.map,_++,K.updateMatrices(L),L.castShadow&&T++),n.spotLightMatrix[y]=K.matrix,L.castShadow){let j=e.get(L);j.shadowIntensity=K.intensity,j.shadowBias=K.bias,j.shadowNormalBias=K.normalBias,j.shadowRadius=K.radius,j.shadowMapSize=K.mapSize,n.spotShadow[y]=j,n.spotShadowMap[y]=Q,R++}y++}else if(L.isRectAreaLight){let q=t.get(L);q.color.copy(F).multiplyScalar(H),q.halfWidth.set(L.width*.5,0,0),q.halfHeight.set(0,L.height*.5,0),n.rectArea[S]=q,S++}else if(L.isPointLight){let q=t.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity),q.distance=L.distance,q.decay=L.decay,L.castShadow){let K=L.shadow,j=e.get(L);j.shadowIntensity=K.intensity,j.shadowBias=K.bias,j.shadowNormalBias=K.normalBias,j.shadowRadius=K.radius,j.shadowMapSize=K.mapSize,j.shadowCameraNear=K.camera.near,j.shadowCameraFar=K.camera.far,n.pointShadow[p]=j,n.pointShadowMap[p]=Q,n.pointShadowMatrix[p]=L.shadow.matrix,E++}n.point[p]=q,p++}else if(L.isHemisphereLight){let q=t.get(L);q.skyColor.copy(L.color).multiplyScalar(H),q.groundColor.copy(L.groundColor).multiplyScalar(H),n.hemi[v]=q,v++}}S>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=pt.LTC_FLOAT_1,n.rectAreaLTC2=pt.LTC_FLOAT_2):(n.rectAreaLTC1=pt.LTC_HALF_1,n.rectAreaLTC2=pt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;let I=n.hash;(I.sunLength!==m||I.directionalLength!==f||I.pointLength!==p||I.spotLength!==y||I.rectAreaLength!==S||I.hemiLength!==v||I.numSunShadows!==g||I.numDirectionalShadows!==b||I.numPointShadows!==E||I.numSpotShadows!==R||I.numSpotMaps!==_||I.numLightProbes!==A)&&(n.sun.length=m,n.directional.length=f,n.spot.length=y,n.rectArea.length=S,n.point.length=p,n.hemi.length=v,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=x,n.sunShadowCascade.length=x,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.directionalShadowMatrix.length=b,n.pointShadow.length=E,n.pointShadowMap.length=E,n.pointShadowMatrix.length=E,n.spotShadow.length=R,n.spotShadowMap.length=R,n.spotLightMatrix.length=R+_-T,n.spotLightMap.length=_,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=A,I.sunLength=m,I.directionalLength=f,I.pointLength=p,I.spotLength=y,I.rectAreaLength=S,I.hemiLength=v,I.numSunShadows=g,I.numDirectionalShadows=b,I.numPointShadows=E,I.numSpotShadows=R,I.numSpotMaps=_,I.numLightProbes=A,n.version=_y++)}function l(c,h){let d=0,u=0,m=0,g=0,x=0,f=0,p=h.matrixWorldInverse;for(let y=0,S=c.length;y<S;y++){let v=c[y];if(v.isSunLight){let b=n.sun[d];b.direction.setFromMatrixPosition(v.matrixWorld),b.direction.transformDirection(p),d++}else if(v.isDirectionalLight){let b=n.directional[u];b.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(p),u++}else if(v.isSpotLight){let b=n.spot[g];b.position.setFromMatrixPosition(v.matrixWorld),b.position.applyMatrix4(p),b.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(p),g++}else if(v.isRectAreaLight){let b=n.rectArea[x];b.position.setFromMatrixPosition(v.matrixWorld),b.position.applyMatrix4(p),o.identity(),r.copy(v.matrixWorld),r.premultiply(p),o.extractRotation(r),b.halfWidth.set(v.width*.5,0,0),b.halfHeight.set(0,v.height*.5,0),b.halfWidth.applyMatrix4(o),b.halfHeight.applyMatrix4(o),x++}else if(v.isPointLight){let b=n.point[m];b.position.setFromMatrixPosition(v.matrixWorld),b.position.applyMatrix4(p),m++}else if(v.isHemisphereLight){let b=n.hemi[f];b.direction.setFromMatrixPosition(v.matrixWorld),b.direction.transformDirection(p),f++}}}return{setup:a,setupView:l,state:n}}function Id(i){let t=new by(i),e=[],n=[],s=[];function r(u){d.camera=u,e.length=0,n.length=0,s.length=0}function o(u){e.push(u)}function a(u){n.push(u)}function l(u){s.push(u)}function c(){t.setup(e)}function h(u){t.setupView(e,u)}let d={lightsArray:e,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:c,setupLightsView:h,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function Sy(i){let t=new WeakMap;function e(s,r=0){let o=t.get(s),a;return o===void 0?(a=new Id(i),t.set(s,[a])):r>=o.length?(a=new Id(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}var wy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ty=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Ey=[new U(1,0,0),new U(-1,0,0),new U(0,1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1)],Ay=[new U(0,-1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1),new U(0,-1,0),new U(0,-1,0)],Ld=new ie,$r=new U,Qc=new U;function Ry(i,t,e){let n=new Ns,s=new Lt,r=new Lt,o=new be,a=new jo,l=new Qo,c={},h=e.maxTextureSize,d={[Pi]:Ke,[Ke]:Pi,[En]:En},u=new cn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Lt},radius:{value:4}},vertexShader:wy,fragmentShader:Ty}),m=u.clone();m.defines.HORIZONTAL_PASS=1;let g=new ke;g.setAttribute("position",new $e(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new Ht(g,u),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ki;let p=this.type;this.render=function(E,R,_){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||E.length===0)return;this.type===fa&&(Dt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Ki);let T=i.getRenderTarget(),A=i.getActiveCubeFace(),I=i.getActiveMipmapLevel(),P=i.state;P.setBlending(Qn),P.buffers.depth.getReversed()===!0?P.buffers.color.setClear(0,0,0,0):P.buffers.color.setClear(1,1,1,1),P.buffers.depth.setTest(!0),P.setScissorTest(!1);let N=p!==this.type;N&&R.traverse(function(L){L.material&&(Array.isArray(L.material)?L.material.forEach(F=>F.needsUpdate=!0):L.material.needsUpdate=!0)});for(let L=0,F=E.length;L<F;L++){let H=E[L],W=H.shadow;if(W===void 0){Dt("WebGLShadowMap:",H,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;s.copy(W.mapSize);let Q=W.getFrameExtents();s.multiply(Q),r.copy(W.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/Q.x),s.x=r.x*Q.x,W.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/Q.y),s.y=r.y*Q.y,W.mapSize.y=r.y));let q=i.state.buffers.depth.getReversed();if(W.camera._reversedDepth=q,W.map===null||N===!0){if(W.map!==null&&(W.map.depthTexture!==null&&(W.map.depthTexture.dispose(),W.map.depthTexture=null),W.map.dispose()),this.type===Hs){if(H.isPointLight){Dt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}W.map=new un(s.x,s.y,{format:Ui,type:Hn,minFilter:Ze,magFilter:Ze,generateMipmaps:!1}),W.map.texture.name=H.name+".shadowMap",W.map.depthTexture=new wi(s.x,s.y,An),W.map.depthTexture.name=H.name+".shadowMapDepth",W.map.depthTexture.format=$n,W.map.depthTexture.compareFunction=null,W.map.depthTexture.minFilter=Xe,W.map.depthTexture.magFilter=Xe}else H.isPointLight?(W.map=new al(s.x),W.map.depthTexture=new Zo(s.x,zn)):(W.map=new un(s.x,s.y),W.map.depthTexture=new wi(s.x,s.y,zn)),W.map.depthTexture.name=H.name+".shadowMap",W.map.depthTexture.format=$n,this.type===Ki?(W.map.depthTexture.compareFunction=q?nl:el,W.map.depthTexture.minFilter=Ze,W.map.depthTexture.magFilter=Ze):(W.map.depthTexture.compareFunction=null,W.map.depthTexture.minFilter=Xe,W.map.depthTexture.magFilter=Xe);W.camera.updateProjectionMatrix()}W.map.isWebGLCubeRenderTarget!==!0&&(W.map.width!==s.x||W.map.height!==s.y)&&W.map.setSize(s.x,s.y);let K=W.map.isWebGLCubeRenderTarget?6:W.getViewportCount();H.isPointLight!==!0&&W.updateMatrices(H,_);for(let j=0;j<K;j++){let st=W.getCamera(j);if(H.isPointLight){let at=W.camera,$t=W.matrix,Pt=H.distance||at.far;Pt!==at.far&&(at.far=Pt,at.updateProjectionMatrix()),$r.setFromMatrixPosition(H.matrixWorld),at.position.copy($r),Qc.copy(at.position),Qc.add(Ey[j]),at.up.copy(Ay[j]),at.lookAt(Qc),at.updateMatrixWorld(),$t.makeTranslation(-$r.x,-$r.y,-$r.z),Ld.multiplyMatrices(at.projectionMatrix,at.matrixWorldInverse),W._frustum.setFromProjectionMatrix(Ld,at.coordinateSystem,at.reversedDepth)}if(W.map.isWebGLCubeRenderTarget)i.setRenderTarget(W.map,j),i.clear();else{j===0&&(i.setRenderTarget(W.map),i.clear());let at=W.getViewport(j);o.set(r.x*at.x,r.y*at.y,r.x*at.z,r.y*at.w),P.viewport(o)}n=W.getFrustum(j),v(R,_,st,H,this.type)}W.isPointLightShadow!==!0&&this.type===Hs&&y(W,_),W.needsUpdate=!1}p=this.type,f.needsUpdate=!1,i.setRenderTarget(T,A,I)};function y(E,R){let _=t.update(x);u.defines.VSM_SAMPLES!==E.blurSamples&&(u.defines.VSM_SAMPLES=E.blurSamples,m.defines.VSM_SAMPLES=E.blurSamples,u.needsUpdate=!0,m.needsUpdate=!0),E.mapPass===null?E.mapPass=new un(s.x,s.y,{format:Ui,type:Hn}):(E.mapPass.width!==E.map.width||E.mapPass.height!==E.map.height)&&E.mapPass.setSize(E.map.width,E.map.height),u.uniforms.shadow_pass.value=E.map.depthTexture,u.uniforms.resolution.value.set(E.map.width,E.map.height),u.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(R,null,_,u,x,null),m.uniforms.shadow_pass.value=E.mapPass.texture,m.uniforms.resolution.value.set(E.map.width,E.map.height),m.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(R,null,_,m,x,null)}function S(E,R,_,T){let A=null,I=_.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(I!==void 0)A=I;else if(A=_.isPointLight===!0?l:a,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){let P=A.uuid,N=R.uuid,L=c[P];L===void 0&&(L={},c[P]=L);let F=L[N];F===void 0&&(F=A.clone(),L[N]=F,R.addEventListener("dispose",b)),A=F}if(A.visible=R.visible,A.wireframe=R.wireframe,T===Hs?A.side=R.shadowSide!==null?R.shadowSide:R.side:A.side=R.shadowSide!==null?R.shadowSide:d[R.side],A.alphaMap=R.alphaMap,A.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,A.map=R.map,A.clipShadows=R.clipShadows,A.clippingPlanes=R.clippingPlanes,A.clipIntersection=R.clipIntersection,A.displacementMap=R.displacementMap,A.displacementScale=R.displacementScale,A.displacementBias=R.displacementBias,A.wireframeLinewidth=R.wireframeLinewidth,A.linewidth=R.linewidth,_.isPointLight===!0&&A.isMeshDistanceMaterial===!0){let P=i.properties.get(A);P.light=_}return A}function v(E,R,_,T,A){if(E.visible===!1)return;if(E.layers.test(R.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&A===Hs)&&(!E.frustumCulled||E.intersectsFrustum(n))){E.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,E.matrixWorld);let N=t.update(E),L=E.material;if(Array.isArray(L)){let F=N.groups;for(let H=0,W=F.length;H<W;H++){let Q=F[H],q=L[Q.materialIndex];if(q&&q.visible){let K=S(E,q,T,A);E.onBeforeShadow(i,E,R,_,N,K,Q),i.renderBufferDirect(_,null,N,K,E,Q),E.onAfterShadow(i,E,R,_,N,K,Q)}}}else if(L.visible){let F=S(E,L,T,A);E.onBeforeShadow(i,E,R,_,N,F,null),i.renderBufferDirect(_,null,N,F,E,null),E.onAfterShadow(i,E,R,_,N,F,null)}}let P=E.children;for(let N=0,L=P.length;N<L;N++)v(P[N],R,_,T,A)}function b(E){E.target.removeEventListener("dispose",b);for(let _ in c){let T=c[_],A=E.target.uuid;A in T&&(T[A].dispose(),delete T[A])}}}function Cy(i,t){function e(){let k=!1,ut=new be,tt=null,dt=new be(0,0,0,0);return{setMask:function(xt){tt!==xt&&!k&&(i.colorMask(xt,xt,xt,xt),tt=xt)},setLocked:function(xt){k=xt},setClear:function(xt,it,Rt,wt,ge){ge===!0&&(xt*=wt,it*=wt,Rt*=wt),ut.set(xt,it,Rt,wt),dt.equals(ut)===!1&&(i.clearColor(xt,it,Rt,wt),dt.copy(ut))},reset:function(){k=!1,tt=null,dt.set(-1,0,0,0)}}}function n(){let k=!1,ut=!1,tt=null,dt=null,xt=null;return{setReversed:function(it){if(ut!==it){let Rt=t.get("EXT_clip_control");it?Rt.clipControlEXT(Rt.LOWER_LEFT_EXT,Rt.ZERO_TO_ONE_EXT):Rt.clipControlEXT(Rt.LOWER_LEFT_EXT,Rt.NEGATIVE_ONE_TO_ONE_EXT),ut=it;let wt=xt;xt=null,this.setClear(wt)}},getReversed:function(){return ut},setTest:function(it){it?et(i.DEPTH_TEST):vt(i.DEPTH_TEST)},setMask:function(it){tt!==it&&!k&&(i.depthMask(it),tt=it)},setFunc:function(it){if(ut&&(it=id[it]),dt!==it){switch(it){case Fo:i.depthFunc(i.NEVER);break;case Oo:i.depthFunc(i.ALWAYS);break;case Bo:i.depthFunc(i.LESS);break;case Ts:i.depthFunc(i.LEQUAL);break;case ko:i.depthFunc(i.EQUAL);break;case zo:i.depthFunc(i.GEQUAL);break;case Ho:i.depthFunc(i.GREATER);break;case Vo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}dt=it}},setLocked:function(it){k=it},setClear:function(it){xt!==it&&(xt=it,ut&&(it=1-it),i.clearDepth(it))},reset:function(){k=!1,tt=null,dt=null,xt=null,ut=!1}}}function s(){let k=!1,ut=null,tt=null,dt=null,xt=null,it=null,Rt=null,wt=null,ge=null;return{setTest:function(se){k||(se?et(i.STENCIL_TEST):vt(i.STENCIL_TEST))},setMask:function(se){ut!==se&&!k&&(i.stencilMask(se),ut=se)},setFunc:function(se,Pn,Wn){(tt!==se||dt!==Pn||xt!==Wn)&&(i.stencilFunc(se,Pn,Wn),tt=se,dt=Pn,xt=Wn)},setOp:function(se,Pn,Wn){(it!==se||Rt!==Pn||wt!==Wn)&&(i.stencilOp(se,Pn,Wn),it=se,Rt=Pn,wt=Wn)},setLocked:function(se){k=se},setClear:function(se){ge!==se&&(i.clearStencil(se),ge=se)},reset:function(){k=!1,ut=null,tt=null,dt=null,xt=null,it=null,Rt=null,wt=null,ge=null}}}let r=new e,o=new n,a=new s,l=new WeakMap,c=new WeakMap,h={},d={},u={},m=new WeakMap,g=[],x=null,f=!1,p=null,y=null,S=null,v=null,b=null,E=null,R=null,_=new Ct(0,0,0),T=0,A=!1,I=null,P=null,N=null,L=null,F=null,H=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),W=!1,Q=0,q=i.getParameter(i.VERSION);q.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(q)[1]),W=Q>=1):q.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),W=Q>=2);let K=null,j={},st=i.getParameter(i.SCISSOR_BOX),at=i.getParameter(i.VIEWPORT),$t=new be().fromArray(st),Pt=new be().fromArray(at);function kt(k,ut,tt,dt){let xt=new Uint8Array(4),it=i.createTexture();i.bindTexture(k,it),i.texParameteri(k,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(k,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Rt=0;Rt<tt;Rt++)k===i.TEXTURE_3D||k===i.TEXTURE_2D_ARRAY?i.texImage3D(ut,0,i.RGBA,1,1,dt,0,i.RGBA,i.UNSIGNED_BYTE,xt):i.texImage2D(ut+Rt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,xt);return it}let $={};$[i.TEXTURE_2D]=kt(i.TEXTURE_2D,i.TEXTURE_2D,1),$[i.TEXTURE_CUBE_MAP]=kt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[i.TEXTURE_2D_ARRAY]=kt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),$[i.TEXTURE_3D]=kt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),et(i.DEPTH_TEST),o.setFunc(Ts),Ft(!1),Qt(yc),et(i.CULL_FACE),Vt(Qn);function et(k){h[k]!==!0&&(i.enable(k),h[k]=!0)}function vt(k){h[k]!==!1&&(i.disable(k),h[k]=!1)}function Nt(k,ut){return u[k]!==ut?(i.bindFramebuffer(k,ut),u[k]=ut,k===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=ut),k===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=ut),!0):!1}function yt(k,ut){let tt=g,dt=!1;if(k){tt=m.get(ut),tt===void 0&&(tt=[],m.set(ut,tt));let xt=k.textures;if(tt.length!==xt.length||tt[0]!==i.COLOR_ATTACHMENT0){for(let it=0,Rt=xt.length;it<Rt;it++)tt[it]=i.COLOR_ATTACHMENT0+it;tt.length=xt.length,dt=!0}}else tt[0]!==i.BACK&&(tt[0]=i.BACK,dt=!0);dt&&i.drawBuffers(tt)}function Ut(k){return x!==k?(i.useProgram(k),x=k,!0):!1}let Zt={[Ji]:i.FUNC_ADD,[Tu]:i.FUNC_SUBTRACT,[Eu]:i.FUNC_REVERSE_SUBTRACT};Zt[Au]=i.MIN,Zt[Ru]=i.MAX;let Bt={[Cu]:i.ZERO,[Pu]:i.ONE,[Iu]:i.SRC_COLOR,[Mc]:i.SRC_ALPHA,[Ou]:i.SRC_ALPHA_SATURATE,[Uu]:i.DST_COLOR,[Du]:i.DST_ALPHA,[Lu]:i.ONE_MINUS_SRC_COLOR,[bc]:i.ONE_MINUS_SRC_ALPHA,[Fu]:i.ONE_MINUS_DST_COLOR,[Nu]:i.ONE_MINUS_DST_ALPHA,[Bu]:i.CONSTANT_COLOR,[ku]:i.ONE_MINUS_CONSTANT_COLOR,[zu]:i.CONSTANT_ALPHA,[Hu]:i.ONE_MINUS_CONSTANT_ALPHA};function Vt(k,ut,tt,dt,xt,it,Rt,wt,ge,se){if(k===Qn){f===!0&&(vt(i.BLEND),f=!1);return}if(f===!1&&(et(i.BLEND),f=!0),k!==wu){if(k!==p||se!==A){if((y!==Ji||b!==Ji)&&(i.blendEquation(i.FUNC_ADD),y=Ji,b=Ji),se)switch(k){case Ii:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ti:i.blendFunc(i.ONE,i.ONE);break;case vc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case _c:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Ot("WebGLState: Invalid blending: ",k);break}else switch(k){case Ii:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ti:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case vc:Ot("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case _c:Ot("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ot("WebGLState: Invalid blending: ",k);break}S=null,v=null,E=null,R=null,_.set(0,0,0),T=0,p=k,A=se}return}xt=xt||ut,it=it||tt,Rt=Rt||dt,(ut!==y||xt!==b)&&(i.blendEquationSeparate(Zt[ut],Zt[xt]),y=ut,b=xt),(tt!==S||dt!==v||it!==E||Rt!==R)&&(i.blendFuncSeparate(Bt[tt],Bt[dt],Bt[it],Bt[Rt]),S=tt,v=dt,E=it,R=Rt),(wt.equals(_)===!1||ge!==T)&&(i.blendColor(wt.r,wt.g,wt.b,ge),_.copy(wt),T=ge),p=k,A=!1}function Yt(k,ut){k.side===En?vt(i.CULL_FACE):et(i.CULL_FACE);let tt=k.side===Ke;ut&&(tt=!tt),Ft(tt),k.blending===Ii&&k.transparent===!1?Vt(Qn):Vt(k.blending,k.blendEquation,k.blendSrc,k.blendDst,k.blendEquationAlpha,k.blendSrcAlpha,k.blendDstAlpha,k.blendColor,k.blendAlpha,k.premultipliedAlpha),o.setFunc(k.depthFunc),o.setTest(k.depthTest),o.setMask(k.depthWrite),r.setMask(k.colorWrite);let dt=k.stencilWrite;a.setTest(dt),dt&&(a.setMask(k.stencilWriteMask),a.setFunc(k.stencilFunc,k.stencilRef,k.stencilFuncMask),a.setOp(k.stencilFail,k.stencilZFail,k.stencilZPass)),Pe(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits),k.alphaToCoverage===!0?et(i.SAMPLE_ALPHA_TO_COVERAGE):vt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ft(k){I!==k&&(k?i.frontFace(i.CW):i.frontFace(i.CCW),I=k)}function Qt(k){k!==bu?(et(i.CULL_FACE),k!==P&&(k===yc?i.cullFace(i.BACK):k===Su?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):vt(i.CULL_FACE),P=k}function he(k){k!==N&&(W&&i.lineWidth(k),N=k)}function Pe(k,ut,tt){k?(et(i.POLYGON_OFFSET_FILL),(L!==ut||F!==tt)&&(L=ut,F=tt,o.getReversed()&&(ut=-ut),i.polygonOffset(ut,tt))):vt(i.POLYGON_OFFSET_FILL)}function te(k){k?et(i.SCISSOR_TEST):vt(i.SCISSOR_TEST)}function ue(k){k===void 0&&(k=i.TEXTURE0+H-1),K!==k&&(i.activeTexture(k),K=k)}function O(k,ut,tt){tt===void 0&&(K===null?tt=i.TEXTURE0+H-1:tt=K);let dt=j[tt];dt===void 0&&(dt={type:void 0,texture:void 0},j[tt]=dt),(dt.type!==k||dt.texture!==ut)&&(K!==tt&&(i.activeTexture(tt),K=tt),i.bindTexture(k,ut||$[k]),dt.type=k,dt.texture=ut)}function ve(){let k=j[K];k!==void 0&&k.type!==void 0&&(i.bindTexture(k.type,null),k.type=void 0,k.texture=void 0)}function ee(){try{i.compressedTexImage2D(...arguments)}catch(k){Ot("WebGLState:",k)}}function C(){try{i.compressedTexImage3D(...arguments)}catch(k){Ot("WebGLState:",k)}}function M(){try{i.texSubImage2D(...arguments)}catch(k){Ot("WebGLState:",k)}}function z(){try{i.texSubImage3D(...arguments)}catch(k){Ot("WebGLState:",k)}}function X(){try{i.compressedTexSubImage2D(...arguments)}catch(k){Ot("WebGLState:",k)}}function Z(){try{i.compressedTexSubImage3D(...arguments)}catch(k){Ot("WebGLState:",k)}}function rt(){try{i.texStorage2D(...arguments)}catch(k){Ot("WebGLState:",k)}}function lt(){try{i.texStorage3D(...arguments)}catch(k){Ot("WebGLState:",k)}}function J(){try{i.texImage2D(...arguments)}catch(k){Ot("WebGLState:",k)}}function nt(){try{i.texImage3D(...arguments)}catch(k){Ot("WebGLState:",k)}}function ct(k){return d[k]!==void 0?d[k]:i.getParameter(k)}function Et(k,ut){d[k]!==ut&&(i.pixelStorei(k,ut),d[k]=ut)}function ft(k){$t.equals(k)===!1&&(i.scissor(k.x,k.y,k.z,k.w),$t.copy(k))}function ht(k){Pt.equals(k)===!1&&(i.viewport(k.x,k.y,k.z,k.w),Pt.copy(k))}function At(k,ut){let tt=c.get(ut);tt===void 0&&(tt=new WeakMap,c.set(ut,tt));let dt=tt.get(k);dt===void 0&&(dt=i.getUniformBlockIndex(ut,k.name),tt.set(k,dt))}function It(k,ut){let dt=c.get(ut).get(k);l.get(ut)!==dt&&(i.uniformBlockBinding(ut,dt,k.__bindingPointIndex),l.set(ut,dt))}function Wt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},d={},K=null,j={},u={},m=new WeakMap,g=[],x=null,f=!1,p=null,y=null,S=null,v=null,b=null,E=null,R=null,_=new Ct(0,0,0),T=0,A=!1,I=null,P=null,N=null,L=null,F=null,$t.set(0,0,i.canvas.width,i.canvas.height),Pt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:et,disable:vt,bindFramebuffer:Nt,drawBuffers:yt,useProgram:Ut,setBlending:Vt,setMaterial:Yt,setFlipSided:Ft,setCullFace:Qt,setLineWidth:he,setPolygonOffset:Pe,setScissorTest:te,activeTexture:ue,bindTexture:O,unbindTexture:ve,compressedTexImage2D:ee,compressedTexImage3D:C,texImage2D:J,texImage3D:nt,pixelStorei:Et,getParameter:ct,updateUBOMapping:At,uniformBlockBinding:It,texStorage2D:rt,texStorage3D:lt,texSubImage2D:M,texSubImage3D:z,compressedTexSubImage2D:X,compressedTexSubImage3D:Z,scissor:ft,viewport:ht,reset:Wt}}function Py(i,t,e,n,s,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Lt,h=new WeakMap,d=new Set,u,m=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(C,M){return g?new OffscreenCanvas(C,M):Rs("canvas")}function f(C,M,z){let X=1,Z=ee(C);if((Z.width>z||Z.height>z)&&(X=z/Math.max(Z.width,Z.height)),X<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let rt=Math.floor(X*Z.width),lt=Math.floor(X*Z.height);u===void 0&&(u=x(rt,lt));let J=M?x(rt,lt):u;return J.width=rt,J.height=lt,J.getContext("2d").drawImage(C,0,0,rt,lt),Dt("WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+rt+"x"+lt+")."),J}else return"data"in C&&Dt("WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),C;return C}function p(C){return C.generateMipmaps}function y(C){i.generateMipmap(C)}function S(C){return C.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?i.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(C,M,z,X,Z,rt=!1){if(C!==null){if(i[C]!==void 0)return i[C];Dt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let lt;X&&(lt=t.get("EXT_texture_norm16"),lt||Dt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let J=M;if(M===i.RED&&(z===i.FLOAT&&(J=i.R32F),z===i.HALF_FLOAT&&(J=i.R16F),z===i.UNSIGNED_BYTE&&(J=i.R8),z===i.UNSIGNED_SHORT&&lt&&(J=lt.R16_EXT),z===i.SHORT&&lt&&(J=lt.R16_SNORM_EXT)),M===i.RED_INTEGER&&(z===i.UNSIGNED_BYTE&&(J=i.R8UI),z===i.UNSIGNED_SHORT&&(J=i.R16UI),z===i.UNSIGNED_INT&&(J=i.R32UI),z===i.BYTE&&(J=i.R8I),z===i.SHORT&&(J=i.R16I),z===i.INT&&(J=i.R32I)),M===i.RG&&(z===i.FLOAT&&(J=i.RG32F),z===i.HALF_FLOAT&&(J=i.RG16F),z===i.UNSIGNED_BYTE&&(J=i.RG8),z===i.UNSIGNED_SHORT&&lt&&(J=lt.RG16_EXT),z===i.SHORT&&lt&&(J=lt.RG16_SNORM_EXT)),M===i.RG_INTEGER&&(z===i.UNSIGNED_BYTE&&(J=i.RG8UI),z===i.UNSIGNED_SHORT&&(J=i.RG16UI),z===i.UNSIGNED_INT&&(J=i.RG32UI),z===i.BYTE&&(J=i.RG8I),z===i.SHORT&&(J=i.RG16I),z===i.INT&&(J=i.RG32I)),M===i.RGB_INTEGER&&(z===i.UNSIGNED_BYTE&&(J=i.RGB8UI),z===i.UNSIGNED_SHORT&&(J=i.RGB16UI),z===i.UNSIGNED_INT&&(J=i.RGB32UI),z===i.BYTE&&(J=i.RGB8I),z===i.SHORT&&(J=i.RGB16I),z===i.INT&&(J=i.RGB32I)),M===i.RGBA_INTEGER&&(z===i.UNSIGNED_BYTE&&(J=i.RGBA8UI),z===i.UNSIGNED_SHORT&&(J=i.RGBA16UI),z===i.UNSIGNED_INT&&(J=i.RGBA32UI),z===i.BYTE&&(J=i.RGBA8I),z===i.SHORT&&(J=i.RGBA16I),z===i.INT&&(J=i.RGBA32I)),M===i.RGB&&(z===i.UNSIGNED_SHORT&&lt&&(J=lt.RGB16_EXT),z===i.SHORT&&lt&&(J=lt.RGB16_SNORM_EXT),z===i.UNSIGNED_INT_5_9_9_9_REV&&(J=i.RGB9_E5),z===i.UNSIGNED_INT_10F_11F_11F_REV&&(J=i.R11F_G11F_B10F)),M===i.RGBA){let nt=rt?pr:Jt.getTransfer(Z);z===i.FLOAT&&(J=i.RGBA32F),z===i.HALF_FLOAT&&(J=i.RGBA16F),z===i.UNSIGNED_BYTE&&(J=nt===oe?i.SRGB8_ALPHA8:i.RGBA8),z===i.UNSIGNED_SHORT&&lt&&(J=lt.RGBA16_EXT),z===i.SHORT&&lt&&(J=lt.RGBA16_SNORM_EXT),z===i.UNSIGNED_SHORT_4_4_4_4&&(J=i.RGBA4),z===i.UNSIGNED_SHORT_5_5_5_1&&(J=i.RGB5_A1)}return(J===i.R16F||J===i.R32F||J===i.RG16F||J===i.RG32F||J===i.RGBA16F||J===i.RGBA32F)&&t.get("EXT_color_buffer_float"),J}function b(C,M){let z;return C?M===null||M===zn||M===Gs?z=i.DEPTH24_STENCIL8:M===An?z=i.DEPTH32F_STENCIL8:M===Vs&&(z=i.DEPTH24_STENCIL8,Dt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===zn||M===Gs?z=i.DEPTH_COMPONENT24:M===An?z=i.DEPTH_COMPONENT32F:M===Vs&&(z=i.DEPTH_COMPONENT16),z}function E(C,M){return p(C)===!0||C.isFramebufferTexture&&C.minFilter!==Xe&&C.minFilter!==Ze?Math.log2(Math.max(M.width,M.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?M.mipmaps.length:1}function R(C){let M=C.target;M.removeEventListener("dispose",R),T(M),M.isVideoTexture&&h.delete(M),M.isHTMLTexture&&d.delete(M)}function _(C){let M=C.target;M.removeEventListener("dispose",_),I(M)}function T(C){let M=n.get(C);if(M.__webglInit===void 0)return;let z=C.source,X=m.get(z);if(X){let Z=X[M.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&A(C),Object.keys(X).length===0&&m.delete(z)}n.remove(C)}function A(C){let M=n.get(C);i.deleteTexture(M.__webglTexture);let z=C.source,X=m.get(z);delete X[M.__cacheKey],o.memory.textures--}function I(C){let M=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(M.__webglFramebuffer[X]))for(let Z=0;Z<M.__webglFramebuffer[X].length;Z++)i.deleteFramebuffer(M.__webglFramebuffer[X][Z]);else i.deleteFramebuffer(M.__webglFramebuffer[X]);M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer[X])}else{if(Array.isArray(M.__webglFramebuffer))for(let X=0;X<M.__webglFramebuffer.length;X++)i.deleteFramebuffer(M.__webglFramebuffer[X]);else i.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&i.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let X=0;X<M.__webglColorRenderbuffer.length;X++)M.__webglColorRenderbuffer[X]&&i.deleteRenderbuffer(M.__webglColorRenderbuffer[X]);M.__webglDepthRenderbuffer&&i.deleteRenderbuffer(M.__webglDepthRenderbuffer)}let z=C.textures;for(let X=0,Z=z.length;X<Z;X++){let rt=n.get(z[X]);rt.__webglTexture&&(i.deleteTexture(rt.__webglTexture),o.memory.textures--),n.remove(z[X])}n.remove(C)}let P=0;function N(){P=0}function L(){return P}function F(C){P=C}function H(){let C=P;return C>=s.maxTextures&&Dt("WebGLTextures: Trying to use "+(C+1)+" texture units while this GPU supports only "+s.maxTextures),P+=1,C}function W(C){let M=[];return M.push(C.wrapS),M.push(C.wrapT),M.push(C.wrapR||0),M.push(C.magFilter),M.push(C.minFilter),M.push(C.anisotropy),M.push(C.internalFormat),M.push(C.format),M.push(C.type),M.push(C.generateMipmaps),M.push(C.premultiplyAlpha),M.push(C.flipY),M.push(C.unpackAlignment),M.push(C.colorSpace),M.join()}function Q(C,M){let z=n.get(C);if(C.isVideoTexture&&O(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&z.__version!==C.version){let X=C.image;if(X===null)Dt("WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)Dt("WebGLRenderer: Texture marked for update but image is incomplete");else{vt(z,C,M);return}}else C.isExternalTexture&&(z.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,z.__webglTexture,i.TEXTURE0+M)}function q(C,M){let z=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&z.__version!==C.version){vt(z,C,M);return}else C.isExternalTexture&&(z.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,z.__webglTexture,i.TEXTURE0+M)}function K(C,M){let z=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&z.__version!==C.version){vt(z,C,M);return}e.bindTexture(i.TEXTURE_3D,z.__webglTexture,i.TEXTURE0+M)}function j(C,M){let z=n.get(C);if(C.isCubeDepthTexture!==!0&&C.version>0&&z.__version!==C.version){Nt(z,C,M);return}e.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture,i.TEXTURE0+M)}let st={[Es]:i.REPEAT,[Yn]:i.CLAMP_TO_EDGE,[Go]:i.MIRRORED_REPEAT},at={[Xe]:i.NEAREST,[Wu]:i.NEAREST_MIPMAP_NEAREST,[kr]:i.NEAREST_MIPMAP_LINEAR,[Ze]:i.LINEAR,[xa]:i.LINEAR_MIPMAP_NEAREST,[Di]:i.LINEAR_MIPMAP_LINEAR},$t={[$u]:i.NEVER,[Qu]:i.ALWAYS,[Zu]:i.LESS,[el]:i.LEQUAL,[Ku]:i.EQUAL,[nl]:i.GEQUAL,[Ju]:i.GREATER,[ju]:i.NOTEQUAL};function Pt(C,M){if(M.type===An&&t.has("OES_texture_float_linear")===!1&&(M.magFilter===Ze||M.magFilter===xa||M.magFilter===kr||M.magFilter===Di||M.minFilter===Ze||M.minFilter===xa||M.minFilter===kr||M.minFilter===Di)&&Dt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(C,i.TEXTURE_WRAP_S,st[M.wrapS]),i.texParameteri(C,i.TEXTURE_WRAP_T,st[M.wrapT]),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,st[M.wrapR]),i.texParameteri(C,i.TEXTURE_MAG_FILTER,at[M.magFilter]),i.texParameteri(C,i.TEXTURE_MIN_FILTER,at[M.minFilter]),M.compareFunction&&(i.texParameteri(C,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(C,i.TEXTURE_COMPARE_FUNC,$t[M.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===Xe||M.minFilter!==kr&&M.minFilter!==Di||M.type===An&&t.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){let z=t.get("EXT_texture_filter_anisotropic");i.texParameterf(C,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function kt(C,M){let z=!1;C.__webglInit===void 0&&(C.__webglInit=!0,M.addEventListener("dispose",R));let X=M.source,Z=m.get(X);Z===void 0&&(Z={},m.set(X,Z));let rt=W(M);if(rt!==C.__cacheKey){Z[rt]===void 0&&(Z[rt]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,z=!0),Z[rt].usedTimes++;let lt=Z[C.__cacheKey];lt!==void 0&&(Z[C.__cacheKey].usedTimes--,lt.usedTimes===0&&A(M)),C.__cacheKey=rt,C.__webglTexture=Z[rt].texture}return z}function $(C,M,z){return Math.floor(Math.floor(C/z)/M)}function et(C,M,z,X){let rt=C.updateRanges;if(rt.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,M.width,M.height,z,X,M.data);else{rt.sort((Et,ft)=>Et.start-ft.start);let lt=0;for(let Et=1;Et<rt.length;Et++){let ft=rt[lt],ht=rt[Et],At=ft.start+ft.count,It=$(ht.start,M.width,4),Wt=$(ft.start,M.width,4);ht.start<=At+1&&It===Wt&&$(ht.start+ht.count-1,M.width,4)===It?ft.count=Math.max(ft.count,ht.start+ht.count-ft.start):(++lt,rt[lt]=ht)}rt.length=lt+1;let J=e.getParameter(i.UNPACK_ROW_LENGTH),nt=e.getParameter(i.UNPACK_SKIP_PIXELS),ct=e.getParameter(i.UNPACK_SKIP_ROWS);e.pixelStorei(i.UNPACK_ROW_LENGTH,M.width);for(let Et=0,ft=rt.length;Et<ft;Et++){let ht=rt[Et],At=Math.floor(ht.start/4),It=Math.ceil(ht.count/4),Wt=At%M.width,k=Math.floor(At/M.width),ut=It,tt=1;e.pixelStorei(i.UNPACK_SKIP_PIXELS,Wt),e.pixelStorei(i.UNPACK_SKIP_ROWS,k),e.texSubImage2D(i.TEXTURE_2D,0,Wt,k,ut,tt,z,X,M.data)}C.clearUpdateRanges(),e.pixelStorei(i.UNPACK_ROW_LENGTH,J),e.pixelStorei(i.UNPACK_SKIP_PIXELS,nt),e.pixelStorei(i.UNPACK_SKIP_ROWS,ct)}}function vt(C,M,z){let X=i.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(X=i.TEXTURE_2D_ARRAY),M.isData3DTexture&&(X=i.TEXTURE_3D);let Z=kt(C,M),rt=M.source;e.bindTexture(X,C.__webglTexture,i.TEXTURE0+z);let lt=n.get(rt);if(rt.version!==lt.__version||Z===!0){if(e.activeTexture(i.TEXTURE0+z),(typeof ImageBitmap<"u"&&M.image instanceof ImageBitmap)===!1){let tt=Jt.getPrimaries(Jt.workingColorSpace),dt=M.colorSpace===Vn?null:Jt.getPrimaries(M.colorSpace),xt=M.colorSpace===Vn||tt===dt?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,xt)}e.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment);let nt=f(M.image,!1,s.maxTextureSize);nt=ve(M,nt);let ct=r.convert(M.format,M.colorSpace),Et=r.convert(M.type),ft=v(M.internalFormat,ct,Et,M.normalized,M.colorSpace,M.isVideoTexture);Pt(X,M);let ht,At=M.mipmaps,It=M.isVideoTexture!==!0,Wt=lt.__version===void 0||Z===!0,k=rt.dataReady,ut=E(M,nt);if(M.isDepthTexture)ft=b(M.format===Ni,M.type),Wt&&(It?e.texStorage2D(i.TEXTURE_2D,1,ft,nt.width,nt.height):e.texImage2D(i.TEXTURE_2D,0,ft,nt.width,nt.height,0,ct,Et,null));else if(M.isDataTexture)if(At.length>0){It&&Wt&&e.texStorage2D(i.TEXTURE_2D,ut,ft,At[0].width,At[0].height);for(let tt=0,dt=At.length;tt<dt;tt++)ht=At[tt],It?k&&e.texSubImage2D(i.TEXTURE_2D,tt,0,0,ht.width,ht.height,ct,Et,ht.data):e.texImage2D(i.TEXTURE_2D,tt,ft,ht.width,ht.height,0,ct,Et,ht.data);M.generateMipmaps=!1}else It?(Wt&&e.texStorage2D(i.TEXTURE_2D,ut,ft,nt.width,nt.height),k&&et(M,nt,ct,Et)):e.texImage2D(i.TEXTURE_2D,0,ft,nt.width,nt.height,0,ct,Et,nt.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){It&&Wt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ut,ft,At[0].width,At[0].height,nt.depth);for(let tt=0,dt=At.length;tt<dt;tt++)if(ht=At[tt],M.format!==Rn)if(ct!==null)if(It){if(k)if(M.layerUpdates.size>0){let xt=Vc(ht.width,ht.height,M.format,M.type);for(let it of M.layerUpdates){let Rt=ht.data.subarray(it*xt/ht.data.BYTES_PER_ELEMENT,(it+1)*xt/ht.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,tt,0,0,it,ht.width,ht.height,1,ct,Rt)}}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,tt,0,0,0,ht.width,ht.height,nt.depth,ct,ht.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,tt,ft,ht.width,ht.height,nt.depth,0,ht.data,0,0);else Dt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else It?k&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,tt,0,0,0,ht.width,ht.height,nt.depth,ct,Et,ht.data):e.texImage3D(i.TEXTURE_2D_ARRAY,tt,ft,ht.width,ht.height,nt.depth,0,ct,Et,ht.data);M.layerUpdates.size>0&&M.clearLayerUpdates()}else{It&&Wt&&e.texStorage2D(i.TEXTURE_2D,ut,ft,At[0].width,At[0].height);for(let tt=0,dt=At.length;tt<dt;tt++)ht=At[tt],M.format!==Rn?ct!==null?It?k&&e.compressedTexSubImage2D(i.TEXTURE_2D,tt,0,0,ht.width,ht.height,ct,ht.data):e.compressedTexImage2D(i.TEXTURE_2D,tt,ft,ht.width,ht.height,0,ht.data):Dt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):It?k&&e.texSubImage2D(i.TEXTURE_2D,tt,0,0,ht.width,ht.height,ct,Et,ht.data):e.texImage2D(i.TEXTURE_2D,tt,ft,ht.width,ht.height,0,ct,Et,ht.data)}else if(M.isDataArrayTexture)if(It){if(Wt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ut,ft,nt.width,nt.height,nt.depth),k)if(M.layerUpdates.size>0){let tt=Vc(nt.width,nt.height,M.format,M.type);for(let dt of M.layerUpdates){let xt=nt.data.subarray(dt*tt/nt.data.BYTES_PER_ELEMENT,(dt+1)*tt/nt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,dt,nt.width,nt.height,1,ct,Et,xt)}M.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,nt.width,nt.height,nt.depth,ct,Et,nt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,ft,nt.width,nt.height,nt.depth,0,ct,Et,nt.data);else if(M.isData3DTexture)It?(Wt&&e.texStorage3D(i.TEXTURE_3D,ut,ft,nt.width,nt.height,nt.depth),k&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,nt.width,nt.height,nt.depth,ct,Et,nt.data)):e.texImage3D(i.TEXTURE_3D,0,ft,nt.width,nt.height,nt.depth,0,ct,Et,nt.data);else if(M.isFramebufferTexture){if(Wt)if(It)e.texStorage2D(i.TEXTURE_2D,ut,ft,nt.width,nt.height);else{let tt=nt.width,dt=nt.height;for(let xt=0;xt<ut;xt++)e.texImage2D(i.TEXTURE_2D,xt,ft,tt,dt,0,ct,Et,null),tt>>=1,dt>>=1}}else if(M.isHTMLTexture){if("texElementImage2D"in i){let tt=i.canvas;if(tt.hasAttribute("layoutsubtree")||tt.setAttribute("layoutsubtree","true"),nt.parentNode!==tt){tt.appendChild(nt),d.add(M),tt.onpaint=dt=>{let xt=dt.changedElements;for(let it of d)xt.includes(it.image)&&(it.needsUpdate=!0)},tt.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,nt);else{let xt=i.RGBA,it=i.RGBA,Rt=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,xt,it,Rt,nt)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(At.length>0){if(It&&Wt){let tt=ee(At[0]);e.texStorage2D(i.TEXTURE_2D,ut,ft,tt.width,tt.height)}for(let tt=0,dt=At.length;tt<dt;tt++)ht=At[tt],It?k&&e.texSubImage2D(i.TEXTURE_2D,tt,0,0,ct,Et,ht):e.texImage2D(i.TEXTURE_2D,tt,ft,ct,Et,ht);M.generateMipmaps=!1}else if(It){if(Wt){let tt=ee(nt);e.texStorage2D(i.TEXTURE_2D,ut,ft,tt.width,tt.height)}k&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,ct,Et,nt)}else e.texImage2D(i.TEXTURE_2D,0,ft,ct,Et,nt);p(M)&&y(X),lt.__version=rt.version,M.onUpdate&&M.onUpdate(M)}C.__version=M.version}function Nt(C,M,z){if(M.image.length!==6)return;let X=kt(C,M),Z=M.source;e.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture,i.TEXTURE0+z);let rt=n.get(Z);if(Z.version!==rt.__version||X===!0){e.activeTexture(i.TEXTURE0+z);let lt=Jt.getPrimaries(Jt.workingColorSpace),J=M.colorSpace===Vn?null:Jt.getPrimaries(M.colorSpace),nt=M.colorSpace===Vn||lt===J?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),e.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,nt);let ct=M.isCompressedTexture||M.image[0].isCompressedTexture,Et=M.image[0]&&M.image[0].isDataTexture,ft=[];for(let it=0;it<6;it++)!ct&&!Et?ft[it]=f(M.image[it],!0,s.maxCubemapSize):ft[it]=Et?M.image[it].image:M.image[it],ft[it]=ve(M,ft[it]);let ht=ft[0],At=r.convert(M.format,M.colorSpace),It=r.convert(M.type),Wt=v(M.internalFormat,At,It,M.normalized,M.colorSpace),k=M.isVideoTexture!==!0,ut=rt.__version===void 0||X===!0,tt=Z.dataReady,dt=E(M,ht);Pt(i.TEXTURE_CUBE_MAP,M);let xt;if(ct){k&&ut&&e.texStorage2D(i.TEXTURE_CUBE_MAP,dt,Wt,ht.width,ht.height);for(let it=0;it<6;it++){xt=ft[it].mipmaps;for(let Rt=0;Rt<xt.length;Rt++){let wt=xt[Rt];M.format!==Rn?At!==null?k?tt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,Rt,0,0,wt.width,wt.height,At,wt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,Rt,Wt,wt.width,wt.height,0,wt.data):Dt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):k?tt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,Rt,0,0,wt.width,wt.height,At,It,wt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,Rt,Wt,wt.width,wt.height,0,At,It,wt.data)}}}else{if(xt=M.mipmaps,k&&ut){xt.length>0&&dt++;let it=ee(ft[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,dt,Wt,it.width,it.height)}for(let it=0;it<6;it++)if(Et){k?tt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,0,0,ft[it].width,ft[it].height,At,It,ft[it].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,Wt,ft[it].width,ft[it].height,0,At,It,ft[it].data);for(let Rt=0;Rt<xt.length;Rt++){let ge=xt[Rt].image[it].image;k?tt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,Rt+1,0,0,ge.width,ge.height,At,It,ge.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,Rt+1,Wt,ge.width,ge.height,0,At,It,ge.data)}}else{k?tt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,0,0,At,It,ft[it]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,Wt,At,It,ft[it]);for(let Rt=0;Rt<xt.length;Rt++){let wt=xt[Rt];k?tt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,Rt+1,0,0,At,It,wt.image[it]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,Rt+1,Wt,At,It,wt.image[it])}}}p(M)&&y(i.TEXTURE_CUBE_MAP),rt.__version=Z.version,M.onUpdate&&M.onUpdate(M)}C.__version=M.version}function yt(C,M,z,X,Z,rt){let lt=r.convert(z.format,z.colorSpace),J=r.convert(z.type),nt=v(z.internalFormat,lt,J,z.normalized,z.colorSpace),ct=n.get(M),Et=n.get(z);if(Et.__renderTarget=M,!ct.__hasExternalTextures){let ft=Math.max(1,M.width>>rt),ht=Math.max(1,M.height>>rt);Z===i.TEXTURE_3D||Z===i.TEXTURE_2D_ARRAY?e.texImage3D(Z,rt,nt,ft,ht,M.depth,0,lt,J,null):e.texImage2D(Z,rt,nt,ft,ht,0,lt,J,null)}e.bindFramebuffer(i.FRAMEBUFFER,C),ue(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,X,Z,Et.__webglTexture,0,te(M)):(Z===i.TEXTURE_2D||Z>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,X,Z,Et.__webglTexture,rt),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ut(C,M,z){if(i.bindRenderbuffer(i.RENDERBUFFER,C),M.depthBuffer){let X=M.depthTexture,Z=X&&X.isDepthTexture?X.type:null,rt=b(M.stencilBuffer,Z),lt=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;ue(M)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,te(M),rt,M.width,M.height):z?i.renderbufferStorageMultisample(i.RENDERBUFFER,te(M),rt,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,rt,M.width,M.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,lt,i.RENDERBUFFER,C)}else{let X=M.textures;for(let Z=0;Z<X.length;Z++){let rt=X[Z],lt=r.convert(rt.format,rt.colorSpace),J=r.convert(rt.type),nt=v(rt.internalFormat,lt,J,rt.normalized,rt.colorSpace);ue(M)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,te(M),nt,M.width,M.height):z?i.renderbufferStorageMultisample(i.RENDERBUFFER,te(M),nt,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,nt,M.width,M.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Zt(C,M,z){let X=M.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(i.FRAMEBUFFER,C),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let Z=n.get(M.depthTexture);if(Z.__renderTarget=M,(!Z.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),X){if(Z.__webglInit===void 0&&(Z.__webglInit=!0,M.depthTexture.addEventListener("dispose",R)),Z.__webglTexture===void 0){Z.__webglTexture=i.createTexture(),e.bindTexture(i.TEXTURE_CUBE_MAP,Z.__webglTexture),Pt(i.TEXTURE_CUBE_MAP,M.depthTexture);let ct=r.convert(M.depthTexture.format),Et=r.convert(M.depthTexture.type),ft;M.depthTexture.format===$n?ft=i.DEPTH_COMPONENT24:M.depthTexture.format===Ni&&(ft=i.DEPTH24_STENCIL8);for(let ht=0;ht<6;ht++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,ft,M.width,M.height,0,ct,Et,null)}}else Q(M.depthTexture,0);let rt=Z.__webglTexture,lt=te(M),J=X?i.TEXTURE_CUBE_MAP_POSITIVE_X+z:i.TEXTURE_2D,nt=M.depthTexture.format===Ni?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(M.depthTexture.format===$n)ue(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,nt,J,rt,0,lt):i.framebufferTexture2D(i.FRAMEBUFFER,nt,J,rt,0);else if(M.depthTexture.format===Ni)ue(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,nt,J,rt,0,lt):i.framebufferTexture2D(i.FRAMEBUFFER,nt,J,rt,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Bt(C){let M=n.get(C),z=C.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==C.depthTexture){let X=C.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),X){let Z=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,X.removeEventListener("dispose",Z)};X.addEventListener("dispose",Z),M.__depthDisposeCallback=Z}M.__boundDepthTexture=X}if(C.depthTexture&&!M.__autoAllocateDepthBuffer)if(z)for(let X=0;X<6;X++)Zt(M.__webglFramebuffer[X],C,X);else{let X=C.texture.mipmaps;X&&X.length>0?Zt(M.__webglFramebuffer[0],C,0):Zt(M.__webglFramebuffer,C,0)}else if(z){M.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[X]),M.__webglDepthbuffer[X]===void 0)M.__webglDepthbuffer[X]=i.createRenderbuffer(),Ut(M.__webglDepthbuffer[X],C,!1);else{let Z=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,rt=M.__webglDepthbuffer[X];i.bindRenderbuffer(i.RENDERBUFFER,rt),i.framebufferRenderbuffer(i.FRAMEBUFFER,Z,i.RENDERBUFFER,rt)}}else{let X=C.texture.mipmaps;if(X&&X.length>0?e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=i.createRenderbuffer(),Ut(M.__webglDepthbuffer,C,!1);else{let Z=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,rt=M.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,rt),i.framebufferRenderbuffer(i.FRAMEBUFFER,Z,i.RENDERBUFFER,rt)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Vt(C,M,z){let X=n.get(C);M!==void 0&&yt(X.__webglFramebuffer,C,C.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),z!==void 0&&Bt(C)}function Yt(C){let M=C.texture,z=n.get(C),X=n.get(M);C.addEventListener("dispose",_);let Z=C.textures,rt=C.isWebGLCubeRenderTarget===!0,lt=Z.length>1;if(lt||(X.__webglTexture===void 0&&(X.__webglTexture=i.createTexture()),X.__version=M.version,o.memory.textures++),rt){z.__webglFramebuffer=[];for(let J=0;J<6;J++)if(M.mipmaps&&M.mipmaps.length>0){z.__webglFramebuffer[J]=[];for(let nt=0;nt<M.mipmaps.length;nt++)z.__webglFramebuffer[J][nt]=i.createFramebuffer()}else z.__webglFramebuffer[J]=i.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){z.__webglFramebuffer=[];for(let J=0;J<M.mipmaps.length;J++)z.__webglFramebuffer[J]=i.createFramebuffer()}else z.__webglFramebuffer=i.createFramebuffer();if(lt)for(let J=0,nt=Z.length;J<nt;J++){let ct=n.get(Z[J]);ct.__webglTexture===void 0&&(ct.__webglTexture=i.createTexture(),o.memory.textures++)}if(C.samples>0&&ue(C)===!1){z.__webglMultisampledFramebuffer=i.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let J=0;J<Z.length;J++){let nt=Z[J];z.__webglColorRenderbuffer[J]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,z.__webglColorRenderbuffer[J]);let ct=r.convert(nt.format,nt.colorSpace),Et=r.convert(nt.type),ft=v(nt.internalFormat,ct,Et,nt.normalized,nt.colorSpace,C.isXRRenderTarget===!0),ht=te(C);i.renderbufferStorageMultisample(i.RENDERBUFFER,ht,ft,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+J,i.RENDERBUFFER,z.__webglColorRenderbuffer[J])}i.bindRenderbuffer(i.RENDERBUFFER,null),C.depthBuffer&&(z.__webglDepthRenderbuffer=i.createRenderbuffer(),Ut(z.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(rt){e.bindTexture(i.TEXTURE_CUBE_MAP,X.__webglTexture),Pt(i.TEXTURE_CUBE_MAP,M);for(let J=0;J<6;J++)if(M.mipmaps&&M.mipmaps.length>0)for(let nt=0;nt<M.mipmaps.length;nt++)yt(z.__webglFramebuffer[J][nt],C,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+J,nt);else yt(z.__webglFramebuffer[J],C,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0);p(M)&&y(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(lt){for(let J=0,nt=Z.length;J<nt;J++){let ct=Z[J],Et=n.get(ct),ft=i.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ft=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ft,Et.__webglTexture),Pt(ft,ct),yt(z.__webglFramebuffer,C,ct,i.COLOR_ATTACHMENT0+J,ft,0),p(ct)&&y(ft)}e.unbindTexture()}else{let J=i.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(J=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(J,X.__webglTexture),Pt(J,M),M.mipmaps&&M.mipmaps.length>0)for(let nt=0;nt<M.mipmaps.length;nt++)yt(z.__webglFramebuffer[nt],C,M,i.COLOR_ATTACHMENT0,J,nt);else yt(z.__webglFramebuffer,C,M,i.COLOR_ATTACHMENT0,J,0);p(M)&&y(J),e.unbindTexture()}C.depthBuffer&&Bt(C)}function Ft(C){let M=C.textures;for(let z=0,X=M.length;z<X;z++){let Z=M[z];if(p(Z)){let rt=S(C),lt=n.get(Z).__webglTexture;e.bindTexture(rt,lt),y(rt),e.unbindTexture()}}}let Qt=[],he=[];function Pe(C){if(C.samples>0){if(ue(C)===!1){let M=C.textures,z=C.width,X=C.height,Z=i.COLOR_BUFFER_BIT,rt=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,lt=n.get(C),J=M.length>1;if(J)for(let ct=0;ct<M.length;ct++)e.bindFramebuffer(i.FRAMEBUFFER,lt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ct,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,lt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ct,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,lt.__webglMultisampledFramebuffer);let nt=C.texture.mipmaps;nt&&nt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,lt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,lt.__webglFramebuffer);for(let ct=0;ct<M.length;ct++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(Z|=i.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(Z|=i.STENCIL_BUFFER_BIT)),J){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,lt.__webglColorRenderbuffer[ct]);let Et=n.get(M[ct]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Et,0)}i.blitFramebuffer(0,0,z,X,0,0,z,X,Z,i.NEAREST),l===!0&&(Qt.length=0,he.length=0,Qt.push(i.COLOR_ATTACHMENT0+ct),C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&(Qt.push(rt),he.push(rt),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,he)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Qt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),J)for(let ct=0;ct<M.length;ct++){e.bindFramebuffer(i.FRAMEBUFFER,lt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ct,i.RENDERBUFFER,lt.__webglColorRenderbuffer[ct]);let Et=n.get(M[ct]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,lt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ct,i.TEXTURE_2D,Et,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,lt.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&l){let M=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[M])}}}function te(C){return Math.min(s.maxSamples,C.samples)}function ue(C){let M=n.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function O(C){let M=o.render.frame;h.get(C)!==M&&(h.set(C,M),C.update())}function ve(C,M){let z=C.colorSpace,X=C.format,Z=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||z!==fr&&z!==Vn&&(Jt.getTransfer(z)===oe?(X!==Rn||Z!==dn)&&Dt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ot("WebGLTextures: Unsupported texture color space:",z)),M}function ee(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=H,this.resetTextureUnits=N,this.getTextureUnits=L,this.setTextureUnits=F,this.setTexture2D=Q,this.setTexture2DArray=q,this.setTexture3D=K,this.setTextureCube=j,this.rebindTextures=Vt,this.setupRenderTarget=Yt,this.updateRenderTargetMipmap=Ft,this.updateMultisampleRenderTarget=Pe,this.setupDepthRenderbuffer=Bt,this.setupFrameBufferTexture=yt,this.useMultisampledRTT=ue,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function Iy(i,t){function e(n,s=Vn){let r,o=Jt.getTransfer(s);if(n===dn)return i.UNSIGNED_BYTE;if(n===va)return i.UNSIGNED_SHORT_4_4_4_4;if(n===_a)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Lc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Dc)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Pc)return i.BYTE;if(n===Ic)return i.SHORT;if(n===Vs)return i.UNSIGNED_SHORT;if(n===ya)return i.INT;if(n===zn)return i.UNSIGNED_INT;if(n===An)return i.FLOAT;if(n===Hn)return i.HALF_FLOAT;if(n===Nc)return i.ALPHA;if(n===Uc)return i.RGB;if(n===Rn)return i.RGBA;if(n===$n)return i.DEPTH_COMPONENT;if(n===Ni)return i.DEPTH_STENCIL;if(n===Ma)return i.RED;if(n===ba)return i.RED_INTEGER;if(n===Ui)return i.RG;if(n===Sa)return i.RG_INTEGER;if(n===wa)return i.RGBA_INTEGER;if(n===zr||n===Hr||n===Vr||n===Gr)if(o===oe)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===zr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Hr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Vr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Gr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===zr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Hr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Vr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Gr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ta||n===Ea||n===Aa||n===Ra)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ta)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ea)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Aa)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ra)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ca||n===Pa||n===Ia||n===La||n===Da||n===Wr||n===Na)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ca||n===Pa)return o===oe?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ia)return o===oe?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===La)return r.COMPRESSED_R11_EAC;if(n===Da)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Wr)return r.COMPRESSED_RG11_EAC;if(n===Na)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Ua||n===Fa||n===Oa||n===Ba||n===ka||n===za||n===Ha||n===Va||n===Ga||n===Wa||n===Xa||n===qa||n===Ya||n===$a)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Ua)return o===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Fa)return o===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Oa)return o===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ba)return o===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ka)return o===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===za)return o===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ha)return o===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Va)return o===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ga)return o===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Wa)return o===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Xa)return o===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===qa)return o===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ya)return o===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===$a)return o===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Za||n===Ka||n===Ja)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Za)return o===oe?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ka)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ja)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ja||n===Qa||n===Xr||n===tl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===ja)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Qa)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Xr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===tl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Gs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}var Ly=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Dy=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,ah=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new Tr(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new cn({vertexShader:Ly,fragmentShader:Dy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Ht(new _n(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},lh=class extends Zn{constructor(t,e){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,u=null,m=null,g=null,x=typeof XRWebGLBinding<"u",f=new ah,p={},y=e.getContextAttributes(),S=null,v=null,b=[],E=[],R=new Lt,_=null,T=null,A=new De;A.viewport=new be;let I=new De;I.viewport=new be;let P=[A,I],N=new ua,L=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let et=b[$];return et===void 0&&(et=new Ls,b[$]=et),et.getTargetRaySpace()},this.getControllerGrip=function($){let et=b[$];return et===void 0&&(et=new Ls,b[$]=et),et.getGripSpace()},this.getHand=function($){let et=b[$];return et===void 0&&(et=new Ls,b[$]=et),et.getHandSpace()};function H($){let et=E.indexOf($.inputSource);if(et===-1)return;let vt=b[et];vt!==void 0&&(vt.update($.inputSource,$.frame,c||o),vt.dispatchEvent({type:$.type,data:$.inputSource}))}function W(){s.removeEventListener("select",H),s.removeEventListener("selectstart",H),s.removeEventListener("selectend",H),s.removeEventListener("squeeze",H),s.removeEventListener("squeezestart",H),s.removeEventListener("squeezeend",H),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",Q);for(let $=0;$<b.length;$++){let et=E[$];et!==null&&(E[$]=null,b[$].disconnect(et))}L=null,F=null,f.reset();for(let $ in p)delete p[$];if(t.setRenderTarget(S),m=null,u=null,d=null,s=null,v=null,kt.stop(),n.isPresenting=!1,t.setPixelRatio(_),t.setSize(R.width,R.height,!1),T!==null){let $=T.camera;$.fov=T.fov,$.zoom=T.zoom,$.updateProjectionMatrix(),T=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,n.isPresenting===!0&&Dt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){a=$,n.isPresenting===!0&&Dt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function($){c=$},this.getBaseLayer=function(){return u!==null?u:m},this.getBinding=function(){return d===null&&x&&(d=new XRWebGLBinding(s,e)),d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(S=t.getRenderTarget(),s.addEventListener("select",H),s.addEventListener("selectstart",H),s.addEventListener("selectend",H),s.addEventListener("squeeze",H),s.addEventListener("squeezestart",H),s.addEventListener("squeezeend",H),s.addEventListener("end",W),s.addEventListener("inputsourceschange",Q),y.xrCompatible!==!0&&await e.makeXRCompatible(),_=t.getPixelRatio(),t.getSize(R),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let vt=null,Nt=null,yt=null;y.depth&&(yt=y.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,vt=y.stencil?Ni:$n,Nt=y.stencil?Gs:zn);let Ut={colorFormat:e.RGBA8,depthFormat:yt,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(Ut),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),v=new un(u.textureWidth,u.textureHeight,{format:Rn,type:dn,depthTexture:new wi(u.textureWidth,u.textureHeight,Nt,void 0,void 0,void 0,void 0,void 0,void 0,vt),stencilBuffer:y.stencil,colorSpace:t.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{let vt={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,e,vt),s.updateRenderState({baseLayer:m}),t.setPixelRatio(1),t.setSize(m.framebufferWidth,m.framebufferHeight,!1),v=new un(m.framebufferWidth,m.framebufferHeight,{format:Rn,type:dn,colorSpace:t.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1,storeMultisampledDepthBuffer:m.ignoreDepthValues===!1,storeMultisampledStencilBuffer:m.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),kt.setContext(s),kt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return f.getDepthTexture()};function Q($){for(let et=0;et<$.removed.length;et++){let vt=$.removed[et],Nt=E.indexOf(vt);Nt>=0&&(E[Nt]=null,b[Nt].disconnect(vt))}for(let et=0;et<$.added.length;et++){let vt=$.added[et],Nt=E.indexOf(vt);if(Nt===-1){for(let Ut=0;Ut<b.length;Ut++)if(Ut>=E.length){E.push(vt),Nt=Ut;break}else if(E[Ut]===null){E[Ut]=vt,Nt=Ut;break}if(Nt===-1)break}let yt=b[Nt];yt&&yt.connect(vt)}}let q=new U,K=new U;function j($,et,vt){q.setFromMatrixPosition(et.matrixWorld),K.setFromMatrixPosition(vt.matrixWorld);let Nt=q.distanceTo(K),yt=et.projectionMatrix.elements,Ut=vt.projectionMatrix.elements,Zt=yt[14]/(yt[10]-1),Bt=yt[14]/(yt[10]+1),Vt=(yt[9]+1)/yt[5],Yt=(yt[9]-1)/yt[5],Ft=(yt[8]-1)/yt[0],Qt=(Ut[8]+1)/Ut[0],he=Zt*Ft,Pe=Zt*Qt,te=Nt/(-Ft+Qt),ue=te*-Ft;if(et.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(ue),$.translateZ(te),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),yt[10]===-1)$.projectionMatrix.copy(et.projectionMatrix),$.projectionMatrixInverse.copy(et.projectionMatrixInverse);else{let O=Zt+te,ve=Bt+te,ee=he-ue,C=Pe+(Nt-ue),M=Vt*Bt/ve*O,z=Yt*Bt/ve*O;$.projectionMatrix.makePerspective(ee,C,M,z,O,ve),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function st($,et){et===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(et.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let et=$.near,vt=$.far;f.texture!==null&&(f.depthNear>0&&(et=f.depthNear),f.depthFar>0&&(vt=f.depthFar)),N.near=I.near=A.near=et,N.far=I.far=A.far=vt,(L!==N.near||F!==N.far)&&(s.updateRenderState({depthNear:N.near,depthFar:N.far}),L=N.near,F=N.far),N.layers.mask=$.layers.mask|6,A.layers.mask=N.layers.mask&-5,I.layers.mask=N.layers.mask&-3;let Nt=$.parent,yt=N.cameras;st(N,Nt);for(let Ut=0;Ut<yt.length;Ut++)st(yt[Ut],Nt);yt.length===2?j(N,A,I):N.projectionMatrix.copy(A.projectionMatrix),T===null&&$.isPerspectiveCamera&&(T={camera:$,fov:$.fov,zoom:$.zoom}),at($,N,Nt)};function at($,et,vt){vt===null?$.matrix.copy(et.matrixWorld):($.matrix.copy(vt.matrixWorld),$.matrix.invert(),$.matrix.multiply(et.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(et.projectionMatrix),$.projectionMatrixInverse.copy(et.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=Ps*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(!(u===null&&m===null))return l},this.setFoveation=function($){l=$,u!==null&&(u.fixedFoveation=$),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=$)},this.hasDepthSensing=function(){return f.texture!==null},this.getDepthSensingMesh=function(){return f.getMesh(N)},this.getCameraTexture=function($){return p[$]};let $t=null;function Pt($,et){if(h=et.getViewerPose(c||o),g=et,h!==null){let vt=h.views;m!==null&&(t.setRenderTargetFramebuffer(v,m.framebuffer),t.setRenderTarget(v));let Nt=!1;vt.length!==N.cameras.length&&(N.cameras.length=0,Nt=!0);for(let Bt=0;Bt<vt.length;Bt++){let Vt=vt[Bt],Yt=null;if(m!==null)Yt=m.getViewport(Vt);else{let Qt=d.getViewSubImage(u,Vt);Yt=Qt.viewport,Bt===0&&(t.setRenderTargetTextures(v,Qt.colorTexture,Qt.depthStencilTexture),t.setRenderTarget(v))}let Ft=P[Bt];Ft===void 0&&(Ft=new De,Ft.layers.enable(Bt),Ft.viewport=new be,P[Bt]=Ft),Ft.matrix.fromArray(Vt.transform.matrix),Ft.matrix.decompose(Ft.position,Ft.quaternion,Ft.scale),Ft.projectionMatrix.fromArray(Vt.projectionMatrix),Ft.projectionMatrixInverse.copy(Ft.projectionMatrix).invert(),Ft.viewport.set(Yt.x,Yt.y,Yt.width,Yt.height),Bt===0&&(N.matrix.copy(Ft.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),Nt===!0&&N.cameras.push(Ft)}let yt=s.enabledFeatures;if(yt&&yt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){d=n.getBinding();let Bt=d.getDepthInformation(vt[0]);Bt&&Bt.isValid&&Bt.texture&&f.init(Bt,s.renderState)}if(yt&&yt.includes("camera-access")&&x){t.state.unbindTexture(),d=n.getBinding();for(let Bt=0;Bt<vt.length;Bt++){let Vt=vt[Bt].camera;if(Vt){let Yt=p[Vt];Yt||(Yt=new Tr,p[Vt]=Yt);let Ft=d.getCameraImage(Vt);Yt.sourceTexture=Ft}}}}for(let vt=0;vt<b.length;vt++){let Nt=E[vt],yt=b[vt];Nt!==null&&yt!==void 0&&yt.update(Nt,et,c||o)}$t&&$t($,et),et.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:et}),g=null}let kt=new Dd;kt.setAnimationLoop(Pt),this.setAnimationLoop=function($){$t=$},this.dispose=function(){}}},Ny=new ie,kd=new zt;kd.set(-1,0,0,0,1,0,0,0,1);function Uy(i,t){function e(f,p){f.matrixAutoUpdate===!0&&f.updateMatrix(),p.value.copy(f.matrix)}function n(f,p){p.color.getRGB(f.fogColor.value,kc(i)),p.isFog?(f.fogNear.value=p.near,f.fogFar.value=p.far):p.isFogExp2&&(f.fogDensity.value=p.density)}function s(f,p,y,S,v){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(f,p):p.isMeshLambertMaterial?(r(f,p),p.envMap&&(f.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(f,p),d(f,p)):p.isMeshPhongMaterial?(r(f,p),h(f,p),p.envMap&&(f.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(f,p),u(f,p),p.isMeshPhysicalMaterial&&m(f,p,v)):p.isMeshMatcapMaterial?(r(f,p),g(f,p)):p.isMeshDepthMaterial?r(f,p):p.isMeshDistanceMaterial?(r(f,p),x(f,p)):p.isMeshNormalMaterial?r(f,p):p.isLineBasicMaterial?(o(f,p),p.isLineDashedMaterial&&a(f,p)):p.isPointsMaterial?l(f,p,y,S):p.isSpriteMaterial?c(f,p):p.isShadowMaterial?(f.color.value.copy(p.color),f.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(f,p){f.opacity.value=p.opacity,p.color&&f.diffuse.value.copy(p.color),p.emissive&&f.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(f.map.value=p.map,e(p.map,f.mapTransform)),p.alphaMap&&(f.alphaMap.value=p.alphaMap,e(p.alphaMap,f.alphaMapTransform)),p.bumpMap&&(f.bumpMap.value=p.bumpMap,e(p.bumpMap,f.bumpMapTransform),f.bumpScale.value=p.bumpScale,p.side===Ke&&(f.bumpScale.value*=-1)),p.normalMap&&(f.normalMap.value=p.normalMap,e(p.normalMap,f.normalMapTransform),f.normalScale.value.copy(p.normalScale),p.side===Ke&&f.normalScale.value.negate()),p.displacementMap&&(f.displacementMap.value=p.displacementMap,e(p.displacementMap,f.displacementMapTransform),f.displacementScale.value=p.displacementScale,f.displacementBias.value=p.displacementBias),p.emissiveMap&&(f.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,f.emissiveMapTransform)),p.specularMap&&(f.specularMap.value=p.specularMap,e(p.specularMap,f.specularMapTransform)),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest);let y=t.get(p),S=y.envMap,v=y.envMapRotation;S&&(f.envMap.value=S,f.envMapRotation.value.setFromMatrix4(Ny.makeRotationFromEuler(v)).transpose(),S.isCubeTexture&&S.isRenderTargetTexture===!1&&f.envMapRotation.value.premultiply(kd),f.reflectivity.value=p.reflectivity,f.ior.value=p.ior,f.refractionRatio.value=p.refractionRatio),p.lightMap&&(f.lightMap.value=p.lightMap,f.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,f.lightMapTransform)),p.aoMap&&(f.aoMap.value=p.aoMap,f.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,f.aoMapTransform))}function o(f,p){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,p.map&&(f.map.value=p.map,e(p.map,f.mapTransform))}function a(f,p){f.dashSize.value=p.dashSize,f.totalSize.value=p.dashSize+p.gapSize,f.scale.value=p.scale}function l(f,p,y,S){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,f.size.value=p.size*y,f.scale.value=S*.5,p.map&&(f.map.value=p.map,e(p.map,f.uvTransform)),p.alphaMap&&(f.alphaMap.value=p.alphaMap,e(p.alphaMap,f.alphaMapTransform)),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest)}function c(f,p){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,f.rotation.value=p.rotation,p.map&&(f.map.value=p.map,e(p.map,f.mapTransform)),p.alphaMap&&(f.alphaMap.value=p.alphaMap,e(p.alphaMap,f.alphaMapTransform)),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest)}function h(f,p){f.specular.value.copy(p.specular),f.shininess.value=Math.max(p.shininess,1e-4)}function d(f,p){p.gradientMap&&(f.gradientMap.value=p.gradientMap)}function u(f,p){f.metalness.value=p.metalness,p.metalnessMap&&(f.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,f.metalnessMapTransform)),f.roughness.value=p.roughness,p.roughnessMap&&(f.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,f.roughnessMapTransform)),p.envMap&&(f.envMapIntensity.value=p.envMapIntensity)}function m(f,p,y){f.ior.value=p.ior,p.sheen>0&&(f.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),f.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(f.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,f.sheenColorMapTransform)),p.sheenRoughnessMap&&(f.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,f.sheenRoughnessMapTransform))),p.clearcoat>0&&(f.clearcoat.value=p.clearcoat,f.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(f.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,f.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(f.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,f.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(f.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,f.clearcoatNormalMapTransform),f.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ke&&f.clearcoatNormalScale.value.negate())),p.dispersion>0&&(f.dispersion.value=p.dispersion),p.retroreflectivity>0&&(f.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(f.iridescence.value=p.iridescence,f.iridescenceIOR.value=p.iridescenceIOR,f.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],f.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(f.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,f.iridescenceMapTransform)),p.iridescenceThicknessMap&&(f.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,f.iridescenceThicknessMapTransform))),p.transmission>0&&(f.transmission.value=p.transmission,f.transmissionSamplerMap.value=y.texture,f.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(f.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,f.transmissionMapTransform)),f.thickness.value=p.thickness,p.thicknessMap&&(f.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,f.thicknessMapTransform)),f.attenuationDistance.value=p.attenuationDistance,f.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(f.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(f.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,f.anisotropyMapTransform))),f.specularIntensity.value=p.specularIntensity,f.specularColor.value.copy(p.specularColor),p.specularColorMap&&(f.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,f.specularColorMapTransform)),p.specularIntensityMap&&(f.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,f.specularIntensityMapTransform))}function g(f,p){p.matcap&&(f.matcap.value=p.matcap)}function x(f,p){let y=t.get(p).light;f.referencePosition.value.setFromMatrixPosition(y.matrixWorld),f.nearDistance.value=y.shadow.camera.near,f.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Fy(i,t,e,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,b){let E=b.program;n.uniformBlockBinding(v,E)}function c(v,b){let E=s[v.id];E===void 0&&(f(v),E=h(v),s[v.id]=E,v.addEventListener("dispose",y));let R=b.program;n.updateUBOMapping(v,R);let _=t.render.frame;r[v.id]!==_&&(u(v),r[v.id]=_)}function h(v){let b=d();v.__bindingPointIndex=b;let E=i.createBuffer(),R=v.__size,_=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,E),i.bufferData(i.UNIFORM_BUFFER,R,_),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,b,E),E}function d(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return Ot("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(v){let b=s[v.id],E=v.uniforms,R=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,b);for(let _=0,T=E.length;_<T;_++){let A=E[_];if(Array.isArray(A))for(let I=0,P=A.length;I<P;I++)m(A[I],_,I,R);else m(A,_,0,R)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(v,b,E,R){if(x(v,b,E,R)===!0){let _=v.__offset,T=v.value;if(Array.isArray(T)){let A=0;for(let I=0;I<T.length;I++){let P=T[I],N=p(P);g(P,v.__data,A),typeof P!="number"&&typeof P!="boolean"&&!P.isMatrix3&&!ArrayBuffer.isView(P)&&(A+=N.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(T,v.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,_,v.__data)}}function g(v,b,E){typeof v=="number"||typeof v=="boolean"?b[0]=v:v.isMatrix3?(b[0]=v.elements[0],b[1]=v.elements[1],b[2]=v.elements[2],b[3]=0,b[4]=v.elements[3],b[5]=v.elements[4],b[6]=v.elements[5],b[7]=0,b[8]=v.elements[6],b[9]=v.elements[7],b[10]=v.elements[8],b[11]=0):ArrayBuffer.isView(v)?b.set(new v.constructor(v.buffer,v.byteOffset,b.length)):v.toArray(b,E)}function x(v,b,E,R){let _=v.value,T=b+"_"+E;if(R[T]===void 0)return typeof _=="number"||typeof _=="boolean"?R[T]=_:ArrayBuffer.isView(_)?R[T]=_.slice():R[T]=_.clone(),!0;{let A=R[T];if(typeof _=="number"||typeof _=="boolean"){if(A!==_)return R[T]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(A.equals(_)===!1)return A.copy(_),!0}}return!1}function f(v){let b=v.uniforms,E=0,R=16;for(let T=0,A=b.length;T<A;T++){let I=Array.isArray(b[T])?b[T]:[b[T]];for(let P=0,N=I.length;P<N;P++){let L=I[P],F=Array.isArray(L.value)?L.value:[L.value];for(let H=0,W=F.length;H<W;H++){let Q=F[H],q=p(Q),K=E%R,j=K%q.boundary,st=K+j;E+=j,st!==0&&R-st<q.storage&&(E+=R-st),L.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=E,E+=q.storage}}}let _=E%R;return _>0&&(E+=R-_),v.__size=E,v.__cache={},this}function p(v){let b={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(b.boundary=4,b.storage=4):v.isVector2?(b.boundary=8,b.storage=8):v.isVector3||v.isColor?(b.boundary=16,b.storage=12):v.isVector4?(b.boundary=16,b.storage=16):v.isMatrix3?(b.boundary=48,b.storage=48):v.isMatrix4?(b.boundary=64,b.storage=64):v.isTexture?Dt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(b.boundary=16,b.storage=v.byteLength):Dt("WebGLRenderer: Unsupported uniform value type.",v),b}function y(v){let b=v.target;b.removeEventListener("dispose",y);let E=o.indexOf(b.__bindingPointIndex);o.splice(E,1),i.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function S(){for(let v in s)i.deleteBuffer(s[v]);o=[],s={},r={}}return{bind:l,update:c,dispose:S}}var Oy=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),ei=null;function By(){return ei===null&&(ei=new _r(Oy,16,16,Ui,Hn),ei.name="DFG_LUT",ei.minFilter=Ze,ei.magFilter=Ze,ei.wrapS=Yn,ei.wrapT=Yn,ei.generateMipmaps=!1,ei.needsUpdate=!0),ei}var ll=class{constructor(t={}){let{canvas:e=td(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:m=dn}=t;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=o;let x=m,f=new Set([wa,Sa,ba]),p=new Set([dn,zn,Vs,Gs,va,_a]),y=new Uint32Array(4),S=new Int32Array(4),v=new U,b=null,E=null,R=[],_=[],T=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=kn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let A=this,I=!1,P=null,N=null,L=null,F=null;this._outputColorSpace=Be;let H=0,W=0,Q=null,q=-1,K=null,j=new be,st=new be,at=null,$t=new Ct(0),Pt=0,kt=e.width,$=e.height,et=1,vt=null,Nt=null,yt=new be(0,0,kt,$),Ut=new be(0,0,kt,$),Zt=!1,Bt=new Ns,Vt=!1,Yt=!1,Ft=new ie,Qt=new U,he=new be,Pe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},te=!1;function ue(){return Q===null?et:1}let O=n;function ve(w,B){return e.getContext(w,B)}let ee,C,M,z,X,Z,rt,lt,J,nt,ct,Et,ft,ht,At,It,Wt,k,ut,tt,dt,xt,it;try{let w={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"186"}`),e.addEventListener("webglcontextlost",ge,!1),e.addEventListener("webglcontextrestored",se,!1),e.addEventListener("webglcontextcreationerror",Pn,!1),O===null){let B="webgl2";if(O=ve(B,w),O===null)throw ve(B)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Rt()}catch(w){throw e.removeEventListener("webglcontextlost",ge,!1),e.removeEventListener("webglcontextrestored",se,!1),e.removeEventListener("webglcontextcreationerror",Pn,!1),Ot("WebGLRenderer: "+w.message),w}function Rt(){ee=new Xg(O),ee.init(),dt=new Iy(O,ee),C=new Ug(O,ee,t,dt),M=new Cy(O,ee),C.reversedDepthBuffer&&u&&M.buffers.depth.setReversed(!0),N=O.createFramebuffer(),L=O.createFramebuffer(),F=O.createFramebuffer(),z=new $g(O),X=new my,Z=new Py(O,ee,M,X,C,dt,z),rt=new Wg(A),lt=new Kp(O),xt=new Dg(O,lt),J=new qg(O,lt,z,xt),nt=new Kg(O,J,lt,xt,z),k=new Zg(O,C,Z),At=new Fg(X),ct=new py(A,rt,ee,C,xt,At),Et=new Uy(A,X),ft=new xy,ht=new Sy(ee),Wt=new Lg(A,rt,M,nt,g,l),It=new Ry(A,nt,C),it=new Fy(O,z,C,M),ut=new Ng(O,ee,z),tt=new Yg(O,ee,z),z.programs=ct.programs,A.capabilities=C,A.extensions=ee,A.properties=X,A.renderLists=ft,A.shadowMap=It,A.state=M,A.info=z}x!==dn&&(T=new jg(x,e.width,e.height,a,s,r));let wt=new lh(A,O);this.xr=wt,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){let w=ee.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){let w=ee.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return et},this.setPixelRatio=function(w){w!==void 0&&(et=w,this.setSize(kt,$,!1))},this.getSize=function(w){return w.set(kt,$)},this.setSize=function(w,B,Y=!0){if(wt.isPresenting){Dt("WebGLRenderer: Can't change size while VR device is presenting.");return}kt=w,$=B,e.width=Math.floor(w*et),e.height=Math.floor(B*et),Y===!0&&(e.style.width=w+"px",e.style.height=B+"px"),T!==null&&T.setSize(e.width,e.height),this.setViewport(0,0,w,B)},this.getDrawingBufferSize=function(w){return w.set(kt*et,$*et).floor()},this.setDrawingBufferSize=function(w,B,Y){kt=w,$=B,et=Y,e.width=Math.floor(w*Y),e.height=Math.floor(B*Y),this.setViewport(0,0,w,B)},this.setEffects=function(w){if(x===dn){Ot("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(w){for(let B=0;B<w.length;B++)if(w[B].isOutputPass===!0){Dt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}T.setEffects(w||[])},this.getCurrentViewport=function(w){return w.copy(j)},this.getViewport=function(w){return w.copy(yt)},this.setViewport=function(w,B,Y,V){w.isVector4?yt.set(w.x,w.y,w.z,w.w):yt.set(w,B,Y,V),M.viewport(j.copy(yt).multiplyScalar(et).round())},this.getScissor=function(w){return w.copy(Ut)},this.setScissor=function(w,B,Y,V){w.isVector4?Ut.set(w.x,w.y,w.z,w.w):Ut.set(w,B,Y,V),M.scissor(st.copy(Ut).multiplyScalar(et).round())},this.getScissorTest=function(){return Zt},this.setScissorTest=function(w){M.setScissorTest(Zt=w)},this.setOpaqueSort=function(w){vt=w},this.setTransparentSort=function(w){Nt=w},this.getClearColor=function(w){return w.copy(Wt.getClearColor())},this.setClearColor=function(){Wt.setClearColor(...arguments)},this.getClearAlpha=function(){return Wt.getClearAlpha()},this.setClearAlpha=function(){Wt.setClearAlpha(...arguments)},this.clear=function(w=!0,B=!0,Y=!0){let V=0;if(w){let G=!1;if(Q!==null){let gt=Q.texture.format;G=f.has(gt)}if(G){let gt=Q.texture.type,Mt=p.has(gt),mt=Wt.getClearColor(),bt=Wt.getClearAlpha(),Tt=mt.r,Xt=mt.g,Kt=mt.b;Mt?(y[0]=Tt,y[1]=Xt,y[2]=Kt,y[3]=bt,O.clearBufferuiv(O.COLOR,0,y)):(S[0]=Tt,S[1]=Xt,S[2]=Kt,S[3]=bt,O.clearBufferiv(O.COLOR,0,S))}else V|=O.COLOR_BUFFER_BIT}B&&(V|=O.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Y&&(V|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V!==0&&O.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(w){w.setRenderer(this),P=w},this.dispose=function(){e.removeEventListener("webglcontextlost",ge,!1),e.removeEventListener("webglcontextrestored",se,!1),e.removeEventListener("webglcontextcreationerror",Pn,!1),Wt.dispose(),ft.dispose(),ht.dispose(),X.dispose(),rt.dispose(),nt.dispose(),xt.dispose(),it.dispose(),ct.dispose(),wt.dispose(),wt.removeEventListener("sessionstart",Uh),wt.removeEventListener("sessionend",Fh),ki.stop()};function ge(w){w.preventDefault(),mr("WebGLRenderer: Context Lost."),I=!0}function se(){mr("WebGLRenderer: Context Restored."),I=!1;let w=z.autoReset,B=It.enabled,Y=It.autoUpdate,V=It.needsUpdate,G=It.type;Rt(),z.autoReset=w,It.enabled=B,It.autoUpdate=Y,It.needsUpdate=V,It.type=G}function Pn(w){Ot("WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Wn(w){let B=w.target;B.removeEventListener("dispose",Wn),Ef(B)}function Ef(w){Af(w),X.remove(w)}function Af(w){let B=X.get(w).programs;B!==void 0&&(B.forEach(function(Y){ct.releaseProgram(Y)}),w.isShaderMaterial&&ct.releaseShaderCache(w))}this.renderBufferDirect=function(w,B,Y,V,G,gt){B===null&&(B=Pe);let Mt=G.isMesh&&G.matrixWorld.determinantAffine()<0,mt=Pf(w,B,Y,V,G);M.setMaterial(V,Mt);let bt=Y.index,Tt=1;if(V.wireframe===!0){if(bt=J.getWireframeAttribute(Y),bt===void 0)return;Tt=2}let Xt=Y.drawRange,Kt=Y.attributes.position,St=Xt.start*Tt,re=(Xt.start+Xt.count)*Tt;gt!==null&&(St=Math.max(St,gt.start*Tt),re=Math.min(re,(gt.start+gt.count)*Tt)),bt!==null?(St=Math.max(St,0),re=Math.min(re,bt.count)):Kt!=null&&(St=Math.max(St,0),re=Math.min(re,Kt.count));let Ie=re-St;if(Ie<0||Ie===1/0)return;xt.setup(G,V,mt,Y,bt);let _e,me=ut;if(bt!==null&&(_e=lt.get(bt),me=tt,me.setIndex(_e)),G.isMesh)V.wireframe===!0?(M.setLineWidth(V.wireframeLinewidth*ue()),me.setMode(O.LINES)):me.setMode(O.TRIANGLES);else if(G.isLine){let je=V.linewidth;je===void 0&&(je=1),M.setLineWidth(je*ue()),G.isLineSegments?me.setMode(O.LINES):G.isLineLoop?me.setMode(O.LINE_LOOP):me.setMode(O.LINE_STRIP)}else G.isPoints?me.setMode(O.POINTS):G.isSprite&&me.setMode(O.TRIANGLES);if(G.isBatchedMesh)if(ee.get("WEBGL_multi_draw"))me.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{let je=G._multiDrawStarts,_t=G._multiDrawCounts,on=G._multiDrawCount,ne=bt?lt.get(bt).bytesPerElement:1,Sn=X.get(V).currentProgram.getUniforms();for(let Xn=0;Xn<on;Xn++)Sn.setValue(O,"_gl_DrawID",Xn),me.render(je[Xn]/ne,_t[Xn])}else if(G.isInstancedMesh)me.renderInstances(St,Ie,G.count);else if(Y.isInstancedBufferGeometry){let je=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,_t=Math.min(Y.instanceCount,je);me.renderInstances(St,Ie,_t)}else me.render(St,Ie)};function Nh(w,B,Y,V){P!==null&&w.isNodeMaterial&&P.setObject(V,w),Vt===!0&&At.setState(w,Y,!1),w.transparent===!0&&w.side===En&&w.forceSinglePass===!1?(w.side=Ke,w.needsUpdate=!0,so(w,B,V),w.side=Pi,w.needsUpdate=!0,so(w,B,V),w.side=En):so(w,B,V)}this.compile=function(w,B,Y=null){Y===null&&(Y=w),P!==null&&P.renderStart(w,B,Y),E=ht.get(Y),E.init(B),_.push(E),Y.traverseVisible(function(G){G.isLight&&G.layers.test(B.layers)&&(E.pushLight(G),G.castShadow&&E.pushShadow(G))}),w!==Y&&w.traverseVisible(function(G){G.isLight&&G.layers.test(B.layers)&&(E.pushLight(G),G.castShadow&&E.pushShadow(G))}),E.setupLights(),P!==null&&P.updateLights(E.state.lightsArray),Yt=this.localClippingEnabled,Vt=At.init(this.clippingPlanes,Yt),Vt===!0&&At.setGlobalState(this.clippingPlanes,B),P!==null&&It.render(E.state.shadowsArray,Y,B);let V=new Set;return w.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;let gt=G.material;if(gt)if(Array.isArray(gt))for(let Mt=0;Mt<gt.length;Mt++){let mt=gt[Mt];Nh(mt,Y,B,G),V.add(mt)}else Nh(gt,Y,B,G),V.add(gt)}),E=_.pop(),P!==null&&P.renderEnd(),V},this.compileAsync=function(w,B,Y=null){let V=this.compile(w,B,Y);return new Promise(G=>{function gt(){if(V.forEach(function(Mt){let bt=X.get(Mt).currentProgram;(bt===void 0||bt.isReady())&&V.delete(Mt)}),V.size===0){G(w);return}setTimeout(gt,10)}ee.get("KHR_parallel_shader_compile")!==null?gt():setTimeout(gt,10)})};let Ul=null;function Rf(w){Ul&&Ul(w)}function Uh(){ki.stop()}function Fh(){ki.start()}let ki=new Dd;ki.setAnimationLoop(Rf),typeof self<"u"&&ki.setContext(self),this.setAnimationLoop=function(w){Ul=w,wt.setAnimationLoop(w),w===null?ki.stop():ki.start()},wt.addEventListener("sessionstart",Uh),wt.addEventListener("sessionend",Fh),this.render=function(w,B){if(B!==void 0&&B.isCamera!==!0){Ot("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;P!==null&&P.renderStart(w,B);let Y=wt.enabled===!0&&wt.isPresenting===!0,V=T!==null&&(Q===null||Y)&&T.begin(A,Q);if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),wt.enabled===!0&&wt.isPresenting===!0&&(T===null||T.isCompositing()===!1)&&(wt.cameraAutoUpdate===!0&&wt.updateCamera(B),B=wt.getCamera()),w.isScene===!0&&w.onBeforeRender(A,w,B,Q),E=ht.get(w,_.length),E.init(B),E.state.textureUnits=Z.getTextureUnits(),_.push(E),Ft.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),Bt.setFromProjectionMatrix(Ft,Fn,B.reversedDepth),Yt=this.localClippingEnabled,Vt=At.init(this.clippingPlanes,Yt),b=ft.get(w,R.length),b.init(),R.push(b),wt.enabled===!0&&wt.isPresenting===!0){let Mt=A.xr.getDepthSensingMesh();Mt!==null&&Fl(Mt,B,-1/0,A.sortObjects)}Fl(w,B,0,A.sortObjects),b.finish(),P!==null&&P.updateLights(E.state.lightsArray),A.sortObjects===!0&&b.sort(vt,Nt),te=wt.enabled===!1||wt.isPresenting===!1||wt.hasDepthSensing()===!1,te&&Wt.addToRenderList(b,w),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Vt===!0&&At.beginShadows();let G=E.state.shadowsArray;if(It.render(G,w,B),Vt===!0&&At.endShadows(),(V&&T.hasRenderPass())===!1){let Mt=b.opaque,mt=b.transmissive;if(E.setupLights(),B.isArrayCamera){let bt=B.cameras;if(mt.length>0)for(let Tt=0,Xt=bt.length;Tt<Xt;Tt++){let Kt=bt[Tt];Bh(Mt,mt,w,Kt)}te&&Wt.render(w);for(let Tt=0,Xt=bt.length;Tt<Xt;Tt++){let Kt=bt[Tt];Oh(b,w,Kt,Kt.viewport)}}else mt.length>0&&Bh(Mt,mt,w,B),te&&Wt.render(w),Oh(b,w,B)}Q!==null&&W===0&&(Z.updateMultisampleRenderTarget(Q),Z.updateRenderTargetMipmap(Q)),V&&T.end(A),w.isScene===!0&&w.onAfterRender(A,w,B),xt.resetDefaultState(),q=-1,K=null,_.pop(),_.length>0?(E=_[_.length-1],Z.setTextureUnits(E.state.textureUnits),Vt===!0&&At.setGlobalState(A.clippingPlanes,E.state.camera)):E=null,R.pop(),R.length>0?b=R[R.length-1]:b=null,P!==null&&P.renderEnd()};function Fl(w,B,Y,V){if(w.visible===!1)return;if(w.layers.test(B.layers)){if(w.isGroup)Y=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(B);else if(w.isLightProbeGrid)E.pushLightProbeGrid(w);else if(w.isLight)E.pushLight(w),w.castShadow&&E.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||w.intersectsFrustum(Bt)){V&&he.setFromMatrixPosition(w.matrixWorld).applyMatrix4(Ft);let Mt=nt.update(w),mt=w.material;mt.visible&&b.push(w,Mt,mt,Y,he.z,null,B)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||w.intersectsFrustum(Bt))){let Mt=nt.update(w),mt=w.material;if(V&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),he.copy(w.boundingSphere.center)):(Mt.boundingSphere===null&&Mt.computeBoundingSphere(),he.copy(Mt.boundingSphere.center)),he.applyMatrix4(w.matrixWorld).applyMatrix4(Ft)),Array.isArray(mt)){let bt=Mt.groups;for(let Tt=0,Xt=bt.length;Tt<Xt;Tt++){let Kt=bt[Tt],St=mt[Kt.materialIndex];St&&St.visible&&b.push(w,Mt,St,Y,he.z,Kt,B)}}else mt.visible&&b.push(w,Mt,mt,Y,he.z,null,B)}}let gt=w.children;for(let Mt=0,mt=gt.length;Mt<mt;Mt++)Fl(gt[Mt],B,Y,V)}function Oh(w,B,Y,V){let{opaque:G,transmissive:gt,transparent:Mt}=w;E.setupLightsView(Y),Vt===!0&&At.setGlobalState(A.clippingPlanes,Y),V&&M.viewport(j.copy(V)),G.length>0&&io(G,B,Y),gt.length>0&&io(gt,B,Y),Mt.length>0&&io(Mt,B,Y),M.buffers.depth.setTest(!0),M.buffers.depth.setMask(!0),M.buffers.color.setMask(!0),M.setPolygonOffset(!1)}function Bh(w,B,Y,V){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[V.id]===void 0){let St=ee.has("EXT_color_buffer_half_float")||ee.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[V.id]=new un(1,1,{generateMipmaps:!0,type:St?Hn:dn,minFilter:Di,samples:Math.max(4,C.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Jt.workingColorSpace})}let gt=E.state.transmissionRenderTarget[V.id],Mt=V.viewport||j;gt.setSize(Mt.z*A.transmissionResolutionScale,Mt.w*A.transmissionResolutionScale);let mt=A.getRenderTarget(),bt=A.getActiveCubeFace(),Tt=A.getActiveMipmapLevel();A.setRenderTarget(gt),A.getClearColor($t),Pt=A.getClearAlpha(),Pt<1&&A.setClearColor(16777215,.5),A.clear(),te&&Wt.render(Y);let Xt=A.toneMapping;A.toneMapping=kn;let Kt=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),E.setupLightsView(V),Vt===!0&&At.setGlobalState(A.clippingPlanes,V),io(w,Y,V),Z.updateMultisampleRenderTarget(gt),Z.updateRenderTargetMipmap(gt),ee.has("WEBGL_multisampled_render_to_texture")===!1){let St=!1;for(let re=0,Ie=B.length;re<Ie;re++){let _e=B[re],{object:me,geometry:je,material:_t,group:on}=_e;if(_t.side===En&&me.layers.test(V.layers)){let ne=_t.side;_t.side=Ke,_t.needsUpdate=!0,kh(me,Y,V,je,_t,on),_t.side=ne,_t.needsUpdate=!0,St=!0}}St===!0&&(Z.updateMultisampleRenderTarget(gt),Z.updateRenderTargetMipmap(gt))}A.setRenderTarget(mt,bt,Tt),A.setClearColor($t,Pt),Kt!==void 0&&(V.viewport=Kt),A.toneMapping=Xt}function io(w,B,Y){let V=B.isScene===!0?B.overrideMaterial:null;for(let G=0,gt=w.length;G<gt;G++){let Mt=w[G],{object:mt,geometry:bt,group:Tt}=Mt,Xt=Mt.material;Xt.allowOverride===!0&&V!==null&&(Xt=V),mt.layers.test(Y.layers)&&kh(mt,B,Y,bt,Xt,Tt)}}function kh(w,B,Y,V,G,gt){P!==null&&G.isNodeMaterial&&P.setObject(w,G),w.onBeforeRender(A,B,Y,V,G,gt),w.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),G.onBeforeRender(A,B,Y,V,w,gt),G.transparent===!0&&G.side===En&&G.forceSinglePass===!1?(G.side=Ke,G.needsUpdate=!0,A.renderBufferDirect(Y,B,V,G,w,gt),G.side=Pi,G.needsUpdate=!0,A.renderBufferDirect(Y,B,V,G,w,gt),G.side=En):A.renderBufferDirect(Y,B,V,G,w,gt),w.onAfterRender(A,B,Y,V,G,gt)}function so(w,B,Y){B.isScene!==!0&&(B=Pe);let V=X.get(w),G=E.state.lights,gt=E.state.shadowsArray,Mt=G.state.version,mt=ct.getParameters(w,G.state,gt,B,Y,E.state.lightProbeGridArray),bt=ct.getProgramCacheKey(mt),Tt=V.programs;V.environment=w.isMeshStandardMaterial||w.isMeshLambertMaterial||w.isMeshPhongMaterial?B.environment:null,V.fog=B.fog;let Xt=w.isMeshStandardMaterial||w.isMeshLambertMaterial&&!w.envMap||w.isMeshPhongMaterial&&!w.envMap;V.envMap=rt.get(w.envMap||V.environment,Xt),V.envMapRotation=V.environment!==null&&w.envMap===null?B.environmentRotation:w.envMapRotation,Tt===void 0&&(w.addEventListener("dispose",Wn),Tt=new Map,V.programs=Tt);let Kt=Tt.get(bt);if(Kt!==void 0){if(V.currentProgram===Kt&&V.lightsStateVersion===Mt)return Hh(w,mt),Kt}else mt.uniforms=ct.getUniforms(w),P!==null&&w.isNodeMaterial&&P.build(w,Y,mt),w.onBeforeCompile(mt,A),Kt=ct.acquireProgram(mt,bt),Tt.set(bt,Kt),V.uniforms=mt.uniforms;let St=V.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(St.clippingPlanes=At.uniform),Hh(w,mt),V.needsLights=Lf(w),V.lightsStateVersion=Mt,V.needsLights&&(St.ambientLightColor.value=G.state.ambient,St.lightProbe.value=G.state.probe,St.sunLights.value=G.state.sun,St.sunLightShadows.value=G.state.sunShadow,St.directionalLights.value=G.state.directional,St.directionalLightShadows.value=G.state.directionalShadow,St.spotLights.value=G.state.spot,St.spotLightShadows.value=G.state.spotShadow,St.rectAreaLights.value=G.state.rectArea,St.ltc_1.value=G.state.rectAreaLTC1,St.ltc_2.value=G.state.rectAreaLTC2,St.pointLights.value=G.state.point,St.pointLightShadows.value=G.state.pointShadow,St.hemisphereLights.value=G.state.hemi,St.sunShadowMatrix.value=G.state.sunShadowMatrix,St.sunShadowCascade.value=G.state.sunShadowCascade,St.directionalShadowMatrix.value=G.state.directionalShadowMatrix,St.spotLightMatrix.value=G.state.spotLightMatrix,St.spotLightMap.value=G.state.spotLightMap,St.pointShadowMatrix.value=G.state.pointShadowMatrix),V.lightProbeGrid=E.state.lightProbeGridArray.length>0,V.currentProgram=Kt,V.uniformsList=null,Kt}function zh(w){if(w.uniformsList===null){let B=w.currentProgram.getUniforms();w.uniformsList=qs.seqWithValue(B.seq,w.uniforms)}return w.uniformsList}function Hh(w,B){let Y=X.get(w);Y.outputColorSpace=B.outputColorSpace,Y.batching=B.batching,Y.batchingColor=B.batchingColor,Y.instancing=B.instancing,Y.instancingColor=B.instancingColor,Y.instancingMorph=B.instancingMorph,Y.skinning=B.skinning,Y.morphTargets=B.morphTargets,Y.morphNormals=B.morphNormals,Y.morphColors=B.morphColors,Y.morphTargetsCount=B.morphTargetsCount,Y.numClippingPlanes=B.numClippingPlanes,Y.numIntersection=B.numClipIntersection,Y.vertexAlphas=B.vertexAlphas,Y.vertexTangents=B.vertexTangents,Y.toneMapping=B.toneMapping}function Cf(w,B){if(w.length===0)return null;if(w.length===1)return w[0].texture!==null?w[0]:null;v.setFromMatrixPosition(B.matrixWorld);for(let Y=0,V=w.length;Y<V;Y++){let G=w[Y];if(G.texture!==null&&G.boundingBox.containsPoint(v))return G}return null}function Pf(w,B,Y,V,G){B.isScene!==!0&&(B=Pe),Z.resetTextureUnits();let gt=B.fog,Mt=V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial?B.environment:null,mt=Q===null?A.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:Jt.workingColorSpace,bt=V.isMeshStandardMaterial||V.isMeshLambertMaterial&&!V.envMap||V.isMeshPhongMaterial&&!V.envMap,Tt=rt.get(V.envMap||Mt,bt),Xt=V.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,Kt=!!Y.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),St=!!Y.morphAttributes.position,re=!!Y.morphAttributes.normal,Ie=!!Y.morphAttributes.color,_e=kn;V.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(_e=A.toneMapping);let me=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,je=me!==void 0?me.length:0,_t=X.get(V),on=E.state.lights;if(Vt===!0&&(Yt===!0||w!==K)){let xe=w===K&&V.id===q;At.setState(V,w,xe)}let ne=!1;V.version===_t.__version?(_t.needsLights&&_t.lightsStateVersion!==on.state.version||_t.outputColorSpace!==mt||G.isBatchedMesh&&_t.batching===!1||!G.isBatchedMesh&&_t.batching===!0||G.isBatchedMesh&&_t.batchingColor===!0&&G._colorsTexture===null||G.isBatchedMesh&&_t.batchingColor===!1&&G._colorsTexture!==null||G.isInstancedMesh&&_t.instancing===!1||!G.isInstancedMesh&&_t.instancing===!0||G.isSkinnedMesh&&_t.skinning===!1||!G.isSkinnedMesh&&_t.skinning===!0||G.isInstancedMesh&&_t.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&_t.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&_t.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&_t.instancingMorph===!1&&G.morphTexture!==null||_t.envMap!==Tt||V.fog===!0&&_t.fog!==gt||_t.numClippingPlanes!==void 0&&(_t.numClippingPlanes!==At.numPlanes||_t.numIntersection!==At.numIntersection)||_t.vertexAlphas!==Xt||_t.vertexTangents!==Kt||_t.morphTargets!==St||_t.morphNormals!==re||_t.morphColors!==Ie||_t.toneMapping!==_e||_t.morphTargetsCount!==je||!!_t.lightProbeGrid!=E.state.lightProbeGridArray.length>0)&&(ne=!0):(ne=!0,_t.__version=V.version);let Sn=_t.currentProgram;ne===!0&&(Sn=so(V,B,G),P&&V.isNodeMaterial&&P.onUpdateProgram(V,Sn,_t));let Xn=!1,gi=!1,is=!1,de=Sn.getUniforms(),Re=_t.uniforms;if(M.useProgram(Sn.program)&&(Xn=!0,gi=!0,is=!0),V.id!==q&&(q=V.id,gi=!0),_t.needsLights){let xe=Cf(E.state.lightProbeGridArray,G);_t.lightProbeGrid!==xe&&(_t.lightProbeGrid=xe,gi=!0)}if(Xn||K!==w){M.buffers.depth.getReversed()&&w.reversedDepth!==!0&&(w._reversedDepth=!0,w.updateProjectionMatrix()),de.setValue(O,"projectionMatrix",w.projectionMatrix),de.setValue(O,"viewMatrix",w.matrixWorldInverse);let yi=de.map.cameraPosition;yi!==void 0&&yi.setValue(O,Qt.setFromMatrixPosition(w.matrixWorld)),C.logarithmicDepthBuffer&&de.setValue(O,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&de.setValue(O,"isOrthographic",w.isOrthographicCamera===!0),K!==w&&(K=w,gi=!0,is=!0)}if(_t.needsLights&&(on.state.sunShadowMap.length>0&&de.setValue(O,"sunShadowMap",on.state.sunShadowMap,Z),on.state.directionalShadowMap.length>0&&de.setValue(O,"directionalShadowMap",on.state.directionalShadowMap,Z),on.state.spotShadowMap.length>0&&de.setValue(O,"spotShadowMap",on.state.spotShadowMap,Z),on.state.pointShadowMap.length>0&&de.setValue(O,"pointShadowMap",on.state.pointShadowMap,Z)),G.isSkinnedMesh){de.setOptional(O,G,"bindMatrix"),de.setOptional(O,G,"bindMatrixInverse");let xe=G.skeleton;xe&&(xe.boneTexture===null&&xe.computeBoneTexture(),de.setValue(O,"boneTexture",xe.boneTexture,Z))}G.isBatchedMesh&&(de.setOptional(O,G,"batchingTexture"),de.setValue(O,"batchingTexture",G._matricesTexture,Z),de.setOptional(O,G,"batchingIdTexture"),de.setValue(O,"batchingIdTexture",G._indirectTexture,Z),de.setOptional(O,G,"batchingColorTexture"),G._colorsTexture!==null&&de.setValue(O,"batchingColorTexture",G._colorsTexture,Z));let xi=Y.morphAttributes;if((xi.position!==void 0||xi.normal!==void 0||xi.color!==void 0)&&k.update(G,Y,Sn),(gi||_t.receiveShadow!==G.receiveShadow)&&(_t.receiveShadow=G.receiveShadow,de.setValue(O,"receiveShadow",G.receiveShadow)),(V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial)&&V.envMap===null&&B.environment!==null&&(Re.envMapIntensity.value=B.environmentIntensity),Re.dfgLUT!==void 0&&(Re.dfgLUT.value=By()),gi){if(de.setValue(O,"toneMappingExposure",A.toneMappingExposure),_t.needsLights&&If(Re,is),gt&&V.fog===!0&&Et.refreshFogUniforms(Re,gt),Et.refreshMaterialUniforms(Re,V,et,$,E.state.transmissionRenderTarget[w.id]),_t.needsLights&&_t.lightProbeGrid){let xe=_t.lightProbeGrid;Re.probesSH.value=xe.texture,Re.probesMin.value.copy(xe.boundingBox.min),Re.probesMax.value.copy(xe.boundingBox.max),Re.probesResolution.value.copy(xe.resolution)}qs.upload(O,zh(_t),Re,Z)}if(V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(qs.upload(O,zh(_t),Re,Z),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&de.setValue(O,"center",G.center),de.setValue(O,"modelViewMatrix",G.modelViewMatrix),de.setValue(O,"normalMatrix",G.normalMatrix),de.setValue(O,"modelMatrix",G.matrixWorld),V.uniformsGroups!==void 0){let xe=V.uniformsGroups;for(let yi=0,ss=xe.length;yi<ss;yi++){let Gh=xe[yi];it.update(Gh,Sn),it.bind(Gh,Sn)}}return Sn}function If(w,B){w.ambientLightColor.needsUpdate=B,w.lightProbe.needsUpdate=B,w.sunLights.needsUpdate=B,w.sunLightShadows.needsUpdate=B,w.directionalLights.needsUpdate=B,w.directionalLightShadows.needsUpdate=B,w.pointLights.needsUpdate=B,w.pointLightShadows.needsUpdate=B,w.spotLights.needsUpdate=B,w.spotLightShadows.needsUpdate=B,w.rectAreaLights.needsUpdate=B,w.hemisphereLights.needsUpdate=B}function Lf(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return H},this.getActiveMipmapLevel=function(){return W},this.getRenderTarget=function(){return Q},this.setRenderTargetTextures=function(w,B,Y){let V=X.get(w);V.__autoAllocateDepthBuffer=w.resolveDepthBuffer===!1,V.__autoAllocateDepthBuffer===!1&&(V.__useRenderToTexture=!1),X.get(w.texture).__webglTexture=B,X.get(w.depthTexture).__webglTexture=V.__autoAllocateDepthBuffer?void 0:Y,V.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(w,B){let Y=X.get(w);Y.__webglFramebuffer=B,Y.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(w,B=0,Y=0){Q=w,H=B,W=Y;let V=null,G=!1,gt=!1;if(w){let mt=X.get(w);if(mt.__useDefaultFramebuffer!==void 0){M.bindFramebuffer(O.FRAMEBUFFER,mt.__webglFramebuffer),j.copy(w.viewport),st.copy(w.scissor),at=w.scissorTest,M.viewport(j),M.scissor(st),M.setScissorTest(at),q=-1;return}else if(mt.__webglFramebuffer===void 0)Z.setupRenderTarget(w);else if(mt.__hasExternalTextures)Z.rebindTextures(w,X.get(w.texture).__webglTexture,X.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){let Xt=w.depthTexture;if(mt.__boundDepthTexture!==Xt){if(Xt!==null&&X.has(Xt)&&(w.width!==Xt.image.width||w.height!==Xt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Z.setupDepthRenderbuffer(w)}}let bt=w.texture;(bt.isData3DTexture||bt.isDataArrayTexture||bt.isCompressedArrayTexture)&&(gt=!0);let Tt=X.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Tt[B])?V=Tt[B][Y]:V=Tt[B],G=!0):w.samples>0&&Z.useMultisampledRTT(w)===!1?V=X.get(w).__webglMultisampledFramebuffer:Array.isArray(Tt)?V=Tt[Y]:V=Tt,j.copy(w.viewport),st.copy(w.scissor),at=w.scissorTest}else j.copy(yt).multiplyScalar(et).floor(),st.copy(Ut).multiplyScalar(et).floor(),at=Zt;if(Y!==0&&(V=N),M.bindFramebuffer(O.FRAMEBUFFER,V)&&M.drawBuffers(w,V),M.viewport(j),M.scissor(st),M.setScissorTest(at),G){let mt=X.get(w.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+B,mt.__webglTexture,Y)}else if(gt){let mt=B;for(let bt=0;bt<w.textures.length;bt++){let Tt=X.get(w.textures[bt]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+bt,Tt.__webglTexture,Y,mt)}}else if(w!==null&&Y!==0){let mt=X.get(w.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,mt.__webglTexture,Y)}q=-1};function Vh(w){let B=X.get(w);return(B.__readFormat!==w.format||B.__readType!==w.type)&&(B.__readFormat=w.format,B.__readType=w.type,B.__formatReadable=C.textureFormatReadable(w.format),B.__typeReadable=C.textureTypeReadable(w.type)),B}this.readRenderTargetPixels=function(w,B,Y,V,G,gt,Mt,mt=0){if(!(w&&w.isWebGLRenderTarget)){Ot("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let bt=X.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&Mt!==void 0&&(bt=bt[Mt]),bt){M.bindFramebuffer(O.FRAMEBUFFER,bt);try{let Tt=w.textures[mt],Xt=Tt.format,Kt=Tt.type;w.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+mt);let St=Vh(Tt);if(St.__formatReadable===!1){Ot("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(St.__typeReadable===!1){Ot("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=w.width-V&&Y>=0&&Y<=w.height-G&&O.readPixels(B,Y,V,G,dt.convert(Xt),dt.convert(Kt),gt)}finally{let Tt=Q!==null?X.get(Q).__webglFramebuffer:null;M.bindFramebuffer(O.FRAMEBUFFER,Tt)}}},this.readRenderTargetPixelsAsync=async function(w,B,Y,V,G,gt,Mt,mt=0){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let bt=X.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&Mt!==void 0&&(bt=bt[Mt]),bt)if(B>=0&&B<=w.width-V&&Y>=0&&Y<=w.height-G){M.bindFramebuffer(O.FRAMEBUFFER,bt);let Tt=w.textures[mt],Xt=Tt.format,Kt=Tt.type;w.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+mt);let St=Vh(Tt);if(St.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(St.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let re=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,re),O.bufferData(O.PIXEL_PACK_BUFFER,gt.byteLength,O.STREAM_READ),O.readPixels(B,Y,V,G,dt.convert(Xt),dt.convert(Kt),0),O.bindBuffer(O.PIXEL_PACK_BUFFER,null);let Ie=Q!==null?X.get(Q).__webglFramebuffer:null;M.bindFramebuffer(O.FRAMEBUFFER,Ie);let _e=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await nd(O,_e,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,re),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,gt),O.bindBuffer(O.PIXEL_PACK_BUFFER,null),O.deleteBuffer(re),O.deleteSync(_e),gt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(w,B=null,Y=0){let V=Math.pow(2,-Y),G=Math.floor(w.image.width*V),gt=Math.floor(w.image.height*V),Mt=B!==null?B.x:0,mt=B!==null?B.y:0;Z.setTexture2D(w,0),O.copyTexSubImage2D(O.TEXTURE_2D,Y,0,0,Mt,mt,G,gt),M.unbindTexture()},this.copyTextureToTexture=function(w,B,Y=null,V=null,G=0,gt=0){let Mt,mt,bt,Tt,Xt,Kt,St,re,Ie,_e=w.isCompressedTexture?w.mipmaps[gt]:w.image;if(Y!==null)Mt=Y.max.x-Y.min.x,mt=Y.max.y-Y.min.y,bt=Y.isBox3?Y.max.z-Y.min.z:1,Tt=Y.min.x,Xt=Y.min.y,Kt=Y.isBox3?Y.min.z:0;else{let Re=Math.pow(2,-G);Mt=Math.floor(_e.width*Re),mt=Math.floor(_e.height*Re),w.isDataArrayTexture?bt=_e.depth:w.isData3DTexture?bt=Math.floor(_e.depth*Re):bt=1,Tt=0,Xt=0,Kt=0}V!==null?(St=V.x,re=V.y,Ie=V.z):(St=0,re=0,Ie=0);let me=dt.convert(B.format),je=dt.convert(B.type),_t;B.isData3DTexture?(Z.setTexture3D(B,0),_t=O.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(Z.setTexture2DArray(B,0),_t=O.TEXTURE_2D_ARRAY):(Z.setTexture2D(B,0),_t=O.TEXTURE_2D),M.activeTexture(O.TEXTURE0),M.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,B.flipY),M.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),M.pixelStorei(O.UNPACK_ALIGNMENT,B.unpackAlignment);let on=M.getParameter(O.UNPACK_ROW_LENGTH),ne=M.getParameter(O.UNPACK_IMAGE_HEIGHT),Sn=M.getParameter(O.UNPACK_SKIP_PIXELS),Xn=M.getParameter(O.UNPACK_SKIP_ROWS),gi=M.getParameter(O.UNPACK_SKIP_IMAGES);M.pixelStorei(O.UNPACK_ROW_LENGTH,_e.width),M.pixelStorei(O.UNPACK_IMAGE_HEIGHT,_e.height),M.pixelStorei(O.UNPACK_SKIP_PIXELS,Tt),M.pixelStorei(O.UNPACK_SKIP_ROWS,Xt),M.pixelStorei(O.UNPACK_SKIP_IMAGES,Kt);let is=w.isDataArrayTexture||w.isData3DTexture,de=B.isDataArrayTexture||B.isData3DTexture;if(w.isDepthTexture){let Re=X.get(w),xi=X.get(B),xe=X.get(Re.__renderTarget),yi=X.get(xi.__renderTarget);M.bindFramebuffer(O.READ_FRAMEBUFFER,xe.__webglFramebuffer),M.bindFramebuffer(O.DRAW_FRAMEBUFFER,yi.__webglFramebuffer);for(let ss=0;ss<bt;ss++)is&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,X.get(w).__webglTexture,G,Kt+ss),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,X.get(B).__webglTexture,gt,Ie+ss)),O.blitFramebuffer(Tt,Xt,Mt,mt,St,re,Mt,mt,O.DEPTH_BUFFER_BIT,O.NEAREST);M.bindFramebuffer(O.READ_FRAMEBUFFER,null),M.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(G!==0||w.isRenderTargetTexture||X.has(w)){let Re=X.get(w),xi=X.get(B);M.bindFramebuffer(O.READ_FRAMEBUFFER,L),M.bindFramebuffer(O.DRAW_FRAMEBUFFER,F);for(let xe=0;xe<bt;xe++)is?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Re.__webglTexture,G,Kt+xe):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Re.__webglTexture,G),de?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,xi.__webglTexture,gt,Ie+xe):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,xi.__webglTexture,gt),G!==0?O.blitFramebuffer(Tt,Xt,Mt,mt,St,re,Mt,mt,O.COLOR_BUFFER_BIT,O.NEAREST):de?O.copyTexSubImage3D(_t,gt,St,re,Ie+xe,Tt,Xt,Mt,mt):O.copyTexSubImage2D(_t,gt,St,re,Tt,Xt,Mt,mt);M.bindFramebuffer(O.READ_FRAMEBUFFER,null),M.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else de?w.isDataTexture||w.isData3DTexture?O.texSubImage3D(_t,gt,St,re,Ie,Mt,mt,bt,me,je,_e.data):B.isCompressedArrayTexture?O.compressedTexSubImage3D(_t,gt,St,re,Ie,Mt,mt,bt,me,_e.data):O.texSubImage3D(_t,gt,St,re,Ie,Mt,mt,bt,me,je,_e):w.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,gt,St,re,Mt,mt,me,je,_e.data):w.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,gt,St,re,_e.width,_e.height,me,_e.data):O.texSubImage2D(O.TEXTURE_2D,gt,St,re,Mt,mt,me,je,_e);M.pixelStorei(O.UNPACK_ROW_LENGTH,on),M.pixelStorei(O.UNPACK_IMAGE_HEIGHT,ne),M.pixelStorei(O.UNPACK_SKIP_PIXELS,Sn),M.pixelStorei(O.UNPACK_SKIP_ROWS,Xn),M.pixelStorei(O.UNPACK_SKIP_IMAGES,gi),gt===0&&B.generateMipmaps&&O.generateMipmap(_t),M.unbindTexture()},this.initRenderTarget=function(w){X.get(w).__webglFramebuffer===void 0&&Z.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?Z.setTextureCube(w,0):w.isData3DTexture?Z.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?Z.setTexture2DArray(w,0):Z.setTexture2D(w,0),M.unbindTexture()},this.resetState=function(){H=0,W=0,Q=null,M.reset(),xt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Fn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=Jt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Jt._getUnpackColorSpace()}};Kr();Ks();var Js=1e4;var uh={tr:{tagline:"Bursa \xB7 Nil\xFCfer sokaklar\u0131nda taktiksel \xE7at\u0131\u015Fma",play:"Oyun Kur",find:"Oyun Bul",joinCode:"Kod ile Kat\u0131l",settings:"Ayarlar",howto:"Nas\u0131l Oynan\u0131r?",quit:"\xC7\u0131k\u0131\u015F",playerName:"Oyuncu ad\u0131",edit:"De\u011Fi\u015Ftir",save:"Kaydet",cancel:"Vazge\xE7",back:"Geri",close:"Kapat",ok:"Tamam",yes:"Evet",no:"Hay\u0131r",connecting:"Sunucuya ba\u011Flan\u0131l\u0131yor\u2026",connected:"\xC7evrimi\xE7i",offline:"Sunucuya ba\u011Flan\u0131lamad\u0131",retry:"Tekrar dene",serverAddr:"Sunucu adresi",createTitle:"Oyun Kur",roomName:"Oda ad\u0131",mode:"Oyun modu",map:"Harita (konum)",pickOnMap:"Haritadan se\xE7",mapSize:"Harita b\xFCy\xFCkl\xFC\u011F\xFC",small:"K\xFC\xE7\xFCk",medium:"Orta",large:"B\xFCy\xFCk",maxPlayers:"Maksimum oyuncu",password:"Kat\u0131l\u0131m \u015Fifresi (iste\u011Fe ba\u011Fl\u0131)",publicRoom:"Herkese a\xE7\u0131k (listede g\xF6r\xFCns\xFCn)",rounds:"Raunt say\u0131s\u0131",roundTime:"Raunt s\xFCresi (sn)",freezeTime:"Haz\u0131rl\u0131k s\xFCresi (sn)",buyTime:"Sat\u0131n alma s\xFCresi (sn)",bombTime:"Bomba s\xFCresi (sn)",startMoney:"Ba\u015Flang\u0131\xE7 paras\u0131",timeLimit:"S\xFCre s\u0131n\u0131r\u0131 (dk)",killLimit:"\xD6ld\xFCrme s\u0131n\u0131r\u0131",friendlyFire:"Dost ate\u015Fi",autoBalance:"Tak\u0131mlar\u0131 otomatik dengele",bots:"Bot say\u0131s\u0131",botLevel:"Bot zorlu\u011Fu",easy:"Kolay",normal:"Normal",hard:"Zor",timeOfDay:"Saat",day:"G\xFCnd\xFCz",evening:"Ak\u015Fam",night:"Gece",weather:"Hava",clear:"A\xE7\u0131k",cloudy:"Bulutlu",fog:"Sisli",create:"Oday\u0131 Kur",advanced:"Geli\u015Fmi\u015F ayarlar",findTitle:"A\xE7\u0131k Oyunlar",refresh:"Yenile",noRooms:"\u015Eu an a\xE7\u0131k oda yok. Hemen bir oyun kur!",join:"Kat\u0131l",players:"oyuncu",locked:"\u015Eifreli",inGame:"Oyunda",inLobby:"Lobide",codeTitle:"Kod ile Kat\u0131l",roomCode:"Oda kodu",enterPassword:"\u015Eifre",joinNow:"Kat\u0131l",lobby:"Lobi",code:"Kod",invite:"Davet Et",start:"Oyunu Ba\u015Flat",leave:"Odadan \xC7\u0131k",host:"Kurucu",bot:"BOT",changeTeam:"Tak\u0131m de\u011Fi\u015Ftir",spectate:"\u0130zle",addBot:"+ Bot",removeBot:"\u2212 Bot",kick:"At",waitingHost:"Kurucunun oyunu ba\u015Flatmas\u0131 bekleniyor\u2026",editSettings:"Ayarlar\u0131 d\xFCzenle",chat:"Sohbet",send:"G\xF6nder",autoTeam:"Otomatik",inviteTitle:"Arkada\u015Flar\u0131n\u0131 Davet Et",inviteInfo:"Davet linkini g\xF6nder. Arkada\u015F\u0131n\u0131n telefonunda/bilgisayar\u0131nda Faerod kuruluysa link oyunu a\xE7\u0131p do\u011Frudan bu odaya katar.",whatsapp:"WhatsApp ile g\xF6nder",email:"E-posta ile g\xF6nder",copy:"Linki kopyala",share:"Payla\u015F\u2026",copied:"Kopyaland\u0131!",includePw:"\u015Eifreyi davete ekle",inviteText:`FAEROD'da benimle oyna! \u{1F3AF}
Oda: {room} \xB7 Harita: {map}
Kat\u0131lmak i\xE7in dokun: {link}
Oda kodu: {code}{pw}`,inviteSubject:"FAEROD oyun daveti",loading:"Harita y\xFCkleniyor\u2026",buildingCity:"\u015Eehir in\u015Fa ediliyor",waitingPlayers:"Oyuncular bekleniyor\u2026",health:"Can",armor:"Z\u0131rh",money:"Para",buy:"Sat\u0131n Al",buyMenu:"Sat\u0131n Alma Men\xFCs\xFC",loadout:"Silah Se\xE7imi",loadoutHint:"Se\xE7imin bir sonraki do\u011Fu\u015Fta ge\xE7erli olur.",scoreboard:"Skor Tablosu",kills:"\xD6",deaths:"\xD6",assists:"A",score:"Skor",ping:"Ping",mvp:"MVP",alive:"Hayatta",dead:"\xD6l\xFC",buyZone:"Sat\u0131n alma b\xF6lgesindesin",freeze:"Haz\u0131rlan!",live:"Raunt ba\u015Flad\u0131!",bombPlanted:"Bomba kuruldu!",bombDefused:"Bomba imha edildi!",bombExploded:"Bomba patlad\u0131!",plant:"Bombay\u0131 kur",defuse:"Bombay\u0131 imha et",planting:"Bomba kuruluyor\u2026",defusing:"Bomba imha ediliyor\u2026",holdUse:"Bas\u0131l\u0131 tut",tWin:"Sald\u0131r\u0131 Timi kazand\u0131!",ctWin:"Savunma Timi kazand\u0131!",draw:"Berabere!",halftime:"Devre aras\u0131 \u2014 tak\u0131mlar yer de\u011Fi\u015Ftiriyor",matchOver:"Ma\xE7 bitti",winner:"Kazanan",reasonElim:"Rakip tak\u0131m yok edildi",reasonBomb:"Bomba hedefi yok etti",reasonDefuse:"Bomba imha edildi",reasonTime:"S\xFCre doldu",youKilled:"{name} \xF6ld\xFCr\xFCld\xFC",killedBy:"{name} seni {weapon} ile \xF6ld\xFCrd\xFC",headshot:"kafadan",respawnIn:"{s} sn i\xE7inde yeniden do\u011Facaks\u0131n",spectating:"\u0130zleniyor: {name}",returnLobby:"Lobiye d\xF6n",backToMenu:"Ana men\xFC",resume:"Devam",options:"Se\xE7enekler",teamSelect:"Tak\u0131m Se\xE7",errNoRoom:"Oda bulunamad\u0131 veya kapanm\u0131\u015F.",errFull:"Oda dolu.",errPassword:"\u015Eifre yanl\u0131\u015F.",errBanned:"Bu odaya kat\u0131lman engellendi.",errVersion:"Oyun s\xFCr\xFCm\xFCn eski. L\xFCtfen g\xFCncelle.",errBuyTime:"Sat\u0131n alma s\xFCresi doldu.",errBuyZone:"Sat\u0131n alma b\xF6lgesinde de\u011Filsin.",errMoney:"Yeterli paran yok.",kicked:"Odadan at\u0131ld\u0131n.",sysJoined:"{name} oyuna kat\u0131ld\u0131",sysLeft:"{name} oyundan ayr\u0131ld\u0131",sysNewHost:"Yeni kurucu: {name}",sysHalftime:"Devre aras\u0131!",sysBombDropped:"Bomba yere d\xFC\u015Ft\xFC!",sysBombPicked:"{name} bombay\u0131 ald\u0131",language:"Dil",sensitivity:"Fare hassasiyeti",touchSens:"Dokunmatik hassasiyet",fov:"G\xF6r\xFC\u015F a\xE7\u0131s\u0131 (FOV)",graphics:"Grafik kalitesi",low:"D\xFC\u015F\xFCk",high:"Y\xFCksek",ultra:"Ultra",volume:"Ses seviyesi",crosshairColor:"Ni\u015Fangah rengi",showFps:"FPS g\xF6ster",voice:"Sesli anonslar",invertY:"Dikey bak\u0131\u015F\u0131 ters \xE7evir",mapPickTitle:"Konum Se\xE7 (10 km yar\u0131\xE7ap)",mapPickHint:"Haritada bir noktaya dokun. Kare, \xE7at\u0131\u015Fma alan\u0131n\u0131 g\xF6sterir. Bina yo\u011Fun yerler daha iyi oynan\u0131r.",choose:"Bu konumu se\xE7",presets:"Haz\u0131r konumlar",tutorial:"\u0130ki tak\u0131m: Sald\u0131r\u0131 Timi bombay\u0131 A veya B b\xF6lgesine kurmaya \xE7al\u0131\u015F\u0131r, Savunma Timi engeller veya imha eder. Raunt ba\u015F\u0131nda para ile silah al\u0131n. Tak\u0131m\u0131 yok eden ya da g\xF6revi tamamlayan kazan\u0131r.",ctrlDesktop:"WASD y\xFCr\xFC \xB7 Fare bak \xB7 Sol t\u0131k ate\u015F \xB7 Sa\u011F t\u0131k d\xFCrb\xFCn \xB7 R \u015Farj\xF6r \xB7 Bo\u015Fluk z\u0131pla \xB7 Ctrl e\u011Fil \xB7 Shift sessiz y\xFCr\xFC \xB7 E kur/imha \xB7 B sat\u0131n al \xB7 1-5 silah \xB7 G at \xB7 Tab skor \xB7 Y sohbet \xB7 M tak\u0131m",ctrlMobile:"Sol joystick y\xFCr\xFC \xB7 Sa\u011F taraf bak \xB7 ATE\u015E butonu \xB7 D\xFCrb\xFCn, \u015Farj\xF6r, z\u0131pla, e\u011Fil butonlar\u0131 \xB7 Silaha dokunarak de\u011Fi\u015Ftir",you:"Sen",round:"Raunt",team:"Tak\u0131m",on:"A\xE7\u0131k",off:"Kapal\u0131",minutes:"dk",seconds:"sn",install:"Uygulamay\u0131 y\xFCkle",near:"yak\u0131n\u0131",unnamed:"Ads\u0131z konum",fps:"FPS"},en:{tagline:"Tactical combat in the streets of Nil\xFCfer, Bursa",play:"Host Game",find:"Find Game",joinCode:"Join with Code",settings:"Settings",howto:"How to Play",quit:"Quit",playerName:"Player name",edit:"Change",save:"Save",cancel:"Cancel",back:"Back",close:"Close",ok:"OK",yes:"Yes",no:"No",connecting:"Connecting to server\u2026",connected:"Online",offline:"Cannot reach the server",retry:"Retry",serverAddr:"Server address",createTitle:"Host Game",roomName:"Room name",mode:"Game mode",map:"Map (location)",pickOnMap:"Pick on map",mapSize:"Map size",small:"Small",medium:"Medium",large:"Large",maxPlayers:"Max players",password:"Join password (optional)",publicRoom:"Public (show in list)",rounds:"Rounds",roundTime:"Round time (s)",freezeTime:"Freeze time (s)",buyTime:"Buy time (s)",bombTime:"Bomb timer (s)",startMoney:"Start money",timeLimit:"Time limit (min)",killLimit:"Kill limit",friendlyFire:"Friendly fire",autoBalance:"Auto-balance teams",bots:"Bots",botLevel:"Bot difficulty",easy:"Easy",normal:"Normal",hard:"Hard",timeOfDay:"Time of day",day:"Day",evening:"Evening",night:"Night",weather:"Weather",clear:"Clear",cloudy:"Cloudy",fog:"Foggy",create:"Create Room",advanced:"Advanced settings",findTitle:"Open Games",refresh:"Refresh",noRooms:"No open rooms right now. Host one!",join:"Join",players:"players",locked:"Locked",inGame:"In game",inLobby:"In lobby",codeTitle:"Join with Code",roomCode:"Room code",enterPassword:"Password",joinNow:"Join",lobby:"Lobby",code:"Code",invite:"Invite",start:"Start Game",leave:"Leave Room",host:"Host",bot:"BOT",changeTeam:"Change team",spectate:"Spectate",addBot:"+ Bot",removeBot:"\u2212 Bot",kick:"Kick",waitingHost:"Waiting for the host to start\u2026",editSettings:"Edit settings",chat:"Chat",send:"Send",autoTeam:"Auto",inviteTitle:"Invite Friends",inviteInfo:"Send the invite link. If Faerod is installed on your friend's device the link opens the game and joins this room.",whatsapp:"Send via WhatsApp",email:"Send via e-mail",copy:"Copy link",share:"Share\u2026",copied:"Copied!",includePw:"Include password",inviteText:`Play FAEROD with me! \u{1F3AF}
Room: {room} \xB7 Map: {map}
Tap to join: {link}
Room code: {code}{pw}`,inviteSubject:"FAEROD game invite",loading:"Loading map\u2026",buildingCity:"Building the city",waitingPlayers:"Waiting for players\u2026",health:"Health",armor:"Armor",money:"Money",buy:"Buy",buyMenu:"Buy Menu",loadout:"Loadout",loadoutHint:"Your choice applies on next respawn.",scoreboard:"Scoreboard",kills:"K",deaths:"D",assists:"A",score:"Score",ping:"Ping",mvp:"MVP",alive:"Alive",dead:"Dead",buyZone:"You are in the buy zone",freeze:"Get ready!",live:"Round started!",bombPlanted:"Bomb has been planted!",bombDefused:"Bomb has been defused!",bombExploded:"The bomb exploded!",plant:"Plant the bomb",defuse:"Defuse the bomb",planting:"Planting\u2026",defusing:"Defusing\u2026",holdUse:"Hold",tWin:"Attackers win!",ctWin:"Defenders win!",draw:"Draw!",halftime:"Half time \u2014 teams swap sides",matchOver:"Match over",winner:"Winner",reasonElim:"Enemy team eliminated",reasonBomb:"Target destroyed",reasonDefuse:"Bomb defused",reasonTime:"Time ran out",youKilled:"You killed {name}",killedBy:"{name} killed you with {weapon}",headshot:"headshot",respawnIn:"Respawning in {s}s",spectating:"Spectating: {name}",returnLobby:"Back to lobby",backToMenu:"Main menu",resume:"Resume",options:"Options",teamSelect:"Choose Team",errNoRoom:"Room not found or closed.",errFull:"Room is full.",errPassword:"Wrong password.",errBanned:"You are banned from this room.",errVersion:"Your game is out of date. Please update.",errBuyTime:"Buy time is over.",errBuyZone:"You are not in the buy zone.",errMoney:"Not enough money.",kicked:"You were kicked from the room.",sysJoined:"{name} joined",sysLeft:"{name} left",sysNewHost:"New host: {name}",sysHalftime:"Half time!",sysBombDropped:"The bomb was dropped!",sysBombPicked:"{name} picked up the bomb",language:"Language",sensitivity:"Mouse sensitivity",touchSens:"Touch sensitivity",fov:"Field of view",graphics:"Graphics quality",low:"Low",high:"High",ultra:"Ultra",volume:"Volume",crosshairColor:"Crosshair colour",showFps:"Show FPS",voice:"Voice announcements",invertY:"Invert vertical look",mapPickTitle:"Pick a Location (10 km radius)",mapPickHint:"Tap a point on the map. The square shows the battle area. Dense neighbourhoods play best.",choose:"Use this location",presets:"Preset locations",tutorial:"Two teams: Attackers try to plant the bomb at site A or B, Defenders stop them or defuse it. Buy weapons at the start of each round. Eliminate the enemy or complete the objective to win.",ctrlDesktop:"WASD move \xB7 Mouse look \xB7 LMB fire \xB7 RMB scope \xB7 R reload \xB7 Space jump \xB7 Ctrl crouch \xB7 Shift walk \xB7 E plant/defuse \xB7 B buy \xB7 1-5 weapons \xB7 G drop \xB7 Tab score \xB7 Y chat \xB7 M team",ctrlMobile:"Left joystick move \xB7 Right side look \xB7 FIRE button \xB7 Scope, reload, jump, crouch buttons \xB7 Tap a weapon to switch",you:"You",round:"Round",team:"Team",on:"On",off:"Off",minutes:"min",seconds:"s",install:"Install app",near:"near",unnamed:"Unnamed location",fps:"FPS"}},Jr="tr";function dh(i){Jr=uh[i]?i:"tr",document.documentElement.lang=Jr}function Cn(){return Jr}function ot(i,t){let e=uh[Jr][i]??uh.tr[i]??i;if(t)for(let[n,s]of Object.entries(t))e=e.split("{"+n+"}").join(s);return e}function Te(i){return i?i[Jr]||i.tr:""}function fh(i=document){for(let t of i.querySelectorAll("[data-i18n]"))t.textContent=ot(t.dataset.i18n);for(let t of i.querySelectorAll("[data-i18n-ph]"))t.placeholder=ot(t.dataset.i18nPh)}var Hy="https://faerod.onrender.com",ph="faerod-settings-v1",Vy={name:"",lang:"tr",key:"",sensitivity:1,touchSens:1,fov:80,quality:"auto",volume:.8,crosshair:"#33ff66",showFps:!1,voice:!0,invertY:!1,server:"",lastRoom:null,lastSettings:null};function Wd(){let i={...Vy};try{let t=localStorage.getItem(ph);t&&(i={...i,...JSON.parse(t)})}catch{}return i.key||(i.key="p"+Math.random().toString(36).slice(2,12)+Date.now().toString(36)),i.name||(i.name="Oyuncu"+Math.floor(100+Math.random()*900)),!localStorage.getItem(ph)&&navigator.language&&!/^tr/i.test(navigator.language)&&(i.lang="tr"),i}function es(i){try{localStorage.setItem(ph,JSON.stringify(i))}catch{}}function dl(i){let t=location.protocol.startsWith("http")&&location.host&&location.host!=="appassets.androidplatform.net",e=(i.server||(t?location.origin:Hy)||"").trim();e||(e="http://localhost:8090"),/^[a-z]+:\/\//i.test(e)||(e=(e.includes("localhost")||/^\d+\.\d+\.\d+\.\d+/.test(e)?"http://":"https://")+e);let n=new URL(e),s=(n.protocol==="https:"||n.protocol==="wss:"?"wss://":"ws://")+n.host+"/ws",r=(n.protocol==="https:"||n.protocol==="wss:"?"https://":"http://")+n.host;return{ws:s,http:r}}function mh(i){i==="auto"&&(i=/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent)||navigator.maxTouchPoints>1?"medium":"high");let t={low:{name:"low",pixel:.75,shadows:!1,shadowSize:0,balconies:!1,farRadius:250,groundStep:4,decals:60,smokeParts:14,antialias:!1},medium:{name:"medium",pixel:1,shadows:!0,shadowSize:1024,balconies:!0,farRadius:500,groundStep:3,decals:120,smokeParts:22,antialias:!1},high:{name:"high",pixel:1.25,shadows:!0,shadowSize:2048,balconies:!0,farRadius:900,groundStep:2,decals:200,smokeParts:30,antialias:!0},ultra:{name:"ultra",pixel:2,shadows:!0,shadowSize:4096,balconies:!0,farRadius:1400,groundStep:2,decals:300,smokeParts:36,antialias:!0}};return t[i]||t.medium}var fl=class{constructor(){this.ws=null,this.url="",this.handlers=new Map,this.open=!1,this.rtt=80,this.offset=0,this.offsetSamples=[],this.retry=0,this.wantOpen=!1,setInterval(()=>this.ping(),2e3)}on(t,e){return this.handlers.has(t)||this.handlers.set(t,new Set),this.handlers.get(t).add(e),()=>this.handlers.get(t).delete(e)}emit(t,e){let n=this.handlers.get(t);if(n)for(let s of[...n])s(e)}connect(t){if(this.url=t,this.wantOpen=!0,this.ws)try{this.ws.onclose=null,this.ws.close()}catch{}return new Promise(e=>{let n=!1,s=a=>{n||(n=!0,e(a))},r;try{r=new WebSocket(t)}catch{this.emit("status","offline"),s(!1);return}this.ws=r,this.emit("status","connecting");let o=setTimeout(()=>{if(!this.open){try{r.close()}catch{}s(!1)}},8e3);r.onopen=()=>{clearTimeout(o),this.open=!0,this.retry=0,this.emit("status","online"),this.emit("open"),this.ping(),s(!0)},r.onmessage=a=>{let l;try{l=JSON.parse(a.data)}catch{return}l.t==="pong"&&this.onPong(l),this.emit(l.t,l)},r.onclose=()=>{clearTimeout(o);let a=this.open;this.open=!1,this.emit("status","offline"),a&&this.emit("close"),s(!1),this.wantOpen&&(this.retry=Math.min(this.retry+1,6),setTimeout(()=>{this.wantOpen&&!this.open&&this.connect(this.url)},1e3*this.retry))},r.onerror=()=>{}})}send(t){this.open&&this.ws.readyState===1&&this.ws.send(JSON.stringify(t))}ping(){this.open&&this.send({t:"ping",c:performance.now(),rtt:Math.round(this.rtt)})}onPong(t){let e=performance.now(),n=e-t.c;this.rtt=this.rtt*.7+n*.3;let s=t.s+n/2-e;this.offsetSamples.push({off:s,rtt:n}),this.offsetSamples.length>8&&this.offsetSamples.shift();let r=[...this.offsetSamples].sort((o,a)=>o.rtt-a.rtt)[0];this.offset=r.off}serverNow(){return performance.now()+this.offset}};var Xd={pistol:{lp:5200,dur:.22,boom:140,gain:.8},deagle:{lp:3800,dur:.35,boom:90,gain:1.1},smg:{lp:6e3,dur:.16,boom:160,gain:.7},p90:{lp:6500,dur:.15,boom:170,gain:.7},shotgun:{lp:3e3,dur:.45,boom:70,gain:1.3},ak:{lp:4200,dur:.3,boom:95,gain:1.05},rifle_t:{lp:4600,dur:.27,boom:105,gain:.95},m4:{lp:2600,dur:.18,boom:120,gain:.55},rifle_ct:{lp:4800,dur:.26,boom:110,gain:.95},awp:{lp:2400,dur:.8,boom:55,gain:1.5},scout:{lp:3600,dur:.55,boom:75,gain:1.15}},pl=class{constructor(){this.ctx=null,this.volume=.8,this.listener={x:0,y:0,z:0,yaw:0}}unlock(){if(this.ctx){this.ctx.state==="suspended"&&this.ctx.resume();return}let t=window.AudioContext||window.webkitAudioContext;if(!t)return;this.ctx=new t,this.master=this.ctx.createGain(),this.master.gain.value=this.volume,this.verb=this.ctx.createConvolver(),this.verb.buffer=this.impulse(1.4,3),this.verbGain=this.ctx.createGain(),this.verbGain.gain.value=.22,this.verb.connect(this.verbGain).connect(this.master),this.comp=this.ctx.createDynamicsCompressor(),this.master.connect(this.comp).connect(this.ctx.destination);let e=this.ctx.sampleRate*2;this.noise=this.ctx.createBuffer(1,e,this.ctx.sampleRate);let n=this.noise.getChannelData(0);for(let s=0;s<e;s++)n[s]=Math.random()*2-1}setVolume(t){this.volume=t,this.master&&(this.master.gain.value=t)}impulse(t,e){let n=this.ctx.sampleRate,s=n*t,r=this.ctx.createBuffer(2,s,n);for(let o=0;o<2;o++){let a=r.getChannelData(o);for(let l=0;l<s;l++)a[l]=(Math.random()*2-1)*Math.pow(1-l/s,e)}return r}setListener(t,e,n,s){this.listener={x:t,y:e,z:n,yaw:s}}spatial(t,e=120,n=!0){if(!this.ctx)return null;let s=this.listener,r=1,o=0,a=2e4;if(t){let d=t.x-s.x,u=t.z-s.z,m=t.y-s.y,g=Math.hypot(d,m,u);if(g>e)return null;r=1/(1+g/7)*Math.max(0,1-g/e);let x=Math.atan2(d,u)-Math.atan2(-Math.sin(s.yaw),-Math.cos(s.yaw));o=Math.max(-.9,Math.min(.9,-Math.sin(x))),a=18e3/(1+g/25)}let l=this.ctx.createGain();l.gain.value=r;let c=this.ctx.createBiquadFilter();c.type="lowpass",c.frequency.value=a;let h=this.ctx.createStereoPanner?this.ctx.createStereoPanner():null;return h?(h.pan.value=o,l.connect(c).connect(h).connect(this.master),n&&h.connect(this.verb)):l.connect(c).connect(this.master),l}noiseBurst(t,e,n,{lp:s=8e3,hp:r=40,gain:o=1,attack:a=.002}={}){let l=this.ctx.createBufferSource();l.buffer=this.noise,l.playbackRate.value=.8+Math.random()*.4;let c=this.ctx.createBiquadFilter();c.type="lowpass",c.frequency.setValueAtTime(s,e),c.frequency.exponentialRampToValueAtTime(Math.max(200,s*.15),e+n);let h=this.ctx.createBiquadFilter();h.type="highpass",h.frequency.value=r;let d=this.ctx.createGain();d.gain.setValueAtTime(0,e),d.gain.linearRampToValueAtTime(o,e+a),d.gain.exponentialRampToValueAtTime(.001,e+n),l.connect(c).connect(h).connect(d).connect(t),l.start(e,Math.random()),l.stop(e+n+.05)}tone(t,e,n,s,{type:r="sine",gain:o=.5,slide:a=0}={}){let l=this.ctx.createOscillator();l.type=r,l.frequency.setValueAtTime(n,e),a&&l.frequency.exponentialRampToValueAtTime(Math.max(20,n*a),e+s);let c=this.ctx.createGain();c.gain.setValueAtTime(o,e),c.gain.exponentialRampToValueAtTime(.001,e+s),l.connect(c).connect(t),l.start(e),l.stop(e+s+.02)}shot(t,e,n){let s=this.spatial(e,n?35:260);if(!s)return;let r=this.ctx.currentTime,o=Xd[t]||Xd.pistol;if(n){this.noiseBurst(s,r,.09,{lp:2400,hp:600,gain:.35}),this.tone(s,r,180,.05,{gain:.15,slide:.5});return}this.noiseBurst(s,r,o.dur,{lp:o.lp,hp:80,gain:o.gain}),this.noiseBurst(s,r,.035,{lp:12e3,hp:2e3,gain:o.gain*.6}),this.tone(s,r,o.boom,o.dur*.7,{type:"triangle",gain:o.gain*.9,slide:.35})}knife(t){let e=this.spatial(t,20);e&&this.noiseBurst(e,this.ctx.currentTime,.18,{lp:3e3,hp:900,gain:.25,attack:.04})}footstep(t,e=1){let n=this.spatial(t,30,!1);if(!n)return;let s=this.ctx.currentTime;this.noiseBurst(n,s,.07,{lp:900+Math.random()*500,hp:120,gain:.32*e}),this.tone(n,s,70+Math.random()*20,.05,{gain:.2*e})}land(t){let e=this.spatial(t,30,!1);e&&this.noiseBurst(e,this.ctx.currentTime,.12,{lp:700,gain:.5})}reload(t){let e=this.spatial(t,25,!1);if(!e)return;let n=this.ctx.currentTime;this.noiseBurst(e,n+.05,.03,{lp:6e3,hp:2e3,gain:.35}),this.noiseBurst(e,n+.5,.04,{lp:5e3,hp:1500,gain:.45}),this.noiseBurst(e,n+.9,.03,{lp:7e3,hp:2500,gain:.4})}dry(){this.ctx&&this.noiseBurst(this.master,this.ctx.currentTime,.02,{lp:8e3,hp:3e3,gain:.3})}hit(t){if(!this.ctx)return;let e=this.ctx.currentTime;t?(this.tone(this.master,e,1900,.25,{type:"sine",gain:.25}),this.tone(this.master,e,2850,.18,{gain:.12})):this.noiseBurst(this.master,e,.06,{lp:1800,hp:300,gain:.35})}hurt(){this.ctx&&this.noiseBurst(this.master,this.ctx.currentTime,.12,{lp:900,gain:.5})}beep(t,e){let n=this.spatial(t,60,!1);n&&this.tone(n,this.ctx.currentTime,e?1650:1300,.09,{type:"square",gain:.18})}keypad(){if(!this.ctx)return;let t=this.ctx.currentTime;for(let e=0;e<3;e++)this.tone(this.master,t+e*.12,900+Math.random()*600,.06,{type:"square",gain:.08})}explosion(t,e=!1){let n=this.spatial(t,e?600:300);if(!n)return;let s=this.ctx.currentTime;this.noiseBurst(n,s,e?2.5:1.4,{lp:2500,hp:30,gain:e?2.2:1.6,attack:.005}),this.tone(n,s,e?45:60,e?1.8:1,{type:"sine",gain:e?1.6:1.1,slide:.4})}flashbang(t){let e=this.spatial(t,120);if(!e)return;let n=this.ctx.currentTime;this.noiseBurst(e,n,.5,{lp:9e3,hp:400,gain:1.4})}smokePop(t){let e=this.spatial(t,60);e&&this.noiseBurst(e,this.ctx.currentTime,2.5,{lp:1600,hp:200,gain:.5,attack:.2})}bounce(t){let e=this.spatial(t,30,!1);e&&this.tone(e,this.ctx.currentTime,600+Math.random()*400,.05,{type:"triangle",gain:.2})}ringing(t){this.ctx&&this.tone(this.master,this.ctx.currentTime,3800,t,{gain:.12})}ui(){this.ctx&&this.tone(this.master,this.ctx.currentTime,700,.04,{type:"triangle",gain:.12})}money(){if(!this.ctx)return;let t=this.ctx.currentTime;this.tone(this.master,t,1200,.06,{gain:.12}),this.tone(this.master,t+.06,1600,.08,{gain:.12})}roundStart(){if(!this.ctx)return;let t=this.ctx.currentTime;[523,659,784].forEach((e,n)=>this.tone(this.master,t+n*.12,e,.18,{type:"triangle",gain:.18}))}roundEnd(t){if(!this.ctx)return;let e=this.ctx.currentTime;(t?[784,988,1175]:[523,440,349]).forEach((n,s)=>this.tone(this.master,e+s*.16,n,.3,{type:"triangle",gain:.2}))}say(t,e){try{if(!("speechSynthesis"in window)||!t)return;let n=new SpeechSynthesisUtterance(t);n.lang=e==="en"?"en-US":"tr-TR",n.rate=1.1,n.volume=Math.min(1,this.volume+.1),speechSynthesis.cancel(),speechSynthesis.speak(n)}catch{}}};var js=class i extends Ht{constructor(){let t=i.SkyShader,e=new cn({name:t.name,uniforms:sl.clone(t.uniforms),vertexShader:t.vertexShader,fragmentShader:t.fragmentShader,side:Ke,depthWrite:!1});super(new ze(1,1,1),e),this.isSky=!0}};js.SkyShader={name:"SkyShader",uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new U},cloudScale:{value:2e-4},cloudSpeed:{value:2e-5},cloudCoverage:{value:.4},cloudDensity:{value:.4},cloudElevation:{value:.5},showSunDisc:{value:1},time:{value:0}},vertexShader:`
		uniform vec3 sunPosition;
		uniform float rayleigh;
		uniform float turbidity;
		uniform float mieCoefficient;

		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		// constants for atmospheric scattering
		const float e = 2.71828182845904523536028747135266249775724709369995957;
		const float pi = 3.141592653589793238462643383279502884197169;

		// wavelength of used primaries, according to preetham
		const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );
		// this pre-calculation replaces older TotalRayleigh(vec3 lambda) function:
		// (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))
		const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );

		// mie stuff
		// K coefficient for the primaries
		const float v = 4.0;
		const vec3 K = vec3( 0.686, 0.678, 0.666 );
		// MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K
		const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );

		// earth shadow hack
		// cutoffAngle = pi / 1.95;
		const float cutoffAngle = 1.6110731556870734;
		const float steepness = 1.5;
		const float EE = 1000.0;

		float sunIntensity( float zenithAngleCos ) {
			zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );
			return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );
		}

		vec3 totalMie( float T ) {
			float c = ( 0.2 * T ) * 10E-18;
			return 0.434 * c * MieConst;
		}

		void main() {

			vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
			vWorldPosition = worldPosition.xyz;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			gl_Position.z = gl_Position.w; // set z to camera.far

			vSunDirection = normalize( sunPosition );

			vSunE = sunIntensity( vSunDirection.y );

			vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

			float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );

			// extinction (absorption + out scattering)
			// rayleigh coefficients
			vBetaR = totalRayleigh * rayleighCoefficient;

			// mie coefficients
			vBetaM = totalMie( turbidity ) * mieCoefficient;

		}`,fragmentShader:`
		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		uniform float mieDirectionalG;
		uniform float cloudScale;
		uniform float cloudSpeed;
		uniform float cloudCoverage;
		uniform float cloudDensity;
		uniform float cloudElevation;
		uniform float showSunDisc;
		uniform float time;

		// gradient at a lattice corner; sinless hash so every GPU produces the same clouds
		vec2 gradient( vec2 i ) {
			vec3 p = fract( i.xyx * vec3( 0.1031, 0.1030, 0.0973 ) );
			p += dot( p, p.yzx + 33.33 );
			return fract( ( p.xx + p.yz ) * p.zy ) * 2.0 - 1.0;
		}

		// 2D gradient noise: isotropic lobes like Perlin at value-noise cost
		float noise( vec2 p ) {
			vec2 i = floor( p );
			vec2 f = fract( p );
			vec2 u = f * f * f * ( f * ( f * 6.0 - 15.0 ) + 10.0 ); // quintic fade
			float a = dot( gradient( i ), f );
			float b = dot( gradient( i + vec2( 1.0, 0.0 ) ), f - vec2( 1.0, 0.0 ) );
			float c = dot( gradient( i + vec2( 0.0, 1.0 ) ), f - vec2( 0.0, 1.0 ) );
			float d = dot( gradient( i + vec2( 1.0, 1.0 ) ), f - vec2( 1.0, 1.0 ) );
			return mix( mix( a, b, u.x ), mix( c, d, u.x ), u.y ) * 1.6; // ~[-1,1]
		}

		// fbm; per-octave drift makes clouds billow instead of scrolling as a rigid stamp
		float fbm( vec2 p, float drift ) {
			float result = 0.0;
			float amplitude = 1.0;
			for ( int i = 0; i < 4; i ++ ) {
				result += amplitude * noise( p );
				amplitude *= 0.5;
				p = p * 2.0 + drift;
			}
			return result;
		}

		// constants for atmospheric scattering
		const float pi = 3.141592653589793238462643383279502884197169;

		const float n = 1.0003; // refractive index of air
		const float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)

		// optical length at zenith for molecules
		const float rayleighZenithLength = 8.4E3;
		const float mieZenithLength = 1.25E3;
		// 66 arc seconds -> degrees, and the cosine of that
		const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;

		// 3.0 / ( 16.0 * pi )
		const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
		// 1.0 / ( 4.0 * pi )
		const float ONE_OVER_FOURPI = 0.07957747154594767;

		float rayleighPhase( float cosTheta ) {
			return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
		}

		float hgPhase( float cosTheta, float g ) {
			float g2 = pow( g, 2.0 );
			float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
			return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
		}

		void main() {

			vec3 direction = normalize( vWorldPosition - cameraPosition );

			// optical length
			// cutoff angle at 90 to avoid singularity in next formula.
			float zenithAngle = acos( max( 0.0, direction.y ) );
			float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
			float sR = rayleighZenithLength * inverse;
			float sM = mieZenithLength * inverse;

			// combined extinction factor
			vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );

			// in scattering
			float cosTheta = dot( direction, vSunDirection );

			float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
			vec3 betaRTheta = vBetaR * rPhase;

			float mPhase = hgPhase( cosTheta, mieDirectionalG );
			vec3 betaMTheta = vBetaM * mPhase;

			vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
			Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - vSunDirection.y, 5.0 ), 0.0, 1.0 ) );

			// nightsky
			float theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]
			float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]
			vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
			vec3 L0 = vec3( 0.1 ) * Fex;

			// composition + solar disc
			float sundisc = clamp( ( cosTheta - sunAngularDiameterCos ) * 50000.0, 0.0, 1.0 ) * showSunDisc;
			vec3 sundiscColor = ( 760.0 * sundisc ) * min( vSunE * Fex, 80.0 );

			vec3 texColor = ( Lin + L0 ) * 0.04 + sundiscColor + vec3( 0.0, 0.0003, 0.00075 );

			// Clouds
			if ( direction.y > 0.0 && cloudCoverage > 0.0 ) {

				// Project to cloud plane (higher elevation = clouds appear lower/closer)
				float elevation = mix( 1.0, 0.1, cloudElevation );
				vec2 cloudUV = direction.xz / ( direction.y * elevation );
				cloudUV *= cloudScale;
				cloudUV += time * cloudSpeed;

				// Cloud density field
				float evolve = time * cloudSpeed * 300.0;
				float cloudNoise = clamp( fbm( cloudUV * 1000.0, evolve ) * 0.7 + 0.5, 0.0, 1.0 );

				// Large-scale coverage variation: clear gaps next to dense banks
				float region = noise( cloudUV * 300.0 ) * 0.37 + 0.5;
				float cov = clamp( cloudCoverage + ( region - 0.5 ) * 0.6, 0.0, 1.0 );

				// Carve clouds where noise rises above the coverage level
				float threshold = 1.0 - cov;
				float cloudMask = smoothstep( threshold, threshold + 0.3, cloudNoise );

				// Fade clouds near horizon (adjusted by elevation)
				float horizonFade = smoothstep( 0.0, 0.03 + 0.06 * cloudElevation, direction.y );
				cloudMask *= horizonFade;

				// Cloud lighting from the sky's own radiance
				float dayFactor = smoothstep( -0.08, 0.3, vSunDirection.y );
				vec3 sunColor = vSunE * Fex * 0.22 * 0.04; // 0.22 ~ albedo/pi, 0.04 = exposure; the aerial composite adds the eye-leg extinction
				vec3 skyAmbient = Lin * 0.04 + vec3( 0.0, 0.0003, 0.00075 );

				// Beer-powder self-shadow from the sampled density
				float depth = max( 0.0, cloudNoise - threshold );
				float beer = exp( depth * -4.0 );
				float powder = 1.0 - beer * beer; // beer*beer == exp(-8*depth)
				float shade = mix( 0.45, 1.0, clamp( beer * powder * 2.6, 0.0, 1.0 ) ); // 2.6 = 1/0.385, normalizes beer*powder peak to 1

				// Henyey-Greenstein forward lobe ( g = 0.7 ): silver lining on rims toward the sun
				float silver = clamp( 0.51 / pow( 1.49 - cosTheta * 1.4, 1.5 ), 0.0, 3.0 ); // 0.51=1-g^2, 1.49=1+g^2, 1.4=2g
				float edge = cloudMask * ( 1.0 - cloudMask ) * 4.0;

				vec3 cloudColor = skyAmbient + sunColor * shade;
				cloudColor += sunColor * silver * edge * 0.6;
				cloudColor *= max( dayFactor, 0.03 );

				// Cloud opacity via Beer's law: density sets how solid the clouds get
				float alpha = ( 1.0 - exp( depth * cloudDensity * -12.0 ) ) * horizonFade;

				// Occlude the sun disc/glow behind opaque cloud
				texColor -= L0 * 0.04 * alpha;

				// Composite through the atmosphere so distant clouds dissolve into haze
				vec3 cloudAerial = mix( texColor, cloudColor, Fex );
				texColor = mix( texColor, cloudAerial, alpha );

			}

			gl_FragColor = vec4( texColor, 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};jr();Kr();jr();function $d(i,t){let e=[];for(let n of t.props)if(n.type==="billboard"){let s=Math.cos(n.a||0),r=Math.sin(n.a||0);for(let o of[-1,1])e.push({type:"leg",x:n.x+s*o*(n.hx-.4),z:n.z+r*o*(n.hx-.4),r:.18,y0:n.y0,y1:n.y1-2.6});e.push({...n,y0:n.y1-3})}else n.type==="busstop"?e.push({...n}):n.type==="tree"?e.push({...n,y1:n.y0+3.5}):e.push({...n});xh(i,e)}Ks();var ae={PRIMARY:0,SECONDARY:1,KNIFE:2,GRENADE:3,BOMB:4};var Ue=i=>({auto:!1,pellets:1,armorPen:.7,headMul:4,falloff:.9,range:4e3,spreadStand:.004,spreadMove:.06,spreadCrouch:.003,spreadJump:.25,recoil:.012,recoilMax:.12,recoilRecover:6,reward:300,team:null,zoom:null,silenced:!1,...i}),Se={knife:Ue({id:"knife",slot:ae.KNIFE,name:{tr:"B\u0131\xE7ak",en:"Knife"},price:0,damage:40,rpm:120,mag:0,reserve:0,reload:0,speed:1,melee:!0,range:1.8,headMul:1,reward:1500,model:"knife"}),glock:Ue({id:"glock",slot:ae.SECONDARY,name:{tr:"Glock-18",en:"Glock-18"},team:"T",price:200,damage:30,armorPen:.47,rpm:400,mag:20,reserve:120,reload:2.2,speed:.96,spreadStand:.008,spreadMove:.03,recoil:.01,falloff:.85,model:"pistol"}),usp:Ue({id:"usp",slot:ae.SECONDARY,name:{tr:"USP-S",en:"USP-S"},team:"CT",price:200,damage:35,armorPen:.5,rpm:352,mag:12,reserve:24,reload:2.2,speed:.96,spreadStand:.006,spreadMove:.028,recoil:.012,falloff:.91,silenced:!0,model:"pistol"}),p250:Ue({id:"p250",slot:ae.SECONDARY,name:{tr:"P250",en:"P250"},price:300,damage:38,armorPen:.64,rpm:400,mag:13,reserve:26,reload:2.2,speed:.96,spreadStand:.008,spreadMove:.03,recoil:.016,falloff:.85,model:"pistol"}),deagle:Ue({id:"deagle",slot:ae.SECONDARY,name:{tr:"Desert Eagle",en:"Desert Eagle"},price:700,damage:63,armorPen:.93,rpm:267,mag:7,reserve:35,reload:2.2,speed:.92,spreadStand:.01,spreadMove:.07,recoil:.05,recoilMax:.2,falloff:.81,model:"deagle"}),mac10:Ue({id:"mac10",slot:ae.PRIMARY,name:{tr:"MAC-10",en:"MAC-10"},team:"T",price:1050,damage:29,armorPen:.57,rpm:800,mag:30,reserve:100,reload:2.6,speed:.96,auto:!0,spreadStand:.012,spreadMove:.03,recoil:.006,falloff:.8,reward:600,model:"smg"}),mp9:Ue({id:"mp9",slot:ae.PRIMARY,name:{tr:"MP9",en:"MP9"},team:"CT",price:1250,damage:26,armorPen:.6,rpm:857,mag:30,reserve:120,reload:2.1,speed:.96,auto:!0,spreadStand:.01,spreadMove:.028,recoil:.006,falloff:.87,reward:600,model:"smg"}),mp5:Ue({id:"mp5",slot:ae.PRIMARY,name:{tr:"MP5-SD",en:"MP5-SD"},price:1500,damage:27,armorPen:.63,rpm:750,mag:30,reserve:120,reload:2.6,speed:.94,auto:!0,spreadStand:.008,spreadMove:.025,recoil:.005,falloff:.85,silenced:!0,reward:600,model:"smg"}),p90:Ue({id:"p90",slot:ae.PRIMARY,name:{tr:"P90",en:"P90"},price:2350,damage:26,armorPen:.69,rpm:857,mag:50,reserve:100,reload:3.3,speed:.92,auto:!0,spreadStand:.012,spreadMove:.03,recoil:.005,falloff:.86,reward:300,model:"p90"}),nova:Ue({id:"nova",slot:ae.PRIMARY,name:{tr:"Nova Pompal\u0131",en:"Nova Shotgun"},price:1050,damage:26,pellets:9,armorPen:.5,rpm:68,mag:8,reserve:32,reload:3.6,speed:.88,spreadStand:.06,spreadMove:.07,spreadCrouch:.06,recoil:.06,recoilMax:.15,falloff:.7,range:40,headMul:4,reward:900,model:"shotgun"}),galil:Ue({id:"galil",slot:ae.PRIMARY,name:{tr:"Galil AR",en:"Galil AR"},team:"T",price:1800,damage:30,armorPen:.77,rpm:666,mag:35,reserve:90,reload:3,speed:.86,auto:!0,spreadStand:.006,spreadMove:.1,recoil:.009,falloff:.98,model:"rifle_t"}),famas:Ue({id:"famas",slot:ae.PRIMARY,name:{tr:"FAMAS",en:"FAMAS"},team:"CT",price:2050,damage:30,armorPen:.7,rpm:666,mag:25,reserve:90,reload:3.3,speed:.88,auto:!0,spreadStand:.006,spreadMove:.1,recoil:.009,falloff:.96,model:"rifle_ct"}),ak47:Ue({id:"ak47",slot:ae.PRIMARY,name:{tr:"AK-47",en:"AK-47"},team:"T",price:2700,damage:36,armorPen:.775,rpm:600,mag:30,reserve:90,reload:2.5,speed:.86,auto:!0,spreadStand:.005,spreadMove:.12,recoil:.014,recoilMax:.16,falloff:.98,model:"ak"}),m4a1:Ue({id:"m4a1",slot:ae.PRIMARY,name:{tr:"M4A1-S",en:"M4A1-S"},team:"CT",price:2900,damage:33,armorPen:.7,rpm:600,mag:25,reserve:75,reload:3.1,speed:.9,auto:!0,spreadStand:.004,spreadMove:.1,recoil:.011,recoilMax:.13,falloff:.99,silenced:!0,model:"m4"}),ssg08:Ue({id:"ssg08",slot:ae.PRIMARY,name:{tr:"SSG 08 Keskin",en:"SSG 08 Scout"},price:1700,damage:88,armorPen:.85,rpm:48,mag:10,reserve:90,reload:3.7,speed:.92,spreadStand:.03,spreadMove:.12,spreadCrouch:.025,scopedSpread:8e-4,recoil:.04,falloff:.98,zoom:[2.4,6],model:"scout"}),awp:Ue({id:"awp",slot:ae.PRIMARY,name:{tr:"AWP Keskin Ni\u015Fanc\u0131",en:"AWP"},price:4750,damage:115,armorPen:.975,rpm:41,mag:5,reserve:30,reload:3.7,speed:.8,spreadStand:.06,spreadMove:.2,spreadCrouch:.05,scopedSpread:4e-4,recoil:.08,falloff:.99,zoom:[2.5,8],reward:100,model:"awp"}),he:Ue({id:"he",slot:ae.GRENADE,name:{tr:"El Bombas\u0131",en:"HE Grenade"},price:300,damage:98,grenade:"he",mag:1,reserve:0,rpm:60,speed:1,model:"grenade"}),flash:Ue({id:"flash",slot:ae.GRENADE,name:{tr:"Fla\u015F Bombas\u0131",en:"Flashbang"},price:200,damage:0,grenade:"flash",mag:1,reserve:0,rpm:60,speed:1,model:"flash"}),smoke:Ue({id:"smoke",slot:ae.GRENADE,name:{tr:"Sis Bombas\u0131",en:"Smoke Grenade"},price:300,damage:0,grenade:"smoke",mag:1,reserve:0,rpm:60,speed:1,model:"smoke"}),bomb:Ue({id:"bomb",slot:ae.BOMB,name:{tr:"C4 Bomba",en:"C4 Bomb"},team:"T",price:0,damage:0,rpm:60,mag:0,reserve:0,speed:.98,model:"bomb"})},_h=Object.keys(Se),kb=Object.fromEntries(_h.map((i,t)=>[i,t])),Yy=[{zone:"head",type:"sphere",y:1.68,r:.15},{zone:"chest",type:"cyl",y0:1.08,y1:1.52,r:.25},{zone:"stomach",type:"cyl",y0:.8,y1:1.08,r:.23},{zone:"legs",type:"cyl",y0:0,y1:.8,r:.2}];function Zd(i,t,e,n,s,r,o,a,l,c,h){let d=1-.3*c,u=null;for(let m of Yy){let g=null;if(m.type==="sphere"){let x=a+m.y*d,f=i-o,p=t-x,y=e-l,S=f*n+p*s+y*r,v=f*f+p*p+y*y-m.r*m.r,b=S*S-v;if(b>=0){let E=-S-Math.sqrt(b);E>0&&(g=E)}}else{let x=i-o,f=e-l,p=n*n+r*r,y=2*(x*n+f*r),S=x*x+f*f-m.r*m.r,v=y*y-4*p*S;if(v>=0&&p>1e-9){let b=Math.sqrt(v);for(let E of[(-y-b)/(2*p),(-y+b)/(2*p)]){if(E<=0)continue;let R=t+s*E;if(R>=a+m.y0*d&&R<=a+m.y1*d){g=E;break}}}}g!==null&&g<h&&(!u||g<u.t)&&(u={t:g,zone:m.zone})}return u}var yl={vest:{id:"vest",name:{tr:"\xC7elik Yelek",en:"Kevlar Vest"},price:650},vesthelm:{id:"vesthelm",name:{tr:"Yelek + Kask",en:"Kevlar + Helmet"},price:1e3},defuser:{id:"defuser",name:{tr:"\u0130mha Kiti",en:"Defuse Kit"},price:400,team:"CT"}},Kd=[{id:"pistols",name:{tr:"Tabancalar",en:"Pistols"},items:["glock","usp","p250","deagle"]},{id:"smgs",name:{tr:"Hafif Makineli",en:"SMGs"},items:["mac10","mp9","mp5","p90"]},{id:"heavy",name:{tr:"Pompal\u0131",en:"Heavy"},items:["nova"]},{id:"rifles",name:{tr:"T\xFCfekler",en:"Rifles"},items:["galil","famas","ak47","m4a1","ssg08","awp"]},{id:"gear",name:{tr:"Te\xE7hizat",en:"Gear"},items:["vest","vesthelm","defuser"]},{id:"grenades",name:{tr:"Bombalar",en:"Grenades"},items:["he","flash","smoke"]}],Mh=6.2;function Jd(i,t){let e=Se[t]||yl[t];return e?!e.team||e.team===i:!1}function jd(i){return(Se[i]||yl[i])?.price??0}function bh(i,t){if(i.melee)return 0;let e;return t.onGround?t.speed>1.2?e=i.spreadStand+(i.spreadMove-i.spreadStand)*Math.min(1,(t.speed-1.2)/3.5):t.crouch?e=i.spreadCrouch:e=i.spreadStand:e=i.spreadJump,i.zoom&&(e=t.scoped&&t.speed<1.2&&t.onGround?i.scopedSpread:e),e+(t.recoil||0)*.35}jr();function Sh(i=0,t=0,e=0){return{x:i,y:t,z:e,vx:0,vy:0,vz:0,onGround:!0,crouch:0,jumpHeld:!1}}function $y(i){return Ae.height+(Ae.crouchHeight-Ae.height)*i.crouch}function tf(i){return Ae.eye+(Ae.crouchEye-Ae.eye)*i.crouch}function Qd(i,t,e,n,s,r){let o=i.vx*t+i.vz*e,a=n-o;if(a<=0)return;let l=Math.min(a,s*n*r);i.vx+=l*t,i.vz+=l*e}function ef(i,t,e,n){t.crouch=e.crouch?Math.min(1,t.crouch+n*7):Math.max(0,t.crouch-n*7);let s=$y(t),r=Math.sin(e.yaw),o=Math.cos(e.yaw),a=-r*e.fwd+o*e.side,l=-o*e.fwd-r*e.side,c=Math.hypot(a,l);c>1e-4&&(a/=c,l/=c),c=Math.min(1,c);let h=Mh*(e.speedMul||1);if(t.crouch>.5?h*=Ae.crouchMul:e.walk&&(h*=Ae.walkMul),t.onGround){let y=Math.hypot(t.vx,t.vz);if(y>0){let S=Math.max(y,Ae.stopSpeed)*Ae.friction*n,v=Math.max(0,y-S)/y;t.vx*=v,t.vz*=v}Qd(t,a,l,h*c,Ae.accel/6,n),e.jump&&!t.jumpHeld&&t.crouch<.6&&(t.vy=Ae.jumpSpeed,t.onGround=!1)}else Qd(t,a,l,Math.min(h*c,1),Ae.airAccel*10,n);t.jumpHeld=!!e.jump;let d=Math.hypot(t.vx,t.vz),u=Mh*1.15;d>u&&(t.vx*=u/d,t.vz*=u/d);let m=t.x,g=t.z,x=d*n,f=Math.max(1,Math.ceil(x/(Ae.radius*.5)));for(let y=0;y<f;y++){let S=t.x+t.vx*n/f,v=t.z+t.vz*n/f;[S,v]=yh(i,S,v,Ae.radius,t.y+.02,t.y+s,Ae.stepHeight);let b=i.half-Ae.radius;t.x=Math.max(-b,Math.min(b,S)),t.z=Math.max(-b,Math.min(b,v))}if(n>0){let y=(t.x-m)/n,S=(t.z-g)/n;Math.abs(y)<Math.abs(t.vx)&&(t.vx=y),Math.abs(S)<Math.abs(t.vz)&&(t.vz=S)}t.vy-=Ae.gravity*n,t.y+=t.vy*n;let p=vh(i,t.x,t.z,Ae.radius,t.y,Ae.stepHeight);return t.y<=p?(t.y=p,t.vy<0&&(t.vy=0),t.onGround=!0):t.onGround&&t.vy<=0&&t.y-p<Ae.stepHeight?(t.y=p,t.vy=0):t.onGround=!1,t}function Qr(i){return Math.hypot(i.vx,i.vz)}Ks();var ye=class{constructor(t=!1){this.pos=[],this.nrm=[],this.uv=[],this.idx=[],this.col=t?[]:null}get count(){return this.pos.length/3}vert(t,e,n,s,r,o,a,l,c){return this.pos.push(t,e,n),this.nrm.push(s,r,o),this.uv.push(a,l),this.col&&this.col.push(c?c[0]:1,c?c[1]:1,c?c[2]:1),this.count-1}quad(t,e,n,s,r,o,a){let l=this.vert(t[0],t[1],t[2],r[0],r[1],r[2],o[0][0],o[0][1],a);this.vert(e[0],e[1],e[2],r[0],r[1],r[2],o[1][0],o[1][1],a),this.vert(n[0],n[1],n[2],r[0],r[1],r[2],o[2][0],o[2][1],a),this.vert(s[0],s[1],s[2],r[0],r[1],r[2],o[3][0],o[3][1],a),this.idx.push(l,l+1,l+2,l,l+2,l+3)}box(t,e,n,s,r,o,a,l,c,h=1,d=63){let u=-s,m=n,g=(v,b,E)=>[t+n*r*v+u*o*b,E,e+s*r*v+m*o*b],x=h,f=r*2*x,p=o*2*x,y=(l-a)*x,S=(v,b)=>[[0,0],[v,0],[v,b],[0,b]];d&1&&this.quad(g(-1,1,a),g(1,1,a),g(1,1,l),g(-1,1,l),[u,0,m],S(f,y),c),d&2&&this.quad(g(1,-1,a),g(-1,-1,a),g(-1,-1,l),g(1,-1,l),[-u,0,-m],S(f,y),c),d&4&&this.quad(g(1,1,a),g(1,-1,a),g(1,-1,l),g(1,1,l),[n,0,s],S(p,y),c),d&8&&this.quad(g(-1,-1,a),g(-1,1,a),g(-1,1,l),g(-1,-1,l),[-n,0,-s],S(p,y),c),d&16&&this.quad(g(-1,-1,l),g(-1,1,l),g(1,1,l),g(1,-1,l),[0,1,0],[[0,0],[0,p],[f,p],[f,0]],c),d&32&&this.quad(g(-1,1,a),g(-1,-1,a),g(1,-1,a),g(1,1,a),[0,-1,0],[[0,p],[0,0],[f,0],[f,p]],c)}cylinder(t,e,n,s,r,o,a){let l=this.count;for(let h=0;h<=o;h++){let d=h/o*Math.PI*2,u=Math.cos(d),m=Math.sin(d);this.vert(t+u*n,s,e+m*n,u,0,m,h/o,0,a),this.vert(t+u*n,r,e+m*n,u,0,m,h/o,1,a)}for(let h=0;h<o;h++){let d=l+h*2;this.idx.push(d,d+1,d+3,d,d+3,d+2)}let c=this.vert(t,r,e,0,1,0,.5,.5,a);for(let h=0;h<=o;h++){let d=h/o*Math.PI*2;this.vert(t+Math.cos(d)*n,r,e+Math.sin(d)*n,0,1,0,.5,.5,a)}for(let h=0;h<o;h++)this.idx.push(c,c+2+h,c+1+h)}build(){let t=new ke;return t.setAttribute("position",new fe(this.pos,3)),t.setAttribute("normal",new fe(this.nrm,3)),t.setAttribute("uv",new fe(this.uv,2)),this.col&&t.setAttribute("color",new fe(this.col,3)),t.setIndex(this.count>65535?new qi(this.idx,1):new Xi(this.idx,1)),t.computeBoundingSphere(),t.computeBoundingBox(),t}};function Qs(i){let t=i>>>0||1;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function Fe(i,t){let e=document.createElement("canvas");return e.width=i,e.height=t,[e,e.getContext("2d")]}function Oe(i,{repeat:t=!0,srgb:e=!0,aniso:n=4}={}){let s=new wr(i);return t&&(s.wrapS=s.wrapT=Es),s.colorSpace=e?Be:Vn,s.anisotropy=n,s}function Ml(i,t,e,n,s,r=.08){for(let o=0;o<n;o++){let a=s()<.5?0:255;i.fillStyle=`rgba(${a},${a},${a},${r*s()})`,i.fillRect(s()*t,s()*e,1+s()*2,1+s()*2)}}var _l=(i,t=1)=>{let e=parseInt(i.slice(1),16),n=Math.min(255,(e>>16&255)*t),s=Math.min(255,(e>>8&255)*t),r=Math.min(255,(e&255)*t);return`rgb(${n|0},${s|0},${r|0})`},mi=[{wall:"#ddd1b6",trim:"#ece5d6",frame:"#ebebe7",name:"krem"},{wall:"#d8c3a0",trim:"#efe4cf",frame:"#f2f2ef",name:"bej"},{wall:"#dad8d1",trim:"#c8c5bd",frame:"#f3f3f1",name:"beyaz"},{wall:"#e6d59a",trim:"#f4ecd0",frame:"#f6f6f2",name:"sari"},{wall:"#d6a389",trim:"#efd8c8",frame:"#f4f2ee",name:"somon"},{wall:"#c9c7c1",trim:"#e6e4de",frame:"#f6f6f4",name:"gri"},{wall:"#5d6168",trim:"#7d828a",frame:"#2d3036",modern:!0,name:"modern"},{wall:"#b9b4ab",trim:"#8f2f24",frame:"#f0f0ee",brick:!0,name:"tugla"}];function vl(i,t,e,n,s,r,o,a,l,c){let{c:h,rough:d,emis:u}=i,m=a.frame,g=h.createLinearGradient(n,s,n,s+o);g.addColorStop(0,"#9fb6c8"),g.addColorStop(.45,"#4d6273"),g.addColorStop(1,"#27323c"),h.fillStyle=g,h.fillRect(n,s,r,o);let x=l();if(x<.45){h.fillStyle=["#efe6d2","#d9cbb0","#f4f1ea","#c8b9a6","#e3d3c3"][Math.floor(l()*5)];let f=r*(.25+l()*.25);h.globalAlpha=.85,h.fillRect(n+3,s+3,f,o-6),h.fillRect(n+r-3-f,s+3,f,o-6),h.globalAlpha=.25,h.fillStyle="#000";for(let p=0;p<6;p++)h.fillRect(n+3+f/6*p,s+3,1,o-6),h.fillRect(n+r-3-f+f/6*p,s+3,1,o-6);h.globalAlpha=1}else if(x<.62){h.fillStyle="rgba(235,232,224,0.85)";let f=o*(.3+l()*.6);h.fillRect(n+2,s+2,r-4,f),h.fillStyle="rgba(0,0,0,0.12)";for(let p=s+4;p<s+f;p+=4)h.fillRect(n+2,p,r-4,1)}h.strokeStyle=m,h.lineWidth=5,h.strokeRect(n+2.5,s+2.5,r-5,o-5),h.lineWidth=4,h.beginPath(),h.moveTo(n+r/2,s),h.lineTo(n+r/2,s+o),h.stroke(),o>r*1.2&&(h.beginPath(),h.moveTo(n,s+o*.32),h.lineTo(n+r,s+o*.32),h.stroke()),h.fillStyle=_l(a.trim,.95),h.fillRect(n-5,s+o,r+10,6),h.fillStyle="rgba(0,0,0,0.25)",h.fillRect(n-5,s+o+6,r+10,2),d.fillStyle="#1a1a1a",d.fillRect(n+4,s+4,r-8,o-8),d.fillStyle="#7a7a7a",d.fillRect(n,s,r,4),d.fillRect(n,s+o-4,r,4),c&&(u.fillStyle=l()<.7?"#ffd9a0":"#d8e6ff",u.globalAlpha=.5+l()*.5,u.fillRect(n+4,s+4,r-8,o-8),u.globalAlpha=1)}function rf(i,t=1){let e=mi[i%mi.length],n=Qs(t*7919+i),s=512,r=512,o=128,a=128,[l,c]=Fe(s,r),[h,d]=Fe(s,r),[u,m]=Fe(s,r);if(d.fillStyle="#e6e6e6",d.fillRect(0,0,s,r),m.fillStyle="#000",m.fillRect(0,0,s,r),c.fillStyle=e.wall,c.fillRect(0,0,s,r),e.brick)for(let x=0;x<r;x+=8)for(let f=x/8%2?-10:0;f<s;f+=20)c.fillStyle=_l(e.trim,.85+n()*.3),c.fillRect(f+1,x+1,18,6);Ml(c,s,r,9e3,n,.07),c.globalAlpha=.06;for(let x=0;x<12;x++)c.fillStyle="#3a3226",c.fillRect(n()*s,n()*r,2+n()*4,30+n()*80);c.globalAlpha=1;let g={c,rough:d,emis:m};for(let x=0;x<4;x++){let f=x*a;c.fillStyle=e.modern?"#e8e8e6":_l(e.trim),c.fillRect(0,f,s,e.modern?14:8),c.fillStyle="rgba(0,0,0,0.12)",c.fillRect(0,f+(e.modern?14:8),s,2);for(let p=0;p<4;p++){let y=p*o,S=n()<.38;if(e.modern)vl(g,0,0,y+6,f+22,o-12,a-30,e,n,S);else if(n()<.28?(vl(g,0,0,y+18,f+22,40,a-26,e,n,S),vl(g,0,0,y+64,f+30,48,60,e,n,S&&n()<.5)):vl(g,0,0,y+24,f+30,o-48,64,e,n,S),n()<.12){c.fillStyle="#e9e9e7",c.fillRect(y+92,f+98,28,18),c.fillStyle="#9a9a98";for(let b=0;b<5;b++)c.fillRect(y+95+b*5,f+101,2,12)}}}return{map:Oe(l),roughness:Oe(h,{srgb:!1}),emissive:Oe(u),style:e}}var nf=["MARKET","ECZANE","KAFE","FIRIN","KUAF\xD6R","EMLAK","\xC7\u0130\xC7EK\xC7\u0130","B\xDCFE","OPT\u0130K","TERZ\u0130","KASAP","PASTANE","FAEROD.COM","BERBER","MANAV","KIRTAS\u0130YE"],sf=[["#c62828","#fff"],["#1565c0","#fff"],["#2e7d32","#fff"],["#f9a825","#222"],["#222","#f5a623"],["#6a1b9a","#fff"],["#ffffff","#c62828"],["#00838f","#fff"]];function of(i){let t=Qs(i*104729+3),e=1024,n=256,[s,r]=Fe(e,n),[o,a]=Fe(e,n),[l,c]=Fe(e,n);a.fillStyle="#d0d0d0",a.fillRect(0,0,e,n),c.fillStyle="#000",c.fillRect(0,0,e,n),r.fillStyle="#3a3c40",r.fillRect(0,0,e,n);for(let h=0;h<2;h++){let d=h*512,[u,m]=sf[Math.floor(t()*sf.length)],g=nf[Math.floor(t()*nf.length)];r.fillStyle=u,r.fillRect(d+6,8,500,58),r.fillStyle=m,r.font="bold 40px Arial, Helvetica, sans-serif",r.textAlign="center",r.textBaseline="middle",r.fillText(g,d+256,38),c.fillStyle=u==="#ffffff"?"#eeeeee":u,c.globalAlpha=.6,c.fillRect(d+6,8,500,58),c.globalAlpha=1,c.fillStyle=m,c.font=r.font,c.textAlign="center",c.textBaseline="middle",c.fillText(g,d+256,38);let x=r.createLinearGradient(0,74,0,n);x.addColorStop(0,"#7f97a8"),x.addColorStop(.5,"#3b4a56"),x.addColorStop(1,"#1d252c"),r.fillStyle=x,r.fillRect(d+12,76,488,n-86);for(let f=0;f<18;f++)r.fillStyle=`hsla(${t()*360},40%,${40+t()*30}%,0.55)`,r.fillRect(d+20+t()*460,150+t()*70,10+t()*30,8+t()*30);r.strokeStyle="#1b1c1e",r.lineWidth=8,r.strokeRect(d+12,76,488,n-86),r.lineWidth=6;for(let f of[.33,.66])r.beginPath(),r.moveTo(d+12+488*f,76),r.lineTo(d+12+488*f,n-10),r.stroke();if(a.fillStyle="#202020",a.fillRect(d+16,80,480,n-94),c.fillStyle="#ffe9c4",c.globalAlpha=.35,c.fillRect(d+16,80,480,n-94),c.globalAlpha=1,t()<.4){let f=["#b71c1c","#1b5e20","#0d47a1","#e65100"][Math.floor(t()*4)];for(let p=0;p<10;p++)r.fillStyle=p%2?f:"#f2f2f2",r.fillRect(d+12+p*48.8,66,48.8,22)}}return{map:Oe(s),roughness:Oe(o,{srgb:!1}),emissive:Oe(l)}}function af(i,t){let e=mi[i%mi.length],n=Qs(t*31+9),s=512,r=128,[o,a]=Fe(s,r),[l,c]=Fe(s,r);c.fillStyle="#e0e0e0",c.fillRect(0,0,s,r),a.fillStyle=e.wall,a.fillRect(0,0,s,r),Ml(a,s,r,3e3,n,.07),a.fillStyle="#8b8378",a.fillRect(0,r-22,s,22);for(let h=0;h<s;h+=32)a.fillStyle="rgba(0,0,0,0.2)",a.fillRect(h,r-22,2,22);for(let h=0;h<4;h++){let d=h*128;if(h===1&&n()<.6)a.fillStyle="#2b2f33",a.fillRect(d+34,26,60,r-26),a.fillStyle="#5c7180",a.fillRect(d+40,32,22,r-38),a.fillRect(d+66,32,22,r-38),a.fillStyle="#c9c4ba",a.fillRect(d+24,18,80,8),a.fillStyle="#ddd",a.font="bold 12px Arial",a.textAlign="center",a.fillText("No:"+(1+Math.floor(n()*60)),d+64,14),c.fillStyle="#222",c.fillRect(d+40,32,48,r-38);else{a.fillStyle="#3d4b56",a.fillRect(d+28,26,72,56),a.strokeStyle=e.frame,a.lineWidth=4,a.strokeRect(d+28,26,72,56),a.strokeStyle="#2a2a2a",a.lineWidth=2;for(let u=1;u<6;u++)a.beginPath(),a.moveTo(d+28+u*12,26),a.lineTo(d+28+u*12,82),a.stroke();c.fillStyle="#222",c.fillRect(d+30,28,68,52)}}return{map:Oe(o),roughness:Oe(l,{srgb:!1})}}function bl(i,t=1){let e=Qs(t*17+i),n=512,s=256,[r,o]=Fe(n,s),[a,l]=Fe(n,s);o.fillStyle="#4a4c4f",o.fillRect(0,0,n,s);for(let d=0;d<16e3;d++){let u=50+e()*60;o.fillStyle=`rgb(${u},${u},${u+2})`,o.fillRect(e()*n,e()*s,1.5,1.5)}for(let d=0;d<3;d++)o.fillStyle=`rgba(30,30,32,${.15+e()*.15})`,o.fillRect(e()*n,e()*s,40+e()*120,20+e()*60);o.strokeStyle="rgba(20,20,20,0.5)",o.lineWidth=1;for(let d=0;d<6;d++){o.beginPath();let u=e()*n,m=e()*s;o.moveTo(u,m);for(let g=0;g<8;g++)u+=(e()-.5)*30,m+=(e()-.5)*30,o.lineTo(u,m);o.stroke()}o.fillStyle="rgba(25,25,25,0.12)";let c=i>=4?[.12,.33,.67,.88]:i>=2?[.25,.75]:[.5];for(let d of c)o.fillRect(0,s*d-14,n,28);l.fillStyle="#d8d8d8",l.fillRect(0,0,n,s);let h=(d,u,m=6,g="#f2f2ee")=>{if(o.fillStyle=g,l.fillStyle="#8a8a8a",u)for(let x=0;x<n;x+=170)o.fillRect(x,d-m/2,100,m),l.fillRect(x,d-m/2,100,m);else o.fillRect(0,d-m/2,n,m),l.fillRect(0,d-m/2,n,m)};return i>=4?(h(s*.5-5,!1,5),h(s*.5+5,!1,5),h(s*.25,!0),h(s*.75,!0),h(s*.035,!1,5),h(s*.965,!1,5)):i>=2&&(h(s*.5,!0),h(s*.04,!1,4),h(s*.96,!1,4)),{map:Oe(r),roughness:Oe(a,{srgb:!1})}}function wh(i="red",t=3){let e=Qs(t),n=256,s=256,[r,o]=Fe(n,s),a=i==="red"?[168,92,72]:i==="gray"?[150,148,144]:[190,170,140];o.fillStyle="#6f6a63",o.fillRect(0,0,n,s);let l=32,c=16;for(let h=0;h<s;h+=c)for(let d=h/c%2?-l/2:0;d<n;d+=l){let u=.85+e()*.3;o.fillStyle=`rgb(${a[0]*u|0},${a[1]*u|0},${a[2]*u|0})`,o.fillRect(d+1,h+1,l-2,c-2)}return Ml(o,n,s,2500,e,.1),Oe(r)}function si(i,t=5){let e=Qs(t),[n,s]=Fe(256,256),r={grass:"#5d7d3a",soil:"#7b6a50",concrete:"#a7a59f",roof:"#8d8a84",curb:"#b9b7b0",gravel:"#9a958c",wood:"#8a6236",sandbag:"#9c8a62",container:"#2f6b3b",metal:"#8f949b",dark:"#2b2d30",tiles:"#a84a32",water:"#3d6b8a"}[i]||"#888";if(s.fillStyle=r,s.fillRect(0,0,256,256),i==="grass")for(let o=0;o<14e3;o++)s.fillStyle=`hsl(${80+e()*30},${30+e()*30}%,${22+e()*22}%)`,s.fillRect(e()*256,e()*256,1,2+e()*3);else if(i==="wood"){for(let o=0;o<256;o+=32){s.fillStyle="rgba(0,0,0,0.35)",s.fillRect(0,o,256,3);for(let a=0;a<40;a++)s.fillStyle=`rgba(60,35,10,${e()*.3})`,s.fillRect(0,o+e()*30,256,1)}s.fillStyle="rgba(0,0,0,0.4)",s.fillRect(0,0,10,256),s.fillRect(246,0,10,256),s.fillRect(0,120,256,12)}else if(i==="tiles")for(let o=0;o<256;o+=21)for(let a=o/21%2?-16:0;a<256;a+=32){let l=s.createLinearGradient(a,0,a+32,0);l.addColorStop(0,"#8e3a26"),l.addColorStop(.5,"#c25b3e"),l.addColorStop(1,"#8e3a26"),s.fillStyle=l,s.fillRect(a,o,31,20),s.fillStyle="rgba(0,0,0,0.3)",s.fillRect(a,o+18,31,3)}else if(i==="sandbag")for(let o=0;o<256;o+=42)for(let a=o/42%2?-40:0;a<256;a+=80)s.fillStyle=_l("#a8966b",.85+e()*.25),s.beginPath(),s.ellipse(a+40,o+21,38,19,0,0,Math.PI*2),s.fill(),s.strokeStyle="rgba(0,0,0,0.3)",s.stroke();else if(i==="container")for(let o=0;o<256;o+=16)s.fillStyle="rgba(0,0,0,0.18)",s.fillRect(o,0,5,256);else if(i==="roof")for(let o=0;o<60;o++)s.fillStyle=`rgba(${e()<.5?40:160},${e()<.5?40:150},40,0.08)`,s.beginPath(),s.arc(e()*256,e()*256,5+e()*25,0,7),s.fill();return Ml(s,256,256,5e3,e,.12),Oe(n)}function lf(){let[i,t]=Fe(256,64);t.clearRect(0,0,256,64),t.fillStyle="rgba(245,245,240,0.95)";for(let e=0;e<256;e+=32)t.fillRect(e+4,2,18,60);return Oe(i,{repeat:!0})}function cf(i=0,t=1024,e=512){let[n,s]=Fe(t,e),r=[{bg:["#0d0f14","#1e2633"],accent:"#f5a623",line1:"FAEROD",line2:"www.faerod.com",line3:"\u015Eehir senin. Hemen oyna!"},{bg:["#f5a623","#e07b00"],accent:"#111",line1:"FAEROD",line2:"www.faerod.com",line3:"Android \xB7 iOS \xB7 Windows"},{bg:["#13233d","#0a4c8c"],accent:"#ffffff",line1:"faerod.com",line2:"Nil\xFCfer'in en sert \xE7at\u0131\u015Fmas\u0131",line3:"Arkada\u015Flar\u0131n\u0131 davet et!"}],o=r[i%r.length],a=s.createLinearGradient(0,0,t,e);a.addColorStop(0,o.bg[0]),a.addColorStop(1,o.bg[1]),s.fillStyle=a,s.fillRect(0,0,t,e),s.globalAlpha=.12,s.fillStyle=o.accent;for(let u=-e;u<t;u+=90)s.beginPath(),s.moveTo(u,e),s.lineTo(u+40,e),s.lineTo(u+40+e,0),s.lineTo(u+e,0),s.fill();s.globalAlpha=1;let l=t*.16,c=e*.5,h=e*.28;return s.strokeStyle=o.accent,s.lineWidth=e*.035,s.beginPath(),s.arc(l,c,h,0,Math.PI*2),s.stroke(),s.beginPath(),s.moveTo(l-h*1.3,c),s.lineTo(l-h*.35,c),s.moveTo(l+h*.35,c),s.lineTo(l+h*1.3,c),s.moveTo(l,c-h*1.3),s.lineTo(l,c-h*.35),s.moveTo(l,c+h*.35),s.lineTo(l,c+h*1.3),s.stroke(),s.fillStyle=o.accent,s.beginPath(),s.arc(l,c,e*.03,0,Math.PI*2),s.fill(),s.textAlign="left",s.textBaseline="alphabetic",s.fillStyle=i===1?"#111":"#fff",s.font=`900 ${Math.round(e*.27)}px Impact, "Arial Black", Arial, sans-serif`,s.fillText(o.line1,t*.32,e*.47),s.fillStyle=o.accent,s.font=`bold ${Math.round(e*.11)}px Arial, sans-serif`,s.fillText(o.line2,t*.325,e*.66),s.fillStyle=i===1?"#222":"rgba(255,255,255,0.85)",s.font=`${Math.round(e*.075)}px Arial, sans-serif`,s.fillText(o.line3,t*.327,e*.82),s.strokeStyle="rgba(255,255,255,0.25)",s.lineWidth=6,s.strokeRect(3,3,t-6,e-6),Oe(n,{repeat:!1})}function hf(){let[i,t]=Fe(64,64),e=t.createRadialGradient(32,32,0,32,32,30);e.addColorStop(0,"rgba(10,10,10,1)"),e.addColorStop(.18,"rgba(25,22,20,0.95)"),e.addColorStop(.35,"rgba(60,55,50,0.6)"),e.addColorStop(1,"rgba(60,55,50,0)"),t.fillStyle=e,t.fillRect(0,0,64,64),t.strokeStyle="rgba(30,30,30,0.6)",t.lineWidth=1;for(let n=0;n<6;n++){let s=Math.random()*6.28;t.beginPath(),t.moveTo(32,32),t.lineTo(32+Math.cos(s)*20,32+Math.sin(s)*20),t.stroke()}return Oe(i,{repeat:!1})}function Sl(i="255,255,255"){let[t,e]=Fe(128,128),n=e.createRadialGradient(64,64,0,64,64,64);return n.addColorStop(0,`rgba(${i},1)`),n.addColorStop(.4,`rgba(${i},0.6)`),n.addColorStop(1,`rgba(${i},0)`),e.fillStyle=n,e.fillRect(0,0,128,128),Oe(t,{repeat:!1})}function wl(){let[i,t]=Fe(128,128);t.translate(64,64);for(let n=0;n<7;n++){t.rotate(Math.PI*2/7+Math.random()*.3);let s=t.createLinearGradient(0,0,60,0);s.addColorStop(0,"rgba(255,255,230,1)"),s.addColorStop(.4,"rgba(255,200,80,0.8)"),s.addColorStop(1,"rgba(255,120,0,0)"),t.fillStyle=s,t.beginPath(),t.moveTo(0,-7),t.lineTo(62,0),t.lineTo(0,7),t.fill()}let e=t.createRadialGradient(0,0,0,0,0,28);return e.addColorStop(0,"rgba(255,255,255,1)"),e.addColorStop(1,"rgba(255,190,90,0)"),t.fillStyle=e,t.beginPath(),t.arc(0,0,28,0,7),t.fill(),Oe(i,{repeat:!1})}function uf(){let[i,t]=Fe(128,128),e=t.createRadialGradient(64,64,0,64,64,64);return e.addColorStop(0,"rgba(10,8,6,0.95)"),e.addColorStop(.5,"rgba(20,15,10,0.6)"),e.addColorStop(1,"rgba(20,15,10,0)"),t.fillStyle=e,t.fillRect(0,0,128,128),Oe(i,{repeat:!1})}function df(i){let[t,e]=Fe(256,256);return e.strokeStyle="rgba(255,170,30,0.85)",e.lineWidth=10,e.setLineDash([26,16]),e.beginPath(),e.arc(128,128,118,0,Math.PI*2),e.stroke(),e.setLineDash([]),e.fillStyle="rgba(255,170,30,0.9)",e.font="bold 120px Arial",e.textAlign="center",e.textBaseline="middle",e.fillText(i,128,134),Oe(t,{repeat:!1})}function Th(i,{color:t="#fff",bg:e="rgba(0,0,0,0.45)",size:n=40}={}){let[s,r]=Fe(512,96);r.font=`bold ${n}px Arial, sans-serif`;let o=Math.min(500,r.measureText(i).width+30);return r.fillStyle=e,r.fillRect(256-o/2,18,o,60),r.fillStyle=t,r.textAlign="center",r.textBaseline="middle",r.fillText(i,256,50),Oe(s,{repeat:!1})}Kr();var Tl=3,eo=3.2;function Zy(i){let t=ii(i.id,11)%100;switch(i.kind){case pe.COMMERCIAL:case pe.HOTEL:return t<55?6:t<80?5:2;case pe.INDUSTRIAL:return 5;case pe.SCHOOL:return t<50?3:4;case pe.RELIGIOUS:case pe.HOSPITAL:case pe.PUBLIC:return 2;case pe.HOUSE:return[0,1,3,4,7][t%5];default:return t<14?6:[0,1,2,3,4,5,0,1,7][t%9]}}var El=class{constructor({scene:t,bgScene:e,arena:n,region:s,index:r,quality:o,renderer:a}){this.scene=t,this.bgScene=e,this.arena=n,this.region=s,this.index=r,this.q=o,this.renderer=a,this.group=new Ce,this.bgGroup=new Ce,t.add(this.group),e.add(this.bgGroup),this.materials=[],this.lights=[]}mat(t,e){let n=new Ee(t);return this.materials.push(n),n}build(t=()=>{}){let e=this.arena,n=Math.min(8,this.renderer.capabilities.getMaxAnisotropy());this.facadeMats=mi.map((o,a)=>{let l=rf(a,7+a);for(let c of["map","roughness","emissive"])l[c].anisotropy=n;return this.mat({map:l.map,roughnessMap:l.roughness,roughness:1,metalness:0,emissiveMap:l.emissive,emissive:new Ct(0),envMapIntensity:.45})}),this.shopMats=[0,1,2,3].map(o=>{let a=of(101+o);return this.mat({map:a.map,roughnessMap:a.roughness,roughness:1,emissiveMap:a.emissive,emissive:new Ct(0)})}),this.groundFloorMats=mi.map((o,a)=>{let l=af(a,30+a);return this.mat({map:l.map,roughnessMap:l.roughness,roughness:1})});let s=si("concrete",9);this.parapetMat=this.mat({map:s,color:15262940,roughness:.9,side:En}),this.roofMat=this.mat({map:si("roof",4),roughness:.95}),this.tileMat=this.mat({map:si("tiles",6),roughness:.8}),this.slabMat=this.mat({map:s,color:15789542,roughness:.85}),this.glassRailMat=this.mat({color:10470614,roughness:.05,metalness:.1,transparent:!0,opacity:.45,envMapIntensity:1.5,depthWrite:!1}),this.metalRailMat=this.mat({color:3093046,roughness:.5,metalness:.6}),this.itemsMat=this.mat({vertexColors:!0,roughness:.6,metalness:.2}),this.roadMats={4:this.roadMat(bl(4,1),n),2:this.roadMat(bl(2,2),n),1:this.roadMat(bl(1,3),n)},this.footMat=this.mat({map:wh("gray",5),roughness:.9,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),this.walkMat=this.mat({map:wh("red",3),roughness:.9,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3}),this.curbMat=this.mat({map:si("curb",8),roughness:.85}),this.zebraMat=this.mat({map:lf(),transparent:!0,roughness:.8,polygonOffset:!0,polygonOffsetFactor:-6,polygonOffsetUnits:-6,depthWrite:!1});let r=si("grass",2);this.groundMat=this.mat({map:r,vertexColors:!0,roughness:1});for(let o of Object.values(this.roadMats))o.map.anisotropy=n;return t(.1),this.buildBuildings(e.buildings,!0),t(.45),this.buildRoads(),t(.6),this.buildGround(),t(.7),this.buildFar(),t(.9),this}roadMat(t,e){return t.map.anisotropy=e,this.mat({map:t.map,roughnessMap:t.roughness,roughness:1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1})}buildBuildings(t,e){let n=this.arena,s=mi.map(()=>new ye),r=mi.map(()=>new ye),o=this.shopMats.map(()=>new ye),a=new ye,l=new ye,c=new ye,h=new ye,d=new ye,u=new ye,m=new ye(!0),g=n.roads.filter(y=>y.kind<=Ge.TERTIARY),x=(y,S)=>{for(let v of g){let b=v.pts;for(let E=0;E+3<b.length;E+=2){let R=b[E],_=b[E+1],T=b[E+2]-R,A=b[E+3]-_,I=T*T+A*A||1,P=Math.max(0,Math.min(1,((y-R)*T+(S-_)*A)/I));if(Math.hypot(R+T*P-y,_+A*P-S)<v.width/2+14)return!0}}return!1},f=this.q.balconies;for(let y of t){let S=Zy(y),v=y.pts,b=v.length/2;if(b<3)continue;let E=y.area,R=(y.kind===pe.HOUSE||y.roof===1||y.roof===2)&&y.height<9&&E<400,_=Math.max(1,y.levels),T=y.kind===pe.COMMERCIAL||e&&_>=3&&y.kind!==pe.SCHOOL&&y.kind!==pe.RELIGIOUS&&ii(y.id,5)%100<72&&x((y.minX+y.maxX)/2,(y.minZ+y.maxZ)/2),A=y.height<=3.5||y.kind===pe.SMALL,I=A?y.height:T?4:Tl,P=y.ground+I,N=y.top,L=ii(y.id,3)%4*.25,F=ii(y.id,9)%this.shopMats.length,H=0;for(let W=0;W<b;W++){let Q=(W+1)%b,q=v[W*2],K=v[W*2+1],j=v[Q*2],st=v[Q*2+1],at=j-q,$t=st-K,Pt=Math.hypot(at,$t);if(Pt<.05)continue;let kt=$t/Pt,$=-at/Pt;y.ccw||(kt=-kt,$=-$);let et=H,vt=H+Pt;H+=Pt;let Nt=$,yt=-kt,Ut=at*Nt+$t*yt<0,Zt=(Vt,Yt,Ft)=>[Vt,Ft,Yt],Bt=(Vt,Yt,Ft,Qt,he,Pe)=>{let te=et/Qt+L,ue=vt/Qt+L,O=(Yt-Pe)/he,ve=(Ft-Pe)/he;Ut?Vt.quad(Zt(j,st,Yt),Zt(q,K,Yt),Zt(q,K,Ft),Zt(j,st,Ft),[kt,0,$],[[ue,O],[te,O],[te,ve],[ue,ve]]):Vt.quad(Zt(q,K,Yt),Zt(j,st,Yt),Zt(j,st,Ft),Zt(q,K,Ft),[kt,0,$],[[te,O],[ue,O],[ue,ve],[te,ve]])};if(A?Bt(r[S],y.base,N,eo*4,4,y.ground):(T?Bt(o[F],y.base,P,eo*4,I,y.ground):Bt(r[S],y.base,P,eo*4,Tl,y.ground),Bt(s[S],P,N,eo*4,Tl*4,P)),R||Bt(a,N,N+(A?.3:.8),4,4,N),e&&f&&!A&&_>=3&&Pt>=7&&S!==6&&y.kind!==pe.SCHOOL){let Vt=Math.floor(Pt/eo),Yt=ii(y.id,21)%2,Ft=ii(y.id,23)%2===0,Qt=at/Pt,he=$t/Pt,Pe=0;for(let te=0;te<Vt&&Pe<4;te++){if((te+Yt)%2)continue;Pe++;let ue=(te+.5)*(Pt/Vt),O=q+Qt*ue+kt*.6,ve=K+he*ue+$*.6;for(let ee=1;ee<_;ee++){let C=P+(ee-1)*Tl;if(C+1.2>N)break;let M=-he*kt+Qt*$>0?1:-1;h.box(O,ve,Qt,he,1.4,.6,C-.12,C+.05,null,1,63^(M>0?2:1));let z=O+kt*.58,X=ve+$*.58,Z=Ft?d:u;Z.box(z,X,Qt,he,1.4,.025,C+.05,C+1.05,null,1,15);for(let rt of[-1,1])Z.box(O+Qt*rt*1.38,ve+he*rt*1.38,-he*M,Qt*M,.6,.025,C+.05,C+1.05,null,1,15)}}}}R?this.hipRoof(c,y):(this.roofCap(l,y,N+.02),e&&!A&&this.rooftop(m,y,N,_)),y.kind===pe.RELIGIOUS&&e&&this.mosque(y)}let p=(y,S,v=!0)=>{if(!y.count)return null;let b=new Ht(y.build(),S);return b.castShadow=v,b.receiveShadow=!0,b.matrixAutoUpdate=!1,this.group.add(b),b};s.forEach((y,S)=>p(y,this.facadeMats[S])),r.forEach((y,S)=>p(y,this.groundFloorMats[S])),o.forEach((y,S)=>p(y,this.shopMats[S])),p(a,this.parapetMat),p(l,this.roofMat,!1),p(c,this.tileMat),p(h,this.slabMat),p(d,this.glassRailMat,!1),p(u,this.metalRailMat),p(m,this.itemsMat)}roofCap(t,e,n){let s=e.pts,r=[];for(let l=0;l<s.length;l+=2)r.push(new Lt(s[l],s[l+1]));let o;try{o=Pr.triangulateShape(r,[])}catch{return}let a=t.count;for(let l of r)t.vert(l.x,n,l.y,0,1,0,l.x/4,l.y/4);for(let l of o){let c=r[l[0]],h=r[l[1]],d=r[l[2]];(h.x-c.x)*(d.y-c.y)-(h.y-c.y)*(d.x-c.x)<0?t.idx.push(a+l[0],a+l[1],a+l[2]):t.idx.push(a+l[0],a+l[2],a+l[1])}}hipRoof(t,e){let n=e.pts,s=n.length/2,r=0,o=1,a=0;for(let P=0;P<s;P++){let N=(P+1)%s,L=n[N*2]-n[P*2],F=n[N*2+1]-n[P*2+1],H=Math.hypot(L,F);H>r&&(r=H,o=L/H,a=F/H)}let l=-a,c=o,h=1/0,d=-1/0,u=1/0,m=-1/0;for(let P=0;P<s;P++){let N=n[P*2]*o+n[P*2+1]*a,L=n[P*2]*l+n[P*2+1]*c;h=Math.min(h,N),d=Math.max(d,N),u=Math.min(u,L),m=Math.max(m,L)}let g=.35;h-=g,d+=g,u-=g,m+=g;let x=m-u,f=Math.min(4,x*.38),p=e.top,y=e.top+f,S=Math.min((d-h)/2-.1,x/2),v=(P,N,L)=>[P*o+N*l,L,P*a+N*c],b=v(h,u,p),E=v(d,u,p),R=v(d,m,p),_=v(h,m,p),T=v(h+S,(u+m)/2,y),A=v(d-S,(u+m)/2,y),I=(P,N,L)=>{let F=[N[0]-P[0],N[1]-P[1],N[2]-P[2]],H=[L[0]-P[0],L[1]-P[1],L[2]-P[2]],W=F[1]*H[2]-F[2]*H[1],Q=F[2]*H[0]-F[0]*H[2],q=F[0]*H[1]-F[1]*H[0];Q<0&&([N,L]=[L,N],W=-W,Q=-Q,q=-q);let K=Math.hypot(W,Q,q)||1,j=t.count;for(let st of[P,N,L])t.vert(st[0],st[1],st[2],W/K,Q/K,q/K,(st[0]*o+st[2]*a)/2.5,(st[1]-p)/1.2+(st[0]*l+st[2]*c)/2.5);t.idx.push(j,j+1,j+2)};I(b,E,A),I(b,A,T),I(R,_,T),I(R,T,A),I(E,R,A),I(_,b,T)}rooftop(t,e,n,s){let r=(e.minX+e.maxX)/2,o=(e.minZ+e.maxZ)/2;if(!Oi(e.pts,r,o))return;let a=h=>ii(e.id,40+h)%1e3/1e3,l=Math.min(e.maxX-e.minX,e.maxZ-e.minZ);s>=5&&l>8&&t.box(r,o,1,0,1.6,1.4,n,n+2.6,[.86,.84,.8]);let c=Math.min(6,Math.floor(e.area/70));for(let h=0;h<c;h++){let d=r+(a(h)-.5)*(e.maxX-e.minX)*.6,u=o+(a(h+10)-.5)*(e.maxZ-e.minZ)*.6;if(!Oi(e.pts,d,u))continue;let m=a(30)*Math.PI,g=Math.cos(m),x=Math.sin(m);t.box(d,u,g,x,.95,.65,n+.4,n+1,[.12,.17,.3]),t.box(d-x*.75,u+g*.75,g,x,.95,.22,n+1,n+1.45,[.93,.93,.92]),t.box(d,u,g,x,.9,.6,n,n+.4,[.55,.55,.56],1,15)}a(50)<.6&&t.cylinder(r+l*.2,o-l*.15,.55,n,n+1.3,10,[.85,.85,.84]),a(51)<.5&&t.box(r-l*.25,o+l*.2,1,0,.45,.3,n,n+.6,[.9,.9,.9])}mosque(t){let e=(t.minX+t.maxX)/2,n=(t.minZ+t.maxZ)/2,s=Math.min(t.maxX-t.minX,t.maxZ-t.minZ)*.32;if(s<2)return;let r=this.mat({color:9279135,roughness:.4,metalness:.7}),o=this.mat({color:15921386,roughness:.7}),a=new Ht(new Lr(s,24,12,0,Math.PI*2,0,Math.PI/2),r);a.position.set(e,t.top+.6,n);let l=new Ht(new jn(s*1.02,s*1.02,1.2,24),o);l.position.set(e,t.top+.6,n);let c=t.maxX+2,h=t.minZ-1,d=this.arena.ground(c,h),u=Math.max(22,t.height*2.6),m=new Ht(new jn(.9,1.1,u,12),o);m.position.set(c,d+u/2,h);let g=new Ht(new jn(1.5,1.3,.6,12),o);g.position.set(c,d+u*.78,h);let x=new Ht(new Er(1,4.5,12),r);x.position.set(c,d+u+2.2,h);for(let f of[a,l,m,g,x])f.castShadow=!0,f.receiveShadow=!0,this.group.add(f);this.extraProps=this.extraProps||[],this.extraProps.push({type:"pole",x:c,z:h,r:1.1,y0:d,y1:d+u})}buildRoads(){let t=this.arena,e={4:new ye,2:new ye,1:new ye},n=new ye,s=new ye,r=new ye,o=new ye,a=t.roads.filter(x=>x.kind<=Ge.FOOTWAY&&x.kind!==Ge.RAIL),l=a.filter(x=>x.kind<=Ge.SERVICE),c=(x,f,p)=>{for(let y of l){if(y===p)continue;let S=y.pts;for(let v=0;v+3<S.length;v+=2){let b=S[v],E=S[v+1],R=S[v+2]-b,_=S[v+3]-E,T=R*R+_*_||1,A=Math.max(0,Math.min(1,((x-b)*R+(f-E)*_)/T));if(Math.hypot(b+R*A-x,E+_*A-f)<y.width/2+.25)return!0}}return!1},h=x=>x.kind<=Ge.SECONDARY||x.lanes>=4?4:x.kind<=Ge.RESIDENTIAL?2:1,d=(x,f)=>t.ground(x,f);for(let x of a){let f=Ky(x.pts,4),p=f.length/2;if(p<2)continue;let y=x.width/2,S=x.kind===Ge.FOOTWAY||x.kind===Ge.TRACK,v=S?n:e[h(x)],b=S?.06:.03+(10-x.kind)*.004,E=[];for(let T=0;T<p;T++){let A=Math.max(0,T-1),I=Math.min(p-1,T+1),P=f[I*2]-f[A*2],N=f[I*2+1]-f[A*2+1],L=Math.hypot(P,N)||1;E.push([-N/L,P/L])}let R=0,_=v.count;for(let T=0;T<p;T++){let A=f[T*2],I=f[T*2+1];T>0&&(R+=Math.hypot(A-f[T*2-2],I-f[T*2-1]));let[P,N]=E[T],L=A+P*y,F=I+N*y,H=A-P*y,W=I-N*y;v.vert(L,d(L,F)+b,F,0,1,0,R/6,1),v.vert(H,d(H,W)+b,W,0,1,0,R/6,0)}for(let T=0;T<p-1;T++){let A=_+T*2;v.idx.push(A,A+2,A+1,A+1,A+2,A+3)}if(x.kind<=Ge.RESIDENTIAL&&x.kind>=Ge.PRIMARY-1){let T=x.kind<=Ge.SECONDARY?3.4:2.4;for(let A=0;A<p-1;A++){let I=f[A*2],P=f[A*2+1],N=f[A*2+2],L=f[A*2+3];for(let F of[1,-1]){let[H,W]=E[A],[Q,q]=E[A+1],K=(I+N)/2+(H+Q)/2*F*(y+T/2),j=(P+L)/2+(W+q)/2*F*(y+T/2);if(c(K,j,x))continue;let st=[I+H*F*y,P+W*F*y],at=[N+Q*F*y,L+q*F*y],$t=[I+H*F*(y+T),P+W*F*(y+T)],Pt=[N+Q*F*(y+T),L+q*F*(y+T)],kt=.12,$=d(st[0],st[1])+kt,et=d(at[0],at[1])+kt,vt=d($t[0],$t[1])+kt,Nt=d(Pt[0],Pt[1])+kt,yt=Math.hypot(N-I,L-P),Ut=0,Zt=yt/2;F<0?s.quad([st[0],$,st[1]],[at[0],et,at[1]],[Pt[0],Nt,Pt[1]],[$t[0],vt,$t[1]],[0,1,0],[[Ut,0],[Zt,0],[Zt,T/2],[Ut,T/2]]):s.quad([st[0],$,st[1]],[$t[0],vt,$t[1]],[Pt[0],Nt,Pt[1]],[at[0],et,at[1]],[0,1,0],[[Ut,0],[Ut,T/2],[Zt,T/2],[Zt,0]]);let Bt=-H*F,Vt=-W*F,Yt=d(st[0],st[1])+.02,Ft=d(at[0],at[1])+.02;F>0?r.quad([at[0],Ft,at[1]],[st[0],Yt,st[1]],[st[0],$,st[1]],[at[0],et,at[1]],[Bt,0,Vt],[[Zt,0],[Ut,0],[Ut,.1],[Zt,.1]]):r.quad([st[0],Yt,st[1]],[at[0],Ft,at[1]],[at[0],et,at[1]],[st[0],$,st[1]],[Bt,0,Vt],[[Ut,0],[Zt,0],[Zt,.1],[Ut,.1]])}}}}let u=[];for(let x of t.points)x.kind===ch.CROSSING&&u.push([x.x,x.z]);let m=new Map;for(let x of l){if(x.kind>Ge.RESIDENTIAL)continue;let f=x.pts,p=f.length/2;for(let y=0;y<p;y++){let S=Math.round(f[y*2]*2)+","+Math.round(f[y*2+1]*2),v=m.get(S);v||m.set(S,v={x:f[y*2],z:f[y*2+1],arms:[]}),y>0&&v.arms.push({r:x,dx:f[y*2-2]-f[y*2],dz:f[y*2-1]-f[y*2+1]}),y<p-1&&v.arms.push({r:x,dx:f[y*2+2]-f[y*2],dz:f[y*2+3]-f[y*2+1]})}}for(let x of m.values()){if(x.arms.length<3||Math.abs(x.x)>t.half+20||Math.abs(x.z)>t.half+20)continue;let f=Math.max(...x.arms.map(p=>p.r.width));for(let p of x.arms){if(p.r.kind>Ge.TERTIARY&&f<10)continue;let y=Math.hypot(p.dx,p.dz);if(y<f/2+4)continue;let S=p.dx/y,v=p.dz/y,b=f/2+2.5;this.addZebra(o,x.x+S*b,x.z+v*b,S,v,p.r.width)}}for(let[x,f]of u){let p=null,y=1/0;for(let S of l){let v=S.pts;for(let b=0;b+3<v.length;b+=2){let E=v[b],R=v[b+1],_=v[b+2]-E,T=v[b+3]-R,A=_*_+T*T||1,I=Math.max(0,Math.min(1,((x-E)*_+(f-R)*T)/A)),P=Math.hypot(E+_*I-x,R+T*I-f);P<y&&(y=P,p={r:S,ux:_/Math.sqrt(A),uz:T/Math.sqrt(A)})}}p&&y<p.r.width/2+1&&this.addZebra(o,x,f,p.ux,p.uz,p.r.width)}let g=(x,f,p=!0)=>{if(!x.count)return;let y=new Ht(x.build(),f);y.receiveShadow=p,y.matrixAutoUpdate=!1,this.group.add(y)};for(let x of[1,2,4])g(e[x],this.roadMats[x]);g(n,this.footMat),g(s,this.walkMat),g(r,this.curbMat),g(o,this.zebraMat)}addZebra(t,e,n,s,r,o){let a=this.arena.ground(e,n)+.06,l=-r,c=s,h=o/2-.3,d=1.6,u=(g,x)=>[e+s*g+l*x,a,n+r*g+c*x],m=o/2.2;t.quad(u(-d,-h),u(-d,h),u(d,h),u(d,-h),[0,1,0],[[0,0],[m,0],[m,1],[0,1]])}buildGround(){let t=this.arena,e=t.half+60,n=this.q.groundStep,s=Math.ceil(e*2/n),r=new ye(!0),o=t.areas.map(h=>{let d=1/0,u=1/0,m=-1/0,g=-1/0;for(let x=0;x<h.pts.length;x+=2)d=Math.min(d,h.pts[x]),m=Math.max(m,h.pts[x]),u=Math.min(u,h.pts[x+1]),g=Math.max(g,h.pts[x+1]);return{...h,x0:d,z0:u,x1:m,z1:g}}).filter(h=>h.kind!==sn.RESIDENTIAL),a=(h,d)=>{let u=[.62,.58,.45];for(let m of o)if(!(h<m.x0||h>m.x1||d<m.z0||d>m.z1)&&Oi(m.pts,h,d))switch(m.kind){case sn.PARK:case sn.GRASS:case sn.PITCH:case sn.CEMETERY:u=[.5,.68,.32];break;case sn.FOREST:case sn.SCRUB:u=[.38,.52,.26];break;case sn.PARKING:case sn.COMMERCIAL:case sn.INDUSTRIAL:u=[.68,.67,.64];break;case sn.CONSTRUCTION:case sn.FARM:u=[.62,.52,.38];break;case sn.WATER:u=[.28,.42,.55];break;case sn.SCHOOL:u=[.58,.62,.42];break}return u};for(let h=0;h<=s;h++)for(let d=0;d<=s;d++){let u=-e+d*n,m=-e+h*n,g=a(u,m),x=.92+ii(d,h)%100/1e3;r.vert(u,t.ground(u,m),m,0,1,0,u/6,m/6,[g[0]*x,g[1]*x,g[2]*x])}for(let h=0;h<s;h++)for(let d=0;d<s;d++){let u=h*(s+1)+d,m=u+1,g=u+s+1,x=g+1;r.idx.push(u,g,m,m,g,x)}let l=r.build();l.computeVertexNormals();let c=new Ht(l,this.groundMat);c.receiveShadow=!0,c.matrixAutoUpdate=!1,this.group.add(c)}buildFar(){let t=this.arena,e=this.q.farRadius,n=new Set(t.buildings.map(l=>l.id)),s=this.index.query(t.cx-e,t.cz-e,t.cx+e,t.cz+e),r=[];for(let l of s.b){if(n.has(l))continue;let c=this.region.buildings[l],h=(c.minX+c.maxX)/2-t.cx,d=(c.minZ+c.maxZ)/2-t.cz;if(Math.hypot(h,d)>e||c.height<4&&Math.hypot(h,d)>e*.5)continue;let u=new Float32Array(c.pts.length);for(let x=0;x<u.length;x+=2)u[x]=c.pts[x]-t.cx,u[x+1]=c.pts[x+1]-t.cz;let m=0;for(let x=0;x<u.length;x+=2){let f=(x+2)%u.length;m+=u[x]*u[f+1]-u[f]*u[x+1]}let g=Zs(this.region,t.cx+h,t.cz+d)-t.baseElev;r.push({id:l,kind:c.kind,roof:c.roof,pts:u,base:g-1,ground:g,height:c.height,top:g+c.height,levels:Math.max(1,Math.round(c.height/3)),area:Math.abs(m)/2,ccw:m>0,minX:c.minX-t.cx,maxX:c.maxX-t.cx,minZ:c.minZ-t.cz,maxZ:c.maxZ-t.cz})}if(this.farCount=r.length,r.length&&this.buildBuildings(r,!1),this.region.hm){let h=new _n(20600,20600,128,128);h.rotateX(-Math.PI/2);let d=h.attributes.position,u=h.attributes.uv;for(let x=0;x<d.count;x++){let f=d.getX(x),p=d.getZ(x);d.setY(x,Zs(this.region,f,p)-t.baseElev-1.2),d.setX(x,f-t.cx),d.setZ(x,p-t.cz),u.setXY(x,(f+10300)/(10300*2),1-(p+10300)/(10300*2))}h.computeVertexNormals();let m=new Os({color:16777215});new Nr().load("data/backdrop.jpg",x=>{x.colorSpace=Be,m.map=x,m.needsUpdate=!0});let g=new Ht(h,m);this.bgGroup.add(g)}let a=this.makeMountain();this.bgGroup.add(a)}makeMountain(){let t=new _n(36e3,22e3,90,60);t.rotateX(-Math.PI/2);let e=t.attributes.position,n=[];for(let l=0;l<e.count;l++){let c=e.getX(l),h=e.getZ(l),d=Math.hypot(c/18e3,h/11e3),u=Math.max(0,1-d)**1.6,m=Math.sin(c*9e-4)*Math.cos(h*.0012)*.12+Math.sin(c*.0031+h*.002)*.06,g=Math.max(0,u*2350*(1+m)-80);e.setY(l,g);let x=g>1750?1:0;n.push(x?.95:.36+g/9e3,x?.96:.44+g/12e3,x?.98:.36+g/9e3)}t.setAttribute("color",new fe(n,3)),t.computeVertexNormals();let s=new Os({vertexColors:!0,fog:!0}),r=new Ht(t,s),o=(29.22-this.region.center.lon)*85e3,a=(this.region.center.lat-40.07)*111e3;return r.position.set(o-this.arena.cx,-this.arena.baseElev+100,a-this.arena.cz),r.rotation.y=.5,r}setNight(t){for(let e of[...this.facadeMats,...this.shopMats])e.emissive.setHex(t?16777215:0),e.emissiveIntensity=t?.9:0,e.needsUpdate=!0}dispose(){this.scene.remove(this.group),this.bgScene.remove(this.bgGroup);let t=e=>e.traverse(n=>{n.geometry&&n.geometry.dispose()});t(this.group),t(this.bgGroup);for(let e of this.materials){for(let n of["map","roughnessMap","emissiveMap"])e[n]&&e[n].dispose();e.dispose()}}};function Ky(i,t){let e=[i[0],i[1]];for(let n=0;n+3<i.length;n+=2){let s=i[n],r=i[n+1],o=i[n+2],a=i[n+3],l=Math.hypot(o-s,a-r),c=Math.max(1,Math.ceil(l/t));for(let h=1;h<=c;h++)e.push(s+(o-s)*h/c,r+(a-r)*h/c)}return e}var Ye=i=>{let t=new Ct(i);return[t.r,t.g,t.b]};function Gt(i,t,e,n,s,r,o,a){i.box(t,n,1,0,s/2,o/2,e-r/2,e+r/2,a)}function rn(i,t,e,n,s,r,o,a=8){let l=new ye(!0);l.cylinder(0,0,s,0,r,a,o);for(let h=0;h<l.pos.length;h+=3){let d=l.pos[h],u=l.pos[h+1],m=l.pos[h+2];l.pos[h]=t+d,l.pos[h+1]=e+m,l.pos[h+2]=n-u;let g=l.nrm[h],x=l.nrm[h+1],f=l.nrm[h+2];l.nrm[h]=g,l.nrm[h+1]=f,l.nrm[h+2]=-x}let c=i.count;i.pos.push(...l.pos),i.nrm.push(...l.nrm),i.uv.push(...l.uv),i.col.push(...l.col);for(let h of l.idx)i.idx.push(c+h)}var hn=Ye(2763567),fn=Ye(3882565),pn=Ye(5922406),Al=Ye(8014372),Jy=Ye(10126425),ff=Ye(4149811),jy=Ye(4871522),pf=Ye(12172996),Kb=Ye(13214282),Ah={ak(i){Gt(i,0,.03,-.12,.05,.07,.42,fn),Gt(i,0,0,.2,.045,.09,.3,Al),Gt(i,0,.035,-.42,.05,.05,.2,Al),rn(i,0,.05,-.52,.011,.32,pn),rn(i,0,.075,-.4,.008,.22,pn),Gt(i,0,.09,-.78,.01,.04,.012,pn);for(let t=0;t<4;t++)Gt(i,0,-.04-t*.045,-.12-t*.025,.035,.05,.06,fn);Gt(i,0,-.05,.02,.035,.1,.04,Al)},rifle_t(i){Ah.ak(i),Gt(i,0,0,.2,.05,.08,.3,Jy)},m4(i){Gt(i,0,.03,-.1,.05,.08,.38,hn),Gt(i,0,.02,.2,.05,.08,.26,fn),Gt(i,0,.035,-.4,.06,.06,.24,fn),rn(i,0,.04,-.52,.012,.18,pn),rn(i,0,.04,-.7,.02,.2,hn),Gt(i,0,.1,-.08,.035,.04,.16,hn),Gt(i,0,-.07,-.12,.035,.13,.06,hn),Gt(i,0,-.05,.02,.035,.1,.04,hn)},rifle_ct(i){Gt(i,0,.03,0,.055,.1,.62,jy),Gt(i,0,.11,-.05,.03,.05,.4,fn),rn(i,0,.04,-.3,.011,.25,pn),Gt(i,0,-.06,.12,.035,.1,.06,fn),Gt(i,0,-.06,-.08,.035,.1,.04,fn)},awp(i){Gt(i,0,.02,0,.06,.09,.9,ff),Gt(i,0,0,.42,.05,.13,.25,ff),rn(i,0,.04,-.45,.013,.55,pn),rn(i,0,.12,-.05,.022,.38,hn,10),Gt(i,0,.08,-.05,.02,.05,.06,hn),Gt(i,0,-.06,.02,.04,.08,.08,fn)},scout(i){Gt(i,0,.02,0,.05,.07,.75,fn),rn(i,0,.04,-.38,.011,.45,pn),rn(i,0,.11,-.05,.018,.32,hn,10),Gt(i,0,-.05,.05,.035,.08,.06,fn)},smg(i){Gt(i,0,.03,-.05,.05,.08,.3,hn),rn(i,0,.04,-.2,.012,.14,pn),Gt(i,0,-.08,-.05,.03,.14,.04,hn),Gt(i,0,.01,.16,.03,.03,.18,pn)},p90(i){Gt(i,0,.03,0,.06,.11,.48,fn),Gt(i,0,.1,-.05,.05,.03,.3,hn),rn(i,0,.04,-.24,.012,.08,pn)},shotgun(i){Gt(i,0,.03,-.05,.05,.08,.3,hn),Gt(i,0,0,.25,.045,.1,.28,fn),rn(i,0,.05,-.2,.014,.55,pn),rn(i,0,.02,-.2,.012,.45,fn),Gt(i,0,.015,-.38,.05,.05,.14,Al)},pistol(i){Gt(i,0,.04,-.06,.03,.035,.18,fn),Gt(i,0,-.02,0,.028,.1,.045,hn)},deagle(i){Gt(i,0,.045,-.07,.035,.045,.24,pf),Gt(i,0,-.025,0,.032,.11,.05,hn)},knife(i){Gt(i,0,0,.04,.025,.03,.11,hn),Gt(i,0,.005,-.1,.006,.035,.17,pf)},grenade(i){rn(i,0,0,.03,.032,.08,Ye(3885612),10),Gt(i,0,.04,0,.012,.02,.05,pn)},flash(i){rn(i,0,0,.04,.026,.1,Ye(9410204),10),Gt(i,0,.035,0,.012,.02,.05,pn)},smoke(i){rn(i,0,0,.04,.027,.11,Ye(5922918),10),Gt(i,0,.035,0,.012,.02,.05,pn)},bomb(i){Gt(i,0,0,0,.16,.06,.22,Ye(11770478)),Gt(i,0,.035,.02,.1,.012,.08,Ye(2829099)),Gt(i,.05,.036,-.06,.02,.01,.02,Ye(13378082))}},Eh=new Map;function ns(i){if(Eh.has(i))return Eh.get(i);let t=new ye(!0);(Ah[i]||Ah.pistol)(t);let e=t.build();return Eh.set(i,e),e}var no=new Ee({vertexColors:!0,roughness:.5,metalness:.3,envMapIntensity:1.2}),Rh={ak:-.84,rifle_t:-.84,m4:-.8,rifle_ct:-.55,awp:-1,scout:-.83,smg:-.34,p90:-.32,shotgun:-.75,pistol:-.15,deagle:-.2,knife:-.2,grenade:0,flash:0,smoke:0,bomb:0},Qy=13081210;function xf(i){let t=i==="T",e=new Ee({color:t?9075285:3095373,roughness:.9}),n=new Ee({color:t?5917234:1382687,roughness:.75}),s=new Ee({color:Qy,roughness:.7}),r=new Ee({color:1776413,roughness:.6}),o=new Ee({color:t?2763306:2831940,roughness:.5,metalness:.2}),a=(F,H,W,Q)=>{let q=new Ht(new ze(F,H,W),Q);return q.castShadow=!0,q},l=new Ce,c=new Ce;c.position.y=.95,l.add(c);let h=a(.34,.18,.22,e);c.add(h);let d=new Ce;d.position.y=.08,c.add(d);let u=a(.42,.5,.24,e);u.position.y=.3,d.add(u);let m=a(.46,.4,.3,n);m.position.y=.32,d.add(m);let g=a(.3,.34,.12,n);g.position.set(0,.34,.2),d.add(g);let x=new Ce;x.position.y=.6,d.add(x);let f=a(.22,.25,.24,t?r:s);if(f.position.y=.13,x.add(f),t){let F=a(.18,.05,.02,s);F.position.set(0,.16,-.121),x.add(F)}else{let F=a(.26,.12,.28,o);F.position.y=.27,x.add(F);let H=a(.2,.05,.03,r);H.position.set(0,.2,-.13),x.add(H)}let p=(F,H,W,Q,q,K)=>{let j=new Ce;j.position.set(H,W,0),F.add(j);let st=a(q,Q,q,K);return st.position.y=-Q/2,j.add(st),j},y=p(d,-.27,.52,.3,.11,e),S=p(d,.27,.52,.3,.11,e),v=p(y,0,-.3,.28,.1,e),b=p(S,0,-.3,.28,.1,e),E=a(.09,.09,.1,r);E.position.y=-.31,v.add(E);let R=a(.09,.09,.1,r);R.position.y=-.31,b.add(R);let _=p(c,-.1,-.05,.45,.15,e),T=p(c,.1,-.05,.45,.15,e),A=p(_,0,-.45,.45,.13,e),I=p(T,0,-.45,.45,.13,e),P=a(.14,.1,.26,r);P.position.set(0,-.46,-.04),A.add(P);let N=a(.14,.1,.26,r);N.position.set(0,-.46,-.04),I.add(N);let L=new Ht(ns("ak"),no);return L.castShadow=!0,L.position.set(.1,.3,-.35),d.add(L),S.rotation.set(-1.2,0,-.15),b.rotation.set(-.5,0,0),y.rotation.set(-1.35,0,.45),v.rotation.set(-.3,0,0),l.userData={hips:c,spine:d,neck:x,armL:y,armR:S,foreL:v,foreR:b,legL:_,legR:T,shinL:A,shinR:I,gun:L,model:"ak",phase:0,death:0},l}function yf(i,{speed:t,crouch:e,pitch:n,dt:s,alive:r,model:o}){let a=i.userData;if(a.model!==o){a.gun.geometry=ns(o),a.model=o;let d=o==="pistol"||o==="deagle"||o==="knife"||o==="grenade"||o==="flash"||o==="smoke"||o==="bomb";a.gun.position.set(d?.05:.1,d?.36:.3,d?-.45:-.35)}if(!r){a.death=Math.min(1,a.death+s*2.5),i.rotation.x=-a.death*Math.PI/2,i.position.y+=0;return}a.death=0,i.rotation.x=0,a.phase+=s*Math.min(9,t*1.6);let l=Math.min(1,t/4)*.65,c=Math.sin(a.phase)*l,h=e;a.hips.position.y=.95-h*.38+Math.abs(Math.cos(a.phase))*l*.04,a.legL.rotation.x=c-h*1.1,a.legR.rotation.x=-c-h*1.1,a.shinL.rotation.x=Math.max(0,-c)*.9+h*1.9,a.shinR.rotation.x=Math.max(0,c)*.9+h*1.9,a.spine.rotation.x=-n*.55+h*.25,a.neck.rotation.x=-n*.45}function tv(i,t){let e=[],n=r=>new Ee(r),s=(r,o,a={})=>{let l=new ye(!!a.vc);if(r(l),a.ad){let c=0,h=0;for(let d=0;d<l.uv.length;d+=2)c=Math.max(c,l.uv[d]),h=Math.max(h,l.uv[d+1]);for(let d=0;d<l.uv.length;d+=2)l.uv[d]/=c||1,l.uv[d+1]/=h||1}e.push({geo:l.build(),mat:o,...a})};switch(i){case"car":case"van":{let r=i==="van"?2.5:2.2,o=i==="van"?1:.9,a=i==="van"?2.1:1.45;s(l=>{l.box(0,0,1,0,r,o,.3,i==="van"?1.2:.85),i==="van"?l.box(-.2,0,1,0,r-.25,o-.02,1.2,a):l.box(-.15,0,1,0,r*.55,o-.08,.85,a)},n({color:16777215,roughness:.35,metalness:.6,envMapIntensity:1.2}),{tint:!0}),s(l=>{i==="van"?l.box(r-.27,0,1,0,.02,o-.1,1.25,a-.2):l.box(-.15,0,1,0,r*.55+.01,o-.07,.95,a-.08,null,1,15)},n({color:1911347,roughness:.05,metalness:.4,envMapIntensity:1.6})),s(l=>{for(let c of[-1,1])for(let h of[-1,1])l.box(c*(r-.6),h*(o-.05),1,0,.32,.1,.02,.62)},n({color:1315860,roughness:.9})),s(l=>{l.box(r+.005,.6*o,1,0,.01,.18,.62,.74),l.box(r+.005,-.6*o,1,0,.01,.18,.62,.74)},n({color:16777215,emissive:16774096,emissiveIntensity:.4}));break}case"tree":{s(c=>c.cylinder(0,0,.18,0,3.4,7),n({color:5915440,roughness:1}));let r=new Ir(1,1),o=r.attributes.position;for(let c=0;c<o.count;c++){let h=.85+c*7919%100/400;o.setXYZ(c,o.getX(c)*h,o.getY(c)*h*.9,o.getZ(c)*h)}r.computeVertexNormals();let a=[[0,4.6,0,2],[.9,4,.3,1.4],[-.8,4.2,-.4,1.5],[.1,5.6,.2,1.3]],l=new ye;for(let[c,h,d,u]of a){let m=l.count;for(let x=0;x<o.count;x++)l.vert(c+o.getX(x)*u,h+o.getY(x)*u,d+o.getZ(x)*u,r.attributes.normal.getX(x),r.attributes.normal.getY(x),r.attributes.normal.getZ(x),0,0);let g=r.index?r.index.array:[...Array(o.count).keys()];for(let x of g)l.idx.push(m+x)}e.push({geo:l.build(),mat:n({color:16777215,roughness:.95,flatShading:!0}),tint:"leaf"});break}case"lamp":{s(r=>{r.cylinder(0,0,.09,0,8.4,8),r.box(.9,0,1,0,.9,.05,8.25,8.35)},n({color:7304056,roughness:.5,metalness:.7})),s(r=>r.box(1.7,0,1,0,.35,.16,8.05,8.25),n({color:16777215,emissive:16769704,emissiveIntensity:.15}),{lamp:!0});break}case"signal":{s(r=>{r.cylinder(0,0,.07,0,4.2,8),r.box(0,-.15,1,0,.16,.12,2.9,3.9)},n({color:2763823,roughness:.5,metalness:.5})),s(r=>{r.box(0,-.28,1,0,.07,.01,3.65,3.78,Ye(16722458)),r.box(0,-.28,1,0,.07,.01,3.35,3.48,Ye(16756736)),r.box(0,-.28,1,0,.07,.01,3.05,3.18,Ye(2293589))},n({vertexColors:!0,emissive:16777215,emissiveIntensity:.6}),{vc:!0});break}case"dumpster":s(r=>{r.box(0,0,1,0,.9,.6,.25,1.25),r.box(0,0,1,0,.95,.65,1.25,1.32)},n({map:t.container,color:9413536,roughness:.7,metalness:.4}),{tint:"dump"}),s(r=>{for(let o of[-1,1])for(let a of[-1,1])r.cylinder(o*.7,a*.45,.1,0,.25,6)},n({color:1118481}));break;case"billboard":s(r=>{for(let o of[-1,1])r.cylinder(o*2.6,0,.16,0,3.4,8);r.box(0,0,1,0,3.05,.22,3.2,6.25)},n({color:3816770,roughness:.5,metalness:.6})),s(r=>{r.box(0,0,1,0,2.95,.24,3.3,6.15,null,1,3)},null,{ad:!0});break;case"adpanel":s(r=>{r.box(0,0,1,0,.78,.18,0,2.7,null,1,60),r.box(0,0,1,0,.6,.1,-.02,.3)},n({color:9409690,roughness:.4,metalness:.7})),s(r=>r.box(0,0,1,0,.72,.19,.4,2.6,null,1,3),null,{ad:!0});break;case"busstop":s(r=>{r.box(0,-.9,1,0,2,.05,2.45,2.55);for(let o of[-1,1])r.box(o*1.95,0,1,0,.05,.05,0,2.5);r.box(0,.1,1,0,1.6,.2,.42,.48)},n({color:7172726,roughness:.4,metalness:.7})),s(r=>r.box(0,0,1,0,1.95,.03,.1,2.4,null,1,3),n({color:11061464,transparent:!0,opacity:.35,roughness:.05,depthWrite:!1})),s(r=>r.box(2.05,0,1,0,.05,.6,.3,2.3,null,1,12),null,{ad:!0,side:!0});break;case"crate":s(r=>r.box(0,0,1,0,.6,.6,0,1.2,null,.85),n({map:t.wood,roughness:.9}),{stretchY:!0});break;case"sandbag":s(r=>r.box(0,0,1,0,1.3,.45,0,.95,null,.8),n({map:t.sandbag,roughness:1}));break;case"barrier":{s(r=>{r.box(0,0,1,0,1,.3,0,.25),r.box(0,0,1,0,1,.15,.25,.85)},n({color:15263456,roughness:.85})),s(r=>r.box(0,0,1,0,1.005,.155,.5,.65,null,1,15),n({color:12986408,roughness:.7}));break}case"kiosk":s(r=>{r.box(0,0,1,0,1.6,1.2,0,2.5)},n({color:14078148,roughness:.8})),s(r=>r.box(0,0,1,0,1.75,1.35,2.5,2.75),n({color:12986408,roughness:.6})),s(r=>r.box(0,0,1,0,1.61,1.21,.9,2.2,null,1,3),null,{ad:!0});break;case"bench":s(r=>{r.box(0,0,1,0,.9,.22,.4,.45),r.box(0,.2,1,0,.9,.03,.45,.85);for(let o of[-1,1])r.box(o*.75,0,1,0,.04,.2,0,.4)},n({map:t.wood,roughness:.9}));break;case"pole":break}return e}var mf=[15921906,1710618,10331048,12000284,16172032,1985423,5922659,15525590],gf=[5205551,6060852,4613163,7047740],Rl=class{constructor(t,e,n){this.group=new Ce,t.add(this.group),this.tex={wood:si("wood",7),sandbag:si("sandbag",8),container:si("container",9)},this.ads=[0,1,2].map(h=>cf(h)),this.adMats=this.ads.map(h=>new Ee({map:h,emissive:16777215,emissiveMap:h,emissiveIntensity:.25,roughness:.5})),this.lampMats=[];let s=new Map;for(let h of e)s.has(h.type)||s.set(h.type,[]),s.get(h.type).push(h);let r=new ie,o=new ln,a=new U,l=new U,c=new U(0,1,0);for(let[h,d]of s){let u=tv(h,this.tex);for(let m of u)(m.ad?[0,1,2].map(x=>d.filter(f=>(f.v||0)%3===x)):[d]).forEach((x,f)=>{if(!x.length)return;let p=m.ad?this.adMats[f]:m.mat;m.lamp&&this.lampMats.push(p);let y=new Yi(m.geo,p,x.length);y.castShadow=!m.ad&&h!=="tree"?!0:h==="tree",y.receiveShadow=!0,x.forEach((S,v)=>{o.setFromAxisAngle(c,-(S.a||0));let b=m.stretchY?(S.y1-S.y0)/1.2:1;a.set(1,b,1),l.set(S.x,S.y0,S.z),r.compose(l,o,a),y.setMatrixAt(v,r),m.tint===!0?y.setColorAt(v,new Ct(mf[(S.v||0)%mf.length])):m.tint==="leaf"?y.setColorAt(v,new Ct(gf[(S.v||0)%gf.length])):m.tint==="dump"&&y.setColorAt(v,new Ct((S.v||0)%2?9413536:5077586))}),y.instanceMatrix.needsUpdate=!0,y.instanceColor&&(y.instanceColor.needsUpdate=!0),y.computeBoundingSphere(),this.group.add(y)})}}setNight(t){for(let e of this.lampMats)e.emissiveIntensity=t?3:.15;for(let e of this.adMats)e.emissiveIntensity=t?.9:.25}dispose(t){t.remove(this.group),this.group.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose&&e.material.dispose()})}};var Cl=class{constructor(t,e){this.scene=t,this.q=e,this.t=0;let n=hf();this.decalMax=e.decals,this.decals=new Yi(new _n(.11,.11),new Ee({map:n,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-4,polygonOffsetUnits:-4,roughness:1}),this.decalMax),this.decals.count=0,this.decals.frustumCulled=!1,this.decalIdx=0,t.add(this.decals),this.scorchTex=uf(),this.spark=this.makeParticles(400,Sl("255,210,120"),ti,.12),this.dust=this.makeParticles(500,Sl("200,190,175"),Ii,.35),this.muzzleTex=wl(),this.flashes=[];for(let o=0;o<12;o++){let a=new Tn(new vn({map:this.muzzleTex,blending:ti,depthWrite:!1,transparent:!0}));a.visible=!1,t.add(a),this.flashes.push({s:a,life:0})}this.light=new Zi(16760944,0,9,2),t.add(this.light),this.lightLife=0,this.tracers=[];let s=new ze(.018,.018,1);s.translate(0,0,-.5);let r=new Bn({color:16771488,transparent:!0,opacity:.8,blending:ti,depthWrite:!1});for(let o=0;o<24;o++){let a=new Ht(s,r.clone());a.visible=!1,t.add(a),this.tracers.push({m:a,life:0})}this.softTex=Sl("255,255,255"),this.booms=[],this.smokes=[],this.scorches=[]}makeParticles(t,e,n,s){let r=new ke,o=new Float32Array(t*3),a=new Float32Array(t*3);r.setAttribute("position",new $e(o,3)),r.setAttribute("color",new $e(a,3));let l=new Us({size:s,map:e,vertexColors:!0,transparent:!0,depthWrite:!1,blending:n,sizeAttenuation:!0}),c=new br(r,l);return c.frustumCulled=!1,this.scene.add(c),{pts:c,pos:o,col:a,vel:new Float32Array(t*3),life:new Float32Array(t),base:new Float32Array(t*3),n:t,next:0,grav:0}}emit(t,e,n,s,r,o,a,l,c,h,d){let u=t.next;t.next=(t.next+1)%t.n,t.pos[u*3]=e,t.pos[u*3+1]=n,t.pos[u*3+2]=s,t.vel[u*3]=r,t.vel[u*3+1]=o,t.vel[u*3+2]=a,t.life[u]=l,t.base[u*3]=c,t.base[u*3+1]=h,t.base[u*3+2]=d}muzzle(t,e=1,n=!0){let s=this.flashes.find(r=>r.life<=0)||this.flashes[0];s.s.position.copy(t),s.s.scale.setScalar(.35*e),s.s.material.rotation=Math.random()*Math.PI,s.s.visible=!0,s.life=.045,n&&(this.light.position.copy(t),this.light.intensity=6*e,this.lightLife=.05)}tracer(t,e){let n=t.distanceTo(e);if(n<2)return;let s=this.tracers.find(r=>r.life<=0)||this.tracers[0];s.m.position.copy(t),s.m.lookAt(e),s.m.scale.set(1,1,Math.min(n,60)),s.m.visible=!0,s.m.material.opacity=.75,s.life=.07}impact(t,e,n){if(n!=="player"){let o=new ie,a=new ln().setFromUnitVectors(new U(0,0,1),e),l=new ln().setFromAxisAngle(e,Math.random()*6.28);a.premultiply(l);let c=.8+Math.random()*.5;o.compose(t.clone().addScaledVector(e,.01),a,new U(c,c,c)),this.decals.setMatrixAt(this.decalIdx,o),this.decalIdx=(this.decalIdx+1)%this.decalMax,this.decals.count=Math.max(this.decals.count,this.decalIdx===0?this.decalMax:this.decalIdx),this.decals.instanceMatrix.needsUpdate=!0}let r=n==="prop"?7:3;for(let o=0;o<r;o++)this.emit(this.spark,t.x,t.y,t.z,e.x*3+(Math.random()-.5)*5,e.y*3+Math.random()*4,e.z*3+(Math.random()-.5)*5,.15+Math.random()*.2,1,.8,.5);for(let o=0;o<6;o++)this.emit(this.dust,t.x,t.y,t.z,e.x*1.2+(Math.random()-.5)*1.2,e.y*1.2+Math.random()*1.2,e.z*1.2+(Math.random()-.5)*1.2,.5+Math.random()*.5,.75,.72,.66)}blood(t,e){for(let n=0;n<(e?18:10);n++)this.emit(this.dust,t.x,t.y,t.z,(Math.random()-.5)*2.5,Math.random()*2,(Math.random()-.5)*2.5,.4+Math.random()*.4,.55,.04,.03)}explosion(t,e){let n=new Tn(new vn({map:this.softTex,color:16756816,blending:ti,depthWrite:!1,transparent:!0}));n.position.copy(t),n.position.y+=.6,n.scale.setScalar(1),this.scene.add(n),this.booms.push({s:n,life:.6,max:.6}),this.light.position.copy(t),this.light.position.y+=1,this.light.intensity=60,this.light.distance=30,this.lightLife=.25;for(let r=0;r<60;r++){let o=Math.random()*6.28,a=4+Math.random()*10;this.emit(this.spark,t.x,t.y+.3,t.z,Math.cos(o)*a,Math.random()*8,Math.sin(o)*a,.4+Math.random()*.5,1,.7,.3)}for(let r=0;r<60;r++){let o=Math.random()*6.28,a=1+Math.random()*4;this.emit(this.dust,t.x,t.y+.5,t.z,Math.cos(o)*a,Math.random()*4,Math.sin(o)*a,1.2+Math.random(),.25,.23,.22)}let s=new Ht(new _n(4,4),new Bn({map:this.scorchTex,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-5,polygonOffsetUnits:-5}));if(s.rotation.x=-Math.PI/2,s.position.set(t.x,t.y+.06,t.z),this.scene.add(s),this.scorches.push(s),this.scorches.length>8){let r=this.scorches.shift();this.scene.remove(r),r.geometry.dispose(),r.material.dispose()}e?.(Math.max(0,1))}smoke(t,e=18){let n=new Ce,s=[],r=this.q.smokeParts;for(let o=0;o<r;o++){let a=new Tn(new vn({map:this.softTex,color:13224390,transparent:!0,depthWrite:!1,opacity:0})),l=Math.random()*6.28,c=Math.random()*4;a.userData={tx:Math.cos(l)*c,ty:.6+Math.random()*2.6,tz:Math.sin(l)*c,size:3.2+Math.random()*2.5,rot:(Math.random()-.5)*.3},n.add(a),s.push(a)}n.position.copy(t),this.scene.add(n),this.smokes.push({group:n,parts:s,t:0,dur:e})}clearRound(){for(let t of this.smokes)this.scene.remove(t.group),t.parts.forEach(e=>e.material.dispose());this.smokes=[]}update(t,e){this.t+=t;for(let n of this.flashes)n.life>0&&(n.life-=t,n.life<=0&&(n.s.visible=!1));this.lightLife>0&&(this.lightLife-=t,this.lightLife<=0?(this.light.intensity=0,this.light.distance=9):this.light.intensity*=.82);for(let n of this.tracers)n.life>0&&(n.life-=t,n.m.material.opacity=Math.max(0,n.life/.07)*.75,n.life<=0&&(n.m.visible=!1));for(let n of[this.spark,this.dust]){let s=n===this.spark?12:.6;for(let r=0;r<n.n;r++){if(n.life[r]<=0){n.col[r*3]=n.col[r*3+1]=n.col[r*3+2]=0,n.pos[r*3+1]=-9999;continue}n.life[r]-=t,n.vel[r*3+1]-=s*t,n.pos[r*3]+=n.vel[r*3]*t,n.pos[r*3+1]+=n.vel[r*3+1]*t,n.pos[r*3+2]+=n.vel[r*3+2]*t;let o=Math.min(1,n.life[r]*3);n.col[r*3]=n.base[r*3]*o,n.col[r*3+1]=n.base[r*3+1]*o,n.col[r*3+2]=n.base[r*3+2]*o}n.pts.geometry.attributes.position.needsUpdate=!0,n.pts.geometry.attributes.color.needsUpdate=!0}for(let n of[...this.booms]){n.life-=t;let s=1-n.life/n.max;n.s.scale.setScalar(2+s*9),n.s.material.opacity=Math.max(0,1-s),n.life<=0&&(this.scene.remove(n.s),n.s.material.dispose(),this.booms.splice(this.booms.indexOf(n),1))}for(let n of[...this.smokes]){n.t+=t;let s=Math.min(1,n.t/2.5),r=n.t>n.dur-3?Math.max(0,(n.dur-n.t)/3):1;for(let o of n.parts){let a=o.userData;o.position.set(a.tx*s,a.ty*(.4+s*.6)+Math.sin(this.t*.3+a.tx)*.1,a.tz*s),o.scale.setScalar(a.size*(.4+s*.6)),o.material.opacity=.92*Math.min(1,n.t*2)*r,o.material.rotation+=a.rot*t}n.t>=n.dur&&(this.scene.remove(n.group),n.parts.forEach(o=>o.material.dispose()),this.smokes.splice(this.smokes.indexOf(n),1))}}};var Pl=class{constructor(){this.scene=new fi,this.camera=new De(58,1,.01,10),this.scene.add(new Ri(14674160,4866616,1.4));let t=new Ci(16773853,1.6);t.position.set(.5,1,.3),this.scene.add(t),this.root=new Ce,this.scene.add(this.root),this.gun=new Ht(ns("pistol"),no),this.root.add(this.gun),this.sleeve=new Ee({color:9075285,roughness:.9});let e=new Ee({color:3814961,roughness:.8}),n=(s,r)=>{let o=new ze(s,s,r);return o.translate(0,0,r/2),new Ht(o,this.sleeve)};this.armR=n(.06,.34),this.armL=n(.055,.34),this.handR=new Ht(new ze(.07,.08,.09),e),this.handL=new Ht(new ze(.065,.075,.09),e),this.root.add(this.armR,this.armL,this.handR,this.handL),this.flash=new Tn(new vn({map:wl(),blending:ti,depthWrite:!1,transparent:!0})),this.flash.visible=!1,this.root.add(this.flash),this.model="pistol",this.kick=0,this.draw=1,this.reload=0,this.reloadDur=1,this.bob=0,this.sway=new Lt,this.flashT=0,this.slash=0,this.visible=!0}setTeam(t){this.sleeve.color.setHex(t==="CT"?3095373:9075285)}setWeapon(t){if(t===this.model&&this.draw>=1&&this.base)return;this.model=t,this.gun.geometry=ns(t),this.draw=0,this.reload=0;let e=["pistol","deagle"].includes(t),n=["knife","grenade","flash","smoke","bomb"].includes(t);this.base=n?new U(.14,-.13,-.34):e?new U(.12,-.115,-.33):new U(.12,-.125,-.3),this.twoHand=!n||t==="bomb",this.flash.position.set(0,.045,Rh[t]??-.4)}fire(t=1){this.kick=Math.min(1.5,this.kick+.6*t),this.flashT=.05,this.flash.material.rotation=Math.random()*6}startReload(t){this.reload=1e-4,this.reloadDur=t}knifeSwing(){this.slash=1}update(t,{speed:e,onGround:n,lookDX:s,lookDY:r,scoped:o,aspect:a}){this.camera.aspect=a,this.camera.updateProjectionMatrix(),this.root.visible=this.visible&&!o,this.base||this.setWeapon(this.model),this.draw=Math.min(1,this.draw+t*3.2),this.kick=Math.max(0,this.kick-t*9),this.bob+=t*(n?Math.min(10,e*1.8):0),this.sway.x+=(-s*2-this.sway.x)*Math.min(1,t*10),this.sway.y+=(-r*2-this.sway.y)*Math.min(1,t*10),this.slash=Math.max(0,this.slash-t*4);let l=0,c=0;if(this.reload>0){this.reload+=t;let x=Math.min(1,this.reload/this.reloadDur),f=Math.sin(x*Math.PI);l-=f*.6,c+=f*.3,x>=1&&(this.reload=0)}let h=Math.min(1,e/5),d=Math.sin(this.bob)*.012*h,u=Math.abs(Math.cos(this.bob))*.012*h,m=1-this.draw;this.gun.position.set(this.base.x+d+this.sway.x*.02,this.base.y-u-m*.25+this.sway.y*.02+(this.reload>0?-.05:0),this.base.z+this.kick*.045),this.gun.rotation.set(this.kick*.12+l+m*-.8+this.slash*-.9,c+this.slash*.8,this.slash*.6);let g=this.gun.position;this.handR.position.set(g.x+.005,g.y-.045,g.z+.03),this.armR.position.set(g.x+.01,g.y-.07,g.z+.06),this.armR.rotation.set(.55,.25,0),this.handL.visible=this.armL.visible=this.twoHand,this.handL.position.set(g.x-.01,g.y-.02,g.z-.2),this.armL.position.set(g.x-.03,g.y-.05,g.z-.17),this.armL.rotation.set(.45,-.75,0),this.flash.position.set(g.x,g.y+.045,g.z+(Rh[this.model]??-.4)),this.flashT-=t,this.flash.visible=this.flashT>0,this.flash.scale.setScalar(.16+Math.random()*.05)}render(t){this.root.visible&&(t.clearDepth(),t.render(this.scene,this.camera))}};var bn=i=>document.getElementById(i),Il=class{constructor(t,e,n){this.canvas=t,this.settings=e,this.isTouch=n,this.keys=new Set,this.events=[],this.look=[0,0],this.fire=!1,this.alt=!1,this.joy={x:0,y:0,id:null},this.touchLook=null,this.btn={},this.enabled=!0,this.bindings={KeyR:"reload",Digit1:"slot1",Digit2:"slot2",Digit3:"slot3",Digit4:"slot4",Digit5:"slot5",KeyQ:"last",KeyG:"drop",KeyB:"buy",KeyY:"chat",KeyU:"teamchat",KeyM:"team",Escape:"menu",KeyF:"inspect"},this.h={kd:s=>this.onKey(s,!0),ku:s=>this.onKey(s,!1),md:s=>this.onMouse(s,!0),mu:s=>this.onMouse(s,!1),mm:s=>{if(document.pointerLockElement===this.canvas){let r=.0022*this.settings.sensitivity;this.look[0]+=s.movementX*r,this.look[1]+=s.movementY*r*(this.settings.invertY?-1:1)}},wheel:s=>{document.pointerLockElement===this.canvas&&this.events.push(s.deltaY>0?"next":"prev")},ctx:s=>s.preventDefault(),blur:()=>this.release(),plc:()=>{!this.isTouch&&!document.pointerLockElement&&this.enabled&&!this.selfUnlock&&this.onLockLost&&this.onLockLost(),this.selfUnlock=!1}},document.addEventListener("pointerlockchange",this.h.plc),window.addEventListener("keydown",this.h.kd),window.addEventListener("keyup",this.h.ku),t.addEventListener("mousedown",this.h.md),window.addEventListener("mouseup",this.h.mu),document.addEventListener("mousemove",this.h.mm),window.addEventListener("wheel",this.h.wheel,{passive:!0}),t.addEventListener("contextmenu",this.h.ctx),window.addEventListener("blur",this.h.blur),n&&this.setupTouch()}get locked(){return document.pointerLockElement===this.canvas}lock(){if(!this.isTouch)try{let t=this.canvas.requestPointerLock?.();t?.catch&&t.catch(()=>{})}catch{}}unlock(){document.pointerLockElement&&(this.selfUnlock=!0,document.exitPointerLock())}onKey(t,e){if(!this.enabled||t.target&&(t.target.tagName==="INPUT"||t.target.tagName==="TEXTAREA"))return;let n=t.code;e?(!this.keys.has(n)&&this.bindings[n]&&this.events.push(this.bindings[n]),n==="Tab"&&this.events.push("scoreOn"),this.keys.add(n)):(this.keys.delete(n),n==="Tab"&&this.events.push("scoreOff")),["Tab","Space","ControlLeft","KeyB","Escape"].includes(n)&&t.preventDefault()}onMouse(t,e){if(this.enabled){if(e&&!this.locked&&!this.isTouch){this.lock();return}t.button===0&&(this.fire=e),t.button===2&&(this.alt=e,e&&this.events.push("alt"))}}state(){let t=this.keys,e=0,n=0;return(t.has("KeyW")||t.has("ArrowUp"))&&(e+=1),(t.has("KeyS")||t.has("ArrowDown"))&&(e-=1),(t.has("KeyD")||t.has("ArrowRight"))&&(n+=1),(t.has("KeyA")||t.has("ArrowLeft"))&&(n-=1),this.joy.id!==null&&(e-=this.joy.y,n+=this.joy.x),{fwd:e,side:n,jump:t.has("Space")||!!this.btn.jump,crouch:t.has("ControlLeft")||t.has("KeyC")||!!this.btn.crouch,walk:t.has("ShiftLeft")||this.joy.id!==null&&Math.hypot(this.joy.x,this.joy.y)<.55&&Math.hypot(this.joy.x,this.joy.y)>.05&&!1,fire:this.fire||!!this.btn.fire,use:t.has("KeyE")||!!this.btn.use}}consumeEvents(){let t=this.events;return this.events=[],t}consumeLook(){let t=this.look;return this.look=[0,0],t}release(){this.keys.clear(),this.fire=!1,this.alt=!1,this.btn={},this.joy={x:0,y:0,id:null},this.touchLook=null,bn("joy-knob")&&bn("joy-base").classList.remove("on")}setupTouch(){let t=bn("touch-area");t.classList.remove("hidden");let e=()=>.0058*this.settings.touchSens;this.th={down:a=>{if(this.enabled)if(a.preventDefault(),a.clientX<window.innerWidth*.4&&this.joy.id===null){this.joy={x:0,y:0,id:a.pointerId,ox:a.clientX,oy:a.clientY};let l=bn("joy-base");l.style.left=a.clientX+"px",l.style.top=a.clientY+"px",l.classList.add("on"),bn("joy-knob").style.transform="translate(-50%,-50%)"}else this.touchLook||(this.touchLook={id:a.pointerId,x:a.clientX,y:a.clientY})},move:a=>{if(this.joy.id===a.pointerId){let c=a.clientX-this.joy.ox,h=a.clientY-this.joy.oy,d=Math.hypot(c,h);d>55&&(c*=55/d,h*=55/d),this.joy.x=c/55,this.joy.y=h/55,bn("joy-knob").style.transform=`translate(calc(-50% + ${c}px), calc(-50% + ${h}px))`}else this.touchLook&&this.touchLook.id===a.pointerId&&(this.look[0]+=(a.clientX-this.touchLook.x)*e(),this.look[1]+=(a.clientY-this.touchLook.y)*e()*(this.settings.invertY?-1:1),this.touchLook.x=a.clientX,this.touchLook.y=a.clientY)},up:a=>{this.joy.id===a.pointerId&&(this.joy={x:0,y:0,id:null},bn("joy-base").classList.remove("on")),this.touchLook&&this.touchLook.id===a.pointerId&&(this.touchLook=null)}},t.addEventListener("pointerdown",this.th.down),window.addEventListener("pointermove",this.th.move),window.addEventListener("pointerup",this.th.up),window.addEventListener("pointercancel",this.th.up);let n=(a,l,c=!1)=>{let h=bn(a),d=null;h.onpointerdown=m=>{m.preventDefault(),m.stopPropagation();try{h.setPointerCapture(m.pointerId)}catch{}this.btn[l]=!0,h.classList.add("down"),d={x:m.clientX,y:m.clientY}},h.onpointermove=m=>{!c||!this.btn[l]||!d||(this.look[0]+=(m.clientX-d.x)*e(),this.look[1]+=(m.clientY-d.y)*e(),d={x:m.clientX,y:m.clientY})};let u=()=>{this.btn[l]=!1,h.classList.remove("down"),d=null};h.onpointerup=u,h.onpointercancel=u,h.onlostpointercapture=u};n("btn-fire","fire",!0),n("btn-fire2","fire",!0),n("btn-jump","jump"),n("btn-use","use");let s=bn("btn-crouch");s.onpointerdown=a=>{a.preventDefault(),a.stopPropagation(),this.btn.crouch=!this.btn.crouch,s.classList.toggle("down",this.btn.crouch)};let r=(a,l)=>{let c=bn(a);c.onpointerdown=h=>{h.preventDefault(),h.stopPropagation(),this.events.push(l)}};r("btn-reload","reload"),r("btn-scope","alt"),r("btn-buy","buy"),r("btn-menu","menu");let o=bn("btn-score");o.onpointerdown=a=>{a.preventDefault(),a.stopPropagation(),this.events.push("scoreOn")},o.onpointerup=()=>this.events.push("scoreOff")}destroy(){window.removeEventListener("keydown",this.h.kd),window.removeEventListener("keyup",this.h.ku),this.canvas.removeEventListener("mousedown",this.h.md),window.removeEventListener("mouseup",this.h.mu),document.removeEventListener("mousemove",this.h.mm),window.removeEventListener("wheel",this.h.wheel),this.canvas.removeEventListener("contextmenu",this.h.ctx),window.removeEventListener("blur",this.h.blur),document.removeEventListener("pointerlockchange",this.h.plc),this.th&&(bn("touch-area").removeEventListener("pointerdown",this.th.down),window.removeEventListener("pointermove",this.th.move),window.removeEventListener("pointerup",this.th.up),window.removeEventListener("pointercancel",this.th.up),bn("touch-area").classList.add("hidden")),this.unlock()}};Ks();var le=i=>document.getElementById(i),mn=i=>String(i??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),Ll=class{constructor(t){this.g=t,this.root=le("hud"),this.root.classList.remove("hidden"),document.body.classList.toggle("touch",t.isTouch),this.feed=le("killfeed"),this.msg=le("centermsg"),this.chatLog=le("chatlog"),this.radar=le("radar"),this.rctx=this.radar.getContext("2d"),this.msgTimer=0,this.prepRadar(),le("crosshair").style.setProperty("--cc",t.app.settings.crosshair),this.buildBuyMenu(),this.lastVals={}}set(t,e){this.lastVals[t]!==e&&(this.lastVals[t]=e,le(t).innerHTML=e)}update(t){let e=this.g,n=e.me;this.set("hp",`<b>${Math.max(0,n.hp|0)}</b>`),this.set("ar",`<b>${n.armor|0}</b>${n.helmet?"<i>\u26D1</i>":""}`),le("vitals").classList.toggle("low",n.hp<=25&&n.alive);let s=Se[n.weapon],r=n.ammo[n.weapon],o="";s&&!s.melee&&s.slot!==ae.GRENADE&&s.slot!==ae.BOMB&&r?o=`<b>${r.mag}</b><span>/ ${r.res}</span>`:s&&s.slot===ae.GRENADE&&(o=`<b>${n.inv[n.weapon]||0}</b>`),this.set("ammo",o),this.set("wname",s?Te(s.name):"");let a=e.settings.mode==="bomb";this.set("money",a?`$${n.money}`:"");let l=Math.max(0,e.timeLeft),c=Math.floor(l/60),h=Math.floor(l%60);if(this.set("timer",`${c}:${String(h).padStart(2,"0")}`),le("timer").classList.toggle("bomb",!!(e.bomb&&e.bomb[0]==="planted")),Ne[e.settings.mode].teams)this.set("score",`<span class="t">${e.score.T??0}</span><span class="ct">${e.score.CT??0}</span>`);else{let f=[...e.roster.values()].sort((p,y)=>y.kills-p.kills)[0];this.set("score",f?`<span class="ffa">${mn(f.name)} \xB7 ${f.kills}</span>`:"")}if(e.settings.mode==="bomb"){let f=0,p=0;for(let y of e.players.values())y.alive&&(y.team==="T"?f++:y.team==="CT"&&p++);n.alive&&(n.team==="T"?f++:n.team==="CT"&&p++),this.set("alive",`<span class="t">${f}</span> ${ot("alive")} <span class="ct">${p}</span>`)}else this.set("alive",e.settings.mode==="gungame"?`${ot("round")} ${n.gg+1}/14`:"");let u=e.progress||0;le("progress").classList.toggle("hidden",u<=0),le("progress-fill").style.width=Math.round(u*100)+"%";let m="";n.alive&&e.inBuyZone()&&(m=ot("buyZone")+(e.isTouch?" ($)":" \u2014 [B]")),n.alive&&n.inv.bomb&&e.inSite()&&(m=`${ot("plant")}: [E] ${ot("holdUse")}`),n.alive&&n.team==="CT"&&e.nearBomb()&&(m=`${ot("defuse")}: [E] ${ot("holdUse")}`),this.set("hint",e.isTouch?m.replace(/\[E\]/g,"(E)"):m),le("btn-buy").classList.toggle("hidden",!(e.isTouch&&n.alive&&(e.inBuyZone()||e.settings.mode==="tdm"||e.settings.mode==="dm"))),le("btn-use").classList.toggle("hidden",!(e.isTouch&&n.alive&&(n.inv.bomb&&e.inSite()||n.team==="CT"&&e.nearBomb()))),le("btn-scope").classList.toggle("hidden",!(e.isTouch&&s&&(s.zoom||s.melee)));let g=Math.min(40,3+(e.spreadNow||0)*260);le("crosshair").style.setProperty("--gap",g+"px"),le("crosshair").classList.toggle("hidden",!!e.scopeLevel||!n.alive),le("scope").classList.toggle("hidden",!e.scopeLevel),le("flash").style.opacity=Math.max(0,Math.min(1,e.flashAmount)).toFixed(2),le("damage").style.opacity=Math.max(0,e.hurtFlash).toFixed(2),this.msgTimer>0&&(this.msgTimer-=t,this.msgTimer<=0&&this.msg.classList.remove("on"));let x=!n.alive&&e.state==="playing";if(le("deathinfo").classList.toggle("hidden",!x),x){let f=e.deathText||"";if(e.respawnAt){let p=Math.max(0,Math.ceil((e.respawnAt-performance.now())/1e3));f+=`<br><small>${ot("respawnIn",{s:p})}</small>`}else e.spectating&&(f+=`<br><small>${ot("spectating",{name:mn(e.spectating.name)})}</small>`);this.set("deathinfo",f)}this.updateSlots(),this.drawRadar(),e.app.settings.showFps&&this.set("fps",`${Math.round(e.fps)} FPS \xB7 ${Math.round(e.app.net.rtt)} ms`)}updateSlots(){let t=this.g.me,e=[];t.inv.primary&&e.push(t.inv.primary),t.inv.secondary&&e.push(t.inv.secondary),e.push("knife");for(let s of["he","flash","smoke"])t.inv[s]>0&&e.push(s);t.inv.bomb&&e.push("bomb");let n=e.join(",")+"|"+t.weapon+"|"+Cn();if(this.slotKey!==n){this.slotKey=n,le("slots").innerHTML=e.map((s,r)=>`<button class="slot ${s===t.weapon?"sel":""}" data-w="${s}"><span>${[1,2,3,4,4,4,5][r]&&""}</span>${mn(Te(Se[s].name))}</button>`).join("");for(let s of le("slots").querySelectorAll(".slot"))s.onpointerdown=r=>{r.stopPropagation(),r.preventDefault(),this.g.switchTo(s.dataset.w)}}}message(t,e=2.5,n=""){this.msg.innerHTML=t,this.msg.className="on "+n,this.msgTimer=e}killfeed(t){let e=this.g,n=document.createElement("div"),s=a=>a==="T"?"t":a==="CT"?"ct":"",r=t.k===e.myId||t.v===e.myId;n.className="kf"+(r?" mine":"");let o=Se[t.w];for(n.innerHTML=`${t.kn?`<span class="${s(t.kt)}">${mn(t.kn)}</span>`:""}${t.assist?` + <small>${mn(t.assist)}</small>`:""} <i>${mn(o?Te(o.name):"\u2620")}</i>${t.head?" <b>\u2316</b>":""} <span class="${s(t.vt)}">${mn(t.vn)}</span>`,this.feed.prepend(n);this.feed.children.length>6;)this.feed.lastChild.remove();setTimeout(()=>n.remove(),7e3)}chat(t,e,n,s=""){let r=document.createElement("div");for(r.className="cl "+s,r.innerHTML=t?`<b class="${n==="T"?"t":n==="CT"?"ct":""}">${mn(t)}:</b> ${mn(e)}`:`<i>${mn(e)}</i>`,this.chatLog.append(r);this.chatLog.children.length>8;)this.chatLog.firstChild.remove();setTimeout(()=>r.classList.add("old"),9e3)}hitmarker(t){let e=le("hitmarker");e.classList.remove("on","head"),e.offsetWidth,e.classList.add("on"),t&&e.classList.add("head")}damageFrom(t){let e=document.createElement("div");e.className="dmgdir",e.style.transform=`translate(-50%,-50%) rotate(${t}rad)`,le("dmgdirs").append(e),setTimeout(()=>e.remove(),1200)}prepRadar(){let t=this.g.arena,e=512,n=document.createElement("canvas");n.width=e,n.height=e;let s=n.getContext("2d"),r=e/t.size,o=l=>(l+t.half)*r,a=l=>(l+t.half)*r;s.fillStyle="rgba(40,46,40,0.9)",s.fillRect(0,0,e,e),s.lineCap="round";for(let l of t.roads){s.strokeStyle=l.kind<=6?"#8a8d92":"#6f7268",s.lineWidth=Math.max(1.5,l.width*r),s.beginPath();for(let c=0;c<l.pts.length;c+=2)(c?s.lineTo:s.moveTo).call(s,o(l.pts[c]),a(l.pts[c+1]));s.stroke()}s.fillStyle="#c8c3b8",s.strokeStyle="#2b2b2b",s.lineWidth=1;for(let l of t.buildings){s.beginPath();for(let c=0;c<l.pts.length;c+=2)(c?s.lineTo:s.moveTo).call(s,o(l.pts[c]),a(l.pts[c+1]));s.closePath(),s.fill(),s.stroke()}s.font="bold 34px Arial",s.textAlign="center",s.textBaseline="middle";for(let l of this.g.layout.sites)s.fillStyle="rgba(255,160,20,0.35)",s.beginPath(),s.arc(o(l.x),a(l.z),l.r*r*1.4,0,7),s.fill(),s.fillStyle="#ffb020",s.fillText(l.id,o(l.x),a(l.z));s.strokeStyle="rgba(255,255,255,0.5)",s.lineWidth=3,s.strokeRect(1,1,e-2,e-2),this.radarBase=n,this.radarK=r}drawRadar(){let t=this.g,e=t.arena,n=this.rctx,s=this.radar.width,r=2.6,o=t.viewPos();n.save(),n.clearRect(0,0,s,s),n.beginPath(),n.arc(s/2,s/2,s/2-2,0,7),n.clip(),n.fillStyle="#20251f",n.fillRect(0,0,s,s),n.translate(s/2,s/2),n.rotate(o.yaw);let a=s/e.size*r;n.scale(a,a),n.translate(-o.x,-o.z),n.drawImage(this.radarBase,-e.half,-e.half,e.size,e.size);let l=(h,d,u,m=2.2)=>{n.fillStyle=u,n.beginPath(),n.arc(h,d,m,0,7),n.fill()},c=Ne[t.settings.mode].teams;for(let h of t.players.values())!h.alive||!h.pos||(c&&h.team===t.me.team?l(h.pos.x,h.pos.z,h.team==="T"?"#ffcc55":"#66b3ff"):h.spotted>performance.now()&&l(h.pos.x,h.pos.z,"#ff3b30"));if(t.bomb){let[h,d,,u]=t.bomb;c&&(t.me.team==="T"||h==="planted")&&(n.fillStyle=h==="planted"?"#ff3b30":"#ffb020",n.fillRect(d-2.5,u-2.5,5,5))}n.restore(),n.fillStyle="#fff",n.beginPath(),n.moveTo(s/2,s/2-7),n.lineTo(s/2+5,s/2+6),n.lineTo(s/2,s/2+3),n.lineTo(s/2-5,s/2+6),n.closePath(),n.fill(),n.strokeStyle="rgba(255,255,255,0.35)",n.lineWidth=2,n.beginPath(),n.arc(s/2,s/2,s/2-2,0,7),n.stroke()}buildBuyMenu(){let t=this.g,e=le("buymenu"),n=t.settings.mode==="tdm"||t.settings.mode==="dm",s=()=>{let r=t.me,o=`<div class="bm-head"><h2>${n?ot("loadout"):ot("buyMenu")}</h2>${n?`<small>${ot("loadoutHint")}</small>`:`<b class="money">$${r.money}</b>`}<button class="close" data-close>\xD7</button></div><div class="bm-cats">`;for(let a of Kd)if(!(n&&(a.id==="gear"||a.id==="grenades"))){o+=`<div class="bm-cat"><h3>${Te(a.name)}</h3>`;for(let l of a.items){let c=Se[l]||yl[l];if(!Jd(r.team,l))continue;let h=jd(l),d=n?r.loadout?.primary===l||r.loadout?.secondary===l:r.inv.primary===l||r.inv.secondary===l,u=!n&&h>r.money;o+=`<button class="bm-item ${u?"poor":""} ${d?"owned":""}" data-id="${l}"><span>${mn(Te(c.name))}</span>${n?"":`<i>$${h}</i>`}</button>`}o+="</div>"}e.innerHTML=o+"</div>",e.querySelector("[data-close]").onclick=()=>this.toggleBuy(!1);for(let a of e.querySelectorAll(".bm-item"))a.onclick=()=>{let l=a.dataset.id;if(n){let c=Se[l];r.loadout=r.loadout||{},c.slot===ae.PRIMARY?r.loadout.primary=l:r.loadout.secondary=l,t.app.net.send({t:"loadout",primary:r.loadout.primary,secondary:r.loadout.secondary}),t.app.audio.ui()}else t.app.net.send({t:"buy",item:l}),t.app.audio.money();setTimeout(s,120)}};this.renderBuy=s}toggleBuy(t){let e=le("buymenu"),n=t??e.classList.contains("hidden");n&&this.renderBuy(),e.classList.toggle("hidden",!n),this.g.menuOpen=n,n?(this.g.input.release(),this.g.input.unlock()):this.g.input.lock()}scoreboard(t){let e=le("scoreboard");if(e.classList.toggle("hidden",!t),!t)return;let n=this.g,s=[...n.roster.values()],r=Ne[n.settings.mode].teams?["CT","T"]:["T"],o=`<div class="sb-title">${mn(n.app.room?.name||"")} \xB7 ${mn(n.settings.mapName)} \xB7 ${Te(Ne[n.settings.mode].name)}</div>`;for(let a of r){let l=s.filter(c=>Ne[n.settings.mode].teams?c.team===a:c.team!=="SPEC").sort((c,h)=>h.score-c.score);o+=`<table class="sb ${a==="T"?"t":"ct"}"><tr><th>${Ne[n.settings.mode].teams?`${Te(Gn[a])} <span>${n.score[a]??""}</span>`:ot("players")}</th><th>${ot("kills")}</th><th>${ot("deaths")}</th><th>${ot("assists")}</th><th>${ot("score")}</th><th>${ot("ping")}</th></tr>`;for(let c of l){let h=c.id===n.myId?n.me.alive:n.players.get(c.id)?.alive;o+=`<tr class="${c.id===n.myId?"me":""} ${h?"":"deadrow"}"><td>${mn(c.name)}${c.bot?" <small>BOT</small>":""}</td><td>${c.kills}</td><td>${c.deaths}</td><td>${c.assists??0}</td><td>${c.score}</td><td>${c.bot?"\u2014":c.ping}</td></tr>`}o+="</table>"}e.innerHTML=o}destroy(){this.root.classList.add("hidden");for(let t of["buymenu","scoreboard","deathinfo","progress","scope"])le(t).classList.add("hidden");le("flash").style.opacity=0,le("damage").style.opacity=0,this.feed.innerHTML="",this.chatLog.innerHTML=""}};var vf=new U,Ch=i=>{for(;i>Math.PI;)i-=Math.PI*2;for(;i<-Math.PI;)i+=Math.PI*2;return i},Dl=class{constructor(t,e){this.app=t,this.net=t.net,this.myId=t.myId,this.settings=e.settings,this.layout=e.layout,this.arena=gh(t.region,t.index,e.arena),$d(this.arena,this.layout),this.isTouch=t.isTouch,this.q=t.quality,this.players=new Map,this.roster=new Map,this.me={body:Sh(0,0,0),yaw:0,pitch:0,alive:!1,hp:100,armor:0,helmet:!1,money:0,team:"SPEC",inv:{primary:null,secondary:null,he:0,flash:0,smoke:0,bomb:!1,defuser:!1},ammo:{},weapon:"knife",gg:0,loadout:null},this.state="loading",this.phase="freeze",this.timeLeft=0,this.score={T:0,CT:0},this.bomb=null,this.grenades=[],this.items=[],this.nextFire=0,this.reloadUntil=0,this.recoil=0,this.sprayCount=0,this.punch={x:0,y:0},this.lastWeapon="knife",this.scopeLevel=0,this.flashAmount=0,this.hurtFlash=0,this.shake=0,this.progress=0,this.sendTimer=0,this.stepTimer=0,this.fps=60,this.menuOpen=!1,this.firedSemi=!1,this.buyEnd=0,this.respawnAt=0,this.deathText="",this.spectating=null,this.lastUse=!1,this.unsub=[],this.updateRoster(t.room)}async build(t){let e=this.app,n=this.q,s=e.renderer;if(this.scene=new fi,this.bgScene=new fi,this.camera=new De(e.settings.fov,innerWidth/innerHeight,.05,n.farRadius+600),this.bgCamera=new De(e.settings.fov,innerWidth/innerHeight,50,12e4),this.camera.rotation.order="YXZ",this.setupLighting(),await _f(),t(.1,ot("buildingCity")),this.city=new El({scene:this.scene,bgScene:this.bgScene,arena:this.arena,region:e.region,index:e.index,quality:n,renderer:s}),this.city.build(r=>t(.1+r*.6,ot("buildingCity"))),this.city.extraProps?.length){let{addProps:r}=await Promise.resolve().then(()=>(jr(),Yd));r(this.arena,this.city.extraProps)}await _f(),t(.75,ot("buildingCity")),this.props=new Rl(this.scene,this.layout.props,n),this.effects=new Cl(this.scene,n),this.viewmodel=new Pl,this.addSiteMarkers(),this.applyTimeOfDay(),t(.9,ot("waitingPlayers")),this.input=new Il(s.domElement,e.settings,this.isTouch),this.input.onLockLost=()=>{this.state==="playing"&&!this.menuOpen&&this.app.openPause()},this.hud=new Ll(this),this.bindNet(),s.compile(this.scene,this.camera),s.compile(this.bgScene,this.bgCamera),t(1,ot("waitingPlayers")),this.net.send({t:"ready"}),this.state="playing",this.running=!0,this.last=performance.now(),this.loop=this.loop.bind(this),requestAnimationFrame(this.loop),this.onResize=()=>{this.camera.aspect=this.bgCamera.aspect=innerWidth/innerHeight,this.camera.updateProjectionMatrix(),this.bgCamera.updateProjectionMatrix()},addEventListener("resize",this.onResize)}setupLighting(){let t=this.q;if(this.hemi=new Ri(13624319,7036749,1),this.scene.add(this.hemi),this.sun=new Ci(16773596,2.6),this.sun.castShadow=t.shadows,t.shadows){this.sun.shadow.mapSize.set(t.shadowSize,t.shadowSize);let e=this.sun.shadow.camera;e.left=-75,e.right=75,e.top=75,e.bottom=-75,e.near=1,e.far=420,this.sun.shadow.bias=-4e-4,this.sun.shadow.normalBias=.05}this.scene.add(this.sun,this.sun.target),this.bgHemi=new Ri(13624319,7036749,1),this.bgSun=new Ci(16773596,1.5),this.bgSun.position.set(.5,1,.3),this.bgScene.add(this.bgHemi,this.bgSun),this.sky=new js,this.sky.scale.setScalar(1e5),this.bgScene.add(this.sky),this.nightLights=[]}applyTimeOfDay(){let t=this.settings.timeOfDay,e=this.settings.weather,n=this.sky.material.uniforms,s=42,r=150,o=2.2,a=.45,l=13161954,c=120,h=this.q.farRadius+350,d=16773596;n.turbidity.value=5,n.rayleigh.value=1.6,n.mieCoefficient.value=.004,n.mieDirectionalG.value=.8,t==="evening"&&(s=5,r=255,o=1.7,a=.65,l=14198663,d=16757370,n.turbidity.value=9,n.rayleigh.value=3),t==="night"&&(s=-6,r=255,o=.35,a=.32,l=922916,d=10467071,n.turbidity.value=1,n.rayleigh.value=.2),e==="cloudy"&&(o*=.55,a*=1.15,n.turbidity.value+=7,l=t==="night"?922400:11712703,h*=.8),e==="fog"&&(o*=.4,a*=1.1,c=8,h=140,l=t==="night"?1383205:12172996);let u=il.degToRad(90-s),m=il.degToRad(r);this.sunDir=new U().setFromSphericalCoords(1,u,m),t==="night"&&this.sunDir.set(-.4,.75,-.5).normalize(),n.sunPosition.value.copy(this.sunDir),this.sun.intensity=o,this.sun.color.setHex(d),this.hemi.intensity=a,this.bgHemi.intensity=a*1.6,this.bgSun.intensity=o*.8,this.bgSun.color.setHex(d),this.bgSun.position.copy(this.sunDir),this.scene.fog=new Ds(l,c,h),this.bgScene.fog=new Ds(l,e==="fog"?60:3e3,e==="fog"?400:52e3),this.sky.visible=t!=="night",this.bgScene.background=new Ct(t==="night"?461590:l),this.app.renderer.toneMappingExposure=t==="night"?.85:t==="evening"?.6:.42;let g=new Ys(this.app.renderer),x=new fi;if(t!=="night"){let p=new js;p.scale.setScalar(1e3),Object.assign(p.material.uniforms.sunPosition.value,this.sunDir);for(let y of["turbidity","rayleigh","mieCoefficient","mieDirectionalG"])p.material.uniforms[y].value=n[y].value;x.add(p)}else x.background=new Ct(1054760);this.envRT=g.fromScene(x,.04),this.scene.environment=this.envRT.texture,this.viewmodel.scene.environment=this.envRT.texture,g.dispose();let f=t==="night";if(this.city.setNight(f||t==="evening"),!f&&t==="evening")for(let p of[...this.city.facadeMats,...this.city.shopMats])p.emissiveIntensity=.35;if(this.props.setNight(f),f){for(let p=0;p<6;p++){let y=new Zi(16767392,0,26,1.6);this.scene.add(y),this.nightLights.push(y)}this.lamps=this.layout.props.filter(p=>p.type==="lamp")}}addSiteMarkers(){for(let t of this.layout.sites){let e=new Ht(new _n(t.r*2.4,t.r*2.4),new Bn({map:df(t.id),transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-8,polygonOffsetUnits:-8}));e.rotation.x=-Math.PI/2,e.position.set(t.x,this.arena.ground(t.x,t.z)+.2,t.z),this.scene.add(e);let n=new Tn(new vn({map:Th("B\xD6LGE "+t.id,{color:"#ffb020",size:46}),depthTest:!0,transparent:!0}));n.scale.set(6,1.1,1),n.position.set(t.x,this.arena.ground(t.x,t.z)+4.5,t.z),this.scene.add(n)}}bindNet(){let t=(e,n)=>this.unsub.push(this.net.on(e,n.bind(this)));t("snap",this.onSnap),t("me",this.onMe),t("spawn",this.onSpawn),t("corr",this.onCorr),t("shot",this.onShot),t("slash",e=>this.app.audio.knife(this.playerPos(e.id))),t("hit",this.onHit),t("kill",this.onKill),t("round",this.onRound),t("roundEnd",this.onRoundEnd),t("bomb",this.onBomb),t("boom",this.onBoom),t("throw",e=>this.app.audio.knife(this.playerPos(e.id))),t("bounce",e=>this.app.audio.bounce(e)),t("reload",e=>this.app.audio.reload(this.playerPos(e.id))),t("defusing",()=>this.app.audio.keypad()),t("sys",e=>this.hud.chat(null,iv(e))),t("chat",e=>this.hud.chat(e.from+(e.teamOnly?` (${Te(Gn[e.team])})`:""),e.text,e.team,e.dead?"dead":"")),t("match",this.onMatch),t("gg",e=>this.hud.message(`${Te(Se[e.weapon].name)} (${e.level+1}/14)`,2)),t("err",e=>{let n={buyTime:"errBuyTime",buyZone:"errBuyZone",money:"errMoney"};n[e.code]&&this.hud.message(ot(n[e.code]),1.6,"warn")}),t("room",e=>this.updateRoster(e.room)),t("start",()=>{})}updateRoster(t){if(!t||!t.list)return;this.roster=new Map(t.list.map(n=>[n.id,n]));for(let[n,s]of this.players){let r=this.roster.get(n);r&&(s.name=r.name,s.bot=r.bot)}let e=this.roster.get(this.myId);e&&(this.me.team=e.team)}onSnap(t){this.phase=t.ph,this.timeLeft=t.tl,this.snapLocalTime=performance.now(),this.snapTimeLeft=t.tl,this.score=t.sc||this.score,this.bomb=t.b,this.grenades=t.g,this.items=t.i,this.progress=t.pr||0;let e=new Set;for(let n of t.p){let[s,r,o,a,l,c,h,d,u,m,g,x]=n;if(s===this.myId){this.me.serverAlive=!!(d&1);continue}e.add(s);let f=this.players.get(s),p=g===1?"T":g===2?"CT":"SPEC";f||(f={id:s,snaps:[],name:this.roster.get(s)?.name||"?",team:p,alive:!1,stepT:0,spotted:0},this.players.set(s,f)),(f.team!==p||!f.model)&&this.makeModel(f,p),f.snaps.push({t:t.st,x:r,y:o,z:a,yaw:l,pitch:c,crouch:h,flags:d,w:_h[u]||"knife",hp:m,speed:x}),f.snaps.length>30&&f.snaps.shift(),f.hp=m}for(let[n,s]of this.players)e.has(n)||(s.model&&this.scene.remove(s.model),s.tag&&this.scene.remove(s.tag),this.players.delete(n))}makeModel(t,e){t.model&&this.scene.remove(t.model),t.tag&&(this.scene.remove(t.tag),t.tag=null),t.team=e,t.model=xf(e),this.scene.add(t.model),Ne[this.settings.mode].teams&&e===this.me.team&&(t.tag=new Tn(new vn({map:Th(t.name,{color:e==="T"?"#ffd27a":"#9fd0ff",size:38}),depthTest:!1,transparent:!0})),t.tag.scale.set(1.5,.28,1),t.tag.renderOrder=10,this.scene.add(t.tag))}onMe(t){let e=this.me,n=t.weapon!==e.weapon;Object.assign(e,{money:t.money,hp:t.hp,armor:t.armor,helmet:t.helmet,team:t.team,inv:t.inv,ammo:t.ammo,gg:t.gg}),!t.alive&&e.alive&&this.onDeath(),e.alive=t.alive,n&&this.equip(t.weapon,!1),this.viewmodel.setTeam(e.team),this.hud.renderBuy&&!document.getElementById("buymenu").classList.contains("hidden")&&this.hud.renderBuy()}onSpawn(t){let e=this.me;e.body=Sh(t.x,t.y,t.z),e.yaw=t.yaw,e.pitch=0,e.alive=!0,e.hp=100,this.respawnAt=0,this.spectating=null,this.deathText="",this.punch={x:0,y:0},this.recoil=0,this.scopeLevel=0,this.flashAmount=0,this.reloadUntil=0;for(let n of this.players.values())this.makeModel(n,n.team)}onCorr(t){Object.assign(this.me.body,{x:t.x,y:t.y,z:t.z,vx:0,vy:0,vz:0})}onDeath(){this.scopeLevel=0,this.input.release(),Ne[this.settings.mode].respawn&&(this.respawnAt=performance.now()+(this.settings.mode==="dm"?2e3:3e3)),this.deathAt=performance.now()}playerPos(t){if(t===this.myId)return{x:this.me.body.x,y:this.me.body.y+1.5,z:this.me.body.z};let e=this.players.get(t);return e&&e.pos?{x:e.pos.x,y:e.pos.y+1.5,z:e.pos.z}:null}onShot(t){let e=this.players.get(t.id),n=Se[t.w],s=new U(t.o[0],t.o[1]-.15,t.o[2]);e&&e.model&&(e.model.userData.gun.getWorldPosition(vf),s.copy(vf),s.y+=.05);let r=new U(t.e[0],t.e[1],t.e[2]);this.effects.muzzle(s,.8,!0),Math.random()<.6&&this.effects.tracer(s,r),t.e[3]&&this.effects.impact(r,r.clone().sub(s).normalize().negate(),"world"),this.app.audio.shot(n.model,{x:t.o[0],y:t.o[1],z:t.o[2]},n.silenced),e&&(e.spotted=performance.now()+1500)}onHit(t){if(t.pos&&this.effects.blood(new U(...t.pos),t.head),t.a===this.myId&&t.v!==this.myId&&(this.hud.hitmarker(t.head),this.app.audio.hit(t.head)),t.v===this.myId){this.me.hp=t.hp,this.hurtFlash=Math.min(.6,this.hurtFlash+t.dmg/80),this.app.audio.hurt(),this.punch.x+=.02;let e=t.a?this.playerPos(t.a):null;if(e){let n=Math.atan2(-(e.x-this.me.body.x),-(e.z-this.me.body.z));this.hud.damageFrom(-Ch(n-this.me.yaw))}}}onKill(t){if(this.hud.killfeed(t),t.k===this.myId&&t.v!==this.myId&&this.hud.message(ot("youKilled",{name:Ph(t.vn)})+(t.head?` <b>\u2316 ${ot("headshot")}</b>`:""),1.6,"kill"),t.v===this.myId){let n=Se[t.w];this.deathText=t.kn&&t.k!==this.myId?ot("killedBy",{name:Ph(t.kn),weapon:n?Te(n.name):""})+(t.head?` (${ot("headshot")})`:""):"\u2620",this.killerId=t.k}let e=this.players.get(t.v);e&&(e.deadAt=performance.now())}onRound(t){t.phase==="freeze"?(this.effects.clearRound(),this.hud.message(`${ot("round")} ${t.round} \xB7 ${ot("freeze")}`,2.5),this.app.audio.roundStart(),this.buyEnd=performance.now()+(t.buyTime||0)*1e3,this.bombBeepAt=0):t.phase==="live"&&(this.hud.message(ot("live"),1.5),t.buyTime!==void 0&&(this.buyEnd=performance.now()+t.buyTime*1e3),this.settings.mode!=="bomb"&&(this.buyEnd=0))}onRoundEnd(t){let e=t.winner==="T"?ot("tWin"):ot("ctWin"),n={elim:"reasonElim",bomb:"reasonBomb",defuse:"reasonDefuse",time:"reasonTime"}[t.reason];this.hud.message(`<span class="${t.winner==="T"?"t":"ct"}">${e}</span><small>${ot(n)}${t.mvp?" \xB7 MVP: "+Ph(t.mvp):""}</small>`,4.5,"big"),this.app.audio.roundEnd(t.winner===this.me.team),this.app.settings.voice&&this.app.audio.say(e,Cn())}onBomb(t){if(t.state==="planted")this.hud.message(ot("bombPlanted")+` (${t.site})`,3,"warn"),this.app.settings.voice&&this.app.audio.say(ot("bombPlanted"),Cn()),this.bombPlantedAt=performance.now(),this.bombTotal=t.time,this.bombBeepAt=performance.now(),this.bombPos={x:t.x,y:t.y,z:t.z};else if(t.state==="defused")this.hud.message(ot("bombDefused"),3),this.bombBeepAt=0,this.app.settings.voice&&this.app.audio.say(ot("bombDefused"),Cn());else if(t.state==="exploded"){this.bombBeepAt=0;let e=new U(t.x,t.y,t.z);this.effects.explosion(e,()=>{}),this.effects.explosion(e.clone().add(new U(2,1,-1)),()=>{}),this.app.audio.explosion(e,!0),this.shake=Math.max(this.shake,1.2*Math.max(.2,1-this.distTo(e)/120))}}onBoom(t){let e=new U(t.x,t.y,t.z);if(t.g==="he")this.effects.explosion(e,()=>{}),this.app.audio.explosion(e),this.shake=Math.max(this.shake,Math.max(0,1-this.distTo(e)/30));else if(t.g==="smoke")this.effects.smoke(e,18),this.app.audio.smokePop(e);else if(t.g==="flash"){this.app.audio.flashbang(e);let n=this.eyePos(),s=n.distanceTo(e);if(s<35&&xl(this.arena,e.x,e.y+.1,e.z,n.x,n.y,n.z)){let r=new U;this.camera.getWorldDirection(r);let a=(r.dot(e.clone().sub(n).normalize())>.2?1:.35)*Math.max(0,1-s/38);this.flashAmount=Math.max(this.flashAmount,a*3.2),a>.4&&this.app.audio.ringing(a*3)}this.effects.light.position.copy(e),this.effects.light.intensity=40,this.effects.lightLife=.1}}onMatch(t){this.state="ended",this.input.release(),this.input.unlock(),this.app.showMatchEnd(t,this)}eyePos(){let t=this.me.body;return new U(t.x,t.y+tf(t),t.z)}distTo(t){return this.eyePos().distanceTo(t)}viewPos(){return!this.me.alive&&this.spectating&&this.spectating.pos?{x:this.spectating.pos.x,z:this.spectating.pos.z,yaw:this.spectating.yaw}:{x:this.me.body.x,z:this.me.body.z,yaw:this.me.yaw}}inBuyZone(){if(this.settings.mode!=="bomb"||performance.now()>this.buyEnd||!this.me.alive)return!1;let t=this.me.team==="T"?this.layout.tSpawn:this.layout.ctSpawn;return t&&Math.hypot(this.me.body.x-t.x,this.me.body.z-t.z)<21}inSite(){return this.layout.sites.some(t=>Math.hypot(this.me.body.x-t.x,this.me.body.z-t.z)<t.r+1.4)}nearBomb(){return this.bomb&&this.bomb[0]==="planted"&&Math.hypot(this.me.body.x-this.bomb[1],this.me.body.z-this.bomb[3])<1.7}equip(t,e=!0){let n=this.me;t!==n.weapon&&(this.lastWeapon=n.weapon),n.weapon=t,this.scopeLevel=0,this.reloadUntil=0,this.nextFire=Math.max(this.nextFire,performance.now()+380),this.viewmodel.setWeapon(Se[t]?.model||"knife"),e&&this.net.send({t:"sw",w:t}),this.net.send({t:"scope",on:!1})}switchTo(t){let e=this.me;if(!e.alive||t===e.weapon)return;(t==="knife"||e.inv.primary===t||e.inv.secondary===t||Se[t]?.grenade&&e.inv[t]>0||t==="bomb"&&e.inv.bomb)&&(this.equip(t),this.app.audio.ui())}slotOrder(){let t=this.me,e=[];t.inv.primary&&e.push(t.inv.primary),t.inv.secondary&&e.push(t.inv.secondary),e.push("knife");for(let n of["he","flash","smoke"])t.inv[n]>0&&e.push(n);return t.inv.bomb&&e.push("bomb"),e}handleEvents(t){let e=this.me;for(let n of t)switch(n){case"slot1":e.inv.primary&&this.switchTo(e.inv.primary);break;case"slot2":e.inv.secondary&&this.switchTo(e.inv.secondary);break;case"slot3":this.switchTo("knife");break;case"slot4":{let s=["he","flash","smoke"].filter(r=>e.inv[r]>0);if(s.length){let r=s.indexOf(e.weapon);this.switchTo(s[(r+1)%s.length])}break}case"slot5":e.inv.bomb&&this.switchTo("bomb");break;case"last":this.switchTo(this.lastWeapon);break;case"next":case"prev":{let s=this.slotOrder(),r=s.indexOf(e.weapon);this.switchTo(s[(r+(n==="next"?1:s.length-1))%s.length]);break}case"reload":this.reload();break;case"drop":this.net.send({t:"drop"});break;case"alt":this.altFire();break;case"buy":if(this.settings.mode==="bomb"&&!this.inBuyZone()){this.hud.message(ot("errBuyZone"),1.2,"warn");break}(this.settings.mode==="bomb"||this.settings.mode==="tdm"||this.settings.mode==="dm")&&this.hud.toggleBuy();break;case"scoreOn":this.hud.scoreboard(!0);break;case"scoreOff":this.hud.scoreboard(!1);break;case"chat":case"teamchat":this.app.openChat(n==="teamchat");break;case"team":this.app.openTeamSelect();break;case"menu":document.getElementById("buymenu").classList.contains("hidden")?this.app.openPause():this.hud.toggleBuy(!1);break}}reload(){let t=this.me,e=Se[t.weapon],n=t.ammo[t.weapon];!t.alive||!e||e.melee||e.grenade||!n||n.mag>=e.mag||n.res<=0||this.reloadUntil>performance.now()||(this.reloadUntil=performance.now()+e.reload*1e3,this.scopeLevel=0,this.viewmodel.startReload(e.reload),this.app.audio.reload(null),this.net.send({t:"reload"}))}altFire(){let t=Se[this.me.weapon];!t||!this.me.alive||(t.zoom?(this.scopeLevel=(this.scopeLevel+1)%(t.zoom.length+1),this.net.send({t:"scope",on:this.scopeLevel>0}),this.app.audio.ui()):t.melee&&this.fireWeapon(!0))}canAct(){return this.me.alive&&this.state==="playing"&&this.phase!=="freeze"&&!this.menuOpen}fireWeapon(t=!1){let e=this.me,n=Se[e.weapon],s=performance.now();if(!n||s<this.nextFire||this.reloadUntil>s||n.slot===ae.BOMB)return!1;if(n.grenade)return this.throwGrenade(n),!0;let r=e.ammo[e.weapon];if(!n.melee&&(!r||r.mag<=0))return this.app.audio.dry(),this.nextFire=s+250,r&&r.res>0&&this.reload(),!1;this.nextFire=s+60/n.rpm*1e3*(n.melee&&t?2:1);let o=this.eyePos(),a=new U;this.camera.getWorldDirection(a);let l=new U().crossVectors(a,this.camera.up).normalize(),c=new U().crossVectors(l,a).normalize(),h=bh(n,{onGround:e.body.onGround,speed:Qr(e.body),crouch:e.body.crouch>.5,scoped:this.scopeLevel>0,recoil:this.recoil}),d=[];for(let g=0;g<n.pellets;g++){let x=Math.random()*Math.PI*2,f=Math.sqrt(Math.random())*h,p=a.clone().addScaledVector(l,Math.cos(x)*f).addScaledVector(c,Math.sin(x)*f).normalize();d.push([+p.x.toFixed(4),+p.y.toFixed(4),+p.z.toFixed(4)])}if(this.net.send({t:"fire",w:e.weapon,o:[+o.x.toFixed(3),+o.y.toFixed(3),+o.z.toFixed(3)],d,heavy:t}),n.melee||r.mag--,n.melee)return this.viewmodel.knifeSwing(),this.app.audio.knife(null),!0;this.viewmodel.fire(n.recoil*40),this.app.audio.shot(n.model,null,n.silenced);let u=o.clone().addScaledVector(a,.7).addScaledVector(l,.12).addScaledVector(c,-.1);this.effects.light.position.copy(u),this.effects.light.intensity=n.silenced?1.5:5,this.effects.lightLife=.05;for(let g of d){let x=new U(...g),f=gl(this.arena,o.x,o.y,o.z,x.x,x.y,x.z,n.range),p=f?f.t:Math.min(n.range,200),y=!1;for(let v of this.players.values()){if(!v.alive||!v.pos)continue;let b=Zd(o.x,o.y,o.z,x.x,x.y,x.z,v.pos.x,v.pos.y,v.pos.z,v.crouch||0,p);b&&(p=b.t,y=!0)}let S=o.clone().addScaledVector(x,p);f&&!y&&this.effects.impact(S,new U(f.nx,f.ny,f.nz),f.what),(this.sprayCount%2===0||n.pellets>1)&&this.effects.tracer(u,S)}this.sprayCount++;let m=n.recoil*(.85+Math.random()*.3);return this.punch.x=Math.min(n.recoilMax*1.4,this.punch.x+m),this.sprayCount>4&&(this.punch.y+=(Math.sin(this.sprayCount*.55)*.6+(Math.random()-.5)*.5)*n.recoil),this.recoil=Math.min(n.recoilMax,this.recoil+n.recoil),n.zoom&&this.scopeLevel&&(this.rescope=this.scopeLevel,this.scopeLevel=0,this.rescopeAt=s+60/n.rpm*1e3),n.auto||(this.firedSemi=!0),!0}throwGrenade(t){let e=this.me;if(e.inv[t.id]<=0)return;let n=this.eyePos(),s=new U;this.camera.getWorldDirection(s);let r=s.clone().multiplyScalar(17).add(new U(e.body.vx*.6,2.2,e.body.vz*.6)),o=n.clone().addScaledVector(s,.4);this.net.send({t:"nade",g:t.id,o:[o.x,o.y,o.z],v:[r.x,r.y,r.z]}),this.viewmodel.knifeSwing(),this.nextFire=performance.now()+900,e.inv[t.id]--,this.firedSemi=!0,setTimeout(()=>{e.alive&&e.weapon===t.id&&e.inv[t.id]<=0&&this.switchTo(e.inv.primary||e.inv.secondary||"knife")},500)}loop(t){if(!this.running)return;requestAnimationFrame(this.loop);let e=Math.min(.05,(t-this.last)/1e3);this.last=t,this.fps=this.fps*.95+1/Math.max(e,.001)*.05,this.update(e,t),this.render(e)}update(t,e){let n=this.me,s=this.input;this.snapLocalTime&&(this.timeLeft=Math.max(0,this.snapTimeLeft-(e-this.snapLocalTime)/1e3)),this.handleEvents(s.consumeEvents());let[r,o]=s.consumeLook(),a=this.scopeLevel?1/(Se[n.weapon]?.zoom?.[this.scopeLevel-1]||1):1;this.menuOpen||(n.yaw=Ch(n.yaw-r*a),n.pitch=Math.max(-1.5,Math.min(1.5,n.pitch-o*a))),this.lookDelta=[r,o];let l=s.state(),c=Se[n.weapon]||Se.knife;if(n.alive){let d=this.phase==="freeze"||this.menuOpen||this.state!=="playing",u={fwd:d?0:l.fwd,side:d?0:l.side,jump:!d&&l.jump,crouch:l.crouch,walk:l.walk,yaw:n.yaw,speedMul:c.speed*(this.scopeLevel?.55:1)*(this.planting?0:1)},m=n.body.onGround;ef(this.arena,n.body,u,t),!m&&n.body.onGround&&this.app.audio.land(null);let g=Qr(n.body);if(this.stepTimer-=t,g>2.6&&n.body.onGround&&!l.walk&&n.body.crouch<.5&&this.stepTimer<=0&&(this.app.audio.footstep(null,.6),this.stepTimer=.36),this.sendTimer-=t,this.sendTimer<=0){this.sendTimer=1/30;let f=n.body;this.net.send({t:"in",x:+f.x.toFixed(3),y:+f.y.toFixed(3),z:+f.z.toFixed(3),yaw:+n.yaw.toFixed(3),pitch:+n.pitch.toFixed(3),c:+f.crouch.toFixed(2),g:f.onGround?1:0,walk:l.walk?1:0,crouch:l.crouch?1:0})}this.canAct()?l.fire?c.slot===ae.BOMB||(c.auto||!this.firedSemi)&&this.fireWeapon(!1):(this.firedSemi=!1,this.sprayCount=0):l.fire||(this.firedSemi=!1);let x=l.use||c.slot===ae.BOMB&&l.fire;x!==this.lastUse&&(this.net.send({t:"use",on:x}),this.lastUse=x),this.planting=x&&c.slot===ae.BOMB&&this.inSite(),this.reloadUntil&&e>=this.reloadUntil&&(this.reloadUntil=0),this.rescopeAt&&e>=this.rescopeAt&&(this.scopeLevel=this.rescope||0,this.rescopeAt=0)}else this.lastUse&&(this.net.send({t:"use",on:!1}),this.lastUse=!1);let h=(c.recoilRecover||6)*t;if(this.recoil=Math.max(0,this.recoil-h*.08),(!l.fire||!this.canAct())&&(this.punch.x*=Math.max(0,1-t*7),this.punch.y*=Math.max(0,1-t*7)),this.spreadNow=bh(c,{onGround:n.body.onGround,speed:Qr(n.body),crouch:n.body.crouch>.5,scoped:this.scopeLevel>0,recoil:this.recoil}),this.flashAmount=Math.max(0,this.flashAmount-t*.9),this.hurtFlash=Math.max(0,this.hurtFlash-t*1.5),this.shake=Math.max(0,this.shake-t*2.5),this.updateRemote(t,e),this.updateSpectate(),this.bombBeepAt&&this.bomb&&this.bomb[0]==="planted"&&e>=this.bombBeepAt){let d=this.bomb[4],u=Math.max(.12,Math.min(1,d/40))*1e3;this.app.audio.beep({x:this.bomb[1],y:this.bomb[2],z:this.bomb[3]},d<10),this.bombBeepAt=e+u}this.bomb&&this.bomb[0]!==this.lastBombState&&(this.lastBombState=this.bomb[0],this.updateBombModel()),this.updateGrenadeModels(),this.updateNightLights(e),this.effects.update(t,this.camera),this.hud.update(t)}updateRemote(t,e){let n=this.net.serverNow()-.1*1e3,s=Ne[this.settings.mode].teams,r=this.eyePos();for(let o of this.players.values()){let a=o.snaps;if(!a.length||!o.model)continue;let l=a[0],c=a[0];for(let v=a.length-1;v>=0;v--)if(a[v].t<=n){l=a[v],c=a[Math.min(a.length-1,v+1)];break}let h=c.t>l.t?Math.max(0,Math.min(1,(n-l.t)/(c.t-l.t))):1,d=l.x+(c.x-l.x)*h,u=l.y+(c.y-l.y)*h,m=l.z+(c.z-l.z)*h,g=l.yaw+Ch(c.yaw-l.yaw)*h,x=l.pitch+(c.pitch-l.pitch)*h,f=c.flags,p=!!(f&1),y=o.alive;o.alive=p,o.pos={x:d,y:u,z:m},o.yaw=g,o.pitch=x,o.crouch=l.crouch+(c.crouch-l.crouch)*h,o.weapon=c.w,!p&&y&&(o.deadAt=e);let S=p||o.deadAt&&e-o.deadAt<6e3;o.model.visible=S&&this.spectating!==o,o.model.position.set(d,u,m),o.model.rotation.y=g,yf(o.model,{speed:c.speed||0,crouch:o.crouch,pitch:x,dt:t,alive:p,model:Se[o.weapon]?.model||"ak"}),o.tag&&(o.tag.visible=p&&s&&o.team===this.me.team&&this.spectating!==o,o.tag.position.set(d,u+2.25,m)),o.stepT-=t,p&&(c.speed||0)>2.6&&!(f&4)&&o.crouch<.5&&f&2&&o.stepT<=0&&(this.app.audio.footstep({x:d,y:u,z:m},1),o.stepT=.38),p&&(!s||o.team!==this.me.team)&&(o.visCheck||0)<e&&(o.visCheck=e+250,xl(this.arena,r.x,r.y,r.z,d,u+1.3,m)&&(o.spotted=e+1200))}}updateSpectate(){let t=this.me;if(t.alive||this.settings.mode!=="bomb"&&t.team!=="SPEC"){this.spectating=null;return}if(performance.now()-(this.deathAt||0)<2500)return;let e=[...this.players.values()].filter(n=>n.alive&&(n.team===t.team||t.team==="SPEC"));if(!e.length){this.spectating=null;return}if((!this.spectating||!this.spectating.alive)&&(this.spectating=e[0]),this.input.fire&&!this.specClick){let n=e.indexOf(this.spectating);this.spectating=e[(n+1)%e.length]}this.specClick=this.input.fire}updateBombModel(){if(!this.bombMesh){this.bombMesh=new Ht(new ze(.32,.12,.42),new Ee({color:11770478,roughness:.7}));let e=new Ht(new ze(.05,.03,.05),new Bn({color:16720418}));e.position.set(.08,.07,-.1),this.bombMesh.add(e),this.scene.add(this.bombMesh)}let t=this.bomb;this.bombMesh.visible=!!t&&(t[0]==="planted"||t[0]==="dropped"),t&&this.bombMesh.position.set(t[1],t[2]+.06,t[3])}updateGrenadeModels(){this.nadeMeshes=this.nadeMeshes||new Map;let t=new Set;for(let[n,s,r,o,a]of this.grenades||[]){t.add(n);let l=this.nadeMeshes.get(n);l||(l=new Ht(new jn(.035,.035,.1,8),new Ee({color:s==="he"?3885612:s==="flash"?10133670:5922918,roughness:.6})),this.scene.add(l),this.nadeMeshes.set(n,l),l.userData.target=new U(r,o,a),l.position.set(r,o,a)),l.userData.target.set(r,o,a),l.position.lerp(l.userData.target,.5),l.rotation.x+=.3}for(let[n,s]of this.nadeMeshes)t.has(n)||(this.scene.remove(s),s.geometry.dispose(),this.nadeMeshes.delete(n));this.itemMeshes=this.itemMeshes||new Map;let e=new Set;for(let[n,s,r,o,a]of this.items||[])if(e.add(n),!this.itemMeshes.has(n)){let l=new Ht(ns(Se[s].model),no);l.position.set(r,o+.05,a),l.rotation.set(0,n*1.7%6.28,Math.PI/2),this.scene.add(l),this.itemMeshes.set(n,l)}for(let[n,s]of this.itemMeshes)e.has(n)||(this.scene.remove(s),this.itemMeshes.delete(n))}updateNightLights(t){if(!this.nightLights.length||(this.nlNext||0)>t)return;this.nlNext=t+500;let e=this.me.body,n=[...this.lamps].sort((s,r)=>Math.hypot(s.x-e.x,s.z-e.z)-Math.hypot(r.x-e.x,r.z-e.z)).slice(0,this.nightLights.length);this.nightLights.forEach((s,r)=>{let o=n[r];if(!o){s.intensity=0;return}let a=o.a||0;s.position.set(o.x+Math.cos(a)*1.7,o.y1-.6,o.z+Math.sin(a)*1.7),s.intensity=22})}render(t){let e=this.app,n=e.renderer,s=this.me,r=n.domElement;r.clientWidth&&(r.clientWidth!==this.vw||r.clientHeight!==this.vh)&&(this.vw=r.clientWidth,this.vh=r.clientHeight,n.setSize(this.vw,this.vh,!1),this.camera.aspect=this.bgCamera.aspect=this.vw/this.vh,this.camera.updateProjectionMatrix(),this.bgCamera.updateProjectionMatrix());let o,a,l,c,h;if(!s.alive&&this.spectating&&this.spectating.pos){let f=this.spectating;o=f.pos.x,a=f.pos.y+1.55-f.crouch*.45,l=f.pos.z,c=f.yaw,h=f.pitch}else if(!s.alive&&this.state==="playing"){let f=s.body,p=Math.min(1,(performance.now()-(this.deathAt||0))/600);o=f.x,a=f.y+1.6-p*1.1,l=f.z,c=s.yaw,h=s.pitch*(1-p)-p*.2}else{let f=this.eyePos();o=f.x,a=f.y,l=f.z,c=s.yaw,h=s.pitch}this.debugCam&&({x:o,y:a,z:l,yaw:c,pitch:h}=this.debugCam);let d=this.shake;this.camera.position.set(o+(Math.random()-.5)*d*.08,a+(Math.random()-.5)*d*.08,l),this.camera.rotation.set(h+this.punch.x*.9,c+this.punch.y*.9,0);let u=Se[s.weapon],m=this.scopeLevel&&u&&u.zoom?u.zoom[this.scopeLevel-1]:1,g=e.settings.fov/m;if(Math.abs(this.camera.fov-g)>.01&&(this.camera.fov=g,this.camera.updateProjectionMatrix(),this.bgCamera.fov=g,this.bgCamera.updateProjectionMatrix()),this.bgCamera.position.copy(this.camera.position),this.bgCamera.quaternion.copy(this.camera.quaternion),e.audio.setListener(o,a,l,c),this.sun.castShadow){let f=150/this.q.shadowSize,p=Math.round(o/f)*f,y=Math.round(l/f)*f;this.sun.position.set(p+this.sunDir.x*200,a+this.sunDir.y*200,y+this.sunDir.z*200),this.sun.target.position.set(p,a,y),this.sun.target.updateMatrixWorld()}let x=this.viewmodel;x.visible=s.alive,x.update(t,{speed:Qr(s.body),onGround:s.body.onGround,lookDX:this.lookDelta?.[0]||0,lookDY:this.lookDelta?.[1]||0,scoped:this.scopeLevel>0,aspect:innerWidth/innerHeight}),n.autoClear=!1,n.clear(),n.render(this.bgScene,this.bgCamera),n.clearDepth(),n.render(this.scene,this.camera),s.alive&&x.render(n)}dispose(){this.running=!1;for(let t of this.unsub)t();removeEventListener("resize",this.onResize),this.input?.destroy(),this.hud?.destroy(),this.city?.dispose(),this.props?.dispose(this.scene),this.envRT?.dispose(),this.scene?.traverse(t=>{t.geometry&&t.geometry.dispose()})}};function _f(){return new Promise(i=>requestAnimationFrame(()=>i()))}function Ph(i){return String(i??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function iv(i){let t={joined:"sysJoined",left:"sysLeft",newHost:"sysNewHost",halftime:"sysHalftime",bombDropped:"sysBombDropped",bombPicked:"sysBombPicked"}[i.key];return t?ot(t,i.args||{}):i.key}var Bi=window.FaerodAndroid?"android":window.faerodDesktop?"windows":/iPhone|iPad|iPod/i.test(navigator.userAgent)?"ios":"web";function Ih(i){if(window.FaerodAndroid&&window.FaerodAndroid.openUrl)return window.FaerodAndroid.openUrl(i);if(window.faerodDesktop)return window.faerodDesktop.openExternal(i);window.open(i,"_blank")||(location.href=i)}async function bf(i,t,e){if(window.FaerodAndroid&&window.FaerodAndroid.share)return window.FaerodAndroid.share(i,t),!0;if(navigator.share)try{return await navigator.share({title:i,text:t,url:e}),!0}catch{return!1}return Lh(t)}async function Lh(i){if(window.FaerodAndroid&&window.FaerodAndroid.copy)return window.FaerodAndroid.copy(i),!0;if(window.faerodDesktop&&window.faerodDesktop.copy)return window.faerodDesktop.copy(i),!0;try{return await navigator.clipboard.writeText(i),!0}catch{let t=document.createElement("textarea");t.value=i,document.body.appendChild(t),t.select();let e=!1;try{e=document.execCommand("copy")}catch{}return t.remove(),e}}function Mf(i){if(!i)return null;try{try{i=decodeURIComponent(String(i))}catch{}let t=String(i).match(/(?:join\/|\/j\/|[?&]join=)([A-Z0-9]{5})/i);if(!t)return null;let e=(String(i).match(/[?&]p=([^&#]*)/)||[])[1],n=(String(i).match(/[?&]s=([^&#]*)/)||[])[1],s=r=>{try{return decodeURIComponent(r)}catch{return r}};return{code:t[1].toUpperCase(),pw:e?s(e):"",server:n?s(n):""}}catch{return null}}function Sf(i){window.__faerodDeepLink=n=>{let s=Mf(n);s&&i(s)},window.faerodDesktop&&window.faerodDesktop.onDeepLink&&window.faerodDesktop.onDeepLink(n=>window.__faerodDeepLink(n));let t=window.FaerodAndroid&&window.FaerodAndroid.initialLink&&window.FaerodAndroid.initialLink()||location.href,e=Mf(t);e&&setTimeout(()=>i(e),0)}function wf(){window.FaerodAndroid?.quit?window.FaerodAndroid.quit():window.faerodDesktop?.quit&&window.faerodDesktop.quit()}var D=i=>document.getElementById(i),gn=i=>String(i??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),Nl=["s-main","s-create","s-find","s-code","s-lobby","s-settings","s-howto","loading"],Dh=class{constructor(){this.settings=Wd(),dh(this.settings.lang),this.net=new fl,this.audio=new pl,this.audio.setVolume(this.settings.volume),this.isTouch=matchMedia("(pointer: coarse)").matches||navigator.maxTouchPoints>1,this.quality=mh(this.settings.quality),this.room=null,this.myId=0,this.game=null,this.lastPassword="",this.pendingJoin=null,this.mapChoice={x:0,z:0,name:"\xD6zl\xFCce"},this.prevScreen="s-main"}async boot(){fh(),this.show("loading"),this.loading(.05,"B\xF6lge verisi y\xFCkleniyor\u2026"),this.renderer=new ll({canvas:D("game"),antialias:this.quality.antialias,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,this.quality.pixel*(devicePixelRatio>1?1.5:1),2)),this.renderer.setSize(innerWidth,innerHeight,!1),this.renderer.outputColorSpace=Be,this.renderer.toneMapping=Or,this.renderer.shadowMap.enabled=this.quality.shadows,this.renderer.shadowMap.type=this.quality.name==="high"||this.quality.name==="ultra"?fa:Ki,addEventListener("resize",()=>this.renderer.setSize(innerWidth,innerHeight,!1));let e=await(await fetch("data/region.bin")).arrayBuffer();this.loading(.6,"Harita haz\u0131rlan\u0131yor\u2026"),this.region=zd(e),this.index=Vd(this.region),this.loading(.9,ot("connecting")),this.bindMenus(),this.bindNet(),this.connect(),Sf(n=>this.handleInvite(n)),(Bi==="android"||Bi==="windows")&&D("m-quit").classList.remove("hidden"),document.addEventListener("pointerdown",()=>this.audio.unlock(),{once:!1}),this.show("s-main")}connect(){let{ws:t}=dl(this.settings);this.net.connect(t)}loading(t,e,n){D("loadbar").style.width=Math.round(t*100)+"%",e&&(D("loadtext").textContent=e),n!==void 0&&(D("loadtip").textContent=n)}show(t){for(let e of Nl)D(e).classList.toggle("hidden",e!==t);t!=="loading"&&t!=="s-settings"&&(this.prevScreen=t),document.body.classList.toggle("ingame",!t)}hideAll(){for(let t of Nl)D(t).classList.add("hidden");document.body.classList.add("ingame")}toast(t,e=1800){let n=D("toast");n.textContent=t,n.classList.add("on"),clearTimeout(this._tt),this._tt=setTimeout(()=>n.classList.remove("on"),e)}alert(t){D("alert-text").innerHTML=t,D("alert-extra").innerHTML="",D("m-alert").classList.remove("hidden")}bindNet(){let t=this.net;t.on("status",e=>{let n=D("netstatus");n.className="status "+(e==="online"?"online":e==="offline"?"offline":""),n.querySelector("span").textContent=ot(e==="online"?"connected":e==="offline"?"offline":"connecting")}),t.on("open",()=>{if(t.send({t:"hello",name:this.settings.name,key:this.settings.key,lang:Cn(),version:1}),this.pendingJoin){let e=this.pendingJoin;this.pendingJoin=null,this.join(e.code,e.pw)}}),t.on("welcome",e=>{this.myId=e.id}),t.on("rooms",e=>this.renderRooms(e.list)),t.on("joined",e=>{this.room=e.room,this.myId=e.you,this.settings.lastRoom=e.room.code,es(this.settings),this.game||this.showLobby()}),t.on("room",e=>{this.room=e.room,this.game||this.renderLobby()}),t.on("left",()=>{this.room=null,this.endGame(),this.show("s-main")}),t.on("kicked",()=>{this.room=null,this.endGame(),this.show("s-main"),this.alert(ot("kicked"))}),t.on("start",e=>this.startGame(e)),t.on("lobby",()=>{this.endGame(),D("m-end").classList.add("hidden"),this.showLobby()}),t.on("chat",e=>{this.game||this.lobbyLog(`<b class="${e.team==="T"?"t":e.team==="CT"?"ct":""}">${gn(e.from)}:</b> ${gn(e.text)}`)}),t.on("sys",e=>{this.game||this.lobbyLog(`<i>${gn(rv(e))}</i>`)}),t.on("err",e=>{let n={noRoom:"errNoRoom",full:"errFull",password:"errPassword",banned:"errBanned",version:"errVersion"};n[e.code]&&(e.code==="password"&&(this.show("s-code"),D("code-input").value=this.joinTry?.code||"",D("code-pw").focus()),this.alert(ot(n[e.code])))}),t.on("close",()=>{this.game&&this.toast(ot("offline"),3e3)})}join(t,e=""){if(t=String(t||"").toUpperCase().trim(),t.length===5){if(this.lastPassword=e,this.joinTry={code:t,pw:e},!this.net.open){this.pendingJoin={code:t,pw:e},this.toast(ot("connecting"));return}this.net.send({t:"join",code:t,password:e})}}handleInvite(t){if(!(this.room&&this.room.code===t.code)){if(t.server&&/^https?:\/\//i.test(t.server)&&(Bi==="android"||Bi==="windows"||location.origin!==t.server)&&dl(this.settings).http.replace(/\/$/,"")!==t.server.replace(/\/$/,"")){this.settings.server=t.server,es(this.settings),this.pendingJoin={code:t.code,pw:t.pw},this.room&&this.net.send({t:"leave"}),this.connect(),this.toast(ot("connecting"));return}this.join(t.code,t.pw)}}bindMenus(){for(let r of document.querySelectorAll(".langsw button"))r.classList.toggle("on",r.dataset.lang===Cn()),r.onclick=()=>this.setLanguage(r.dataset.lang);D("name-input").value=this.settings.name;let t=()=>{let r=D("name-input").value.replace(/[<>]/g,"").trim().slice(0,20);r&&(this.settings.name=r,es(this.settings),this.net.send({t:"name",name:r}),this.toast("\u2713 "+r))};D("name-save").onclick=t,D("name-input").onkeydown=r=>{r.key==="Enter"&&t()},D("m-create").onclick=()=>this.openCreate(),D("m-find").onclick=()=>{this.show("s-find"),this.refreshRooms()},D("m-code").onclick=()=>{this.show("s-code"),D("code-input").focus()},D("m-settings").onclick=()=>this.openSettings(),D("m-howto").onclick=()=>this.show("s-howto"),D("m-quit").onclick=()=>wf();for(let r of document.querySelectorAll("[data-back]"))r.onclick=()=>{if(this.game&&r.closest("#s-settings")){D("s-settings").classList.add("hidden"),D("s-settings").style.zIndex="",this.game.menuOpen=!1,this.game.input.lock();return}this.show(this.room?"s-lobby":"s-main")};for(let r of document.querySelectorAll("[data-close]"))r.onclick=()=>r.closest(".modal").classList.add("hidden");D("find-refresh").onclick=()=>this.refreshRooms(),D("code-join").onclick=()=>this.join(D("code-input").value,D("code-pw").value),D("code-input").oninput=r=>{r.target.value=r.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"")};let e=D("f-mode");e.innerHTML=Object.values(Ne).map(r=>`<option value="${r.id}">${gn(Te(r.name))}</option>`).join(""),e.onchange=()=>this.toggleModeFields(),D("f-max").oninput=()=>{D("f-max-v").textContent=D("f-max").value},D("f-bots").oninput=()=>{D("f-bots-v").textContent=D("f-bots").value},D("f-pick").onclick=r=>{r.preventDefault(),this.openMapPicker()},D("f-map").onchange=()=>{let r=D("f-map").value;if(r==="custom")return;let o=this.presets()[+r];this.mapChoice={x:o.x,z:o.z,name:o.name}},D("f-submit").onclick=()=>this.submitCreate(),D("lobby-invite").onclick=()=>this.openInvite(),D("lobby-team-t").onclick=()=>this.net.send({t:"team",team:"T"}),D("lobby-team-ct").onclick=()=>this.net.send({t:"team",team:"CT"}),D("lobby-team-spec").onclick=()=>this.net.send({t:"team",team:"SPEC"}),D("lobby-botp").onclick=()=>this.net.send({t:"bots",n:(this.room?.settings?.bots||0)+1}),D("lobby-botm").onclick=()=>this.net.send({t:"bots",n:Math.max(0,(this.room?.settings?.bots||0)-1)}),D("lobby-edit").onclick=()=>this.openCreate(!0),D("lobby-start").onclick=()=>{this.audio.unlock(),this.net.send({t:"start"})},D("lobby-leave").onclick=()=>this.net.send({t:"leave"});let n=()=>{let r=D("lobby-chat-in").value.trim();r&&this.net.send({t:"chat",text:r}),D("lobby-chat-in").value=""};D("lobby-chat-send").onclick=n,D("lobby-chat-in").onkeydown=r=>{r.key==="Enter"&&n()},D("inv-pw").onchange=()=>this.renderInvite(),D("inv-wa").onclick=()=>Ih("https://wa.me/?text="+encodeURIComponent(this.inviteText())),D("inv-mail").onclick=()=>Ih(`mailto:?subject=${encodeURIComponent(ot("inviteSubject"))}&body=${encodeURIComponent(this.inviteText())}`),D("inv-share").onclick=async()=>{await bf(ot("inviteSubject"),this.inviteText(),this.inviteLink())},D("inv-copy").onclick=async()=>{await Lh(this.inviteText())&&this.toast(ot("copied"))},D("p-resume").onclick=()=>this.closePause(),D("p-team").onclick=()=>{D("m-pause").classList.add("hidden"),this.openTeamSelect()},D("p-invite").onclick=()=>{D("m-pause").classList.add("hidden"),this.openInvite()},D("p-settings").onclick=()=>{D("m-pause").classList.add("hidden"),this.openSettings(!0)},D("p-lobby").onclick=()=>{D("m-pause").classList.add("hidden"),this.net.send({t:"toLobby"})},D("p-leave").onclick=()=>{D("m-pause").classList.add("hidden"),this.net.send({t:"leave"})},D("tm-t").onclick=()=>this.pickTeam("T"),D("tm-ct").onclick=()=>this.pickTeam("CT"),D("tm-auto").onclick=()=>this.pickTeam("AUTO"),D("tm-spec").onclick=()=>this.pickTeam("SPEC");let s=()=>{let r=D("chat-in").value.trim();r&&this.net.send({t:"chat",text:r,team:this.chatTeam}),D("chat-in").value="",this.closeChat()};D("chat-send").onclick=s,D("chat-in").onkeydown=r=>{r.key==="Enter"&&s(),r.key==="Escape"&&this.closeChat(),r.stopPropagation()},D("end-menu").onclick=()=>{D("m-end").classList.add("hidden"),this.net.send({t:"leave"})},D("end-lobby").onclick=()=>{D("m-end").classList.add("hidden"),this.room&&this.room.hostId===this.myId?this.net.send({t:"toLobby"}):(this.endGame(),this.showLobby())},D("o-save").onclick=()=>this.saveSettingsForm();for(let r of["o-sens","o-tsens","o-fov","o-vol"])D(r).oninput=()=>{D(r+"-v").textContent=D(r).value};this.bindMapPicker()}setLanguage(t){this.settings.lang=t,es(this.settings),dh(t),fh();for(let e of document.querySelectorAll(".langsw button"))e.classList.toggle("on",e.dataset.lang===t);D("f-mode").innerHTML=Object.values(Ne).map(e=>`<option value="${e.id}">${gn(Te(e.name))}</option>`).join(""),this.room&&this.renderLobby(),this.net.emit("status",this.net.open?"online":"offline")}presets(){let t=[{name:"\xD6zl\xFCce \xB7 Alt\u0131n\u015Fehir (ba\u015Flang\u0131\xE7)",x:0,z:0}];for(let e of this.region.places)Math.hypot(e.x,e.z)>Js-150||t.some(n=>Math.hypot(n.x-e.x,n.z-e.z)<300)||t.push({name:e.name,x:e.x,z:e.z});return t.slice(0,40)}openCreate(t=!1){this.editing=t;let e=t&&this.room?{...this.room.settings}:{...this.settings.lastSettings||{}},n=a=>e[a]!==void 0?e[a]:Gd[a].def;D("create-title").textContent=t?ot("editSettings"):ot("createTitle"),D("f-submit").textContent=t?ot("save"):ot("create"),D("f-name").value=t?n("name"):e.name||`${this.settings.name} - FAEROD`,D("f-mode").value=n("mode");let s=this.presets();t&&(this.mapChoice={x:n("mapX"),z:n("mapZ"),name:n("mapName")});let r=s.map((a,l)=>`<option value="${l}">${gn(a.name)}</option>`),o=s.findIndex(a=>Math.hypot(a.x-this.mapChoice.x,a.z-this.mapChoice.z)<5);o<0&&r.push(`<option value="custom">\u{1F4CD} ${gn(this.mapChoice.name)}</option>`),D("f-map").innerHTML=r.join(""),D("f-map").value=o<0?"custom":String(o),D("f-size").value=n("mapSize"),D("f-max").value=n("maxPlayers"),D("f-max-v").textContent=n("maxPlayers"),D("f-pw").value=t&&this.lastPassword||"",D("f-bots").value=n("bots"),D("f-bots-v").textContent=n("bots"),D("f-botlevel").value=n("botLevel"),D("f-public").checked=n("isPublic"),D("f-ff").checked=n("friendlyFire"),D("f-rounds").value=String(n("maxRounds")),D("f-roundtime").value=n("roundTime"),D("f-freeze").value=n("freezeTime"),D("f-buytime").value=n("buyTime"),D("f-bombtime").value=n("bombTime"),D("f-money").value=String(n("startMoney")),D("f-timelimit").value=n("timeLimit"),D("f-killlimit").value=n("killLimit"),D("f-tod").value=n("timeOfDay"),D("f-weather").value=n("weather"),D("f-balance").checked=n("autoBalance"),this.toggleModeFields(),this.show("s-create")}toggleModeFields(){let t=D("f-mode").value==="bomb";for(let e of document.querySelectorAll(".mode-bomb"))e.classList.toggle("hidden",!t);for(let e of document.querySelectorAll(".mode-dm"))e.classList.toggle("hidden",t)}submitCreate(){let t={name:D("f-name").value,mode:D("f-mode").value,maxPlayers:+D("f-max").value,password:D("f-pw").value.trim(),isPublic:D("f-public").checked,mapX:this.mapChoice.x,mapZ:this.mapChoice.z,mapName:this.mapChoice.name,mapSize:D("f-size").value,maxRounds:+D("f-rounds").value,roundTime:+D("f-roundtime").value,freezeTime:+D("f-freeze").value,buyTime:+D("f-buytime").value,bombTime:+D("f-bombtime").value,startMoney:+D("f-money").value,timeLimit:+D("f-timelimit").value,killLimit:+D("f-killlimit").value,friendlyFire:D("f-ff").checked,autoBalance:D("f-balance").checked,bots:+D("f-bots").value,botLevel:D("f-botlevel").value,timeOfDay:D("f-tod").value,weather:D("f-weather").value};this.lastPassword=t.password;let{password:e,...n}=t;if(this.settings.lastSettings=n,es(this.settings),!this.net.open){this.alert(ot("offline"));return}this.audio.unlock(),this.editing&&this.room?(this.net.send({t:"settings",settings:t}),this.showLobby()):this.net.send({t:"create",settings:t})}refreshRooms(){D("room-list").innerHTML=`<div class="empty">${ot("connecting")}</div>`,this.net.send({t:"list"})}renderRooms(t){let e=D("room-list");if(!t.length){e.innerHTML=`<div class="empty">${ot("noRooms")}</div>`;return}e.innerHTML=t.map(n=>`<div class="room"><div><b>${n.locked?"\u{1F512} ":""}${gn(n.name)}</b><small>${gn(Te(Ne[n.mode]?.name))} \xB7 ${gn(n.mapName)} \xB7 ${n.state==="lobby"?ot("inLobby"):ot("inGame")}</small></div><span class="cnt">${n.players}/${n.max}</span><button class="btn small primary" data-code="${n.code}" data-locked="${n.locked?1:0}">${ot("join")}</button></div>`).join("");for(let n of e.querySelectorAll("button[data-code]"))n.onclick=()=>{n.dataset.locked==="1"?(this.show("s-code"),D("code-input").value=n.dataset.code,D("code-pw").value="",D("code-pw").focus()):this.join(n.dataset.code,"")}}showLobby(){this.show("s-lobby"),this.renderLobby()}renderLobby(){let t=this.room;if(!t||!t.settings)return;let e=t.settings,n=t.hostId===this.myId;D("lobby-name").textContent=t.name,D("lobby-code").textContent=t.code,D("lobby-summary").textContent=`${Te(Ne[e.mode].name)} \xB7 ${e.mapName} \xB7 ${ot(e.mapSize)} \xB7 ${t.players+t.bots}/${e.maxPlayers}${t.locked?" \xB7 \u{1F512}":""}`,D("lobby-team-t").textContent=Te(Gn.T),D("lobby-team-ct").textContent=Te(Gn.CT);let s=Ne[e.mode].teams;D("lobby-team-t").classList.toggle("hidden",!s),D("lobby-team-ct").classList.toggle("hidden",!s);for(let l of document.querySelectorAll(".host-only"))l.classList.toggle("hidden",!n);D("lobby-wait").classList.toggle("hidden",n);let r=s?[["T","t"],["CT","ct"]]:[["T",""]],o="";for(let[l,c]of r){let h=t.list.filter(d=>s?d.team===l:d.team!=="SPEC");o+=`<div class="col ${c}"><h3><span>${s?Te(Gn[l]):ot("players")}</span><span>${h.length}</span></h3>`;for(let d of h)o+=this.playerRow(d,n,t);o+="</div>"}let a=t.list.filter(l=>l.team==="SPEC");a.length&&(o+=`<div class="col"><h3><span>${Te(Gn.SPEC)}</span><span>${a.length}</span></h3>${a.map(l=>this.playerRow(l,n,t)).join("")}</div>`),D("lobby-teams").innerHTML=o;for(let l of D("lobby-teams").querySelectorAll("[data-kick]"))l.onclick=()=>this.net.send({t:"kick",id:+l.dataset.kick})}playerRow(t,e,n){return`<div class="pl ${t.id===this.myId?"me":""}"><span>${gn(t.name)}${t.id===n.hostId?`<span class="tag host">${ot("host")}</span>`:""}${t.bot?`<span class="tag">${ot("bot")}</span>`:""}</span>${e&&t.id!==this.myId?`<button class="btn small" data-kick="${t.id}">${ot("kick")}</button>`:`<small>${t.bot?"":t.ping+" ms"}</small>`}</div>`}lobbyLog(t){let e=D("lobby-log"),n=document.createElement("div");n.innerHTML=t,e.append(n),e.scrollTop=e.scrollHeight}inviteLink(){let{http:t}=dl(this.settings),e=D("inv-pw").checked&&this.lastPassword?`?p=${encodeURIComponent(this.lastPassword)}`:"";return`${t}/j/${this.room.code}${e}`}inviteText(){let t=D("inv-pw").checked&&this.lastPassword?Cn()==="en"?`
Password: ${this.lastPassword}`:`
\u015Eifre: ${this.lastPassword}`:"";return ot("inviteText",{room:this.room.name,map:this.room.settings?.mapName||this.room.mapName,link:this.inviteLink(),code:this.room.code,pw:t})}openInvite(){this.room&&(D("inv-pw-row").classList.toggle("hidden",!this.room.locked||!this.lastPassword),this.renderInvite(),D("m-invite").classList.remove("hidden"),this.game?.input.unlock())}renderInvite(){D("inv-link").textContent=this.inviteLink()}openSettings(t=!1){let e=this.settings;D("o-lang").value=e.lang,D("o-quality").value=e.quality,D("o-sens").value=e.sensitivity,D("o-tsens").value=e.touchSens,D("o-fov").value=e.fov,D("o-vol").value=e.volume;for(let n of["o-sens","o-tsens","o-fov","o-vol"])D(n+"-v").textContent=D(n).value;if(D("o-cross").value=e.crosshair,D("o-fps").checked=e.showFps,D("o-voice").checked=e.voice,D("o-invert").checked=e.invertY,D("o-server").value=e.server,this.settingsInGame=t,t){for(let n of Nl)D(n).classList.add("hidden");D("s-settings").classList.remove("hidden"),D("s-settings").style.zIndex=45}else this.show("s-settings")}saveSettingsForm(){let t=this.settings,e=t.server,n=t.quality;t.quality=D("o-quality").value,t.sensitivity=+D("o-sens").value,t.touchSens=+D("o-tsens").value,t.fov=+D("o-fov").value,t.volume=+D("o-vol").value,t.crosshair=D("o-cross").value,t.showFps=D("o-fps").checked,t.voice=D("o-voice").checked,t.invertY=D("o-invert").checked,t.server=D("o-server").value.trim(),es(t),this.audio.setVolume(t.volume),D("o-lang").value!==Cn()&&this.setLanguage(D("o-lang").value),t.quality!==n&&(this.quality=mh(t.quality),this.toast(Cn()==="en"?"Graphics apply from the next map":"Grafik ayar\u0131 bir sonraki haritada uygulan\u0131r",2500)),t.server!==e&&!this.room&&this.connect(),this.game&&(document.getElementById("crosshair").style.setProperty("--cc",t.crosshair),D("fps").textContent=""),D("s-settings").style.zIndex="",this.settingsInGame&&this.game?(D("s-settings").classList.add("hidden"),this.game.menuOpen=!1,this.game.input.lock()):this.show(this.room?"s-lobby":"s-main")}bindMapPicker(){let t=D("mapcanvas");this.mp={zoom:1,cx:0,cz:0,img:null,sel:null,drag:null,pointers:new Map};let e=new Image;e.src="data/backdrop-small.jpg",e.onload=()=>{this.mp.img=e,this.drawMap()};let n=(s,r)=>{let o=t.getBoundingClientRect(),a=this.mp,l=Math.min(o.width,o.height)/20600*a.zoom;return{x:a.cx+(s-o.left-o.width/2)/l,z:a.cz+(r-o.top-o.height/2)/l}};t.onpointerdown=s=>{t.setPointerCapture(s.pointerId),this.mp.pointers.set(s.pointerId,{x:s.clientX,y:s.clientY,sx:s.clientX,sy:s.clientY})},t.onpointermove=s=>{let r=this.mp.pointers.get(s.pointerId);if(!r)return;let o=t.getBoundingClientRect(),a=Math.min(o.width,o.height)/20600*this.mp.zoom;if(this.mp.pointers.size===1)this.mp.cx-=(s.clientX-r.x)/a,this.mp.cz-=(s.clientY-r.y)/a;else if(this.mp.pointers.size===2){let l=[...this.mp.pointers.entries()].find(([d])=>d!==s.pointerId)[1],c=Math.hypot(r.x-l.x,r.y-l.y),h=Math.hypot(s.clientX-l.x,s.clientY-l.y);c>10&&(this.mp.zoom=Math.max(1,Math.min(24,this.mp.zoom*(h/c))))}r.x=s.clientX,r.y=s.clientY,this.drawMap()},t.onpointerup=s=>{let r=this.mp.pointers.get(s.pointerId);if(this.mp.pointers.delete(s.pointerId),r&&Math.hypot(s.clientX-r.sx,s.clientY-r.sy)<8){let o=n(s.clientX,s.clientY),a=Math.hypot(o.x,o.z);a>Js-150&&(o.x*=(Js-150)/a,o.z*=(Js-150)/a),this.mp.sel=o,this.drawMap();let l=null,c=1/0;for(let d of this.region.places){let u=Math.hypot(d.x-o.x,d.z-o.z);u<c&&(c=u,l=d)}let h=this.index.query(o.x-120,o.z-120,o.x+120,o.z+120);this.mp.selName=l?`${l.name}${c>400?" "+ot("near"):""}`:ot("unnamed"),D("mp-info").innerHTML=`\u{1F4CD} <b>${gn(this.mp.selName)}</b> \xB7 ${h.b.length} bina / buildings`}},t.onwheel=s=>{s.preventDefault(),this.mp.zoom=Math.max(1,Math.min(24,this.mp.zoom*(s.deltaY<0?1.25:.8))),this.drawMap()},D("mp-zoomin").onclick=()=>{this.mp.zoom=Math.min(24,this.mp.zoom*1.5),this.drawMap()},D("mp-zoomout").onclick=()=>{this.mp.zoom=Math.max(1,this.mp.zoom/1.5),this.drawMap()},D("mp-close").onclick=()=>D("mappick").classList.add("hidden"),D("mp-ok").onclick=()=>{if(this.mp.sel){this.mapChoice={x:Math.round(this.mp.sel.x),z:Math.round(this.mp.sel.z),name:this.mp.selName||ot("unnamed")};let s=D("f-map"),r=s.querySelector('option[value="custom"]');r||(r=document.createElement("option"),r.value="custom",s.append(r)),r.textContent="\u{1F4CD} "+this.mapChoice.name,s.value="custom"}D("mappick").classList.add("hidden")}}openMapPicker(){D("mappick").classList.remove("hidden"),this.mp.sel={x:this.mapChoice.x,z:this.mapChoice.z},this.mp.cx=this.mapChoice.x,this.mp.cz=this.mapChoice.z,this.mp.zoom=4,D("mp-info").textContent=ot("mapPickHint"),requestAnimationFrame(()=>this.drawMap())}drawMap(){let t=D("mapcanvas"),e=t.getBoundingClientRect(),n=this.mp,s=Math.min(2,devicePixelRatio||1);t.width=e.width*s,t.height=e.height*s;let r=t.getContext("2d");r.setTransform(s,0,0,s,0,0),r.fillStyle="#000",r.fillRect(0,0,e.width,e.height);let o=Math.min(e.width,e.height)/20600*n.zoom,a=c=>e.width/2+(c-n.cx)*o,l=c=>e.height/2+(c-n.cz)*o;if(n.img&&r.drawImage(n.img,a(-10300),l(-10300),20600*o,20600*o),n.zoom>=5){let c=e.width/o/2,h=e.height/o/2,d=this.index.query(n.cx-c,n.cz-h,n.cx+c,n.cz+h);r.fillStyle="rgba(255,190,90,0.75)";for(let u of d.b.slice(0,6e3)){let m=this.region.buildings[u];r.beginPath();for(let g=0;g<m.pts.length;g+=2)(g?r.lineTo:r.moveTo).call(r,a(m.pts[g]),l(m.pts[g+1]));r.fill()}}r.strokeStyle="rgba(245,166,35,0.9)",r.lineWidth=2,r.setLineDash([8,6]),r.beginPath(),r.arc(a(0),l(0),Js*o,0,Math.PI*2),r.stroke(),r.setLineDash([]),r.fillStyle="#fff",r.font="bold 12px Arial";for(let c of this.region.places.slice(0,n.zoom>3?80:25))r.fillText(c.name,a(c.x)+4,l(c.z)-4),r.fillRect(a(c.x)-2,l(c.z)-2,4,4);if(n.sel){let c=ul[D("f-size").value]||240;r.strokeStyle="#ff3b30",r.lineWidth=2.5,r.strokeRect(a(n.sel.x-c/2),l(n.sel.z-c/2),c*o,c*o),r.fillStyle="#ff3b30",r.beginPath(),r.arc(a(n.sel.x),l(n.sel.z),5,0,7),r.fill()}}async startGame(t){this.endGame(),D("m-end").classList.add("hidden"),this.show("loading"),this.loading(.02,ot("loading"),ot("tutorial")),this.audio.unlock();let e=new Dl(this,t);this.game=e;try{await e.build((n,s)=>this.loading(n,`${t.settings.mapName} \u2014 ${s}`))}catch(n){console.error(n),this.alert("Harita olu\u015Fturulamad\u0131: "+n.message),this.endGame(),this.showLobby();return}this.game===e&&(this.hideAll(),this.isTouch||e.input.lock(),this.tryFullscreen())}tryFullscreen(){if(!this.isTouch||Bi==="android"||document.fullscreenElement)return;let t=document.documentElement;t.requestFullscreen&&t.requestFullscreen().then(()=>screen.orientation?.lock?.("landscape").catch(()=>{})).catch(()=>{})}endGame(){this.game&&(this.game.dispose(),this.game=null),document.body.classList.remove("ingame");let t=this.renderer;t&&(t.setClearColor(0),t.clear())}showMatchEnd(t,e){let n=Ne[e.settings.mode].teams,r=`<h3 style="font-size:26px;margin-bottom:10px">${t.winner==="T"?ot("tWin"):t.winner==="CT"?ot("ctWin"):t.winner==="draw"?ot("draw"):`${ot("winner")}: ${gn(t.winner)}`}</h3>`;n&&(r+=`<div class="summary" style="font-size:18px;margin-bottom:10px"><span class="t">${t.score.T}</span> : <span class="ct">${t.score.CT}</span></div>`),r+=`<table class="sb ct"><tr><th>${ot("players")}</th><th>${ot("kills")}</th><th>${ot("deaths")}</th><th>${ot("assists")}</th><th>${ot("score")}</th><th>${ot("mvp")}</th></tr>`;for(let o of t.stats)r+=`<tr class="${o.id===this.myId?"me":""}"><td><span class="${o.team==="T"?"t":"ct"}">\u25CF</span> ${gn(o.name)}</td><td>${o.kills}</td><td>${o.deaths}</td><td>${o.assists}</td><td>${o.score}</td><td>${"\u2605".repeat(Math.min(5,o.mvp))}</td></tr>`;r+="</table>",D("end-body").innerHTML=r,D("m-end").classList.remove("hidden")}openPause(){if(this.game){this.game.menuOpen=!0,this.game.input.release(),this.game.input.unlock();for(let t of document.querySelectorAll("#m-pause .host-only"))t.classList.toggle("hidden",!(this.room&&this.room.hostId===this.myId));D("m-pause").classList.remove("hidden")}}closePause(){D("m-pause").classList.add("hidden"),this.game&&(this.game.menuOpen=!1,this.game.input.lock())}openTeamSelect(){if(!this.game)return;this.game.menuOpen=!0,this.game.input.release(),this.game.input.unlock(),D("tm-t").textContent=Te(Gn.T),D("tm-ct").textContent=Te(Gn.CT);let t=Ne[this.game.settings.mode].teams;D("tm-t").classList.toggle("hidden",!t),D("tm-ct").classList.toggle("hidden",!t),D("m-team").classList.remove("hidden"),D("m-team").querySelector("[data-close]").onclick=()=>{D("m-team").classList.add("hidden"),this.game&&(this.game.menuOpen=!1,this.game.input.lock())}}pickTeam(t){this.net.send({t:"team",team:t}),D("m-team").classList.add("hidden"),this.game&&(this.game.menuOpen=!1,this.game.input.lock())}openChat(t){this.game&&(this.chatTeam=t,this.game.menuOpen=!0,this.game.input.release(),D("m-chat").classList.remove("hidden"),setTimeout(()=>D("chat-in").focus(),30))}closeChat(){D("m-chat").classList.add("hidden"),this.game&&(this.game.menuOpen=!1,this.game.input.lock())}onBack(){let t=[...document.querySelectorAll(".modal")].find(n=>!n.classList.contains("hidden"));if(t)return t.id==="m-pause"?this.closePause():t.id==="m-chat"?this.closeChat():(t.classList.add("hidden"),this.game&&(this.game.menuOpen=!1)),"handled";if(this.game)return D("s-settings").classList.contains("hidden")?document.getElementById("buymenu").classList.contains("hidden")?(this.openPause(),"handled"):(this.game.hud.toggleBuy(!1),"handled"):(this.saveSettingsForm(),"handled");let e=Nl.find(n=>!D(n).classList.contains("hidden"));return e==="s-lobby"?(this.net.send({t:"leave"}),"handled"):e&&e!=="s-main"&&e!=="loading"?(this.show(this.room?"s-lobby":"s-main"),"handled"):"exit"}};function rv(i){let t={joined:"sysJoined",left:"sysLeft",newHost:"sysNewHost",halftime:"sysHalftime",bombDropped:"sysBombDropped",bombPicked:"sysBombPicked"}[i.key];return t?ot(t,i.args||{}):i.key}"serviceWorker"in navigator&&Bi!=="android"&&Bi!=="windows"&&location.protocol.startsWith("http")&&location.hostname!=="localhost"&&navigator.serviceWorker.register("sw.js").catch(()=>{});var Tf=new Dh;window.faerodApp=Tf;Tf.boot().catch(i=>{console.error(i),document.getElementById("loadtext").textContent="Hata / Error: "+i.message});})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
