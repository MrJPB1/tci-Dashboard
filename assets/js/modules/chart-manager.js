let activeCharts={};

function destroyChart(id){
  if(activeCharts[id]){
    activeCharts[id].destroy();
    delete activeCharts[id];
  }
}

export function renderLineChart(canvasId,label,series){
  const canvas=document.getElementById(canvasId);
  if(!canvas||!window.Chart)return;
  destroyChart(canvasId);
  activeCharts[canvasId]=new Chart(canvas,{type:'line',data:{labels:series.map(item=>item.label),datasets:[{label,data:series.map(item=>item.value),tension:.35,fill:false}]},options:{responsive:true,maintainAspectRatio:true,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}});
}

export function renderBarChart(canvasId,label,series){
  const canvas=document.getElementById(canvasId);
  if(!canvas||!window.Chart)return;
  destroyChart(canvasId);
  activeCharts[canvasId]=new Chart(canvas,{type:'bar',data:{labels:series.map(item=>item.label),datasets:[{label,data:series.map(item=>item.value)}]},options:{responsive:true,maintainAspectRatio:true,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}});
}
