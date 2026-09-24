import { RoleType } from './types';

export interface UserPersona {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  roleTitle: string;
  department: string;
  avatar: string;
  allowedRoles: RoleType[];
  clusterId?: string; // e.g. 'cluster-hyundai-metro' or undefined for all
  allowedClusterIds?: string[];
  rooftopId?: string; // e.g. 'booran-hyundai-berwick' for single-lot GM
  allowedRooftops: string[]; // List of rooftopIds or ['*'] for all
  description: string;
  scopeBadge: string;
}

export const USER_PERSONAS: UserPersona[] = [
  {
    id: 'executive-david-booran',
    name: 'David Booran',
    email: 'david.booran@booran.com.au',
    role: 'GROUP_OWNERSHIP',
    roleTitle: 'Group Managing Director & Owner',
    department: 'Group Executive Command',
    avatar: 'DB',
    allowedRoles: ['GROUP_OWNERSHIP', 'DEALER_PRINCIPAL', 'GENERAL_MANAGER', 'USED_CAR_MANAGER'],
    allowedRooftops: ['*'],
    allowedClusterIds: ['*'],
    description: 'Full unconstrained group executive access across all 4 rooftops, financial ledger, and strategic actions.',
    scopeBadge: 'All 4 Booran Lots · Full Group Scope',
  },
  {
    id: 'dp-hyundai-metro',
    name: 'David Booran (DP Mode)',
    email: 'dp.hyundai@booran.com.au',
    role: 'DEALER_PRINCIPAL',
    roleTitle: 'Dealer Principal — Metro Hyundai',
    department: 'Hyundai Metro Cluster',
    avatar: 'DH',
    allowedRoles: ['DEALER_PRINCIPAL', 'GENERAL_MANAGER', 'USED_CAR_MANAGER'],
    clusterId: 'cluster-hyundai-metro',
    allowedClusterIds: ['cluster-hyundai-metro'],
    allowedRooftops: [
      'booran-hyundai-berwick',
      'booran-hyundai-cranbourne',
      'booran-hyundai-south-morang',
    ],
    description: 'Scoped to Metro Hyundai cluster dealerships (Berwick, Cranbourne, South Morang).',
    scopeBadge: 'Hyundai Metro Cluster (3 Lots)',
  },
  {
    id: 'dp-kia-bayside',
    name: 'Paul Booran',
    email: 'paul.booran@booran.com.au',
    role: 'DEALER_PRINCIPAL',
    roleTitle: 'Dealer Principal — Bayside Kia',
    department: 'Bayside Kia Cluster',
    avatar: 'PB',
    allowedRoles: ['DEALER_PRINCIPAL', 'GENERAL_MANAGER', 'USED_CAR_MANAGER'],
    clusterId: 'cluster-bayside-kia',
    allowedClusterIds: ['cluster-bayside-kia'],
    allowedRooftops: ['booran-kia-cheltenham'],
    description: 'Scoped to Bayside Kia cluster dealerships (Cheltenham Kia).',
    scopeBadge: 'Bayside Kia Cluster (Cheltenham)',
  },
  {
    id: 'gm-berwick',
    name: 'Liam O\'Connor',
    email: 'liam.oconnor@booran.com.au',
    role: 'GENERAL_MANAGER',
    roleTitle: 'General Manager — Berwick Hyundai',
    department: 'Berwick Dealership Operations',
    avatar: 'LO',
    allowedRoles: ['GENERAL_MANAGER', 'USED_CAR_MANAGER'],
    rooftopId: 'booran-hyundai-berwick',
    allowedRooftops: ['booran-hyundai-berwick'],
    description: 'Single-lot operational governance for Booran Hyundai Berwick pipeline, trades & recon.',
    scopeBadge: 'Single Lot: Berwick Hyundai',
  },
  {
    id: 'gm-cranbourne',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@booran.com.au',
    role: 'GENERAL_MANAGER',
    roleTitle: 'General Manager — Cranbourne Hyundai',
    department: 'Cranbourne Dealership Operations',
    avatar: 'SJ',
    allowedRoles: ['GENERAL_MANAGER', 'USED_CAR_MANAGER'],
    rooftopId: 'booran-hyundai-cranbourne',
    allowedRooftops: ['booran-hyundai-cranbourne'],
    description: 'Single-lot operational governance for Booran Hyundai Cranbourne.',
    scopeBadge: 'Single Lot: Cranbourne Hyundai',
  },
  {
    id: 'ucm-group-metro',
    name: 'Metro Used Car Manager',
    email: 'usedcars.metro@booran.com.au',
    role: 'USED_CAR_MANAGER',
    roleTitle: 'Used Car Manager — Metro Pre-Owned',
    department: 'Pre-Owned Inventory & Repricing',
    avatar: 'UC',
    allowedRoles: ['USED_CAR_MANAGER'],
    allowedRooftops: [
      'booran-hyundai-berwick',
      'booran-hyundai-cranbourne',
      'booran-hyundai-south-morang',
    ],
    description: 'Multi-lot used inventory workbench, aging clocks, margin reviews and wholesale disposal.',
    scopeBadge: 'Assigned Lots: Metro Pre-Owned',
  },
];

/**
 * Filter rooftops based on active persona's allowed scope
 */
export function filterRooftopsForPersona<T extends { rooftopId: string }>(
  rooftops: T[],
  persona: UserPersona
): T[] {
  if (!persona || persona.allowedRooftops.includes('*')) {
    return rooftops;
  }
  return rooftops.filter((r) => persona.allowedRooftops.includes(r.rooftopId));
}

/**
 * Filter clusters based on active persona's allowed scope
 */
export function filterClustersForPersona<T extends { id: string }>(
  clusters: T[],
  persona: UserPersona
): T[] {
  if (!persona || !persona.allowedClusterIds || persona.allowedClusterIds.includes('*')) {
    return clusters;
  }
  return clusters.filter((c) => persona.allowedClusterIds?.includes(c.id));
}

/**
 * Check if the active persona has permission to access a role altitude
 */
export function isRoleAllowed(role: RoleType, persona: UserPersona): boolean {
  if (!persona) return true;
  return persona.allowedRoles.includes(role);
}
