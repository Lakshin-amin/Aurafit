import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { exerciseAPI } from '../api';
import { FiSearch, FiFilter, FiArrowRight, FiTarget } from 'react-icons/fi';

const CATS  = ['','strength','cardio','flexibility','balance','plyometric','functional','hiit'];
const DIFFS = ['','beginner','intermediate','advanced','elite'];
const MGRPS = ['','chest','back','shoulders','biceps','triceps','core','glutes','quads','hamstrings','calves','full_body'];
const DC = { beginner:'var(--green)', intermediate:'var(--cyan)', advanced:'var(--orange)', elite:'var(--red)' };
const CC = { strength:'var(--orange)', cardio:'var(--red)', flexibility:'var(--green)', hiit:'var(--red)', functional:'var(--cyan)', plyometric:'var(--cyan)', balance:'var(--purple)' };

function ExCard({ ex }) {
  const cc = CC[ex.category] || 'var(--cyan)';
  const dc = DC[ex.difficulty];
  return (
    <Link to={`/exercises/${ex._id}`} style={{ textDecoration:'none' }}>
      <div className="card" style={{ padding:'22px', height:'100%' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'12px' }}>
          <span className="badge" style={{ color:cc, background:`${cc}12`, border:`1px solid ${cc}28` }}>{ex.category}</span>
          <span className="badge" style={{ color:dc, background:`${dc}12`, border:`1px solid ${dc}28` }}>{ex.difficulty}</span>
        </div>
        <h3 style={{ fontFamily:'var(--ff-display)', fontSize:'0.85rem', letterSpacing:'0.06em', marginBottom:'8px', lineHeight:1.4 }}>{ex.name}</h3>
        <p style={{ color:'var(--text-3)', fontSize:'0.85rem', lineHeight:1.6, marginBottom:'14px', overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{ex.description}</p>
        <div style={{ display:'flex', gap:'5px', flexWrap:'wrap', marginBottom:'14px' }}>
          {ex.muscleGroups?.slice(0,3).map(m => (
            <span key={m} style={{ padding:'2px 8px', background:'rgba(0,245,255,0.06)', border:'1px solid var(--border-dim)', borderRadius:'10px', fontSize:'0.68rem', color:'var(--text-3)', fontFamily:'var(--ff-mono)' }}>
              {m.replace('_',' ')}
            </span>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'5px', color:'var(--cyan)', fontSize:'0.7rem', fontFamily:'var(--ff-display)', letterSpacing:'0.1em' }}>
          VIEW <FiArrowRight size={11} />
        </div>
      </div>
    </Link>
  );
}

export default function ExerciseLibraryPage() {
  const [exercises, setExercises] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [filters,   setFilters]   = useState({ category:'', difficulty:'', muscleGroup:'', search:'' });
  const [page,      setPage]      = useState(1);
  const [totalPages,setTotal]     = useState(1);
  const [showF,     setShowF]     = useState(false);

  const fetchEx = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit:12, ...Object.fromEntries(Object.entries(filters).filter(([,v])=>v)) };
      const { data } = await exerciseAPI.getAll(params);
      setExercises(data.exercises);
      setTotal(data.pages || 1);
    } catch(e){ console.error(e); }
    finally { setLoading(false); }
  }, [filters, page]);

  useEffect(() => { fetchEx(); }, [fetchEx]);

  const setF = (k, v) => { setFilters(f => ({...f,[k]:v})); setPage(1); };
  const reset = () => { setFilters({ category:'', difficulty:'', muscleGroup:'', search:'' }); setPage(1); };

  return (
    <div className="page">
      <div className="container">
        <div style={{ marginBottom:'32px' }} className="fade-up">
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'8px' }}>
            <FiTarget size={22} style={{ color:'var(--cyan)' }} />
            <h1 className="sec-title">EXERCISE <span>LIBRARY</span></h1>
          </div>
          <p className="sec-sub">Browse 500+ exercises with full instructions and pro tips</p>
        </div>

        <div className="fade-up-1" style={{ display:'flex', gap:'12px', marginBottom:'20px', flexWrap:'wrap' }}>
          <div style={{ position:'relative', flex:1, minWidth:'240px' }}>
            <FiSearch style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'var(--text-3)' }} />
            <input type="text" className="form-input" style={{ paddingLeft:'42px' }} placeholder="Search exercises..."
              value={filters.search} onChange={e => setF('search', e.target.value)} />
          </div>
          <button className={`btn ${showF ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setShowF(!showF)}>
            <FiFilter /> Filters
          </button>
        </div>

        {showF && (
          <div className="card fade-in" style={{ padding:'22px', marginBottom:'20px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))', gap:'14px' }}>
              {[['Category', 'category', CATS], ['Difficulty', 'difficulty', DIFFS], ['Muscle Group', 'muscleGroup', MGRPS]].map(([lbl, key, opts]) => (
                <div key={key} className="form-group">
                  <label className="form-label">{lbl}</label>
                  <select className="form-select" value={filters[key]} onChange={e => setF(key, e.target.value)}>
                    {opts.map(o => <option key={o} value={o}>{o ? o.replace('_',' ') : `All ${lbl}s`}</option>)}
                  </select>
                </div>
              ))}
              <div className="form-group" style={{ justifyContent:'flex-end' }}>
                <label className="form-label" style={{ opacity:0 }}>.</label>
                <button className="btn btn-secondary" onClick={reset}>Reset</button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex-center" style={{ padding:'80px 0' }}><div className="loading-ring" /></div>
        ) : exercises.length > 0 ? (
          <>
            <div className="grid-3 fade-up">
              {exercises.map(ex => <ExCard key={ex._id} ex={ex} />)}
            </div>
            {totalPages > 1 && (
              <div style={{ display:'flex', justifyContent:'center', gap:'8px', marginTop:'40px' }}>
                <button className="btn btn-secondary btn-sm" disabled={page===1} onClick={() => setPage(p=>p-1)}>← Prev</button>
                <span style={{ display:'flex', alignItems:'center', fontFamily:'var(--ff-mono)', color:'var(--text-3)', padding:'0 16px', fontSize:'0.85rem' }}>
                  {page} / {totalPages}
                </span>
                <button className="btn btn-secondary btn-sm" disabled={page===totalPages} onClick={() => setPage(p=>p+1)}>Next →</button>
              </div>
            )}
          </>
        ) : (
          <div className="flex-center" style={{ flexDirection:'column', gap:'16px', padding:'80px 0' }}>
            <FiTarget size={44} style={{ color:'var(--text-3)' }} />
            <p style={{ color:'var(--text-3)' }}>No exercises found</p>
            <button className="btn btn-secondary" onClick={reset}>Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
