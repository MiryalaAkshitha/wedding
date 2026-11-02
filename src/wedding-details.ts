// Everything derived from wedding.config.mjs: display dates, map and calendar links.
import {wedding} from '../wedding.config.mjs';
export {wedding};
const {groom,bride,date,utcOffset,events,venue,timeNote}=wedding;
export const couple=`${groom.name} & ${bride.name}`;
export const monogram=[groom.name[0],bride.name[0]];
const day=new Date(date+'T12:00:00Z');
const fmt=(options:Intl.DateTimeFormatOptions,locale='en-GB')=>new Intl.DateTimeFormat(locale,{timeZone:'UTC',...options}).format(day);
export const weekday=fmt({weekday:'long'});
export const dateLong=fmt({day:'numeric',month:'long',year:'numeric'});
export const dateUS=fmt({month:'long',day:'numeric',year:'numeric'},'en-US');
export function clock(time:string){const [h,m]=time.split(':').map(Number);return {time:`${h%12||12}:${String(m).padStart(2,'0')}`,period:h<12?'AM':'PM'}}
const instant=(time:string)=>new Date(`${date}T${time}:00${utcOffset}`);
export const weddingStart=instant(events[0].time);
const end=new Date(instant(events[events.length-1].time).getTime()+2*3600000);
const stamp=(d:Date)=>d.toISOString().replace(/[-:]|\.\d{3}/g,'');
const fullAddress=venue.address.join(', ');
const location=`${venue.name.join(' ')}, ${fullAddress}`;
const summary=`${couple} — Wedding`;
const schedule=events.map(e=>{const c=clock(e.time);return `${e.title} at ${c.time} ${c.period}.`}).join(' ')+' '+timeNote;
export const mapsUrl='https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(fullAddress)+'&travelmode=driving';
export const googleCalendarUrl='https://calendar.google.com/calendar/render?'+new URLSearchParams({action:'TEMPLATE',text:summary,dates:`${stamp(weddingStart)}/${stamp(end)}`,location,details:schedule}).toString();
const ics=(s:string)=>s.replace(/[\\,;]/g,m=>'\\'+m);
export const icsUrl='data:text/calendar;charset=utf-8,'+encodeURIComponent(['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Wedding Invitation//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH','BEGIN:VEVENT',`UID:wedding-${date}-${groom.name}-${bride.name}@invitation`.replace(/\s/g,''),`DTSTAMP:${stamp(weddingStart)}`,`DTSTART:${stamp(weddingStart)}`,`DTEND:${stamp(end)}`,`SUMMARY:${ics(summary)}`,`LOCATION:${ics(location)}`,`DESCRIPTION:${ics(schedule)}`,'END:VEVENT','END:VCALENDAR'].map(line=>line.replace(/(.{70})(?=.)/gu,'$1\r\n ')).join('\r\n'));
