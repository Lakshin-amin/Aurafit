import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { workoutAPI } from '../api';
import { FiCalendar, FiClock, FiUsers, FiArrowRight, FiFilter } from 'react-icons/fi';

const CATS  = ['','strength','cardio','hiit','flexibility','sports','weight_loss','muscle_gain','endurance'];
const DIFFS = ['','beginner','intermediate','advanced','elite'];
const DC = { beginner:'var(--green)', intermediate:'var(--cyan)', advanced:'var(--orange)', elite:'var(--red)' };

function PlanCard({ plan }) {
  const dc = DC[plan.difficulty];
  return (
    <Link to={`/workouts/${plan._id}`} style={{ textDecoration:'none' }}>
      <div className="card" style={{ padding:'26px', height:'100%' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'14px' }}>
          <span className="badge badge-cyan">{plan.category?.replace('_',' ')}</span>
          <span className="badge" style={{ color:dc, background:`${dc}15`, border:`1px solid ${dc}30` }}>{plan.difficulty}</span>
        </div>
        <h3 style={{ fontFamily:'var(--ff-display)', fontSize:'0.88rem', letterSpacing:'0.06em', marginBottom:'10px', lineHeight:1.4 }}>{plan.title}</h3>
        <p style={{ color:'var(--text-3)', fontSize:'0.85rem', lineHeight:1.6, marginBottom:'18px', overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{plan.description}</p>
        <div style={{ display:'flex', gap:'18px', marginBottom:'16px' }}>
          {[
            [FiClock,  `${plan.durationWeeks}w`],
            [FiCalendar, `${plan.daysPerWeek}x/week`],
            [FiUsers,  plan.enrolledUsers?.length || 0],
          ].map(([Icon, val], i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:'5px', color:'var(--text-3)', fontSize:'0.82rem' }}>
              <Icon size={12} />{val}
            </div>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'5px', color:'var(--cyan)', fontSize:'0.7rem', fontFamily:'var(--ff-display)', letterSpacing:'0.1em' }}>
          VIEW PROGRAM <FiArrowRight size={11} />
        </div>
      </div>
    </Link>
  );
}

export default function WorkoutPlansPage() {
  const [plans,   setPlans]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category:'', difficulty:'' });
  const [page,    setPage]    = useState(1);
  const [total,   setTotal]   = useState(0);
  const [showF,   setShowF]   = useState(false);
  const PER = 9;

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit:PER, ...Object.fromEntries(Object.entries(filters).filter(([,v])=>v)) };
      const { data } = await workoutAPI.getAll(params);
      setPlans(data.plans); setTotal(data.total);
    } catch(e){ console.error(e); }
    finally { setLoading(false); }
  }, [filters, page]);

  useEffect(() => { fetch(); }, [fetch]);

  const setF = (k, v) => { setFilters(f => ({...f,[k]:v})); setPage(1); };

  return (
    <div className="page">
      <div className="container">
        <div style={{ marginBottom:'32px' }} className="fade-up">
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'8px' }}>
            <FiCalendar size={22} style={{ color:'var(--green)' }} />
            <h1 className="sec-title">TRAINING <span>PROGRAMS</span></h1>
          </div>
          <p className="sec-sub">{total} expertly designed programs for every goal and fitness level</p>
        </div>

        <div className="fade-up-1" style={{ display:'flex', gap:'10px', marginBottom:'20px', flexWrap:'wrap' }}>
          <button className={`btn ${showF?'btn-primary':'btn-secondary'}`} onClick={() => setShowF(!showF)}>
            <FiFilter /> Filters
          </button>
          {DIFFS.slice(1).map(d => (
            <button key={d} onClick={() => setF('difficulty', filters.difficulty===d?'':d)}
              className="btn btn-secondary btn-sm"
              style={filters.difficulty===d ? { background:`${DC[d]}18`, borderColor:DC[d], color:DC[d] } : {}}>
              {d}
            </button>
          ))}
        </div>

        {showF && (
          <div className="card fade-in" style={{ padding:'22px', marginBottom:'20px' }}>
            <div className="form-group" style={{ maxWidth:'240px' }}>
              <label className="form-label">Category</label>
              <select className="form-select" value={filters.category} onChange={e => setF('category', e.target.value)}>
                {CATS.map(c => <option key={c} value={c}>{c ? c.replace('_',' ') : 'All Categories'}</option>)}
              </select>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex-center" style={{ padding:'80px 0' }}><div className="loading-ring" /></div>
        ) : plans.length > 0 ? (
          <>
            <div className="grid-3 fade-up">{plans.map(p => <PlanCard key={p._id} plan={p} />)}</div>
            {Math.ceil(total/PER) > 1 && (
              <div style={{ display:'flex', justifyContent:'center', gap:'8px', marginTop:'40px' }}>
                <button className="btn btn-secondary btn-sm" disabled={page===1} onClick={() => setPage(p=>p-1)}>← Prev</button>
                <span style={{ display:'flex', alignItems:'center', fontFamily:'var(--ff-mono)', color:'var(--text-3)', padding:'0 16px', fontSize:'0.85rem' }}>{page} / {Math.ceil(total/PER)}</span>
                <button className="btn btn-secondary btn-sm" disabled={page>=Math.ceil(total/PER)} onClick={() => setPage(p=>p+1)}>Next →</button>
              </div>
            )}
          </>
        ) : (
          <div className="flex-center" style={{ flexDirection:'column', gap:'16px', padding:'80px 0' }}>
            <FiCalendar size={44} style={{ color:'var(--text-3)' }} />
            <p style={{ color:'var(--text-3)' }}>No programs found</p>
          </div>
        )}
      </div>
    </div>
  );
}
