'use client';

import React, { useMemo } from 'react';
import { ArrowRight, ArrowRightLeft, Flame, Heart, Shield, Sparkles, Users } from 'lucide-react';
import { CHARACTERS, CHARACTER_MAP } from '@/data/characters';
import { analyzeKinship } from '@/lib/kinship';
import { DragonSilhouette, HouseBadge } from './Sigils';
import { CharacterAvatar } from './Portraits';

interface RelationshipFinderProps {
  charAId: string;
  charBId: string;
  onChangeA: (id: string) => void;
  onChangeB: (id: string) => void;
  onJumpToCharacter: (id: string) => void;
  onSelectDragon: (id: string) => void;
}

const PRESET_PAIRS: { a: string; b: string; label: string }[] = [
  { a: 'daemon', b: 'rhaenyra', label: '다에몬 ↔ 라에니라' },
  { a: 'daenerys', b: 'jon-snow', label: '대너리스 ↔ 존 스노우' },
  { a: 'aegon-ii', b: 'helaena', label: '아에곤 2세 ↔ 헬라에나' },
  { a: 'rhaenyra', b: 'aegon-ii', label: '라에니라 ↔ 아에곤 2세' },
  { a: 'visenya', b: 'aemond', label: '비세니아 ↔ 아에몬드 (바가르)' },
  { a: 'jacaerys', b: 'harwin', label: '자카에리스 ↔ 하윈 스트롱' },
  { a: 'rhaenyra', b: 'daenerys', label: '라에니라 ↔ 대너리스' },
  { a: 'maester-aemon', b: 'jon-snow', label: '마에스터 아에몬 ↔ 존 스노우' },
];

export function RelationshipFinder({
  charAId,
  charBId,
  onChangeA,
  onChangeB,
  onJumpToCharacter,
  onSelectDragon,
}: RelationshipFinderProps) {
  const analysis = useMemo(() => analyzeKinship(charAId, charBId), [charAId, charBId]);

  const sortedChars = useMemo(
    () => [...CHARACTERS].sort((a, b) => a.generation - b.generation || a.nameKo.localeCompare(b.nameKo)),
    []
  );

  return (
    <div className="mx-auto max-w-5xl px-4 pt-6 pb-44 space-y-6">
      <div>
        <h2 className="font-serif-kr text-2xl font-bold text-[#f3d578]">
          인물 관계 탐색기 <span className="font-display text-sm font-normal text-[#a99b84] ml-2">Kinship &amp; Bond Pathfinder</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#a99b84] mt-1">
          근친혼과 재혼이 겹친 두 인물을 고르면 혈연 촌수, 혼인 관계, 같은 용을 탄 이력, 최단 연결 경로를 자동으로 분석합니다.
        </p>
      </div>

      {/* Popular Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold text-[#d4af37] flex items-center gap-1 mr-1">
          <Sparkles className="w-3.5 h-3.5" /> 자주 묻는 관계:
        </span>
        {PRESET_PAIRS.map((p) => {
          const active = charAId === p.a && charBId === p.b;
          return (
            <button
              key={p.label}
              onClick={() => {
                onChangeA(p.a);
                onChangeB(p.b);
              }}
              className={`rounded-full border px-3 py-1 text-xs transition-all cursor-pointer ${
                active
                  ? 'border-[#f3d578] bg-[#d4af37]/20 text-[#fef3c7]'
                  : 'border-white/15 bg-[#14111c] text-[#c7bdb0] hover:border-[#d4af37]/50 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Selector Bar */}
      <div className="valyrian-card rounded-2xl p-5 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#d4af37] mb-1.5">
            인물 A
          </label>
          <select
            value={charAId}
            onChange={(e) => onChangeA(e.target.value)}
            className="w-full rounded-xl border border-[#d4af37]/30 bg-[#120f1a] px-3.5 py-2.5 text-sm text-[#f5efe3] outline-none focus:border-[#f3d578]"
          >
            {sortedChars.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#120f1a]">
                [G{c.generation}] {c.nameKo} ({c.nameEn})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            const temp = charAId;
            onChangeA(charBId);
            onChangeB(temp);
          }}
          className="mx-auto mt-4 md:mt-5 flex h-10 w-10 items-center justify-center rounded-full border border-[#d4af37]/40 bg-[#d4af37]/15 text-[#f3d578] hover:bg-[#d4af37]/30 transition-colors cursor-pointer"
          title="두 인물 바꾸기"
        >
          <ArrowRightLeft className="w-4 h-4" />
        </button>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#d4af37] mb-1.5">
            인물 B
          </label>
          <select
            value={charBId}
            onChange={(e) => onChangeB(e.target.value)}
            className="w-full rounded-xl border border-[#d4af37]/30 bg-[#120f1a] px-3.5 py-2.5 text-sm text-[#f5efe3] outline-none focus:border-[#f3d578]"
          >
            {sortedChars.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#120f1a]">
                [G{c.generation}] {c.nameKo} ({c.nameEn})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Analysis Result */}
      {analysis && (
        <div className="space-y-4">
          {/* Summary Banner */}
          <div className="valyrian-card rounded-2xl p-6 border-[#d4af37]/35">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onJumpToCharacter(analysis.charA.id)}
                  className="flex items-center gap-3 text-left group cursor-pointer"
                >
                  <CharacterAvatar character={analysis.charA} size="md" />
                  <div>
                    <div className="font-serif-kr text-lg font-bold text-[#f7e7ba] group-hover:underline">
                      {analysis.charA.nameKo}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <HouseBadge house={analysis.charA.house} compact />
                      <span className="text-[11px] text-[#9b8f7a]">{analysis.charA.nameEn}</span>
                    </div>
                  </div>
                </button>

                <span className="font-display text-sm text-[#d4af37] px-2">✕</span>

                <button
                  onClick={() => onJumpToCharacter(analysis.charB.id)}
                  className="flex items-center gap-3 text-left group cursor-pointer"
                >
                  <CharacterAvatar character={analysis.charB} size="md" />
                  <div>
                    <div className="font-serif-kr text-lg font-bold text-[#f7e7ba] group-hover:underline">
                      {analysis.charB.nameKo}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <HouseBadge house={analysis.charB.house} compact />
                      <span className="text-[11px] text-[#9b8f7a]">{analysis.charB.nameEn}</span>
                    </div>
                  </div>
                </button>
              </div>

              {analysis.directLabels.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {analysis.directLabels.map((lbl, idx) => (
                    <span
                      key={idx}
                      className="rounded-full border border-[#f3d578]/40 bg-[#b91c1c]/30 px-3 py-1 text-xs font-semibold text-[#fef3c7]"
                    >
                      {lbl}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="rounded-xl border border-white/10 bg-[#15121e] p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#f3d578] mb-1.5">
                  <Users className="w-4 h-4" /> 혈연 관계
                </div>
                <p className="text-[#ece6da] leading-relaxed">{analysis.bloodSummaryKo}</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#15121e] p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#f43f5e] mb-1.5">
                  <Heart className="w-4 h-4" /> 혼인 · 연인 관계
                </div>
                <p className="text-[#ece6da] leading-relaxed">
                  {analysis.marriageSummaryKo ?? '직접적인 혼인 또는 연인 관계는 아닙니다.'}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#15121e] p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#60a5fa] mb-1.5">
                  <Shield className="w-4 h-4" /> 진영 · 시대 관계
                </div>
                <p className="text-[#ece6da] leading-relaxed">{analysis.factionRelationKo}</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#15121e] p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#f97316] mb-1.5">
                  <Flame className="w-4 h-4" /> 공유한 용 (역대 기수 연결)
                </div>
                {analysis.sharedDragons.length === 0 ? (
                  <p className="text-[#9b8f7a]">같은 용을 기승한 이력은 없습니다.</p>
                ) : (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {analysis.sharedDragons.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => onSelectDragon(d.id)}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#d4af37]/40 bg-[#d4af37]/12 px-3 py-1.5 text-xs font-semibold text-[#fef08a] hover:bg-[#d4af37]/25 cursor-pointer"
                      >
                        <DragonSilhouette className="w-4 h-4" color={d.colorAccent} />
                        {d.nameKo} ({d.epithetKo})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Shortest Path Chain */}
          <div className="valyrian-card rounded-2xl p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#f3d578] mb-4">
              가계도 최단 연결 경로 ({analysis.shortestPath.length}단계)
            </h3>

            {analysis.charA.id === analysis.charB.id ? (
              <p className="text-xs text-[#9b8f7a]">동일한 인물을 선택했습니다.</p>
            ) : analysis.shortestPath.length === 0 ? (
              <p className="text-xs text-[#9b8f7a]">
                현재 가계도 그래프에서 직접 연결된 경로가 없습니다. (예: 드래곤시드 서자 기수)
              </p>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onJumpToCharacter(analysis.charA.id)}
                  className="rounded-xl border border-[#f3d578]/50 bg-[#d4af37]/15 px-3.5 py-2 text-xs font-bold text-[#fef3c7] cursor-pointer"
                >
                  {analysis.charA.nameKo}
                </button>

                {analysis.shortestPath.map((step, idx) => {
                  const target = CHARACTER_MAP[step.toId];
                  if (!target) return null;
                  const isLast = idx === analysis.shortestPath.length - 1;
                  return (
                    <React.Fragment key={idx}>
                      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-[#15121d] px-2.5 py-1 text-[10px] text-[#d4af37]">
                        <span>{step.relationLabelKo}</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                      <button
                        onClick={() => onJumpToCharacter(target.id)}
                        className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                          isLast
                            ? 'border-[#f3d578]/50 bg-[#d4af37]/15 text-[#fef3c7] font-bold'
                            : 'border-white/15 bg-[#171321] text-[#ece6da] hover:border-[#d4af37]/50'
                        }`}
                      >
                        {target.nameKo}
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
