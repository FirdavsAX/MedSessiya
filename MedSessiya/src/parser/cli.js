/**
 * Parser CLI
 * Ishlatish: node src/parser/cli.js
 *
 * Fayl manzillari:
 *   Input:  ../anatomiya.txt, ../Gsitologiya uzb+++.txt  (loyihadan bir daraja yuqori)
 *   Output: src/data/anatomiya.json, src/data/gistalogiya.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseAnatomy } from './anatomiyaParser.js';
import { parseGistologiya } from './gistalogiyaParser.js';
import { normalize } from './normalizer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// src/parser/ → src/data/
const DATA_DIR = path.resolve(__dirname, '../data');
// MedSessiya/src/parser/ → Dinora/ (ota papka)
const ROOT_DIR = path.resolve(__dirname, '../../../');

const COURSES = [
  { id: 'anatomiya',   file: 'anatomiya.txt',   parser: parseAnatomy      },
  { id: 'gistalogiya', file: 'Gsitologiya uzb+++.txt', parser: parseGistologiya },
];

fs.mkdirSync(DATA_DIR, { recursive: true });

let totalOk = 0;
let totalFail = 0;

for (const course of COURSES) {
  const inputPath = path.join(ROOT_DIR, course.file);

  if (!fs.existsSync(inputPath)) {
    console.warn(`⚠️  Topilmadi: ${inputPath}`);
    totalFail++;
    continue;
  }

  try {
    const text    = fs.readFileSync(inputPath, 'utf-8');
    const raw     = course.parser(text);
    const result  = normalize(raw, course.id);
    const outPath = path.join(DATA_DIR, `${course.id}.json`);

    fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf-8');
    console.log(`📝 Saqlandi: ${outPath}  (${result.questions.length} savol)`);
    totalOk++;
  } catch (err) {
    console.error(`❌ Xato (${course.id}):`, err.message);
    totalFail++;
  }
}

console.log(`\n🎯 Tayyor: ${totalOk} ta kurs yaratildi, ${totalFail} ta muvaffaqiyatsiz.`);
