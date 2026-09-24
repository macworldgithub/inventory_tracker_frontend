import React from 'react';
import { RoleType, FeedStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { UserProfileMenu } from './UserProfileMenu';
import {
  Building2,
  Users,
  Store,
  SlidersHorizontal,
  HelpCircle,
  CarFront,
  ShieldCheck,
  MapPin,
} from 'lucide-react';

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
  onOpenDictionary,
}) => {
  const { currentUser, canAccessRole } = useAuth();

  const allRoles: { id: RoleType; label: string; icon: any; desc: string }[] = [
    {
      id: 'GROUP_OWNERSHIP',
      label: 'Group Ownership',
      icon: Building2,
      desc: 'All Rooftops · Capital & Risk',
    },
    {
      id: 'DEALER_PRINCIPAL',
      label: 'Dealer Principal',
      icon: Users,
      desc: 'Cluster Comparison & Watchlist',
    },
    {
      id: 'GENERAL_MANAGER',
      label: 'General Manager',
      icon: Store,
      desc: 'Single Lot · Pipeline & Exceptions',
    },
    {
      id: 'USED_CAR_MANAGER',
      label: 'Used Car Manager',
      icon: SlidersHorizontal,
      desc: 'Unit Workbench & Pricing',
    },
  ];

  // In production RBAC: only render the tabs the active corporate user is authorized to access
  const authorizedRoles = allRoles.filter((r) => canAccessRole(r.id));

  return (
    <header className="border-b border-surface-border bg-[#0a0f1d]/95 backdrop-blur-md sticky top-0 z-40">
      {/* Top Banner: Brand, Active User Account, Controls */}
      <div className="max-w-[1720px] mx-auto px-3 sm:px-4 lg:px-6 py-3 flex flex-col items-stretch gap-3 lg:flex-row lg:items-center lg:justify-between">
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
              {/* <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">
                Live Inventory
              </span> */}
              {/* <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Production RBAC Active
              </span> */}
            </div>
            <div className="text-[10px] sm:text-xs text-slate-400 font-medium truncate leading-relaxed">
              Booran Motor Group · First-Party Stock Intelligence
            </div>
          </div>
        </div>

        {/* Right Tools: Enterprise User Profile, Scope Pill & Dictionary */}
        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full lg:w-auto">
          {/* Metric Dictionary Modal Trigger */}
          <button
            onClick={onOpenDictionary}
            className="flex items-center justify-center gap-1.5 text-[0.7rem] sm:text-xs text-slate-400 hover:text-slate-200 bg-surface-card border border-surface-border px-3 py-1.5 rounded-xl transition-colors shrink-0"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Metric Dictionary</span>
          </button>

          {/* Corporate User Account Menu */}
          <UserProfileMenu />
        </div>
      </div>

      {/* Role Navigation Bar: Rendered dynamically based on permissions */}
      {authorizedRoles.length > 1 && (
        <div className="bg-[#0e1526] border-t border-surface-border/60">
          <div className="max-w-[1720px] mx-auto px-3 sm:px-4 lg:px-6 flex items-center gap-2 overflow-x-auto py-1.5">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-2 whitespace-nowrap">
              Authorized Altitudes:
            </span>

            {authorizedRoles.map((r) => {
              const Icon = r.icon;
              const isActive = currentRole === r.id;

              return (
                <button
                  key={r.id}
                  onClick={() => onSelectRole(r.id)}
                  className={`flex shrink-0 items-center gap-2 px-2.5 sm:px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-surface-elevated'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <div className="text-left min-w-0">
                    <div className="font-semibold leading-tight whitespace-nowrap text-[0.7rem] sm:text-xs">
                      {r.label}
                    </div>
                    <div
                      className={`text-[0.62rem] sm:text-[10px] leading-tight ${isActive ? 'text-blue-100' : 'text-slate-400'
                        }`}
                    >
                      {r.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
