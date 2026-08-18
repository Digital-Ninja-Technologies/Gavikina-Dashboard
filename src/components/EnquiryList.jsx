import { useMemo, useState } from 'react';
import { LEADS, VIEWS, TODAY, ts } from '../data.js';
import { csvFor, download, summaryOf, tagColors } from '../utils.js';

function rowsForView(view) {
  if (view === 'customers') return LEADS.filter((l) => l.type === 'Customer' && l.completed);
  if (view === 'abandoned') return LEADS.filter((l) => l.type === 'Customer' && !l.completed);
  if (view === 'agents') return LEADS.filter((l) => l.type === 'Agent');
  if (view === 'investors') return LEADS.filter((l) => l.type === 'Investor');
  if (view === 'careers') return LEADS.filter((l) => l.type === 'Career');
  return LEADS;
}

const TYPE_FILTERS = ['All types', 'Customer', 'Agent', 'Investor', 'Career', 'Contact'];

export default function EnquiryList({ view, onOpen }) {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All types');
  const [dateFilter, setDateFilter] = useState('All dates');
  const [sort, setSort] = useState('new');

  const unfiltered = useMemo(() => rowsForView(view), [view]);

  const dateOptions = useMemo(() => (
    ['All dates', 'Today', 'Yesterday', 'Last 3 days', 'Last 7 days']
      .concat([...new Set(unfiltered.map((l) => Math.floor(ts(l.when) / 10000)))].sort((a, b) => b - a).map((d) => d + ' Aug'))
  ), [unfiltered]);

  const rows = useMemo(() => {
    let list = unfiltered;
    if (view === 'all' && typeFilter !== 'All types') list = list.filter((l) => l.type === typeFilter);
    if (dateFilter !== 'All dates') {
      const day = (l) => Math.floor(ts(l.when) / 10000);
      if (dateFilter === 'Today') list = list.filter((l) => day(l) === TODAY);
      else if (dateFilter === 'Yesterday') list = list.filter((l) => day(l) === TODAY - 1);
      else if (dateFilter === 'Last 3 days') list = list.filter((l) => day(l) > TODAY - 3);
      else if (dateFilter === 'Last 7 days') list = list.filter((l) => day(l) > TODAY - 7);
      else { const d = parseInt(dateFilter, 10); list = list.filter((l) => day(l) === d); }
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((l) => [l.name, l.phone, l.email, l.area, l.size, l.occupation, l.role, l.property, l.reason, l.message, l.about]
        .filter(Boolean).join(' ').toLowerCase().indexOf(q) > -1);
    }
    const sorted = list.slice();
    if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
    else sorted.sort((a, b) => (sort === 'old' ? ts(a.when) - ts(b.when) : ts(b.when) - ts(a.when)));
    return sorted;
  }, [unfiltered, view, typeFilter, dateFilter, query, sort]);

  const filtersActive = !!(query.trim() || typeFilter !== 'All types' || dateFilter !== 'All dates' || sort !== 'new');
  const [title, note] = VIEWS[view] || VIEWS.all;

  const clearFilters = () => { setQuery(''); setTypeFilter('All types'); setDateFilter('All dates'); setSort('new'); };

  return (
    <div className="gv-fade">
      <div className="gv-page-head">
        <div>
          <h1 className="gv-h1">{title}</h1>
          <p className="gv-note">{note}</p>
        </div>
        <button type="button" className="gv-btn" onClick={() => download('gavikina-' + view + '.csv', csvFor(rows))}>Download CSV</button>
      </div>

      <div className="gv-filterbar">
        <div className="gv-search-wrap">
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, phone, email, area or size" />
          <span className="gv-search-icon">⌕</span>
        </div>

        {view === 'all' && (
          <div className="gv-chip-row">
            {TYPE_FILTERS.map((t) => {
              const count = t === 'All types' ? LEADS.length : LEADS.filter((l) => l.type === t).length;
              return (
                <button
                  key={t}
                  type="button"
                  className={'gv-chip' + (typeFilter === t ? ' active' : '')}
                  onClick={() => setTypeFilter(t)}
                >
                  {t === 'All types' ? 'All' : t === 'Career' ? 'Careers' : t + 's'}
                  <span style={{ opacity: .55, marginLeft: 6, fontVariantNumeric: 'tabular-nums' }}>{count}</span>
                </button>
              );
            })}
          </div>
        )}

        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
          {dateOptions.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="new">Newest first</option>
          <option value="old">Oldest first</option>
          <option value="name">Name A–Z</option>
        </select>
        {filtersActive && <button type="button" className="gv-btn" style={{ padding: '11px 15px', fontSize: 13 }} onClick={clearFilters}>Clear filters</button>}
      </div>

      <div className="gv-table-wrap">
        <div className="gv-table-head">
          <span>Type</span><span>Name</span><span>Contact</span><span>Summary</span><span>Received</span>
        </div>
        {rows.map((r) => {
          const [color, bg] = tagColors(r.type);
          return (
            <div className="gv-table-row" key={r.id} onClick={() => onOpen(r.id)}>
              <span className="gv-tag" style={{ color, background: bg }}>{r.type}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                <span className="gv-ellipsis" style={{ fontSize: 13.5, fontWeight: 500 }}>{r.name}</span>
                <span className="gv-ellipsis" style={{ fontSize: 11.5, color: 'rgba(20,55,94,.5)' }}>
                  {r.type === 'Customer' ? (r.property + ' · ' + (r.area || 'Area not given')) : (r.area || r.email || '')}
                </span>
              </div>
              <span className="gv-ellipsis" style={{ fontSize: 13, color: 'rgba(20,55,94,.72)', minWidth: 0 }}>{r.phone || r.email || r.contact || 'Not captured'}</span>
              <span className="gv-ellipsis" style={{ fontSize: 13, color: 'rgba(20,55,94,.72)', minWidth: 0 }}>{summaryOf(r)}</span>
              <span style={{ fontSize: 12.5, color: 'rgba(20,55,94,.55)', fontVariantNumeric: 'tabular-nums' }}>{r.when}</span>
            </div>
          );
        })}
        {rows.length === 0 && (
          <div className="gv-empty-row">{unfiltered.length === 0 ? 'Nothing in this view yet.' : 'No records match these filters.'}</div>
        )}
      </div>
      <p className="gv-list-footer">
        {rows.length === unfiltered.length
          ? rows.length + ' record' + (rows.length === 1 ? '' : 's') + ' · click a row for the full detail'
          : 'Showing ' + rows.length + ' of ' + unfiltered.length + ' records · CSV export follows the filters'}
      </p>
    </div>
  );
}
