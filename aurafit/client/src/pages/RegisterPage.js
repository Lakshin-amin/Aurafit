import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiZap } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [step,    setStep]    = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name:'', email:'', password:'', confirm:'',
    fitnessLevel:'beginner',
    stats:{ age:'', height:'', weight:'', gender:'other' }
  });

  const s = (k, v) => setForm(f => ({ ...f, [k]:v }));
  const ss = (k, v) => setForm(f => ({ ...f, stats:{ ...f.stats, [k]:v } }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      const { confirm, ...payload } = form;
      payload.stats = { age:Number(form.stats.age)||0, height:Number(form.stats.height)||0, weight:Number(form.stats.weight)||0, gender:form.stats.gender };
      await register(payload);
      toast.success('Welcome to AURAFIT!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const iconProps = { position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'var(--text-3)' };

  return (
    <div className="page flex-center" style={{ minHeight:'100vh', padding:'100px 24px 40px' }}>
      <div style={{ width:'100%', maxWidth:'500px' }} className="fade-up">
        <div className="text-center mb-24">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', marginBottom:'10px' }}>
            <FiZap style={{ color:'var(--cyan)', filter:'drop-shadow(0 0 8px var(--cyan))' }} size={26} />
            <span style={{ fontFamily:'var(--ff-display)', fontWeight:900, fontSize:'1.4rem', letterSpacing:'0.1em' }}>
              AURA<span style={{ color:'var(--cyan)' }}>FIT</span>
            </span>
          </div>
          <p style={{ fontFamily:'var(--ff-display)', fontSize:'0.62rem', letterSpacing:'0.22em', color:'var(--text-2)' }}>OPERATIVE REGISTRATION</p>
        </div>

        {/* Progress bar */}
        <div style={{ display:'flex', gap:'8px', marginBottom:'22px' }}>
          {[1,2].map(n => (
            <div key={n} style={{ flex:1, height:'3px', borderRadius:'2px', transition:'all 0.3s',
              background: n <= step ? 'var(--cyan)' : 'var(--border-dim)',
              boxShadow:  n <= step ? 'var(--glow-c)' : 'none' }} />
          ))}
        </div>

        <div className="card" style={{ padding:'40px' }}>
          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : submit}
            style={{ display:'flex', flexDirection:'column', gap:'18px' }}>

            {step === 1 ? (
              <>
                <p style={{ fontFamily:'var(--ff-display)', fontSize:'0.6rem', letterSpacing:'0.2em', color:'var(--cyan)', textTransform:'uppercase' }}>Step 1 — Identity</p>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div style={{ position:'relative' }}>
                    <FiUser style={iconProps} />
                    <input type="text" className="form-input" style={{ paddingLeft:'42px' }} placeholder="John Doe" required value={form.name} onChange={e => s('name', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <div style={{ position:'relative' }}>
                    <FiMail style={iconProps} />
                    <input type="email" className="form-input" style={{ paddingLeft:'42px' }} placeholder="you@example.com" required value={form.email} onChange={e => s('email', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div style={{ position:'relative' }}>
                    <FiLock style={iconProps} />
                    <input type="password" className="form-input" style={{ paddingLeft:'42px' }} placeholder="Min. 6 characters" required minLength={6} value={form.password} onChange={e => s('password', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div style={{ position:'relative' }}>
                    <FiLock style={iconProps} />
                    <input type="password" className="form-input" style={{ paddingLeft:'42px' }} placeholder="••••••••" required value={form.confirm} onChange={e => s('confirm', e.target.value)} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-full" style={{ padding:'14px', marginTop:'4px' }}>Continue →</button>
              </>
            ) : (
              <>
                <p style={{ fontFamily:'var(--ff-display)', fontSize:'0.6rem', letterSpacing:'0.2em', color:'var(--green)', textTransform:'uppercase' }}>Step 2 — Biometrics</p>
                <div className="grid-2" style={{ gap:'14px' }}>
                  <div className="form-group">
                    <label className="form-label">Age</label>
                    <input type="number" className="form-input" placeholder="25" min="10" max="100" value={form.stats.age} onChange={e => ss('age', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select className="form-select" value={form.stats.gender} onChange={e => ss('gender', e.target.value)}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Height (cm)</label>
                    <input type="number" className="form-input" placeholder="175" value={form.stats.height} onChange={e => ss('height', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Weight (kg)</label>
                    <input type="number" className="form-input" placeholder="75" value={form.stats.weight} onChange={e => ss('weight', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Fitness Level</label>
                  <select className="form-select" value={form.fitnessLevel} onChange={e => s('fitnessLevel', e.target.value)}>
                    {['beginner','intermediate','advanced','elite'].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div style={{ display:'flex', gap:'10px', marginTop:'4px' }}>
                  <button type="button" className="btn btn-secondary" style={{ flex:1, justifyContent:'center' }} onClick={() => setStep(1)}>← Back</button>
                  <button type="submit" className="btn btn-primary" style={{ flex:2, justifyContent:'center', padding:'14px' }} disabled={loading}>
                    {loading ? 'Creating...' : <><FiZap /> Join AURAFIT</>}
                  </button>
                </div>
              </>
            )}
          </form>
          <div className="divider" />
          <p style={{ textAlign:'center', color:'var(--text-3)', fontSize:'0.9rem' }}>
            Already a member? <Link to="/login" style={{ color:'var(--cyan)', textDecoration:'none', fontWeight:600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
