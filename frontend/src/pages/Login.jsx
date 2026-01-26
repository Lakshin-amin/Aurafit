import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // fake login for now
    localStorage.setItem("isLoggedIn", "true");
    navigate("/dashboard");
  };

  return (
    <>
      <h2>Login</h2>
      <p>Login to continue your fitness journey</p>

      <input placeholder="Email" />
      <input placeholder="Password" type="password" />
      <button onClick={handleLogin}>Login</button>

      <p>
        Don&apos;t have an account? <Link to="/register">Register</Link>
      </p>
    </>
  );
}
