import {
  BookOpen,
  BookOpenCheck,
  Clock3,
  LayoutDashboard,
  NotebookPen,
  SunMedium,
} from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { CURRENT_USER_KEY } from "../auth";

const navigation = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/daily-planner", label: "Daily planner", icon: SunMedium },
  { to: "/study-planner", label: "Study planner", icon: BookOpen },
  { to: "/pomodoro", label: "Focus timer", icon: Clock3 },
  { to: "/note", label: "My notes", icon: NotebookPen },
];

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    navigate("/login", { replace: true });
  };

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
          <button
            type="button"
            onClick={handleLogout}
            className="app-auth-link"
          >
            Log out
          </button>
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
