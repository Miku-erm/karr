import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import dotenv from 'dotenv';
const tracked = execFileSync('git', ['ls-files','--cached','--others','--exclude-standard','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
const files = new Set(tracked.filter(f => !f.startsWith('.env') || f === '.env.example'));
async function walk(dir) { try { for (const e of await fs.readdir(dir,{withFileTypes:true})) { const file=path.join(dir,e.name); if(e.isDirectory()) await walk(file); else files.add(file); } } catch(e) { if(e.code !== 'ENOENT') throw e; } }
await walk('dist');
let local = {};
try { local = dotenv.parse(await fs.readFile('.env.local')); } catch { /* Optional in CI. */ }
const key = (process.env.GEMINI_API_KEY || local.GEMINI_API_KEY || '').trim();
const patterns = [/AIza[0-9A-Za-z_-]{30,}/, /gh[pousr]_[A-Za-z0-9]{25,}/, /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/];
const violations=[];
for(const file of files) {
  const data=await fs.readFile(file); const text=data.toString('utf8');
  if((key.length>15 && data.includes(Buffer.from(key))) || patterns.some(p=>p.test(text))) violations.push(file);
}
const history=execFileSync('git',['log','--all','-p'],{encoding:'utf8',maxBuffer:32*1024*1024});
if((key.length>15 && history.includes(key)) || patterns.some(p=>p.test(history))) violations.push('git-history');
const ignore=execFileSync('git',['check-ignore','.env.local'],{encoding:'utf8'}).trim()==='.env.local';
if(!ignore || tracked.includes('.env.local')) violations.push('.env.local-not-ignored');
const result={checkedAt:new Date().toISOString(),filesScanned:files.size,productionBundleScanned:[...files].some(f=>f.replaceAll('\\','/')==='dist/index.html'),historyScanned:true,localEnvironmentIgnored:ignore,credentialValuesPrinted:false,passed:violations.length===0,violationPaths:violations};
await fs.mkdir('docs',{recursive:true}); await fs.writeFile('docs/security-scan.json',JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
if(violations.length) process.exitCode=1;
