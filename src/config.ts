/// <reference types="vite/client" />

export interface AppConfig {
  appName: string;
  moduleName: string;
  clientName: string;
  providerName: string;
  apiBaseUrl: string;
  defaultCurrency: string;
  feedSchedule: {
    morningWindow: string;
    afternoonWindow: string;
  };
}

export const config: AppConfig = {
  appName: 'GOOD SHOWROOM',
  moduleName: 'Live Inventory Tracker',
  clientName: 'Booran Motor Group',
  providerName: 'OmniSuiteAI Pty Ltd',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api/inventory',
  defaultCurrency: 'AUD',
  feedSchedule: {
    morningWindow: '06:00 - 06:45 AEST',
    afternoonWindow: '14:00 - 14:45 AEST',
  },
};

export default config;
