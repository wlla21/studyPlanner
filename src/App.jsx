import Home from "./Pages/Home";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import StudyPlanner from "./Pages/StudyPlanner";
import Pomodoro from "./Pages/Pomodoro";
import Dashboard from "./Pages/Dashboard";
import Note from "./Pages/Note";
import DailyPlanner from "./Pages/DailyPlanner";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { getCurrentUser } from "./auth";

const RequireAuth = () =>
  getCurrentUser() ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );

const GuestOnly = ({ children }) =>
  getCurrentUser() ? (
    <Navigate to="/" replace />
  ) : (
    children
  );

const App = () => {
  return (
    <div>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Home />}>
            <Route index element={<Dashboard />} />
            <Route path="study-planner" element={<StudyPlanner />} />
            <Route path="pomodoro" element={<Pomodoro />} />
            <Route path="note" element={<Note />} />
            <Route path="daily-planner" element={<DailyPlanner />} />
          </Route>
        </Route>

        <Route
          path="/signup"
          element={
            <GuestOnly>
              <SignUp />
            </GuestOnly>
          }
        />
        <Route
          path="/login"
          element={
            <GuestOnly>
              <Login />
            </GuestOnly>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
