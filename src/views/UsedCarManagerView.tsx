import React, { useEffect, useState } from "react";
import { WorkbenchData, Rooftop } from "../types";
import { api } from "../api";
import {
  SlidersHorizontal,
  Search,
  Download,
  Tag,
  AlertTriangle,
  CameraOff,
  Layers,
  ChevronDown,
  Image as ImageIcon,
  ArrowUpDown,
} from "lucide-react";
import { Pagination } from "../components/ui/Pagination";

interface UsedCarManagerViewProps {
  onOpenUnit: (vin: string) => void;
}

import { useAuth } from "../context/AuthContext";

export const UsedCarManagerView: React.FC<UsedCarManagerViewProps> = ({
  onOpenUnit,
}) => {
  const { filterRooftops, currentUser } = useAuth();
  const [rooftops, setRooftops] = useState<Rooftop[]>([]);
  const [data, setData] = useState<WorkbenchData | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [rooftopId, setRooftopId] = useState<string>(() => {
    if (currentUser.rooftopId) return currentUser.rooftopId;
    return "all";
  });
  const [agingBucket, setAgingBucket] = useState<string>("all");
  const [category, setCategory] = useState<string>("Used"); // Defaults to Used per SOW 4.0
  const [action, setAction] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [priceReviewOnly, setPriceReviewOnly] = useState<boolean>(false);

  const [sortField, setSortField] = useState<string>("daysInStock");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);

  useEffect(() => {
    if (currentUser.rooftopId) {
      setRooftopId(currentUser.rooftopId);
    }
  }, [currentUser]);

  useEffect(() => {
    api.getRooftops().then((list) => {
      const allowed = filterRooftops(list);
      setRooftops(allowed);
    });
  }, [currentUser]);

  const fetchWorkbench = () => {
    setLoading(true);
    api
      .getWorkbench({
        rooftopId,
        agingBucket,
        category,
        action,
        search,
        priceReviewOnly,
        sortField,
        sortOrder,
        page,
        limit,
      })
      .then(setData)
      .finally(() => setLoading(false));
  };

  // Reset page when filter inputs change
  const handleFilterChange = (setter: (val: any) => void, value: any) => {
    setter(value);
    setPage(1);
  };

  useEffect(() => {
    fetchWorkbench();
  }, [rooftopId, agingBucket, category, action, priceReviewOnly, sortField, sortOrder, page, limit]);

  const [exporting, setExporting] = useState<boolean>(false);

  // Handle Search Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWorkbench();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const exportToCSV = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      // Fetch full dataset for export matching current filters with high limit
      const fullData = await api.getWorkbench({
        rooftopId,
        agingBucket,
        category,
        action,
        search,
        priceReviewOnly,
        sortField,
        sortOrder,
        page: 1,
        limit: 5000,
      });

      const vehicles = fullData.vehicles || [];
      if (vehicles.length === 0) return;

      const headers = [
        'Stock #',
        'VIN',
        'Rego',
        'Year',
        'Make',
        'Model',
        'Description',
        'Category',
        'Rooftop',
        'What It Owes',
        'Advertised Price',
        'Potential Gross',
        'Days In Stock',
        'Aging Bucket',
        'Status',
        'Recommended Action',
        'Action Reason'
      ];

      const escapeCsvField = (val: any) => {
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      };

      const rows = vehicles.map(v => [
        escapeCsvField(v.stockNumber),
        escapeCsvField(v.vin),
        escapeCsvField(v.rego || ''),
        escapeCsvField(v.year),
        escapeCsvField(v.make),
        escapeCsvField(v.model),
        escapeCsvField(v.description || `${v.year} ${v.make} ${v.model}`),
        escapeCsvField(v.category),
        escapeCsvField(v.rooftopName),
        escapeCsvField(v.totalStockCost),
        escapeCsvField(v.advertisedPrice !== null ? v.advertisedPrice : 'UNLISTED'),
        escapeCsvField(v.potentialGross),
        escapeCsvField(v.daysInStock),
        escapeCsvField(v.agingBucket),
        escapeCsvField(v.status),
        escapeCsvField(v.recommendedAction),
        escapeCsvField(v.actionReason || '')
      ]);

      const csvString = [headers.map(escapeCsvField).join(','), ...rows.map(r => r.join(','))].join('\r\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Booran_Live_Inventory_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export CSV:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Multi-Lot Toolbar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5 flex-wrap">
            <SlidersHorizontal className="w-6 h-6 text-brand-400" />
            Used Car Manager Workbench
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-relaxed">
            Unit-level commercial workbench: what it owes vs retail spread,
            holding cost clock, and price review
          </p>
        </div>

        {/* Multi-lot scope selector & CSV export */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <select
              value={rooftopId}
              onChange={(e) => handleFilterChange(setRooftopId, e.target.value)}
              className="appearance-none w-full sm:w-auto bg-surface-card border border-surface-border text-xs text-slate-200 py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:border-brand-500 font-semibold cursor-pointer"
            >
              <option value="all">
                All Booran Dealership Lots ({rooftops.length})
              </option>
              {rooftops.map((r) => (
                <option key={r.rooftopId} value={r.rooftopId}>
                  {r.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={exportToCSV}
            disabled={exporting}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-card border border-surface-border text-xs text-slate-300 hover:text-white hover:bg-surface-elevated transition-colors font-medium disabled:opacity-50"
          >
            <Download className={`w-3.5 h-3.5 text-slate-400 ${exporting ? 'animate-bounce' : ''}`} />
            <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* Quick Action Rails */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 text-xs">
        <button
          onClick={() => {
            setPriceReviewOnly(!priceReviewOnly);
            setAction("all");
            setPage(1);
          }}
          className={`p-3 rounded-xl border text-left transition-all ${priceReviewOnly
            ? "bg-amber-500/20 border-amber-500 text-amber-300 ring-2 ring-amber-500/30"
            : "bg-surface-card border-surface-border text-slate-300 hover:border-amber-500/50"
            }`}
        >
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-amber-400" />
              Price Review Mode
            </span>
            <span className="font-mono text-amber-400">
              {data?.counters.priceReviewCount || 0}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Margin &lt; $800 or aged repricing</p>
        </button>

        <button
          onClick={() => {
            handleFilterChange(
              setAction,
              action === "COMPLETE" ? "all" : "COMPLETE",
            );
            setPriceReviewOnly(false);
          }}
          className={`p-3 rounded-xl border text-left transition-all ${action === "COMPLETE"
            ? "bg-purple-500/20 border-purple-500 text-purple-300 ring-2 ring-purple-500/30"
            : "bg-surface-card border-surface-border text-slate-300 hover:border-purple-500/50"
            }`}
        >
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5">
              <CameraOff className="w-4 h-4 text-purple-400" />
              Listing Exceptions
            </span>
            <span className="font-mono text-purple-400">
              {data?.counters.missingPhotosCount || 0}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Missing photos or unlisted price
          </p>
        </button>

        <button
          onClick={() => {
            handleFilterChange(
              setAction,
              action === "WHOLESALE" ? "all" : "WHOLESALE",
            );
            setPriceReviewOnly(false);
          }}
          className={`p-3 rounded-xl border text-left transition-all ${action === "WHOLESALE"
            ? "bg-red-500/20 border-red-500 text-red-300 ring-2 ring-red-500/30"
            : "bg-surface-card border-surface-border text-slate-300 hover:border-red-500/50"
            }`}
        >
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Wholesale Liquidation
            </span>
            <span className="font-mono text-red-400">
              {data?.counters.wholesaleQueueCount || 0}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Aged 90+ days used capital trap
          </p>
        </button>

        <div className="p-3 rounded-xl bg-surface-card border border-surface-border text-slate-300">
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-brand-400" />
              Total Active Filtered
            </span>
            <span className="font-mono text-brand-400">
              {data?.pagination.total || 0}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Across selected Booran lots
          </p>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="p-4 rounded-xl border border-surface-border bg-surface-card space-y-3">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          {/* Live Search */}
          <div className="relative w-full xl:flex-1 xl:min-w-[240px] xl:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search VIN, Stock #, Model, Rego..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-surface-elevated border border-surface-border text-xs text-slate-200 pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>

          <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-end xl:flex-wrap">
            {/* Aging Buckets Filter */}
            <div className="flex flex-wrap items-center gap-1 text-xs">
              <span className="text-slate-400 text-[11px] mr-1">Aging:</span>
              {(["all", "0-30", "31-45", "46-60", "61-90", "90+"] as const).map(
                (b) => (
                  <button
                    key={b}
                    onClick={() => handleFilterChange(setAgingBucket, b)}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${agingBucket === b
                      ? "bg-brand-600 text-white font-bold"
                      : "bg-surface-elevated text-slate-300 hover:text-white"
                      }`}
                  >
                    {b === "all" ? "All" : `${b}d`}
                  </button>
                ),
              )}
            </div>

            {/* Category Toggle */}
            <div className="flex flex-wrap items-center gap-1 text-xs">
              <span className="text-slate-400 text-[11px] mr-1">Category:</span>
              {(["All", "Used", "New", "Demo"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => handleFilterChange(setCategory, c)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${category === c
                    ? "bg-purple-600 text-white font-bold"
                    : "bg-surface-elevated text-slate-300 hover:text-white"
                    }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Action Filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 text-[11px] mr-1">Action:</span>
              <select
                value={action}
                onChange={(e) => handleFilterChange(setAction, e.target.value)}
                className="bg-surface-elevated border border-surface-border text-slate-200 text-xs py-1.5 px-2.5 rounded-lg focus:outline-none cursor-pointer"
              >
                <option value="all">All Actions</option>
                <option value="NONE">No Action (Clean)</option>
                <option value="PRICE">Reprice Required</option>
                <option value="WHOLESALE">Wholesale Queue</option>
                <option value="TRANSFER">Transfer Candidate</option>
                <option value="COMPLETE">Missing Merchandising</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Inventory Board Table */}
      <div className="rounded-xl border border-surface-border bg-surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-surface-border bg-surface-elevated text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                {/* <th className="py-3 px-3 text-center">Photo</th> */}
                <th className="py-3 px-4">Stock # / Rego</th>
                <th className="py-3 px-4">Vehicle Details</th>
                <th className="py-3 px-3">Rooftop</th>
                <th className="py-3 px-3 text-right">
                  <button
                    onClick={() => {
                      setSortField("totalStockCost");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                    className="flex items-center gap-1 justify-end hover:text-white ml-auto"
                  >
                    <span>What It Owes</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3 text-right">Advertised</th>
                <th className="py-3 px-3 text-right">Potential Gross</th>
                <th className="py-3 px-3 text-center">
                  <button
                    onClick={() => {
                      setSortField("daysInStock");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                    className="flex items-center gap-1 justify-center hover:text-white mx-auto"
                  >
                    <span>DIS</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border font-medium">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <div className="animate-spin w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full mx-auto mb-2" />
                    Updating inventory grid...
                  </td>
                </tr>
              ) : data?.vehicles.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    No vehicles found matching current filters.
                  </td>
                </tr>
              ) : (
                data?.vehicles.map((v) => {
                  const isMarginLow = v.potentialGross < 800;
                  const isAgedRisk = v.daysInStock > 60;

                  return (
                    <tr
                      key={v.vin}
                      onClick={() => onOpenUnit(v.vin)}
                      className="hover:bg-surface-elevated/70 cursor-pointer transition-colors"
                    >
                      {/* Photo Thumbnail */}
                      {/* <td className="py-2.5 px-3 text-center">
                        <div className="w-12 h-9 rounded overflow-hidden bg-black/60 mx-auto border border-surface-border flex items-center justify-center">
                          {v.heroPhoto ? (
                            <img src={v.heroPhoto} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-amber-500" />
                          )}
                        </div>
                      </td> */}

                      {/* Stock Number & Rego */}
                      <td className="py-2.5 px-4 font-mono">
                        <div className="font-bold text-slate-100">
                          #{v.stockNumber}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {v.rego || "No Rego"}
                        </div>
                      </td>

                      {/* Vehicle Description */}
                      <td className="py-2.5 px-4">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {v.year} {v.make} {v.model}
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded ${v.category === "New"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : v.category === "Demo"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-purple-500/20 text-purple-400"
                              }`}
                          >
                            {v.category}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {v.variant} · {v.odometer.toLocaleString()} km
                        </div>
                      </td>

                      {/* Rooftop */}
                      <td className="py-2.5 px-3 text-slate-300 text-xs truncate max-w-[140px]">
                        {v.rooftopName.replace("Booran ", "")}
                      </td>

                      {/* What It Owes */}
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-100">
                        ${v.totalStockCost.toLocaleString()}
                      </td>

                      {/* Advertised Price */}
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                        {v.advertisedPrice ? (
                          `$${v.advertisedPrice.toLocaleString()}`
                        ) : (
                          <span className="text-amber-400 text-[10px] uppercase font-bold">
                            Unlisted
                          </span>
                        )}
                      </td>

                      {/* Gross Spread */}
                      <td className="py-2.5 px-3 text-right font-mono font-bold">
                        {v.advertisedPrice ? (
                          <span
                            className={
                              isMarginLow
                                ? "text-amber-400"
                                : "text-emerald-400"
                            }
                          >
                            ${v.potentialGross.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>

                      {/* DIS */}
                      <td className="py-2.5 px-3 text-center font-mono">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-xs ${isAgedRisk
                            ? "bg-red-500/20 text-red-400"
                            : v.daysInStock > 40
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-surface-elevated text-slate-300"
                            }`}
                        >
                          {v.daysInStock}d
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${v.status === "Available"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : v.status === "In Recon"
                              ? "bg-blue-500/10 text-blue-400"
                              : v.status === "Reserved"
                                ? "bg-amber-500/10 text-amber-400"
                                : "bg-red-500/10 text-red-400"
                            }`}
                        >
                          {v.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-2.5 px-4 text-center">
                        {v.recommendedAction !== "NONE" ? (
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${v.recommendedAction === "WHOLESALE"
                              ? "bg-red-500/20 text-red-300 border-red-500/30"
                              : v.recommendedAction === "PRICE"
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                : v.recommendedAction === "TRANSFER"
                                  ? "bg-brand-500/20 text-brand-300 border-brand-500/30"
                                  : v.recommendedAction === "COMPLETE"
                                    ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                              }`}
                          >
                            {v.recommendedAction}
                          </span>
                        ) : (
                          <span className="text-slate-600 font-mono text-[11px]">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Unified Pagination Bar */}
        <Pagination
          currentPage={page}
          totalPages={data?.pagination.totalPages || 1}
          totalItems={data?.pagination.total || 0}
          pageSize={limit}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => {
            setLimit(newSize);
            setPage(1);
          }}
          pageSizeOptions={[10, 25, 50, 100]}
        />
      </div>
    </div>
  );
};
