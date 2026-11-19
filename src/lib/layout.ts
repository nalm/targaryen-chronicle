import { Character, MarriageType } from '@/data/types';

export const NODE_WIDTH = 198;
export const NODE_HEIGHT = 100;
export const COL_SPACING = 232;
export const ROW_SPACING = 180;
export const CANVAS_PADDING_X = 480;
export const CANVAS_PADDING_Y = 90;

export interface PositionedNode {
  character: Character;
  x: number; // center x
  y: number; // center y
}

export interface FamilyEdge {
  id: string;
  fromId: string;
  toId: string;
  kind: 'parent' | 'bio-father' | 'spouse';
  marriageType?: MarriageType;
  noteKo?: string;
}

export interface GraphLayout {
  nodes: PositionedNode[];
  nodeMap: Record<string, PositionedNode>;
  edges: FamilyEdge[];
  width: number;
  height: number;
  genY: Record<number, number>;
}

export function buildFamilyLayout(characters: Character[]): GraphLayout {
  const minCol = Math.min(...characters.map((c) => c.colHint));
  const maxCol = Math.max(...characters.map((c) => c.colHint));
  const maxGen = Math.max(...characters.map((c) => c.generation));

  const offsetX = CANVAS_PADDING_X - minCol * COL_SPACING;

  const nodes: PositionedNode[] = characters.map((character) => ({
    character,
    x: Math.round(character.colHint * COL_SPACING + offsetX),
    y: Math.round(character.generation * ROW_SPACING + CANVAS_PADDING_Y),
  }));

  const nodeMap: Record<string, PositionedNode> = Object.fromEntries(
    nodes.map((n) => [n.character.id, n])
  );

  const genY: Record<number, number> = {};
  for (let g = 0; g <= maxGen; g++) {
    genY[g] = Math.round(g * ROW_SPACING + CANVAS_PADDING_Y);
  }

  const edges: FamilyEdge[] = [];
  const seenSpousePairs = new Set<string>();

  for (const c of characters) {
    // Legal parents
    for (const parentId of c.parents) {
      if (nodeMap[parentId]) {
        edges.push({
          id: `parent:${parentId}->${c.id}`,
          fromId: parentId,
          toId: c.id,
          kind: 'parent',
        });
      }
    }

    // Biological father (e.g., Harwin Strong)
    if (c.biologicalFatherId && nodeMap[c.biologicalFatherId]) {
      edges.push({
        id: `bio:${c.biologicalFatherId}->${c.id}`,
        fromId: c.biologicalFatherId,
        toId: c.id,
        kind: 'bio-father',
        noteKo: '생물학적 친부',
      });
    }

    // Spouses (deduplicated undirected pair)
    for (const sp of c.spouses) {
      if (!nodeMap[sp.partnerId]) continue;
      const key = [c.id, sp.partnerId].sort().join('--');
      if (seenSpousePairs.has(key)) continue;
      seenSpousePairs.add(key);
      edges.push({
        id: `spouse:${key}`,
        fromId: c.id,
        toId: sp.partnerId,
        kind: 'spouse',
        marriageType: sp.type,
        noteKo: sp.noteKo,
      });
    }
  }

  const width = Math.round((maxCol - minCol) * COL_SPACING + CANVAS_PADDING_X * 2 + NODE_WIDTH);
  const height = Math.round((maxGen + 1) * ROW_SPACING + CANVAS_PADDING_Y * 2);

  return { nodes, nodeMap, edges, width, height, genY };
}

export function getEdgePath(edge: FamilyEdge, nodeMap: Record<string, PositionedNode>): string {
  const from = nodeMap[edge.fromId];
  const to = nodeMap[edge.toId];
  if (!from || !to) return '';

  if (edge.kind === 'spouse') {
    const sameRow = Math.abs(from.y - to.y) < 20;
    if (sameRow) {
      const left = from.x < to.x ? from : to;
      const right = from.x < to.x ? to : from;
      const startX = left.x + NODE_WIDTH / 2;
      const endX = right.x - NODE_WIDTH / 2;
      const dx = endX - startX;
      // If adjacent, draw a crisp horizontal/gentle arc; if spanning over nodes, arch slightly above
      if (dx < COL_SPACING * 0.7) {
        return `M ${startX} ${left.y} L ${endX} ${right.y}`;
      }
      const archY = left.y - Math.min(68, 28 + dx * 0.08);
      const midX = (startX + endX) / 2;
      return `M ${left.x} ${left.y - NODE_HEIGHT / 2} Q ${midX} ${archY - NODE_HEIGHT / 2} ${right.x} ${right.y - NODE_HEIGHT / 2}`;
    } else {
      // Cross-generation marriage (e.g., Daemon <-> Rhaenyra, Daenerys <-> Jon Snow)
      const upper = from.y < to.y ? from : to;
      const lower = from.y < to.y ? to : from;
      const sx = upper.x + (lower.x >= upper.x ? NODE_WIDTH * 0.25 : -NODE_WIDTH * 0.25);
      const sy = upper.y + NODE_HEIGHT / 2;
      const ex = lower.x + (lower.x >= upper.x ? -NODE_WIDTH * 0.25 : NODE_WIDTH * 0.25);
      const ey = lower.y - NODE_HEIGHT / 2;
      const cy = (sy + ey) / 2;
      return `M ${sx} ${sy} C ${sx} ${cy}, ${ex} ${cy}, ${ex} ${ey}`;
    }
  }

  // Parent -> Child or Bio-father -> Child
  const sx = from.x;
  const sy = from.y + NODE_HEIGHT / 2;
  const ex = to.x;
  const ey = to.y - NODE_HEIGHT / 2;
  const midY = sy + (ey - sy) * 0.52;
  return `M ${sx} ${sy} C ${sx} ${midY}, ${ex} ${midY}, ${ex} ${ey}`;
}
