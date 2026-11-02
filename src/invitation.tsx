'use client';
import {Fragment,useEffect,useRef,useState,type CSSProperties} from 'react';
import {Ganesh} from './wedding-ornaments';
import './wedding.css';
import './version-one-temple.css';
import './version-three.css';
import './red-invitation.css';
import './simple-invitation.css';
import InvitationRsvpForm from './components/invitation-rsvp-form';
import './invitation-rsvp.css';
import './reference-palette.css';
import './invitation-tweaks.css';
import {theme} from '../wedding.config.mjs';
import {clock,couple,dateLong,dateUS,googleCalendarUrl,icsUrl,mapsUrl,monogram,wedding,weddingStart,weekday} from './wedding-details';
const {groom,bride,events,venue,text,images}=wedding;
function InviteIcon({kind}:{kind:'pin'|'heart'|'calendar'}){return <svg className={'v3-icon '+kind} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{kind==='pin'?<><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>:kind==='heart'?<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18m-13 5h1m6 0h1"/></>}</svg>}
function WeddingCountdown(){
 const [left,setLeft]=useState<number|null>(null);
 useEffect(()=>{const update=()=>setLeft(weddingStart.getTime()-Date.now());update();const timer=setInterval(update,1000);return()=>clearInterval(timer)},[]);
 if(left===null)return null;
 if(left<=0)return <p className="v3-countdown">Our forever begins today</p>;
 const parts:[string,number][]=[['Days',Math.floor(left/86400000)],['Hours',Math.floor(left/3600000)%24],['Mins',Math.floor(left/60000)%60],['Secs',Math.floor(left/1000)%60]];
 return <div className="v3-countdown-tiles" role="timer" aria-label={`${parts[0][1]} days until the wedding`}>{parts.map(([label,value])=><div key={label}><strong>{String(value).padStart(2,'0')}</strong><span>{label}</span></div>)}</div>;
}

function LivingText({text,letters=false}:{text:string;letters?:boolean}){
 return <span className="v1-live"><span className="v1-reader">{text}</span><span aria-hidden="true">{(letters?Array.from(text):text.split(' ')).map((word,i)=><Fragment key={i}><span className={letters?'v1-letter':'v1-word'} style={{'--delay':`${i*(letters?.055:.07)}s`} as CSSProperties}>{word===' '?'\u00a0':word}</span>{letters?'':' '}</Fragment>)}</span></span>;
}
function ThoranamBorders(){
 const borders=useRef<HTMLDivElement>(null),[counts,setCounts]=useState({primary:0,companion:0});
 useEffect(()=>{
  const root=borders.current;if(!root)return;
  const scenery=Array.from(root.parentElement?.querySelectorAll<HTMLElement>('.v1-mandap,.v1-venue-scenery,.v1-lotus-lake')||[]);
  let frame=0;
  const update=()=>{
   frame=0;
   const box=root.getBoundingClientRect(),height=box.height;
   const count=(kind:string)=>{const width=root.querySelector<HTMLElement>('.v3-thoranam-'+kind)?.getBoundingClientRect().width||1;return Math.max(1,Math.round(height/(width*2171/724)))};
   const primary=count('primary'),companion=count('companion');
   setCounts(previous=>previous.primary===primary&&previous.companion===companion?previous:{primary,companion});
   // Let the strands pass behind the illustrated scenes, including the elephant finale.
   const clear=scenery.map(el=>{const image=el.getBoundingClientRect();return [Math.max(0,image.top-box.top-8),Math.min(height,image.bottom-box.top+8)]})
    .filter(([start,end])=>end>start&&end>0&&start<height).sort((a,b)=>a[0]-b[0]);
   const joined:number[][]=[];
   for(const [start,end] of clear){const previous=joined.at(-1);if(previous&&start<=previous[1]+60)previous[1]=Math.max(previous[1],end);else joined.push([start,end])}
   const stops=['#000 0px'];
   for(const [start,end] of joined){stops.push(`#000 ${Math.max(0,start-36)}px`,`transparent ${start}px`,`transparent ${end}px`,`#000 ${Math.min(height,end+36)}px`)}
   stops.push(`#000 ${height}px`);
   const mask=`linear-gradient(to bottom,${stops.join(',')})`;
   if(root.style.maskImage!==mask){root.style.maskImage=mask;root.style.setProperty('-webkit-mask-image',mask)}
  };
  const queue=()=>{if(!frame)frame=requestAnimationFrame(update)};
  update();document.fonts?.ready.then(queue);
  const observer=new ResizeObserver(queue);observer.observe(root);
  const strand=root.querySelector<HTMLElement>('.v3-thoranam-primary');if(strand)observer.observe(strand);
  scenery.forEach(image=>observer.observe(image));
  addEventListener('resize',queue);addEventListener('scroll',queue,{passive:true});
  return()=>{observer.disconnect();removeEventListener('resize',queue);removeEventListener('scroll',queue);cancelAnimationFrame(frame)};
 },[]);
 return <div className="v3-thoranam-borders" aria-hidden="true" ref={borders}>{(['left','right'] as const).map(side=><div className={'v3-thoranam-rail '+side} key={side}>{(['primary','companion'] as const).map(kind=><div key={kind} className={'v3-thoranam-strand v3-thoranam-'+kind}>{Array.from({length:counts[kind]},(_,i)=><img key={i} src={images.border} alt="" width="724" height="2171"/>)}</div>)}</div>)}</div>;
}
const petalPath='M6 0C9.5 3 9.5 8.5 6 12C2.5 8.5 2.5 3 6 0Z';
function OpeningPetals(){
 return <div className="si-petals" aria-hidden="true">{Array.from({length:16},(_,i)=><svg key={i} className="si-petal" viewBox="0 0 12 12" style={{'--x':`${(i*41+6)%100}%`,'--size':`${9+(i%4)*3}px`,'--time':`${9+(i%5)*1.5}s`,'--wait':`${-(i*1.3)}s`,'--drift':`${i%2===0?50:-50}px`} as CSSProperties}><path d={petalPath}/></svg>)}</div>;
}
function PetalBurst(){
 return <div className="si-burst" aria-hidden="true">{Array.from({length:18},(_,i)=>{const angle=i/18*Math.PI*2,reach=170+(i%3)*70;return <svg key={i} className="si-burst-petal" viewBox="0 0 12 12" style={{'--size':`${10+(i%3)*4}px`,'--bx':`${Math.cos(angle)*reach}px`,'--by':`${Math.sin(angle)*reach}px`,'--spin':`${i%2===0?260:-260}deg`} as CSSProperties}><path d={petalPath}/></svg>})}</div>;
}
function OpeningScene({leaving,onState}:{leaving:boolean;onState:(state:'ready'|'failed')=>void}){
 const canvas=useRef<HTMLCanvasElement>(null),scene=useRef<{burst():void;dispose():void}|null>(null);
 useEffect(()=>{
  let alive=true;
  import('./opening-scene').then(({startOpeningScene})=>{
   const el=canvas.current,slot=el?.parentElement?.querySelector<HTMLElement>('.si-emblem');
   if(!alive||!el||!slot)return;
   scene.current=startOpeningScene(el,slot,images.emblem,()=>onState('ready'));
  }).catch(()=>onState('failed'));
  return()=>{alive=false;scene.current?.dispose();scene.current=null};
 },[]);
 useEffect(()=>{if(leaving)scene.current?.burst()},[leaving]);
 return <canvas className="si-scene" ref={canvas} aria-hidden="true"/>;
}
export default function VersionThree({rsvpPage=false}:{rsvpPage?:boolean}){
 const [view,setView]=useState(rsvpPage?'rsvp':'invitation');
 function navigate(e:React.MouseEvent<HTMLAnchorElement>,next:string){if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();history.pushState({},'',next==='rsvp'?'?page=rsvp':'./');setView(next);setShowScrollCue(false);window.scrollTo({top:0,behavior:'instant'})}
 useEffect(()=>{const back=()=>{setView(new URLSearchParams(location.search).get('page')==='rsvp'?'rsvp':'invitation');window.scrollTo({top:0,behavior:'instant'})};addEventListener('popstate',back);return()=>removeEventListener('popstate',back)},[]);
 const [entered,setEntered]=useState(rsvpPage),[entering,setEntering]=useState(false),[opened,setOpened]=useState(rsvpPage),[motion,setMotion]=useState(true),[showScrollCue,setShowScrollCue]=useState(true);
 const [musicOn,setMusicOn]=useState(!rsvpPage);
 const [sceneState,setSceneState]=useState<'loading'|'ready'|'failed'>('loading');
 const musicAllowed=useRef(false),audio=useRef<HTMLAudioElement>(null),interior=useRef<HTMLDivElement>(null),entranceTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>{document.title=view==='rsvp'?`RSVP | ${couple}`:`${groom.name} weds ${bride.name} | ${dateLong}`;if(entered)interior.current?.querySelector<HTMLElement>('h1')?.focus({preventScroll:true})},[view,entered]);
 useEffect(()=>()=>{if(entranceTimer.current)clearTimeout(entranceTimer.current)},[]);
 useEffect(()=>{document.body.style.overflow=entered?'':'hidden';return()=>{document.body.style.overflow=''}},[entered]);
 useEffect(()=>{if(entered)interior.current?.querySelector<HTMLElement>('.garden-title')?.focus({preventScroll:true})},[entered]);
 useEffect(()=>{if(!entered||!showScrollCue)return;const hide=()=>{if(window.scrollY>8)setShowScrollCue(false)};addEventListener('scroll',hide,{passive:true});return()=>removeEventListener('scroll',hide)},[entered,showScrollCue]);
 useEffect(()=>{const q=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setMotion(!q.matches);update();q.addEventListener('change',update);return()=>q.removeEventListener('change',update)},[]);
 useEffect(()=>{if(!entered)return;const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.05});interior.current?.querySelectorAll('.reveal,.reveal-soft,.v1-live').forEach(el=>observer.observe(el));return()=>observer.disconnect()},[entered,view]);
 useEffect(()=>{
  const sync=()=>{const el=audio.current;if(!el)return;const active=opened&&musicAllowed.current&&document.visibilityState==='visible'&&document.hasFocus();if(!active){el.pause();return}el.volume=.7;void el.play().then(()=>{if(document.visibilityState!=='visible'||!document.hasFocus())el.pause()}).catch(()=>{})};
  const stop=()=>audio.current?.pause();
  document.addEventListener('visibilitychange',sync);window.addEventListener('focus',sync);window.addEventListener('blur',stop);window.addEventListener('pagehide',stop);window.addEventListener('pageshow',sync);sync();
  return()=>{document.removeEventListener('visibilitychange',sync);window.removeEventListener('focus',sync);window.removeEventListener('blur',stop);window.removeEventListener('pagehide',stop);window.removeEventListener('pageshow',sync);stop()};
 },[opened]);
 useEffect(()=>{
  const menu=()=>interior.current?.querySelector<HTMLDetailsElement>('.v3-calendar');
  const close=()=>{const el=menu();if(el)el.open=false};
  const outside=(e:PointerEvent)=>{const el=menu();if(el&&!el.contains(e.target as Node))close()};
  const key=(e:KeyboardEvent)=>{if(e.key==='Escape')close()};
  document.addEventListener('pointerdown',outside);document.addEventListener('keydown',key);window.addEventListener('scroll',close,{passive:true});
  return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',key);window.removeEventListener('scroll',close)};
 },[entered,view]);
 // After opening, drift slowly down the invitation until the guest takes over.
 const autoScrolled=useRef(false);
 useEffect(()=>{
  const speed=wedding.autoScrollSpeed;
  if(!entered||!motion||!speed||rsvpPage||view!=='invitation'||autoScrolled.current)return;
  autoScrolled.current=true;
  let frame=0,last=0,y=0;
  const stop=()=>{clearTimeout(timer);cancelAnimationFrame(frame);events.forEach(name=>removeEventListener(name,stop))};
  const step=(time:number)=>{
   if(last){y+=speed*Math.min(time-last,1000)/1000;window.scrollTo({top:y,behavior:'instant'});if(y>=document.documentElement.scrollHeight-innerHeight){stop();return}}
   last=time;frame=requestAnimationFrame(step);
  };
  const events=['wheel','touchstart','pointerdown','keydown'];
  events.forEach(name=>addEventListener(name,stop,{passive:true}));
  const timer=setTimeout(()=>{y=window.scrollY;frame=requestAnimationFrame(step)},1600);
  return stop;
 },[entered,motion,view,rsvpPage]);
 function unlockMusic(){musicAllowed.current=true;const el=audio.current;if(!el)return;el.volume=.7;void el.play().then(()=>{if(document.visibilityState!=='visible'||!document.hasFocus())el.pause()}).catch(()=>{})}
 function toggleMusic(){if(musicOn){musicAllowed.current=false;audio.current?.pause();setMusicOn(false)}else{setMusicOn(true);unlockMusic()}}
 function enter(withMusic:boolean){if(entering)return;setEntering(true);setOpened(true);window.scrollTo({top:0,behavior:'instant'});if(withMusic)unlockMusic();if(!motion){setEntered(true);return}entranceTimer.current=setTimeout(()=>{setEntered(true)},3900)}
 return <div className="wedding-experience version-three v3-short-invite v3-red-invite" data-entered={entered} data-entering={entering} data-motion-opening={motion?'on':'off'} style={{'--ganesh':`url(${images.ganesh})`,'--opening':theme.opening,'--opening-deep':theme.openingDeep} as CSSProperties}>
 <audio ref={audio} src={wedding.music} loop preload="auto"/>
 {!entered&&<div className={'simple-invite si-opening '+(entering?'si-opening-out':'')} role="dialog" aria-modal="true" aria-labelledby="welcome-title"><div className="si-curtain si-left"/><div className="si-curtain si-right"/>{motion&&<OpeningScene leaving={entering} onState={setSceneState}/>}{motion&&sceneState==='failed'&&!entering&&<OpeningPetals/>}{motion&&sceneState==='failed'&&entering&&<PetalBurst/>}{motion&&entering&&<div className="si-ganesh" aria-hidden="true"><i/><span><b/></span></div>}<div className="opening-toran" style={{backgroundImage:`url(${images.toran})`}} aria-hidden="true"/><div className="si-stage"><div className="si-emblem" data-scene={motion?sceneState:'failed'}><img src={images.emblem} alt="Sacred emblem of the divine couple with joined hands"/></div><div className="si-opening-copy"><Ganesh/><p className="si-eyebrow">{text.openingKicker}</p><h1 id="welcome-title">{groom.name}<em>weds</em>{bride.name}</h1><p className="si-opening-date">{dateLong.toUpperCase()} · {wedding.place.toUpperCase()}</p><button className="si-primary" disabled={entering} onClick={()=>enter(true)}>{entering?'Opening your invitation…':text.openButton}</button><p className="si-opening-note">{text.openingNote}</p></div></div></div>}
 <div className="v1-temple-interior v3-classic-interior" data-motion={motion?'on':'off'} ref={interior} inert={!entered}>
 {entered&&view==='invitation'&&<div className="v3-gold-sparkles" aria-hidden="true">{Array.from({length:14},(_,i)=><svg key={i} viewBox="0 0 12 12" style={{'--spark-x':`${(i*37+7)%100}%`,'--spark-size':`${3+(i%3)*1.5}px`,'--spark-time':`${9+(i%5)}s`,'--spark-delay':`${i*.75}s`,'--spark-drift':`${i%2===0?16:-16}px`} as CSSProperties}><path d="M6 0 7.5 4.5 12 6 7.5 7.5 6 12 4.5 7.5 0 6 4.5 4.5Z"/></svg>)}</div>}
 <header className="garden-nav"><a href="./" onClick={e=>navigate(e,'invitation')} aria-label={`${couple} home`}>{monogram[0]}<em>&</em>{monogram[1]}</a><nav aria-label="Main navigation"><a href="./" onClick={e=>navigate(e,'invitation')} aria-current={view==='invitation'?'page':undefined}>Invitation</a><a href="?page=rsvp" onClick={e=>navigate(e,'rsvp')} aria-current={view==='rsvp'?'page':undefined} className="rsvp-shortcut">RSVP</a></nav></header>
 <main className={view==='rsvp'?'v3-rsvp-main':undefined}>{view==='rsvp'?<div className="v3-rsvp-page"><a className="v3-back-invitation" href="./" onClick={e=>navigate(e,'invitation')}><span aria-hidden="true">←</span> Back to invitation</a><section className="v3-rsvp-card" aria-labelledby="rsvp-title"><p className="v3-rsvp-kicker">{couple.toUpperCase()} · {dateLong.toUpperCase()}</p><h1 id="rsvp-title" tabIndex={-1}>R.S.V.P.</h1><p className="v3-rsvp-welcome">We would love to celebrate with you.</p><InvitationRsvpForm/><div className="v3-rsvp-event"><InviteIcon kind="calendar"/><div><p>{dateUS} · {clock(events[0].time).time} {clock(events[0].time).period}</p><h2>The Wedding</h2><p>{venue.name.join(' ')}</p><p>{venue.address.join(', ')}</p>{events.slice(1).map(e=><p key={e.title}>{e.title} · {clock(e.time).time} {clock(e.time).period}</p>)}</div></div></section></div>:<><section className="garden-hero" id="home"><div className="v3-welcome-stage"><ThoranamBorders/><div className="v3-banana-garlands" aria-hidden="true"><img className="left" src={images.corner} alt="" width="1024" height="1536"/><img className="right" src={images.corner} alt="" width="1024" height="1536"/></div><div className="v3-welcome-layout"><div className="garden-hero-copy reveal"><Ganesh/>{text.telugu&&<p className="opening-telugu"><LivingText text={text.telugu}/></p>}<p className="hero-kicker"><LivingText text={text.blessing}/></p><div className="v3-family-grid"><article><h1 className="garden-title" tabIndex={-1}><LivingText text={groom.name}/></h1><p className="v3-family-line"><span>{groom.parentsLabel}</span><LivingText text={groom.parents[0]}/><br/><LivingText text={groom.parents[1]}/></p></article><p className="v3-weds"><LivingText text="weds"/></p><article><h2 className="v3-bride-name"><LivingText text={bride.name}/></h2><p className="v3-family-line"><span>{bride.parentsLabel}</span><LivingText text={bride.parents[0]}/><br/><LivingText text={bride.parents[1]}/></p></article></div><p className="v3-short-invitation"><LivingText text={text.invitation}/></p></div><div className="v3-telugu-art"><img src={images.hero} width="1536" height="1024" alt={images.heroAlt} fetchPriority="high"/></div></div></div></section>
 <div className="v3-bordered-invitation"><ThoranamBorders/>
 <section className="chapter day-chapter reveal" id="celebration"><p className="chapter-label v3-wedding-date"><span><LivingText text={weekday}/></span><time dateTime={wedding.date}><LivingText text={dateLong}/></time></p><details className="v3-calendar"><summary><InviteIcon kind="calendar"/>Add to calendar</summary><div onClick={()=>{const el=interior.current?.querySelector<HTMLDetailsElement>('.v3-calendar');if(el)el.open=false}}><a href={googleCalendarUrl} target="_blank" rel="noreferrer">Google Calendar</a><a href={icsUrl} download="wedding.ics">Apple / Outlook Calendar</a></div></details><h2><LivingText text={text.celebrationHeading}/></h2><div className="event-tickets">{events.map((e,i)=><article className="event-ticket reveal-soft" key={e.title} style={{'--reveal-delay':`${i*.18}s`} as CSSProperties}>{e.telugu&&<p className="telugu"><LivingText text={e.telugu}/></p>}<h3><LivingText text={e.title}/></h3><strong><LivingText text={clock(e.time).time}/> <span>{clock(e.time).period}</span></strong></article>)}</div><p className="timezone"><LivingText text={wedding.timeNote}/></p><div className="v3-short-venue"><h2>{venue.name.map((line,i)=><span key={line}>{i>0&&<br/>}<LivingText text={line}/></span>)}</h2><p>{venue.address.map((line,i)=><span key={line}>{i>0&&<br/>}<LivingText text={line}/></span>)}</p><a href={mapsUrl} target="_blank" rel="noreferrer" className="garden-button light reveal-soft"><InviteIcon kind="pin"/>Get directions</a><a className="garden-button light v3-rsvp-cta reveal-soft" href="?page=rsvp" onClick={e=>navigate(e,'rsvp')}>Send your RSVP <InviteIcon kind="heart"/></a><div className="reveal-soft"><WeddingCountdown/></div></div><p className="v3-presence"><LivingText text={text.presence}/></p><img className="couple-figure reveal-soft" src={images.couple} width="418" height="820" alt="The couple holding hands, in traditional wedding dress" loading="lazy"/></section>
 <footer className="garden-footer reveal"><div className="v3-footer-signature"><p>With love, <span>{couple}</span></p><span className="v3-footer-star" aria-hidden="true">✦</span><time dateTime={wedding.date}>{dateUS}</time></div></footer>
 </div></>}</main></div>
 {entered&&view==='invitation'&&showScrollCue&&<a className="v3-scroll-cue" href="#celebration" aria-label="Scroll down to the celebration" onClick={e=>{e.preventDefault();setShowScrollCue(false);interior.current?.querySelector('#celebration')?.scrollIntoView({behavior:motion?'smooth':'auto'})}}><svg viewBox="0 0 40 48" aria-hidden="true"><path d="M20 5v30m-13-12 13 13 13-13"/></svg></a>}
 {entered&&<button type="button" className="v3-music-toggle" onClick={toggleMusic} aria-pressed={musicOn} aria-label={musicOn?'Turn music off':'Turn music on'}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18V6l11-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>{!musicOn&&<path d="M3 3l18 18"/>}</svg></button>}
 </div>
}
