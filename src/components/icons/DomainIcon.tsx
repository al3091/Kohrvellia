/**
 * Domain Icon Master Component
 * Maps domain string to the appropriate SVG icon component
 */

import React from 'react';
import { Colors } from '../../constants/Colors';
import {
  WarIcon,
  MagicIcon,
  TrickeryIcon,
  DeathIcon,
  FortuneIcon,
  NatureIcon,
  WisdomIcon,
  CraftIcon,
  AuthorityIcon,
  LifeIcon,
  SeaIcon,
  SkyIcon,
  FireIcon,
  KnowledgeIcon,
} from './domains';

type DomainType = keyof typeof Colors.domain;

interface DomainIconProps {
  domain: DomainType;
  size?: number;
  color?: string;
}

const DOMAIN_ICON_MAP: Record<DomainType, React.ComponentType<{ size?: number; color?: string }>> = {
  war: WarIcon,
  magic: MagicIcon,
  trickery: TrickeryIcon,
  death: DeathIcon,
  fortune: FortuneIcon,
  nature: NatureIcon,
  wisdom: WisdomIcon,
  craft: CraftIcon,
  authority: AuthorityIcon,
  life: LifeIcon,
  sea: SeaIcon,
  sky: SkyIcon,
  fire: FireIcon,
  knowledge: KnowledgeIcon,
};

export function DomainIcon({ domain, size = 32, color }: DomainIconProps) {
  const IconComponent = DOMAIN_ICON_MAP[domain];

  if (!IconComponent) {
    console.warn(`DomainIcon: Unknown domain "${domain}"`);
    return null;
  }

  return <IconComponent size={size} color={color ?? Colors.domain[domain]} />;
}

export default DomainIcon;
