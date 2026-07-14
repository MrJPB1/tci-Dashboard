import {loadDepartments,loadHistory,periodsForDepartment,loadExcelConfig} from './modules/config-loader.js';
import {loadMappedRows} from './modules/excel-loader.js';
import {analyzeSalesRows} from './modules/sales-engine.js';
import {renderLineChart} from './modules/chart-manager.js';
import {renderSalesOrdersTable,renderPlannedDepartment,renderErrorTable,renderTopCustomers,renderSalesSummary} from './modules/table-manager.js';
import {renderNavigation,setActiveNavigation,renderDepartmentSelect,updatePeriodSelect,renderSalesKpis,renderEmptyKpis,clearSalesPanels,setPageTitle,setStatus,bindTableSearch} from './modules/ui.js';

let departments=[];
let historyConfig={defaultPeriod:'Aktuell',periods:['Aktuell'],departments:{sales:['Aktuell']}};
let currentDepartment='sales';
let currentPeriod='Aktuell';

function departmentById(id){
  return departments.find(department=>department.id===id)||departments[0];
}

function setDepartmentUi(department){
  setPageTitle(department.name);
  setActiveNavigation(department.id);
  const departmentSelect=document.getElementById('departmentSelect');
  if(departmentSelect)departmentSelect.value=department.id;
  const periods=periodsForDepartment(historyConfig,department.id);
  currentPeriod=periods.includes(currentPeriod)?currentPeriod:(historyConfig.defaultPeriod&&periods.includes(historyConfig.defaultPeriod)?historyConfig.defaultPeriod:periods[0]);
  updatePeriodSelect(periods,setCurrentPeriod,currentPeriod);
}

function setCurrentDepartment(id){
  const department=departmentById(id);
  if(!department)return;
  currentDepartment=department.id;
  if(location.hash!=='#'+department.id)location.hash=department.id;
  setDepartmentUi(department);
  renderDashboard();
}

function setCurrentPeriod(period){
  currentPeriod=period;
  renderDashboard();
}

function renderPlannedState(department){
  renderEmptyKpis();
  clearSalesPanels('Die Datenanbindung dieser Abteilung ist fuer eine spaetere Version vorgesehen.');
  renderLineChart('trendChart',department.name,[]);
  renderPlannedDepartment(department);
  setStatus(department.name+' ist im Release Candidate angelegt, aber noch nicht produktiv angebunden.','info');
}

function renderFailureState(department,error){
  console.error('Dashboard-Datenfehler',department.id,error);
  renderEmptyKpis();
  clearSalesPanels('Die Daten konnten nicht verarbeitet werden. Details stehen in der Statusmeldung.');
  renderLineChart('trendChart',department.name,[]);
  renderErrorTable(department,error.message);
  setStatus('Datenfehler: '+error.message,'error');
}

async function renderSalesDashboard(department){
  const mapping=await loadExcelConfig(department);
  const result=await loadMappedRows(department,mapping,currentPeriod);
  if(!result.rows.length)throw new Error('Excel-Datei wurde geladen, enthaelt aber keine auswertbaren Datenzeilen.');
  const analysis=analyzeSalesRows(result.rows);
  if(!analysis.orders)throw new Error('Keine Vertriebsauftraege im konfigurierten Datenbereich erkannt.');
  renderSalesKpis(analysis);
  renderLineChart('trendChart','Auftragseingang',analysis.byDay);
  renderSalesOrdersTable(analysis);
  renderTopCustomers('topCustomers',analysis);
  renderSalesSummary('salesSummary',analysis);
  setStatus('Excel geladen: '+result.path+' · Blatt: '+result.sheetName+' · Auftraege: '+analysis.orders,'success');
}

async function renderDashboard(){
  const department=departmentById(currentDepartment);
  if(!department)return;
  setDepartmentUi(department);
  if(department.status!=='ready'){
    renderPlannedState(department);
    return;
  }
  setStatus('Daten werden geladen …','info');
  try{
    if(department.id==='sales')await renderSalesDashboard(department);
    else renderPlannedState(department);
  }catch(error){
    renderFailureState(department,error instanceof Error?error:new Error(String(error)));
  }
}

async function init(){
  [departments,historyConfig]=await Promise.all([loadDepartments(),loadHistory()]);
  const requestedDepartment=location.hash.replace('#','');
  const initialDepartment=departments.some(department=>department.id===requestedDepartment)?requestedDepartment:(departments.find(department=>department.status==='ready')?.id||departments[0]?.id||'sales');
  currentDepartment=initialDepartment;
  const initialPeriods=periodsForDepartment(historyConfig,currentDepartment);
  currentPeriod=historyConfig.defaultPeriod&&initialPeriods.includes(historyConfig.defaultPeriod)?historyConfig.defaultPeriod:initialPeriods[0];
  renderNavigation(departments,setCurrentDepartment);
  renderDepartmentSelect(departments,setCurrentDepartment,currentDepartment);
  updatePeriodSelect(initialPeriods,setCurrentPeriod,currentPeriod);
  bindTableSearch();
  if(location.hash!=='#'+currentDepartment)window.history.replaceState(null,'','#'+currentDepartment);
  await renderDashboard();
  window.addEventListener('hashchange',()=>{
    const id=location.hash.replace('#','');
    if(id&&id!==currentDepartment&&departments.some(department=>department.id===id)){
      currentDepartment=id;
      setDepartmentUi(departmentById(id));
      renderDashboard();
    }
  });
}

document.addEventListener('DOMContentLoaded',init);
