import fs from 'node:fs/promises';
import path from 'node:path';
import { dataSummary, mergeExports, validateCsv } from '../src/collection/contract';

const [mode, ...args] = process.argv.slice(2);
try {
  if (mode === 'validate') {
    const files = args.filter(arg => arg !== '--require-ready');
    if (!files.length) files.push('data/oturumlar.csv');
    for (const file of files) {
      const result = validateCsv(await fs.readFile(file, 'utf8'));
      if (result.errors.length) {
        console.error(JSON.stringify({ file, valid: false, errors: result.errors }, null, 2));
        process.exitCode = 1; continue;
      }
      const summary = dataSummary(result.sessions);
      console.log(JSON.stringify({ file, valid: true, ...summary, note: summary.dataReady ? 'Yalnız veri sayısı/sınıf kapısı hazır; model metriği/paritesi henüz doğrulanmış sayılmaz.' : 'Şema geçerli; gerçek veri sayısı/sınıf kapısı henüz hazır değil.' }, null, 2));
      if (args.includes('--require-ready') && !summary.dataReady) process.exitCode = 1;
    }
  } else if (mode === 'merge') {
    const outputIndex = args.indexOf('--output');
    if (outputIndex < 0 || !args[outputIndex + 1]) throw Error('Kullanım: npm run data:merge -- --output data/oturumlar.csv cihaz1.csv cihaz2.csv');
    const output = args[outputIndex + 1];
    const files = args.filter((_, index) => index !== outputIndex && index !== outputIndex + 1);
    if (!files.length || files.some(file => file.startsWith('--'))) throw Error('En az bir girdi CSV dosyası gerekli.');
    const combined = mergeExports(await Promise.all(files.map(file => fs.readFile(file, 'utf8'))));
    await fs.mkdir(path.dirname(output), { recursive: true });
    await fs.writeFile(output, combined, 'utf8');
    const parsed = validateCsv(combined);
    console.log(JSON.stringify({ output, valid: true, ...dataSummary(parsed.sessions), deduplication: 'Özdeş session_id oturumları tekilleştirildi; çelişki veya eksik oturum hata verir. Kaynak/etiket değiştirilmedi.' }, null, 2));
  } else throw Error('validate veya merge komutu gerekli.');
} catch (e) {
  const error = e as NodeJS.ErrnoException;
  // Never echo the contents of rejected cells; they might contain personal information.
  console.error(error.code ? `Dosya işlemi başarısız (${error.code}).` : error.message);
  process.exitCode = 1;
}
