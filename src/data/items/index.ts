/**
 * Sacred Items — master index
 *
 * Three tiers:
 *   Pantheon: 12 sets × 7 pieces = 84 items
 *   Domain:   14 artifacts (one per domain)
 *   Deity:    ~168 deities × 2 relics each = ~336 items
 */

export { ALL_PANTHEON_SETS, ALL_PANTHEON_PIECES, getPantheonSet, getPantheonPieces } from './pantheonSets/index';
export { DOMAIN_ARTIFACTS, getDomainArtifact } from './domainArtifacts';
export { ALL_DEITY_RELICS, getDeityRelics, getDeityRelic_weapon, getDeityRelic_accessory, DEITY_RELICS_DESIGNED, DEITY_RELICS_TOTAL_ITEMS } from './deityRelics';
export type { DeityRelicPair } from './deityRelics';
