export const PREFIX_FLAVOR: Record<string, string[]> = {
  'Weak':    ['Its movements are labored. Desperation is its own cruelty.'],
  'Young':   ['Raw and untested. The young have nothing to lose.'],
  'Fierce':  ['It scents blood before you enter the room.', 'The air thickens around it.'],
  'Armored': ['Your blade will have to find the joints.', 'A fortress of bone and plate.'],
  'Elite':   ['This one has survived a hundred like you.', 'Battle-hardened and patient.'],
  'Ancient': ['It remembers an age before the Tower was built.', 'Time has made it deliberate.'],
  'Mythic':  ['The air warps around it.', 'You feel the weight of a legend before you.'],
};

export const SUFFIX_FLAVOR: Record<string, string[]> = {
  'of Flame':    ['Heat rolls off it in waves.', 'The corridor smells of scorched stone.'],
  'of Frost':    ['Your breath mists in its presence.', 'Cold radiates from it like a second skin.'],
  'of Venom':    ['The floor around it is stained dark.', 'Something acidic hangs in the air.'],
  'the Swift':   ['It clocks your movements before you make them.', 'You blink — it has already shifted.'],
  'the Undying': ['It has died before. It is patient about doing it again.'],
};

export function getMonsterFlavorText(
  prefixName?: string,
  suffixName?: string
): string | null {
  const lines: string[] = [];
  if (prefixName && PREFIX_FLAVOR[prefixName]) {
    const pool = PREFIX_FLAVOR[prefixName];
    lines.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  if (suffixName && SUFFIX_FLAVOR[suffixName]) {
    const pool = SUFFIX_FLAVOR[suffixName];
    lines.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  return lines.length > 0 ? lines.join(' ') : null;
}
