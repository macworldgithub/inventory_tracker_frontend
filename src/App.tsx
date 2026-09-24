import React, { useState, useEffect } from "react";
import { RoleType, FeedStatus } from "./types";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { api } from "./api";
import { Header } from "./components/Header";
import { AccessGuard } from "./components/AccessGuard";
import { GroupOwnershipView } from "./views/GroupOwnershipView";
import { DealerPrincipalView } from "./views/DealerPrincipalView";
import { GeneralManagerView } from "./views/GeneralManagerView";
import { UsedCarManagerView } from "./views/UsedCarManagerView";
import { UnitDrawer } from "./components/UnitDrawer";
import { MetricDictionaryModal } from "./components/MetricDictionaryModal";

const AppContent: React.FC = () => {
  const { currentUser, switchUser, canAccessRole } = useAuth();
  const [currentRole, setCurrentRole] = useState<RoleType>(() => currentUser.role);
  const [activeClusterId, setActiveClusterId] = useState<string>('cluster-hyundai-metro');
  const [activeRooftopId, setActiveRooftopId] = useState<string>('booran-hyundai-berwick');
  const [selectedVin, setSelectedVin] = useState<string | null>(null);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [feedStatus, setFeedStatus] = useState<FeedStatus | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Synchronize active view whenever currentUser changes
  useEffect(() => {
    if (!currentUser.allowedRoles.includes(currentRole)) {
      setCurrentRole(currentUser.role);
    }
    if (currentUser.rooftopId) {
      setActiveRooftopId(currentUser.rooftopId);
    } else if (currentUser.allowedRooftops.length > 0 && currentUser.allowedRooftops[0] !== '*') {
      setActiveRooftopId(currentUser.allowedRooftops[0]);
    }
    if (currentUser.clusterId) {
      setActiveClusterId(currentUser.clusterId);
    }
  }, [currentUser]);

  const fetchFeedStatus = () => {
    api.getStatus().then(setFeedStatus).catch(console.error);
  };

  useEffect(() => {
    fetchFeedStatus();
  }, []);

  const handleRefreshFeed = async () => {
    setIsRefreshing(true);
    try {
      await api.triggerFeed();
      await fetchFeedStatus();
      window.location.reload();
    } catch (e) {
      console.error("Feed trigger error:", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDrillToRooftop = (rooftopId: string) => {
    setActiveRooftopId(rooftopId);
    setCurrentRole("GENERAL_MANAGER");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDrillToCluster = (clusterId: string) => {
    setActiveClusterId(clusterId);
    setCurrentRole("DEALER_PRINCIPAL");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isCurrentViewAuthorized = canAccessRole(currentRole);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      {/* Header with Enterprise User Account and Role navigation */}
      <Header
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        feedStatus={feedStatus}
        onRefreshFeed={handleRefreshFeed}
        isRefreshing={isRefreshing}
        onOpenDictionary={() => setIsDictionaryOpen(true)}
      />

      {/* Main Content Area: Enforce RBAC Access Guard */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-3 sm:px-4 lg:px-6 pt-4 sm:pt-6">
        {!isCurrentViewAuthorized ? (
          <AccessGuard
            requestedRole={currentRole}
            currentPersona={currentUser as any}
            onSelectPersona={switchUser as any}
            onReturnToAllowed={() => setCurrentRole(currentUser.role)}
          />
        ) : (
          <>
            {currentRole === "GROUP_OWNERSHIP" && (
              <GroupOwnershipView
                onDrillToRooftop={handleDrillToRooftop}
                onDrillToCluster={handleDrillToCluster}
                onOpenUnit={setSelectedVin}
              />
            )}

            {currentRole === "DEALER_PRINCIPAL" && (
              <DealerPrincipalView
                initialClusterId={currentUser.clusterId || activeClusterId}
                onOpenUnit={setSelectedVin}
                onDrillToRooftop={handleDrillToRooftop}
              />
            )}

            {currentRole === "GENERAL_MANAGER" && (
              <GeneralManagerView
                initialRooftopId={currentUser.rooftopId || activeRooftopId}
                onOpenUnit={setSelectedVin}
              />
            )}

            {currentRole === "USED_CAR_MANAGER" && (
              <UsedCarManagerView onOpenUnit={setSelectedVin} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-border/60 bg-[#070a12] py-4 text-xs text-slate-500">
        <div className="max-w-[1720px] mx-auto px-3 sm:px-4 lg:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            Good Showroom · Live Inventory Tracker · SOW GS-INV-SOW-001 (1.0)
          </div>
          <div className="flex items-center gap-4">
            <span>Booran Motor Group internal BI · RBAC Governed</span>
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

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};
