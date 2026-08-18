const NAV_ENQUIRIES = [
  ['all', 'All enquiries'],
  ['customers', 'Customers'],
  ['agents', 'Agents'],
  ['investors', 'Investors'],
  ['careers', 'Job applications'],
  ['abandoned', 'Abandoned']
];

export default function Sidebar({ navOpen, onClose, overview, view, hasOpenRecord, counts, onGoOverview, onGoView, adminEmail, onSignOut }) {
  const navBtnClass = (active) => 'gv-nav-btn' + (active ? ' active' : '');

  return (
    <aside className={'gv-sidebar' + (navOpen ? ' gv-open' : '')}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <img src="/logo-primary-ondark.svg" alt="Gavikina Energy" style={{ height: 40, width: 'auto', display: 'block', margin: '6px 8px' }} />
        <button type="button" className="gv-close-btn" onClick={onClose} aria-label="Close menu">✕</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <button type="button" className={navBtnClass(overview)} onClick={onGoOverview}>Overview</button>

        <span className="gv-nav-section">Enquiries</span>
        {NAV_ENQUIRIES.map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={navBtnClass(!overview && view === key && !hasOpenRecord)}
            onClick={() => onGoView(key)}
          >
            {label}
            <span className="gv-nav-count">{counts[key] ?? 0}</span>
          </button>
        ))}

        <span className="gv-nav-section">Content</span>
        <button type="button" className={navBtnClass(!overview && view === 'projects')} onClick={() => onGoView('projects')}>
          Past Projects
          <span className="gv-nav-count">{counts.projects ?? 0}</span>
        </button>
      </div>

      <div className="gv-sidebar-foot">
        <span style={{ fontSize: 12.5, fontWeight: 500 }}>{adminEmail}</span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,.45)' }}>Administrator</span>
        <button type="button" className="gv-signout" onClick={onSignOut}>Sign out</button>
      </div>
    </aside>
  );
}
