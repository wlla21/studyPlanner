import React from "react";
import SideBar from "../Components/SideBar";
import { Outlet, Link } from "react-router-dom";
const Home = () => {
  return (
    <div>
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <h1>Study Planner</h1>
        <div className="flex">
          <Link to="/signup" className="no-underline">
            Sign Up
          </Link>
          <Link to="/login" className="no-underline">
            Login
          </Link>
        </div>
      </nav>
      <div className="flex">
        <SideBar />

        <main className="min-w-0 flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Home;
