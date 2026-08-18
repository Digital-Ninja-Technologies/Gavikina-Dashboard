import { useMemo } from 'react';
import { LEADS, VIEWS, naira } from '../data.js';
import { csvFor, download, tagColors } from '../utils.js';

function fieldsFor(open) {
  const fields = [];
  if (open.type === 'Customer') {
    fields.push(['Property type', open.property]);
    fields.push(['Reason for solar', open.reason || 'Not given']);
    fields.push(['What should the system power?', open.appliances && open.appliances.length ? open.appliances.map((a) => a[0]).join(', ') : 'Not reached']);
    fields.push(['Backup duration', open.backup || 'Not reached']);
    fields.push(['Monthly fuel spend', open.fuel ? naira(open.fuel) : 'Not reached']);
    fields.push(['Preferred payment', open.payment || 'Not reached']);
    fields.push(['Site inspection', open.completed ? (open.inspection ? 'Requested' : 'Not requested') : 'Not reached']);
    fields.push(['Phone', open.phone || 'Not captured — dropped before contact step']);
    fields.push(['Email', open.email || 'Not captured']);
  } else if (open.type === 'Agent') {
    fields.push(['Location', open.area]);
    fields.push(['Occupation', open.occupation]);
    fields.push(['Phone', open.phone]);
    fields.push(['Email', open.email]);
    fields.push(['Why they applied', open.reason]);
  } else if (open.type === 'Career') {
    fields.push(['Applying for', open.role]);
    fields.push(['Location', open.area]);
    fields.push(['Phone', open.phone]);
    fields.push(['Email', open.email]);
    fields.push(['CV', open.cv ? open.cv + ' · download below' : 'Not attached']);
    fields.push(['Relevant experience', open.about]);
  } else if (open.type === 'Investor') {
    fields.push(['Phone', open.phone || 'Not given']);
    fields.push(['Email', open.email || 'Not given']);
    fields.push(['What they are looking for', open.message]);
  } else {
    fields.push(['Email or phone', open.contact || 'Not given']);
    fields.push(['Message', open.message]);
  }
  fields.push(['Received', open.when]);
  return fields;
}

export default function EnquiryDetail({ view, id, onClose }) {
  const open = useMemo(() => LEADS.find((l) => l.id === id), [id]);
  if (!open) return null;

  const [title] = VIEWS[view] || VIEWS.all;
  const [tagColor, tagBg] = tagColors(open.type);
  const detailFields = fieldsFor(open);
  const totalWatts = open.appliances ? open.appliances.reduce((n, a) => n + a[2], 0) : 0;

  const downloadCv = () => {
    const body = 'CV placeholder for ' + open.name + '\n\nRole applied for: ' + open.role +
      '\nLocation: ' + open.area + '\nPhone: ' + open.phone + '\nEmail: ' + open.email +
      '\nSubmitted: ' + open.when + '\n\n' + open.about + '\n\nIn the live build this button serves the file the applicant uploaded.';
    download(open.cv.replace(/\.pdf$/, '') + '.txt', body);
  };

  const detailMeta = open.type === 'Customer'
    ? (open.completed ? 'Completed assessment · ' + open.when : 'Abandoned assessment · last activity ' + open.when)
    : open.type + ' enquiry · ' + open.when;

  const phoneHref = open.phone ? 'tel:' + open.phone.replace(/\s/g, '') : '#';
  const mailTarget = open.email || (open.contact && open.contact.indexOf('@') > -1 ? open.contact : '');
  const mailHref = mailTarget ? 'mailto:' + mailTarget : '#';
  const statusNote = (open.phone || open.email || open.contact)
    ? 'Contact details captured. Reach out using the details above.'
    : 'No contact details were captured before drop-off. Only the entered assessment data is available.';

  return (
    <div className="gv-detail gv-fade">
      <button type="button" className="gv-back-btn" onClick={onClose}>← Back to {title}</button>
      <div className="gv-page-head" style={{ marginTop: 14 }}>
        <div>
          <span className="gv-tag" style={{ color: tagColor, background: tagBg }}>{open.type}</span>
          <h1 style={{ margin: '12px 0 0', fontSize: 27, fontWeight: 600, letterSpacing: '-.028em' }}>{open.name}</h1>
          <p className="gv-note">{detailMeta}</p>
        </div>
        <button type="button" className="gv-btn" onClick={() => download('gavikina-' + open.id + '.csv', csvFor([open]))}>Download CSV</button>
      </div>

      <div className="gv-detail-cols">
        <div className="gv-detail-main">
          {open.type === 'Customer' && (
            <div className="gv-result-card">
              <div><span className="gv-result-label">Calculated size</span><div className="gv-result-value" style={{ fontSize: 31 }}>{open.size}</div></div>
              <div><span className="gv-result-label">Price range</span><div className="gv-result-value" style={{ fontSize: 19 }}>{open.price}</div></div>
              <div><span className="gv-result-label">Fuel spend</span><div className="gv-result-value" style={{ fontSize: 19 }}>{open.fuel ? naira(open.fuel) + ' / mo' : 'Not reached'}</div></div>
            </div>
          )}

          <div className="gv-fields">
            {detailFields.map(([label, value]) => (
              <div className="gv-detail-field" key={label}>
                <span className="gv-field-k">{label}</span>
                <span className="gv-field-v">{value}</span>
              </div>
            ))}
          </div>

          {open.cv && (
            <div className="gv-cv-card">
              <span className="gv-cv-icon">{(open.cv.split('.').pop() || 'file').toUpperCase()}</span>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span className="gv-ellipsis" style={{ fontSize: 13.5, fontWeight: 500 }}>{open.cv}</span>
                <span style={{ fontSize: 12, color: 'rgba(20,55,94,.55)' }}>CV attached to this application · {open.cvSize}</span>
              </div>
              <button type="button" className="gv-btn-primary" onClick={downloadCv}>Download CV</button>
            </div>
          )}

          {open.appliances && open.appliances.length > 0 && (
            <div className="gv-panel">
              <h2 className="gv-panel-h2">Appliances selected</h2>
              <div style={{ marginTop: 14 }}>
                {open.appliances.map((a) => (
                  <div className="gv-appliance-row" key={a[0]}>
                    <span style={{ flex: 1, minWidth: 0 }}>{a[0]}</span>
                    <span style={{ color: 'rgba(20,55,94,.55)' }}>× {a[1]}</span>
                    <span style={{ width: 80, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'rgba(20,55,94,.75)' }}>{a[2].toLocaleString()}W</span>
                  </div>
                ))}
              </div>
              <div className="gv-appliance-total"><span>Total load</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>{totalWatts.toLocaleString()}W</span></div>
            </div>
          )}
        </div>

        <div className="gv-detail-side">
          {open.ai && (
            <div className="gv-ai-note">
              <span className="gv-result-label" style={{ color: 'rgba(20,55,94,.5)' }}>
                {open.type === 'Agent' ? 'AI first read shown to applicant' : 'AI note shown to customer'}
              </span>
              <p style={{ margin: '11px 0 0', fontSize: 13.5, lineHeight: 1.7, color: 'rgba(20,55,94,.8)' }}>{open.ai}</p>
            </div>
          )}
          <div className="gv-panel">
            <h2 className="gv-panel-h2">Status</h2>
            <p style={{ margin: '10px 0 0', fontSize: 13, lineHeight: 1.65, color: 'rgba(20,55,94,.65)' }}>{statusNote}</p>
            <div className="gv-status-actions">
              <a href={phoneHref} className="gv-call-btn">Call {open.phone || 'unavailable'}</a>
              <a href={mailHref} className="gv-mail-btn">Send an email</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
