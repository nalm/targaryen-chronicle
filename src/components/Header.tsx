'use client';

import React, { useMemo, useState } from 'react';
import { Flame, GitBranch, Search, Shield, Users, X } from 'lucide-react';
import { CHARACTERS } from '@/data/characters';
import { DRAGONS } from '@/data/dragons';
import { TargaryenCrest } from './Sigils';

export type ActiveTab = 'tree' | 'dragons' | 'kinship' | 'warroom';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onSelectCharacter: (id: string) => void;
  onSelectDragon: (id: string) => void;
}

export function Header({
  activeTab,
  onTabChange,
  onSelectCharacter,
  onSelectDragon,
}: HeaderProps) {
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { chars: [], dragons: [] };
    const chars = CHARACTERS.filter(
      (c) =>
        c.nameKo.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        (c.epithetKo && c.epithetKo.toLowerCase().includes(q))
    ).slice(0, 6);
    const dragons = DRAGONS.filter(
      (d) =>
        d.nameKo.toLowerCase().includes(q) ||
        d.nameEn.toLowerCase().includes(q) ||
        d.epithetKo.toLowerCase().includes(q)
    ).slice(0, 4);
    return { chars, dragons };
  }, [query]);

  const tabs: { id: ActiveTab; label: string; sub: string; icon: React.ReactNode }[] = [
    { id: 'tree', label: '가계도 탐색', sub: 'Lineage', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'dragons', label: '용 & 기수 계보', sub: 'Dragons', icon: <Flame className="w-4 h-4" /> },
    { id: 'kinship', label: '관계 탐색기', sub: 'Kinship', icon: <Users className="w-4 h-4" /> },
    { id: 'warroom', label: '흑색파 vs 녹색파', sub: 'War Room', icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#d4af37]/20 bg-[#0b090f]/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1680px] flex-wrap items-center justify-between gap-3 px-4 py-2.5">
        {/* Brand */}
        <button
          onClick={() => onTabChange('tree')}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <TargaryenCrest className="w-9 h-9 shrink-0 transition-transform duration-300 group-hover:scale-105" />
          <div>
            <div className="flex items-baseline gap-2">
              <h1 className="font-serif-kr text-base sm:text-lg font-bold tracking-wide text-[#f3d578]">
                불과 피의 연대기
              </h1>
              <span className="hidden md:inline font-display text-[11px] uppercase tracking-[0.2em] text-[#a99b84]">
                House Targaryen
              </span>
            </div>
            <p className="text-[11px] text-[#9b8f7a]">
              하우스 오브 드래곤 · 왕좌의 게임 통합 가계도 &amp; 용 계보
            </p>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 rounded-xl border border-[#d4af37]/15 bg-[#13101a]/90 p-1">
          {tabs.map((t) => {
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onTabChange(t.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  active
                    ? 'bg-gradient-to-b from-[#b91c1c]/80 to-[#7f1d1d]/90 text-[#fef3c7] shadow-[0_0_16px_rgba(185,28,28,0.45)] border border-[#f3d578]/35'
                    : 'text-[#b8ae9c] hover:text-[#f3d578] hover:bg-white/5 border border-transparent'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Global Search */}
        <div className="relative w-full sm:w-64">
          <div className="flex items-center rounded-lg border border-[#d4af37]/25 bg-[#15121d] px-2.5 py-1.5 focus-within:border-[#d4af37]/70">
            <Search className="w-4 h-4 text-[#a99b84] shrink-0" />
            <input
              type="text"
              value={query}
              onFocus={() => setSearchOpen(true)}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchOpen(true);
              }}
              placeholder="인물 또는 용 검색 (예: 라에니라, 바가르)"
              className="ml-2 w-full bg-transparent text-xs text-[#ece6da] placeholder-[#7d7363] outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-[#8e8372] hover:text-white cursor-pointer"
                aria-label="검색어 지우기"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {searchOpen && query.trim() && (
            <div className="absolute right-0 mt-1.5 w-full sm:w-80 rounded-xl border border-[#d4af37]/30 bg-[#14111b] p-2 shadow-2xl z-50">
              {results.chars.length === 0 && results.dragons.length === 0 ? (
                <div className="py-4 text-center text-xs text-[#8b8170]">
                  검색 결과가 없습니다.
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {results.chars.length > 0 && (
                    <div>
                      <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#d4af37]">
                        인물 ({results.chars.length})
                      </div>
                      {results.chars.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            onSelectCharacter(c.id);
                            setSearchOpen(false);
                            setQuery('');
                          }}
                          className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs hover:bg-white/8 cursor-pointer"
                        >
                          <div>
                            <div className="font-medium text-[#f3ece0]">{c.nameKo}</div>
                            <div className="text-[10px] text-[#9b8f7a]">{c.nameEn}</div>
                          </div>
                          {c.epithetKo && (
                            <span className="text-[10px] text-[#d4af37]/80">{c.epithetKo}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  {results.dragons.length > 0 && (
                    <div>
                      <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#ef4444]">
                        용 ({results.dragons.length})
                      </div>
                      {results.dragons.map((d) => (
                        <button
                          key={d.id}
                          onClick={() => {
                            onSelectDragon(d.id);
                            setSearchOpen(false);
                            setQuery('');
                          }}
                          className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs hover:bg-white/8 cursor-pointer"
                        >
                          <div>
                            <div className="font-medium text-[#f3ece0]">{d.nameKo}</div>
                            <div className="text-[10px] text-[#9b8f7a]">{d.nameEn}</div>
                          </div>
                          <span className="text-[10px] text-[#fca5a5]">{d.epithetKo}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
