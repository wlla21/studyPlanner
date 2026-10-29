import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="h-full overflow-y-auto border-r border-gray-200 bg-gray-50 px-3 py-4">
      <ul className="list-none space-y-2 p-0">
        <li>
          <Link
            to="/"
            className="block rounded-lg p-3 no-underline hover:bg-gray-200"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/daily-planner"
            className="block rounded-lg p-3 no-underline hover:bg-gray-200"
          >
            Daily Planner
          </Link>
        </li>
        <li>
          <Link
            to="/study-planner"
            className="block rounded-lg p-3 no-underline hover:bg-gray-200"
          >
            Study Planner
          </Link>
        </li>

        <li>
          <Link
            to="/pomodoro"
            className="block rounded-lg p-3 no-underline hover:bg-gray-200"
          >
            Pomodoro
          </Link>
        </li>
        <li>
          <Link
            to="/note"
            className="block rounded-lg p-3 no-underline hover:bg-gray-200"
          >
            Note
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
