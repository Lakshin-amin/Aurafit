import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { progressAPI, workoutAPI } from '../api';
import { FiActivity, FiZap, FiTrendingUp, FiAward, FiCalendar, FiTarget, FiArrowRight } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const DIFF_C = { beginner:'var(--green)', intermediate:'var(--cyan)', advanced:'var(--orange)', elite:'var(--red)' };

const Tip = ({ active, payload, label }) => active && payload?.length ? (
  <div style={{ background:'var(--bg-elevated)', border:'1px solid var(--border-glow)', padding:'10px 14px', borderRadius:'4px' }}>
    <p style={{ color:'var(--text-2)', fontSize:'0.75rem', marginBottom:'4px' }}>{label}</p>
    <p style={{ color:'var(--cyan)', fontFamily:'var(--ff-display)', fontSize:'0.9rem' }}>{payload[0].value} kg</p>
  </div>
) : null;

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats,   setStats]   = useState(null);
  const [plans,   setPlans]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([progressAPI.getStats(), workoutAPI.getMyPlans()])
      .then(([s, p]) => { setStats(s.data.stats); setPlans(p.data.plans.slice(0,3)); })
      .finally(() => setLoading(false));
  }, []);

  const bmi = user?.stats?.weight && user?.stats?.height
    ? (user.stats.weight / Math.pow(user.stats.height / 100, 2)).toFixed(1) : null;
  const bmiColor = !bmi ? 'var(--cyan)' : bmi < 18.5 ? 'var(--cyan)' : bmi < 25 ? 'var(--green)' : bmi < 30 ? 'var(--orange)' : 'var(--red)';
  const bmiLabel = !bmi ? '—' : bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';

  if (loading) return <div className="loading-screen"><div className="loading-ring" /></div>;

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="flex-between mb-24 fade-up" style={{ flexWrap:'wrap', gap:'16px' }}>
          <div>
            <p style={{ fontFamily:'var(--ff-display)', fontSize:'0.6rem', letterSpacing:'0.2em', color:'var(--cyan)', textTransform:'uppercase', marginBottom:'8px' }}>Welcome Back</p>
            <h1 style={{ fontFamily:'var(--ff-display)', fontSize:'clamp(1.5rem,3vw,2.2rem)', fontWeight:700 }}>{user?.name?.toUpperCase()}</h1>
            <div style={{ display:'flex', gap:'8px', marginTop:'10px', flexWrap:'wrap' }}>
              <span className="badge badge-cyan">{user?.fitnessLevel}</span>
              <span className="badge badge-green">{user?.role}</span>
            </div>
          </div>
          <Link to="/progress" className="btn btn-primary"><FiActivity /> Log Workout <FiArrowRight /></Link>
        </div>

        {/* Stat cards */}
        <div className="grid-4 fade-up-1 mb-24">
          {[
            { icon:FiActivity,  label:'Total Workouts',  val:stats?.totalWorkouts   || 0, c:'var(--cyan)'   },
            { icon:FiZap,       label:'This Week',        val:stats?.weeklyWorkouts  || 0, c:'var(--green)'  },
            { icon:FiTrendingUp,label:'Weekly Calories',  val:stats?.weeklyCalories  || 0, c:'var(--orange)' },
            { icon:FiAward,     label:'Personal Records', val:stats?.personalRecords?.length || 0, c:'var(--purple)' },
          ].map(({ icon:Icon, label, val, c }) => (
            <div key={label} className="card stat-box">
              <Icon style={{ color:c, marginBottom:'10px' }} size={20} />
              <div className="stat-val" style={{ color:c }}>{val}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid-2 fade-up-2 mb-24" style={{ alignItems:'start' }}>
          {/* Weight chart */}
          <div className="card" style={{ padding:'28px' }}>
            <p style={{ fontFamily:'var(--ff-display)', fontSize:'0.62rem', letterSpacing:'0.15em', color:'var(--text-2)', textTransform:'uppercase', marginBottom:'18px' }}>Weight Trend</p>
            {stats?.weightHistory?.length > 1 ? (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={stats.weightHistory.map(w => ({ date:format(new Date(w.date),'MMM d'), weight:w.weight }))}>
                  <XAxis dataKey="date" stroke="var(--text-3)" tick={{ fontSize:11, fontFamily:'var(--ff-mono)' }} />
                  <YAxis stroke="var(--text-3)" tick={{ fontSize:11, fontFamily:'var(--ff-mono)' }} domain={['auto','auto']} />
                  <Tooltip content={<Tip />} />
                  <Line type="monotone" dataKey="weight" stroke="var(--cyan)" strokeWidth={2} dot={{ fill:'var(--cyan)', r:4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height:'180px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'12px' }}>
                <FiTrendingUp size={36} style={{ color:'var(--text-3)' }} />
                <p style={{ color:'var(--text-3)' }}>Log body metrics to see trends</p>
                <Link to="/progress" className="btn btn-secondary btn-sm">Start Tracking</Link>
              </div>
            )}
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            {/* BMI */}
            {bmi && (
              <div className="card" style={{ padding:'22px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div>
                    <p style={{ fontFamily:'var(--ff-display)', fontSize:'0.6rem', letterSpacing:'0.15em', color:'var(--text-3)', textTransform:'uppercase', marginBottom:'6px' }}>BMI Index</p>
                    <div style={{ fontFamily:'var(--ff-display)', fontSize:'2.4rem', fontWeight:700, color:bmiColor, textShadow:`0 0 20px ${bmiColor}60` }}>{bmi}</div>
                  </div>
                  <span className="badge" style={{ background:`${bmiColor}15`, color:bmiColor, border:`1px solid ${bmiColor}35` }}>{bmiLabel}</span>
                </div>
              </div>
            )}
            {/* Quick actions */}
            <div className="card" style={{ padding:'22px' }}>
              <p style={{ fontFamily:'var(--ff-display)', fontSize:'0.6rem', letterSpacing:'0.15em', color:'var(--text-3)', textTransform:'uppercase', marginBottom:'14px' }}>Quick Actions</p>
              <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                {[
                  { to:'/exercises',   label:'Browse Exercises', icon:FiTarget,   c:'var(--cyan)'   },
                  { to:'/workouts',    label:'Find a Program',   icon:FiCalendar, c:'var(--green)'  },
                  { to:'/calculator', label:'BMI Calculator',   icon:FiActivity, c:'var(--orange)' },
                ].map(({ to, label, icon:Icon, c }) => (
                  <Link key={to} to={to} style={{
                    display:'flex', alignItems:'center', gap:'12px', padding:'11px 14px',
                    background:'rgba(255,255,255,0.03)', border:'1px solid var(--border-dim)',
                    borderRadius:'var(--r-sm)', textDecoration:'none', color:'var(--text-2)', transition:'var(--ease)'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor=c; e.currentTarget.style.color=c; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border-dim)'; e.currentTarget.style.color='var(--text-2)'; }}
                  >
                    <Icon size={15} />
                    <span style={{ fontFamily:'var(--ff-display)', fontSize:'0.63rem', letterSpacing:'0.1em' }}>{label}</span>
                    <FiArrowRight size={13} style={{ marginLeft:'auto' }} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* My plans */}
        <div className="fade-up-3">
          <div className="flex-between mb-16">
            <p style={{ fontFamily:'var(--ff-display)', fontSize:'0.62rem', letterSpacing:'0.15em', color:'var(--text-2)', textTransform:'uppercase' }}>My Programs</p>
            <Link to="/workouts" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          {plans.length > 0 ? (
            <div className="grid-3">
              {plans.map(p => (
                <Link key={p._id} to={`/workouts/${p._id}`} style={{ textDecoration:'none' }}>
                  <div className="card" style={{ padding:'22px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'12px' }}>
                      <span className="badge badge-cyan">{p.category?.replace('_',' ')}</span>
                      <span className="badge" style={{ color:DIFF_C[p.difficulty], background:`${DIFF_C[p.difficulty]}15`, border:`1px solid ${DIFF_C[p.difficulty]}30` }}>{p.difficulty}</span>
                    </div>
                    <h3 style={{ fontFamily:'var(--ff-display)', fontSize:'0.82rem', letterSpacing:'0.06em', marginBottom:'8px' }}>{p.title}</h3>
                    <p style={{ color:'var(--text-3)', fontSize:'0.82rem' }}>{p.durationWeeks}w · {p.daysPerWeek}x/week</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card flex-center" style={{ padding:'40px', flexDirection:'column', gap:'12px' }}>
              <FiCalendar size={36} style={{ color:'var(--text-3)' }} />
              <p style={{ color:'var(--text-3)' }}>No programs enrolled yet</p>
              <Link to="/workouts" className="btn btn-primary btn-sm">Browse Programs</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
