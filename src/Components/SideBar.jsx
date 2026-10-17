import React from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div>
      <aside>
        <div className="h-full overflow-y-auto border-r border-gray-200 bg-gray-50 px-3 py-4">
          <ul className="space-y-2 font-medium list-none">
            <li>
              <Link
                to="/"
                className="no-underline block rounded-lg p-3 hover:bg-gray-200"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/study-planner"
                className="no-underline block rounded-lg p-3 hover:bg-gray-200"
              >
                Study Planner
              </Link>
            </li>
            <li>
              <Link
                to="/pomodoro"
                className="no-underline block rounded-lg p-3 hover:bg-gray-200"
              >
                Pomodoro
              </Link>
            </li>
            <li>
              <Link
                to="/note"
                className="no-underline block rounded-lg p-3 hover:bg-gray-200"
              >
                Note
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default SideBar;
