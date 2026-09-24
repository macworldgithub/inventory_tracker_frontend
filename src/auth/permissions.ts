import { RoleType } from '../types';

export enum Permission {
  // Altitude Permissions
  VIEW_GROUP_COMMAND = 'VIEW_GROUP_COMMAND',
  VIEW_DEALER_CLUSTER = 'VIEW_DEALER_CLUSTER',
  VIEW_GENERAL_MANAGER_LOT = 'VIEW_GENERAL_MANAGER_LOT',
  VIEW_USED_CAR_WORKBENCH = 'VIEW_USED_CAR_WORKBENCH',

  // Data & Financial Permissions
  VIEW_COMMERCIAL_COST = 'VIEW_COMMERCIAL_COST',
  VIEW_FLOORPLAN_EXPOSURE = 'VIEW_FLOORPLAN_EXPOSURE',
  VIEW_HOLDING_COST = 'VIEW_HOLDING_COST',
  VIEW_ALL_ROOFTOPS = 'VIEW_ALL_ROOFTOPS',

  // Operational Actions
  EXPORT_INVENTORY_DATA = 'EXPORT_INVENTORY_DATA',
  TRIGGER_FEED_SYNC = 'TRIGGER_FEED_SYNC',
  INITIATE_TRANSFER = 'INITIATE_TRANSFER',
  REQUEST_PRICE_REVIEW = 'REQUEST_PRICE_REVIEW',
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  roleTitle: string;
  department: string;
  avatar: string;
  permissions: Permission[];
  allowedRoles: RoleType[];
  clusterId?: string; // e.g. 'cluster-hyundai-metro'
  allowedClusterIds: string[];
  rooftopId?: string; // e.g. 'booran-hyundai-berwick' for single-lot GM
  allowedRooftops: string[]; // List of rooftopIds or ['*'] for all
  scopeLabel: string;
  description: string;
  isExecutive: boolean;
}

export const ROLE_PERMISSIONS: Record<RoleType, Permission[]> = {
  GROUP_OWNERSHIP: [
    Permission.VIEW_GROUP_COMMAND,
    Permission.VIEW_DEALER_CLUSTER,
    Permission.VIEW_GENERAL_MANAGER_LOT,
    Permission.VIEW_USED_CAR_WORKBENCH,
    Permission.VIEW_COMMERCIAL_COST,
    Permission.VIEW_FLOORPLAN_EXPOSURE,
    Permission.VIEW_HOLDING_COST,
    Permission.VIEW_ALL_ROOFTOPS,
    Permission.EXPORT_INVENTORY_DATA,
    Permission.TRIGGER_FEED_SYNC,
    Permission.INITIATE_TRANSFER,
    Permission.REQUEST_PRICE_REVIEW,
  ],
  DEALER_PRINCIPAL: [
    Permission.VIEW_DEALER_CLUSTER,
    Permission.VIEW_GENERAL_MANAGER_LOT,
    Permission.VIEW_USED_CAR_WORKBENCH,
    Permission.VIEW_COMMERCIAL_COST,
    Permission.VIEW_FLOORPLAN_EXPOSURE,
    Permission.VIEW_HOLDING_COST,
    Permission.EXPORT_INVENTORY_DATA,
    Permission.TRIGGER_FEED_SYNC,
    Permission.INITIATE_TRANSFER,
    Permission.REQUEST_PRICE_REVIEW,
  ],
  GENERAL_MANAGER: [
    Permission.VIEW_GENERAL_MANAGER_LOT,
    Permission.VIEW_USED_CAR_WORKBENCH,
    Permission.VIEW_COMMERCIAL_COST,
    Permission.VIEW_HOLDING_COST,
    Permission.EXPORT_INVENTORY_DATA,
    Permission.REQUEST_PRICE_REVIEW,
  ],
  USED_CAR_MANAGER: [
    Permission.VIEW_USED_CAR_WORKBENCH,
    Permission.VIEW_COMMERCIAL_COST,
    Permission.VIEW_HOLDING_COST,
    Permission.EXPORT_INVENTORY_DATA,
    Permission.REQUEST_PRICE_REVIEW,
  ],
};

export const CORPORATE_USERS: UserSession[] = [
  {
    id: 'usr-david-booran',
    name: 'David Booran',
    email: 'david.booran@booran.com.au',
    role: 'GROUP_OWNERSHIP',
    roleTitle: 'Managing Director & Group Owner',
    department: 'Executive Leadership Team',
    avatar: 'DB',
    isExecutive: true,
    permissions: ROLE_PERMISSIONS.GROUP_OWNERSHIP,
    allowedRoles: ['GROUP_OWNERSHIP', 'DEALER_PRINCIPAL', 'GENERAL_MANAGER', 'USED_CAR_MANAGER'],
    allowedRooftops: ['*'],
    allowedClusterIds: ['*'],
    scopeLabel: 'All Booran Rooftops (Enterprise Scope)',
    description: 'Unconstrained governance across all group capital, cost ledgers, and multi-franchise operations.',
  },
  {
    id: 'usr-david-booran-dp',
    name: 'David Booran (DP Mode)',
    email: 'dp.hyundai@booran.com.au',
    role: 'DEALER_PRINCIPAL',
    roleTitle: 'Dealer Principal — Metro Hyundai Cluster',
    department: 'Hyundai Metro Leadership',
    avatar: 'DH',
    isExecutive: false,
    permissions: ROLE_PERMISSIONS.DEALER_PRINCIPAL,
    allowedRoles: ['DEALER_PRINCIPAL', 'GENERAL_MANAGER', 'USED_CAR_MANAGER'],
    clusterId: 'cluster-hyundai-metro',
    allowedClusterIds: ['cluster-hyundai-metro'],
    allowedRooftops: [
      'booran-hyundai-berwick',
      'booran-hyundai-cranbourne',
      'booran-hyundai-south-morang',
    ],
    scopeLabel: 'Metro Hyundai Cluster (Berwick, Cranbourne, South Morang)',
    description: 'Accountable for Hyundai Metro dealerships, cluster aging waterfall and capital risk watchlist.',
  },
  {
    id: 'usr-paul-booran-dp',
    name: 'Paul Booran',
    email: 'paul.booran@booran.com.au',
    role: 'DEALER_PRINCIPAL',
    roleTitle: 'Dealer Principal — Bayside Kia Cluster',
    department: 'Bayside Kia Leadership',
    avatar: 'PB',
    isExecutive: false,
    permissions: ROLE_PERMISSIONS.DEALER_PRINCIPAL,
    allowedRoles: ['DEALER_PRINCIPAL', 'GENERAL_MANAGER', 'USED_CAR_MANAGER'],
    clusterId: 'cluster-bayside-kia',
    allowedClusterIds: ['cluster-bayside-kia'],
    allowedRooftops: ['booran-kia-cheltenham'],
    scopeLabel: 'Bayside Kia Cluster (Cheltenham)',
    description: 'Accountable for Bayside Kia franchise inventory coaching and risk reduction.',
  },
  {
    id: 'usr-liam-oconnor-gm',
    name: 'Liam O\'Connor',
    email: 'liam.oconnor@booran.com.au',
    role: 'GENERAL_MANAGER',
    roleTitle: 'General Manager — Berwick Hyundai',
    department: 'Berwick Dealership Operations',
    avatar: 'LO',
    isExecutive: false,
    permissions: ROLE_PERMISSIONS.GENERAL_MANAGER,
    allowedRoles: ['GENERAL_MANAGER', 'USED_CAR_MANAGER'],
    rooftopId: 'booran-hyundai-berwick',
    allowedRooftops: ['booran-hyundai-berwick'],
    allowedClusterIds: ['cluster-hyundai-metro'],
    scopeLabel: 'Single Dealership: Booran Hyundai Berwick',
    description: 'Single-lot pipeline operations, intake/recon exceptions, and lot trade movements.',
  },
  {
    id: 'usr-sarah-jenkins-gm',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@booran.com.au',
    role: 'GENERAL_MANAGER',
    roleTitle: 'General Manager — Cranbourne Hyundai',
    department: 'Cranbourne Dealership Operations',
    avatar: 'SJ',
    isExecutive: false,
    permissions: ROLE_PERMISSIONS.GENERAL_MANAGER,
    allowedRoles: ['GENERAL_MANAGER', 'USED_CAR_MANAGER'],
    rooftopId: 'booran-hyundai-cranbourne',
    allowedRooftops: ['booran-hyundai-cranbourne'],
    allowedClusterIds: ['cluster-hyundai-metro'],
    scopeLabel: 'Single Dealership: Booran Hyundai Cranbourne',
    description: 'Single-lot pipeline operations, intake/recon exceptions, and lot trade movements.',
  },
  {
    id: 'usr-metro-used-car-mgr',
    name: 'Metro Used Car Manager',
    email: 'usedcars.metro@booran.com.au',
    role: 'USED_CAR_MANAGER',
    roleTitle: 'Used Car Operations Manager',
    department: 'Pre-Owned Inventory & Repricing',
    avatar: 'UC',
    isExecutive: false,
    permissions: ROLE_PERMISSIONS.USED_CAR_MANAGER,
    allowedRoles: ['USED_CAR_MANAGER'],
    allowedRooftops: [
      'booran-hyundai-berwick',
      'booran-hyundai-cranbourne',
      'booran-hyundai-south-morang',
    ],
    allowedClusterIds: ['cluster-hyundai-metro'],
    scopeLabel: 'Pre-Owned Lots (Berwick, Cranbourne, South Morang)',
    description: 'Commercial workbench pricing actions, holding cost clock, and wholesale liquidation.',
  },
];
