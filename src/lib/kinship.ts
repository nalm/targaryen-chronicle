import { CHARACTERS, CHARACTER_MAP } from '@/data/characters';
import { DRAGONS, DRAGON_MAP } from '@/data/dragons';
import { Character, Dragon, MarriageType } from '@/data/types';

export interface PathStep {
  fromId: string;
  toId: string;
  relationLabelKo: string;
  kind: 'parent' | 'child' | 'spouse' | 'bio-parent' | 'bio-child' | 'dragon';
}

export interface KinshipAnalysis {
  charA: Character;
  charB: Character;
  directLabels: string[];
  bloodSummaryKo: string;
  marriageSummaryKo?: string;
  sharedDragons: Dragon[];
  factionRelationKo: string;
  shortestPath: PathStep[];
}

const MARRIAGE_TYPE_KO: Record<MarriageType, string> = {
  sibling: '남매 근친혼',
  'uncle-niece': '숙부·조카 / 고모·조카 관계',
  cousin: '사촌·친족 혼인',
  political: '정략혼',
  secret: '비밀 정식 혼인',
  affair: '비밀 연인 관계',
};

function getParentsAll(c: Character): string[] {
  const set = new Set(c.parents);
  if (c.biologicalFatherId) set.add(c.biologicalFatherId);
  return Array.from(set);
}

function getAncestorsWithDepth(startId: string): Map<string, number> {
  const dist = new Map<string, number>();
  const queue: [string, number][] = [[startId, 0]];
  dist.set(startId, 0);

  while (queue.length > 0) {
    const [cur, d] = queue.shift()!;
    const ch = CHARACTER_MAP[cur];
    if (!ch) continue;
    for (const p of getParentsAll(ch)) {
      if (!dist.has(p) || dist.get(p)! > d + 1) {
        dist.set(p, d + 1);
        queue.push([p, d + 1]);
      }
    }
  }
  return dist;
}

function describeBloodRelation(a: Character, b: Character): string {
  if (a.id === b.id) return '동일 인물입니다.';

  // Direct parent / child
  if (b.parents.includes(a.id)) {
    return `${a.nameKo}은(는) ${b.nameKo}의 ${a.gender === 'M' ? '아버지' : '어머니'}입니다.`;
  }
  if (b.biologicalFatherId === a.id) {
    return `${a.nameKo}은(는) ${b.nameKo}의 생물학적 친부(비공식)입니다.`;
  }
  if (a.parents.includes(b.id)) {
    return `${a.nameKo}은(는) ${b.nameKo}의 ${a.gender === 'M' ? '아들' : '딸'}입니다.`;
  }
  if (a.biologicalFatherId === b.id) {
    return `${b.nameKo}은(는) ${a.nameKo}의 생물학적 친부(비공식)입니다.`;
  }

  // Ancestors map
  const ancA = getAncestorsWithDepth(a.id);
  const ancB = getAncestorsWithDepth(b.id);

  // Direct lineage
  if (ancB.has(a.id)) {
    const depth = ancB.get(a.id)!;
    if (depth === 2) return `${a.nameKo}은(는) ${b.nameKo}의 조부모(할아버지/할머니)입니다.`;
    if (depth === 3) return `${a.nameKo}은(는) ${b.nameKo}의 증조부모입니다.`;
    return `${a.nameKo}은(는) ${b.nameKo}의 ${depth}대 직계 조상입니다.`;
  }
  if (ancA.has(b.id)) {
    const depth = ancA.get(b.id)!;
    if (depth === 2) return `${a.nameKo}은(는) ${b.nameKo}의 손주(${a.gender === 'M' ? '손자' : '손녀'})입니다.`;
    if (depth === 3) return `${a.nameKo}은(는) ${b.nameKo}의 증손주입니다.`;
    return `${a.nameKo}은(는) ${b.nameKo}의 ${depth}대 직계 후손입니다.`;
  }

  // Common ancestors
  let bestCommon: { id: string; da: number; db: number } | null = null;
  for (const [ancId, da] of ancA.entries()) {
    if (ancB.has(ancId)) {
      const db = ancB.get(ancId)!;
      if (!bestCommon || da + db < bestCommon.da + bestCommon.db) {
        bestCommon = { id: ancId, da, db };
      }
    }
  }

  if (!bestCommon) {
    return '직접적인 혈연 공통 조상은 가계도 내에 없으며, 혼인이나 동맹으로 연결됩니다.';
  }

  const { id: commonId, da, db } = bestCommon;
  const commonName = CHARACTER_MAP[commonId]?.nameKo ?? '';

  if (da === 1 && db === 1) {
    const sharedParents = getParentsAll(a).filter((p) => getParentsAll(b).includes(p));
    if (sharedParents.length >= 2) {
      return `친형제·남매 관계입니다. (공통 부모: ${commonName} 등)`;
    }
    return `이복·이부 형제/남매 관계입니다. (공통 부모: ${commonName})`;
  }

  if (da === 1 && db === 2) {
    return `${a.nameKo}은(는) ${b.nameKo}의 ${a.gender === 'M' ? '삼촌/숙부' : '고모/이모'}입니다. (공통 조상: ${commonName})`;
  }
  if (da === 2 && db === 1) {
    return `${a.nameKo}은(는) ${b.nameKo}의 조카입니다. (${b.nameKo}이(가) ${b.gender === 'M' ? '삼촌/숙부' : '고모/이모'})`;
  }
  if (da === 2 && db === 2) {
    return `사촌 관계입니다. (공통 조부모: ${commonName})`;
  }
  if ((da === 1 && db === 3) || (da === 3 && db === 1)) {
    return `종조부모–조카손주 관계입니다. (공통 조상: ${commonName})`;
  }

  return `${commonName}을(를) 공통 조상으로 둔 방계 혈족입니다. (${a.nameKo} ${da}대, ${b.nameKo} ${db}대)`;
}

function findShortestPath(startId: string, endId: string): PathStep[] {
  if (startId === endId) return [];

  // Build adjacency list
  const adj: Record<string, PathStep[]> = {};
  const add = (step: PathStep) => {
    if (!adj[step.fromId]) adj[step.fromId] = [];
    adj[step.fromId].push(step);
  };

  for (const c of CHARACTERS) {
    for (const p of c.parents) {
      if (!CHARACTER_MAP[p]) continue;
      add({ fromId: c.id, toId: p, relationLabelKo: '부모', kind: 'parent' });
      add({ fromId: p, toId: c.id, relationLabelKo: '자녀', kind: 'child' });
    }
    if (c.biologicalFatherId && CHARACTER_MAP[c.biologicalFatherId]) {
      add({ fromId: c.id, toId: c.biologicalFatherId, relationLabelKo: '친부(비공식)', kind: 'bio-parent' });
      add({ fromId: c.biologicalFatherId, toId: c.id, relationLabelKo: '친자(비공식)', kind: 'bio-child' });
    }
    for (const sp of c.spouses) {
      if (!CHARACTER_MAP[sp.partnerId]) continue;
      add({
        fromId: c.id,
        toId: sp.partnerId,
        relationLabelKo: sp.type === 'affair' ? '연인' : '혼인/배우자',
        kind: 'spouse',
      });
    }
  }

  // BFS
  const visited = new Set<string>([startId]);
  const parentStep = new Map<string, PathStep>();
  const queue: string[] = [startId];

  while (queue.length > 0) {
    const cur = queue.shift()!;
    if (cur === endId) break;
    for (const edge of adj[cur] ?? []) {
      if (!visited.has(edge.toId)) {
        visited.add(edge.toId);
        parentStep.set(edge.toId, edge);
        queue.push(edge.toId);
      }
    }
  }

  if (!visited.has(endId)) return [];

  const path: PathStep[] = [];
  let cur = endId;
  while (cur !== startId) {
    const step = parentStep.get(cur)!;
    path.unshift(step);
    cur = step.fromId;
  }
  return path;
}

export function analyzeKinship(idA: string, idB: string): KinshipAnalysis | null {
  const charA = CHARACTER_MAP[idA];
  const charB = CHARACTER_MAP[idB];
  if (!charA || !charB) return null;

  const directLabels: string[] = [];
  const bloodSummaryKo = describeBloodRelation(charA, charB);

  const spouseLink = charA.spouses.find((s) => s.partnerId === charB.id);
  let marriageSummaryKo: string | undefined;
  if (spouseLink) {
    const typeLabel = MARRIAGE_TYPE_KO[spouseLink.type];
    directLabels.push(typeLabel);
    marriageSummaryKo = `${typeLabel}${spouseLink.noteKo ? ` — ${spouseLink.noteKo}` : ''}`;
  }

  // Add short blood badge
  if (bloodSummaryKo.includes('친형제') || bloodSummaryKo.includes('이복')) directLabels.push('형제·남매');
  else if (bloodSummaryKo.includes('삼촌') || bloodSummaryKo.includes('고모') || bloodSummaryKo.includes('조카'))
    directLabels.push('숙질(삼촌/고모·조카)');
  else if (bloodSummaryKo.includes('사촌')) directLabels.push('사촌');
  else if (bloodSummaryKo.includes('아버지') || bloodSummaryKo.includes('어머니') || bloodSummaryKo.includes('아들') || bloodSummaryKo.includes('딸'))
    directLabels.push('부모·자녀');
  else if (bloodSummaryKo.includes('직계')) directLabels.push('직계 혈통');

  // Shared dragons
  const sharedDragons = DRAGONS.filter(
    (d) =>
      d.riders.some((r) => r.characterId === charA.id) &&
      d.riders.some((r) => r.characterId === charB.id)
  );
  if (sharedDragons.length > 0) {
    directLabels.push(`같은 용 기승 (${sharedDragons.map((d) => d.nameKo).join(', ')})`);
  }

  // Faction comparison
  let factionRelationKo = '서로 다른 시대에 활약한 인물입니다.';
  if (charA.faction === 'black' && charB.faction === 'black') {
    factionRelationKo = '같은 흑색파(Team Black · 라에니라 진영) 소속입니다.';
  } else if (charA.faction === 'green' && charB.faction === 'green') {
    factionRelationKo = '같은 녹색파(Team Green · 아에곤 2세 진영) 소속입니다.';
  } else if (
    (charA.faction === 'black' && charB.faction === 'green') ||
    (charA.faction === 'green' && charB.faction === 'black')
  ) {
    factionRelationKo = '용들의 춤에서 서로 대립한 적대 진영(흑색파 vs 녹색파)입니다.';
  } else if (charA.faction === 'got' && charB.faction === 'got') {
    factionRelationKo = '왕좌의 게임(GoT) 시대의 핵심 인물들입니다.';
  } else if (charA.faction === 'early' && charB.faction === 'early') {
    factionRelationKo = '정복기 및 초기 타르가르옌 왕조 인물들입니다.';
  }

  const shortestPath = findShortestPath(charA.id, charB.id);

  return {
    charA,
    charB,
    directLabels,
    bloodSummaryKo,
    marriageSummaryKo,
    sharedDragons,
    factionRelationKo,
    shortestPath,
  };
}

export function getDragonRiderAtYear(dragon: Dragon, yearAC: number, overrideRiderId?: string | null): Character | null {
  if (overrideRiderId !== undefined) {
    return overrideRiderId ? CHARACTER_MAP[overrideRiderId] ?? null : null;
  }
  if (dragon.birthAC !== undefined && yearAC < dragon.birthAC) return null;
  if (dragon.deathAC !== undefined && yearAC > dragon.deathAC) return null;

  for (const r of dragon.riders) {
    const start = r.fromAC ?? -999;
    const end = r.toAC ?? 999;
    if (yearAC >= start && yearAC <= end) {
      return CHARACTER_MAP[r.characterId] ?? null;
    }
  }
  return null;
}

export function getCharacterDragons(characterId: string): Dragon[] {
  const c = CHARACTER_MAP[characterId];
  if (!c) return [];
  return c.dragonIds.map((id) => DRAGON_MAP[id]).filter(Boolean);
}
