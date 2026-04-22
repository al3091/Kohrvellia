/**
 * ASCII Monster Art for Kohrvellia
 * Roguelike-style monster portraits for the combat screen
 */

export const MONSTER_ASCII: Record<string, string[]> = {
  // ===== EARLY GAME MONSTERS =====

  goblin: [
    '      ,,,      ',
    '     (o o)     ',
    '    /( ^ )\\    ',
    '   _/|~~~|\\__  ',
    '  / \\|___|/ \\ ',
    '     /| |\\    ',
    '    (_| |_)   ',
  ],

  skeleton: [
    '     .-.     ',
    '    (o.o)    ',
    '     |=|     ',
    '    /|X|\\   ',
    '   / |X| \\  ',
    '     /|\\    ',
    '    (_|_)    ',
  ],

  wolf: [
    '    /\\_/\\    ',
    '   ( o.o )   ',
    '    > ^ <    ',
    '   /|   |\\   ',
    '  ( |   | )  ',
    '   \\|___|/   ',
    '    // \\\\   ',
  ],

  slime: [
    '             ',
    '    _____    ',
    '   /~~~~~\\   ',
    '  | o   o |  ',
    '  |   ~   |  ',
    '   \\_____/   ',
    '    ~~~~~    ',
  ],

  bat: [
    '  \\       /  ',
    '   \\\\   //   ',
    '  __\\\\_//__ ',
    ' /  (o o)  \\',
    '/____\\ /____\\',
    '      V      ',
    '             ',
  ],

  orc: [
    '    ___      ',
    '   /   \\     ',
    '  | O O |    ',
    '  |  ^  |    ',
    '  | \\_/ |    ',
    '   \\___/     ',
    '  /|   |\\    ',
  ],

  spider: [
    ' \\  .--.  /  ',
    '  \\/o  o\\/   ',
    ' - (    ) -  ',
    '  / \\--/ \\   ',
    ' /  |  |  \\  ',
    '/   |  |   \\ ',
    '    ~~~~     ',
  ],

  rat_swarm: [
    '  c~  c~  c~ ',
    '   \\(  \\(  \\(',
    '  c~ c~ c~   ',
    '   \\( \\( \\(  ',
    ' c~  c~  c~  ',
    '  \\(  \\(  \\( ',
    '             ',
  ],

  kobold: [
    '      ^      ',
    '    /(o)\\    ',
    '   /  _  \\   ',
    '   | |=| |   ',
    '    \\| |/    ',
    '     | |     ',
    '    /   \\    ',
  ],

  zombie: [
    '    .---.    ',
    '   /x   x\\   ',
    '  |   O   |  ',
    '  |  ~~~  |  ',
    '   \\_____/   ',
    '   /|   |\\   ',
    '  / |   | \\  ',
  ],

  // ===== MID GAME MONSTERS =====

  ghost: [
    '    .--.     ',
    '   ( oo )    ',
    '   |    |    ',
    '   |    |    ',
    '    \\  /     ',
    '     \\/      ',
    '   ~~~~~     ',
  ],

  troll: [
    '   _____     ',
    '  /     \\    ',
    ' | () () |   ',
    ' |   <   |   ',
    ' |  ===  |   ',
    '  \\_____/    ',
    ' /|     |\\   ',
  ],

  fire_elemental: [
    '     )  (    ',
    '    ( )) )   ',
    '   ( (  ( )  ',
    '    ) ))(    ',
    '   (  ( ) )  ',
    '    ( )) (   ',
    '     )  (    ',
  ],

  mimic: [
    '  ________   ',
    ' [========]  ',
    ' |  ____  |  ',
    ' | /O  O\\ |  ',
    ' ||TEETH ||  ',
    ' |\\______/|  ',
    ' [========]  ',
  ],

  harpy: [
    '    \\  /     ',
    '  __\\()/__   ',
    ' /  (oo)  \\  ',
    '/   /  \\   \\ ',
    '\\   \\__/   / ',
    ' \\________/  ',
    '     ||      ',
  ],

  dark_knight: [
    '    _/\\_     ',
    '   |o  o|    ',
    '   |_><_|    ',
    '   /|--|\\    ',
    '  / |[]| \\   ',
    '    |  |     ',
    '   _|  |_    ',
  ],

  // ===== LATE GAME MONSTERS =====

  ogre: [
    '   ______    ',
    '  /      \\   ',
    ' |  O  O  |  ',
    ' |    <   |  ',
    ' |  \\__/  |  ',
    '  \\______/   ',
    ' //|    |\\\\  ',
  ],

  wraith: [
    '    .---.    ',
    '   ( X X )   ',
    '    \\   /    ',
    '   __|~|__   ',
    '  /       \\  ',
    ' /  ~~~~~  \\ ',
    '     ~~~     ',
  ],

  basilisk: [
    '       /\\    ',
    '   ___/  \\   ',
    '  /0    0 \\  ',
    ' <   VV    > ',
    '  \\  __   /  ',
    '   \\/  \\_/   ',
    '   ~~~~~~~~  ',
  ],

  demon_soldier: [
    '   /\\  /\\    ',
    '  (  \\/  )   ',
    '   |(OO)|    ',
    '   | \\/ |    ',
    '  /|    |\\   ',
    ' / |[==]| \\  ',
    '   /|  |\\    ',
  ],

  frost_giant: [
    '   _______   ',
    '  /  ***  \\  ',
    ' |  O   O  | ',
    ' |    =    | ',
    ' |  \\___/  | ',
    '  \\_______/  ',
    '  //|   |\\\\  ',
  ],

  shadow_dragon: [
    '      /\\_    ',
    '  ___/ o \\___',
    ' <__   V   __>',
    '    \\  =  /  ',
    '   /`-...-`\\ ',
    '  /  /| |\\  \\',
    ' `--` | | `--`',
  ],

  arch_demon: [
    '  /\\     /\\  ',
    ' (  \\___/  ) ',
    '  \\ O   O /  ',
    '   |  V  |   ',
    '   | === |   ',
    '  /|     |\\  ',
    ' / |[=+=]| \\ ',
  ],

  elder_dragon: [
    '    /\\_/\\    ',
    ' __/     \\__ ',
    '<   O   O   >',
    ' \\    V    / ',
    '  \\  ===  /  ',
    '   \\     /   ',
    '  /`-----`\\  ',
  ],
};

/**
 * Get ASCII art for a monster by its base type ID
 * Falls back to a generic monster if not found
 */
export function getMonsterArt(monsterId: string): string[] {
  // Try exact match first
  if (MONSTER_ASCII[monsterId]) {
    return MONSTER_ASCII[monsterId];
  }

  // Try lowercase
  const lowerId = monsterId.toLowerCase();
  if (MONSTER_ASCII[lowerId]) {
    return MONSTER_ASCII[lowerId];
  }

  // Fallback generic monster
  return [
    '    .---.    ',
    '   ( o o )   ',
    '    \\   /    ',
    '     | |     ',
    '    /| |\\    ',
    '   / | | \\   ',
    '      ~      ',
  ];
}
