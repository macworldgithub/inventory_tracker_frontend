import React from "react";
import { RoleType, FeedStatus } from "../types";
import {
  Building2,
  Users,
  Store,
  SlidersHorizontal,
  RefreshCw,
  Clock,
  CheckCircle2,
  HelpCircle,
  CarFront,
} from "lucide-react";

interface HeaderProps {
  currentRole: RoleType;
  onSelectRole: (role: RoleType) => void;
  feedStatus: FeedStatus | null;
  onRefreshFeed: () => void;
  isRefreshing: boolean;
  onOpenDictionary: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onSelectRole,
  feedStatus,
  onRefreshFeed,
  isRefreshing,
  onOpenDictionary,
}) => {
  const roles: { id: RoleType; label: string; icon: any; desc: string }[] = [
    {
      id: "GROUP_OWNERSHIP",
      label: "Group Ownership",
      icon: Building2,
      desc: "All Rooftops · Capital & Risk",
    },
    {
      id: "DEALER_PRINCIPAL",
      label: "Dealer Principal",
      icon: Users,
      desc: "Cluster Comparison & Watchlist",
    },
    {
      id: "GENERAL_MANAGER",
      label: "General Manager",
      icon: Store,
      desc: "Single Lot · Pipeline & Exceptions",
    },
    {
      id: "USED_CAR_MANAGER",
      label: "Used Car Manager",
      icon: SlidersHorizontal,
      desc: "Unit Workbench & Pricing",
    },
  ];

  return (
    <header className="border-b border-surface-border bg-[#0a0f1d]/90 backdrop-blur-md sticky top-0 z-40">
      {/* Top Banner: Brand, Feed Status, Controls */}
      <div className="max-w-[1720px] mx-auto px-3 sm:px-4 lg:px-6 py-3 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Brand & Platform Identity */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-blue-400 flex items-center justify-center shadow-lg shadow-brand-500/20 shrink-0">
            <CarFront className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-extrabold tracking-tight text-white text-[clamp(0.82rem,1.2vw,1.25rem)]">
                GOOD SHOWROOM
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">
                Live Inventory
              </span>
            </div>
            <div className="text-[10px] sm:text-xs text-slate-400 font-medium truncate leading-relaxed">
              Booran Motor Group · First-Party Stock Intelligence
            </div>
          </div>
        </div>

        {/* Dual-Feed Reconciled Status Header (SOW 8.1 Contract) */}
        {/* <div className="flex items-center gap-4 text-xs bg-surface-card border border-surface-border px-3.5 py-1.5 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-400">FEED: LIVE</span>
          </div>

          <div className="h-3.5 w-[1px] bg-surface-border" />

          <div className="flex items-center gap-1.5 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pentana eraPower / EraNet:</span>
            <span className="font-mono text-slate-100 font-medium">
              {feedStatus ? "06:14 AEST" : "06:14 AEST"}
            </span>
          </div>

          <div className="h-3.5 w-[1px] bg-surface-border" />

          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Next feed:</span>
            <span className="font-mono text-slate-300">14:00 AEST</span>
          </div>

          <div className="h-3.5 w-[1px] bg-surface-border" />

          <button
            onClick={onRefreshFeed}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 text-brand-400 hover:text-brand-300 transition-colors disabled:opacity-50"
            title="Trigger immediate feed reconciliation"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span>{isRefreshing ? "Syncing..." : "Sync Feed"}</span>
          </button>
        </div> */}

        {/* Right Tools: Metric Dictionary & AUD Badge */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={onOpenDictionary}
            className="flex items-center justify-center gap-1.5 text-[0.7rem] sm:text-xs text-slate-400 hover:text-slate-200 bg-surface-card border border-surface-border px-3 py-1.5 rounded-lg transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Metric Dictionary</span>
          </button>

          <div className="text-[0.7rem] sm:text-xs px-2.5 py-1 bg-surface-subtle border border-surface-border text-slate-400 font-mono rounded text-center">
            AUD (ex-GST)
          </div>
        </div>
      </div>

      {/* Role Altitude Bar (RBAC Navigation) */}
      <div className="bg-[#0e1526] border-t border-surface-border/60">
        <div className="max-w-[1720px] mx-auto px-3 sm:px-4 lg:px-6 flex items-center gap-2 overflow-x-auto py-1.5">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-2 whitespace-nowrap">
            Role Altitude:
          </span>

          {roles.map((r) => {
            const Icon = r.icon;
            const isActive = currentRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => onSelectRole(r.id)}
                className={`flex shrink-0 items-center gap-2 px-2.5 sm:px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-surface-elevated"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`}
                />
                <div className="text-left min-w-0">
                  <div className="font-semibold leading-tight whitespace-nowrap text-[0.7rem] sm:text-xs">
                    {r.label}
                  </div>
                  <div
                    className={`text-[0.62rem] sm:text-[10px] leading-tight ${isActive ? "text-blue-100" : "text-slate-400"}`}
                  >
                    {r.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
