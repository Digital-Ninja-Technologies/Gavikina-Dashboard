import { useState } from 'react';
import { SIZE_TIERS } from '../data.js';

function emptyDraft() {
  return { id: '', title: '', location: '', size: SIZE_TIERS[2], category: 'home', caseStudy: false, images: 0, body: '' };
}

export default function ProjectsView({ projects, setProjects }) {
  const [draft, setDraft] = useState(null);

  const saveProject = () => {
    if (!draft || !draft.title.trim() || !draft.location.trim()) return;
    setProjects((list) => (
      draft.id ? list.map((p) => (p.id === draft.id ? { ...draft } : p)) : list.concat([{ ...draft, id: 'p' + Date.now() }])
    ));
    setDraft(null);
  };

  const deleteProject = () => {
    setProjects((list) => list.filter((p) => p.id !== draft.id));
    setDraft(null);
  };

  const canSave = !!(draft && draft.title.trim() && draft.location.trim());

  return (
    <div className="gv-fade">
      <div className="gv-page-head">
        <div>
          <h1 className="gv-h1">Past Projects</h1>
          <p className="gv-note">Everything here appears on the public Past Projects page.</p>
        </div>
        <button type="button" className="gv-btn-primary" onClick={() => setDraft(emptyDraft())}>Add a project</button>
      </div>

      <div className="gv-projects-row">
        <div className="gv-project-list">
          {projects.map((p) => (
            <div
              key={p.id}
              className={'gv-project-item' + (draft && draft.id === p.id ? ' active' : '')}
              onClick={() => setDraft({ ...p })}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                <span className="gv-ellipsis" style={{ fontSize: 14, fontWeight: 500 }}>{p.title}</span>
                <span style={{ fontSize: 12, color: 'rgba(20,55,94,.55)' }}>
                  {p.location} · {p.size} · {p.category === 'home' ? 'Home' : 'Business'} · {p.images} photo{p.images === 1 ? '' : 's'}
                </span>
              </div>
              <span className="gv-flag" style={{ color: p.caseStudy ? '#14602A' : 'rgba(20,55,94,.55)', background: p.caseStudy ? 'rgba(46,158,69,.13)' : 'rgba(20,55,94,.06)' }}>
                {p.caseStudy ? 'Case study' : 'Listed'}
              </span>
            </div>
          ))}
        </div>

        {draft && (
          <div className="gv-project-form">
            <h2 className="gv-panel-h2" style={{ fontSize: 16 }}>{draft.id ? 'Edit project' : 'New project'}</h2>
            <div className="gv-project-form-fields">
              <label className="gv-field">
                <span className="gv-field-label" style={{ fontSize: 12 }}>Title</span>
                <input className="gv-input" type="text" value={draft.title} placeholder="Lekki Phase 1 duplex"
                  onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
              </label>
              <label className="gv-field">
                <span className="gv-field-label" style={{ fontSize: 12 }}>Location</span>
                <input className="gv-input" type="text" value={draft.location} placeholder="Lekki, Lagos"
                  onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))} />
              </label>
              <div className="gv-proj-grid">
                <label className="gv-field">
                  <span className="gv-field-label" style={{ fontSize: 12 }}>System size</span>
                  <select className="gv-select" value={draft.size} onChange={(e) => setDraft((d) => ({ ...d, size: e.target.value }))}>
                    {SIZE_TIERS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </label>
                <label className="gv-field">
                  <span className="gv-field-label" style={{ fontSize: 12 }}>Category</span>
                  <select className="gv-select" value={draft.category} onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}>
                    <option value="home">Home</option>
                    <option value="business">Business</option>
                  </select>
                </label>
              </div>
              <label className="gv-field">
                <span className="gv-field-label" style={{ fontSize: 12 }}>Description</span>
                <textarea className="gv-textarea" rows={4} value={draft.body} placeholder="What the system covers and how it changed things for the customer."
                  onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))} />
              </label>
              <label className="gv-field">
                <span className="gv-field-label" style={{ fontSize: 12 }}>Photographs</span>
                <input type="file" multiple accept="image/*" style={{ padding: '10px 12px', borderRadius: 10, border: '1px dashed rgba(20,55,94,.25)', fontSize: 12.5, color: 'rgba(20,55,94,.7)', background: '#FBFAF8' }}
                  onChange={(e) => { const n = (e.target.files || []).length; setDraft((d) => ({ ...d, images: (d.images || 0) + n })); }} />
              </label>
              <span style={{ fontSize: 12, color: 'rgba(20,55,94,.55)' }}>
                {draft.images ? draft.images + ' photograph' + (draft.images === 1 ? '' : 's') + ' attached' : 'No photographs yet — the public page needs at least one.'}
              </span>
              <label className="gv-checkbox-row">
                <input type="checkbox" checked={draft.caseStudy} style={{ marginTop: 2, width: 16, height: 16, accentColor: '#2E9E45' }}
                  onChange={() => setDraft((d) => ({ ...d, caseStudy: !d.caseStudy }))} />
                <span style={{ fontSize: 13, lineHeight: 1.55, color: 'rgba(20,55,94,.75)' }}>Feature as the detailed case study</span>
              </label>
              <div className="gv-form-actions">
                <button type="button" className="gv-btn-primary" disabled={!canSave} onClick={saveProject}>Save project</button>
                <button type="button" className="gv-btn" onClick={() => setDraft(null)}>Cancel</button>
                {draft.id && <button type="button" className="gv-btn-danger" style={{ marginLeft: 'auto' }} onClick={deleteProject}>Delete</button>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
