import React, { useEffect, useState } from 'react';
import { DealerPrincipalData, Rooftop } from '../types';
import { api } from '../api';
import { 
  Users, 
  ChevronDown, 
  DollarSign, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Flame, 
  ArrowRightLeft,
  ChevronRight
} from 'lucide-react';

interface DealerPrincipalViewProps {
  initialClusterId?: string;
  onOpenUnit: (vin: string) => void;
  onDrillToRooftop: (rooftopId: string) => void;
}

export const DealerPrincipalView: React.FC<DealerPrincipalViewProps> = ({
  initialClusterId = 'cluster-hyundai-metro',
  onOpenUnit,
  onDrillToRooftop,
}) => {
  const [clusterId, setClusterId] = useState(initialClusterId);
  const [data, setData] = useState<DealerPrincipalData | null>(null);
  const [loading, setLoading] = useState(true);

  const clusterOptions = [
    { id: 'cluster-hyundai-metro', name: 'Booran Hyundai Metro Cluster (Dandenong, Cranbourne, Berwick, South Morang)' },
    { id: 'cluster-bayside-kia', name: 'Booran Bayside Kia Cluster (Cheltenham, Cranbourne)' },
    { id: 'cluster-growth-brands', name: 'Booran Emerging Franchises (MG & Chery Dandenong)' },
  ];

  useEffect(() => {
    setLoading(true);
    api.getDealerPrincipalCluster(clusterId)
      .then(setData)
      .finally(() => setLoading(false));
  }, [clusterId]);

  if (loading || !data) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="animate-spin w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full mx-auto mb-3" />
        Loading Dealer Principal Cluster Dashboard...
      </div>
    );
  }

  const { kpiStrip, comparisonTable, agingWaterfall, watchlist, actions } = data;

  return (
    <div className="space-y-6 pb-12">
      {/* Cluster Header & Selector (SOW 7.2) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-1">
            Dealer Principal: {data.dpName}
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-brand-400" />
            {data.clusterName}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cluster accountability view: side-by-side rooftop coaching, capital velocity, and aged stock reduction
          </p>
        </div>

        {/* Cluster Filter Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-medium">Cluster:</label>
          <div className="relative">
            <select
              value={clusterId}
              onChange={(e) => setClusterId(e.target.value)}
              className="appearance-none bg-surface-card border border-surface-border text-xs text-slate-200 py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:border-brand-500 font-semibold"
            >
              {clusterOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Cluster KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl glass-card border border-surface-border">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>CLUSTER INVENTORY</span>
            <DollarSign className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white mt-1">
            {kpiStrip.totalUnits} <span className="text-sm font-normal text-slate-400">units</span>
          </div>
          <div className="text-xs text-slate-300 font-mono mt-1">
            Stock cost: ${(kpiStrip.totalCost / 1000).toFixed(0)}k
          </div>
        </div>

        <div className="p-4 rounded-xl glass-card border border-surface-border">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>AVERAGE CLUSTER DIS</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black font-mono text-blue-400 mt-1">
            {kpiStrip.avgDis} <span className="text-sm font-normal text-slate-400">days</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Available: {kpiStrip.availableUnits} · Reserved: {kpiStrip.reservedUnits}
          </div>
        </div>

        <div className="p-4 rounded-xl glass-card border border-amber-500/20 bg-amber-500/5">
          <div className="text-[11px] font-medium text-amber-300 flex items-center justify-between">
            <span>AGED 45+ UNITS</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-400 mt-1">
            {kpiStrip.aged45Count}
          </div>
          <div className="text-xs text-amber-300 font-mono mt-1">
            {Math.round((kpiStrip.aged45Count / kpiStrip.totalUnits) * 100)}% of cluster stock
          </div>
        </div>

        <div className="p-4 rounded-xl glass-card border border-emerald-500/20 bg-emerald-500/5">
          <div className="text-[11px] font-medium text-emerald-300 flex items-center justify-between">
            <span>POTENTIAL CLUSTER GROSS</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
            ${(kpiStrip.potentialGross / 1000).toFixed(0)}k
          </div>
          <div className="text-xs text-emerald-300 font-mono mt-1">
            Advertised price buffer
          </div>
        </div>
      </div>

      {/* Rooftop Comparison Table (SOW 7.2) */}
      <div className="rounded-xl border border-surface-border bg-surface-card overflow-hidden">
        <div className="p-4 border-b border-surface-border flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Cluster Rooftop Comparison (Side-by-Side)
            </h2>
            <p className="text-xs text-slate-400">Benchmark your General Managers on stock cost, turn, and aging</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-surface-border bg-surface-elevated text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                <th className="py-3 px-4">Dealership</th>
                <th className="py-3 px-4">General Manager</th>
                <th className="py-3 px-3 text-right">Units</th>
                <th className="py-3 px-3 text-right">Stock Cost</th>
                <th className="py-3 px-3 text-center">Avg DIS</th>
                <th className="py-3 px-3 text-center">Turn Rate</th>
                <th className="py-3 px-3 text-center">Aged 45+ %</th>
                <th className="py-3 px-3 text-center">Recon WIP</th>
                <th className="py-3 px-3 text-center">Frontline</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border font-medium">
              {comparisonTable.map((r) => (
                <tr key={r.rooftopId} className="hover:bg-surface-elevated/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">
                    {r.rooftopName}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {r.gmName}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-200">
                    {r.totalUnits}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-200">
                    ${(r.totalCost / 1000).toFixed(0)}k
                  </td>
                  <td className="py-3 px-3 text-center font-mono">
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      r.avgDis > 50 ? 'bg-red-500/20 text-red-400' :
                      r.avgDis > 35 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {r.avgDis}d
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-emerald-400 font-bold">
                    {r.turnRate}x
                  </td>
                  <td className="py-3 px-3 text-center font-mono">
                    <span className={r.aged45Percent > 30 ? 'text-red-400 font-bold' : 'text-slate-300'}>
                      {r.aged45Percent}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-blue-400 font-bold">
                    {r.reconPending} units
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-200">
                    {r.frontlineCount}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onDrillToRooftop(r.rooftopId)}
                      className="px-2.5 py-1 rounded bg-surface-elevated hover:bg-brand-600 text-[11px] text-slate-300 hover:text-white transition-colors flex items-center gap-1 mx-auto"
                    >
                      <span>GM Lot</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cluster Aging Waterfall & Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Aging Waterfall (1 col) */}
        <div className="rounded-xl border border-surface-border bg-surface-card p-5 space-y-4">
          <div className="border-b border-surface-border pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Cluster Aging Waterfall
            </h2>
            <p className="text-xs text-slate-400">Units & capital tied up per aging bucket</p>
          </div>

          <div className="space-y-3">
            {agingWaterfall.map((bucket) => {
              const maxCost = Math.max(...agingWaterfall.map(b => b.cost)) || 1;
              const barWidth = Math.max(8, Math.round((bucket.cost / maxCost) * 100));

              return (
                <div key={bucket.bucket} className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-300">{bucket.bucket}</span>
                    <span className="font-mono text-slate-100 font-bold">
                      {bucket.count} units · ${(bucket.cost / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <div className="h-3 rounded bg-surface-subtle overflow-hidden">
                    <div
                      style={{ width: `${barWidth}%` }}
                      className={`h-full ${
                        bucket.bucket.includes('90+') ? 'bg-red-500' :
                        bucket.bucket.includes('61-90') ? 'bg-orange-500' :
                        bucket.bucket.includes('46-60') ? 'bg-amber-500' :
                        bucket.bucket.includes('31-45') ? 'bg-blue-500' : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Watchlist: Worst 15 Units by DIS x Cost (2 cols - SOW 7.2) */}
        <div className="lg:col-span-2 rounded-xl border border-surface-border bg-surface-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-400" />
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Top 15 Capital Risk Watchlist
                </h2>
                <p className="text-xs text-slate-400">Ranked by DIS × Total Stock Cost (Maximum Holding Burn)</p>
              </div>
            </div>
            <span className="text-xs text-slate-400">Click unit to view intelligence drawer</span>
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {watchlist.map((unit, index) => (
              <div
                key={unit.vin}
                onClick={() => onOpenUnit(unit.vin)}
                className="p-2.5 rounded-lg bg-surface-elevated border border-surface-border hover:border-brand-500/50 transition-colors cursor-pointer flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 text-center font-bold text-slate-400 text-xs">
                    #{index + 1}
                  </span>
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      {unit.title}
                      <span className="text-[10px] font-mono text-slate-400">#{unit.stockNumber}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {unit.rooftopName} · <span className="font-semibold text-purple-400">{unit.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="font-mono font-bold text-slate-200">
                      ${unit.totalStockCost.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400">What it owes</div>
                  </div>

                  <div>
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-red-500/20 text-red-400">
                      {unit.daysInStock} DIS
                    </span>
                    <div className="text-[10px] text-red-400 font-mono mt-0.5">
                      -${unit.accumulatedHoldingCost.toLocaleString()} held
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {unit.recommendedAction}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
