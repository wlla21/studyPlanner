import {
  BookOpen,
  BookOpenCheck,
  CalendarDays,
  Clock3,
  LayoutDashboard,
  NotebookPen,
  SunMedium,
} from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useState } from "react";

const navigation = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/daily-planner", label: "Daily planner", icon: SunMedium },
  { to: "/study-planner", label: "Study planner", icon: BookOpen },
  { to: "/pomodoro", label: "Focus timer", icon: Clock3 },
  { to: "/note", label: "My notes", icon: NotebookPen },
];

const Home = () => {
  const [today] = useState(() =>
    new Intl.DateTimeFormat("en", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(new Date()),
  );

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="app-brand">
          <span className="app-brand-mark" aria-hidden="true">
            <BookOpenCheck size={21} />
          </span>
          <span>
            <span className="app-brand-name block">Study Planner</span>
            <span className="app-brand-caption block">
              A gentler way to stay on track
            </span>
          </span>
        </Link>

        <div className="app-header-right">
          <Link to="/login" className="app-auth-link">
            Log in
          </Link>
          <Link to="/signup" className="app-auth-link app-auth-link-primary">
            Sign up
          </Link>
        </div>
      </header>

      <div className="app-layout">
        <aside className="app-sidebar">
          <p className="app-sidebar-label">Your space</p>
          <nav className="app-nav" aria-label="Main navigation">
            {navigation.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `app-nav-link${isActive ? " active" : ""}`
                }
              >
                <span
                  aria-hidden="true"
                  className="grid w-5 place-items-center"
                >
                  <Icon size={18} strokeWidth={1.8} />
                </span>
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="app-sidebar-note">
            <strong>A small reminder</strong>
            Progress grows one gentle step at a time. Take a breath and begin
            where you are.
          </div>
        </aside>

        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Home;
