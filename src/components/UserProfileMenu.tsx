import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ChevronDown,
  MapPin,
  CheckCircle2,
  KeyRound,
  X,
} from 'lucide-react';

export const UserProfileMenu: React.FC = () => {
  const { currentUser, allCorporateUsers, switchUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent background scroll on mobile when modal-style dropdown is open
  useEffect(() => {
    if (isOpen && window.innerWidth < 640) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#0f1629] border border-surface-border hover:border-brand-500/60 transition-all text-left shadow-sm group shrink-0"
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-brand-500/20 shrink-0">
          {currentUser.avatar}
        </div>
        <div className="min-w-0 pr-1">
          <div className="text-[11px] font-bold text-white flex items-center gap-1.5 group-hover:text-brand-300">
            <span className="truncate max-w-[110px] sm:max-w-[170px]">{currentUser.name}</span>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform shrink-0 ${isOpen ? 'rotate-180 text-brand-400' : ''}`} />
          </div>
          <div className="text-[9px] text-slate-400 truncate max-w-[110px] sm:max-w-[160px]">
            {currentUser.roleTitle}
          </div>
        </div>
      </button>

      {/* Backdrop overlay on mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 sm:hidden"
        />
      )}

      {/* Account & RBAC Dropdown Menu */}
      {isOpen && (
        <div className="fixed left-3 right-3 top-[135px] sm:top-full sm:absolute sm:left-auto sm:right-0 sm:mt-2 sm:w-96 max-w-[calc(100vw-24px)] rounded-2xl bg-[#0b101e] border border-surface-border shadow-2xl p-3 sm:p-3.5 z-50 space-y-3 divide-y divide-surface-border/60 animate-in fade-in zoom-in-95 duration-150">
          {/* Header: User details */}
          <div className="pt-1 pb-1 space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white font-extrabold text-sm flex items-center justify-center shadow-lg shadow-brand-600/30 shrink-0">
                  {currentUser.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white flex flex-wrap items-center gap-1.5">
                    <span className="truncate">{currentUser.name}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                      {currentUser.role.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-medium truncate mt-0.5">
                    {currentUser.roleTitle}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">{currentUser.email}</div>
                </div>
              </div>

              {/* Close Button on Mobile */}
              <button
                onClick={() => setIsOpen(false)}
                className="sm:hidden p-1.5 rounded-lg text-slate-400 hover:text-white bg-surface-elevated shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scope Badge */}
            <div className="p-2.5 rounded-xl bg-surface-card border border-surface-border text-xs space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-brand-400 shrink-0" />
                <span>Authorized Lot Scope:</span>
              </div>
              <div className="text-[11px] text-white font-semibold flex items-center gap-1.5 leading-snug">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="break-words">{currentUser.scopeLabel}</span>
              </div>
            </div>
          </div>

          {/* Quick RBAC Switcher Option */}
          <div className="pt-2.5 space-y-2">
            <div className="text-[10px] uppercase font-bold text-slate-400 px-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <KeyRound className="w-3 h-3 text-purple-400 shrink-0" />
                <span>Corporate RBAC Persona</span>
              </span>
              <span className="text-[9px] text-slate-500">6 Roles Available</span>
            </div>

            <div className="max-h-60 sm:max-h-56 overflow-y-auto space-y-1.5 pr-1">
              {allCorporateUsers.map((u) => {
                const isSelected = u.id === currentUser.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u);
                      setIsOpen(false);
                    }}
                    className={`w-full p-2.5 sm:p-2 rounded-xl text-left transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-brand-600/25 border border-brand-500/60 text-white shadow-sm'
                        : 'hover:bg-surface-elevated text-slate-300 border border-transparent'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-brand-500 text-white'
                          : 'bg-surface-card border border-surface-border text-slate-300'
                      }`}
                    >
                      {u.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-bold text-white flex items-center justify-between gap-1">
                        <span className="truncate">{u.name}</span>
                        {isSelected && <span className="text-[9px] text-brand-300 font-bold shrink-0">Active</span>}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{u.roleTitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
