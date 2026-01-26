import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <h1>Welcome to AuraFit 💪</h1>
      <p>Your AI-powered fitness companion</p>

      <button onClick={() => navigate("/register")}>
        Get Started
      </button>
    </>
  );
}
