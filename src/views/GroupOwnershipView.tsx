import React, { useEffect, useState } from 'react';
import { GroupOverviewData, ActionItem } from '../types';
import { api } from '../api';
import { 
  Building2, 
  AlertTriangle, 
  ArrowRightLeft, 
  DollarSign, 
  Package, 
  ShieldAlert, 
  Layers,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { KpiCard } from '../components/ui/KpiCard';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';

interface GroupOwnershipViewProps {
  onDrillToRooftop: (rooftopId: string) => void;
  onDrillToCluster: (clusterId: string) => void;
  onOpenUnit: (vin: string) => void;
}

export const GroupOwnershipView: React.FC<GroupOwnershipViewProps> = ({
  onDrillToRooftop,
  onDrillToCluster,
  onOpenUnit,
}) => {
  const [data, setData] = useState<GroupOverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getGroupOverview()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="animate-spin w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full mx-auto mb-3" />
        Loading Group Ownership Command Centre...
      </div>
    );
  }

  const { kpiStrip, rooftopStats, categoryMix, brandMix, groupActionQueue } = data;

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Group Ownership Command Centre"
        subtitle="Booran Motor Group · Group-wide capital concentration, aged stock exposure, and cross-rooftop transfers"
        icon={<Building2 className="w-6 h-6 text-brand-400" />}
        rightContent={
          <>
            <div className="text-xs px-3 py-1.5 rounded-lg bg-surface-card border border-surface-border text-slate-300">
              Holding Rate: <span className="font-mono text-white font-semibold">0.03% / day</span>
            </div>
            <div className="text-xs px-3 py-1.5 rounded-lg bg-surface-card border border-surface-border text-slate-300">
              Active Dealerships: <span className="font-mono text-brand-400 font-bold">{rooftopStats.length} Rooftops</span>
            </div>
          </>
        }
      />

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <KpiCard
          title="Units on Hand"
          value={kpiStrip.totalUnits}
          subtext={`+${kpiStrip.deltas.stockIn} in / -${kpiStrip.deltas.retailExits} exits today`}
          icon={<Package className="w-3.5 h-3.5" />}
          iconColorClass="text-blue-400"
        />
        <KpiCard
          title="Total Stock Cost"
          value={`$${(kpiStrip.totalStockCost / 1000000).toFixed(2)}M`}
          subtext="Owes Booran Group ex-GST"
          icon={<DollarSign className="w-3.5 h-3.5" />}
          iconColorClass="text-brand-400"
        />
        <KpiCard
          title="Aged 60+ Risk"
          value={`${kpiStrip.aged60Units} units`}
          subtext={`$${(kpiStrip.aged60Cost / 1000).toFixed(0)}k tied up (60d+)`}
          icon={<AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
          variant="amber"
        />
        <KpiCard
          title="Aged 90+ Wholesale"
          value={`${kpiStrip.aged90Units} units`}
          subtext={`$${(kpiStrip.aged90Cost / 1000).toFixed(0)}k wholesale target`}
          icon={<ShieldAlert className="w-3.5 h-3.5 text-red-400" />}
          variant="red"
        />
        <KpiCard
          title="Floorplan Financed"
          value={`$${(kpiStrip.floorplanExposure / 1000000).toFixed(2)}M`}
          subtext={`Holding: ~$${kpiStrip.holdingCostToday.toLocaleString()}/day`}
          icon={<Layers className="w-3.5 h-3.5" />}
          iconColorClass="text-purple-400"
        />
        <KpiCard
          title="Frontline Ready"
          value={`${kpiStrip.frontlinePercent}%`}
          subtext={`${kpiStrip.frontlineReadyUnits} of ${kpiStrip.totalUnits} ready to sell`}
          icon={<TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
          variant="emerald"
        />
      </div>

      {/* Rooftop Heatmap Table */}
      <div className="rounded-xl border border-surface-border bg-surface-card overflow-hidden">
        <div className="p-4 border-b border-surface-border flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">
              Rooftop Capital & Aging Heatmap
            </h2>
            <p className="text-xs text-slate-400">All {rooftopStats.length} active dealerships ranked by aging exposure and capital</p>
          </div>
          <span className="text-[11px] text-slate-400">Click any rooftop to drill into GM Lot View</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-surface-border bg-surface-elevated text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                <th className="py-3 px-4">Dealership Rooftop</th>
                <th className="py-3 px-4">Cluster</th>
                <th className="py-3 px-3 text-right">Units</th>
                <th className="py-3 px-3 text-right">Total Stock Cost</th>
                <th className="py-3 px-3 text-center">Avg DIS</th>
                <th className="py-3 px-3 text-center">Aged 60+ %</th>
                <th className="py-3 px-4 text-center">Aging Distribution (0-30 to 90+)</th>
                <th className="py-3 px-3 text-center">Frontline %</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border font-medium">
              {rooftopStats.map((r) => {
                const isHighRisk = r.aged60Percent > 35;
                const progressItems = [
                  { percentage: (r.buckets['0-30'] / r.totalUnits) * 100, colorClass: 'bg-emerald-500', title: `0-30d: ${r.buckets['0-30']} units` },
                  { percentage: (r.buckets['31-45'] / r.totalUnits) * 100, colorClass: 'bg-blue-500', title: `31-45d: ${r.buckets['31-45']} units` },
                  { percentage: (r.buckets['46-60'] / r.totalUnits) * 100, colorClass: 'bg-amber-500', title: `46-60d: ${r.buckets['46-60']} units` },
                  { percentage: (r.buckets['61-90'] / r.totalUnits) * 100, colorClass: 'bg-orange-500', title: `61-90d: ${r.buckets['61-90']} units` },
                  { percentage: (r.buckets['90+'] / r.totalUnits) * 100, colorClass: 'bg-red-500', title: `90+d: ${r.buckets['90+']} units` },
                ];

                return (
                  <tr 
                    key={r.rooftopId}
                    onClick={() => onDrillToRooftop(r.rooftopId)}
                    className="hover:bg-surface-elevated/70 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        {r.name}
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-elevated text-slate-400 font-mono">
                          {r.franchise}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDrillToCluster(r.clusterId);
                        }}
                        className="text-xs text-brand-400 hover:underline text-left"
                      >
                        {r.clusterName}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-200">
                      {r.totalUnits}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-200">
                      ${(r.totalCost / 1000).toFixed(0)}k
                    </td>
                    <td className="py-3 px-3 text-center font-mono">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        r.avgDis > 55 ? 'bg-red-500/20 text-red-400' :
                        r.avgDis > 40 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {r.avgDis}d
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono">
                      <span className={`font-bold ${isHighRisk ? 'text-red-400' : 'text-slate-300'}`}>
                        {r.aged60Percent}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <ProgressBar items={progressItems} className="w-48 border border-surface-border" />
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold">
                      <span className={r.frontlineReadyPercent > 70 ? 'text-emerald-400' : 'text-amber-400'}>
                        {r.frontlineReadyPercent}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={() => onDrillToRooftop(r.rooftopId)}
                        className="px-2.5 py-1 rounded bg-surface-elevated hover:bg-brand-600 text-[11px] text-slate-300 hover:text-white transition-colors flex items-center gap-1 mx-auto"
                      >
                        <span>Drill GM</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Grid: Group Action Queue & Portfolio Mix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Group Action Queue (2 cols) */}
        <div className="lg:col-span-2 rounded-xl border border-surface-border bg-surface-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-brand-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Group Action Queue (Top 10 High Impact)
              </h2>
            </div>
            <span className="text-xs text-slate-400">Deterministic Rules Generated</span>
          </div>

          <div className="space-y-2.5">
            {groupActionQueue.map((action) => (
              <div
                key={action.vin}
                onClick={() => onOpenUnit(action.vin)}
                className="p-3 rounded-lg bg-surface-elevated border border-surface-border hover:border-brand-500/50 transition-colors cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <Badge label={action.actionType} variant={action.actionType as any} />
                  <div>
                    <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                      {action.vehicleTitle}
                      <span className="text-[10px] font-normal text-slate-400 font-mono">#{action.stockNumber}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span>{action.rooftopName}</span>
                      {action.targetRooftopName && (
                        <>
                          <ArrowRightLeft className="w-3 h-3 text-brand-400" />
                          <span className="text-brand-300 font-semibold">{action.targetRooftopName}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-semibold text-amber-400">{action.impactMetric}</div>
                  <div className="text-[10px] text-slate-400 max-w-xs truncate">{action.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Category & Brand Mix (1 col) */}
        <div className="rounded-xl border border-surface-border bg-surface-card p-5 space-y-5">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Inventory Category Mix
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Used Vehicles</span>
                <span className="font-mono font-bold text-purple-400">{categoryMix.Used} units</span>
              </div>
              <ProgressBar items={[{ percentage: (categoryMix.Used / kpiStrip.totalUnits) * 100, colorClass: 'bg-purple-500' }]} />

              <div className="flex justify-between text-slate-300 pt-1">
                <span>New Vehicles</span>
                <span className="font-mono font-bold text-emerald-400">{categoryMix.New} units</span>
              </div>
              <ProgressBar items={[{ percentage: (categoryMix.New / kpiStrip.totalUnits) * 100, colorClass: 'bg-emerald-500' }]} />

              <div className="flex justify-between text-slate-300 pt-1">
                <span>Demo Units</span>
                <span className="font-mono font-bold text-blue-400">{categoryMix.Demo} units</span>
              </div>
              <ProgressBar items={[{ percentage: (categoryMix.Demo / kpiStrip.totalUnits) * 100, colorClass: 'bg-blue-500' }]} />
            </div>
          </div>

          <div className="border-t border-surface-border pt-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Brand Concentration
            </h2>
            <div className="space-y-2">
              {Object.entries(brandMix).map(([brand, count]) => (
                <div key={brand} className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">{brand}</span>
                  <span className="font-mono text-slate-100 font-bold">{count} units</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
