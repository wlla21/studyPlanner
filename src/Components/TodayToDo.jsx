import { useState } from "react";
import { ArrowRight, CheckCircle2, Circle, ListChecks } from "lucide-react";
import { Link } from "react-router-dom";

const getTodayKey = () => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `study-planner-${date.getFullYear()}-${month}-${day}`;
};

const getTodayTasks = () => {
  try {
    const saved = localStorage.getItem(getTodayKey());
    const tasks = saved ? JSON.parse(saved) : [];
    return {
      tasks: Array.isArray(tasks) ? tasks : [],
      error: "",
    };
  } catch (error) {
    return {
      tasks: [],
      error:
        error instanceof Error
          ? `Could not load today's tasks: ${error.message}`
          : "Could not load today's tasks.",
    };
  }
};

const TodayToDo = () => {
  const [{ tasks, error }] = useState(getTodayTasks);
  const sortedTasks = [...tasks].sort((a, b) =>
    a.startTime.localeCompare(b.startTime),
  );
  const today = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <section className="today-card" aria-labelledby="today-heading">
      <header className="today-card-header">
        <div>
          <h2 id="today-heading">Today’s plan</h2>
          <p className="dashboard-section-caption">Your study blocks at a glance</p>
        </div>
        <span className="today-date-label">{today}</span>
      </header>

      {error ? (
        <p role="alert" className="p-5 text-sm text-red-600">
          {error}
        </p>
      ) : sortedTasks.length === 0 ? (
        <div className="today-empty">
          <div>
            <ListChecks className="mx-auto text-gray-400" size={26} />
            <p>Your day is open. Add a study block whenever you’re ready.</p>
            <Link to="/study-planner">
              Plan a study block <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="today-task-list">
          {sortedTasks.map((task) => (
            <div className="today-task" key={task.id}>
              <span className="today-task-time">{task.startTime}</span>
              <span className="today-task-name">{task.text}</span>
              <span
                className={`today-task-status${task.done ? " done" : ""}`}
              >
                {task.done ? (
                  <>
                    <CheckCircle2 className="mr-1 inline" size={13} />
                    Done
                  </>
                ) : (
                  <>
                    <Circle className="mr-1 inline" size={13} />
                    Planned
                  </>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default TodayToDo;
