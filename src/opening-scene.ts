// Three.js layer for the opening screen: the emblem floats and tilts in 3D, with tumbling petals and gold dust.
// Loaded on demand. If WebGL is missing, the plain <img> in the emblem slot stays on screen instead.
import {BufferAttribute,BufferGeometry,CanvasTexture,Color,DoubleSide,DynamicDrawUsage,Group,InstancedMesh,LinearFilter,Mesh,MeshBasicMaterial,NoColorSpace,Object3D,PerspectiveCamera,PlaneGeometry,Points,PointsMaterial,Scene,Shape,ShapeGeometry,ShaderMaterial,SRGBColorSpace,Texture,TextureLoader,WebGLRenderer} from 'three';

const PETAL_COLORS=['#fff0d2','#f6dcae','#f4c9b4'];
const clamp01=(v:number)=>Math.min(1,Math.max(0,v));
const easeOut=(v:number)=>1-Math.pow(1-clamp01(v),3);
const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;

function softDot(stops:[number,string][]){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=128;
 const ctx=canvas.getContext('2d')!,gradient=ctx.createRadialGradient(64,64,0,64,64,64);
 stops.forEach(([at,color])=>gradient.addColorStop(at,color));
 ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
 const texture=new CanvasTexture(canvas);texture.colorSpace=SRGBColorSpace;
 return texture;
}

export function startOpeningScene(canvas:HTMLCanvasElement,slot:HTMLElement,emblemUrl:string,onReady:()=>void){
 const renderer=new WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));
 const scene=new Scene(),camera=new PerspectiveCamera(35,1,1,6000);
 const small=innerWidth<760;

 // Emblem, with a soft shadow and glow behind it that shift as it tilts
 const emblem=new Group();scene.add(emblem);
 const uniforms={map:{value:null as Texture|null},time:{value:0},fade:{value:0}};
 const face=new Mesh(new PlaneGeometry(1,1,24,24),new ShaderMaterial({uniforms,transparent:true,depthWrite:false,
  vertexShader:`uniform float time;varying vec2 vUv;void main(){vUv=uv;vec3 p=position;p.z+=sin(uv.y*3.14+time*.6)*.012;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
  fragmentShader:`uniform sampler2D map;uniform float time;uniform float fade;varying vec2 vUv;void main(){vec4 c=texture2D(map,vUv);float cycle=mod(time,8.)/2.2;float band=smoothstep(.09,0.,abs(vUv.x+vUv.y*.5-cycle*1.9+.2));gl_FragColor=vec4(c.rgb+band*vec3(1.,.86,.58)*.3*c.a,c.a*fade);}`}));
 const shadowMaterial=new MeshBasicMaterial({color:0x000000,transparent:true,opacity:0,depthWrite:false});
 const shadow=new Mesh(new PlaneGeometry(1,1),shadowMaterial);
 const glowTexture=softDot([[0,'rgba(255,232,190,.62)'],[.45,'rgba(255,214,160,.2)'],[1,'rgba(255,214,160,0)']]);
 const glowMaterial=new MeshBasicMaterial({map:glowTexture,transparent:true,opacity:0,depthWrite:false});
 const glow=new Mesh(new PlaneGeometry(1,1),glowMaterial);
 glow.position.z=-60;shadow.position.z=-24;face.renderOrder=3;shadow.renderOrder=2;glow.renderOrder=1;
 emblem.add(glow,shadow,face);

 const loader=new TextureLoader();
 let aspect=1,loadedAt=0,stopped=false;
 const loaded:Texture[]=[];
 loader.load(emblemUrl,texture=>{
  if(stopped){texture.dispose();return}
  texture.colorSpace=NoColorSpace;texture.anisotropy=renderer.capabilities.getMaxAnisotropy();texture.minFilter=LinearFilter;
  loaded.push(texture);
  uniforms.map.value=texture;shadowMaterial.map=texture;shadowMaterial.needsUpdate=true;
  aspect=texture.image.width/texture.image.height;
  layout();loadedAt=performance.now();onReady();
 });

 // Falling petals
 const petalShape=new Shape();
 petalShape.moveTo(0,-1);petalShape.bezierCurveTo(.75,-.45,.75,.45,0,1);petalShape.bezierCurveTo(-.75,.45,-.75,-.45,0,-1);
 const petalGeometry=new ShapeGeometry(petalShape,8);
 const petalCount=small?14:26;
 const petals=new InstancedMesh(petalGeometry,new MeshBasicMaterial({side:DoubleSide,transparent:true,opacity:.72,depthWrite:false}),petalCount);
 petals.instanceMatrix.setUsage(DynamicDrawUsage);petals.frustumCulled=false;petals.renderOrder=4;scene.add(petals);
 const color=new Color();
 const petalState=Array.from({length:petalCount},(_,i)=>{
  petals.setColorAt(i,color.set(PETAL_COLORS[i%PETAL_COLORS.length]));
  return {x:0,y:0,z:-180+Math.random()*300,size:5+Math.random()*7,fall:16+Math.random()*24,phase:Math.random()*6.28,sway:12+Math.random()*26,rx:Math.random()*6.28,ry:Math.random()*6.28,spinX:.3+Math.random()*.8,spinY:.3+Math.random()*.8,vx:0,vy:0,seeded:false};
 });
 const dummy=new Object3D();

 // Gold dust
 const dustCount=small?70:150;
 const dustPositions=new Float32Array(dustCount*3);
 const dustState=Array.from({length:dustCount},()=>({rise:4+Math.random()*12,phase:Math.random()*6.28}));
 const dustGeometry=new BufferGeometry();dustGeometry.setAttribute('position',new BufferAttribute(dustPositions,3).setUsage(DynamicDrawUsage));
 const dotTexture=softDot([[0,'rgba(255,240,205,1)'],[.3,'rgba(255,224,165,.7)'],[1,'rgba(255,224,165,0)']]);
 const dustMaterial=new PointsMaterial({map:dotTexture,size:7,transparent:true,opacity:.75,depthWrite:false});
 const dust=new Points(dustGeometry,dustMaterial);dust.frustumCulled=false;dust.renderOrder=0;scene.add(dust);

 let width=1,height=1,emblemX=0,emblemY=0,emblemWidth=1,emblemHeight=1,seededDust=false;
 function layout(){
  width=canvas.clientWidth||innerWidth;height=canvas.clientHeight||innerHeight;
  renderer.setSize(width,height,false);
  camera.aspect=width/height;
  // One world unit is one CSS pixel at z=0, so the emblem can sit exactly over its slot.
  camera.position.z=height/2/Math.tan(camera.fov*Math.PI/360);
  camera.updateProjectionMatrix();
  const box=slot.getBoundingClientRect(),frame=canvas.getBoundingClientRect();
  emblemHeight=Math.min(box.height,box.width/aspect);emblemWidth=emblemHeight*aspect;
  emblemX=box.left-frame.left+box.width/2-width/2;emblemY=height/2-(box.top-frame.top+box.height/2);
  face.scale.set(emblemWidth,emblemHeight,1);shadow.scale.set(emblemWidth,emblemHeight,1);
  glow.scale.set(emblemWidth*1.75,emblemHeight*1.5,1);
  if(!seededDust){
   seededDust=true;
   for(let i=0;i<dustCount;i++){dustPositions[i*3]=(Math.random()-.5)*width*1.15;dustPositions[i*3+1]=(Math.random()-.5)*height*1.1;dustPositions[i*3+2]=-260+Math.random()*420}
   petalState.forEach(p=>{p.x=(Math.random()-.5)*width*1.1;p.y=(Math.random()-.5)*height*1.2;p.seeded=true});
  }
 }
 layout();
 const observer=new ResizeObserver(layout);observer.observe(canvas);observer.observe(slot);

 const pointer={x:0,y:0,sx:0,sy:0};
 const onPointer=(e:PointerEvent)=>{pointer.x=e.clientX/innerWidth*2-1;pointer.y=e.clientY/innerHeight*2-1};
 addEventListener('pointermove',onPointer,{passive:true});

 let burstAt=0,last=performance.now();
 const start=last;
 function frame(now:number){
  const dt=Math.min((now-last)/1000,.1);last=now;
  const t=(now-start)/1000;
  uniforms.time.value=t;
  pointer.sx=lerp(pointer.sx,pointer.x,.05);pointer.sy=lerp(pointer.sy,pointer.y,.05);

  const appear=loadedAt?easeOut((now-loadedAt)/1400):0;
  const leaving=burstAt?clamp01((now-burstAt)/1100):0;
  const fade=appear*(1-easeOut(leaving));
  uniforms.fade.value=fade;
  shadowMaterial.opacity=.34*fade;
  glowMaterial.opacity=(.72+Math.sin(t*.9)*.2)*fade;
  const scale=(.93+.07*appear)*(1+.13*easeOut(leaving));
  emblem.scale.set(scale,scale,1);
  emblem.position.set(emblemX,emblemY+Math.sin(t*.8)*Math.min(7,emblemHeight*.018)+(1-appear)*-18,0);
  emblem.rotation.y=pointer.sx*.2+Math.sin(t*.5)*.055+easeOut(leaving)*.35;
  emblem.rotation.x=pointer.sy*.14+Math.cos(t*.4)*.03;
  shadow.position.x=-emblem.rotation.y*42+7;shadow.position.y=emblem.rotation.x*42-11;

  camera.position.x=pointer.sx*12;camera.position.y=-pointer.sy*8;

  const positions=dustGeometry.attributes.position as BufferAttribute;
  for(let i=0;i<dustCount;i++){
   const d=dustState[i];
   dustPositions[i*3+1]+=(d.rise+(burstAt?90:0))*dt;
   dustPositions[i*3]+=Math.sin(t*.5+d.phase)*5*dt;
   if(dustPositions[i*3+1]>height*.58)dustPositions[i*3+1]=-height*.58;
  }
  positions.needsUpdate=true;
  dustMaterial.opacity=.62+Math.sin(t*1.3)*.16;

  petalState.forEach((p,i)=>{
   p.vx*=Math.pow(.2,dt);p.vy*=Math.pow(.2,dt);
   p.x+=(Math.sin(t*.7+p.phase)*p.sway+p.vx)*dt;
   p.y+=(-p.fall+p.vy)*dt;
   p.rx+=p.spinX*dt;p.ry+=p.spinY*dt;
   if(!burstAt&&p.y<-height*.62){p.y=height*.62;p.x=(Math.random()-.5)*width*1.1}
   dummy.position.set(p.x,p.y,p.z);dummy.rotation.set(p.rx,p.ry,p.phase);dummy.scale.setScalar(p.size);dummy.updateMatrix();
   petals.setMatrixAt(i,dummy.matrix);
  });
  petals.instanceMatrix.needsUpdate=true;

  renderer.render(scene,camera);
 }
 renderer.setAnimationLoop(frame);

 return {
  // Petals rush outward from the emblem while the curtains part
  burst(){
   if(burstAt)return;
   burstAt=performance.now();
   petalState.forEach(p=>{const dx=p.x-emblemX,dy=p.y-emblemY,length=Math.hypot(dx,dy)||1,force=420+Math.random()*420;p.vx=dx/length*force;p.vy=dy/length*force});
  },
  dispose(){
   stopped=true;renderer.setAnimationLoop(null);observer.disconnect();removeEventListener('pointermove',onPointer);
   [face.geometry,shadow.geometry,glow.geometry,petalGeometry,dustGeometry].forEach(g=>g.dispose());
   [face.material as ShaderMaterial,shadowMaterial,glowMaterial,petals.material as MeshBasicMaterial,dustMaterial].forEach(m=>m.dispose());
   [...loaded,glowTexture,dotTexture].forEach(texture=>texture.dispose());
   petals.dispose();renderer.dispose();
  },
 };
}
