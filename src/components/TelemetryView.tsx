import React from 'react';
import { DecisionId } from '../types';

interface TelemetryViewProps {
  currentDecisionId: DecisionId;
  hasOutageEnded: boolean;
}

export const TelemetryView: React.FC<TelemetryViewProps> = ({
  currentDecisionId,
  hasOutageEnded,
}) => {
  return (
    <div className="flex flex-col w-full gap-4 pb-12">
      {/* Header */}
      <div className="p-4 rounded-xl bg-[#211f19] border border-[#2c2a24] shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ffb870] text-[22px]">monitoring</span>
          <div className="flex flex-col">
            <h2 className="font-headline text-[18px] text-[#e8e2d8] font-semibold">
              Canlı Sistem Telemetrisi
            </h2>
            <span className="font-mono text-[11px] text-[#8f9098]">
              Host: poliklinik-gateway-tr01.prod.hospital.internal
            </span>
          </div>
        </div>
        <span
          className={`font-mono text-[10px] px-2 py-0.5 rounded border uppercase font-semibold ${
            hasOutageEnded
              ? 'bg-[#002220] text-[#89d4cd] border-[#89d4cd]/30'
              : 'bg-[#93000a]/40 text-[#ffb4ab] border-[#ffb4ab]/30 animate-pulse'
          }`}
        >
          {hasOutageEnded ? 'NORMAL İŞLEYİŞ' : 'KRİTİK SEVİYE 1'}
        </span>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3.5 rounded-xl bg-[#1d1b16] border border-[#2c2a24] flex flex-col gap-1">
          <span className="font-mono text-[11px] text-[#8f9098]">HTTP Hata Oranı</span>
          <span className="font-mono text-[20px] font-bold text-[#ffb4ab]">
            {hasOutageEnded ? '%0.02' : '%98.4'}
          </span>
          <span className="font-mono text-[10px] text-[#8f9098]">
            {hasOutageEnded ? '200 OK Nominal' : 'HTTP 500 / 504 Gateway Timeout'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#1d1b16] border border-[#2c2a24] flex flex-col gap-1">
          <span className="font-mono text-[11px] text-[#8f9098]">Kuyruk Baskısı</span>
          <span className="font-mono text-[20px] font-bold text-[#ffb870]">
            {hasOutageEnded ? '12 Msg' : '4.218 Msg'}
          </span>
          <span className="font-mono text-[10px] text-[#8f9098]">
            {hasOutageEnded ? 'Gecikme: 4ms' : 'Kuyruk birikiyor (Deadlock)'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#1d1b16] border border-[#2c2a24] flex flex-col gap-1">
          <span className="font-mono text-[11px] text-[#8f9098]">DB Bağlantı Havuzu</span>
          <span className="font-mono text-[20px] font-bold text-[#e8e2d8]">
            {hasOutageEnded ? '18 / 100' : '100 / 100'}
          </span>
          <span className="font-mono text-[10px] text-[#89d4cd]">
            {hasOutageEnded ? 'Boşta: 82 bağlantı' : 'Tükendi (Exhausted)'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#1d1b16] border border-[#2c2a24] flex flex-col gap-1">
          <span className="font-mono text-[11px] text-[#8f9098]">Sistem Sağlığı</span>
          <span
            className={`font-mono text-[20px] font-bold ${
              hasOutageEnded ? 'text-[#89d4cd]' : 'text-[#ffb4ab]'
            }`}
          >
            {hasOutageEnded ? '%99.98' : '%12.0'}
          </span>
          <span className="font-mono text-[10px] text-[#8f9098]">
            {hasOutageEnded ? 'Tüm nodlar yeşil' : 'Failover devrede değil'}
          </span>
        </div>
      </div>

      {/* Latency Waveform */}
      <div className="p-4 rounded-xl bg-[#101d35] border border-[#2c2a24] flex flex-col gap-2 shadow-lg">
        <div className="flex items-center justify-between text-[#e8e2d8]">
          <span className="font-mono text-[11px] text-[#bac6e6] uppercase font-semibold">
            GECİKME GRAFİĞİ (p99 LATENCY)
          </span>
          <span className="font-mono text-[11px] text-[#ffb870]">
            {hasOutageEnded ? '18ms (Stabil)' : '14.820ms (Spike)'}
          </span>
        </div>
        <div className="h-28 bg-[#100e09]/90 border border-[#211f19] rounded-lg p-2 flex items-center">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 320 80">
            <path
              d={
                hasOutageEnded
                  ? 'M0,60 L40,60 L80,58 L120,62 L160,59 L200,61 L240,60 L280,59 L320,60'
                  : 'M0,60 L40,60 L60,40 L90,65 L110,30 L140,70 L170,10 L190,75 L220,15 L250,78 L280,20 L300,70 L320,15'
              }
              fill="none"
              stroke={hasOutageEnded ? '#89d4cd' : '#ffb870'}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Database Lock diagnostic */}
      <div className="p-4 rounded-xl bg-[#211f19] border border-[#2c2a24] flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-[#ffb4ab] font-mono text-[12px] font-semibold">
          <span className="material-symbols-outlined text-[16px]">terminal</span>
          <span>POSTGRESQL LOCK INSPECTOR (pg_stat_activity)</span>
        </div>
        <pre className="p-3 rounded-lg bg-[#100e09] border border-[#2c2a24] font-mono text-[10px] text-[#c5c6ce] overflow-x-auto leading-relaxed">
          {hasOutageEnded
            ? `SELECT pid, state, wait_event_type, query 
FROM pg_stat_activity 
WHERE state != 'idle';
--> 0 active lock contention rows.
--> Connection pool normalized (18 active).`
            : `SELECT pid, state, wait_event_type, query 
FROM pg_stat_activity 
WHERE wait_event_type = 'Lock';
--> PID 18491: UPDATE appointments_v2 SET status = 'BOOKED'... (ExclusiveLock)
--> PID 18504: waiting on ExclusiveLock for PID 18491 (284 waiting processes)
--> FATAL: remaining connection slots are reserved for non-replication superuser connections`}
        </pre>
      </div>
    </div>
  );
};
