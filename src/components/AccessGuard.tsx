import React from 'react';
import { ShieldAlert, Lock, ArrowRight, UserCheck } from 'lucide-react';
import { UserPersona, USER_PERSONAS } from '../rbac';
import { RoleType } from '../types';

interface AccessGuardProps {
  requestedRole: RoleType;
  currentPersona: UserPersona;
  onSelectPersona: (persona: UserPersona) => void;
  onReturnToAllowed: () => void;
}

const ROLE_NAMES: Record<RoleType, string> = {
  GROUP_OWNERSHIP: 'Group Ownership Command Centre',
  DEALER_PRINCIPAL: 'Dealer Principal Cluster Dashboard',
  GENERAL_MANAGER: 'General Manager Single Lot Operations',
  USED_CAR_MANAGER: 'Used Car Manager Actionable Workbench',
};

export const AccessGuard: React.FC<AccessGuardProps> = ({
  requestedRole,
  currentPersona,
  onSelectPersona,
  onReturnToAllowed,
}) => {
  // Find personas that have access to this role
  const qualifyingPersonas = USER_PERSONAS.filter((p) => p.allowedRoles.includes(requestedRole));

  return (
    <div className="max-w-2xl mx-auto my-12 p-6 sm:p-8 rounded-2xl border border-red-500/30 bg-[#0e1424] text-center space-y-6 shadow-2xl shadow-red-950/20">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 mx-auto flex items-center justify-center">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20">
          <Lock className="w-3.5 h-3.5" />
          <span>Role-Based Access Restricted (SOW 4.0)</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Altitude Authorization Required
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          Your active persona (<strong className="text-white">{currentPersona.name}</strong> · {currentPersona.roleTitle}) is scoped to{' '}
          <span className="text-brand-400 font-semibold">{currentPersona.scopeBadge}</span> and cannot view the{' '}
          <span className="text-red-400 font-semibold">{ROLE_NAMES[requestedRole]}</span>.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-surface-card border border-surface-border text-left space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-brand-400" />
          <span>Switch to an Authorized Booran Persona to Explore:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {qualifyingPersonas.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectPersona(p)}
              className="p-3 rounded-lg bg-surface-elevated border border-surface-border hover:border-brand-500 text-left transition-all group flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-brand-300 flex items-center gap-1.5">
                  <span>{p.name}</span>
                </div>
                <div className="text-[11px] text-slate-400">{p.roleTitle}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={onReturnToAllowed}
          className="px-4 py-2 rounded-lg bg-surface-elevated hover:bg-surface-card border border-surface-border text-xs text-slate-300 hover:text-white transition-colors"
        >
          Return to My Authorized Dashboard ({ROLE_NAMES[currentPersona.role]})
        </button>
      </div>
    </div>
  );
};
