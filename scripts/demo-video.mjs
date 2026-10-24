import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import ffmpeg from 'ffmpeg-static';
import ffprobe from 'ffprobe-static';
const mode = process.argv[2];
const output = 'demo/se-primer-demo.mp4';
const probe = filename => JSON.parse(execFileSync(ffprobe.path, ['-v','error','-show_format','-show_streams','-of','json',filename], { encoding:'utf8' }));
if (mode === 'edit') {
  const recordings = (await fs.readdir('demo/raw')).filter(f => f.endsWith('.mp4')).sort();
  const raw = 'demo/raw/' + recordings.at(-1);
  if (!recordings.length) throw Error('Record an actual Cypress demonstration first.');
  const source = probe(raw); const duration = Number(source.format.duration);
  const speed = duration > 58 ? duration / 58 : 1;
  if (speed > 1.3) throw Error(`Raw video ${duration}s is too long; adjust recording pauses instead of making text unreadable.`);
  const filters = [];
  // Keep the genuine Cypress runner and application visible. No fabricated UI.
  if (speed !== 1) filters.push(`setpts=PTS/${speed.toFixed(8)}`);
  if (duration < 58) filters.push(`tpad=stop_mode=clone:stop_duration=${58-duration}`);
  // Accurate editorial annotation; original raw recording remains unchanged.
  const font = process.platform === 'win32' ? 'C\\:/Windows/Fonts/arial.ttf' : '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';
  filters.push(`drawtext=fontfile='${font}':text='Cypress - ${speed.toFixed(2)}x':fontcolor=white:fontsize=18:box=1:boxcolor=black@0.8:x=12:y=h-th-12`);
  execFileSync(ffmpeg,['-y','-i',raw,'-vf',filters.join(','),'-t','58','-r','30','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart','-an',output],{stdio:['ignore','ignore','pipe']});
  await fs.writeFile('demo/edit-manifest.json',JSON.stringify({raw,rawDurationSeconds:duration,output,targetSeconds:58,speedFactor:speed,annotation:`Cypress - ${speed.toFixed(2)}x`,fabricatedUI:false,editedAt:new Date().toISOString()},null,2));
  console.log(`Edited actual recording: ${duration.toFixed(2)}s -> 58s, speed ${speed.toFixed(3)}x`);
} else if (mode === 'verify') {
  const info = probe(output); const video = info.streams.find(s => s.codec_type === 'video'); const duration = Number(info.format.duration);
  if (!video || !info.format.format_name.includes('mp4') || duration < 55 || duration > 60 || video.width < 720 || video.height < 720) throw Error('Video format, duration or resolution check failed.');
  execFileSync(ffmpeg,['-v','error','-i',output,'-f','null','-'],{stdio:['ignore','ignore','pipe']});
  await fs.mkdir('demo/frames',{recursive:true});
  for (const second of [3,10,18,28,38,48,55]) execFileSync(ffmpeg,['-y','-ss',String(second),'-i',output,'-frames:v','1',`demo/frames/frame-${second}.png`],{stdio:['ignore','ignore','pipe']});
  await fs.writeFile('demo/video-verification.json',JSON.stringify({file:output,verifiedAt:new Date().toISOString(),format:info.format.format_name,durationSeconds:duration,width:video.width,height:video.height,codec:video.codec_name,fullDecode:'passed',representativeFrames:[3,10,18,28,38,48,55]},null,2));
  console.log(`PASS MP4 ${video.width}x${video.height}, ${duration.toFixed(3)}s; full decode passed; seven inspection frames extracted.`);
} else throw Error('Use edit or verify');
