import { useState } from "react";

export default function WorkoutList({ title, workouts }) {
  const [items, setItems] = useState(
    workouts.map(w => ({ ...w, completed: false }))
  );

  function toggleWorkout(index) {
    setItems(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, completed: !item.completed } : item
      )
    );
  }

  return (
    <div className="workout-section">
      <h2>{title}</h2>

      <div className="workout-list">
        {items.map((workout, index) => (
          <div
            key={index}
            className={`workout-item ${workout.completed ? "done" : ""}`}
            onClick={() => toggleWorkout(index)}
          >
            <span>
              <input
                type="checkbox"
                checked={workout.completed}
                readOnly
              />{" "}
              {workout.name}
            </span>

            <span>{workout.sets}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
