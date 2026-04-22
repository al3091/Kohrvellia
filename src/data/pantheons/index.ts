import { Deity } from '../../types/Deity';

// Major Pantheons
export { greekPantheon } from './greek';
export { norsePantheon } from './norse';
export { egyptianPantheon } from './egyptian';
export { japanesePantheon } from './japanese';
export { celticPantheon } from './celtic';
export { mesopotamianPantheon } from './mesopotamian';
export { hinduPantheon } from './hindu';
export { chinesePantheon } from './chinese';
export { slavicPantheon } from './slavic';

// Mesoamerican Pantheons
export { aztecPantheon } from './aztec';
// TODO: Regenerate maya, inca pantheons with correct Deity interface

// Regional Pantheons
// TODO: Regenerate yoruba, polynesian, persian, vodou, shinto pantheons with correct Deity interface

// Demonic/Angelic Pantheons
export { arsGoetiaPantheon } from './arsGoetia';
export { fallenAngelsPantheon } from './fallenAngels';

// Import all pantheons for combined export
import { greekPantheon } from './greek';
import { norsePantheon } from './norse';
import { egyptianPantheon } from './egyptian';
import { japanesePantheon } from './japanese';
import { celticPantheon } from './celtic';
import { mesopotamianPantheon } from './mesopotamian';
import { hinduPantheon } from './hindu';
import { chinesePantheon } from './chinese';
import { slavicPantheon } from './slavic';
import { aztecPantheon } from './aztec';
import { arsGoetiaPantheon } from './arsGoetia';
import { fallenAngelsPantheon } from './fallenAngels';

/**
 * All deities from all pantheons combined
 */
export const allDeities: Deity[] = [
  ...greekPantheon,
  ...norsePantheon,
  ...egyptianPantheon,
  ...japanesePantheon,
  ...celticPantheon,
  ...mesopotamianPantheon,
  ...hinduPantheon,
  ...chinesePantheon,
  ...slavicPantheon,
  ...aztecPantheon,
  ...arsGoetiaPantheon,
  ...fallenAngelsPantheon,
];

/**
 * Map of pantheon IDs to their deity arrays
 */
export const pantheonMap: Record<string, Deity[]> = {
  greek: greekPantheon,
  norse: norsePantheon,
  egyptian: egyptianPantheon,
  japanese: japanesePantheon,
  celtic: celticPantheon,
  mesopotamian: mesopotamianPantheon,
  hindu: hinduPantheon,
  chinese: chinesePantheon,
  slavic: slavicPantheon,
  aztec: aztecPantheon,
  ars_goetia: arsGoetiaPantheon,
  fallen_angels: fallenAngelsPantheon,
};

/**
 * Get all deities for a specific pantheon
 */
export function getDeityByPantheon(pantheonId: string): Deity[] {
  return pantheonMap[pantheonId] || [];
}

/**
 * Get a specific deity by ID
 */
export function getDeityById(deityId: string): Deity | undefined {
  return allDeities.find(deity => deity.id === deityId);
}

/**
 * Get all deities with a specific domain
 */
export function getDeityByDomain(domain: string): Deity[] {
  return allDeities.filter(deity => deity.domain === domain);
}

/**
 * Get all deities with a specific personality
 */
export function getDeityByPersonality(personality: string): Deity[] {
  return allDeities.filter(deity => deity.personality === personality);
}

/**
 * Total number of deities across all pantheons
 */
export const totalDeityCount = allDeities.length;

/**
 * Pantheon metadata for UI display
 * Note: Some pantheons are pending regeneration
 */
export const pantheonInfo = [
  { id: 'greek', name: 'Greek', description: 'Gods of Mount Olympus', deityCount: greekPantheon.length },
  { id: 'norse', name: 'Norse', description: 'Gods of Asgard', deityCount: norsePantheon.length },
  { id: 'egyptian', name: 'Egyptian', description: 'Gods of the Nile', deityCount: egyptianPantheon.length },
  { id: 'japanese', name: 'Japanese', description: 'Kami of Japan', deityCount: japanesePantheon.length },
  { id: 'celtic', name: 'Celtic', description: 'Gods of the Celts', deityCount: celticPantheon.length },
  { id: 'mesopotamian', name: 'Mesopotamian', description: 'Gods of Babylon', deityCount: mesopotamianPantheon.length },
  { id: 'hindu', name: 'Hindu', description: 'Gods of the Vedas', deityCount: hinduPantheon.length },
  { id: 'chinese', name: 'Chinese', description: 'Gods of Heaven', deityCount: chinesePantheon.length },
  { id: 'slavic', name: 'Slavic', description: 'Gods of the Slavs', deityCount: slavicPantheon.length },
  { id: 'aztec', name: 'Aztec', description: 'Gods of Tenochtitlan', deityCount: aztecPantheon.length },
  { id: 'ars_goetia', name: 'Ars Goetia', description: 'Demons of Solomon', deityCount: arsGoetiaPantheon.length },
  { id: 'fallen_angels', name: 'Fallen Angels', description: 'Angels of the Fall', deityCount: fallenAngelsPantheon.length },
];
