import {parseNumber,dateKey,weekKey,monthKey,groupSum,sortByValueDesc} from './utils.js';

function normalize(row){
  return {
    customer:String(row.customer||'Unbekannt').trim()||'Unbekannt',
    orderDate:row.orderDate,
    date:dateKey(row.orderDate),
    week:weekKey(row.orderDate),
    month:monthKey(row.orderDate),
    documentNumber:String(row.documentNumber||'').trim(),
    aeNumber:String(row.aeNumber||'').trim(),
    description:String(row.description||'').trim(),
    netValue:parseNumber(row.netValue)
  };
}

function latestDate(rows){
  const dates=rows.map(row=>row.date).filter(value=>value&&value!=='ohne Datum').sort();
  return dates.length?dates[dates.length-1]:null;
}

export function analyzeSalesRows(sourceRows){
  const rows=sourceRows.map(normalize).filter(row=>row.customer!=='Unbekannt'||row.documentNumber||row.netValue);
  const revenue=rows.reduce((sum,row)=>sum+row.netValue,0);
  const orders=rows.length;
  const customerSet=new Set(rows.map(row=>row.customer).filter(Boolean));
  const customers=customerSet.size;
  const averageOrder=orders?revenue/orders:0;
  const largestOrder=rows.reduce((max,row)=>row.netValue>max.netValue?row:max,{netValue:0});
  const lastDate=latestDate(rows);
  const lastWeek=lastDate?weekKey(lastDate):null;
  const lastMonth=lastDate?monthKey(lastDate):null;
  const revenueLatestDay=lastDate?rows.filter(row=>row.date===lastDate).reduce((sum,row)=>sum+row.netValue,0):0;
  const revenueLatestWeek=lastWeek?rows.filter(row=>row.week===lastWeek).reduce((sum,row)=>sum+row.netValue,0):0;
  const revenueLatestMonth=lastMonth?rows.filter(row=>row.month===lastMonth).reduce((sum,row)=>sum+row.netValue,0):0;
  const byDay=groupSum(rows,row=>row.date,row=>row.netValue).sort((a,b)=>a.label.localeCompare(b.label));
  const byWeek=groupSum(rows,row=>row.week,row=>row.netValue).sort((a,b)=>a.label.localeCompare(b.label));
  const byMonth=groupSum(rows,row=>row.month,row=>row.netValue).sort((a,b)=>a.label.localeCompare(b.label));
  const topCustomers=sortByValueDesc(groupSum(rows,row=>row.customer,row=>row.netValue)).slice(0,10);
  const largestOrders=[...rows].sort((a,b)=>b.netValue-a.netValue).slice(0,25);
  return {rows,revenue,orders,customers,averageOrder,largestOrder,lastDate,lastWeek,lastMonth,revenueLatestDay,revenueLatestWeek,revenueLatestMonth,byDay,byWeek,byMonth,topCustomers,largestOrders};
}
