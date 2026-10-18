import Home from "./Pages/Home";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import StudyPlanner from "./Pages/StudyPlanner";
import Pomodoro from "./Pages/Pomodoro";
import Dashboard from "./Pages/Dashboard";
import Note from "./Pages/Note";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Dashboard />} />
          <Route path="study-planner" element={<StudyPlanner />} />
          <Route path="pomodoro" element={<Pomodoro />} />
          <Route path="note" element={<Note />} />
        </Route>

        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
