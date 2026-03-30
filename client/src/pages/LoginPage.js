import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiZap } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form,    setForm]    = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="page flex-center" style={{ minHeight:'100vh' }}>
      <div style={{ width:'100%', maxWidth:'420px', padding:'0 24px' }} className="fade-up">
        <div className="text-center mb-24">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', marginBottom:'10px' }}>
            <FiZap style={{ color:'var(--cyan)', filter:'drop-shadow(0 0 8px var(--cyan))' }} size={26} />
            <span style={{ fontFamily:'var(--ff-display)', fontWeight:900, fontSize:'1.4rem', letterSpacing:'0.1em' }}>
              AURA<span style={{ color:'var(--cyan)' }}>FIT</span>
            </span>
          </div>
          <p style={{ fontFamily:'var(--ff-display)', fontSize:'0.62rem', letterSpacing:'0.22em', color:'var(--text-2)' }}>SYSTEM ACCESS</p>
        </div>

        <div className="card" style={{ padding:'40px' }}>
          <form onSubmit={handle} style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div style={{ position:'relative' }}>
                <FiMail style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'var(--text-3)' }} />
                <input type="email" className="form-input" style={{ paddingLeft:'42px' }}
                  placeholder="you@example.com" required
                  value={form.email} onChange={e => setForm({ ...form, email:e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position:'relative' }}>
                <FiLock style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'var(--text-3)' }} />
                <input type="password" className="form-input" style={{ paddingLeft:'42px' }}
                  placeholder="••••••••" required
                  value={form.password} onChange={e => setForm({ ...form, password:e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop:'6px', padding:'14px' }}>
              {loading ? 'Authenticating...' : <><FiZap /> Access AURAFIT</>}
            </button>
          </form>
          <div className="divider" />
          <p style={{ textAlign:'center', color:'var(--text-3)', fontSize:'0.9rem' }}>
            No account?{' '}
            <Link to="/register" style={{ color:'var(--cyan)', textDecoration:'none', fontWeight:600 }}>Join free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
