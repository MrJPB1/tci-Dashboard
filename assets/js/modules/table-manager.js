import {formatMoney,formatNumber} from './utils.js';

function appendCell(row,value,tagName='td'){
  const cell=document.createElement(tagName);
  cell.textContent=String(value??'');
  row.appendChild(cell);
}

function setTable(headers,rows){
  const table=document.getElementById('dataTable');
  if(!table)return;
  const head=table.querySelector('thead');
  const body=table.querySelector('tbody');
  head.innerHTML='';
  body.innerHTML='';
  const headerRow=document.createElement('tr');
  headers.forEach(header=>appendCell(headerRow,header,'th'));
  head.appendChild(headerRow);
  rows.forEach(values=>{
    const row=document.createElement('tr');
    values.forEach(value=>appendCell(row,value));
    body.appendChild(row);
  });
}

function setTextList(containerId,rows,className){
  const container=document.getElementById(containerId);
  if(!container)return;
  container.innerHTML='';
  rows.forEach(values=>{
    const row=document.createElement('div');
    row.className=className;
    const label=document.createElement('span');
    const value=document.createElement('strong');
    label.textContent=values[0];
    value.textContent=values[1];
    row.append(label,value);
    container.appendChild(row);
  });
}

export function renderSalesOrdersTable(analysis){
  const rows=analysis.largestOrders.map(order=>[order.customer,formatMoney(order.netValue),order.date,order.documentNumber,order.aeNumber,order.description]);
  setTable(['Kunde','Netto Warenwert','Datum','Beleg','AE-Nr.','Bezeichnung'],rows);
}

export function renderPlannedDepartment(department){
  setTable(['Bereich','Status','Konfiguration','Datenpfad'],[[department.name,'Geplant',department.config,department.dataPath]]);
}

export function renderErrorTable(department,message){
  setTable(['Bereich','Status','Hinweis'],[[department.name,'Datenfehler',message]]);
}

export function renderTopCustomers(containerId,analysis){
  setTextList(containerId,analysis.topCustomers.map((item,index)=>[(index+1)+'. '+item.label,formatMoney(item.value)]),'rank-row');
}

export function renderSalesSummary(containerId,analysis){
  setTextList(containerId,[
    ['Auftragseingang gesamt',formatMoney(analysis.revenue)],
    ['Auftragseingang letzter Tag',formatMoney(analysis.revenueLatestDay)],
    ['Auftragseingang letzte Woche',formatMoney(analysis.revenueLatestWeek)],
    ['Auftragseingang letzter Monat',formatMoney(analysis.revenueLatestMonth)],
    ['Groesster Auftrag',formatMoney(analysis.largestOrder.netValue)],
    ['Datensaetze',formatNumber(analysis.orders)]
  ],'metric-row');
}
