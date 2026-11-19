'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Crown,
  Flame,
  Focus,
  Maximize2,
  Minus,
  Plus,
  Skull,
  Swords,
} from 'lucide-react';
import { CHARACTERS } from '@/data/characters';
import { DRAGON_MAP } from '@/data/dragons';
import { ERAS, EraId, FactionId, TimelineSnapshot } from '@/data/types';
import {
  buildFamilyLayout,
  getEdgePath,
  NODE_HEIGHT,
  NODE_WIDTH,
} from '@/lib/layout';
import { DragonSilhouette } from './Sigils';
import { CharacterAvatar } from './Portraits';

interface FamilyTreeViewProps {
  selectedCharacterId: string | null;
  onSelectCharacter: (id: string | null) => void;
  activeSnapshot: TimelineSnapshot | null;
  focusRequestId: { id: string; nonce: number } | null;
}

export function FamilyTreeView({
  selectedCharacterId,
  onSelectCharacter,
  activeSnapshot,
  focusRequestId,
}: FamilyTreeViewProps) {
  const layout = useMemo(() => buildFamilyLayout(CHARACTERS), []);
  const containerRef = useRef<HTMLDivElement>(null);

  const [zoom, setZoom] = useState(0.76);
  const [pan, setPan] = useState({ x: -240, y: -340 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const movedRef = useRef(false);

  const [factionFilter, setFactionFilter] = useState<'all' | 'black' | 'green' | 'riders'>('all');

  // Center on HotD core (Viserys I / Rhaenyra) on first mount
  useEffect(() => {
    const el = containerRef.current;
    const anchor = layout.nodeMap['rhaenyra'];
    if (!el || !anchor) return;
    const rect = el.getBoundingClientRect();
    const initialZoom = 0.78;
    setZoom(initialZoom);
    setPan({
      x: rect.width / 2 - anchor.x * initialZoom,
      y: rect.height / 2 - anchor.y * initialZoom,
    });
  }, [layout]);

  // Center on externally requested character (e.g. search or jump)
  useEffect(() => {
    if (!focusRequestId) return;
    const el = containerRef.current;
    const target = layout.nodeMap[focusRequestId.id];
    if (!el || !target) return;
    const rect = el.getBoundingClientRect();
    const targetZoom = Math.max(zoom, 0.85);
    setZoom(targetZoom);
    setPan({
      x: rect.width / 2 - target.x * targetZoom - 120,
      y: rect.height / 2 - target.y * targetZoom,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusRequestId]);

  const jumpToEra = (eraId: EraId) => {
    const el = containerRef.current;
    if (!el) return;
    const eraNodes = layout.nodes.filter((n) => n.character.era === eraId);
    if (eraNodes.length === 0) return;
    const avgX = eraNodes.reduce((s, n) => s + n.x, 0) / eraNodes.length;
    const avgY = eraNodes.reduce((s, n) => s + n.y, 0) / eraNodes.length;
    const rect = el.getBoundingClientRect();
    const nextZoom = eraId === 'dance' ? 0.74 : 0.84;
    setZoom(nextZoom);
    setPan({
      x: rect.width / 2 - avgX * nextZoom,
      y: rect.height / 2 - avgY * nextZoom,
    });
  };

  // Connected set when a character is selected
  const highlightedIds = useMemo(() => {
    if (!selectedCharacterId) return null;
    const set = new Set<string>([selectedCharacterId]);
    for (const edge of layout.edges) {
      if (edge.fromId === selectedCharacterId) set.add(edge.toId);
      if (edge.toId === selectedCharacterId) set.add(edge.fromId);
    }
    return set;
  }, [selectedCharacterId, layout.edges]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('[data-node-card="true"]')) return;
    setIsDragging(true);
    movedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) movedRef.current = true;
    setPan({ x: dragStartRef.current.panX + dx, y: dragStartRef.current.panY + dy });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    if (!movedRef.current && selectedCharacterId) {
      onSelectCharacter(null);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const delta = e.deltaY < 0 ? 1.1 : 0.91;
    const nextZoom = Math.min(1.45, Math.max(0.35, zoom * delta));
    const ratio = nextZoom / zoom;
    setZoom(nextZoom);
    setPan({
      x: mouseX - (mouseX - pan.x) * ratio,
      y: mouseY - (mouseY - pan.y) * ratio,
    });
  };

  const factionBorder = (faction: FactionId) => {
    switch (faction) {
      case 'black':
        return 'border-[#ef4444]/55 hover:border-[#f87171]';
      case 'green':
        return 'border-[#22c55e]/55 hover:border-[#4ade80]';
      case 'got':
        return 'border-[#a78bfa]/55 hover:border-[#c4b5fd]';
      case 'early':
        return 'border-[#d4af37]/55 hover:border-[#f3d578]';
      default:
        return 'border-white/20 hover:border-[#d4af37]/50';
    }
  };

  return (
    <div className="relative h-[calc(100vh-152px)] w-full overflow-hidden select-none">
      {/* Top Floating Controls: Era Quick-Jump + Filters */}
      <div className="pointer-events-none absolute top-3 left-3 right-3 z-20 flex flex-wrap items-start justify-between gap-2">
        {/* Era Jump Buttons */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-1 rounded-xl border border-[#d4af37]/25 bg-[#100d16]/90 p-1.5 backdrop-blur-md shadow-xl">
          <span className="px-2 text-[10px] font-semibold uppercase tracking-wider text-[#a99b84]">
            시대 이동
          </span>
          {ERAS.map((era) => (
            <button
              key={era.id}
              onClick={() => jumpToEra(era.id)}
              className="rounded-lg px-2.5 py-1 text-[11px] font-medium text-[#dfd7c8] hover:bg-[#d4af37]/20 hover:text-[#fef3c7] transition-colors cursor-pointer"
            >
              {era.labelKo}
            </button>
          ))}
        </div>

        {/* Faction Filter + Zoom Controls */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl border border-[#d4af37]/25 bg-[#100d16]/90 p-1 backdrop-blur-md shadow-xl text-[11px]">
            {[
              { id: 'all', label: '전체' },
              { id: 'black', label: '흑색파' },
              { id: 'green', label: '녹색파' },
              { id: 'riders', label: '용 기수만' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFactionFilter(f.id as typeof factionFilter)}
                className={`rounded-lg px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                  factionFilter === f.id
                    ? 'bg-[#d4af37]/25 text-[#fef3c7]'
                    : 'text-[#a99b84] hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-[#d4af37]/25 bg-[#100d16]/90 p-1 backdrop-blur-md shadow-xl">
            <button
              onClick={() => setZoom((z) => Math.max(0.35, z - 0.12))}
              className="rounded-lg p-1.5 text-[#dfd7c8] hover:bg-white/10 cursor-pointer"
              title="축소"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-11 text-center text-[11px] font-mono text-[#d4af37]">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(1.45, z + 0.12))}
              className="rounded-lg p-1.5 text-[#dfd7c8] hover:bg-white/10 cursor-pointer"
              title="확대"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => jumpToEra('dance')}
              className="rounded-lg p-1.5 text-[#dfd7c8] hover:bg-white/10 cursor-pointer"
              title="용들의 춤 중심으로 복귀"
            >
              <Focus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setZoom(0.42);
                setPan({ x: 80, y: 20 });
              }}
              className="rounded-lg p-1.5 text-[#dfd7c8] hover:bg-white/10 cursor-pointer"
              title="전체 계보 한눈에 보기"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom-Left Compact Legend */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-20 hidden sm:flex flex-wrap items-center gap-3 rounded-xl border border-[#d4af37]/20 bg-[#100d16]/88 px-3 py-2 text-[11px] text-[#c4b9a6] backdrop-blur-md">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 bg-[#d4af37]" /> 혈연
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 bg-[#f43f5e]" /> 혼인·근친혼
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 border-t border-dashed border-[#c084fc]" /> 친부 의혹·비밀
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" /> 흑색파
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" /> 녹색파
        </span>
        <span className="flex items-center gap-1">
          <Crown className="w-3 h-3 text-[#f3d578]" /> 국왕
        </span>
      </div>

      {/* Interactive Pan/Zoom Canvas */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        className={`h-full w-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          backgroundImage:
            'radial-gradient(rgba(212,175,55,0.08) 1px, transparent 1px)',
          backgroundSize: `${28 * zoom}px ${28 * zoom}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`,
        }}
      >
        <div
          style={{
            width: layout.width,
            height: layout.height,
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
          className="relative"
        >
          {/* Era horizontal guide labels */}
          {ERAS.map((era) => {
            const topY = (layout.genY[era.minGen] ?? 0) - 66;
            return (
              <div
                key={era.id}
                style={{ top: topY, left: 40, width: layout.width - 80 }}
                className="pointer-events-none absolute border-t border-[#d4af37]/15 pt-1.5"
              >
                <div className="inline-flex items-baseline gap-2 rounded-r-lg bg-[#0d0b12]/80 pr-3">
                  <span className="font-serif-kr text-xs font-bold text-[#d4af37]/80">
                    {era.labelKo}
                  </span>
                  <span className="font-display text-[10px] tracking-widest text-[#7f7462]">
                    {era.yearsLabel}
                  </span>
                </div>
              </div>
            );
          })}

          {/* SVG Edges Layer */}
          <svg
            width={layout.width}
            height={layout.height}
            className="pointer-events-none absolute inset-0 overflow-visible"
          >
            {layout.edges.map((edge) => {
              const d = getEdgePath(edge, layout.nodeMap);
              if (!d) return null;

              const isHighlighted =
                !highlightedIds ||
                (highlightedIds.has(edge.fromId) && highlightedIds.has(edge.toId));

              let stroke = '#d4af37';
              let strokeWidth = 1.6;
              let dashArray: string | undefined;

              if (edge.kind === 'spouse') {
                stroke =
                  edge.marriageType === 'affair' || edge.marriageType === 'secret'
                    ? '#c084fc'
                    : '#f43f5e';
                strokeWidth = 2.1;
                if (edge.marriageType === 'affair' || edge.marriageType === 'secret') {
                  dashArray = '5 4';
                }
              } else if (edge.kind === 'bio-father') {
                stroke = '#c084fc';
                strokeWidth = 1.7;
                dashArray = '4 4';
              }

              return (
                <path
                  key={edge.id}
                  d={d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={isHighlighted ? strokeWidth : 1.1}
                  strokeDasharray={dashArray}
                  strokeOpacity={isHighlighted ? 0.78 : 0.14}
                  className="transition-opacity duration-200"
                />
              );
            })}
          </svg>

          {/* Character Nodes Layer */}
          {layout.nodes.map(({ character: c, x, y }) => {
            const isSelected = selectedCharacterId === c.id;
            const isConnected = !highlightedIds || highlightedIds.has(c.id);

            // Filter dimming
            const matchesFilter =
              factionFilter === 'all' ||
              (factionFilter === 'black' && c.faction === 'black') ||
              (factionFilter === 'green' && c.faction === 'green') ||
              (factionFilter === 'riders' && c.dragonIds.length > 0);

            // Timeline status
            const year = activeSnapshot?.yearAC;
            const isUnborn = year !== undefined && c.birthAC !== undefined && year < c.birthAC;
            const isDeadAtYear = year !== undefined && c.deathAC !== undefined && year > c.deathAC;
            const isActiveMonarch = activeSnapshot?.monarchId === c.id;
            const isActiveRival = activeSnapshot?.rivalClaimantId === c.id;

            const opacityClass = !isConnected || !matchesFilter
              ? 'opacity-20'
              : isUnborn
              ? 'opacity-25'
              : isDeadAtYear
              ? 'opacity-55 grayscale-[45%]'
              : 'opacity-100';

            const glowClass = isSelected
              ? 'ring-2 ring-[#f3d578] valyrian-glow-gold scale-[1.04] z-20'
              : isActiveMonarch
              ? 'ring-2 ring-[#d4af37] valyrian-glow-gold z-10'
              : isActiveRival
              ? 'ring-2 ring-[#ef4444] valyrian-glow-black z-10'
              : '';

            const primaryDragon = c.dragonIds[0] ? DRAGON_MAP[c.dragonIds[0]] : null;

            return (
              <button
                key={c.id}
                data-node-card="true"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCharacter(c.id);
                }}
                style={{
                  left: x - NODE_WIDTH / 2,
                  top: y - NODE_HEIGHT / 2,
                  width: NODE_WIDTH,
                  height: NODE_HEIGHT,
                }}
                className={`valyrian-card absolute flex flex-col justify-between rounded-xl p-2.5 text-left transition-all duration-200 cursor-pointer ${factionBorder(
                  c.faction
                )} ${opacityClass} ${glowClass}`}
              >
                {/* Top row: Monarch / Status / Dragon icon */}
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 min-w-0">
                    {(c.monarchOrder || isActiveMonarch) && (
                      <span
                        className="inline-flex items-center gap-0.5 rounded bg-[#d4af37]/20 px-1 py-0.5 text-[9px] font-bold text-[#fde68a]"
                        title="철왕좌 국왕"
                      >
                        <Crown className="w-2.5 h-2.5" />
                        {c.monarchOrder ? `${c.monarchOrder}대` : '왕좌'}
                      </span>
                    )}
                    {isActiveRival && (
                      <span className="inline-flex items-center gap-0.5 rounded bg-[#b91c1c]/30 px-1 py-0.5 text-[9px] font-bold text-[#fca5a5]">
                        <Swords className="w-2.5 h-2.5" />
                        대립
                      </span>
                    )}
                    {!c.monarchOrder && !isActiveMonarch && !isActiveRival && (
                      <span className="truncate text-[9px] font-medium text-[#9b8f7a]">
                        {c.epithetKo ?? c.house.toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {isDeadAtYear && <Skull className="w-3 h-3 text-[#a1a1aa]" />}
                    {primaryDragon && (
                      <span
                        className="inline-flex items-center gap-0.5 rounded-full border border-white/10 bg-black/40 px-1.5 py-0.5 text-[9px] text-[#fcd34d]"
                        title={`기승 용: ${c.dragonIds.map((id) => DRAGON_MAP[id]?.nameKo).join(', ')}`}
                      >
                        <DragonSilhouette className="w-3 h-3" color={primaryDragon.colorAccent} />
                        <span className="max-w-[52px] truncate">{primaryDragon.nameKo}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Middle: Avatar + Name Ko + En */}
                <div className="my-0.5 flex items-center gap-2 min-w-0">
                  <CharacterAvatar character={c} size="sm" className="!h-9 !w-9 !rounded-lg" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-serif-kr text-[13px] font-bold text-[#f5efe3] leading-tight">
                      {c.nameKo}
                    </div>
                    <div className="truncate font-display text-[9px] tracking-wide text-[#9b8f7a]">
                      {c.nameEn}
                    </div>
                  </div>
                </div>

                {/* Bottom: Lifespan & faction bar */}
                <div className="flex items-center justify-between text-[9px] text-[#8d8272]">
                  <span>
                    {c.birthAC !== undefined ? `${c.birthAC}` : '?'}–
                    {c.deathAC !== undefined ? `${c.deathAC} AC` : '생존'}
                  </span>
                  {c.dragonIds.length > 1 && (
                    <span className="inline-flex items-center gap-0.5 text-[#f97316]">
                      <Flame className="w-2.5 h-2.5" />+{c.dragonIds.length - 1}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
