function cellValue(sheet,address){return sheet&&sheet[address]?sheet[address].v:null;}

export async function loadWorkbook(path){
  if(!window.XLSX)throw new Error('XLSX Bibliothek ist nicht geladen');
  const response=await fetch(path,{cache:'no-store'});
  if(!response.ok)throw new Error('Excel-Datei nicht gefunden: '+path);
  const data=await response.arrayBuffer();
  return window.XLSX.read(data,{type:'array',cellDates:true});
}

export function selectSheet(workbook,preferredSheet){
  if(!workbook||!workbook.SheetNames||!workbook.SheetNames.length)throw new Error('Arbeitsmappe enthaelt keine Tabellenblaetter');
  const sheetName=preferredSheet&&workbook.Sheets[preferredSheet]?preferredSheet:workbook.SheetNames[0];
  return {sheetName,sheet:workbook.Sheets[sheetName]};
}

export function readRows(sheet,mapping){
  const columns=mapping.columns||[];
  const start=mapping.range?.start||2;
  const end=mapping.range?.end||1000;
  const rows=[];
  for(let rowIndex=start;rowIndex<=end;rowIndex++){
    const row={};
    columns.forEach(column=>{row[column.key]=cellValue(sheet,column.source+rowIndex);});
    if(Object.values(row).some(value=>value!==null&&value!==undefined&&value!==''))rows.push(row);
  }
  return rows;
}

export async function loadMappedRows(department,mapping,period){
  const path=department.dataPath.replace('{period}',period||'');
  const workbook=await loadWorkbook(path);
  const {sheetName,sheet}=selectSheet(workbook,mapping.sheet);
  const rows=readRows(sheet,mapping);
  return {path,workbook,sheetName,rows};
}
