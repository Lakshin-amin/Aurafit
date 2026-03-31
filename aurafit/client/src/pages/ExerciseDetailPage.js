// ─── ExerciseDetailPage ─────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { exerciseAPI } from '../api';
import { FiArrowLeft, FiZap, FiTarget } from 'react-icons/fi';

const DC = { beginner:'var(--green)', intermediate:'var(--cyan)', advanced:'var(--orange)', elite:'var(--red)' };

export default function ExerciseDetailPage() {
  const { id } = useParams();
  const [ex, setEx] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    exerciseAPI.getOne(id).then(({ data }) => setEx(data.exercise)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-screen"><div className="loading-ring" /></div>;
  if (!ex) return (
    <div className="page flex-center flex-direction-column">
      <p style={{ color:'var(--text-3)' }}>Exercise not found</p>
      <Link to="/exercises" className="btn btn-secondary mt-16">← Back</Link>
    </div>
  );

  return (
    <div className="page">
      <div className="container" style={{ maxWidth:'860px' }}>
        <Link to="/exercises" className="btn btn-secondary btn-sm fade-up" style={{ marginBottom:'28px' }}>
          <FiArrowLeft /> Back to Library
        </Link>

        <div className="card fade-up-1" style={{ padding:'36px', marginBottom:'20px' }}>
          <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'18px' }}>
            <span className="badge badge-cyan">{ex.category}</span>
            <span className="badge" style={{ color:DC[ex.difficulty], background:`${DC[ex.difficulty]}15`, border:`1px solid ${DC[ex.difficulty]}30` }}>{ex.difficulty}</span>
            {ex.muscleGroups?.map(m => <span key={m} className="badge" style={{ color:'var(--text-2)', background:'rgba(255,255,255,0.05)', border:'1px solid var(--border-dim)' }}>{m.replace('_',' ')}</span>)}
          </div>
          <h1 style={{ fontFamily:'var(--ff-display)', fontSize:'clamp(1.4rem,4vw,2.2rem)', fontWeight:700, marginBottom:'14px' }}>{ex.name}</h1>
          <p style={{ color:'var(--text-2)', fontSize:'1.05rem', lineHeight:1.8 }}>{ex.description}</p>
          <div className="divider" />
          <div style={{ display:'flex', gap:'32px', flexWrap:'wrap' }}>
            <div>
              <p style={{ fontFamily:'var(--ff-display)', fontSize:'0.58rem', letterSpacing:'0.15em', color:'var(--text-3)', textTransform:'uppercase', marginBottom:'8px' }}>Equipment</p>
              <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                {ex.equipment?.map(e => (
                  <span key={e} style={{ padding:'4px 10px', background:'rgba(0,245,255,0.07)', border:'1px solid var(--border-dim)', borderRadius:'12px', fontSize:'0.8rem', color:'var(--cyan)', fontFamily:'var(--ff-mono)' }}>
                    {e.replace('_',' ')}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontFamily:'var(--ff-display)', fontSize:'0.58rem', letterSpacing:'0.15em', color:'var(--text-3)', textTransform:'uppercase', marginBottom:'8px' }}>Cal / min</p>
              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                <FiZap style={{ color:'var(--orange)' }} />
                <span style={{ fontFamily:'var(--ff-display)', color:'var(--orange)', fontSize:'1.2rem' }}>{ex.caloriesPerMinute}</span>
              </div>
            </div>
          </div>
        </div>

        {ex.instructions?.length > 0 && (
          <div className="card fade-up-2" style={{ padding:'32px', marginBottom:'20px' }}>
            <h2 style={{ fontFamily:'var(--ff-display)', fontSize:'0.7rem', letterSpacing:'0.2em', color:'var(--cyan)', textTransform:'uppercase', marginBottom:'22px' }}>Instructions</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
              {ex.instructions.map((ins, i) => (
                <div key={i} style={{ display:'flex', gap:'14px', alignItems:'flex-start' }}>
                  <div style={{ width:'30px', height:'30px', borderRadius:'50%', background:'rgba(0,245,255,0.1)', border:'1px solid var(--border-glow)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:'var(--ff-display)', fontSize:'0.68rem', color:'var(--cyan)' }}>
                    {ins.step || i+1}
                  </div>
                  <p style={{ color:'var(--text-2)', lineHeight:1.7, paddingTop:'4px' }}>{ins.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {ex.tips?.length > 0 && (
          <div className="card fade-up-3" style={{ padding:'32px' }}>
            <h2 style={{ fontFamily:'var(--ff-display)', fontSize:'0.7rem', letterSpacing:'0.2em', color:'var(--green)', textTransform:'uppercase', marginBottom:'18px' }}>Pro Tips</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {ex.tips.map((tip, i) => (
                <div key={i} style={{ display:'flex', gap:'10px', alignItems:'flex-start' }}>
                  <FiTarget style={{ color:'var(--green)', flexShrink:0, marginTop:'3px' }} size={13} />
                  <p style={{ color:'var(--text-2)', lineHeight:1.7 }}>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
