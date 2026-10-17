import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const StudyPlanner = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="px-4">
      <h1>Study Planner</h1>
      <div>
        <Calendar onChange={setDate} value={date} />
      </div>

      <div className="flex space-x-4">
        <div>
          <input
            type="time"
            className="rounded-lg border border-gray-300 p-2"
          />
          <label htmlFor="time" className="ml-2">
            Start Time
          </label>
        </div>
        <div>
          <input
            type="time"
            className="rounded-lg border border-gray-300 p-2"
          />
          <label htmlFor="time" className="ml-2">
            End Time
          </label>
        </div>
      </div>
      <div>
        <input
          type="text"
          placeholder="Enter your study task"
          className="border border-gray-300 rounded-md p-2 mb-4 w-64"
        />
        <button className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600">
          Add Task
        </button>
      </div>
    </div>
  );
};

export default StudyPlanner;
