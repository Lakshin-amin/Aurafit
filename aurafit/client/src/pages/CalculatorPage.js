import React, { useState } from 'react';
import { FiActivity, FiZap, FiTarget, FiInfo } from 'react-icons/fi';

const ACTIVITY = [
  { val:'1.2',   label:'Sedentary',         desc:'Little or no exercise' },
  { val:'1.375', label:'Lightly Active',     desc:'1–3 days/week' },
  { val:'1.55',  label:'Moderately Active',  desc:'3–5 days/week' },
  { val:'1.725', label:'Very Active',         desc:'6–7 days/week' },
  { val:'1.9',   label:'Super Active',        desc:'Physical job + hard training' },
];

function toMetric(h, w, unit) {
  return unit === 'imperial'
    ? { height: h * 2.54, weight: w * 0.453592 }
    : { height: parseFloat(h), weight: parseFloat(w) };
}

function bmiCat(bmi) {
  if (bmi < 16)   return { label:'Severely Underweight', color:'var(--red)'    };
  if (bmi < 18.5) return { label:'Underweight',           color:'var(--cyan)'   };
  if (bmi < 25)   return { label:'Normal Weight',         color:'var(--green)'  };
  if (bmi < 30)   return { label:'Overweight',            color:'var(--orange)' };
  return                  { label:'Obese',                color:'var(--red)'    };
}

function Gauge({ bmi, color }) {
  const pct = Math.min(Math.max(((bmi - 15) / 25) * 100, 0), 100);
  return (
    <div style={{ margin:'20px 0' }}>
      <div style={{ height:'8px', background:'var(--bg-elevated)', borderRadius:'4px', position:'relative', overflow:'hidden' }}>
        {[['var(--cyan)',23],['var(--green)',19],['var(--orange)',20],['var(--red)',38]].reduce((acc, [c, w], i, arr) => {
          const start = arr.slice(0,i).reduce((s,[,w])=>s+w,0);
          acc.push(<div key={i} style={{ position:'absolute', top:0, bottom:0, left:`${start}%`, width:`${w}%`, background:c, opacity:0.3 }} />);
          return acc;
        }, [])}
        <div style={{ position:'absolute', top:'-4px', bottom:'-4px', width:'3px', background:color, left:`${pct}%`, transform:'translateX(-50%)', borderRadius:'2px', boxShadow:`0 0 8px ${color}` }} />
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:'6px' }}>
        {['15','18.5','25','30','40'].map(v => (
          <span key={v} style={{ fontFamily:'var(--ff-mono)', fontSize:'0.62rem', color:'var(--text-3)' }}>{v}</span>
        ))}
      </div>
    </div>
  );
}

export default function CalculatorPage() {
  const [unit,  setUnit]  = useState('metric');
  const [mode,  setMode]  = useState('bmi');
  const [bmiF,  setBmiF]  = useState({ height:'', weight:'' });
  const [calF,  setCalF]  = useState({ height:'', weight:'', age:'', gender:'male', activity:'1.375' });
  const [bmiR,  setBmiR]  = useState(null);
  const [calR,  setCalR]  = useState(null);

  const hLabel = unit==='imperial' ? 'inches' : 'cm';
  const wLabel = unit==='imperial' ? 'lbs'    : 'kg';

  const calcBMI = (e) => {
    e.preventDefault();
    const { height, weight } = toMetric(bmiF.height, bmiF.weight, unit);
    if (!height || !weight) return;
    const bmi = weight / Math.pow(height/100, 2);
    const cat = bmiCat(bmi);
    setBmiR({ bmi: bmi.toFixed(1), ...cat,
      idealMin: (18.5 * Math.pow(height/100, 2)).toFixed(1),
      idealMax: (24.9 * Math.pow(height/100, 2)).toFixed(1) });
  };

  const calcCal = (e) => {
    e.preventDefault();
    const { height, weight } = toMetric(calF.height, calF.weight, unit);
    const age  = parseFloat(calF.age);
    const act  = parseFloat(calF.activity);
    if (!height || !weight || !age) return;
    const bmr  = calF.gender==='male'
      ? 10*weight + 6.25*height - 5*age + 5
      : 10*weight + 6.25*height - 5*age - 161;
    const tdee = bmr * act;
    setCalR({
      bmr:   Math.round(bmr),
      tdee:  Math.round(tdee),
      cut:   Math.round(tdee - 500),
      aggCut:Math.round(tdee - 1000),
      bulk:  Math.round(tdee + 300),
      aggBulk:Math.round(tdee + 500),
      protein:Math.round(weight * 2.2),
      carbs:  Math.round((tdee * 0.45) / 4),
      fats:   Math.round((tdee * 0.25) / 9),
    });
  };

  const row = (label, val, color) => (
    <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 14px', background:`${color}07`, border:`1px solid ${color}20`, borderRadius:'var(--r-sm)' }}>
      <span style={{ color:'var(--text-2)', fontSize:'0.85rem' }}>{label}</span>
      <span style={{ fontFamily:'var(--ff-display)', fontSize:'0.95rem', color }}>{val} kcal</span>
    </div>
  );

  return (
    <div className="page">
      <div className="container" style={{ maxWidth:'860px' }}>
        <div style={{ marginBottom:'32px' }} className="fade-up">
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'8px' }}>
            <FiActivity size={22} style={{ color:'var(--orange)' }} />
            <h1 className="sec-title">FITNESS <span>CALCULATOR</span></h1>
          </div>
          <p className="sec-sub">Calculate your BMI, daily calories, and optimal macros</p>
        </div>

        {/* Unit + Mode toggles */}
        <div className="fade-up-1" style={{ display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'22px' }}>
          {['metric','imperial'].map(u => (
            <button key={u} onClick={() => setUnit(u)} className={`btn btn-sm ${unit===u?'btn-primary':'btn-secondary'}`}>
              {u==='metric' ? 'Metric (kg/cm)' : 'Imperial (lbs/in)'}
            </button>
          ))}
          <div style={{ width:'1px', background:'var(--border-dim)', margin:'0 4px' }} />
          {[['bmi','BMI Calculator'],['calories','Calorie Calculator']].map(([k,l]) => (
            <button key={k} onClick={() => setMode(k)} className={`btn btn-sm ${mode===k?'btn-primary':'btn-secondary'}`}>{l}</button>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns: (bmiR||calR) ? '1fr 1fr' : '1fr', gap:'24px' }}>

          {/* BMI Form */}
          {mode==='bmi' && (
            <div className="card fade-up-2" style={{ padding:'34px' }}>
              <h2 style={{ fontFamily:'var(--ff-display)', fontSize:'0.7rem', letterSpacing:'0.2em', color:'var(--cyan)', textTransform:'uppercase', marginBottom:'22px' }}>BMI Calculator</h2>
              <form onSubmit={calcBMI} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                <div className="grid-2" style={{ gap:'14px' }}>
                  <div className="form-group">
                    <label className="form-label">Height ({hLabel})</label>
                    <input type="number" className="form-input" required placeholder={unit==='metric'?'175':'69'}
                      value={bmiF.height} onChange={e=>setBmiF(f=>({...f,height:e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Weight ({wLabel})</label>
                    <input type="number" className="form-input" required placeholder={unit==='metric'?'75':'165'}
                      value={bmiF.weight} onChange={e=>setBmiF(f=>({...f,weight:e.target.value}))} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-full"><FiTarget /> Calculate BMI</button>
              </form>

              {/* BMI reference table */}
              <div style={{ marginTop:'24px', padding:'18px', background:'rgba(0,245,255,0.04)', borderRadius:'var(--r-sm)', border:'1px solid var(--border-dim)' }}>
                <div style={{ display:'flex', gap:'8px', alignItems:'center', marginBottom:'12px' }}>
                  <FiInfo size={13} style={{ color:'var(--cyan)' }} />
                  <p style={{ fontFamily:'var(--ff-display)', fontSize:'0.58rem', letterSpacing:'0.12em', color:'var(--cyan)', textTransform:'uppercase' }}>Reference Ranges</p>
                </div>
                {[['< 18.5','Underweight','var(--cyan)'],['18.5–24.9','Normal','var(--green)'],['25–29.9','Overweight','var(--orange)'],['≥ 30','Obese','var(--red)']].map(([range,label,color]) => (
                  <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid var(--border-dim)' }}>
                    <span style={{ fontFamily:'var(--ff-mono)', fontSize:'0.78rem', color:'var(--text-3)' }}>{range}</span>
                    <span style={{ fontFamily:'var(--ff-display)', fontSize:'0.68rem', color }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Calorie Form */}
          {mode==='calories' && (
            <div className="card fade-up-2" style={{ padding:'34px' }}>
              <h2 style={{ fontFamily:'var(--ff-display)', fontSize:'0.7rem', letterSpacing:'0.2em', color:'var(--orange)', textTransform:'uppercase', marginBottom:'22px' }}>Calorie Calculator</h2>
              <form onSubmit={calcCal} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                <div className="grid-2" style={{ gap:'14px' }}>
                  <div className="form-group">
                    <label className="form-label">Age</label>
                    <input type="number" className="form-input" required placeholder="25" min="15" max="100"
                      value={calF.age} onChange={e=>setCalF(f=>({...f,age:e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select className="form-select" value={calF.gender} onChange={e=>setCalF(f=>({...f,gender:e.target.value}))}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Height ({hLabel})</label>
                    <input type="number" className="form-input" required placeholder={unit==='metric'?'175':'69'}
                      value={calF.height} onChange={e=>setCalF(f=>({...f,height:e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Weight ({wLabel})</label>
                    <input type="number" className="form-input" required placeholder={unit==='metric'?'75':'165'}
                      value={calF.weight} onChange={e=>setCalF(f=>({...f,weight:e.target.value}))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Activity Level</label>
                  {ACTIVITY.map(a => (
                    <label key={a.val} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px', marginBottom:'6px', cursor:'pointer', borderRadius:'var(--r-sm)', border:`1px solid ${calF.activity===a.val?'var(--orange)':'var(--border-dim)'}`, background:calF.activity===a.val?'rgba(255,107,53,0.09)':'transparent', transition:'var(--ease)' }}>
                      <input type="radio" name="activity" value={a.val} checked={calF.activity===a.val} onChange={e=>setCalF(f=>({...f,activity:e.target.value}))} style={{ accentColor:'var(--orange)' }} />
                      <div>
                        <p style={{ fontFamily:'var(--ff-display)', fontSize:'0.68rem', letterSpacing:'0.06em' }}>{a.label}</p>
                        <p style={{ color:'var(--text-3)', fontSize:'0.78rem' }}>{a.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <button type="submit" className="btn btn-full" style={{ background:'linear-gradient(135deg,var(--orange),#aa4400)', color:'#fff', boxShadow:'var(--glow-o)', fontFamily:'var(--ff-display)', fontSize:'0.72rem', letterSpacing:'0.12em', padding:'13px', borderRadius:'var(--r-sm)', border:'none', cursor:'pointer' }}>
                  <FiZap /> Calculate Calories
                </button>
              </form>
            </div>
          )}

          {/* BMI Result */}
          {mode==='bmi' && bmiR && (
            <div className="card fade-in" style={{ padding:'34px' }}>
              <h2 style={{ fontFamily:'var(--ff-display)', fontSize:'0.7rem', letterSpacing:'0.2em', color:'var(--text-2)', textTransform:'uppercase', marginBottom:'22px' }}>Your Results</h2>
              <div style={{ textAlign:'center', marginBottom:'22px' }}>
                <div style={{ fontFamily:'var(--ff-display)', fontSize:'5rem', fontWeight:900, color:bmiR.color, textShadow:`0 0 40px ${bmiR.color}60`, lineHeight:1 }}>{bmiR.bmi}</div>
                <div style={{ fontFamily:'var(--ff-display)', fontSize:'0.78rem', letterSpacing:'0.15em', color:bmiR.color, marginTop:'8px', textTransform:'uppercase' }}>{bmiR.label}</div>
              </div>
              <Gauge bmi={parseFloat(bmiR.bmi)} color={bmiR.color} />
              <div style={{ padding:'18px', background:'rgba(0,255,136,0.05)', border:'1px solid rgba(0,255,136,0.2)', borderRadius:'var(--r-sm)', marginTop:'18px' }}>
                <p style={{ fontFamily:'var(--ff-display)', fontSize:'0.58rem', letterSpacing:'0.15em', color:'var(--green)', textTransform:'uppercase', marginBottom:'8px' }}>Ideal Weight Range</p>
                <p style={{ fontFamily:'var(--ff-display)', fontSize:'1.4rem', color:'var(--text-1)' }}>
                  {bmiR.idealMin}–{bmiR.idealMax} <span style={{ fontSize:'0.78rem', color:'var(--text-3)' }}>kg</span>
                </p>
                <p style={{ color:'var(--text-3)', fontSize:'0.8rem', marginTop:'5px' }}>Based on BMI 18.5–24.9 for your height</p>
              </div>
              <p style={{ color:'var(--text-3)', fontSize:'0.8rem', lineHeight:1.6, marginTop:'14px' }}>
                BMI is a screening tool. Muscle mass, age, and ethnicity can affect interpretation.
              </p>
            </div>
          )}

          {/* Calorie Result */}
          {mode==='calories' && calR && (
            <div className="card fade-in" style={{ padding:'34px' }}>
              <h2 style={{ fontFamily:'var(--ff-display)', fontSize:'0.7rem', letterSpacing:'0.2em', color:'var(--text-2)', textTransform:'uppercase', marginBottom:'22px' }}>Your Results</h2>
              <div style={{ textAlign:'center', marginBottom:'22px', padding:'18px', background:'rgba(255,107,53,0.08)', border:'1px solid rgba(255,107,53,0.25)', borderRadius:'var(--r-md)' }}>
                <p style={{ fontFamily:'var(--ff-display)', fontSize:'0.58rem', letterSpacing:'0.2em', color:'var(--orange)', textTransform:'uppercase', marginBottom:'5px' }}>Daily Maintenance (TDEE)</p>
                <div style={{ fontFamily:'var(--ff-display)', fontSize:'3.4rem', fontWeight:900, color:'var(--orange)', textShadow:'var(--glow-o)', lineHeight:1 }}>{calR.tdee}</div>
                <p style={{ color:'var(--text-3)', fontSize:'0.8rem', marginTop:'5px' }}>BMR: {calR.bmr} kcal</p>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'18px' }}>
                {row('Aggressive Cut (–1kg/wk)', calR.aggCut, 'var(--red)'   )}
                {row('Fat Loss (–0.5kg/wk)',      calR.cut,    'var(--cyan)'  )}
                {row('Maintenance',               calR.tdee,   'var(--green)' )}
                {row('Lean Bulk (+0.3kg/wk)',      calR.bulk,   'var(--orange)')}
                {row('Aggressive Bulk',            calR.aggBulk,'var(--purple)')}
              </div>

              <div style={{ padding:'18px', background:'rgba(191,90,242,0.06)', border:'1px solid rgba(191,90,242,0.2)', borderRadius:'var(--r-sm)' }}>
                <p style={{ fontFamily:'var(--ff-display)', fontSize:'0.58rem', letterSpacing:'0.15em', color:'var(--purple)', textTransform:'uppercase', marginBottom:'14px' }}>Macros at Maintenance</p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px' }}>
                  {[['Protein','var(--cyan)',calR.protein,'g'],['Carbs','var(--orange)',calR.carbs,'g'],['Fats','var(--green)',calR.fats,'g']].map(([l,c,v,u])=>(
                    <div key={l} style={{ textAlign:'center' }}>
                      <div style={{ fontFamily:'var(--ff-display)', fontSize:'1.6rem', fontWeight:700, color:c, lineHeight:1 }}>{v}</div>
                      <div style={{ fontFamily:'var(--ff-mono)', fontSize:'0.68rem', color:'var(--text-3)', marginTop:'2px' }}>{u}</div>
                      <div style={{ fontFamily:'var(--ff-display)', fontSize:'0.58rem', letterSpacing:'0.1em', color:'var(--text-3)', textTransform:'uppercase', marginTop:'4px' }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
