import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
const source = await readFile(new URL('../shared/countries.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { normalizeCountry, loadCountries } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const country = { names: { common: 'Canada' }, codes: { alpha_2: 'CA', alpha_3: 'CAN' } };
test('v5 conversion and missing optional values', () => {
  const result = normalizeCountry({ ...country, capitals: [{ name: 'Ottawa' }], area: { kilometers: 123 }, languages: [{ iso639_3: 'fra', name: 'French' }] });
  assert.equal(result.translations.fra.common, 'Canada');
  assert.equal(result.area, 123);
  assert.deepEqual(result.capital, ['Ottawa']);
  assert.equal(result.languages.fra, 'French');
  assert.equal(result.population, null);
  assert.throws(() => normalizeCountry({}));
  assert.equal(normalizeCountry({ ...country, uuid: 'territory-id', codes: { alpha_2: '', alpha_3: '' } }).id, 'territory-id');
});
test('loads all pages using actual returned count', async () => {
  const offsets = [];
  const result = await loadCountries(async offset => {
    offsets.push(offset);
    return { data: { objects: [{ ...country, codes: { alpha_2: 'CA', alpha_3: `C${offset}` } }], meta: { total: 3, more: offset < 2 } } };
  });
  assert.deepEqual(offsets, [0, 1, 2]);
  assert.equal(result.length, 3);
});
test('rejects demo, partial and repeated responses', async () => {
  await assert.rejects(loadCountries(async () => ({ data: { _demo: {}, objects: [country], meta: { total: 1 } } })));
  await assert.rejects(loadCountries(async () => ({ data: { objects: [], meta: { total: 3 } } })));
  await assert.rejects(loadCountries(async () => ({ data: { objects: [country], meta: { total: 3, more: true } } })));
  await assert.rejects(loadCountries(async () => { throw new Error('quota'); }), /quota/);
});
