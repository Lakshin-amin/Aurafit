import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiZap, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Signed out of AURAFIT');
    navigate('/');
    setOpen(false);
  };

  const links = [
    { to: '/exercises', label: 'Exercises' },
    { to: '/workouts',  label: 'Programs'  },
    { to: '/calculator',label: 'Calculator'},
    ...(user ? [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/progress',  label: 'Progress'  },
    ] : [])
  ];

  return (
    <nav className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <div className="nav__inner">

        <Link to="/" className="nav__logo">
          <FiZap className="nav__logo-icon" />
          AURA<span>FIT</span>
        </Link>

        <div className="nav__links">
          {links.map(l => (
            <NavLink key={l.to} to={l.to}
              className={({ isActive }) => `nav__link${isActive ? ' nav__link--active' : ''}`}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="nav__actions">
          {user ? (
            <>
              <Link to="/profile" className="nav__avatar">{user.name?.charAt(0).toUpperCase()}</Link>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                <FiLogOut size={13} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary   btn-sm">Join Free</Link>
            </>
          )}
        </div>

        <button className="nav__burger" onClick={() => setOpen(!open)}>
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {open && (
        <div className="nav__mobile">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} className="nav__mob-link" onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          <div className="nav__mob-auth">
            {user ? (
              <button onClick={handleLogout} className="btn btn-secondary w-full">
                <FiLogOut /> Logout
              </button>
            ) : (
              <>
                <Link to="/login"    className="btn btn-secondary w-full" onClick={() => setOpen(false)}>Login</Link>
                <Link to="/register" className="btn btn-primary   w-full" onClick={() => setOpen(false)}>Join Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
