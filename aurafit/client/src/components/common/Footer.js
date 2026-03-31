import React from 'react';
import { Link } from 'react-router-dom';
import { FiZap } from 'react-icons/fi';

const col = (links) => links.map(([label, to]) => (
  <Link key={to} to={to} style={{
    display:'block', color:'var(--text-3)', textDecoration:'none',
    marginBottom:'10px', fontSize:'0.9rem', transition:'color 0.2s'
  }}
    onMouseEnter={e => e.target.style.color = 'var(--cyan)'}
    onMouseLeave={e => e.target.style.color = 'var(--text-3)'}
  >{label}</Link>
));

export default function Footer() {
  return (
    <footer style={{ borderTop:'1px solid var(--border-dim)', background:'rgba(6,12,20,0.8)', padding:'48px 0 24px', marginTop:'80px' }}>
      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'40px', marginBottom:'40px' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'14px' }}>
              <FiZap style={{ color:'var(--cyan)', filter:'drop-shadow(0 0 8px var(--cyan))' }} size={20} />
              <span style={{ fontFamily:'var(--ff-display)', fontWeight:900, fontSize:'1.1rem', letterSpacing:'0.1em' }}>
                AURA<span style={{ color:'var(--cyan)' }}>FIT</span>
              </span>
            </div>
            <p style={{ color:'var(--text-3)', fontSize:'0.88rem', lineHeight:1.7 }}>
              The next generation fitness platform. Train smarter, track deeper, evolve faster.
            </p>
          </div>
          <div>
            <h4 style={{ fontFamily:'var(--ff-display)', fontSize:'0.62rem', letterSpacing:'0.15em', color:'var(--text-2)', textTransform:'uppercase', marginBottom:'14px' }}>Platform</h4>
            {col([['Exercises','/exercises'],['Programs','/workouts'],['Calculator','/calculator'],['Dashboard','/dashboard']])}
          </div>
          <div>
            <h4 style={{ fontFamily:'var(--ff-display)', fontSize:'0.62rem', letterSpacing:'0.15em', color:'var(--text-2)', textTransform:'uppercase', marginBottom:'14px' }}>Account</h4>
            {col([['Login','/login'],['Register','/register'],['Profile','/profile'],['Progress','/progress']])}
          </div>
        </div>
        <div className="divider" />
        <p style={{ color:'var(--text-3)', fontSize:'0.78rem', fontFamily:'var(--ff-mono)', textAlign:'center' }}>
          © {new Date().getFullYear()} AURAFIT — Your ultimate fitness companion. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
