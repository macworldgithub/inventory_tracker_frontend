import {
  FeedStatus,
  Rooftop,
  GroupOverviewData,
  DealerPrincipalData,
  GeneralManagerData,
  WorkbenchData,
  UnitDetails,
} from './types';
import { config } from './config';

const API_BASE = config.apiBaseUrl;

export const api = {
  async getStatus(): Promise<FeedStatus> {
    const res = await fetch(`${API_BASE}/status`);
    if (!res.ok) throw new Error('Failed to fetch feed status');
    return res.json();
  },

  async triggerFeed(): Promise<any> {
    const res = await fetch(`${API_BASE}/trigger-feed`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to trigger feed');
    return res.json();
  },

  async getRooftops(): Promise<Rooftop[]> {
    const res = await fetch(`${API_BASE}/rooftops`);
    if (!res.ok) throw new Error('Failed to fetch rooftops');
    return res.json();
  },

  async getGroupOverview(): Promise<GroupOverviewData> {
    const res = await fetch(`${API_BASE}/group`);
    if (!res.ok) throw new Error('Failed to fetch group overview');
    return res.json();
  },

  async getDealerPrincipalCluster(clusterId: string): Promise<DealerPrincipalData> {
    const res = await fetch(`${API_BASE}/dp/${clusterId}`);
    if (!res.ok) throw new Error('Failed to fetch DP cluster data');
    return res.json();
  },

  async getGeneralManagerRooftop(rooftopId: string): Promise<GeneralManagerData> {
    const res = await fetch(`${API_BASE}/gm/${rooftopId}`);
    if (!res.ok) throw new Error('Failed to fetch GM rooftop data');
    return res.json();
  },

  async getWorkbench(params: {
    rooftopId?: string;
    agingBucket?: string;
    category?: string;
    make?: string;
    search?: string;
    action?: string;
    priceReviewOnly?: boolean;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<WorkbenchData> {
    const query = new URLSearchParams();
    if (params.rooftopId) query.set('rooftopId', params.rooftopId);
    if (params.agingBucket) query.set('agingBucket', params.agingBucket);
    if (params.category) query.set('category', params.category);
    if (params.make) query.set('make', params.make);
    if (params.search) query.set('search', params.search);
    if (params.action) query.set('action', params.action);
    if (params.priceReviewOnly) query.set('priceReviewOnly', 'true');
    if (params.sortField) query.set('sortField', params.sortField);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());

    const res = await fetch(`${API_BASE}/workbench?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch workbench inventory');
    return res.json();
  },

  async getUnitDetails(vin: string): Promise<UnitDetails> {
    const res = await fetch(`${API_BASE}/unit/${vin}`);
    if (!res.ok) throw new Error('Failed to fetch unit details');
    return res.json();
  },
};
