import {formatMoney,formatNumber} from './utils.js';

const byId=id=>document.getElementById(id);

export function setStatus(message,type='info'){
  const element=byId('dataStatus');
  if(!element)return;
  element.textContent=message;
  element.dataset.type=type;
}

export function setPageTitle(title){const element=byId('pageTitle');if(element)element.textContent=title;}

export function setKpiLabels(labels){
  ['kpiRevenue','kpiCosts','kpiResult','kpiTarget'].forEach((id,index)=>{
    const value=byId(id);
    if(value&&value.previousElementSibling)value.previousElementSibling.textContent=labels[index]||'';
  });
}

export function setKpis(values){
  ['kpiRevenue','kpiCosts','kpiResult','kpiTarget'].forEach((id,index)=>{const element=byId(id);if(element)element.textContent=values[index]||'-';});
}

export function renderNavigation(departments,onSelect){
  const nav=byId('departmentNav');
  if(!nav)return;
  nav.innerHTML='';
  departments.forEach(department=>{
    const link=document.createElement('a');
    link.href='#'+department.id;
    link.dataset.id=department.id;
    link.dataset.status=department.status||'planned';
    const label=document.createElement('span');
    label.textContent=department.name;
    const badge=document.createElement('small');
    badge.textContent=department.status==='ready'?'bereit':'geplant';
    link.append(label,badge);
    link.addEventListener('click',event=>{event.preventDefault();onSelect(department.id);});
    nav.appendChild(link);
  });
}

export function setActiveNavigation(departmentId){
  document.querySelectorAll('#departmentNav a').forEach(link=>link.classList.toggle('active',link.dataset.id===departmentId));
}

export function renderDepartmentSelect(departments,onDepartment,currentDepartment){
  const select=byId('departmentSelect');
  if(!select)return;
  select.innerHTML='';
  departments.forEach(department=>{
    const option=document.createElement('option');
    option.value=department.id;
    option.textContent=department.name+(department.status==='ready'?'':' (geplant)');
    select.appendChild(option);
  });
  select.value=currentDepartment;
  select.addEventListener('change',event=>onDepartment(event.target.value));
}

export function updatePeriodSelect(periods,onPeriod,currentPeriod){
  const select=byId('periodSelect');
  if(!select)return;
  select.innerHTML='';
  periods.forEach(period=>{const option=document.createElement('option');option.value=period;option.textContent=period;select.appendChild(option);});
  select.value=periods.includes(currentPeriod)?currentPeriod:periods[0];
  select.onchange=event=>onPeriod(event.target.value);
  select.disabled=periods.length<2;
}

export function renderSalesKpis(analysis){
  setKpiLabels(['Auftragseingang','Auftraege','Kunden','Ø Auftrag']);
  setKpis([formatMoney(analysis.revenue),formatNumber(analysis.orders),formatNumber(analysis.customers),formatMoney(analysis.averageOrder)]);
}

export function renderEmptyKpis(){
  setKpiLabels(['Auftragseingang','Auftraege','Kunden','Ø Auftrag']);
  setKpis(['-','-','-','-']);
}

export function clearSalesPanels(message='Noch keine Daten verfuegbar.'){
  const summary=byId('salesSummary');
  const top=byId('topCustomers');
  if(summary){summary.innerHTML='';const p=document.createElement('p');p.className='muted';p.textContent=message;summary.appendChild(p);}
  if(top){top.innerHTML='';const p=document.createElement('p');p.className='muted';p.textContent=message;top.appendChild(p);}
}

export function bindTableSearch(){
  const search=byId('tableSearch');
  if(!search)return;
  search.addEventListener('input',event=>{
    const query=event.target.value.toLowerCase();
    document.querySelectorAll('#dataTable tbody tr').forEach(row=>{row.style.display=row.textContent.toLowerCase().includes(query)?'':'none';});
  });
}
