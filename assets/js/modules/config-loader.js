export const fallbackDepartments=[
  {id:'sales',name:'Vertrieb',status:'ready',config:'config/excel-sales.xml',dataPath:'data/AUFListen.xlsx'},
  {id:'production',name:'Produktion',status:'planned',config:'config/excel-production.xml',dataPath:'data/production/{period}/production.xlsx'},
  {id:'support',name:'Support',status:'planned',config:'config/excel-support.xml',dataPath:'data/support/{period}/support.xlsx'},
  {id:'logistics-it',name:'Logistik und IT',status:'planned',config:'config/excel-logistics-it.xml',dataPath:'data/logistics-it/{period}/logistics-it.xlsx'},
  {id:'accounting',name:'Buchhaltung',status:'planned',config:'config/excel-accounting.xml',dataPath:'data/accounting/{period}/accounting.xlsx'},
  {id:'quality',name:'QM',status:'planned',config:'config/excel-qm.xml',dataPath:'data/quality/{period}/quality.xlsx'},
  {id:'marketing',name:'Marketing',status:'planned',config:'config/excel-marketing.xml',dataPath:'data/marketing/{period}/marketing.xlsx'}
];

const fallbackHistory={defaultPeriod:'Aktuell',periods:['Aktuell'],departments:{sales:['Aktuell']}};

function parseXml(text,label){
  const xml=new DOMParser().parseFromString(text,'application/xml');
  const error=xml.querySelector('parsererror');
  if(error)throw new Error(label+' ist kein gueltiges XML');
  return xml;
}

export async function loadDepartments(){
  try{
    const response=await fetch('config/departments.xml',{cache:'no-store'});
    if(!response.ok)throw new Error('departments.xml not found');
    const xml=parseXml(await response.text(),'departments.xml');
    const departments=Array.from(xml.querySelectorAll('department')).map(node=>({
      id:node.getAttribute('id'),
      name:node.getAttribute('name'),
      status:node.getAttribute('status')||'planned',
      config:node.getAttribute('config'),
      dataPath:node.getAttribute('dataPath')
    })).filter(item=>item.id&&item.name&&item.config&&item.dataPath);
    if(!departments.length)throw new Error('Keine Abteilungen konfiguriert');
    return departments;
  }catch(error){
    console.warn('Fallback departments used',error);
    return fallbackDepartments;
  }
}

export async function loadHistory(){
  try{
    const response=await fetch('data/history.json',{cache:'no-store'});
    if(!response.ok)throw new Error('history.json not found');
    const history=await response.json();
    if(!Array.isArray(history.periods)||!history.periods.length)throw new Error('Keine Perioden konfiguriert');
    return history;
  }catch(error){
    console.warn('Fallback history used',error);
    return fallbackHistory;
  }
}

export function periodsForDepartment(history,departmentId){
  const periods=history?.departments?.[departmentId]||history?.periods||['Aktuell'];
  return periods.length?periods:['Aktuell'];
}

export async function loadExcelConfig(department){
  const response=await fetch(department.config,{cache:'no-store'});
  if(!response.ok)throw new Error('Mapping nicht gefunden: '+department.config);
  const xml=parseXml(await response.text(),department.config);
  const range=xml.querySelector('range');
  const columns=Array.from(xml.querySelectorAll('column')).map(column=>({
    key:column.getAttribute('key'),
    label:column.getAttribute('label')||column.getAttribute('key'),
    source:column.getAttribute('source'),
    type:column.getAttribute('type')||'text'
  })).filter(column=>column.key&&column.source);
  if(!columns.length)throw new Error('Keine Spalten im Mapping: '+department.config);
  return {
    sheet:xml.querySelector('sheet')?.getAttribute('name')||'',
    range:{header:Number(range?.getAttribute('headerRow')||1),start:Number(range?.getAttribute('startRow')||2),end:Number(range?.getAttribute('endRow')||1000)},
    columns,
    metrics:Array.from(xml.querySelectorAll('metric')).map(metric=>({key:metric.getAttribute('key'),label:metric.getAttribute('label')||metric.getAttribute('key'),sourceColumn:metric.getAttribute('sourceColumn'),aggregation:metric.getAttribute('aggregation'),type:metric.getAttribute('type')||'number'}))
  };
}
