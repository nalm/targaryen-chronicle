'use client';

import React, { useMemo, useState } from 'react';
import { Crown, Flame, Shield, Sparkles, Swords, Users } from 'lucide-react';
import { CHARACTERS, CHARACTER_MAP } from '@/data/characters';
import { DRAGONS } from '@/data/dragons';
import { DragonSilhouette } from './Sigils';

interface FactionWarRoomProps {
  onJumpToCharacter: (id: string) => void;
  onSelectDragon: (id: string) => void;
}

export function FactionWarRoom({
  onJumpToCharacter,
  onSelectDragon,
}: FactionWarRoomProps) {
  const [includeDragonseeds, setIncludeDragonseeds] = useState(true);

  const blackChars = useMemo(
    () =>
      CHARACTERS.filter(
        (c) =>
          c.faction === 'black' &&
          (includeDragonseeds || !['hugh', 'ulf', 'addam'].includes(c.id))
      ),
    [includeDragonseeds]
  );

  const greenChars = useMemo(
    () => CHARACTERS.filter((c) => c.faction === 'green'),
    []
  );

  const blackDragons = useMemo(
    () =>
      DRAGONS.filter(
        (d) => d.faction === 'black' && (includeDragonseeds || !d.dragonseed)
      ).sort((a, b) => b.sizeScore - a.sizeScore),
    [includeDragonseeds]
  );

  const greenDragons = useMemo(
    () =>
      DRAGONS.filter((d) => d.faction === 'green').sort(
        (a, b) => b.sizeScore - a.sizeScore
      ),
    []
  );

  const blackPower = blackDragons.reduce((s, d) => s + d.sizeScore, 0);
  const greenPower = greenDragons.reduce((s, d) => s + d.sizeScore, 0);
  const totalPower = Math.max(1, blackPower + greenPower);
  const blackPct = Math.round((blackPower / totalPower) * 100);
  const greenPct = 100 - blackPct;

  return (
    <div className="mx-auto max-w-[1520px] px-4 pt-6 pb-44 space-y-6">
      {/* Header + Sowing Toggle */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif-kr text-2xl font-bold text-[#f3d578]">
            용들의 춤 전략 상황실{' '}
            <span className="font-display text-sm font-normal text-[#a99b84] ml-2">
              Team Black vs Team Green
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#a99b84] mt-1">
            비세리스 1세 사후 철왕좌를 두고 격돌한 흑색파(라에니라)와 녹색파(아에곤 2세)의 명분·인물·용 전력을 비교합니다.
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-[#d4af37]/25 bg-[#120f1a] p-1 text-xs">
          <button
            onClick={() => setIncludeDragonseeds(false)}
            className={`rounded-lg px-3 py-1.5 font-medium transition-colors cursor-pointer ${
              !includeDragonseeds
                ? 'bg-[#d4af37]/25 text-[#fef3c7]'
                : 'text-[#a99b84] hover:text-white'
            }`}
          >
            개전 초기 (HotD S1 말)
          </button>
          <button
            onClick={() => setIncludeDragonseeds(true)}
            className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 font-medium transition-colors cursor-pointer ${
              includeDragonseeds
                ? 'bg-[#b91c1c]/80 text-[#fef3c7] border border-[#f3d578]/30'
                : 'text-[#a99b84] hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            씨뿌리기 합류 후 (HotD S2–S3)
          </button>
        </div>
      </div>

      {/* Dragon Power Balance Meter */}
      <div className="valyrian-card rounded-2xl p-5">
        <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
          <div className="flex items-center gap-2 font-bold text-[#fca5a5]">
            <Flame className="w-4 h-4 text-[#ef4444]" />
            흑색파 용 전력: {blackDragons.length}마리 (종합 지수 {blackPower})
          </div>
          <div className="hidden sm:flex items-center gap-1 text-xs text-[#d4af37]">
            <Swords className="w-4 h-4" /> 전력 균형
          </div>
          <div className="flex items-center gap-2 font-bold text-[#86efac]">
            녹색파 용 전력: {greenDragons.length}마리 (종합 지수 {greenPower})
            <Flame className="w-4 h-4 text-[#22c55e]" />
          </div>
        </div>

        <div className="flex h-4 w-full overflow-hidden rounded-full border border-white/15 bg-black/50">
          <div
            style={{ width: `${blackPct}%` }}
            className="flex items-center justify-center bg-gradient-to-r from-[#7f1d1d] to-[#dc2626] text-[10px] font-bold text-white transition-all duration-500"
          >
            {blackPct}%
          </div>
          <div
            style={{ width: `${greenPct}%` }}
            className="flex items-center justify-center bg-gradient-to-r from-[#16a34a] to-[#14532d] text-[10px] font-bold text-white transition-all duration-500"
          >
            {greenPct}%
          </div>
        </div>

        <p className="mt-2.5 text-[11px] text-[#a99b84] text-center">
          {includeDragonseeds
            ? '버미소르(휴), 실버윙(울프), 시스모크(아담), 셰이프스틸러(라에나)가 합류하며 흑색파가 압도적 수적·화력 우위를 점하지만, 바가르라는 절대 변수와 드래곤시드의 배신 위험이 공존합니다.'
            : '개전 초기 흑색파는 용의 수에서 앞서지만, 녹색파는 고대 괴수 바가르(체급 95)를 보유하고 있어 정면 교전에서 치명적인 위협이 됩니다.'}
        </p>
      </div>

      {/* Side by Side Faction Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TEAM BLACK */}
        <section className="valyrian-card rounded-2xl overflow-hidden border-[#ef4444]/35">
          <div className="border-b border-[#ef4444]/25 bg-gradient-to-r from-[#7f1d1d]/45 to-transparent p-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-display uppercase tracking-[0.2em] text-[#fca5a5]">
                  Team Black · Dragonstone
                </span>
                <h3 className="font-serif-kr text-2xl font-bold text-white mt-0.5">
                  흑색파 (라에니라 진영)
                </h3>
              </div>
              <Crown className="w-8 h-8 text-[#ef4444]" />
            </div>
            <p className="mt-2.5 text-xs leading-relaxed text-[#e7dada]">
              <strong>계승 명분:</strong> 선왕 비세리스 1세가 공식 지명하고 칠왕국 영주들이 충성을 맹세한 정통 후계자.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
              {['벨라리온 (드리프트마크)', '스타크 (북부)', '아린 (베일)', '툴리 (리버랜드)'].map(
                (house) => (
                  <span
                    key={house}
                    className="rounded-full border border-[#ef4444]/35 bg-[#b91c1c]/20 px-2.5 py-0.5 text-[#fecaca]"
                  >
                    <Shield className="inline w-3 h-3 mr-1" />
                    {house}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Dragons */}
            <div>
              <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#fca5a5] mb-3">
                <Flame className="w-4 h-4" /> 흑색파 용 전력 ({blackDragons.length})
              </h4>
              <div className="space-y-2">
                {blackDragons.map((d) => {
                  const mainRider =
                    CHARACTER_MAP[d.riders[d.riders.length - 1]?.characterId];
                  return (
                    <button
                      key={d.id}
                      onClick={() => onSelectDragon(d.id)}
                      className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#17121c] px-3.5 py-2.5 text-left hover:border-[#ef4444]/60 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <DragonSilhouette className="w-6 h-6 shrink-0" color={d.colorAccent} />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-serif-kr text-sm font-bold text-[#f5efe3]">
                              {d.nameKo}
                            </span>
                            {d.dragonseed && (
                              <span className="rounded bg-[#d4af37]/20 px-1.5 py-0.5 text-[9px] text-[#fde68a]">
                                씨뿌리기
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#a99b84]">
                            기수: {mainRider?.nameKo ?? '미정'} · {d.epithetKo}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-xs font-bold text-[#fca5a5]">
                          {d.sizeScore}
                        </div>
                        <div className="h-1.5 w-16 rounded-full bg-white/10 mt-1 overflow-hidden">
                          <div
                            className="h-full bg-[#ef4444]"
                            style={{ width: `${d.sizeScore}%` }}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Key Figures */}
            <div>
              <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#fca5a5] mb-2.5">
                <Users className="w-4 h-4" /> 핵심 인물 ({blackChars.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {blackChars.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => onJumpToCharacter(c.id)}
                    className="rounded-lg border border-[#ef4444]/30 bg-[#1a131c] px-2.5 py-1.5 text-xs text-[#f3e4e4] hover:border-[#ef4444] hover:bg-[#b91c1c]/20 cursor-pointer"
                  >
                    {c.nameKo}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TEAM GREEN */}
        <section className="valyrian-card rounded-2xl overflow-hidden border-[#22c55e]/35">
          <div className="border-b border-[#22c55e]/25 bg-gradient-to-r from-[#14532d]/45 to-transparent p-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-display uppercase tracking-[0.2em] text-[#86efac]">
                  Team Green · King’s Landing
                </span>
                <h3 className="font-serif-kr text-2xl font-bold text-white mt-0.5">
                  녹색파 (아에곤 2세 진영)
                </h3>
              </div>
              <Crown className="w-8 h-8 text-[#22c55e]" />
            </div>
            <p className="mt-2.5 text-xs leading-relaxed text-[#dae7dd]">
              <strong>계승 명분:</strong> 웨스테로스 전통 및 101 AC 하렌할 대회의의 남성 장자 상속 선례 + 비세리스의 임종 유언(오해).
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
              {['하이타워 (올드타운)', '라니스터 (웨스터랜드)', '바라테온 (스톰랜드)'].map(
                (house) => (
                  <span
                    key={house}
                    className="rounded-full border border-[#22c55e]/35 bg-[#15803d]/20 px-2.5 py-0.5 text-[#bbf7d0]"
                  >
                    <Shield className="inline w-3 h-3 mr-1" />
                    {house}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Dragons */}
            <div>
              <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#86efac] mb-3">
                <Flame className="w-4 h-4" /> 녹색파 용 전력 ({greenDragons.length})
              </h4>
              <div className="space-y-2">
                {greenDragons.map((d) => {
                  const mainRider =
                    CHARACTER_MAP[d.riders[d.riders.length - 1]?.characterId];
                  return (
                    <button
                      key={d.id}
                      onClick={() => onSelectDragon(d.id)}
                      className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#121a16] px-3.5 py-2.5 text-left hover:border-[#22c55e]/60 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <DragonSilhouette className="w-6 h-6 shrink-0" color={d.colorAccent} />
                        <div>
                          <div className="font-serif-kr text-sm font-bold text-[#f5efe3]">
                            {d.nameKo}
                          </div>
                          <div className="text-[11px] text-[#a99b84]">
                            기수: {mainRider?.nameKo ?? '미정'} · {d.epithetKo}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-xs font-bold text-[#86efac]">
                          {d.sizeScore}
                        </div>
                        <div className="h-1.5 w-16 rounded-full bg-white/10 mt-1 overflow-hidden">
                          <div
                            className="h-full bg-[#22c55e]"
                            style={{ width: `${d.sizeScore}%` }}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Key Figures */}
            <div>
              <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#86efac] mb-2.5">
                <Users className="w-4 h-4" /> 핵심 인물 ({greenChars.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {greenChars.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => onJumpToCharacter(c.id)}
                    className="rounded-lg border border-[#22c55e]/30 bg-[#121b16] px-2.5 py-1.5 text-xs text-[#e4f3e8] hover:border-[#22c55e] hover:bg-[#15803d]/20 cursor-pointer"
                  >
                    {c.nameKo}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
