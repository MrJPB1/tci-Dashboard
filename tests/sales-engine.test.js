import test from 'node:test';
import assert from 'node:assert/strict';
import {analyzeSalesRows} from '../assets/js/modules/sales-engine.js';

const rows=[
  {customer:'Kunde A',orderDate:new Date(Date.UTC(2026,0,5)),documentNumber:'B-1',aeNumber:'AE-1',description:'Produkt 1',netValue:'100,00'},
  {customer:'Kunde A',orderDate:new Date(Date.UTC(2026,0,6)),documentNumber:'B-2',aeNumber:'AE-2',description:'Produkt 2',netValue:200},
  {customer:'Kunde B',orderDate:new Date(Date.UTC(2026,1,2)),documentNumber:'B-3',aeNumber:'AE-3',description:'Produkt 3',netValue:'50,00'}
];

test('analyzeSalesRows berechnet die freigegebenen Vertriebs-KPIs',()=>{
  const result=analyzeSalesRows(rows);
  assert.equal(result.revenue,350);
  assert.equal(result.orders,3);
  assert.equal(result.customers,2);
  assert.equal(result.averageOrder,350/3);
  assert.equal(result.largestOrder.documentNumber,'B-2');
});

test('analyzeSalesRows erstellt Verlauf und Top-Kunden',()=>{
  const result=analyzeSalesRows(rows);
  assert.deepEqual(result.byDay.map(item=>item.value),[100,200,50]);
  assert.equal(result.byMonth.length,2);
  assert.deepEqual(result.topCustomers[0],{label:'Kunde A',value:300});
  assert.deepEqual(result.topCustomers[1],{label:'Kunde B',value:50});
});

test('analyzeSalesRows behandelt leere Daten',()=>{
  const result=analyzeSalesRows([]);
  assert.equal(result.revenue,0);
  assert.equal(result.orders,0);
  assert.equal(result.customers,0);
  assert.equal(result.averageOrder,0);
  assert.equal(result.topCustomers.length,0);
});
