export type RoleType = 'GROUP_OWNERSHIP' | 'DEALER_PRINCIPAL' | 'GENERAL_MANAGER' | 'USED_CAR_MANAGER';

export interface Rooftop {
  rooftopId: string;
  name: string;
  location: string;
  franchise: string;
  clusterId: string;
  clusterName: string;
  pentanaBranchCodes: string[];
  generalManager: string;
  dealerPrincipal: string;
  dailyHoldingCostRate: number;
  pentanaSourceSystem: 'eraPower' | 'EraNet';
  websiteUrl: string;
}

export interface Vehicle {
  vin: string;
  stockNumber: string;
  rooftopId: string;
  rooftopName: string;
  branchCode: string;
  clusterId: string;
  franchise: string;
  rego?: string;
  year: number;
  make: string;
  model: string;
  variant?: string;
  body: string;
  colour: string;
  fuel: string;
  transmission: string;
  odometer: number;
  category: 'New' | 'Used' | 'Demo';
  vehicleCost: number;
  postedRecon: number;
  extras: number;
  totalStockCost: number;
  floorplanExposure: number;
  gstInclusive: boolean;
  advertisedPrice: number | null;
  heroPhoto: string;
  photos: string[];
  isLiveOnWebsite: boolean;
  listingUrl: string;
  listingDescription: string;
  status: 'Available' | 'Reserved' | 'In Recon' | 'Wholesale' | 'Sold' | 'Demo';
  dateInStock: string;
  expectedReadyDate?: string;
  salesperson?: string;
  daysInStock: number;
  agingBucket: '0-30' | '31-45' | '46-60' | '61-90' | '90+';
  frontlineReady: boolean;
  potentialGross: number;
  holdingCostPerDay: number;
  accumulatedHoldingCost: number;
  recommendedAction: 'PRICE' | 'TRANSFER' | 'WHOLESALE' | 'COMPLETE' | 'HOLD' | 'NONE';
  actionReason: string;
  recommendedTransferTarget?: string;
  sisterUnitsInGroup: number;
  pentanaSource: string;
  isPriceReviewRequired: boolean;
}

export interface FeedStatus {
  lastFeedTimestamp: string;
  lastFeedType: string;
  scheduledWindow: string;
  nextScheduledFeed: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  isLive: boolean;
  unitsProcessed: number;
  durationMs: number;
}

export interface ActionItem {
  _id?: string;
  actionType: 'PRICE' | 'TRANSFER' | 'WHOLESALE' | 'COMPLETE' | 'HOLD';
  vin: string;
  stockNumber: string;
  vehicleTitle: string;
  rooftopId: string;
  rooftopName: string;
  targetRooftopName?: string;
  reason: string;
  impactMetric: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'dismissed' | 'executed';
}

export interface GroupOverviewData {
  kpiStrip: {
    totalUnits: number;
    totalStockCost: number;
    floorplanExposure: number;
    frontlineReadyUnits: number;
    frontlinePercent: number;
    potentialGrossTotal: number;
    aged60Units: number;
    aged60Cost: number;
    aged90Units: number;
    aged90Cost: number;
    holdingCostToday: number;
    deltas: {
      stockIn: number;
      retailExits: number;
      wholesaleExits: number;
      transfers: number;
      priceAdjustments: number;
    };
  };
  rooftopStats: Array<{
    rooftopId: string;
    name: string;
    franchise: string;
    clusterId: string;
    clusterName: string;
    totalUnits: number;
    totalCost: number;
    avgDis: number;
    aged60Count: number;
    aged60Percent: number;
    frontlineReadyPercent: number;
    turnRate: number;
    buckets: {
      '0-30': number;
      '31-45': number;
      '46-60': number;
      '61-90': number;
      '90+': number;
    };
  }>;
  categoryMix: {
    New: number;
    Used: number;
    Demo: number;
  };
  brandMix: Record<string, number>;
  groupActionQueue: ActionItem[];
}

export interface DealerPrincipalData {
  clusterId: string;
  clusterName: string;
  dpName: string;
  kpiStrip: {
    totalUnits: number;
    totalCost: number;
    availableUnits: number;
    reservedUnits: number;
    demoUnits: number;
    avgDis: number;
    potentialGross: number;
    aged45Count: number;
  };
  comparisonTable: Array<{
    rooftopId: string;
    rooftopName: string;
    gmName: string;
    totalUnits: number;
    totalCost: number;
    avgDis: number;
    turnRate: number;
    aged45Percent: number;
    reconPending: number;
    potentialGross: number;
    frontlineCount: number;
  }>;
  agingWaterfall: Array<{
    bucket: string;
    count: number;
    cost: number;
  }>;
  watchlist: Array<{
    vin: string;
    stockNumber: string;
    title: string;
    rooftopName: string;
    category: string;
    totalStockCost: number;
    advertisedPrice: number | null;
    potentialGross: number;
    daysInStock: number;
    agingBucket: string;
    accumulatedHoldingCost: number;
    recommendedAction: string;
    actionReason: string;
    heroPhoto: string;
  }>;
  actions: ActionItem[];
}

export interface GeneralManagerData {
  rooftop: Rooftop;
  kpis: {
    onLotCount: number;
    totalCost: number;
    frontlineReady: number;
    inRecon: number;
    avgDis: number;
    holdingCostToday: number;
  };
  pipeline: {
    incoming: number;
    inRecon: number;
    frontlineReady: number;
    reserved: number;
    soldThisWeek: number;
    demo: number;
    wholesale: number;
  };
  movementToday: Array<{
    type: string;
    title: string;
    stockNumber: string;
    time: string;
    details: string;
  }>;
  exceptions: {
    missingPhotosCount: number;
    missingPhotos: Vehicle[];
    missingPriceCount: number;
    missingPrice: Vehicle[];
    aged90Count: number;
    aged90: Vehicle[];
    reconBreachesCount: number;
  };
  inventoryList: Vehicle[];
}

export interface WorkbenchData {
  vehicles: Vehicle[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  counters: {
    totalVehicles: number;
    priceReviewCount: number;
    missingPhotosCount: number;
    wholesaleQueueCount: number;
  };
}

export interface UnitDetails {
  vehicle: Vehicle;
  costBuildUp: {
    vehicleCost: number;
    postedRecon: number;
    extras: number;
    totalStockCost: number;
    gstInclusive: boolean;
    floorplanExposure: number;
  };
  holdingClock: {
    dateInStock: string;
    daysInStock: number;
    dailyRate: number;
    accumulated: number;
  };
  sisterUnits: Vehicle[];
}
