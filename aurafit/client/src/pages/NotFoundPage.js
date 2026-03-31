import React from 'react';
import { Link } from 'react-router-dom';
import { FiZap, FiHome, FiArrowLeft } from 'react-icons/fi';

export default function NotFoundPage() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'0 24px', position:'relative' }}>
      {/* Ambient glow */}
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'600px', height:'400px', background:'radial-gradient(ellipse, rgba(0,245,255,0.06), transparent 70%)', pointerEvents:'none' }} />

      <div style={{ textAlign:'center', maxWidth:'480px', position:'relative', zIndex:1 }} className="fade-up">
        {/* Big 404 */}
        <div style={{ position:'relative', marginBottom:'28px' }}>
          <div style={{ fontFamily:'var(--ff-display)', fontSize:'clamp(6rem,20vw,10rem)', fontWeight:900, letterSpacing:'-0.02em', lineHeight:1,
            color:'transparent', WebkitTextStroke:'2px var(--border-glow)' }}>
            404
          </div>
          {/* Ghost layer */}
          <div style={{ position:'absolute', inset:0, fontFamily:'var(--ff-display)', fontSize:'clamp(6rem,20vw,10rem)', fontWeight:900, letterSpacing:'-0.02em', lineHeight:1,
            color:'var(--cyan)', opacity:0.12, transform:'translate(4px,4px)', pointerEvents:'none' }}>
            404
          </div>
        </div>

        <FiZap size={30} style={{ color:'var(--cyan)', marginBottom:'18px', filter:'drop-shadow(0 0 12px var(--cyan))' }} />

        <h1 style={{ fontFamily:'var(--ff-display)', fontSize:'1.1rem', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:'14px' }}>
          Signal Lost
        </h1>
        <p style={{ color:'var(--text-2)', fontSize:'1rem', lineHeight:1.7, marginBottom:'32px' }}>
          The page you're looking for doesn't exist in the AURAFIT network. The route may have been moved or never existed.
        </p>

        <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
          <Link to="/" className="btn btn-primary"><FiHome /> Return Home</Link>
          <button onClick={() => window.history.back()} className="btn btn-secondary"><FiArrowLeft /> Go Back</button>
        </div>
      </div>
    </div>
  );
}
