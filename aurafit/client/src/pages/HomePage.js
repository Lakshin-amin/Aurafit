import React from 'react';
import { Link } from 'react-router-dom';
import { FiZap, FiTarget, FiTrendingUp, FiArrowRight, FiActivity } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

export default function HomePage() {
  const { user } = useAuth();
  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
        <div className="hero__scan" />
        <div className="container">
          <div className="hero__content">
            <div className="hero__badge fade-up">
              <FiActivity size={11} /> Next-Gen Fitness Platform
            </div>
            <h1 className="hero__title fade-up-1">
              UNLOCK YOUR<br /><span className="hero__accent">PEAK FORM</span>
            </h1>
            <p className="hero__sub fade-up-2">
              Science-backed programs. Real-time tracking. Unbreakable habits.<br />
              Train like an athlete. Recover like a pro. 
            </p>
            <div className="hero__actions fade-up-3">
              {user ? (
                <Link to="/dashboard" className="btn btn-primary btn-lg"><FiZap /> Dashboard <FiArrowRight /></Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg"><FiZap /> Start Free</Link>
                  <Link to="/workouts" className="btn btn-secondary btn-lg">Browse Programs</Link>
                </>
              )}
            </div>
            <div className="hero__stats fade-up-4">
              {[['500+','Exercises'],['50+','Programs'],['10K+','Athletes'],['99%','Success']].map(([v,l],i) => (
                <React.Fragment key={l}>
                  {i > 0 && <div className="hero__stat-div" />}
                  <div className="hero__stat">
                    <div className="hero__stat-val">{v}</div>
                    <div className="hero__stat-lbl">{l}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="container">
          <div className="text-center mb-32">
            <h2 className="sec-title">BUILT FOR <span>ELITE</span> PERFORMANCE</h2>
            <p className="sec-sub">Everything you need to transform your physique and performance</p>
          </div>
          <div className="grid-3">
            {[
              { icon:FiTarget,    title:'Exercise Library',  color:'var(--cyan)',   desc:'500+ exercises with step-by-step instructions, muscle diagrams, and pro tips.' },
              { icon:FiZap,       title:'Workout Programs',  color:'var(--green)',  desc:'Expertly designed plans from beginner to elite. Strength, HIIT, cardio and more.' },
              { icon:FiTrendingUp,title:'Progress Tracking', color:'var(--orange)', desc:'Log workouts, track metrics, visualize trends. Every PR recorded. Every gain celebrated.' },
            ].map(({ icon:Icon, title, color, desc }) => (
              <div key={title} className="feat-card card">
                <div className="feat-icon" style={{ color, boxShadow:`0 0 20px ${color}40` }}>
                  <Icon size={26} />
                </div>
                <h3 style={{ fontFamily:'var(--ff-display)', fontSize:'0.88rem', letterSpacing:'0.08em', marginBottom:'10px' }}>{title}</h3>
                <p style={{ color:'var(--text-2)', fontSize:'0.95rem', lineHeight:1.7, marginBottom:'18px' }}>{desc}</p>
                <div className="feat-line" style={{ background:color }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section style={{ padding:'60px 0 40px' }}>
          <div className="container">
            <div className="cta card">
              <div className="cta__glow" />
              <h2 style={{ fontFamily:'var(--ff-display)', fontSize:'clamp(1.8rem,4vw,2.8rem)', marginBottom:'14px',
                background:'linear-gradient(135deg,var(--text-1),var(--cyan))',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                READY TO EVOLVE?
              </h2>
              <p style={{ color:'var(--text-2)', fontSize:'1.05rem', maxWidth:'480px', margin:'0 auto' }}>
                Join thousands of athletes. Free forever. No credit card needed.
              </p>
              <div style={{ display:'flex', gap:'16px', justifyContent:'center', flexWrap:'wrap', marginTop:'32px' }}>
                <Link to="/register" className="btn btn-primary btn-lg"><FiZap /> Create Free Account</Link>
                <Link to="/exercises" className="btn btn-secondary btn-lg">Explore Exercises <FiArrowRight /></Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
