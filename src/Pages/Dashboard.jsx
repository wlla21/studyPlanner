import { BookOpen, CalendarDays, Clock3, NotebookPen } from "lucide-react";
import { Link } from "react-router-dom";
import TodayToDo from "../Components/TodayToDo";
import WeeklyStudyCard from "../Components/WeeklyStudyCard";

const quickLinks = [
  {
    to: "/study-planner",
    label: "Study planner",
    detail: "Plan your study blocks",
    icon: BookOpen,
  },
  {
    to: "/daily-planner",
    label: "Daily planner",
    detail: "Care for your routines",
    icon: CalendarDays,
  },
  {
    to: "/pomodoro",
    label: "Focus timer",
    detail: "Settle into deep work",
    icon: Clock3,
  },
  {
    to: "/note",
    label: "My notes",
    detail: "Keep ideas in one place",
    icon: NotebookPen,
  },
];

const Dashboard = () => {
  const date = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <p className="dashboard-eyebrow">{date}</p>
        <h1 className="dashboard-title">Make room for what matters.</h1>
        <p className="dashboard-subtitle">
          A calm place to plan your studies, care for yourself, and celebrate
          the little things you get done.
        </p>
      </section>
      <section>
        <div>
          <WeeklyStudyCard />
        </div>
      </section>

      <section aria-labelledby="shortcuts-heading">
        <div className="mb-4">
          <h2 id="shortcuts-heading" className="dashboard-section-title">
            Your little toolkit
          </h2>
          <p className="dashboard-section-caption">
            Everything you need for a thoughtful day.
          </p>
        </div>
        <div className="dashboard-quick-links">
          {quickLinks.map(({ to, label, detail, icon: Icon }) => (
            <Link key={to} to={to} className="dashboard-quick-link">
              <span className="dashboard-quick-icon" aria-hidden="true">
                <Icon size={20} />
              </span>
              <span>
                <strong>{label}</strong>
                <small>{detail}</small>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <TodayToDo />
    </div>
  );
};

export default Dashboard;
