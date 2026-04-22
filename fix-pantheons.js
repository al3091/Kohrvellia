/**
 * Script to fix pantheon deity data structure
 * Run with: node fix-pantheons.js
 */

const fs = require('fs');
const path = require('path');

const pantheonsDir = path.join(__dirname, 'src/data/pantheons');

const filesToFix = [
  'inca.ts',
  'maya.ts',
  'persian.ts',
  'polynesian.ts',
  'shinto.ts',
  'vodou.ts',
  'yoruba.ts'
];

filesToFix.forEach(filename => {
  const filepath = path.join(pantheonsDir, filename);
  let content = fs.readFileSync(filepath, 'utf8');
  let changed = false;

  // Fix domainBlessing with 'name' and 'effect' object (various formats)
  const domainBlessingPattern = /domainBlessing:\s*\{[^}]*name:\s*['"][^'"]*['"][^}]*\}/gs;
  content = content.replace(domainBlessingPattern, (match) => {
    // Extract description
    const descMatch = match.match(/description:\s*['"]([^'"]*)['"]/);
    const desc = descMatch ? descMatch[1] : '+10% bonus effect';

    // Try to extract effect type
    const typeMatch = match.match(/type:\s*['"]([^'"]*)['"]/);
    const effType = typeMatch ? typeMatch[1] : 'general_bonus';

    // Try to extract effect value
    const valMatch = match.match(/value:\s*([\d.]+)/);
    let effVal = valMatch ? parseFloat(valMatch[1]) : 10;
    if (effVal < 1 && effVal > 0) effVal = Math.round(effVal * 100);

    changed = true;
    return `domainBlessing: {
      description: '${desc}',
      effectType: '${effType}',
      effectValue: ${effVal},
    }`;
  });

  // Fix challenges with domain: 'general' - we need to look up the deity's domain
  // First, let's extract deity domains
  const deityPattern = /\{\s*id:\s*'([^']+)'[^}]*domain:\s*'([^']+)'[^}]*challenges:\s*\[([^\]]+)\]/gs;
  content = content.replace(deityPattern, (match, deityId, deityDomain, challengesBlock) => {
    // Replace 'general' with the actual deity domain in challenges
    const fixedChallenges = challengesBlock.replace(/domain:\s*'general'/g, `domain: '${deityDomain}'`);
    changed = true;
    return match.replace(challengesBlock, fixedChallenges);
  });

  // Simpler approach: just replace all domain: 'general' in challenges
  // This requires context-aware replacement, let's use a different approach
  // Find each deity block and fix challenges within it

  // Fix unlockFavor missing - add after description in uniqueAbility
  // Match uniqueAbility that doesn't have unlockFavor
  const abilityPattern = /(uniqueAbility:\s*\{[^}]*description:\s*'[^']*',)(\s*(?!unlockFavor))/g;
  content = content.replace(abilityPattern, (match, prefix, suffix) => {
    if (!match.includes('unlockFavor')) {
      changed = true;
      return prefix + '\n      unlockFavor: 60,' + suffix;
    }
    return match;
  });

  // Remove 'element' and 'environment' from effect objects
  content = content.replace(/,\s*element:\s*'[^']*'/g, '');
  content = content.replace(/,\s*environment:\s*'[^']*'/g, '');

  if (changed) {
    fs.writeFileSync(filepath, content);
    console.log(`Fixed ${filename}`);
  } else {
    console.log(`No changes needed for ${filename}`);
  }
});

console.log('All files processed!');
