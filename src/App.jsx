import { useEffect, useState } from 'react';
import Login from './components/Login.jsx';
import Sidebar from './components/Sidebar.jsx';
import Overview from './components/Overview.jsx';
import EnquiryList from './components/EnquiryList.jsx';
import EnquiryDetail from './components/EnquiryDetail.jsx';
import ProjectsView from './components/ProjectsView.jsx';
import { LEADS, SEED_PROJECTS } from './data.js';

const AKEY = 'gv-admin-auth-v1';
const PKEY = 'gv-admin-projects-v1';

function loadAuth() {
  try {
    const a = localStorage.getItem(AKEY);
    if (a) return JSON.parse(a).email || '';
  } catch (e) { /* ignore corrupt storage */ }
  return null;
}

function loadProjects() {
  try {
    const p = localStorage.getItem(PKEY);
    if (p) return JSON.parse(p);
  } catch (e) { /* ignore corrupt storage */ }
  return SEED_PROJECTS;
}

function countsFor(projects) {
  const rowsFor = (key) => {
    if (key === 'customers') return LEADS.filter((l) => l.type === 'Customer' && l.completed).length;
    if (key === 'abandoned') return LEADS.filter((l) => l.type === 'Customer' && !l.completed).length;
    if (key === 'agents') return LEADS.filter((l) => l.type === 'Agent').length;
    if (key === 'investors') return LEADS.filter((l) => l.type === 'Investor').length;
    if (key === 'careers') return LEADS.filter((l) => l.type === 'Career').length;
    return LEADS.length;
  };
  return {
    all: rowsFor('all'), customers: rowsFor('customers'), agents: rowsFor('agents'),
    investors: rowsFor('investors'), careers: rowsFor('careers'), abandoned: rowsFor('abandoned'),
    projects: projects.length
  };
}

export default function App() {
  const [email, setEmail] = useState(loadAuth() || '');
  const [authed, setAuthed] = useState(() => loadAuth() !== null);
  const [overview, setOverview] = useState(true);
  const [view, setView] = useState('all');
  const [openId, setOpenId] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const [projects, setProjects] = useState(loadProjects);

  useEffect(() => {
    try { localStorage.setItem(PKEY, JSON.stringify(projects)); } catch (e) { /* storage unavailable */ }
  }, [projects]);

  const signIn = (signedInEmail) => {
    try { localStorage.setItem(AKEY, JSON.stringify({ email: signedInEmail })); } catch (e) { /* storage unavailable */ }
    setEmail(signedInEmail);
    setAuthed(true);
  };

  const signOut = () => {
    try { localStorage.removeItem(AKEY); } catch (e) { /* storage unavailable */ }
    setAuthed(false);
    setOpenId(null);
  };

  const goOverview = () => { setOverview(true); setOpenId(null); setNavOpen(false); };
  const goView = (key) => { setOverview(false); setView(key); setOpenId(null); setNavOpen(false); };

  if (!authed) return <Login onSignIn={signIn} />;

  const showDetail = !overview && !!openId;
  const showProjects = !overview && view === 'projects';
  const showList = !overview && view !== 'projects' && !openId;

  return (
    <div className="gv-shell">
      {navOpen && <div className={'gv-overlay' + (navOpen ? ' gv-open' : '')} onClick={() => setNavOpen(false)} />}

      <Sidebar
        navOpen={navOpen}
        onClose={() => setNavOpen(false)}
        overview={overview}
        view={view}
        hasOpenRecord={!!openId}
        counts={countsFor(projects)}
        onGoOverview={goOverview}
        onGoView={goView}
        adminEmail={email || 'admin@gavikina.com'}
        onSignOut={signOut}
      />

      <main className="gv-main">
        <div className="gv-topbar">
          <button type="button" className="gv-hamburger" aria-label="Open menu" onClick={() => setNavOpen(true)}>☰</button>
          <span style={{ fontSize: 14.5, fontWeight: 600, color: '#14375E', letterSpacing: '-.01em' }}>Gavikina Admin</span>
        </div>

        {overview && <Overview />}
        {showList && <EnquiryList view={view} onOpen={setOpenId} />}
        {showDetail && <EnquiryDetail view={view} id={openId} onClose={() => setOpenId(null)} />}
        {showProjects && <ProjectsView projects={projects} setProjects={setProjects} />}
      </main>
    </div>
  );
}
