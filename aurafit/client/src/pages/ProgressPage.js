import React, { useState, useEffect, useCallback } from 'react';
import { progressAPI } from '../api';
import { FiActivity, FiTrendingUp, FiAward, FiPlus, FiTrash2 } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const TABS = ['Log Workout', 'Body Metrics', 'Personal Record', 'History'];

const tip = ({ active, payload, label }) => active && payload?.length ? (
  <div style={{ background:'var(--bg-elevated)', border:'1px solid var(--border-glow)', padding:'10px 14px', borderRadius:'4px' }}>
    <p style={{ color:'var(--text-2)', fontSize:'0.75rem' }}>{label}</p>
    <p style={{ color:'var(--cyan)', fontFamily:'var(--ff-display)' }}>{payload[0].value}</p>
  </div>
) : null;

export default function ProgressPage() {
  const [tab,        setTab]        = useState(0);
  const [stats,      setStats]      = useState(null);
  const [history,    setHistory]    = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [wForm, setWForm] = useState({ duration:'', caloriesBurned:'', mood:'good', energyLevel:7, notes:'' });
  const [mForm, setMForm] = useState({ weight:'', bodyFat:'', waist:'', chest:'', arms:'', legs:'' });
  const [pForm, setPForm] = useState({ exerciseName:'', metric:'max_weight', value:'', unit:'kg' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, h] = await Promise.all([progressAPI.getStats(), progressAPI.getAll({ limit:20 })]);
      setStats(s.data.stats);
      setHistory(h.data.progress);
    } catch(e){ console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const submitWorkout = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      await progressAPI.log({ type:'workout_log', workoutLog:{ ...wForm, duration:Number(wForm.duration), caloriesBurned:Number(wForm.caloriesBurned), energyLevel:Number(wForm.energyLevel) } });
      toast.success('Workout logged!');
      setWForm({ duration:'', caloriesBurned:'', mood:'good', energyLevel:7, notes:'' });
      load();
    } catch { toast.error('Failed to log workout'); }
    finally { setSubmitting(false); }
  };

  const submitMetrics = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      const bodyMetrics = Object.fromEntries(Object.entries(mForm).filter(([,v])=>v).map(([k,v])=>[k,Number(v)]));
      await progressAPI.log({ type:'body_metrics', bodyMetrics });
      toast.success('Metrics saved!');
      setMForm({ weight:'', bodyFat:'', waist:'', chest:'', arms:'', legs:'' });
      load();
    } catch { toast.error('Failed to save metrics'); }
    finally { setSubmitting(false); }
  };

  const submitPR = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      await progressAPI.log({ type:'personal_record', personalRecord:{ ...pForm, value:Number(pForm.value) } });
      toast.success('Personal Record logged! 🏆');
      setPForm({ exerciseName:'', metric:'max_weight', value:'', unit:'kg' });
      load();
    } catch { toast.error('Failed to log PR'); }
    finally { setSubmitting(false); }
  };

  const del = async (id) => {
    try { await progressAPI.remove(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const inp = (label, key, form, setForm, type='number', ph='') => (
    <div className="form-group" key={key}>
      <label className="form-label">{label}</label>
      <input type={type} className="form-input" placeholder={ph}
        value={form[key]} onChange={e => setForm(f => ({...f,[key]:e.target.value}))} />
    </div>
  );

  return (
    <div className="page">
      <div className="container">
        <div style={{ marginBottom:'32px' }} className="fade-up">
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'8px' }}>
            <FiTrendingUp size={22} style={{ color:'var(--orange)' }} />
            <h1 className="sec-title">PROGRESS <span>TRACKER</span></h1>
          </div>
          <p className="sec-sub">Log workouts, track metrics, visualize your gains</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid-4 fade-up-1 mb-24">
            {[
              { label:'Total Workouts', val:stats.totalWorkouts,              c:'var(--cyan)'   },
              { label:'This Week',       val:stats.weeklyWorkouts,             c:'var(--green)'  },
              { label:'Weekly Calories', val:stats.weeklyCalories,             c:'var(--orange)' },
              { label:'Personal Records',val:stats.personalRecords?.length||0, c:'var(--purple)' },
            ].map(({ label, val, c }) => (
              <div key={label} className="card stat-box">
                <div className="stat-val" style={{ color:c }}>{val}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Weight chart */}
        {stats?.weightHistory?.length > 1 && (
          <div className="card fade-up-2 mb-24" style={{ padding:'26px' }}>
            <p style={{ fontFamily:'var(--ff-display)', fontSize:'0.62rem', letterSpacing:'0.15em', color:'var(--text-2)', textTransform:'uppercase', marginBottom:'18px' }}>Weight History</p>
            <ResponsiveContainer width="100%" height={190}>
              <LineChart data={stats.weightHistory.map(w => ({ date:format(new Date(w.date),'MMM d'), weight:w.weight }))}>
                <XAxis dataKey="date" stroke="var(--text-3)" tick={{ fontSize:11, fontFamily:'var(--ff-mono)' }} />
                <YAxis stroke="var(--text-3)" tick={{ fontSize:11, fontFamily:'var(--ff-mono)' }} domain={['auto','auto']} />
                <Tooltip content={tip} />
                <Line type="monotone" dataKey="weight" stroke="var(--cyan)" strokeWidth={2} dot={{ fill:'var(--cyan)', r:4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display:'flex', gap:'6px', marginBottom:'20px', flexWrap:'wrap' }} className="fade-up-3">
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} className={`btn btn-sm ${tab===i?'btn-primary':'btn-secondary'}`}>{t}</button>
          ))}
        </div>

        {/* Tab content */}
        <div className="card fade-up-4" style={{ padding:'34px' }}>

          {/* Log Workout */}
          {tab === 0 && (
            <form onSubmit={submitWorkout} style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
              <h2 style={{ fontFamily:'var(--ff-display)', fontSize:'0.7rem', letterSpacing:'0.2em', color:'var(--cyan)', textTransform:'uppercase' }}>Log Workout</h2>
              <div className="grid-2">
                {inp('Duration (min)', 'duration', wForm, setWForm, 'number', '45')}
                {inp('Calories Burned', 'caloriesBurned', wForm, setWForm, 'number', '350')}
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Mood</label>
                  <select className="form-select" value={wForm.mood} onChange={e => setWForm(f=>({...f,mood:e.target.value}))}>
                    {['terrible','bad','okay','good','great'].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Energy Level: {wForm.energyLevel}/10</label>
                  <input type="range" min="1" max="10" value={wForm.energyLevel}
                    onChange={e => setWForm(f=>({...f,energyLevel:e.target.value}))}
                    style={{ width:'100%', accentColor:'var(--cyan)', marginTop:'10px' }} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="form-input" rows={3} placeholder="How did it go?" value={wForm.notes}
                  onChange={e => setWForm(f=>({...f,notes:e.target.value}))} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting} style={{ alignSelf:'flex-start' }}>
                <FiPlus /> {submitting ? 'Saving...' : 'Log Workout'}
              </button>
            </form>
          )}

          {/* Body Metrics */}
          {tab === 1 && (
            <form onSubmit={submitMetrics} style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
              <h2 style={{ fontFamily:'var(--ff-display)', fontSize:'0.7rem', letterSpacing:'0.2em', color:'var(--green)', textTransform:'uppercase' }}>Body Metrics</h2>
              <div className="grid-3">
                {inp('Weight (kg)',  'weight',  mForm, setMForm, 'number', '75')}
                {inp('Body Fat %',  'bodyFat', mForm, setMForm, 'number', '15')}
                {inp('Waist (cm)',  'waist',   mForm, setMForm, 'number', '80')}
                {inp('Chest (cm)',  'chest',   mForm, setMForm, 'number', '100')}
                {inp('Arms (cm)',   'arms',    mForm, setMForm, 'number', '35')}
                {inp('Legs (cm)',   'legs',    mForm, setMForm, 'number', '55')}
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting} style={{ alignSelf:'flex-start' }}>
                <FiPlus /> {submitting ? 'Saving...' : 'Save Metrics'}
              </button>
            </form>
          )}

          {/* Personal Record */}
          {tab === 2 && (
            <form onSubmit={submitPR} style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
              <h2 style={{ fontFamily:'var(--ff-display)', fontSize:'0.7rem', letterSpacing:'0.2em', color:'var(--purple)', textTransform:'uppercase' }}>Personal Record</h2>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Exercise Name</label>
                  <input type="text" className="form-input" placeholder="e.g. Bench Press" required
                    value={pForm.exerciseName} onChange={e => setPForm(f=>({...f,exerciseName:e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Metric</label>
                  <select className="form-select" value={pForm.metric} onChange={e => setPForm(f=>({...f,metric:e.target.value}))}>
                    {['max_weight','max_reps','fastest_time','longest_distance'].map(m=><option key={m} value={m}>{m.replace('_',' ')}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Value</label>
                  <input type="number" className="form-input" placeholder="100" required
                    value={pForm.value} onChange={e => setPForm(f=>({...f,value:e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Unit</label>
                  <select className="form-select" value={pForm.unit} onChange={e => setPForm(f=>({...f,unit:e.target.value}))}>
                    {['kg','lbs','reps','seconds','minutes','km','miles'].map(u=><option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting} style={{ alignSelf:'flex-start' }}>
                <FiAward /> {submitting ? 'Saving...' : 'Log PR'}
              </button>
            </form>
          )}

          {/* History */}
          {tab === 3 && (
            <div>
              <h2 style={{ fontFamily:'var(--ff-display)', fontSize:'0.7rem', letterSpacing:'0.2em', color:'var(--text-2)', textTransform:'uppercase', marginBottom:'22px' }}>Recent Activity</h2>
              {loading ? (
                <div className="flex-center" style={{ padding:'40px' }}><div className="loading-ring" /></div>
              ) : history.length > 0 ? (
                <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                  {history.map(e => {
                    const ic = e.type==='workout_log' ? 'var(--cyan)' : e.type==='body_metrics' ? 'var(--green)' : 'var(--purple)';
                    const Icon = e.type==='workout_log' ? FiActivity : e.type==='body_metrics' ? FiTrendingUp : FiAward;
                    const label = e.type==='workout_log'
                      ? `Workout — ${e.workoutLog?.duration||0}min · ${e.workoutLog?.caloriesBurned||0} cal`
                      : e.type==='body_metrics'
                      ? `Body Metrics${e.bodyMetrics?.weight ? ` — ${e.bodyMetrics.weight}kg` : ''}`
                      : `PR: ${e.personalRecord?.exerciseName} — ${e.personalRecord?.value} ${e.personalRecord?.unit}`;
                    return (
                      <div key={e._id} style={{ display:'flex', alignItems:'center', gap:'14px', padding:'14px 18px', background:'rgba(0,245,255,0.03)', border:'1px solid var(--border-dim)', borderRadius:'var(--r-sm)' }}>
                        <div style={{ width:'34px', height:'34px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background:`${ic}15` }}>
                          <Icon style={{ color:ic }} size={15} />
                        </div>
                        <div style={{ flex:1 }}>
                          <p style={{ fontFamily:'var(--ff-display)', fontSize:'0.76rem', marginBottom:'3px' }}>{label}</p>
                          <p style={{ color:'var(--text-3)', fontSize:'0.76rem', fontFamily:'var(--ff-mono)' }}>
                            {format(new Date(e.date), 'MMM d, yyyy · h:mm a')}
                          </p>
                        </div>
                        <button onClick={() => del(e._id)} style={{ background:'none', border:'none', color:'var(--text-3)', cursor:'pointer', padding:'6px', borderRadius:'4px', transition:'color 0.2s' }}
                          onMouseEnter={el => el.currentTarget.style.color='var(--red)'}
                          onMouseLeave={el => el.currentTarget.style.color='var(--text-3)'}>
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex-center" style={{ flexDirection:'column', gap:'14px', padding:'60px 0' }}>
                  <FiActivity size={40} style={{ color:'var(--text-3)' }} />
                  <p style={{ color:'var(--text-3)' }}>No activity logged yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
