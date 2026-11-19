export type EraId = 'conquest' | 'dance' | 'rebuild' | 'dunk' | 'got';

export type FactionId = 'early' | 'black' | 'green' | 'neutral' | 'got';

export type HouseId =
  | 'targaryen'
  | 'velaryon'
  | 'hightower'
  | 'arryn'
  | 'strong'
  | 'stark'
  | 'baratheon'
  | 'martell'
  | 'other';

export type MarriageType =
  | 'sibling'
  | 'uncle-niece'
  | 'cousin'
  | 'political'
  | 'secret'
  | 'affair';

export interface SpouseLink {
  partnerId: string;
  type: MarriageType;
  noteKo?: string;
  fromAC?: number;
  toAC?: number;
}

export interface Character {
  id: string;
  nameKo: string;
  nameEn: string;
  epithetKo?: string;
  epithetEn?: string;
  era: EraId;
  generation: number;
  colHint: number;
  birthAC?: number;
  deathAC?: number;
  gender: 'M' | 'F';
  house: HouseId;
  faction: FactionId;
  monarchOrder?: number;
  claimant?: 'black' | 'green' | 'got';
  parents: string[];
  biologicalFatherId?: string;
  spouses: SpouseLink[];
  dragonIds: string[];
  summaryKo: string;
  deathNoteKo?: string;
  showCanonNoteKo?: string;
}

export type DragonSizeTier = 'colossal' | 'massive' | 'large' | 'medium' | 'young';

export interface DragonRiderEntry {
  characterId: string;
  fromAC?: number;
  toAC?: number;
  noteKo?: string;
}

export interface Dragon {
  id: string;
  nameKo: string;
  nameEn: string;
  epithetKo: string;
  epithetEn: string;
  era: EraId;
  sizeTier: DragonSizeTier;
  sizeScore: number; // 10 - 100
  colorPrimary: string;
  colorAccent: string;
  scalesKo: string;
  flameKo: string;
  faction: FactionId;
  dragonseed?: boolean;
  birthAC?: number;
  deathAC?: number;
  deathNoteKo?: string;
  riders: DragonRiderEntry[];
  loreKo: string;
}

export interface TimelineSnapshot {
  id: string;
  yearAC: number;
  labelKo: string;
  labelEn: string;
  seriesTag: '정복기' | 'HotD S1' | 'HotD S2' | 'HotD S3' | '연결 시대' | 'GoT';
  monarchId: string;
  rivalClaimantId?: string;
  summaryKo: string;
  keyEventsKo: string[];
  /** Explicit rider overrides for dragons whose rider changes mid-year */
  riderOverrides?: Record<string, string | null>;
}

export interface EraMeta {
  id: EraId;
  labelKo: string;
  labelEn: string;
  yearsLabel: string;
  minGen: number;
  maxGen: number;
  descriptionKo: string;
}

export const ERAS: EraMeta[] = [
  {
    id: 'conquest',
    labelKo: '정복과 건국',
    labelEn: 'The Conquest & Early Kings',
    yearsLabel: '1 – 103 AC',
    minGen: 0,
    maxGen: 3,
    descriptionKo: '아에곤 1세의 웨스테로스 정복부터 노왕 자에하에리스 1세의 황금기까지',
  },
  {
    id: 'dance',
    labelKo: '용들의 춤 (HotD)',
    labelEn: 'Dance of the Dragons',
    yearsLabel: '101 – 131 AC',
    minGen: 3,
    maxGen: 6,
    descriptionKo: '비세리스 1세 사후 흑색파(라에니라)와 녹색파(아에곤 2세)의 참혹한 내전',
  },
  {
    id: 'rebuild',
    labelKo: '왕조의 재건',
    labelEn: 'Post-Dance Dynasty',
    yearsLabel: '131 – 209 AC',
    minGen: 6,
    maxGen: 8,
    descriptionKo: '용들이 사라진 뒤 아에곤 3세·비세리스 2세·다에론 2세가 이어간 왕조',
  },
  {
    id: 'dunk',
    labelKo: '덩크와 에그 시대',
    labelEn: 'Era of Maekar & Egg',
    yearsLabel: '209 – 259 AC',
    minGen: 9,
    maxGen: 10,
    descriptionKo: '마에카르 1세, 장벽의 마에스터 아에몬, 그리고 아에곤 5세(에그)의 시대',
  },
  {
    id: 'got',
    labelKo: '몰락과 왕좌의 게임',
    labelEn: 'Fall & Game of Thrones',
    yearsLabel: '262 – 305 AC',
    minGen: 11,
    maxGen: 13,
    descriptionKo: '미친 왕 아에리스 2세의 몰락과 대너리스·존 스노우의 귀환',
  },
];
