import React, { useEffect, useState } from "react";
import { GroupOverviewData } from "../types";
import { api } from "../api";
import {
  Building2,
  ArrowRightLeft,
  DollarSign,
  Package,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { KpiCard } from "../components/ui/KpiCard";
import { Badge } from "../components/ui/Badge";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Pagination } from "../components/ui/Pagination";
import { usePagination } from "../components/ui/usePagination";

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
    api
      .getGroupOverview()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const rooftopPagination = usePagination(data?.rooftopStats || [], 5);
  const actionPagination = usePagination(data?.groupActionQueue || [], 5);

  if (loading || !data) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="animate-spin w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full mx-auto mb-3" />
        Loading Group Ownership Command Centre...
      </div>
    );
  }

  const { kpiStrip, categoryMix, brandMix } = data;
  const aged60Percent = kpiStrip.totalUnits
    ? Math.round((kpiStrip.aged60Units / kpiStrip.totalUnits) * 100)
    : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* View Title */}
      <PageHeader
        title="Group Ownership Command Centre"
        subtitle="Executive oversight across all Booran Motor Group rooftops, capital allocation & exception dispatch"
        icon={<Building2 className="w-6 h-6 text-brand-400" />}
      />

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Total Group Stock"
          value={`${kpiStrip.totalUnits} units`}
          subtext={`$${(kpiStrip.totalStockCost / 1000000).toFixed(1)}M Total Cost`}
          icon={<Package className="w-4 h-4" />}
        />
        <KpiCard
          title="Aged 60+ Capital"
          value={`$${(kpiStrip.aged60Cost / 1000000).toFixed(1)}M`}
          subtext={`${kpiStrip.aged60Units} units (${aged60Percent}%)`}
          variant={aged60Percent > 15 ? "red" : "amber"}
          icon={<ShieldAlert className="w-4 h-4" />}
        />
        <KpiCard
          title="Daily Capital Holding Cost"
          value={`$${kpiStrip.holdingCostToday.toLocaleString()}/day`}
          subtext="Based on group WACC + Floorplan"
          variant="amber"
          icon={<DollarSign className="w-4 h-4" />}
        />
        <KpiCard
          title="Frontline Ready"
          value={`${kpiStrip.frontlinePercent}%`}
          subtext={`${kpiStrip.frontlineReadyUnits} Ready Units`}
          variant={kpiStrip.frontlinePercent > 70 ? "emerald" : "default"}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <KpiCard
          title="Inter-Rooftop Transfers"
          value={`${kpiStrip.deltas.transfers} units`}
          subtext="Transferred last period"
          icon={<ArrowRightLeft className="w-4 h-4" />}
        />
        <KpiCard
          title="Potential Retail Gross"
          value={`$${(kpiStrip.potentialGrossTotal / 1000000).toFixed(1)}M`}
          subtext="Group Margin Spread Buffer"
          variant="emerald"
          icon={<AlertTriangle className="w-4 h-4" />}
        />
      </div>

      {/* Rooftop Heatmap Table */}
      <div className="rounded-xl border border-surface-border bg-surface-card overflow-hidden space-y-0">
        <div className="p-4 border-b border-surface-border flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Rooftop Performance & Health Heatmap
            </h2>
            <p className="text-xs text-slate-400">
              Live operational overview by dealership rooftop
            </p>
          </div>
          <span className="text-xs font-mono text-brand-400 font-semibold">
            {data.rooftopStats.length} Active Dealerships
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-surface-border bg-surface-elevated text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                <th className="py-3 px-4">Rooftop / Franchise</th>
                <th className="py-3 px-4">Cluster</th>
                <th className="py-3 px-3 text-right">Units</th>
                <th className="py-3 px-3 text-right">Stock Cost</th>
                <th className="py-3 px-3 text-center">Avg DIS</th>
                <th className="py-3 px-3 text-center">Aged 60+ %</th>
                <th className="py-3 px-4">Aging Buckets Breakdown</th>
                <th className="py-3 px-3 text-center">Frontline %</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border font-medium">
              {rooftopPagination.paginatedItems.map((r) => {
                const totalU = r.totalUnits || 1;
                const progressItems = [
                  {
                    percentage: ((r.buckets["0-30"] || 0) / totalU) * 100,
                    colorClass: "bg-emerald-500",
                  },
                  {
                    percentage:
                      (((r.buckets["31-45"] || 0) + (r.buckets["46-60"] || 0)) /
                        totalU) *
                      100,
                    colorClass: "bg-blue-500",
                  },
                  {
                    percentage:
                      (((r.buckets["61-90"] || 0) + (r.buckets["90+"] || 0)) /
                        totalU) *
                      100,
                    colorClass: "bg-red-500",
                  },
                ];

                const isHighRisk = r.aged60Percent > 15;

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
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          r.avgDis > 55
                            ? "bg-red-500/20 text-red-400"
                            : r.avgDis > 40
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-emerald-500/20 text-emerald-400"
                        }`}
                      >
                        {r.avgDis}d
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono">
                      <span
                        className={`font-bold ${isHighRisk ? "text-red-400" : "text-slate-300"}`}
                      >
                        {r.aged60Percent}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <ProgressBar
                        items={progressItems}
                        className="w-48 border border-surface-border"
                      />
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold">
                      <span
                        className={
                          r.frontlineReadyPercent > 70
                            ? "text-emerald-400"
                            : "text-amber-400"
                        }
                      >
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

        <Pagination
          currentPage={rooftopPagination.currentPage}
          totalPages={rooftopPagination.totalPages}
          totalItems={rooftopPagination.totalItems}
          pageSize={rooftopPagination.pageSize}
          onPageChange={rooftopPagination.setCurrentPage}
          onPageSizeChange={rooftopPagination.setPageSize}
          pageSizeOptions={[5, 10, 20]}
        />
      </div>

      {/* Two Column Grid: Group Action Queue & Portfolio Mix */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Group Action Queue (2 cols) */}
        <div className="lg:col-span-2 rounded-xl border border-surface-border bg-surface-card p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-brand-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Group Action Queue
                </h2>
              </div>
              <span className="text-xs text-slate-400">
                Deterministic Rules Generated
              </span>
            </div>

            <div className="space-y-2.5">
              {actionPagination.paginatedItems.map((action, idx) => (
                <div
                  key={action.vin || `action-${idx}`}
                  onClick={() => action.vin && onOpenUnit(action.vin)}
                  className="p-3 rounded-lg bg-surface-elevated border border-surface-border hover:border-brand-500/50 transition-colors cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      label={action.actionType}
                      variant={action.actionType as any}
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                        {action.vehicleTitle}
                        <span className="text-[10px] font-normal text-slate-400 font-mono">
                          #{action.stockNumber}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span>{action.rooftopName}</span>
                        {action.targetRooftopName && (
                          <>
                            <ArrowRightLeft className="w-3 h-3 text-brand-400" />
                            <span className="text-brand-300 font-semibold">
                              {action.targetRooftopName}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-semibold text-amber-400">
                      {action.impactMetric}
                    </div>
                    <div className="text-[10px] text-slate-400 max-w-xs truncate">
                      {action.reason}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Pagination
            currentPage={actionPagination.currentPage}
            totalPages={actionPagination.totalPages}
            totalItems={actionPagination.totalItems}
            pageSize={actionPagination.pageSize}
            onPageChange={actionPagination.setCurrentPage}
            onPageSizeChange={actionPagination.setPageSize}
            pageSizeOptions={[5, 10, 20]}
            className="rounded-b-lg border-t mt-4"
          />
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
                <span className="font-mono font-bold text-purple-400">
                  {categoryMix.Used || 0} units
                </span>
              </div>
              <ProgressBar
                items={[
                  {
                    percentage:
                      ((categoryMix.Used || 0) / kpiStrip.totalUnits) * 100,
                    colorClass: "bg-purple-500",
                  },
                ]}
              />

              <div className="flex justify-between text-slate-300 pt-1">
                <span>New Vehicles</span>
                <span className="font-mono font-bold text-emerald-400">
                  {categoryMix.New || 0} units
                </span>
              </div>
              <ProgressBar
                items={[
                  {
                    percentage:
                      ((categoryMix.New || 0) / kpiStrip.totalUnits) * 100,
                    colorClass: "bg-emerald-500",
                  },
                ]}
              />

              <div className="flex justify-between text-slate-300 pt-1">
                <span>Demo Units</span>
                <span className="font-mono font-bold text-blue-400">
                  {categoryMix.Demo || 0} units
                </span>
              </div>
              <ProgressBar
                items={[
                  {
                    percentage:
                      ((categoryMix.Demo || 0) / kpiStrip.totalUnits) * 100,
                    colorClass: "bg-blue-500",
                  },
                ]}
              />
            </div>
          </div>

          <div className="border-t border-surface-border pt-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Brand Concentration
            </h2>
            <div className="space-y-2">
              {Object.entries(brandMix || {}).map(([brand, count]) => (
                <div
                  key={brand}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-slate-300">{brand}</span>
                  <span className="font-mono text-slate-100 font-bold">
                    {count} units
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
