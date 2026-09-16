import React, { useEffect, useState } from 'react';
import { GeneralManagerData, Rooftop } from '../types';
import { api } from '../api';
import { 
  Store, 
  ChevronDown, 
  Package, 
  Wrench, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  CameraOff, 
  Tag, 
  ArrowRight,
  TrendingUp,
  DollarSign
} from 'lucide-react';

interface GeneralManagerViewProps {
  initialRooftopId?: string;
  onOpenUnit: (vin: string) => void;
}

export const GeneralManagerView: React.FC<GeneralManagerViewProps> = ({
  initialRooftopId = 'booran-hyundai-dandenong',
  onOpenUnit,
}) => {
  const [rooftopId, setRooftopId] = useState(initialRooftopId);
  const [rooftops, setRooftops] = useState<Rooftop[]>([]);
  const [data, setData] = useState<GeneralManagerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'Used' | 'New' | 'Demo'>('ALL');

  useEffect(() => {
    api.getRooftops().then(setRooftops);
  }, []);

  useEffect(() => {
    setLoading(true);
    api.getGeneralManagerRooftop(rooftopId)
      .then(setData)
      .finally(() => setLoading(false));
  }, [rooftopId]);

  if (loading || !data) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="animate-spin w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full mx-auto mb-3" />
        Loading General Manager Rooftop Operations...
      </div>
    );
  }

  const { rooftop, kpis, pipeline, movementToday, exceptions, inventoryList } = data;

  const filteredInventory = categoryFilter === 'ALL'
    ? inventoryList
    : inventoryList.filter(v => v.category === categoryFilter);

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Dealership Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-1">
            General Manager: {rooftop.generalManager} · Location: {rooftop.location}
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Store className="w-6 h-6 text-brand-400" />
            {rooftop.name}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Rooftop operations: morning meeting pipeline, recon WIP velocity, and frontline exceptions
          </p>
        </div>

        {/* Rooftop Switcher */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-medium">Select Rooftop:</label>
          <div className="relative">
            <select
              value={rooftopId}
              onChange={(e) => setRooftopId(e.target.value)}
              className="appearance-none bg-surface-card border border-surface-border text-xs text-slate-200 py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:border-brand-500 font-semibold"
            >
              {rooftops.map((r) => (
                <option key={r.rooftopId} value={r.rooftopId}>
                  {r.name} ({r.franchise})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Lot Operations KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="p-3.5 rounded-xl glass-card border border-surface-border">
          <div className="text-[11px] text-slate-400 font-medium">ON-HAND ON LOT</div>
          <div className="text-2xl font-black font-mono text-white mt-1">
            {kpis.onLotCount} <span className="text-xs font-normal text-slate-400">units</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Physical active stock</div>
        </div>

        <div className="p-3.5 rounded-xl glass-card border border-surface-border">
          <div className="text-[11px] text-slate-400 font-medium">LOT CAPITAL OWED</div>
          <div className="text-2xl font-black font-mono text-brand-400 mt-1">
            ${(kpis.totalCost / 1000).toFixed(0)}k
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Pentana commercial ledger</div>
        </div>

        <div className="p-3.5 rounded-xl glass-card border border-emerald-500/20 bg-emerald-500/5">
          <div className="text-[11px] text-emerald-300 font-medium">FRONTLINE READY</div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
            {kpis.frontlineReady}
          </div>
          <div className="text-[10px] text-emerald-300 mt-0.5 font-semibold">
            Photos + Price + Clean
          </div>
        </div>

        <div className="p-3.5 rounded-xl glass-card border border-blue-500/20 bg-blue-500/5">
          <div className="text-[11px] text-blue-300 font-medium">RECON WIP</div>
          <div className="text-2xl font-black font-mono text-blue-400 mt-1">
            {kpis.inRecon} <span className="text-xs font-normal text-blue-300">units</span>
          </div>
          <div className="text-[10px] text-blue-300 mt-0.5">Workshop / detail bay</div>
        </div>

        <div className="p-3.5 rounded-xl glass-card border border-amber-500/20 bg-amber-500/5">
          <div className="text-[11px] text-amber-300 font-medium">TODAY'S HOLDING BURN</div>
          <div className="text-2xl font-black font-mono text-amber-400 mt-1">
            ${kpis.holdingCostToday}
          </div>
          <div className="text-[10px] text-amber-300 mt-0.5 font-mono">
            Avg DIS: {kpis.avgDis} days
          </div>
        </div>
      </div>

      {/* Inventory Pipeline (SOW 7.3) */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Rooftop Inventory Pipeline
            </h2>
            <p className="text-xs text-slate-400">Flow from transit arrival to weekend delivery</p>
          </div>
          <span className="text-xs text-brand-400 font-semibold">Updated 06:14 AEST Feed</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="p-3.5 rounded-lg bg-surface-elevated border border-surface-border relative overflow-hidden">
            <div className="text-[11px] text-slate-400 font-semibold uppercase">1. Incoming / Transit</div>
            <div className="text-2xl font-black font-mono text-slate-100 mt-1">{pipeline.incoming}</div>
            <div className="text-[10px] text-slate-400 mt-1">Due at yard within 48h</div>
            <div className="absolute right-2 bottom-2 text-slate-600">
              <Package className="w-5 h-5" />
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-surface-elevated border border-blue-500/30 relative overflow-hidden">
            <div className="text-[11px] text-blue-300 font-semibold uppercase">2. In Recon (WIP)</div>
            <div className="text-2xl font-black font-mono text-blue-400 mt-1">{pipeline.inRecon}</div>
            <div className="text-[10px] text-blue-300/80 mt-1">Mechanical & detail</div>
            <div className="absolute right-2 bottom-2 text-blue-600/40">
              <Wrench className="w-5 h-5" />
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-surface-elevated border border-emerald-500/30 relative overflow-hidden">
            <div className="text-[11px] text-emerald-300 font-semibold uppercase">3. Frontline Ready</div>
            <div className="text-2xl font-black font-mono text-emerald-400 mt-1">{pipeline.frontlineReady}</div>
            <div className="text-[10px] text-emerald-300/80 mt-1">Online & in yard display</div>
            <div className="absolute right-2 bottom-2 text-emerald-600/40">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-surface-elevated border border-amber-500/30 relative overflow-hidden">
            <div className="text-[11px] text-amber-300 font-semibold uppercase">4. Customer Reserved</div>
            <div className="text-2xl font-black font-mono text-amber-400 mt-1">{pipeline.reserved}</div>
            <div className="text-[10px] text-amber-300/80 mt-1">Deposit taken / finance pending</div>
            <div className="absolute right-2 bottom-2 text-amber-600/40">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-surface-elevated border border-purple-500/30 relative overflow-hidden">
            <div className="text-[11px] text-purple-300 font-semibold uppercase">5. Sold This Week</div>
            <div className="text-2xl font-black font-mono text-purple-400 mt-1">{pipeline.soldThisWeek}</div>
            <div className="text-[10px] text-purple-300/80 mt-1">Retail handover delivered</div>
            <div className="absolute right-2 bottom-2 text-purple-600/40">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Today's Movement Ticker & Exception Rail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Movement Delta Ticker (SOW 7.3) */}
        <div className="rounded-xl border border-surface-border bg-surface-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-brand-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Today's Movement Delta (Since 06:00 Feed)
              </h2>
            </div>
            <span className="text-xs text-emerald-400 font-semibold">Active Ledger</span>
          </div>

          <div className="space-y-2.5">
            {movementToday.map((m, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-surface-elevated border border-surface-border flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      m.type === 'STOCK_IN' ? 'bg-emerald-500/20 text-emerald-400' :
                      m.type === 'SOLD' ? 'bg-purple-500/20 text-purple-400' :
                      m.type === 'TRANSFER_OUT' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {m.type}
                    </span>
                    <span className="font-bold text-white">{m.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">{m.details}</div>
                </div>

                <div className="text-right">
                  <div className="text-slate-300 font-mono text-[11px]">{m.time}</div>
                  <div className="text-slate-400 text-[10px] font-mono">#{m.stockNumber}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Merchandising Exception Rail (SOW 7.3) */}
        <div className="rounded-xl border border-surface-border bg-surface-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Merchandising Exception Rail
              </h2>
            </div>
            <span className="text-xs text-amber-400 font-semibold">Fix Before Sales Meeting</span>
          </div>

          <div className="space-y-3">
            {/* Missing Photos */}
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <CameraOff className="w-4 h-4 text-amber-400" />
                  <span>Missing Photos ({exceptions.missingPhotosCount} units)</span>
                </div>
                <span className="text-[10px] text-amber-400">Buyers cannot see unit online</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {exceptions.missingPhotos.map((v) => (
                  <button
                    key={v.vin}
                    onClick={() => onOpenUnit(v.vin)}
                    className="px-2 py-1 rounded bg-surface-card border border-amber-500/30 text-[11px] text-slate-200 hover:border-amber-400 transition-colors font-mono"
                  >
                    #{v.stockNumber} ({v.model})
                  </button>
                ))}
              </div>
            </div>

            {/* Unlisted Advertised Price */}
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-blue-300">
                  <Tag className="w-4 h-4 text-blue-400" />
                  <span>Unlisted Price ({exceptions.missingPriceCount} units)</span>
                </div>
                <span className="text-[10px] text-blue-400">Website feed has price = null</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {exceptions.missingPrice.map((v) => (
                  <button
                    key={v.vin}
                    onClick={() => onOpenUnit(v.vin)}
                    className="px-2 py-1 rounded bg-surface-card border border-blue-500/30 text-[11px] text-slate-200 hover:border-blue-400 transition-colors font-mono"
                  >
                    #{v.stockNumber} ({v.model})
                  </button>
                ))}
              </div>
            </div>

            {/* Aged 90+ Units */}
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-red-300">
                  <Clock className="w-4 h-4 text-red-400" />
                  <span>Aged 90+ Days ({exceptions.aged90Count} units)</span>
                </div>
                <span className="text-[10px] text-red-400">Wholesale or aggressive repricing required</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {exceptions.aged90.map((v) => (
                  <button
                    key={v.vin}
                    onClick={() => onOpenUnit(v.vin)}
                    className="px-2 py-1 rounded bg-surface-card border border-red-500/30 text-[11px] text-red-300 hover:border-red-400 transition-colors font-mono"
                  >
                    #{v.stockNumber} ({v.daysInStock}d · ${v.totalStockCost.toLocaleString()})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lot Active Inventory Grid */}
      <div className="rounded-xl border border-surface-border bg-surface-card overflow-hidden">
        <div className="p-4 border-b border-surface-border flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Dealership Inventory Roll
            </h2>
            <p className="text-xs text-slate-400">Showing all {filteredInventory.length} units currently on lot</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Category:</span>
            {(['ALL', 'Used', 'New', 'Demo'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  categoryFilter === cat 
                    ? 'bg-brand-600 text-white' 
                    : 'bg-surface-elevated text-slate-300 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-surface-border bg-surface-elevated text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                <th className="py-3 px-4">Stock # / Rego</th>
                <th className="py-3 px-4">Vehicle Description</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-right">What It Owes</th>
                <th className="py-3 px-3 text-right">Advertised Price</th>
                <th className="py-3 px-3 text-center">DIS</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border font-medium">
              {filteredInventory.map((v) => (
                <tr
                  key={v.vin}
                  onClick={() => onOpenUnit(v.vin)}
                  className="hover:bg-surface-elevated/70 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono">
                    <div className="font-bold text-slate-100">#{v.stockNumber}</div>
                    <div className="text-[10px] text-slate-400">{v.rego || 'No Rego'}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{v.year} {v.make} {v.model} {v.variant}</div>
                    <div className="text-[11px] text-slate-400">{v.colour} · {v.odometer.toLocaleString()} km</div>
                  </td>

                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      v.category === 'New' ? 'bg-emerald-500/20 text-emerald-400' :
                      v.category === 'Demo' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {v.category}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-200">
                    ${v.totalStockCost.toLocaleString()}
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                    {v.advertisedPrice ? `$${v.advertisedPrice.toLocaleString()}` : 'UNLISTED'}
                  </td>

                  <td className="py-3 px-3 text-center font-mono">
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      v.daysInStock > 60 ? 'bg-red-500/20 text-red-400' :
                      v.daysInStock > 40 ? 'bg-amber-500/20 text-amber-400' : 'bg-surface-elevated text-slate-300'
                    }`}>
                      {v.daysInStock}d
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      v.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400' :
                      v.status === 'In Recon' ? 'bg-blue-500/10 text-blue-400' :
                      v.status === 'Reserved' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {v.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    {v.recommendedAction !== 'NONE' ? (
                      <span className="px-2 py-1 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {v.recommendedAction}
                      </span>
                    ) : (
                      <span className="text-slate-600 text-[10px] font-mono">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
