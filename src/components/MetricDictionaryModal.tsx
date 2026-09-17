import React from 'react';
import { X, BookOpen } from 'lucide-react';
import { Pagination } from './ui/Pagination';
import { usePagination } from './ui/usePagination';

interface MetricDictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MetricDictionaryModal: React.FC<MetricDictionaryModalProps> = ({ isOpen, onClose }) => {
  const metrics = [
    {
      term: 'Units on Hand',
      def: 'Active inventory not marked sold or exited as of the last successful twice-daily Pentana feed.',
      source: 'Pentana eraPower / EraNet'
    },
    {
      term: 'Frontline Ready',
      def: 'Available + Published Photos + Live Advertised Price + Not in Recon. Physically and digitally saleable right now.',
      source: 'Pentana + Website Feeds Reconciled'
    },
    {
      term: 'What it Owes / Stock Cost',
      def: 'Pentana vehicle acquisition cost including posted recon and extras. The exact commercial amount the unit owes Booran Motor Group. NEVER taken from website feeds.',
      source: 'Pentana DMS Commercial Ledger'
    },
    {
      term: 'Days in Stock (DIS)',
      def: 'Calendar days from the official date-in-stock in Pentana to the snapshot feed date. Not selling days.',
      source: 'Pentana Date in Stock'
    },
    {
      term: 'Aging Buckets',
      def: '0–30 days (Fresh) / 31–45 days / 46–60 days / 61–90 days (High Risk) / 90+ days (Critical Wholesale Exposure).',
      source: 'Standard Group BI Engine'
    },
    {
      term: 'Turn Rate (x)',
      def: 'Trailing 90-day retail exits ÷ average units on hand for the same rooftop or cluster scope.',
      source: '90-day Sales History'
    },
    {
      term: 'Holding Cost / Day',
      def: 'Configurable daily floorplan & capital proxy rate (default 0.03%/day) multiplied by Total Stock Cost.',
      source: 'Booran Group Treasury Policy'
    },
    {
      term: 'Floorplan Exposure',
      def: 'Stock cost of vehicles currently drawn on the bank floorplan facility.',
      source: 'Pentana Floorplan Flag'
    },
    {
      term: 'Potential Gross',
      def: 'Live advertised price minus total stock cost. Indicates retail margin buffer before deal packing.',
      source: 'Advertised Price – Stock Cost'
    },
    {
      term: 'Aged 60+ / 90+',
      def: 'Count and capital sum of units at or beyond threshold days. Primary executive risk and audit metric.',
      source: 'Executive Risk Metric'
    },
  ];

  const rules = [
    { code: 'PRICE', meaning: 'Gross spread below minimum safety margin ($800) OR aged >45 DIS with pricing buffer needing adjustment.' },
    { code: 'TRANSFER', meaning: 'Model deficit at sister rooftop with surplus aging stock at current rooftop.' },
    { code: 'WHOLESALE', meaning: 'Used inventory aged 90+ days requiring capital release and auction packing.' },
    { code: 'COMPLETE', meaning: 'Frontline exception: missing photos, unlisted price, or recon overdue past SLA.' },
    { code: 'HOLD', meaning: 'Fresh inventory under 14 days with high market turn rate. Protect full margin.' },
  ];

  const metricsPagination = usePagination(metrics, 4);
  const rulesPagination = usePagination(rules, 3);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0e1526] border border-surface-border rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-surface-border flex items-center justify-between bg-surface-card">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-brand-400" />
            <div>
              <h2 className="text-base font-bold text-white">Booran Metric Dictionary</h2>
              <p className="text-xs text-slate-400">Locked commercial definitions for group-to-lot alignment</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-surface-elevated">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Core Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {metricsPagination.paginatedItems.map((m) => (
                <div key={m.term} className="p-3 rounded-lg bg-surface-card border border-surface-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-brand-300 text-xs">{m.term}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{m.source}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{m.def}</p>
                </div>
              ))}
            </div>
            <Pagination
              currentPage={metricsPagination.currentPage}
              totalPages={metricsPagination.totalPages}
              totalItems={metricsPagination.totalItems}
              pageSize={metricsPagination.pageSize}
              onPageChange={metricsPagination.setCurrentPage}
              onPageSizeChange={metricsPagination.setPageSize}
              pageSizeOptions={[4, 6, 10]}
              className="mt-3 rounded-lg border border-surface-border"
            />
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Deterministic Action Rules</h3>
            <div className="space-y-2">
              {rulesPagination.paginatedItems.map((r) => (
                <div key={r.code} className="p-2.5 rounded-lg bg-surface-card border border-surface-border flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded bg-brand-500/20 text-brand-400 font-mono font-bold text-xs border border-brand-500/30">
                    {r.code}
                  </span>
                  <span className="text-slate-300">{r.meaning}</span>
                </div>
              ))}
            </div>
            <Pagination
              currentPage={rulesPagination.currentPage}
              totalPages={rulesPagination.totalPages}
              totalItems={rulesPagination.totalItems}
              pageSize={rulesPagination.pageSize}
              onPageChange={rulesPagination.setCurrentPage}
              onPageSizeChange={rulesPagination.setPageSize}
              pageSizeOptions={[3, 5]}
              className="mt-3 rounded-lg border border-surface-border"
            />
          </div>
        </div>

        <div className="p-4 border-t border-surface-border bg-surface-card flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-500 transition-colors text-xs"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
