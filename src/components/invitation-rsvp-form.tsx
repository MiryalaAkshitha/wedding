'use client';
import {useRef,useState} from 'react';
import {couple} from '../wedding-details';
export default function InvitationRsvpForm(){
 const [attending,setAttending]=useState(true),[sending,setSending]=useState(false),[sent,setSent]=useState(false),[error,setError]=useState('');
 const id=useRef('');
 async function submit(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();if(sending)return;setError('');
  const form=e.currentTarget,data=new FormData(form),guests=attending?Number(data.get('guests')):0,children=attending?Number(data.get('children')):0;
  if(attending&&(!Number.isInteger(guests)||guests<1||guests>99||!Number.isInteger(children)||children<0||children>99)){setError('Please enter guest counts using one or two digits.');return}
  if(attending&&children>=guests){setError('The guest count must include at least one adult.');return}
  setSending(true);
  try{
   if(!id.current){const b=crypto.getRandomValues(new Uint8Array(16));b[6]=(b[6]&15)|64;b[8]=(b[8]&63)|128;const h=Array.from(b,v=>v.toString(16).padStart(2,'0')).join('');id.current=[h.slice(0,8),h.slice(8,12),h.slice(12,16),h.slice(16,20),h.slice(20)].join('-')}
   const endpoint=window.WEDDING_CONFIG?.rsvpEndpoint?.trim();
   if(!endpoint)throw new Error('RSVP is not connected yet. Please contact the couple directly.');
   const notes=String(data.get('notes')||'');
   const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({id:id.current,name:data.get('name'),contact:data.get('email'),attendance:attending?'yes':'no',adults:guests-children,children,lunch:false,notes,website:data.get('website')})});
   const result=await response.json() as {error?:string};if(!response.ok||!(result as {ok?:boolean}).ok)throw new Error(result.error||'Your response was not confirmed. Please try again.');setSent(true);
  }catch(e){setError(e instanceof Error?e.message:'Unable to save your response. Please try again.')}finally{setSending(false)}
 }
 if(sent)return <div className="v3-rsvp-success" role="status"><span aria-hidden="true">♡</span><h2>{attending?'We cannot wait to see you!':'Thank you for letting us know.'}</h2><p>Your response has been saved for {couple}.</p></div>;
 return <form className="v3-reference-form" onSubmit={submit}>{!window.WEDDING_CONFIG?.rsvpEndpoint&&<p role="status" className="v3-rsvp-error">RSVP setup is pending. Please contact the couple directly until it is connected.</p>}
 <fieldset className="v3-attendance"><legend className="sr-only">Will you attend?</legend><label className={attending?'selected':''}><input type="radio" name="attendance" checked={attending} onChange={()=>setAttending(true)}/><span aria-hidden="true">♡</span>Joyfully attending</label><label className={!attending?'selected':''}><input type="radio" name="attendance" checked={!attending} onChange={()=>setAttending(false)}/>Regretfully declining</label></fieldset>
 <label>Full name<input name="name" required minLength={2} maxLength={120} autoComplete="name" placeholder="Your full name"/></label>
 <label>Email address <span>(optional)</span><input name="email" type="email" maxLength={150} autoComplete="email" placeholder="you@example.com"/></label>
 {attending&&<>
 <label>Number of guests, including you<input name="guests" type="text" inputMode="numeric" pattern="[0-9]{1,2}" maxLength={2} defaultValue="1" onChange={e=>{e.currentTarget.value=e.currentTarget.value.replace(/\D/g,'').slice(0,2)}} required/></label>
 <label>Children included in this total <span>(if any)</span><input name="children" type="text" inputMode="numeric" pattern="[0-9]{1,2}" maxLength={2} defaultValue="0" onChange={e=>{e.currentTarget.value=e.currentTarget.value.replace(/\D/g,'').slice(0,2)}} required/></label>
 </>}
 <label>A message or food allergies <span>(optional)</span><textarea name="notes" maxLength={500} rows={2} placeholder="Anything you would like us to know"/></label>
 <div className="honey" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
 {error&&<p role="alert" className="v3-rsvp-error">{error}</p>}
 <button className="v3-send-rsvp" disabled={sending}>{sending?'Sending your reply…':<>Send RSVP <span aria-hidden="true">♡</span></>}</button>
 </form>;
}
