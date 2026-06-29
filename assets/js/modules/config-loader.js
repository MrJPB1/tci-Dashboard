export const fallbackDepartments=[
  {id:'sales',name:'Vertrieb',config:'config/excel-sales.xml',dataPath:'data/AUFListen.xlsx'},
  {id:'production',name:'Produktion',config:'config/excel-production.xml',dataPath:'data/production/{period}/production.xlsx'},
  {id:'support',name:'Support',config:'config/excel-support.xml',dataPath:'data/support/{period}/support.xlsx'},
  {id:'logistics-it',name:'Logistik und IT',config:'config/excel-logistics-it.xml',dataPath:'data/logistics-it/{period}/logistics-it.xlsx'},
  {id:'accounting',name:'Buchhaltung',config:'config/excel-accounting.xml',dataPath:'data/accounting/{period}/accounting.xlsx'},
  {id:'quality',name:'QM',config:'config/excel-qm.xml',dataPath:'data/quality/{period}/quality.xlsx'},
  {id:'marketing',name:'Marketing',config:'config/excel-marketing.xml',dataPath:'data/marketing/{period}/marketing.xlsx'}
];

export async function loadDepartments(){
  try{
    const response=await fetch('config/departments.xml');
    if(!response.ok)throw new Error('departments.xml not found');
    const xml=new DOMParser().parseFromString(await response.text(),'application/xml');
    return Array.from(xml.querySelectorAll('department')).map(node=>({
      id:node.getAttribute('id'),
      name:node.getAttribute('name'),
      config:node.getAttribute('config'),
      dataPath:node.getAttribute('dataPath')
    })).filter(item=>item.id&&item.name);
  }catch(error){
    console.warn('Fallback departments used',error);
    return fallbackDepartments;
  }
}

export async function loadExcelConfig(department){
  try{
    const response=await fetch(department.config);
    if(!response.ok)throw new Error('mapping not found');
    const xml=new DOMParser().parseFromString(await response.text(),'application/xml');
    const range=xml.querySelector('range');
    return {
      sheet:xml.querySelector('sheet')?.getAttribute('name')||'',
      range:{
        header:Number(range?.getAttribute('headerRow')||1),
        start:Number(range?.getAttribute('startRow')||2),
        end:Number(range?.getAttribute('endRow')||1000)
      },
      columns:Array.from(xml.querySelectorAll('column')).map(column=>({
        key:column.getAttribute('key'),
        label:column.getAttribute('label')||column.getAttribute('key'),
        source:column.getAttribute('source'),
        type:column.getAttribute('type')||'text'
      })),
      metrics:Array.from(xml.querySelectorAll('metric')).map(metric=>({
        key:metric.getAttribute('key'),
        label:metric.getAttribute('label')||metric.getAttribute('key'),
        sourceColumn:metric.getAttribute('sourceColumn'),
        aggregation:metric.getAttribute('aggregation'),
        type:metric.getAttribute('type')||'number'
      }))
    };
  }catch(error){
    console.warn('Fallback mapping used',department,error);
    return {sheet:'',range:{header:1,start:2,end:1000},columns:[],metrics:[]};
  }
}
