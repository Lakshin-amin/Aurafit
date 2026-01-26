import CountUp from "./CountUp";

export default function DashboardCard({
  title,
  value,
  subtitle,
  icon,
  suffix,
  variant = "indigo",
}) {
  return (
    <div className={`dashboard-card glow-${variant}`}>
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        <h3>{title}</h3>
      </div>

      <p className="card-value">
        <CountUp end={value} suffix={suffix} />
      </p>

      <span className="card-subtitle">{subtitle}</span>
    </div>
  );
}
