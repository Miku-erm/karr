import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
const sleep = ms => new Promise(r => setTimeout(r,ms));
const checks=[];
async function testServer(port, missing) {
  const env={...process.env,NODE_ENV:'production',PORT:String(port)};
  delete env.TUTOR_EVIDENCE_DIR;
  if(missing) env.GEMINI_API_KEY='';
  const child=spawn(process.execPath,['--import','tsx','server.ts'],{env,stdio:'ignore',windowsHide:true});
  const base=`http://127.0.0.1:${port}`;
  try {
    let health;
    for(let i=0;i<100;i++) { try {const r=await fetch(base+'/api/health');health=await r.json();break;}catch{await sleep(80);} }
    if(!health?.ok) throw Error('Production server failed to become ready');
    const page=await fetch(base+'/'); const html=await page.text();
    if(page.status!==200||!html.includes('/assets/')) throw Error('Production build not served');
    checks.push({name:missing?'production page without key':'production page with local secret',passed:true,tutorConfigured:health.tutorConfigured});
    const invalid=await fetch(base+'/api/tutor',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({decisionId:'invalid'})});
    if(invalid.status!==400) throw Error('Invalid input accepted');
    checks.push({name:'invalid Tutor input rejected',passed:true});
    if(missing) {
      const res=await fetch(base+'/api/tutor',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({decisionId:'architecture',experience:'beginner',role:'developer',goal:'architecture',message:'Bir ipucu verir misin?'})});
      const body=await res.json();
      if(body.liveAi!==false||body.fallback!==true||body.errorCode!=='MISSING_API_KEY') throw Error('Missing-key fallback failed');
      checks.push({name:'genuine missing-key server fallback (no stubbing)',passed:true,errorCode:body.errorCode});
    }
  }finally{child.kill();}
}
await testServer(3101,true);await testServer(3102,false);
await fs.mkdir('evidence',{recursive:true});
await fs.writeFile('evidence/server-smoke.json',JSON.stringify({executedAt:new Date().toISOString(),checks},null,2));
console.log(`PASS ${checks.length}/${checks.length} production/env/input/fallback checks; no secret values logged.`);
