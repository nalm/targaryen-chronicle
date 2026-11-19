'use client';

import React from 'react';
import { Crown } from 'lucide-react';
import { Character, Dragon, HouseId } from '@/data/types';
import { DragonSilhouette } from './Sigils';

export const CHARACTER_PORTRAITS: Record<string, string> = {
  addam: '/images/characters/addam.jpg',
  'aegon-i': '/images/characters/aegon-i.jpg',
  'aegon-ii': '/images/characters/aegon-ii.jpg',
  'aegon-iii': '/images/characters/aegon-iii.jpg',
  'aegon-iv': '/images/characters/aegon-iv.jpg',
  'aegon-v': '/images/characters/aegon-v.jpg',
  aemma: '/images/characters/aemma.jpg',
  aemond: '/images/characters/aemond.jpg',
  'aemon-prince': '/images/characters/aemon-prince.jpg',
  'aenys-i': '/images/characters/aenys-i.jpg',
  'aerys-ii': '/images/characters/aerys-ii.jpg',
  alicent: '/images/characters/alicent.jpg',
  alysanne: '/images/characters/alysanne.jpg',
  alyssa: '/images/characters/alyssa.jpg',
  baela: '/images/characters/baela.jpg',
  baelon: '/images/characters/baelon.jpg',
  'baelor-i': '/images/characters/baelor-i.jpg',
  corlys: '/images/characters/corlys.jpg',
  daemon: '/images/characters/daemon.jpg',
  'daemon-blackfyre': '/images/characters/daemon-blackfyre.jpg',
  daenerys: '/images/characters/daenerys.jpg',
  'daeron-green': '/images/characters/daeron-green.jpg',
  'daeron-i': '/images/characters/daeron-i.jpg',
  'daeron-ii': '/images/characters/daeron-ii.jpg',
  elia: '/images/characters/elia.jpg',
  harwin: '/images/characters/harwin.jpg',
  helaena: '/images/characters/helaena.jpg',
  hugh: '/images/characters/hugh.jpg',
  jacaerys: '/images/characters/jacaerys.jpg',
  jaehaera: '/images/characters/jaehaera.jpg',
  'jaehaerys-green': '/images/characters/jaehaerys-green.jpg',
  'jaehaerys-i': '/images/characters/jaehaerys-i.jpg',
  'joffrey-vel': '/images/characters/joffrey-vel.jpg',
  'jon-snow': '/images/characters/jon-snow.jpg',
  laena: '/images/characters/laena.jpg',
  laenor: '/images/characters/laenor.jpg',
  lucerys: '/images/characters/lucerys.jpg',
  lyanna: '/images/characters/lyanna.jpg',
  'maegor-i': '/images/characters/maegor-i.jpg',
  'maekar-i': '/images/characters/maekar-i.jpg',
  'maester-aemon': '/images/characters/maester-aemon.jpg',
  otto: '/images/characters/otto.jpg',
  rhaegar: '/images/characters/rhaegar.jpg',
  rhaella: '/images/characters/rhaella.jpg',
  'rhaena-velaryon': '/images/characters/rhaena-velaryon.jpg',
  rhaenyra: '/images/characters/rhaenyra.jpg',
  'rhaenys-conqueror': '/images/characters/rhaenys-conqueror.jpg',
  'rhaenys-queen': '/images/characters/rhaenys-queen.jpg',
  ulf: '/images/characters/ulf.jpg',
  visenya: '/images/characters/visenya.jpg',
  'viserys-i': '/images/characters/viserys-i.jpg',
  'viserys-ii': '/images/characters/viserys-ii.jpg',
  'viserys-iii': '/images/characters/viserys-iii.jpg',
};

export const DRAGON_PORTRAITS: Record<string, string> = {
  arrax: '/images/dragons/arrax.jpg',
  balerion: '/images/dragons/balerion.jpg',
  caraxes: '/images/dragons/caraxes.jpg',
  dreamfyre: '/images/dragons/dreamfyre.jpg',
  meleys: '/images/dragons/meleys.jpg',
  meraxes: '/images/dragons/meraxes.jpg',
  moondancer: '/images/dragons/moondancer.jpg',
  quicksilver: '/images/dragons/quicksilver.jpg',
  rhaegal: '/images/dragons/rhaegal.jpg',
  seasmoke: '/images/dragons/seasmoke.jpg',
  sheepstealer: '/images/dragons/sheepstealer.jpg',
  silverwing: '/images/dragons/silverwing.jpg',
  stormcloud: '/images/dragons/stormcloud.jpg',
  sunfyre: '/images/dragons/sunfyre.jpg',
  syrax: '/images/dragons/syrax.jpg',
  tessarion: '/images/dragons/tessarion.jpg',
  tyraxes: '/images/dragons/tyraxes.jpg',
  vermax: '/images/dragons/vermax.jpg',
  vermithor: '/images/dragons/vermithor.jpg',
  vhagar: '/images/dragons/vhagar.jpg',
  viserion: '/images/dragons/viserion.jpg',
};

const HOUSE_GRADIENT: Record<HouseId, [string, string, string]> = {
  targaryen: ['#450a0a', '#991b1b', '#f3d578'],
  velaryon: ['#0c2d48', '#0e7490', '#7dd3fc'],
  hightower: ['#052e16', '#15803d', '#86efac'],
  arryn: ['#172554', '#1d4ed8', '#93c5fd'],
  strong: ['#2e1065', '#6b21a8', '#d8b4fe'],
  stark: ['#1e293b', '#475569', '#e2e8f0'],
  baratheon: ['#422006', '#a16207', '#fde047'],
  martell: ['#431407', '#c2410c', '#fdba74'],
  other: ['#292524', '#78350f', '#fcd34d'],
};

function getInitials(nameEn: string): string {
  const parts = nameEn
    .replace(/^(King|Queen|Prince|Princess|Lady|Ser|Maester)\s+/i, '')
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return 'T';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function CharacterAvatar({
  character,
  size = 'md',
  className = '',
}: {
  character: Character;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
}) {
  const src = CHARACTER_PORTRAITS[character.id];
  const [from, to, accent] = HOUSE_GRADIENT[character.house];

  const dims = {
    xs: 'h-7 w-7 text-[10px] rounded-lg',
    sm: 'h-10 w-10 text-xs rounded-xl',
    md: 'h-12 w-12 text-sm rounded-xl',
    lg: 'h-16 w-16 text-base rounded-2xl',
    hero: 'h-24 w-24 text-xl rounded-2xl',
  }[size];

  if (src) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden border border-[#d4af37]/45 bg-[#120f18] shadow-md ${dims} ${className}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={character.nameKo}
          className="h-full w-full object-cover object-top"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/15" />
      </div>
    );
  }

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden border border-[#d4af37]/30 shadow-inner ${dims} ${className}`}
      style={{
        background: `radial-gradient(circle at 30% 25%, ${to}cc 0%, ${from}ee 72%, #0a080e 100%)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-1 rounded-[inherit] border border-dashed opacity-30"
        style={{ borderColor: accent }}
      />
      <span
        className="font-display font-bold tracking-wider drop-shadow"
        style={{ color: accent }}
      >
        {getInitials(character.nameEn)}
      </span>
      {character.monarchOrder && size !== 'xs' && (
        <Crown className="absolute top-1 right-1 h-2.5 w-2.5 text-[#f3d578] opacity-85" />
      )}
    </div>
  );
}

export function DragonAvatar({
  dragon,
  size = 'md',
  className = '',
}: {
  dragon: Dragon;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
}) {
  const src = DRAGON_PORTRAITS[dragon.id];

  const dims = {
    sm: 'h-9 w-9 rounded-lg',
    md: 'h-12 w-12 rounded-xl',
    lg: 'h-16 w-16 rounded-2xl',
    hero: 'h-28 w-28 sm:h-32 sm:w-32 rounded-2xl',
  }[size];

  if (src) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden border border-[#d4af37]/45 bg-[#120f18] shadow-lg ${dims} ${className}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={dragon.nameKo}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/15" />
      </div>
    );
  }

  const iconSize = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
    hero: 'w-16 h-16',
  }[size];

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden border border-white/20 shadow-lg ${dims} ${className}`}
      style={{
        background: `radial-gradient(circle at 30% 25%, ${dragon.colorAccent}55 0%, ${dragon.colorPrimary}cc 68%, #0a080e 100%)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-1 rounded-[inherit] border opacity-30"
        style={{ borderColor: dragon.colorAccent }}
      />
      <DragonSilhouette className={`${iconSize} drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]`} color={dragon.colorAccent} />
    </div>
  );
}
