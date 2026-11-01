import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
await fs.mkdir('evidence/verification',{recursive:true});
const commands=[['dependencies',['ls','--depth=0']],['typecheck',['run','typecheck']],['build',['run','build']],['unit-tests',['test']],['server-smoke',['run','test:server']],['cypress-e2e',['run','cy:run']],['security',['run','security:scan']]];
const records=[];
for(const [label,args] of commands){
  const startedAt=new Date().toISOString();
  const isWindows=process.platform==='win32';
  const command=isWindows?'cmd.exe':'npm';
  const commandArgs=isWindows?['/d','/s','/c',`npm.cmd ${args.join(' ')}`]:args;
  const r=spawnSync(command,commandArgs,{encoding:'utf8',windowsHide:true,maxBuffer:16*1024*1024});
  await fs.writeFile(`evidence/verification/${label}.txt`,(r.stdout||'')+(r.stderr||''));
  records.push({command:'npm '+args.join(' '),label,startedAt,completedAt:new Date().toISOString(),exitCode:r.status,passed:r.status===0,log:`evidence/verification/${label}.txt`});
  console.log(`${label}: ${r.status===0?'PASS':'FAIL'} (${r.status})`);
}
await fs.writeFile('evidence/final-verification.json',JSON.stringify({executedAt:new Date().toISOString(),records},null,2));
if(records.some(r=>!r.passed)) process.exitCode=1;
