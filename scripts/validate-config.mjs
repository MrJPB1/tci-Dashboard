import {readFile,access} from 'node:fs/promises';
import assert from 'node:assert/strict';

const requiredFiles=[
  'index.html',
  'assets/css/styles.css',
  'assets/js/app.js',
  'assets/js/modules/config-loader.js',
  'assets/js/modules/excel-loader.js',
  'assets/js/modules/sales-engine.js',
  'assets/js/modules/chart-manager.js',
  'assets/js/modules/table-manager.js',
  'assets/js/modules/ui.js',
  'assets/js/modules/utils.js',
  'config/departments.xml',
  'config/excel-sales.xml',
  'data/history.json',
  'data/AUFListen.xlsx'
];

for(const file of requiredFiles)await access(file);

const departments=await readFile('config/departments.xml','utf8');
assert.match(departments,/version="0\.9\.0-rc1"/);
assert.match(departments,/id="sales"[^>]*status="ready"/);
for(const id of ['production','support','logistics-it','accounting','quality','marketing']){
  assert.match(departments,new RegExp('id="'+id+'"[^>]*status="planned"'));
}

const salesConfig=await readFile('config/excel-sales.xml','utf8');
for(const key of ['customer','orderDate','documentNumber','aeNumber','description','netValue']){
  assert.match(salesConfig,new RegExp('key="'+key+'"'));
}

const history=JSON.parse(await readFile('data/history.json','utf8'));
assert.equal(history.defaultPeriod,'Aktuell');
assert.deepEqual(history.departments.sales,['Aktuell']);

const index=await readFile('index.html','utf8');
assert.match(index,/0\.9\.0-rc1/);
assert.match(index,/type="module" src="assets\/js\/app\.js/);

const workbook=await readFile('data/AUFListen.xlsx');
assert.equal(workbook[0],0x50);
assert.equal(workbook[1],0x4b);

console.log('RC1 configuration validation passed.');
