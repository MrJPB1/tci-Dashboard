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
  const ids=['kpiRevenue','kpiCosts','kpiResult','kpiTarget'];
  ids.forEach((id,index)=>{const value=byId(id);if(value&&value.previousElementSibling)value.previousElementSibling.textContent=labels[index]||'';});
}

export function setKpis(values){
  if(byId('kpiRevenue'))byId('kpiRevenue').textContent=values[0]||'-';
  if(byId('kpiCosts'))byId('kpiCosts').textContent=values[1]||'-';
  if(byId('kpiResult'))byId('kpiResult').textContent=values[2]||'-';
  if(byId('kpiTarget'))byId('kpiTarget').textContent=values[3]||'-';
}

export function renderNavigation(departments,onSelect){
  const nav=byId('departmentNav');
  if(!nav)return;
  nav.innerHTML='';
  departments.forEach(department=>{
    const link=document.createElement('a');
    link.href='#'+department.id;
    link.textContent=department.name;
    link.dataset.id=department.id;
    link.addEventListener('click',event=>{event.preventDefault();onSelect(department.id);});
    nav.appendChild(link);
  });
}

export function renderSelects(departments,periods,onDepartment,onPeriod,currentDepartment){
  const departmentSelect=byId('departmentSelect');
  const periodSelect=byId('periodSelect');
  if(periodSelect){
    periodSelect.innerHTML='';
    periods.forEach(period=>{const option=document.createElement('option');option.value=period;option.textContent=period;periodSelect.appendChild(option);});
    periodSelect.addEventListener('change',event=>onPeriod(event.target.value));
  }
  if(departmentSelect){
    departmentSelect.innerHTML='';
    departments.forEach(department=>{const option=document.createElement('option');option.value=department.id;option.textContent=department.name;departmentSelect.appendChild(option);});
    departmentSelect.value=currentDepartment;
    departmentSelect.addEventListener('change',event=>onDepartment(event.target.value));
  }
}

export function renderSalesKpis(analysis){
  setKpiLabels(['Auftragseingang','Auftraege','Kunden','Ø Auftrag']);
  setKpis([formatMoney(analysis.revenue),formatNumber(analysis.orders),formatNumber(analysis.customers),formatMoney(analysis.averageOrder)]);
}

export function renderFallbackKpis(value){
  setKpiLabels(['Umsatz','Kosten','Ergebnis','Planerfuellung']);
  setKpis([formatMoney(value*1000),formatMoney(Math.round(value*.68)*1000),formatMoney(Math.round(value*.32)*1000),Math.min(119,Math.round(90+value/30))+'%']);
}

export function bindTableSearch(){
  const search=byId('tableSearch');
  if(!search)return;
  search.addEventListener('input',event=>{
    const query=event.target.value.toLowerCase();
    document.querySelectorAll('#dataTable tbody tr').forEach(row=>{row.style.display=row.textContent.toLowerCase().includes(query)?'':'none';});
  });
}
