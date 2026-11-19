'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Crown, RotateCcw, Swords } from 'lucide-react';
import { TIMELINE_SNAPSHOTS } from '@/data/timeline';
import { CHARACTER_MAP } from '@/data/characters';
import { TimelineSnapshot } from '@/data/types';

interface TimelineBarProps {
  activeSnapshot: TimelineSnapshot | null;
  onSelectSnapshot: (snapshot: TimelineSnapshot | null) => void;
  onSelectCharacter: (id: string) => void;
}

export function TimelineBar({
  activeSnapshot,
  onSelectSnapshot,
  onSelectCharacter,
}: TimelineBarProps) {
  const [expanded, setExpanded] = useState(false);

  const activeIndex = activeSnapshot
    ? TIMELINE_SNAPSHOTS.findIndex((s) => s.id === activeSnapshot.id)
    : -1;

  const monarch = activeSnapshot ? CHARACTER_MAP[activeSnapshot.monarchId] : null;
  const rival = activeSnapshot?.rivalClaimantId
    ? CHARACTER_MAP[activeSnapshot.rivalClaimantId]
    : null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#d4af37]/25 bg-[#0c0a11]/95 backdrop-blur-md shadow-[0_-12px_36px_rgba(0,0,0,0.75)]">
      <div className="mx-auto max-w-[1680px] px-4 py-2.5">
        {/* Top Row: Active status & expand */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d4af37]/35 bg-[#d4af37]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#f3d578]">
              <Clock className="w-3.5 h-3.5" />
              시점 타임라인
            </span>

            {activeSnapshot ? (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-white">
                  {activeSnapshot.yearAC} AC · {activeSnapshot.labelKo}
                </span>
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-[#d4af37]">
                  {activeSnapshot.seriesTag}
                </span>
                {monarch && (
                  <button
                    onClick={() => onSelectCharacter(monarch.id)}
                    className="inline-flex items-center gap-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 px-2 py-0.5 text-[11px] text-[#fde68a] hover:bg-[#d4af37]/25 cursor-pointer"
                  >
                    <Crown className="w-3 h-3" />
                    철왕좌: {monarch.nameKo}
                  </button>
                )}
                {rival && (
                  <button
                    onClick={() => onSelectCharacter(rival.id)}
                    className="inline-flex items-center gap-1 rounded-full bg-[#b91c1c]/20 border border-[#ef4444]/40 px-2 py-0.5 text-[11px] text-[#fca5a5] hover:bg-[#b91c1c]/35 cursor-pointer"
                  >
                    <Swords className="w-3 h-3" />
                    대립 주장: {rival.nameKo}
                  </button>
                )}
              </div>
            ) : (
              <span className="text-xs text-[#a99b84]">
                전 시대 통합 보기 (아래 시점을 클릭하면 해당 연도의 생존·왕위·용 기수 상태가 반영됩니다)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeSnapshot && (
              <button
                onClick={() => onSelectSnapshot(null)}
                className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] text-[#d6cec0] hover:bg-white/10 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                전체 시대 보기
              </button>
            )}
            {activeSnapshot && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="inline-flex items-center gap-1 rounded-lg border border-[#d4af37]/25 px-2.5 py-1 text-[11px] text-[#f3d578] hover:bg-[#d4af37]/10 cursor-pointer"
              >
                {expanded ? '사건 접기' : '사건 요약'}
                {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>

        {/* Expanded Event Summary */}
        {expanded && activeSnapshot && (
          <div className="mb-2.5 rounded-xl border border-[#d4af37]/20 bg-[#16131f] p-3 text-xs">
            <p className="text-[#e7dfd1] leading-relaxed mb-1.5">{activeSnapshot.summaryKo}</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-[#b9ae9b]">
              {activeSnapshot.keyEventsKo.map((ev, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
                  {ev}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Scrubber Track */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => onSelectSnapshot(null)}
            className={`shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all cursor-pointer border ${
              activeIndex === -1
                ? 'border-[#d4af37] bg-[#d4af37]/20 text-[#fef3c7]'
                : 'border-white/10 bg-[#15121d] text-[#9b8f7a] hover:text-[#ece6da]'
            }`}
          >
            전체 (All)
          </button>

          {TIMELINE_SNAPSHOTS.map((snap, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={snap.id}
                onClick={() => onSelectSnapshot(snap)}
                className={`group relative shrink-0 rounded-lg px-2.5 py-1.5 text-left transition-all cursor-pointer border ${
                  isSelected
                    ? 'border-[#ef4444] bg-gradient-to-r from-[#b91c1c]/35 to-[#d4af37]/20 text-white shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                    : 'border-white/10 bg-[#15121d] text-[#a99b84] hover:border-[#d4af37]/40 hover:text-[#f3ece0]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-[10px] font-semibold text-[#d4af37]">
                    {snap.yearAC} AC
                  </span>
                  <span className="text-[10px] opacity-75">{snap.seriesTag}</span>
                </div>
                <div className="text-[11px] font-medium whitespace-nowrap">{snap.labelKo}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
