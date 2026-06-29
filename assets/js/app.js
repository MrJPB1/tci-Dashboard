import {loadDepartments,loadExcelConfig} from './modules/config-loader.js';
import {loadMappedRows} from './modules/excel-loader.js';
import {analyzeSalesRows} from './modules/sales-engine.js';
import {renderLineChart} from './modules/chart-manager.js';
import {renderSalesOrdersTable,renderGenericTable,renderTopCustomers,renderSalesSummary} from './modules/table-manager.js';
import {renderNavigation,renderSelects,renderSalesKpis,renderFallbackKpis,setPageTitle,setStatus,bindTableSearch} from './modules/ui.js';

const periods=['2026-W25','2026-W24','2026-W23','2026-W22','2026-W21','2026-W20'];
const fallbackValues={sales:[820,760,715,690,640,610],production:[74,72,70,68,65,63],support:[92,89,87,86,84,81],['logistics-it']:[96,94,91,90,88,86],accounting:[99,98,97,96,95,94],quality:[97,96,95,93,92,91],marketing:[48,45,44,41,39,37]};
let departments=[];
let currentDepartment='sales';
let currentPeriod=periods[0];

function departmentById(id){return departments.find(department=>department.id===id)||departments[0];}

function setCurrentDepartment(id){
  if(!departments.some(department=>department.id===id))return;
  currentDepartment=id;
  location.hash=id;
  const select=document.getElementById('departmentSelect');
  if(select)select.value=id;
  renderDashboard();
}

function setCurrentPeriod(period){
  currentPeriod=period;
  renderDashboard();
}

function fallbackSeries(departmentId){
  const values=fallbackValues[departmentId]||[0,0,0,0,0,0];
  return values.map((value,index)=>({label:periods[index]||String(index+1),value}));
}

function clearSalesPanels(){
  const summary=document.getElementById('salesSummary');
  const top=document.getElementById('topCustomers');
  if(summary)summary.innerHTML='<p class="muted">Fuer diese Abteilung noch keine Detailanalyse verfuegbar.</p>';
  if(top)top.innerHTML='<p class="muted">Keine Kundendaten.</p>';
}

async function renderDashboard(){
  const department=departmentById(currentDepartment);
  if(!department)return;
  setPageTitle(department.name);
  const mapping=await loadExcelConfig(department);
  const path=department.dataPath.replace('{period}',currentPeriod);

  try{
    const result=await loadMappedRows(department,mapping,currentPeriod);
    if(department.id==='sales'&&result.rows.length){
      const analysis=analyzeSalesRows(result.rows);
      setStatus('Excel geladen: '+result.path+' / Blatt: '+result.sheetName+' / Zeilen: '+analysis.orders,'success');
      renderSalesKpis(analysis);
      renderLineChart('trendChart','Auftragseingang',analysis.byDay);
      renderSalesOrdersTable(analysis);
      renderTopCustomers('topCustomers',analysis);
      renderSalesSummary('salesSummary',analysis);
      return;
    }
    setStatus('Excel geladen, aber keine Datenzeilen erkannt: '+result.path,'warning');
    clearSalesPanels();
    renderGenericFallback(department,mapping,path);
  }catch(error){
    console.warn(error);
    setStatus('Fallbackwerte: '+error.message,'warning');
    clearSalesPanels();
    renderGenericFallback(department,mapping,path);
  }
}

function renderGenericFallback(department,mapping,path){
  const values=fallbackValues[department.id]||[0,0,0,0,0,0];
  const selectedIndex=Math.max(0,periods.indexOf(currentPeriod));
  const value=values[selectedIndex]||values[0]||0;
  renderFallbackKpis(value);
  renderLineChart('trendChart',department.name,fallbackSeries(department.id));
  renderGenericTable(department,mapping,path);
}

async function init(){
  departments=await loadDepartments();
  currentDepartment=location.hash.replace('#','')||departments[0]?.id||'sales';
  renderNavigation(departments,setCurrentDepartment);
  renderSelects(departments,periods,setCurrentDepartment,setCurrentPeriod,currentDepartment);
  bindTableSearch();
  await renderDashboard();
  window.addEventListener('hashchange',()=>{
    const id=location.hash.replace('#','');
    if(id&&id!==currentDepartment&&departments.some(department=>department.id===id)){
      currentDepartment=id;
      const select=document.getElementById('departmentSelect');
      if(select)select.value=id;
      renderDashboard();
    }
  });
}

document.addEventListener('DOMContentLoaded',init);
