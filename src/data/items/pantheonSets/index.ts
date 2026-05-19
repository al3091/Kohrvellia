export { GREEK_PIECES, GREEK_SET } from './greek';
export { NORSE_PIECES, NORSE_SET } from './norse';
export { EGYPTIAN_PIECES, EGYPTIAN_SET } from './egyptian';
export {
  JAPANESE_PIECES, JAPANESE_SET,
  CELTIC_PIECES, CELTIC_SET,
  MESOPOTAMIAN_PIECES, MESOPOTAMIAN_SET,
  HINDU_PIECES, HINDU_SET,
  CHINESE_PIECES, CHINESE_SET,
  SLAVIC_PIECES, SLAVIC_SET,
  AZTEC_PIECES, AZTEC_SET,
  GOETIA_PIECES, GOETIA_SET,
  FALLEN_PIECES, FALLEN_SET,
} from './remaining';

import type { PantheonSet, SacredItem } from '../../../types/SacredItem';
import { GREEK_PIECES, GREEK_SET } from './greek';
import { NORSE_PIECES, NORSE_SET } from './norse';
import { EGYPTIAN_PIECES, EGYPTIAN_SET } from './egyptian';
import {
  JAPANESE_PIECES, JAPANESE_SET,
  CELTIC_PIECES, CELTIC_SET,
  MESOPOTAMIAN_PIECES, MESOPOTAMIAN_SET,
  HINDU_PIECES, HINDU_SET,
  CHINESE_PIECES, CHINESE_SET,
  SLAVIC_PIECES, SLAVIC_SET,
  AZTEC_PIECES, AZTEC_SET,
  GOETIA_PIECES, GOETIA_SET,
  FALLEN_PIECES, FALLEN_SET,
} from './remaining';

export const ALL_PANTHEON_SETS: PantheonSet[] = [
  GREEK_SET, NORSE_SET, EGYPTIAN_SET, JAPANESE_SET,
  CELTIC_SET, MESOPOTAMIAN_SET, HINDU_SET, CHINESE_SET,
  SLAVIC_SET, AZTEC_SET, GOETIA_SET, FALLEN_SET,
];

export const ALL_PANTHEON_PIECES: SacredItem[] = [
  ...GREEK_PIECES, ...NORSE_PIECES, ...EGYPTIAN_PIECES, ...JAPANESE_PIECES,
  ...CELTIC_PIECES, ...MESOPOTAMIAN_PIECES, ...HINDU_PIECES, ...CHINESE_PIECES,
  ...SLAVIC_PIECES, ...AZTEC_PIECES, ...GOETIA_PIECES, ...FALLEN_PIECES,
];

export function getPantheonSet(pantheonId: string): PantheonSet | undefined {
  return ALL_PANTHEON_SETS.find(s => s.pantheonId === pantheonId);
}

export function getPantheonPieces(pantheonId: string): SacredItem[] {
  return ALL_PANTHEON_PIECES.filter(p => p.pantheonId === pantheonId);
}
