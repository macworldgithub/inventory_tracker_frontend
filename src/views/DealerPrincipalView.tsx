import React, { useEffect, useState } from "react";
import { DealerPrincipalData } from "../types";
import { api } from "../api";
import { Users, ChevronDown, Flame, ChevronRight } from "lucide-react";
import { Pagination } from "../components/ui/Pagination";
import { usePagination } from "../components/ui/usePagination";

interface DealerPrincipalViewProps {
  initialClusterId?: string;
  onOpenUnit: (vin: string) => void;
  onDrillToRooftop: (rooftopId: string) => void;
}

import { useAuth } from "../context/AuthContext";

export const DealerPrincipalView: React.FC<DealerPrincipalViewProps> = ({
  initialClusterId = "cluster-hyundai-metro",
  onOpenUnit,
  onDrillToRooftop,
}) => {
  const { filterClusters, currentUser } = useAuth();
  const [clusterId, setClusterId] = useState(initialClusterId);
  const [data, setData] = useState<DealerPrincipalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [watchlistPage, setWatchlistPage] = useState(1);
  const [watchlistLimit, setWatchlistLimit] = useState(5);

  const rawClusterOptions = [
    {
      id: "cluster-hyundai-metro",
      name: "Booran Hyundai Metro Cluster (Cranbourne, Berwick, South Morang)",
    },
    {
      id: "cluster-bayside-kia",
      name: "Booran Bayside Kia Cluster (Cheltenham Kia)",
    },
  ];

  const clusterOptions = filterClusters(rawClusterOptions);

  useEffect(() => {
    if (initialClusterId) {
      setClusterId(initialClusterId);
    }
  }, [initialClusterId]);

  useEffect(() => {
    if (
      clusterOptions.length > 0 &&
      !clusterOptions.some((c) => c.id === clusterId)
    ) {
      setClusterId(clusterOptions[0].id);
    }
  }, [currentUser]);

  useEffect(() => {
    setWatchlistPage(1);
  }, [clusterId]);

  useEffect(() => {
    setLoading(true);
    api
      .getDealerPrincipalCluster(clusterId, {
        page: watchlistPage,
        limit: watchlistLimit,
      })
      .then(setData)
      .finally(() => setLoading(false));
  }, [clusterId, watchlistPage, watchlistLimit]);

  const comparisonPagination = usePagination(data?.comparisonTable || [], 5);

  if (loading || !data) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="animate-spin w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full mx-auto mb-3" />
        Loading Dealer Principal Cluster Dashboard...
      </div>
    );
  }

  const { kpiStrip, agingWaterfall } = data;
  const watchlistPagination = data.watchlistPagination ?? {
    total: data.watchlist.length,
    page: watchlistPage,
    limit: watchlistLimit,
    totalPages: Math.max(1, Math.ceil(data.watchlist.length / watchlistLimit)),
  };
  const displayedWatchlist = data.watchlistPagination
    ? data.watchlist
    : data.watchlist.slice(
        (watchlistPage - 1) * watchlistLimit,
        watchlistPage * watchlistLimit,
      );

  return (
    <div className="space-y-6 pb-12">
      {/* Cluster Header & Selector */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-1">
            Dealer Principal: {data.dpName}
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5 flex-wrap">
            <Users className="w-6 h-6 text-brand-400" />
            {data.clusterName}
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-relaxed">
            Cluster accountability view: side-by-side rooftop coaching, capital
            velocity, and aged stock reduction
          </p>
        </div>

        {/* Cluster Filter Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="text-xs text-slate-400 font-medium whitespace-nowrap">
            Cluster:
          </label>
          <div className="relative flex-1 md:flex-none">
            <select
              value={clusterId}
              onChange={(e) => setClusterId(e.target.value)}
              className="appearance-none w-full md:w-auto bg-surface-card border border-surface-border text-xs text-slate-200 py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:border-brand-500 font-semibold cursor-pointer"
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

      {/* Cluster Executive KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl glass-card border border-surface-border">
          <div className="text-xs text-slate-400 font-medium">
            CLUSTER TOTAL STOCK COST
          </div>
          <div className="text-2xl font-black font-mono text-white mt-1">
            ${(kpiStrip.totalCost / 1000000).toFixed(1)}M
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {kpiStrip.totalUnits} total units on hand
          </div>
        </div>

        <div className="p-4 rounded-xl glass-card border border-amber-500/20 bg-amber-500/5">
          <div className="text-xs text-amber-300 font-medium">
            AGED 45+ DAYS UNITS
          </div>
          <div className="text-2xl font-black font-mono text-amber-400 mt-1">
            {kpiStrip.aged45Count}{" "}
            <span className="text-xs font-normal text-amber-300">units</span>
          </div>
          <div className="text-[11px] text-amber-300/80 mt-1 font-semibold">
            {kpiStrip.totalUnits
              ? Math.round((kpiStrip.aged45Count / kpiStrip.totalUnits) * 100)
              : 0}
            % of cluster capital bound
          </div>
        </div>

        <div className="p-4 rounded-xl glass-card border border-red-500/20 bg-red-500/5">
          <div className="text-xs text-red-300 font-medium">
            AVERAGE CLUSTER DIS
          </div>
          <div className="text-2xl font-black font-mono text-red-400 mt-1">
            {kpiStrip.avgDis} days
          </div>
          <div className="text-[11px] text-red-300/80 mt-1 font-mono">
            {kpiStrip.reservedUnits} reserved · {kpiStrip.demoUnits} demo
          </div>
        </div>

        <div className="p-4 rounded-xl glass-card border border-emerald-500/20 bg-emerald-500/5">
          <div className="text-xs text-emerald-300 font-medium font-mono">
            POTENTIAL GROSS MARGIN
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
            ${(kpiStrip.potentialGross / 1000).toFixed(0)}k
          </div>
          <div className="text-[11px] text-emerald-300/80 mt-1">
            Across all active stock
          </div>
        </div>
      </div>

      {/* Rooftop Performance Comparison Table */}
      <div className="rounded-xl border border-surface-border bg-surface-card overflow-hidden">
        <div className="p-4 border-b border-surface-border flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Cluster Rooftop Performance Matrix
            </h2>
            <p className="text-xs text-slate-400">
              Benchmarking GMs side-by-side across capital velocity & recon
              speed
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {data.comparisonTable.length} Dealerships
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-surface-border bg-surface-elevated text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                <th className="py-3 px-4">Dealership Rooftop</th>
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
              {comparisonPagination.paginatedItems.map((r) => (
                <tr
                  key={r.rooftopId}
                  className="hover:bg-surface-elevated/70 transition-colors"
                >
                  <td className="py-3 px-4 font-bold text-white">
                    {r.rooftopName}
                  </td>
                  <td className="py-3 px-4 text-slate-300">{r.gmName}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-200">
                    {r.totalUnits}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-200">
                    ${(r.totalCost / 1000).toFixed(0)}k
                  </td>
                  <td className="py-3 px-3 text-center font-mono">
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        r.avgDis > 50
                          ? "bg-red-500/20 text-red-400"
                          : r.avgDis > 35
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      {r.avgDis}d
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-emerald-400 font-bold">
                    {r.turnRate}x
                  </td>
                  <td className="py-3 px-3 text-center font-mono">
                    <span
                      className={
                        r.aged45Percent > 30
                          ? "text-red-400 font-bold"
                          : "text-slate-300"
                      }
                    >
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

        <Pagination
          currentPage={comparisonPagination.currentPage}
          totalPages={comparisonPagination.totalPages}
          totalItems={comparisonPagination.totalItems}
          pageSize={comparisonPagination.pageSize}
          onPageChange={comparisonPagination.setCurrentPage}
          onPageSizeChange={comparisonPagination.setPageSize}
          pageSizeOptions={[5, 10, 20]}
        />
      </div>

      {/* Cluster Aging Waterfall & Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Aging Waterfall (1 col) */}
        <div className="rounded-xl border border-surface-border bg-surface-card p-5 space-y-4">
          <div className="border-b border-surface-border pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Cluster Aging Waterfall
            </h2>
            <p className="text-xs text-slate-400">
              Units & capital tied up per aging bucket
            </p>
          </div>

          <div className="space-y-3">
            {agingWaterfall.map((bucket) => {
              const maxCost =
                Math.max(...agingWaterfall.map((b) => b.cost)) || 1;
              const barWidth = Math.max(
                8,
                Math.round((bucket.cost / maxCost) * 100),
              );

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
                        bucket.bucket.includes("90+")
                          ? "bg-red-500"
                          : bucket.bucket.includes("61-90")
                            ? "bg-orange-500"
                            : bucket.bucket.includes("46-60")
                              ? "bg-amber-500"
                              : bucket.bucket.includes("31-45")
                                ? "bg-blue-500"
                                : "bg-emerald-500"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Watchlist: Worst Units by DIS x Cost */}
        <div className="lg:col-span-2 rounded-xl border border-surface-border bg-surface-card p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-400" />
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Capital Risk Watchlist
                  </h2>
                  <p className="text-xs text-slate-400">
                    Ranked by DIS × Total Stock Cost (Maximum Holding Burn)
                  </p>
                </div>
              </div>
              <span className="text-xs text-slate-400">
                Click unit to view intelligence drawer
              </span>
            </div>

            <div className="space-y-2">
              {displayedWatchlist.map((unit, index) => {
                const globalIndex =
                  (watchlistPagination.page - 1) * watchlistPagination.limit +
                  index +
                  1;
                return (
                  <div
                    key={unit.vin || `watchlist-${index}`}
                    onClick={() => unit.vin && onOpenUnit(unit.vin)}
                    className="p-3 sm:p-2.5 rounded-xl sm:rounded-lg bg-surface-elevated border border-surface-border hover:border-brand-500/50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3 text-xs"
                  >
                    <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0">
                      <span className="w-5 text-center font-bold text-slate-400 text-xs font-mono shrink-0 mt-0.5 sm:mt-0">
                        #{globalIndex}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-white flex flex-wrap items-center gap-1.5 leading-snug">
                          <span>{unit.title}</span>
                          <span className="text-[10px] font-mono text-slate-400">
                            #{unit.stockNumber}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {unit.rooftopName} ·{" "}
                          <span className="font-semibold text-purple-400">
                            {unit.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 sm:gap-4 pt-2 sm:pt-0 border-t border-surface-border/50 sm:border-0">
                      <div>
                        <div className="font-mono font-bold text-slate-200">
                          ${unit.totalStockCost.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          What it owes
                        </div>
                      </div>

                      <div>
                        <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-red-500/20 text-red-400">
                          {unit.daysInStock} DIS
                        </span>
                        <div className="text-[10px] text-red-400 font-mono mt-0.5">
                          -${unit.accumulatedHoldingCost.toLocaleString()} held
                        </div>
                      </div>

                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                        {unit.recommendedAction}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Pagination
            currentPage={watchlistPagination.page}
            totalPages={watchlistPagination.totalPages}
            totalItems={watchlistPagination.total}
            pageSize={watchlistPagination.limit}
            onPageChange={setWatchlistPage}
            onPageSizeChange={(pageSize) => {
              setWatchlistLimit(pageSize);
              setWatchlistPage(1);
            }}
            pageSizeOptions={[5, 10, 15, 20]}
            className="rounded-b-lg border-t mt-4"
          />
        </div>
      </div>
    </div>
  );
};
