import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Layers, ChevronRight, ExternalLink } from 'lucide-react';
import { MOCK_EGIS_DETAILS } from '@/mocks/sems-data';
import { ValidityBadge } from '@/components/shared/validity-badge';
import { CurrencyDisplay } from '@/components/shared/currency-display';

export const EgisListPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = MOCK_EGIS_DETAILS.filter((e) =>
    e.egisId.toLowerCase().includes(search.toLowerCase()) ||
    e.projectName.toLowerCase().includes(search.toLowerCase()) ||
    (e.aliasName && e.aliasName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            EGIS Master Registry
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Every EGIS ID represents a distinct quotation package, factory origin, or currency option.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-border bg-card shadow-sm">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search EGIS ID, Project name..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted text-muted-foreground uppercase font-semibold border-b border-border">
              <tr>
                <th className="py-3 px-4">EGIS ID</th>
                <th className="py-3 px-4">Project / Code</th>
                <th className="py-3 px-4">Package / Alias</th>
                <th className="py-3 px-4">Origin / Port</th>
                <th className="py-3 px-4">Latest SEQ</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">EGIS Validity</th>
                <th className="py-3 px-4">Price Validity</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((egis) => (
                <tr
                  key={egis.id}
                  onClick={() => navigate(`/egis/${egis.egisId}`)}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-primary text-sm">
                    {egis.egisId}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-foreground">{egis.projectName}</span>
                    <span className="block text-[11px] font-mono text-muted-foreground">
                      {egis.projectCode}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-foreground">
                    {egis.aliasName || '—'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span>{egis.production}</span>
                    <span className="block text-[11px] text-muted-foreground">{egis.port}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold">
                    SEQ 00{egis.currentSeqNumber}
                  </td>
                  <td className="py-3.5 px-4 font-medium">
                    <CurrencyDisplay amount={egis.latestPrice} currency={egis.currency} />
                  </td>
                  <td className="py-3.5 px-4">
                    {egis.egisValidity && <ValidityBadge validity={egis.egisValidity} type="EGIS" size="sm" />}
                  </td>
                  <td className="py-3.5 px-4">
                    {egis.priceValidity && <ValidityBadge validity={egis.priceValidity} type="Price" size="sm" />}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center text-primary font-semibold hover:underline">
                      Detail <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </span>
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
