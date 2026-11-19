'use client';

import React, { useMemo, useState } from 'react';
import { ArrowRight, Flame, Scale, Skull, Sparkles, UserCheck } from 'lucide-react';
import { CHARACTER_MAP } from '@/data/characters';
import { DRAGONS } from '@/data/dragons';
import { Dragon, DragonSizeTier, TimelineSnapshot } from '@/data/types';
import { getDragonRiderAtYear } from '@/lib/kinship';
import { CharacterAvatar, DragonAvatar } from './Portraits';

interface DragonCodexViewProps {
  selectedDragonId: string | null;
  onSelectDragon: (id: string) => void;
  onJumpToCharacter: (charId: string) => void;
  activeSnapshot: TimelineSnapshot | null;
}

const SIZE_LABELS: Record<DragonSizeTier, string> = {
  colossal: '초대형 고대 용',
  massive: '거대 성체 용',
  large: '대형 전투 용',
  medium: '중형 전투 용',
  young: '어린 용',
};

export function DragonCodexView({
  selectedDragonId,
  onSelectDragon,
  onJumpToCharacter,
  activeSnapshot,
}: DragonCodexViewProps) {
  const [filter, setFilter] = useState<'all' | 'black' | 'green' | 'early' | 'got' | 'seed'>('all');

  const filteredDragons = useMemo(() => {
    return DRAGONS.filter((d) => {
      if (filter === 'all') return true;
      if (filter === 'seed') return Boolean(d.dragonseed);
      return d.faction === filter;
    }).sort((a, b) => b.sizeScore - a.sizeScore);
  }, [filter]);

  const activeDragon: Dragon =
    DRAGONS.find((d) => d.id === selectedDragonId) ?? filteredDragons[0] ?? DRAGONS[0];

  return (
    <div className="mx-auto max-w-[1600px] px-4 pt-5 pb-44">
      {/* Header & Filters */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif-kr text-2xl font-bold text-[#f3d578]">
            용과 역대 기수 계보 <span className="font-display text-sm font-normal text-[#a99b84] ml-2">Dragon Codex</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#a99b84] mt-1">
            용은 인간보다 오래 살아 여러 세대의 기수를 거칩니다. 용을 선택해 역대 기수 계보와 크기·특징을 확인하세요.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[#d4af37]/20 bg-[#120f19] p-1.5 text-xs">
          {[
            { id: 'all', label: `전체 (${DRAGONS.length})` },
            { id: 'black', label: '흑색파' },
            { id: 'green', label: '녹색파' },
            { id: 'seed', label: '드래곤시드' },
            { id: 'early', label: '정복기' },
            { id: 'got', label: '왕좌의 게임' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as typeof filter)}
              className={`rounded-lg px-3 py-1.5 font-medium transition-colors cursor-pointer ${
                filter === tab.id
                  ? 'bg-[#b91c1c]/80 text-[#fef3c7] border border-[#f3d578]/30'
                  : 'text-[#a99b84] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Dragon Cards Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredDragons.map((d) => {
            const isSelected = activeDragon.id === d.id;
            const year = activeSnapshot?.yearAC;
            const activeRider =
              year !== undefined
                ? getDragonRiderAtYear(d, year, activeSnapshot?.riderOverrides?.[d.id])
                : null;
            const isDeadAtYear = year !== undefined && d.deathAC !== undefined && year > d.deathAC;
            const isUnbornAtYear = year !== undefined && d.birthAC !== undefined && year < d.birthAC;

            return (
              <button
                key={d.id}
                onClick={() => onSelectDragon(d.id)}
                className={`valyrian-card group relative flex flex-col justify-between rounded-2xl p-4 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-[#f3d578] valyrian-glow-gold'
                    : 'hover:border-[#d4af37]/50'
                } ${isUnbornAtYear ? 'opacity-40' : isDeadAtYear ? 'opacity-65' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <DragonAvatar dragon={d} size="md" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-serif-kr text-base font-bold text-[#f5efe3]">
                          {d.nameKo}
                        </h3>
                        {isDeadAtYear && <Skull className="w-3.5 h-3.5 text-[#a1a1aa]" />}
                      </div>
                      <div className="font-display text-[11px] text-[#a99b84]">
                        {d.nameEn} · {d.epithetKo}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                      d.faction === 'black'
                        ? 'border-[#ef4444]/40 bg-[#b91c1c]/20 text-[#fca5a5]'
                        : d.faction === 'green'
                        ? 'border-[#22c55e]/40 bg-[#15803d]/20 text-[#86efac]'
                        : d.faction === 'got'
                        ? 'border-[#a78bfa]/40 bg-[#7c3aed]/20 text-[#ddd6fe]'
                        : 'border-[#d4af37]/40 bg-[#d4af37]/15 text-[#fde68a]'
                    }`}
                  >
                    {d.faction === 'black'
                      ? '흑색파'
                      : d.faction === 'green'
                      ? '녹색파'
                      : d.faction === 'got'
                      ? 'GoT'
                      : '정복기'}
                  </span>
                </div>

                {/* Size Gauge */}
                <div className="mt-3.5">
                  <div className="flex items-center justify-between text-[10px] text-[#a99b84] mb-1">
                    <span>{SIZE_LABELS[d.sizeTier]}</span>
                    <span className="font-mono text-[#d4af37]">규모 {d.sizeScore}/100</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${d.sizeScore}%`,
                        background: `linear-gradient(90deg, ${d.colorPrimary}, ${d.colorAccent})`,
                      }}
                    />
                  </div>
                </div>

                {/* Riders preview */}
                <div className="mt-3 flex items-center justify-between border-t border-white/8 pt-2.5 text-[11px]">
                  {activeSnapshot ? (
                    <span className="text-[#d4af37]">
                      {activeSnapshot.yearAC} AC 기수:{' '}
                      <strong className="text-white">
                        {isUnbornAtYear
                          ? '미부화'
                          : isDeadAtYear
                          ? '사망'
                          : activeRider
                          ? activeRider.nameKo
                          : '야생 / 기수 없음'}
                      </strong>
                    </span>
                  ) : (
                    <span className="text-[#b8ae9c] truncate">
                      기수 ({d.riders.length}명):{' '}
                      <strong className="text-[#ece6da]">
                        {d.riders.map((r) => CHARACTER_MAP[r.characterId]?.nameKo.split(' ')[0]).join(' → ')}
                      </strong>
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Selected Dragon Spotlight & Rider Lineage */}
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <div className="valyrian-card rounded-2xl overflow-hidden">
            {/* Banner */}
            <div
              className="p-6 border-b border-[#d4af37]/20"
              style={{
                background: `linear-gradient(135deg, ${activeDragon.colorPrimary}55 0%, rgba(16,13,22,0.95) 75%)`,
              }}
            >
              <div className="flex items-center gap-4">
                <DragonAvatar dragon={activeDragon} size="hero" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif-kr text-2xl font-bold text-[#f7e7ba]">
                      {activeDragon.nameKo}
                    </h3>
                    {activeDragon.dragonseed && (
                      <span className="rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 px-2 py-0.5 text-[10px] font-semibold text-[#fde68a]">
                        씨뿌리기 합류
                      </span>
                    )}
                  </div>
                  <div className="font-display text-xs tracking-wider text-[#cfc4b0]">
                    {activeDragon.nameEn} · {activeDragon.epithetKo} ({activeDragon.epithetEn})
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs sm:text-[13px] leading-relaxed text-[#e6dfd2]">
                {activeDragon.loreKo}
              </p>
            </div>

            {/* Specs */}
            <div className="p-6 space-y-5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-[#15121d] p-3">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#a99b84] mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" /> 비늘 특징
                  </div>
                  <div className="text-[#ece6da] font-medium">{activeDragon.scalesKo}</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#15121d] p-3">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#a99b84] mb-1">
                    <Flame className="w-3.5 h-3.5 text-[#ef4444]" /> 불꽃 색상
                  </div>
                  <div className="text-[#ece6da] font-medium">{activeDragon.flameKo}</div>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#15121d] p-3">
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="flex items-center gap-1.5 text-[#a99b84]">
                    <Scale className="w-3.5 h-3.5 text-[#d4af37]" /> 발레리온 대비 추정 체급
                  </span>
                  <span className="font-mono font-semibold text-[#f3d578]">
                    {activeDragon.sizeScore}% ({SIZE_LABELS[activeDragon.sizeTier]})
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${activeDragon.sizeScore}%`,
                      background: `linear-gradient(90deg, ${activeDragon.colorPrimary}, ${activeDragon.colorAccent})`,
                    }}
                  />
                </div>
              </div>

              {activeDragon.deathNoteKo && (
                <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-[#171320] p-3 text-[#cfc5b5]">
                  <Skull className="w-4 h-4 text-[#ef4444] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] font-semibold text-[#fca5a5] mb-0.5">생사 및 최후</div>
                    <div>{activeDragon.deathNoteKo}</div>
                  </div>
                </div>
              )}

              {/* Rider Lineage Timeline */}
              <div>
                <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#f3d578] mb-3">
                  <UserCheck className="w-4 h-4" />
                  역대 기수 계보 ({activeDragon.riders.length}대)
                </h4>

                <div className="relative space-y-2.5 pl-4 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-[#d4af37]/35">
                  {activeDragon.riders.map((entry, idx) => {
                    const rider = CHARACTER_MAP[entry.characterId];
                    if (!rider) return null;
                    return (
                      <div key={idx} className="relative">
                        <span className="absolute -left-[13px] top-3.5 h-2.5 w-2.5 rounded-full border-2 border-[#f3d578] bg-[#14111c]" />
                        <button
                          onClick={() => onJumpToCharacter(rider.id)}
                          className="group flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#171321] p-3 text-left hover:border-[#d4af37]/60 hover:bg-[#1f1a2c] transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <CharacterAvatar character={rider} size="sm" />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="rounded bg-[#d4af37]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#fde68a]">
                                  {idx + 1}대 기수
                                </span>
                                <span className="font-serif-kr text-sm font-bold text-[#f5efe3] truncate">
                                  {rider.nameKo}
                                </span>
                              </div>
                              <div className="text-[11px] text-[#a99b84] mt-1">
                                {entry.fromAC !== undefined ? `${entry.fromAC} AC` : '?'} ~{' '}
                                {entry.toAC !== undefined ? `${entry.toAC} AC` : '계속'}
                                {entry.noteKo ? ` · ${entry.noteKo}` : ''}
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#d4af37] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
