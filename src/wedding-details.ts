// Everything derived from wedding.config.mjs: display dates, map and calendar links.
import {wedding} from '../wedding.config.mjs';
export {wedding};
const {groom,bride,date,utcOffset,events,venue,timeNote}=wedding;
export const mainEvent=events.find(e=>e.main)||events[0];
export const couple=`${bride.name} & ${groom.name}`;
export const monogram=[bride.name[0],groom.name[0]];
const day=new Date(date+'T12:00:00Z');
const fmt=(options:Intl.DateTimeFormatOptions,locale='en-GB')=>new Intl.DateTimeFormat(locale,{timeZone:'UTC',...options}).format(day);
export const weekday=fmt({weekday:'long'});
export const dateLong=fmt({day:'numeric',month:'long',year:'numeric'});
export const dateUS=fmt({month:'long',day:'numeric',year:'numeric'},'en-US');
export function clock(time:string){const [h,m]=time.split(':').map(Number);return {time:`${h%12||12}:${String(m).padStart(2,'0')}`,period:h<12?'AM':'PM'}}
export function eventDay(iso:string){const d=new Date(iso+'T12:00:00Z'),part=(options:Intl.DateTimeFormatOptions)=>new Intl.DateTimeFormat('en-GB',{timeZone:'UTC',...options}).format(d);return {weekday:part({weekday:'short'}),day:part({day:'numeric'}),month:part({month:'short'})}}
const instant=(e:{date:string;time:string})=>new Date(`${e.date}T${e.time}:00${utcOffset}`);
const TWO_HOURS=2*3600000;
export const weddingStart=instant(mainEvent);
const end=new Date(weddingStart.getTime()+TWO_HOURS);
const stamp=(d:Date)=>d.toISOString().replace(/[-:]|\.\d{3}/g,'');
const fullAddress=venue.address.join(', ');
const location=`${venue.name.join(' ')}, ${fullAddress}`;
const summary=`${couple} — Wedding`;
const describe=(e:{time:string;note:string})=>{const c=clock(e.time);return `${c.time} ${c.period}.${e.note?` ${e.note}.`:''} ${timeNote}`};
export const mapsUrl=mainEvent.map;
export const googleCalendarUrl='https://calendar.google.com/calendar/render?'+new URLSearchParams({action:'TEMPLATE',text:summary,dates:`${stamp(weddingStart)}/${stamp(end)}`,location,details:describe(mainEvent)}).toString();
const ics=(s:string)=>s.replace(/[\\,;]/g,m=>'\\'+m);
// The calendar file holds every function; Google's link can only add one, so it adds the marriage.
export const icsUrl='data:text/calendar;charset=utf-8,'+encodeURIComponent(['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Wedding Invitation//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH',...events.flatMap(e=>{const from=instant(e);return ['BEGIN:VEVENT',`UID:wedding-${e.date}-${groom.name}-${bride.name}@invitation`.replace(/\s/g,''),`DTSTAMP:${stamp(from)}`,`DTSTART:${stamp(from)}`,`DTEND:${stamp(new Date(from.getTime()+TWO_HOURS))}`,`SUMMARY:${ics(`${couple} — ${e.title}`)}`,`LOCATION:${ics(e.main?location:e.place)}`,`DESCRIPTION:${ics(`${describe(e)} Directions: ${e.map}`)}`,'END:VEVENT']}),'END:VCALENDAR'].map(line=>line.replace(/(.{70})(?=.)/gu,'$1\r\n ')).join('\r\n'));
