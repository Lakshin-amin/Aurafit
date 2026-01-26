import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  const linkStyle = ({ isActive }) => ({
    fontWeight: isActive ? "bold" : "normal",
    textDecoration: "none",
    color: isActive ? "#fff" : "#ccc",
  });

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 32px",
        background: "#020617",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* Logo */}
      <h2 style={{ color: "#fff" }}>AuraFit</h2>

      {/* Links */}
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        {!isLoggedIn ? (
          <>
            <NavLink to="/" style={linkStyle}>
              Home
            </NavLink>
            <NavLink to="/login" style={linkStyle}>
              Login
            </NavLink>
            <NavLink to="/register" style={linkStyle}>
              Register
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/dashboard" style={linkStyle}>
              Dashboard
            </NavLink>

            <button
              onClick={handleLogout}
              style={{
                padding: "6px 14px",
                background: "#fff",
                color: "#000",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
