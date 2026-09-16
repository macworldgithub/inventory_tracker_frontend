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
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                v?.category === 'New' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                v?.category === 'Demo' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              }`}>
                {v?.category} Stock
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                v?.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400' :
                v?.status === 'Reserved' ? 'bg-amber-500/10 text-amber-400' :
                v?.status === 'In Recon' ? 'bg-blue-500/10 text-blue-400' :
                'bg-red-500/10 text-red-400'
              }`}>
                {v?.status}
              </span>
              <span className="text-xs text-slate-400 font-mono">Stock #{v?.stockNumber}</span>
              {v?.rego && <span className="text-xs text-slate-400 font-mono">Rego: {v.rego}</span>}
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight">
              {v ? `${v.year} ${v.make} ${v.model} ${v.variant}` : 'Loading unit...'}
            </h2>
            <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
              <span className="font-mono text-slate-300">{v?.vin}</span>
              <span>·</span>
              <span className="text-brand-400">{v?.rooftopName}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-elevated transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-slate-400 text-sm">Loading unit intelligence...</div>
          </div>
        ) : error || !v ? (
          <div className="p-6 text-red-400 text-sm">Failed to load unit details: {error}</div>
        ) : (
          <div className="p-6 space-y-6 flex-1">
            {/* Visual Merchandising Hero */}
            <div className="relative rounded-xl overflow-hidden border border-surface-border bg-black aspect-video group">
              {v.heroPhoto ? (
                <img
                  src={v.heroPhoto}
                  alt={`${v.year} ${v.make} ${v.model}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-surface-card">
                  <ImageIcon className="w-12 h-12 mb-2 text-slate-600" />
                  <span className="text-xs font-semibold text-amber-400">MERCHANDISING EXCEPTION: NO PHOTOS</span>
                  <span className="text-[11px] text-slate-500 mt-1">Website feed has no images for this VIN</span>
                </div>
              )}

              <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 text-xs flex items-center gap-2">
                <span className={v.isLiveOnWebsite ? 'text-emerald-400' : 'text-amber-400'}>
                  ● {v.isLiveOnWebsite ? 'Live on Website' : 'Not Live on Website'}
                </span>
                {v.listingUrl && (
                  <a
                    href={v.listingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-300 hover:text-white flex items-center gap-1 ml-2 border-l border-white/20 pl-2"
                  >
                    <span>View Listing</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Recommended Action Box */}
            {v.recommendedAction !== 'NONE' && (
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                      Action Recommendation: {v.recommendedAction}
                    </span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                    Deterministic Rule
                  </span>
                </div>
                <p className="text-sm text-slate-200">{v.actionReason}</p>
                {v.recommendedTransferTarget && (
                  <div className="mt-2 text-xs text-brand-300 flex items-center gap-1.5 font-medium">
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>Recommended Destination: {v.recommendedTransferTarget}</span>
                  </div>
                )}
              </div>
            )}

            {/* Commercial Truth: What the Vehicle Owes (SOW 5.1 & 5.5) */}
            <div className="p-4 rounded-xl border border-surface-border bg-surface-card space-y-3">
              <div className="flex items-center justify-between border-b border-surface-border pb-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-brand-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Commercial Truth · What It Owes
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Source: Pentana {v.pentanaSource}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-surface-elevated p-2.5 rounded-lg border border-surface-border">
                  <div className="text-slate-400 text-[11px]">Vehicle Acquisition Cost</div>
                  <div className="text-base font-bold font-mono text-white mt-0.5">
                    ${cost?.vehicleCost.toLocaleString()}
                  </div>
                </div>

                <div className="bg-surface-elevated p-2.5 rounded-lg border border-surface-border">
                  <div className="text-slate-400 text-[11px]">Posted Recon (Work WIP)</div>
                  <div className="text-base font-bold font-mono text-slate-200 mt-0.5">
                    ${cost?.postedRecon.toLocaleString()}
                  </div>
                </div>

                <div className="bg-surface-elevated p-2.5 rounded-lg border border-surface-border">
                  <div className="text-slate-400 text-[11px]">Extras & Accessories</div>
                  <div className="text-base font-bold font-mono text-slate-200 mt-0.5">
                    ${cost?.extras.toLocaleString()}
                  </div>
                </div>

                <div className="bg-surface-elevated p-2.5 rounded-lg border border-brand-500/40 bg-brand-500/10">
                  <div className="text-brand-300 text-[11px] font-semibold">Total Stock Cost (Owes)</div>
                  <div className="text-lg font-extrabold font-mono text-brand-400 mt-0.5">
                    ${cost?.totalStockCost.toLocaleString()}
                  </div>
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
                  <div className={`text-base font-bold font-mono mt-0.5 ${
                    v.potentialGross < 0 ? 'text-red-400' :
                    v.potentialGross < 1000 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {v.advertisedPrice ? `$${v.potentialGross.toLocaleString()}` : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Holding Cost Clock (SOW 6.0) */}
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
                  {details.sisterUnits.map((sister) => (
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
