import { useState } from 'react';

export default function Login({ onSignIn }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const canSignIn = /.+@.+\..+/.test(email.trim()) && pass.length >= 6;

  const submit = () => {
    if (!canSignIn) return;
    onSignIn(email);
  };

  return (
    <div className="gv-login-wrap">
      <div className="gv-login-box gv-fade">
        <img src="/logo-primary-ondark.svg" alt="Gavikina Energy" style={{ height: 32, width: 'auto', display: 'block', margin: '0 auto' }} />
        <div className="gv-login-card">
          <h1 style={{ margin: 0, fontSize: 23, fontWeight: 600, letterSpacing: '-.025em' }}>Admin sign in</h1>
          <p style={{ margin: '8px 0 26px', fontSize: 13.5, lineHeight: 1.6, color: 'rgba(20,55,94,.6)' }}>
            One account manages every enquiry, assessment and project on the site.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label className="gv-field">
              <span className="gv-field-label">Admin email</span>
              <input
                type="email"
                className="gv-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gavikina.com"
              />
            </label>
            <label className="gv-field">
              <span className="gv-field-label">Password</span>
              <input
                type="password"
                className="gv-input"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
                onKeyDown={(e) => e.key === 'Enter' && submit()}
              />
            </label>
            <button type="button" className="gv-btn-primary" style={{ marginTop: 6, padding: '14px 20px' }} disabled={!canSignIn} onClick={submit}>
              Sign in
            </button>
            <span style={{ fontSize: 12, color: 'rgba(20,55,94,.5)' }}>
              {canSignIn ? 'Two-factor prompt follows on a live deployment.' : 'Enter the admin email and a password of at least 6 characters.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
