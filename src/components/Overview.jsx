import { useMemo } from 'react';
import { LEADS, SIZE_TIERS, TODAY, ts } from '../data.js';

const TYPE_COLOR = { Customer: '#2E9E45', Agent: '#F5A623', Investor: '#14375E', Career: '#5A3E9B', Contact: 'rgba(20,55,94,.35)' };

export default function Overview() {
  const stats = useMemo(() => {
    const customers = LEADS.filter((l) => l.type === 'Customer');
    const done = customers.filter((l) => l.completed);
    const drop = customers.filter((l) => !l.completed);
    const rate = customers.length ? Math.round((done.length / customers.length) * 100) : 0;
    return [
      { label: 'Total enquiries', value: String(LEADS.length), note: 'Customers, agents, investors and contact form' },
      { label: 'Completed assessments', value: String(done.length), note: rate + '% of assessments started' },
      { label: 'Abandoned assessments', value: String(drop.length), note: 'Partial data captured' },
      { label: 'Agent applications', value: String(LEADS.filter((l) => l.type === 'Agent').length), note: 'Awaiting screening call' },
      { label: 'Investor enquiries', value: String(LEADS.filter((l) => l.type === 'Investor').length), note: 'Materials sent manually' },
      { label: 'Job applications', value: String(LEADS.filter((l) => l.type === 'Career').length), note: 'From the Careers page' }
    ];
  }, []);

  const typeBars = useMemo(() => ['Customer', 'Agent', 'Investor', 'Career', 'Contact'].map((t) => {
    const n = LEADS.filter((l) => l.type === t).length;
    const pct = Math.round((n / LEADS.length) * 100);
    return {
      label: t === 'Contact' ? 'Contact form' : t === 'Career' ? 'Job applications' : t + ' enquiries',
      count: n, share: pct, color: TYPE_COLOR[t]
    };
  }), []);

  const dayBars = useMemo(() => {
    const days = [14, 15, 16, 17, 18];
    const counts = days.map((d) => LEADS.filter((l) => Math.floor(ts(l.when) / 10000) === d).length);
    const max = Math.max(1, ...counts);
    return days.map((d, i) => ({ label: d + ' Aug', count: counts[i], max, isMax: counts[i] === max }));
  }, []);

  const sizeRows = useMemo(() => {
    const counts = SIZE_TIERS.map((n) => LEADS.filter((l) => l.size === n).length);
    const max = Math.max(1, ...counts);
    return SIZE_TIERS.map((n, i) => ({ size: n, count: counts[i], max }));
  }, []);

  return (
    <div className="gv-fade">
      <h1 className="gv-h1">Overview</h1>
      <p className="gv-note">All enquiries received through the site, tools and forms. Figures cover 14–18 August 2026.</p>

      <div className="gv-stats">
        {stats.map((k) => (
          <div className="gv-stat-card" key={k.label}>
            <span className="gv-stat-label">{k.label}</span>
            <div className="gv-stat-value">{k.value}</div>
            <span className="gv-stat-note">{k.note}</span>
          </div>
        ))}
      </div>

      <div className="gv-charts-row">
        <div className="gv-panel" style={{ flex: '1 1 380px', minWidth: 0 }}>
          <h2 className="gv-panel-h2">Enquiries by type</h2>
          <div style={{ marginTop: 18 }}>
            {typeBars.map((b) => (
              <div className="gv-bar-row" key={b.label}>
                <div className="gv-bar-row-head">
                  <span style={{ fontWeight: 500 }}>{b.label}</span>
                  <span style={{ color: 'rgba(20,55,94,.6)', fontVariantNumeric: 'tabular-nums' }}>{b.count} · {b.share}%</span>
                </div>
                <div className="gv-bar-track"><div className="gv-bar-fill" style={{ background: b.color, width: b.share + '%' }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="gv-panel" style={{ flex: '1 1 320px', minWidth: 0 }}>
          <h2 className="gv-panel-h2">Received per day</h2>
          <div className="gv-daybars">
            {dayBars.map((d) => (
              <div className="gv-daybar-col" key={d.label}>
                <span style={{ fontSize: 12.5, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{d.count}</span>
                <div className="gv-daybar" style={{ background: d.isMax ? '#2E9E45' : 'rgba(46,158,69,.42)', height: Math.max(4, (d.count / d.max) * 100) + '%' }} />
                <span style={{ fontSize: 11.5, color: 'rgba(20,55,94,.5)' }}>{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="gv-charts-row">
        <div className="gv-panel" style={{ flex: '1 1 380px', minWidth: 0 }}>
          <h2 className="gv-panel-h2">Sizes recommended</h2>
          <div style={{ marginTop: 16 }}>
            {sizeRows.map((r) => (
              <div className="gv-sizerow" key={r.size}>
                <span style={{ width: 70, fontWeight: 500 }}>{r.size}</span>
                <div className="gv-sizerow-track"><div className="gv-sizerow-fill" style={{ width: Math.round((r.count / r.max) * 100) + '%' }} /></div>
                <span style={{ width: 28, textAlign: 'right', color: 'rgba(20,55,94,.6)', fontVariantNumeric: 'tabular-nums' }}>{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
