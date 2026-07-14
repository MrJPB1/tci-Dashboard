import test from 'node:test';
import assert from 'node:assert/strict';
import {parseNumber,dateKey,monthKey,weekKey,groupSum} from '../assets/js/modules/utils.js';

test('parseNumber verarbeitet deutsche und numerische Werte',()=>{
  assert.equal(parseNumber('1.234,56 €'),1234.56);
  assert.equal(parseNumber('2392,00'),2392);
  assert.equal(parseNumber(125.5),125.5);
  assert.equal(parseNumber(''),0);
});

test('Datumsfunktionen verarbeiten Date-Objekte und Excel-Seriennummern',()=>{
  const date=new Date(Date.UTC(2026,0,15));
  assert.equal(dateKey(date),'2026-01-15');
  assert.equal(monthKey(date),'2026-01');
  assert.equal(weekKey(date),'2026-W03');
  assert.equal(dateKey(2),'1900-01-01');
});

test('groupSum gruppiert und summiert Werte',()=>{
  const rows=[{key:'A',value:10},{key:'A',value:15},{key:'B',value:5}];
  assert.deepEqual(groupSum(rows,row=>row.key,row=>row.value),[
    {label:'A',value:25},
    {label:'B',value:5}
  ]);
});
