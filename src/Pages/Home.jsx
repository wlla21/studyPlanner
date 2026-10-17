import React from "react";
import SideBar from "../Components/SideBar";
import StudyPlanner from "./StudyPlanner";
import Pomodoro from "./Pomodoro";
import Dashboard from "./Dashboard";
import Note from "./Note";
import { Routes, Route } from "react-router-dom";
const Home = () => {
  return (
    <div className="flex">
      <SideBar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/study-planner" element={<StudyPlanner />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/note" element={<Note />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
