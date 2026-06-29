export function formatMoney(value){return new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(Number(value||0));}
export function formatNumber(value){return new Intl.NumberFormat('de-DE').format(Number(value||0));}
export function parseNumber(value){
  if(typeof value==='number')return Number.isFinite(value)?value:0;
  if(value===null||value===undefined||value==='')return 0;
  let text=String(value).trim().replace(/EUR/gi,'').replace(/€/g,'').replace(/\s/g,'');
  if(text.includes(',')&&text.includes('.'))text=text.replace(/\./g,'').replace(',','.');
  else if(text.includes(','))text=text.replace(',','.');
  text=text.replace(/[^0-9.-]/g,'');
  return Number(text)||0;
}
export function excelDateToDate(value){
  if(value instanceof Date)return value;
  if(typeof value==='number')return new Date(Date.UTC(1899,11,30)+value*86400000);
  if(!value)return null;
  const text=String(value).trim();
  const german=text.match(/^(\d{1,2})\.(\d{1,2})\.(\d{2,4})$/);
  if(german){const y=Number(german[3].length===2?'20'+german[3]:german[3]);return new Date(Date.UTC(y,Number(german[2])-1,Number(german[1])));}
  const parsed=new Date(text);
  return Number.isNaN(parsed.getTime())?null:parsed;
}
export function dateKey(value){const d=excelDateToDate(value);return d?d.toISOString().slice(0,10):'ohne Datum';}
export function monthKey(value){const d=excelDateToDate(value);return d?d.toISOString().slice(0,7):'ohne Monat';}
export function weekKey(value){
  const d=excelDateToDate(value);if(!d)return 'ohne Woche';
  const date=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()));
  const day=date.getUTCDay()||7;date.setUTCDate(date.getUTCDate()+4-day);
  const yearStart=new Date(Date.UTC(date.getUTCFullYear(),0,1));
  const week=Math.ceil((((date-yearStart)/86400000)+1)/7);
  return date.getUTCFullYear()+'-W'+String(week).padStart(2,'0');
}
export function groupSum(rows,keyFn,valueFn){const map=new Map();rows.forEach(row=>{const key=keyFn(row);map.set(key,(map.get(key)||0)+valueFn(row));});return Array.from(map.entries()).map(([label,value])=>({label,value}));}
export function sortByValueDesc(items){return [...items].sort((a,b)=>(b.value||0)-(a.value||0));}
