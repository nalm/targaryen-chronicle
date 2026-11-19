'use client';

import React from 'react';
import { Crown, Flame, GitCompare, Heart, Info, Skull, Users, X } from 'lucide-react';
import { CHARACTERS, CHARACTER_MAP } from '@/data/characters';
import { DRAGON_MAP } from '@/data/dragons';
import { Character } from '@/data/types';
import { HouseBadge } from './Sigils';
import { CharacterAvatar, DragonAvatar } from './Portraits';

interface CharacterDrawerProps {
  character: Character | null;
  onClose: () => void;
  onSelectCharacter: (id: string) => void;
  onSelectDragon: (id: string) => void;
  onCompareCharacter: (id: string) => void;
}

export function CharacterDrawer({
  character,
  onClose,
  onSelectCharacter,
  onSelectDragon,
  onCompareCharacter,
}: CharacterDrawerProps) {
  if (!character) return null;

  const parents = character.parents.map((id) => CHARACTER_MAP[id]).filter(Boolean);
  const bioFather = character.biologicalFatherId
    ? CHARACTER_MAP[character.biologicalFatherId]
    : null;
  const children = CHARACTERS.filter(
    (c) => c.parents.includes(character.id) || c.biologicalFatherId === character.id
  );
  const dragons = character.dragonIds.map((id) => DRAGON_MAP[id]).filter(Boolean);

  const factionMeta = {
    black: { label: '흑색파 (Team Black)', cls: 'bg-[#b91c1c]/25 text-[#fca5a5] border-[#ef4444]/40' },
    green: { label: '녹색파 (Team Green)', cls: 'bg-[#15803d]/25 text-[#86efac] border-[#22c55e]/40' },
    early: { label: '초기 왕조', cls: 'bg-[#d4af37]/15 text-[#fde68a] border-[#d4af37]/35' },
    neutral: { label: '중립 · 연결 시대', cls: 'bg-white/10 text-[#d6cec0] border-white/20' },
    got: { label: '왕좌의 게임 (GoT)', cls: 'bg-[#7c3aed]/20 text-[#ddd6fe] border-[#a78bfa]/40' },
  }[character.faction];

  return (
    <aside className="fixed right-0 top-0 lg:top-[64px] bottom-0 lg:bottom-[96px] z-50 lg:z-30 w-full max-w-md border-l border-[#d4af37]/25 bg-[#110e17]/97 backdrop-blur-xl shadow-[-16px_0_40px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="relative border-b border-[#d4af37]/20 p-5 bg-gradient-to-b from-[#1e1726] to-transparent">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg border border-white/10 bg-white/5 p-1.5 text-[#a99b84] hover:text-white cursor-pointer"
          aria-label="닫기"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5 pr-8">
          <CharacterAvatar character={character} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <HouseBadge house={character.house} compact />
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${factionMeta.cls}`}>
                {factionMeta.label}
              </span>
              {character.monarchOrder && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#d4af37]/50 bg-[#d4af37]/20 px-2 py-0.5 text-[10px] font-semibold text-[#fef08a]">
                  <Crown className="w-3 h-3" />
                  제{character.monarchOrder}대 국왕
                </span>
              )}
              {!character.monarchOrder && character.claimant && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#ef4444]/40 bg-[#b91c1c]/20 px-2 py-0.5 text-[10px] font-semibold text-[#fca5a5]">
                  <Crown className="w-3 h-3" />
                  왕위 주장자
                </span>
              )}
            </div>

            <h2 className="font-serif-kr text-lg sm:text-xl font-bold text-[#f7e7ba] leading-tight">
              {character.nameKo}
            </h2>
            <div className="font-display text-[11px] tracking-wider text-[#a99b84] mt-0.5 truncate">
              {character.nameEn}
              {character.epithetKo ? ` · ${character.epithetKo}` : ''}
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#b8ae9c]">
          <span>
            생몰:{' '}
            <strong className="text-[#ece6da]">
              {character.birthAC !== undefined ? `${character.birthAC} AC` : '?'} ~{' '}
              {character.deathAC !== undefined ? `${character.deathAC} AC` : '생존'}
            </strong>
          </span>
          <button
            onClick={() => onCompareCharacter(character.id)}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-[#d4af37]/35 bg-[#d4af37]/12 px-2.5 py-1 text-[11px] font-medium text-[#f3d578] hover:bg-[#d4af37]/25 cursor-pointer"
          >
            <GitCompare className="w-3.5 h-3.5" />
            다른 인물과 관계 분석
          </button>
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
        {/* Summary */}
        <p className="leading-relaxed text-[#dfd7c8] text-[13px]">{character.summaryKo}</p>

        {character.deathNoteKo && (
          <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-[#181421] p-3 text-[#c6bdb0]">
            <Skull className="w-4 h-4 text-[#ef4444] shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] font-semibold text-[#fca5a5] mb-0.5">최후</div>
              <div>{character.deathNoteKo}</div>
            </div>
          </div>
        )}

        {character.showCanonNoteKo && (
          <div className="flex items-start gap-2 rounded-xl border border-[#d4af37]/25 bg-[#d4af37]/8 p-3 text-[#e8d9b0]">
            <Info className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] font-semibold text-[#f3d578] mb-0.5">드라마 정사(Show Canon) 노트</div>
              <div className="leading-relaxed">{character.showCanonNoteKo}</div>
            </div>
          </div>
        )}

        {/* Bonded Dragons */}
        <div>
          <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#f3d578] mb-2">
            <Flame className="w-3.5 h-3.5 text-[#ef4444]" />
            기승한 용 ({dragons.length})
          </h3>
          {dragons.length === 0 ? (
            <div className="rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2 text-[#8d8272]">
              기승한 용이 없습니다.
            </div>
          ) : (
            <div className="space-y-2">
              {dragons.map((d) => (
                <button
                  key={d.id}
                  onClick={() => onSelectDragon(d.id)}
                  className="flex w-full items-center justify-between rounded-xl border border-[#d4af37]/20 bg-[#1a1524] p-2.5 text-left hover:border-[#d4af37]/60 hover:bg-[#221c2e] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <DragonAvatar dragon={d} size="sm" />
                    <div>
                      <div className="font-semibold text-[#f5efe3]">
                        {d.nameKo} <span className="font-display text-[10px] text-[#a99b84]">({d.nameEn})</span>
                      </div>
                      <div className="text-[11px] text-[#b4a996]">{d.epithetKo}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#d4af37]">계보 보기 →</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Spouses / Partners */}
        {character.spouses.length > 0 && (
          <div>
            <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#f3d578] mb-2">
              <Heart className="w-3.5 h-3.5 text-[#f43f5e]" />
              혼인 및 연인 관계
            </h3>
            <div className="space-y-1.5">
              {character.spouses.map((sp, idx) => {
                const partner = CHARACTER_MAP[sp.partnerId];
                if (!partner) return null;
                return (
                  <button
                    key={idx}
                    onClick={() => onSelectCharacter(partner.id)}
                    className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-[#171320] px-3 py-2 text-left hover:border-[#d4af37]/40 cursor-pointer"
                  >
                    <div>
                      <div className="font-medium text-[#f3ece0]">{partner.nameKo}</div>
                      {sp.noteKo && <div className="text-[11px] text-[#a99b84]">{sp.noteKo}</div>}
                    </div>
                    <span className="rounded bg-white/8 px-1.5 py-0.5 text-[10px] text-[#fca5a5]">
                      {sp.type === 'sibling'
                        ? '남매혼'
                        : sp.type === 'uncle-niece'
                        ? '숙질혼'
                        : sp.type === 'cousin'
                        ? '친족혼'
                        : sp.type === 'secret'
                        ? '비밀혼'
                        : sp.type === 'affair'
                        ? '연인'
                        : '정략혼'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Parents & Children */}
        <div className="grid grid-cols-1 gap-4">
          {(parents.length > 0 || bioFather) && (
            <div>
              <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#f3d578] mb-2">
                <Users className="w-3.5 h-3.5" />
                부모
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {parents.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onSelectCharacter(p.id)}
                    className="rounded-lg border border-white/12 bg-[#171320] px-2.5 py-1.5 text-xs text-[#e7dfd1] hover:border-[#d4af37]/50 cursor-pointer"
                  >
                    {p.nameKo}
                  </button>
                ))}
                {bioFather && (
                  <button
                    onClick={() => onSelectCharacter(bioFather.id)}
                    className="rounded-lg border border-purple-400/35 bg-purple-950/30 px-2.5 py-1.5 text-xs text-purple-200 hover:border-purple-300 cursor-pointer"
                  >
                    {bioFather.nameKo} (친부)
                  </button>
                )}
              </div>
            </div>
          )}

          {children.length > 0 && (
            <div>
              <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#f3d578] mb-2">
                <Users className="w-3.5 h-3.5" />
                자녀 ({children.length})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {children.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => onSelectCharacter(ch.id)}
                    className="rounded-lg border border-white/12 bg-[#171320] px-2.5 py-1.5 text-xs text-[#e7dfd1] hover:border-[#d4af37]/50 cursor-pointer"
                  >
                    {ch.nameKo}
                    {ch.biologicalFatherId === character.id ? ' (친자)' : ''}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
