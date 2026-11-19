'use client';

import React from 'react';
import { HouseId } from '@/data/types';

export function TargaryenCrest({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="29" stroke="url(#goldGrad)" strokeWidth="1.8" strokeOpacity="0.85" />
      <circle cx="32" cy="32" r="24" stroke="#b91c1c" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.6" />
      {/* Stylized three-headed dragon emblem */}
      <path
        d="M32 12 C28 16, 25 21, 27 27 C23 23, 18 22, 14 26 C18 28, 20 32, 22 36 C17 37, 15 41, 18 46 C23 44, 27 42, 32 45 C37 42, 41 44, 46 46 C49 41, 47 37, 42 36 C44 32, 46 28, 50 26 C46 22, 41 23, 37 27 C39 21, 36 16, 32 12 Z"
        fill="url(#crimsonGrad)"
        stroke="#f3d578"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M32 45 L32 54 M28 50 L32 54 L36 50" stroke="#f3d578" strokeWidth="1.5" strokeLinecap="round" />
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="64" y2="64">
          <stop offset="0%" stopColor="#f3d578" />
          <stop offset="100%" stopColor="#a67c1e" />
        </linearGradient>
        <linearGradient id="crimsonGrad" x1="32" y1="12" x2="32" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function DragonSilhouette({
  className = 'w-5 h-5',
  color = '#d4af37',
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 22 C8 18, 10 12, 15 10 C13 7, 15 4, 19 5 C18 7, 20 8, 23 7 C21 10, 21 13, 25 14 C27 12, 29 12, 30 14 C27 17, 24 19, 20 19 C22 22, 24 25, 21 27 C18 25, 16 22, 13 21 C10 23, 7 25, 4 22 Z"
        fill={color}
        fillOpacity="0.9"
      />
    </svg>
  );
}

export function HouseBadge({ house, compact = false }: { house: HouseId; compact?: boolean }) {
  const meta: Record<HouseId, { label: string; color: string; bg: string }> = {
    targaryen: { label: '타르가르옌', color: '#fca5a5', bg: 'rgba(185,28,28,0.22)' },
    velaryon: { label: '벨라리온', color: '#7dd3fc', bg: 'rgba(14,116,144,0.25)' },
    hightower: { label: '하이타워', color: '#86efac', bg: 'rgba(21,128,61,0.25)' },
    arryn: { label: '아린', color: '#93c5fd', bg: 'rgba(37,99,235,0.22)' },
    strong: { label: '스트롱', color: '#d8b4fe', bg: 'rgba(107,33,168,0.24)' },
    stark: { label: '스타크', color: '#cbd5e1', bg: 'rgba(71,85,105,0.32)' },
    baratheon: { label: '바라테온', color: '#fde047', bg: 'rgba(161,98,7,0.25)' },
    martell: { label: '마르텔', color: '#fdba74', bg: 'rgba(194,65,12,0.25)' },
    other: { label: '드래곤시드', color: '#fcd34d', bg: 'rgba(180,83,9,0.25)' },
  };
  const m = meta[house];
  return (
    <span
      className={`inline-flex items-center rounded-full border border-white/10 font-medium ${
        compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs'
      }`}
      style={{ color: m.color, backgroundColor: m.bg }}
    >
      {m.label}
    </span>
  );
}
