import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { workoutAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { FiArrowLeft, FiCalendar, FiClock, FiUsers, FiZap, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const DC = { beginner:'var(--green)', intermediate:'var(--cyan)', advanced:'var(--orange)', elite:'var(--red)' };

export default function WorkoutDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [plan,      setPlan]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    workoutAPI.getOne(id)
      .then(({ data }) => setPlan(data.plan))
      .finally(() => setLoading(false));
  }, [id]);

  const isEnrolled = plan?.enrolledUsers?.some(u => (u._id || u) === user?._id);

  const handleEnroll = async () => {
    if (!user) { toast.error('Please login to enroll'); return; }
    setEnrolling(true);
    try {
      const { data } = await workoutAPI.enroll(id);
      setPlan(data.plan);
      toast.success('Enrolled successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    } finally { setEnrolling(false); }
  };

  if (loading) return <div className="loading-screen"><div className="loading-ring" /></div>;
  if (!plan)   return <div className="page flex-center"><p style={{ color:'var(--text-3)' }}>Program not found</p></div>;

  const day = plan.schedule?.[activeDay];
  const dc  = DC[plan.difficulty];

  return (
    <div className="page">
      <div className="container">
        <Link to="/workouts" className="btn btn-secondary btn-sm fade-up" style={{ marginBottom:'28px' }}>
          <FiArrowLeft /> All Programs
        </Link>

        {/* Header */}
        <div className="card fade-up-1" style={{ padding:'36px', marginBottom:'20px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'20px' }}>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', gap:'10px', marginBottom:'14px', flexWrap:'wrap' }}>
                <span className="badge badge-cyan">{plan.category?.replace('_',' ')}</span>
                <span className="badge" style={{ color:dc, background:`${dc}15`, border:`1px solid ${dc}30` }}>{plan.difficulty}</span>
              </div>
              <h1 style={{ fontFamily:'var(--ff-display)', fontSize:'clamp(1.3rem,4vw,2rem)', fontWeight:700, marginBottom:'14px' }}>{plan.title}</h1>
              <p style={{ color:'var(--text-2)', lineHeight:1.8, maxWidth:'580px', marginBottom:'22px' }}>{plan.description}</p>

              <div style={{ display:'flex', gap:'32px', flexWrap:'wrap' }}>
                {[
                  [FiClock,    'Duration',  `${plan.durationWeeks} Weeks`],
                  [FiCalendar, 'Frequency', `${plan.daysPerWeek}x / Week`],
                  [FiUsers,    'Enrolled',  plan.enrolledUsers?.length || 0],
                ].map(([Icon, label, val]) => (
                  <div key={label}>
                    <p style={{ fontFamily:'var(--ff-display)', fontSize:'0.56rem', letterSpacing:'0.15em', color:'var(--text-3)', textTransform:'uppercase', marginBottom:'6px' }}>{label}</p>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      <Icon size={15} style={{ color:'var(--cyan)' }} />
                      <span style={{ fontFamily:'var(--ff-display)', fontSize:'0.95rem' }}>{val}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              {isEnrolled ? (
                <div style={{ display:'flex', flexDirection:'column', gap:'10px', alignItems:'flex-end' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', color:'var(--green)', fontFamily:'var(--ff-display)', fontSize:'0.68rem', letterSpacing:'0.1em' }}>
                    <FiCheck /> ENROLLED
                  </div>
                  <Link to="/progress" className="btn btn-primary"><FiZap /> Log Today</Link>
                </div>
              ) : (
                <button className="btn btn-primary btn-lg" onClick={handleEnroll} disabled={enrolling}>
                  <FiZap /> {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Schedule */}
        {plan.schedule?.length > 0 && (
          <div className="fade-up-2">
            <p style={{ fontFamily:'var(--ff-display)', fontSize:'0.62rem', letterSpacing:'0.2em', color:'var(--text-2)', textTransform:'uppercase', marginBottom:'16px' }}>
              Weekly Schedule
            </p>

            {/* Day tabs */}
            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'20px' }}>
              {plan.schedule.map((d, i) => (
                <button key={i} onClick={() => setActiveDay(i)}
                  className={`btn btn-sm ${activeDay===i ? 'btn-primary' : 'btn-secondary'}`}>
                  {d.dayName || `Day ${d.dayNumber}`}
                  {d.isRestDay && ' 😴'}
                </button>
              ))}
            </div>

            {/* Day detail */}
            {day && (
              <div className="card" style={{ padding:'30px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'22px', flexWrap:'wrap', gap:'12px' }}>
                  <div>
                    <h3 style={{ fontFamily:'var(--ff-display)', fontSize:'0.95rem', marginBottom:'6px' }}>
                      {day.dayName || `Day ${day.dayNumber}`}
                      {day.focus && <span style={{ color:'var(--cyan)' }}> — {day.focus}</span>}
                    </h3>
                    {day.isRestDay && <p style={{ color:'var(--green)' }}>Rest & Recovery Day</p>}
                  </div>
                  {day.estimatedDuration && (
                    <div style={{ display:'flex', alignItems:'center', gap:'6px', color:'var(--text-3)', fontFamily:'var(--ff-mono)', fontSize:'0.82rem' }}>
                      <FiClock size={13} /> ~{day.estimatedDuration} min
                    </div>
                  )}
                </div>

                {day.isRestDay ? (
                  <p style={{ color:'var(--text-2)', textAlign:'center', padding:'40px 0' }}>Recovery is where growth happens. Rest up! 💪</p>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                    {day.exercises?.map((ex, i) => (
                      <div key={i} style={{
                        display:'flex', alignItems:'center', gap:'14px', padding:'14px 18px',
                        background:'rgba(0,245,255,0.03)', border:'1px solid var(--border-dim)',
                        borderRadius:'var(--r-sm)'
                      }}>
                        <div style={{ width:'30px', height:'30px', borderRadius:'50%', background:'rgba(0,245,255,0.1)', border:'1px solid var(--border-glow)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--ff-mono)', fontSize:'0.72rem', color:'var(--cyan)', flexShrink:0 }}>
                          {i+1}
                        </div>
                        <div style={{ flex:1 }}>
                          <p style={{ fontFamily:'var(--ff-display)', fontSize:'0.78rem', letterSpacing:'0.05em', marginBottom:'3px' }}>
                            {ex.exercise?.name || 'Exercise'}
                          </p>
                          <p style={{ color:'var(--text-3)', fontSize:'0.8rem' }}>
                            {ex.sets} sets × {ex.reps}{ex.restTime ? ` · ${ex.restTime}s rest` : ''}
                          </p>
                        </div>
                        {ex.exercise && (
                          <Link to={`/exercises/${ex.exercise._id}`} className="btn btn-secondary btn-sm">View</Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {plan.tags?.length > 0 && (
          <div className="fade-up-3" style={{ marginTop:'20px', display:'flex', gap:'8px', flexWrap:'wrap' }}>
            {plan.tags.map(t => (
              <span key={t} style={{ padding:'5px 14px', background:'rgba(255,255,255,0.04)', border:'1px solid var(--border-dim)', borderRadius:'20px', fontSize:'0.78rem', color:'var(--text-3)', fontFamily:'var(--ff-mono)' }}>
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
