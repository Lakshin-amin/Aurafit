import DashboardCard from "../components/DashboardCard";
import WorkoutList from "../components/WorkoutList";

export default function Dashboard() {
 
 const todayWorkouts = [
  { name: "🔥 Push-ups", sets: "3 × 15" },
  { name: "🦵 Squats", sets: "4 × 12" },
  { name: "🧘 Plank", sets: "3 × 45s" },
  { name: "🏋️ Dumbbell Rows", sets: "3 × 12" },
  ];

  return (
    <div className="dashboard-page">
      <h1>Dashboard 🏋️</h1>
      <p className="dashboard-subtitle">
        Track your workouts, diet, and progress
      </p>

      {/* Cards Grid */}
      <div className="dashboard-grid">
        <DashboardCard
          title="Workouts"
          value={12}
          subtitle="Completed this month"
          icon="🔥"
          variant="orange"
        />

        <DashboardCard
          title="Calories"
          value={2100}
          subtitle="Avg per day"
          icon="🥗"
          suffix=" kcal"
          variant="green"
        />

        <DashboardCard
          title="Progress"
          value={6}
          subtitle="This month"
          icon="📈"
          suffix="%"
          variant="purple"
        />

        <DashboardCard
          title="Streak"
          value={5}
          subtitle="Current streak"
          icon="⚡"
          suffix=" days"
          variant="yellow"
        />
      </div>

      {/* Reusable Workout List */}
      <WorkoutList
       title="Today’s Workout 🏋️"
       workouts={todayWorkouts}
      />
    </div>
  );
}
