import {formatMoney,formatNumber} from './utils.js';

function setTable(headers,rows){
  const table=document.getElementById('dataTable');
  if(!table)return;
  table.querySelector('thead').innerHTML='<tr>'+headers.map(header=>'<th>'+header+'</th>').join('')+'</tr>';
  table.querySelector('tbody').innerHTML=rows.map(row=>'<tr>'+row.map(cell=>'<td>'+String(cell??'')+'</td>').join('')+'</tr>').join('');
}

export function renderSalesOrdersTable(analysis){
  const rows=analysis.largestOrders.map(order=>[
    order.customer,
    formatMoney(order.netValue),
    order.date,
    order.documentNumber,
    order.aeNumber,
    order.description
  ]);
  setTable(['Kunde','Netto Warenwert','Datum','Beleg','AE-Nr.','Bezeichnung'],rows);
}

export function renderGenericTable(department,mapping,path){
  setTable(['Kennzahl','Aktuell','Vorperiode','Status'],[
    ['Datenpfad',path,'','Info'],
    ['Mapping',department.config,'','XML'],
    ['Spalten',(mapping.columns||[]).map(column=>column.key+':'+column.source).join(', '),'','Config']
  ]);
}

export function renderTopCustomers(containerId,analysis){
  const container=document.getElementById(containerId);
  if(!container)return;
  if(!analysis.topCustomers.length){container.innerHTML='<p class="muted">Keine Kundendaten gefunden.</p>';return;}
  container.innerHTML=analysis.topCustomers.map((item,index)=>'<div class="rank-row"><span>'+(index+1)+'. '+item.label+'</span><strong>'+formatMoney(item.value)+'</strong></div>').join('');
}

export function renderSalesSummary(containerId,analysis){
  const container=document.getElementById(containerId);
  if(!container)return;
  container.innerHTML=[
    ['Auftragseingang gesamt',formatMoney(analysis.revenue)],
    ['Auftragseingang letzter Tag',formatMoney(analysis.revenueLatestDay)],
    ['Auftragseingang letzte Woche',formatMoney(analysis.revenueLatestWeek)],
    ['Auftragseingang letzter Monat',formatMoney(analysis.revenueLatestMonth)],
    ['Groesster Auftrag',formatMoney(analysis.largestOrder.netValue)],
    ['Datensaetze',formatNumber(analysis.orders)]
  ].map(row=>'<div class="metric-row"><span>'+row[0]+'</span><strong>'+row[1]+'</strong></div>').join('');
}
