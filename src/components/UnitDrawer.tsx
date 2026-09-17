import React, { useEffect, useState } from 'react';
import { UnitDetails } from '../types';
import { api } from '../api';
import {
  X,
  Car,
  DollarSign,
  Clock,
  ExternalLink,
  AlertTriangle,
  ArrowRightLeft,
  Tag,
  Image as ImageIcon,
  CheckCircle,
  TrendingDown,
  Building
} from 'lucide-react';
import { Pagination } from './ui/Pagination';
import { usePagination } from './ui/usePagination';

interface UnitDrawerProps {
  vin: string | null;
  onClose: () => void;
}

export const UnitDrawer: React.FC<UnitDrawerProps> = ({ vin, onClose }) => {
  const [details, setDetails] = useState<UnitDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!vin) {
      setDetails(null);
      return;
    }

    setLoading(true);
    setError(null);
    api.getUnitDetails(vin)
      .then((data) => setDetails(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [vin]);

  const sisterPagination = usePagination(details?.sisterUnits || [], 3);

  if (!vin) return null;

  const v = details?.vehicle;
  const cost = details?.costBuildUp;
  const clock = details?.holdingClock;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-2xl bg-[#0e1424] border-l border-surface-border h-full shadow-2xl flex flex-col overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-5 border-b border-surface-border bg-surface-card flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${v?.category === 'New' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                v?.category === 'Demo' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                  'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                }`}>
                {v?.category} Stock
              </span>
              <span className="text-xs font-mono text-slate-400">
                Stock #{v?.stockNumber}
              </span>
              {v?.rego && (
                <span className="text-xs font-mono bg-surface-elevated px-2 py-0.5 rounded text-slate-300">
                  Rego: {v.rego}
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight">
              {v ? `${v.year} ${v.make} ${v.model} ${v.variant}` : 'Loading vehicle details...'}
            </h2>
            <div className="text-xs text-slate-400 font-mono mt-1">
              VIN: {v?.vin || 'N/A'} · {v?.colour} · {v?.odometer.toLocaleString()} km
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-elevated transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content Body */}
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="animate-spin w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full mx-auto mb-3" />
            Loading Unit Intelligence...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-400 bg-red-500/10 m-6 rounded-xl border border-red-500/20">
            Failed to load unit details: {error}
          </div>
        ) : !v ? null : (
          <div className="p-6 space-y-6 flex-1 text-xs">
            {/* Action Banner (SOW 7.4) */}
            {v.recommendedAction !== 'NONE' && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-amber-300 uppercase tracking-wider text-xs">
                      Deterministic Action Required: {v.recommendedAction}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400">Rule Triggered</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {v.actionReason}
                </p>
                {v.recommendedTransferTarget && (
                  <div className="pt-2 text-xs font-semibold text-brand-300 flex items-center gap-1.5">
                    <ArrowRightLeft className="w-4 h-4 text-brand-400" />
                    <span>Recommended Target Rooftop: {v.recommendedTransferTarget}</span>
                  </div>
                )}
              </div>
            )}

            {/* What It Owes - Pentana Cost Breakdown (SOW 6.0) */}
            <div className="p-4 rounded-xl border border-surface-border bg-surface-card space-y-3">
              <div className="flex items-center justify-between border-b border-surface-border pb-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-brand-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    What It Owes · Pentana Ledger Truth
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  DMS Ledger Reconciled
                </span>
              </div>

              <div className="space-y-2 font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Base Acquisition Cost:</span>
                  <span>${cost?.vehicleCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Recon / Workshop Spend Posted:</span>
                  <span className="text-blue-400">+${cost?.postedRecon.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Other Capital Extras:</span>
                  <span className="text-blue-400">+${cost?.extras.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-100 font-bold border-t border-surface-border pt-2 text-sm">
                  <span className="text-brand-300 font-sans">TOTAL COST OWED (PENTANA):</span>
                  <span className="text-brand-400 font-extrabold">
                    ${cost?.totalStockCost.toLocaleString()}
                  </span>
                </div>
              </div>

              {cost?.floorplanExposure ? (
                <div className="text-[11px] text-slate-400 flex justify-between pt-1 border-t border-surface-border">
                  <span>Floorplan Financed Exposure:</span>
                  <span className="font-mono text-slate-300">${cost.floorplanExposure.toLocaleString()}</span>
                </div>
              ) : null}
            </div>

            {/* Frontline Merchandising Truth */}
            <div className="p-4 rounded-xl border border-surface-border bg-surface-card space-y-3">
              <div className="flex items-center justify-between border-b border-surface-border pb-2">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Frontline Merchandising · Advertised Truth
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Source: Rooftop Website Feed
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-surface-elevated p-2.5 rounded-lg border border-surface-border">
                  <div className="text-slate-400 text-[11px]">Advertised Public Price</div>
                  <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                    {v.advertisedPrice ? `$${v.advertisedPrice.toLocaleString()}` : 'UNLISTED'}
                  </div>
                </div>

                <div className="bg-surface-elevated p-2.5 rounded-lg border border-surface-border">
                  <div className="text-slate-400 text-[11px]">Potential Gross Margin</div>
                  <div className={`text-base font-bold font-mono mt-0.5 ${v.potentialGross < 0 ? 'text-red-400' :
                    v.potentialGross < 1000 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                    {v.advertisedPrice ? `$${v.potentialGross.toLocaleString()}` : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Holding Cost Clock */}
            <div className="p-4 rounded-xl border border-surface-border bg-surface-card space-y-3">
              <div className="flex items-center justify-between border-b border-surface-border pb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Holding Cost Clock · Aging Risk
                  </h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-surface-elevated text-slate-300">
                  {v.agingBucket} Bucket
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-surface-elevated p-2 rounded-lg border border-surface-border">
                  <div className="text-slate-400 text-[10px]">Days In Stock</div>
                  <div className="text-lg font-extrabold font-mono text-white mt-0.5">
                    {clock?.daysInStock} DIS
                  </div>
                </div>

                <div className="bg-surface-elevated p-2 rounded-lg border border-surface-border">
                  <div className="text-slate-400 text-[10px]">Holding / Day</div>
                  <div className="text-lg font-bold font-mono text-amber-400 mt-0.5">
                    ${clock?.dailyRate}
                  </div>
                </div>

                <div className="bg-surface-elevated p-2 rounded-lg border border-surface-border">
                  <div className="text-slate-400 text-[10px]">Total Holding Paid</div>
                  <div className="text-lg font-extrabold font-mono text-red-400 mt-0.5">
                    ${clock?.accumulated.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Sister Units Across Booran Motor Group */}
            {details.sisterUnits && details.sisterUnits.length > 0 && (
              <div className="p-4 rounded-xl border border-surface-border bg-surface-card space-y-3">
                <div className="flex items-center gap-2 border-b border-surface-border pb-2">
                  <Building className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Sister Units in Booran Group ({v.make} {v.model})
                  </h3>
                </div>

                <div className="space-y-2">
                  {sisterPagination.paginatedItems.map((sister) => (
                    <div
                      key={sister.vin}
                      className="p-2.5 rounded-lg bg-surface-elevated border border-surface-border flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-200">{sister.rooftopName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Stock #{sister.stockNumber} · {sister.odometer.toLocaleString()} km
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-slate-200 font-bold">
                          {sister.advertisedPrice ? `$${sister.advertisedPrice.toLocaleString()}` : 'Unlisted'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {sister.daysInStock} DIS · owes ${sister.totalStockCost.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Pagination
                  currentPage={sisterPagination.currentPage}
                  totalPages={sisterPagination.totalPages}
                  totalItems={sisterPagination.totalItems}
                  pageSize={sisterPagination.pageSize}
                  onPageChange={sisterPagination.setCurrentPage}
                  onPageSizeChange={sisterPagination.setPageSize}
                  pageSizeOptions={[3, 5, 10]}
                  className="mt-2 rounded-lg border border-surface-border"
                />
              </div>
            )}
          </div>
        )}

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-surface-border bg-surface-card flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-surface-elevated text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {v?.recommendedAction === 'PRICE' && (
              <button
                onClick={() => alert(`Price review flag marked for ${v?.stockNumber}`)}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-white transition-colors shadow-sm"
              >
                Mark for Price Review
              </button>
            )}

            {v?.recommendedAction === 'TRANSFER' && (
              <button
                onClick={() => alert(`Transfer request drafted: ${v?.stockNumber} to ${v?.recommendedTransferTarget}`)}
                className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white transition-colors shadow-sm"
              >
                Draft Transfer Request
              </button>
            )}

            {v?.recommendedAction === 'WHOLESALE' && (
              <button
                onClick={() => alert(`Pack generated for auction/wholesale disposition: ${v?.stockNumber}`)}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-semibold text-white transition-colors shadow-sm"
              >
                Pack for Wholesale
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
