import React, { useState, useEffect } from 'react';
import { RoleType, FeedStatus } from './types';
import { api } from './api';
import { Header } from './components/Header';
import { GroupOwnershipView } from './views/GroupOwnershipView';
import { DealerPrincipalView } from './views/DealerPrincipalView';
import { GeneralManagerView } from './views/GeneralManagerView';
import { UsedCarManagerView } from './views/UsedCarManagerView';
import { UnitDrawer } from './components/UnitDrawer';
import { MetricDictionaryModal } from './components/MetricDictionaryModal';

export const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<RoleType>('GROUP_OWNERSHIP');
  const [activeClusterId, setActiveClusterId] = useState<string>('cluster-hyundai-metro');
  const [activeRooftopId, setActiveRooftopId] = useState<string>('booran-hyundai-dandenong');
  const [selectedVin, setSelectedVin] = useState<string | null>(null);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [feedStatus, setFeedStatus] = useState<FeedStatus | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchFeedStatus = () => {
    api.getStatus()
      .then(setFeedStatus)
      .catch(console.error);
  };

  useEffect(() => {
    fetchFeedStatus();
  }, []);

  const handleRefreshFeed = async () => {
    setIsRefreshing(true);
    try {
      await api.triggerFeed();
      await fetchFeedStatus();
      // Force brief reload feel
      window.location.reload();
    } catch (e) {
      console.error('Feed trigger error:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDrillToRooftop = (rooftopId: string) => {
    setActiveRooftopId(rooftopId);
    setCurrentRole('GENERAL_MANAGER');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDrillToCluster = (clusterId: string) => {
    setActiveClusterId(clusterId);
    setCurrentRole('DEALER_PRINCIPAL');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      {/* Header with Role switcher and Feed Status */}
      <Header
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        feedStatus={feedStatus}
        onRefreshFeed={handleRefreshFeed}
        isRefreshing={isRefreshing}
        onOpenDictionary={() => setIsDictionaryOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 pt-6">
        {currentRole === 'GROUP_OWNERSHIP' && (
          <GroupOwnershipView
            onDrillToRooftop={handleDrillToRooftop}
            onDrillToCluster={handleDrillToCluster}
            onOpenUnit={setSelectedVin}
          />
        )}

        {currentRole === 'DEALER_PRINCIPAL' && (
          <DealerPrincipalView
            initialClusterId={activeClusterId}
            onOpenUnit={setSelectedVin}
            onDrillToRooftop={handleDrillToRooftop}
          />
        )}

        {currentRole === 'GENERAL_MANAGER' && (
          <GeneralManagerView
            initialRooftopId={activeRooftopId}
            onOpenUnit={setSelectedVin}
          />
        )}

        {currentRole === 'USED_CAR_MANAGER' && (
          <UsedCarManagerView onOpenUnit={setSelectedVin} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-border/60 bg-[#070a12] py-4 text-xs text-slate-500">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-2">
          <div>
            Good Showroom · Live Inventory Tracker · Version GS-INV-SOW-001 (1.0)
          </div>
          <div className="flex items-center gap-4">
            <span>Booran Motor Group internal BI</span>
            <span>·</span>
            <span>OmniSuiteAI Pty Ltd (Melbourne/Sydney)</span>
          </div>
        </div>
      </footer>

      {/* Slide-out Unit Intelligence Drawer */}
      <UnitDrawer vin={selectedVin} onClose={() => setSelectedVin(null)} />

      {/* Metric Dictionary Modal */}
      <MetricDictionaryModal
        isOpen={isDictionaryOpen}
        onClose={() => setIsDictionaryOpen(false)}
      />
    </div>
  );
};
