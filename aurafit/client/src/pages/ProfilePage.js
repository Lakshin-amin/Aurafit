import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api';
import { FiUser, FiEdit2, FiSave, FiX, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';

const GOALS  = ['weight_loss','muscle_gain','endurance','flexibility','strength','general_fitness'];
const LEVELS = ['beginner','intermediate','advanced','elite'];
const LC = { beginner:'var(--green)', intermediate:'var(--cyan)', advanced:'var(--orange)', elite:'var(--red)' };

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [form, setForm] = useState({
    name:         user?.name || '',
    fitnessLevel: user?.fitnessLevel || 'beginner',
    goals:        user?.goals || [],
    stats: {
      age:    user?.stats?.age    || '',
      height: user?.stats?.height || '',
      weight: user?.stats?.weight || '',
      gender: user?.stats?.gender || 'other',
    }
  });

  const toggleGoal = (g) => setForm(f => ({
    ...f, goals: f.goals.includes(g) ? f.goals.filter(x=>x!==g) : [...f.goals, g]
  }));

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const { data } = await authAPI.updateProfile({
        ...form,
        stats: { age:Number(form.stats.age)||0, height:Number(form.stats.height)||0, weight:Number(form.stats.weight)||0, gender:form.stats.gender }
      });
      updateUser(data.user);
      setEditing(false);
      toast.success('Profile updated!');
    } catch(err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  const bmi = user?.stats?.weight && user?.stats?.height
    ? (user.stats.weight / Math.pow(user.stats.height/100, 2)).toFixed(1) : null;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth:'780px' }}>
        <div style={{ marginBottom:'32px' }} className="fade-up">
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'8px' }}>
            <FiUser size={22} style={{ color:'var(--purple)' }} />
            <h1 className="sec-title">YOUR <span>PROFILE</span></h1>
          </div>
          <p className="sec-sub">Manage your biometrics, goals, and training preferences</p>
        </div>

        {/* Main card */}
        <div className="card fade-up-1" style={{ padding:'36px', marginBottom:'20px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'20px', marginBottom:'28px' }}>
            {/* Avatar + info */}
            <div style={{ display:'flex', alignItems:'center', gap:'18px' }}>
              <div style={{ width:'72px', height:'72px', borderRadius:'50%', flexShrink:0,
                background:'linear-gradient(135deg,var(--cyan),var(--green))',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:'var(--ff-display)', fontSize:'1.8rem', fontWeight:700,
                color:'var(--bg-void)', boxShadow:'var(--glow-c)' }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 style={{ fontFamily:'var(--ff-display)', fontSize:'1.3rem', fontWeight:700, marginBottom:'6px' }}>{user?.name}</h2>
                <p style={{ color:'var(--text-3)', fontFamily:'var(--ff-mono)', fontSize:'0.82rem', marginBottom:'8px' }}>{user?.email}</p>
                <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                  <span className="badge" style={{ color:LC[user?.fitnessLevel], background:`${LC[user?.fitnessLevel]}15`, border:`1px solid ${LC[user?.fitnessLevel]}30` }}>{user?.fitnessLevel}</span>
                  <span className="badge badge-cyan">{user?.role}</span>
                </div>
              </div>
            </div>

            {!editing
              ? <button className="btn btn-secondary" onClick={() => setEditing(true)}><FiEdit2 /> Edit</button>
              : <button className="btn btn-secondary" onClick={() => setEditing(false)}><FiX /> Cancel</button>
            }
          </div>

          {/* Stats display */}
          {!editing && (
            <>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))', gap:'12px', marginBottom:'22px' }}>
                {[
                  ['Age',    user?.stats?.age    || '—', 'yrs'],
                  ['Height', user?.stats?.height || '—', 'cm' ],
                  ['Weight', user?.stats?.weight || '—', 'kg' ],
                  ['BMI',    bmi || '—',                 ''   ],
                  ['Gender', user?.stats?.gender || '—', ''   ],
                ].map(([lbl, val, unit]) => (
                  <div key={lbl} style={{ textAlign:'center', padding:'14px 10px', background:'rgba(0,245,255,0.04)', border:'1px solid var(--border-dim)', borderRadius:'var(--r-sm)' }}>
                    <div style={{ fontFamily:'var(--ff-display)', fontSize:'1.35rem', fontWeight:700, color:'var(--cyan)', lineHeight:1 }}>
                      {val}{unit && <span style={{ fontSize:'0.65rem', color:'var(--text-3)', marginLeft:'3px' }}>{unit}</span>}
                    </div>
                    <div style={{ fontFamily:'var(--ff-display)', fontSize:'0.56rem', letterSpacing:'0.15em', color:'var(--text-3)', textTransform:'uppercase', marginTop:'5px' }}>{lbl}</div>
                  </div>
                ))}
              </div>

              {user?.goals?.length > 0 && (
                <div>
                  <p style={{ fontFamily:'var(--ff-display)', fontSize:'0.6rem', letterSpacing:'0.15em', color:'var(--text-3)', textTransform:'uppercase', marginBottom:'10px' }}>Goals</p>
                  <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                    {user.goals.map(g => <span key={g} className="badge badge-green">{g.replace('_',' ')}</span>)}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Edit form */}
          {editing && (
            <form onSubmit={save} style={{ display:'flex', flexDirection:'column', gap:'22px' }}>
              <div className="divider" />

              <div>
                <p style={{ fontFamily:'var(--ff-display)', fontSize:'0.62rem', letterSpacing:'0.15em', color:'var(--cyan)', textTransform:'uppercase', marginBottom:'14px' }}>Basic Info</p>
                <div className="grid-2" style={{ gap:'14px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-input" value={form.name} required
                      onChange={e => setForm(f=>({...f,name:e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fitness Level</label>
                    <select className="form-select" value={form.fitnessLevel} onChange={e => setForm(f=>({...f,fitnessLevel:e.target.value}))}>
                      {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <p style={{ fontFamily:'var(--ff-display)', fontSize:'0.62rem', letterSpacing:'0.15em', color:'var(--green)', textTransform:'uppercase', marginBottom:'14px' }}>Biometrics</p>
                <div className="grid-3" style={{ gap:'14px' }}>
                  {[['Age','age','number','25'],['Height (cm)','height','number','175'],['Weight (kg)','weight','number','75']].map(([lbl,key,type,ph])=>(
                    <div key={key} className="form-group">
                      <label className="form-label">{lbl}</label>
                      <input type={type} className="form-input" placeholder={ph}
                        value={form.stats[key]} onChange={e => setForm(f=>({...f,stats:{...f.stats,[key]:e.target.value}}))} />
                    </div>
                  ))}
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select className="form-select" value={form.stats.gender} onChange={e=>setForm(f=>({...f,stats:{...f.stats,gender:e.target.value}}))}>
                      {['male','female','other'].map(g=><option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <p style={{ fontFamily:'var(--ff-display)', fontSize:'0.62rem', letterSpacing:'0.15em', color:'var(--purple)', textTransform:'uppercase', marginBottom:'14px' }}>Training Goals</p>
                <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                  {GOALS.map(g => {
                    const on = form.goals.includes(g);
                    return (
                      <button key={g} type="button" onClick={() => toggleGoal(g)} className="btn btn-sm"
                        style={ on ? { background:'rgba(0,255,136,0.15)', borderColor:'var(--green)', color:'var(--green)' }
                                   : { background:'transparent', border:'1px solid var(--border-dim)', color:'var(--text-3)' }}>
                        {g.replace('_',' ')}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display:'flex', gap:'10px' }}>
                <button type="submit" className="btn btn-primary" disabled={saving}><FiSave /> {saving?'Saving...':'Save Changes'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          )}
        </div>

        {/* Security */}
        <div className="card fade-up-2" style={{ padding:'26px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'14px' }}>
            <FiShield style={{ color:'var(--cyan)' }} size={17} />
            <p style={{ fontFamily:'var(--ff-display)', fontSize:'0.62rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--text-2)' }}>Account Security</p>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
            <div>
              <p style={{ color:'var(--text-2)', fontSize:'0.9rem' }}>
                Email: <span style={{ color:'var(--text-1)', fontFamily:'var(--ff-mono)' }}>{user?.email}</span>
              </p>
              <p style={{ color:'var(--text-3)', fontSize:'0.8rem', marginTop:'4px' }}>
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US',{ month:'long', year:'numeric' }) : '—'}
              </p>
            </div>
            <span className="badge badge-green">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
