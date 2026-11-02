// Paste into Extensions > Apps Script in your PRIVATE wedding RSVP spreadsheet.
// Replace this value with the spreadsheet ID from its /d/ID/edit URL.
const SPREADSHEET_ID = 'REPLACE_WITH_YOUR_SPREADSHEET_ID';
function doGet() { return json_({ok:true,service:'Wedding RSVP receiver'}); }
function doPost(e) {
  let lock;
  try {
    const raw=e && e.postData && e.postData.contents;
    if(!raw || raw.length>10000) return json_({ok:false,error:'Invalid response.'});
    const b=JSON.parse(raw), name=String(b.name||'').trim();
    const yes=b.attendance==='yes', adults=yes?Number(b.adults):0, children=yes?Number(b.children):0;
    if(b.website || name.length<2 || name.length>120 || !['yes','no'].includes(b.attendance) || !/^[-a-f0-9]{36}$/.test(String(b.id||'')) || !Number.isInteger(adults) || adults<(yes?1:0) || adults>12 || !Number.isInteger(children) || children<0 || children>12) return json_({ok:false,error:'Please check your name and guest counts.'});
    lock=LockService.getScriptLock();lock.waitLock(20000);
    const book=SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet=book.getSheetByName('RSVPs') || book.insertSheet('RSVPs');
    if(sheet.getLastRow()===0) {
      sheet.appendRow(['Response ID','Received (UTC)','Name','Attendance','Total guests','Adults','Children','Email','Message / food allergies']);
      sheet.setFrozenRows(1);
    }
    if(sheet.getLastRow()>1 && sheet.getRange(2,1,sheet.getLastRow()-1,1).createTextFinder(b.id).matchEntireCell(true).findNext()) return json_({ok:true});
    sheet.appendRow([b.id,new Date().toISOString(),safe_(name),yes?'Attending':'Declined',adults+children,adults,children,safe_(String(b.contact||'').slice(0,150)),safe_(String(b.notes||'').slice(0,600))]);
    SpreadsheetApp.flush();return json_({ok:true});
  } catch(err) { return json_({ok:false,error:'Your reply could not be confirmed. Please try again or contact the couple.'}); }
  finally {if(lock && lock.hasLock()) lock.releaseLock();}
}
function safe_(s) {return /^[=+@\-\t\r]/.test(s)?"'"+s:s;}
function json_(value) {return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);}
