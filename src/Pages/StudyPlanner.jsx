import { useState, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const StudyPlanner = () => {
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const noteInputRef = useRef(null);
  const startTimeInputRef = useRef(null);
  const endTimeInputRef = useRef(null);
  const existingNotes = JSON.parse(localStorage.getItem("notes") || "[]");
  const handleSignUp = (e) => {
    e.preventDefault();

    const newNote = {
      date,
      text: note,
      startTime,
      endTime,
    };

    existingNotes.push(newNote);

    localStorage.setItem("notes", JSON.stringify(existingNotes));

    setNote("");
    setStartTime("");
    setEndTime("");
  };

  return (
    <div className="px-4">
      <h1>Study Planner</h1>
      <div>
        <Calendar onChange={setDate} value={date} />
      </div>
      <form>
        <div className="flex space-x-4">
          <div>
            <input
              type="time"
              ref={startTimeInputRef}
              onChange={(e) => setStartTime(e.target.value)}
              className="rounded-lg border border-gray-300 p-2"
            />
            <label htmlFor="time" className="ml-2">
              Start Time
            </label>
          </div>
          <div>
            <input
              type="time"
              ref={endTimeInputRef}
              onChange={(e) => setEndTime(e.target.value)}
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
            ref={noteInputRef}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter your study task"
            className="border border-gray-300 rounded-md p-2 mb-4 w-64"
          />
          <button
            onClick={handleSignUp}
            className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
          >
            Add Task
          </button>
        </div>
      </form>
      <table>
        <tr>
          <th>Study Task</th>
          <th>Date</th>
          <th>Start Time</th>
        </tr>
        {existingNotes.map((note, index) => (
          <tr key={index}>
            <td>{note.text}</td>
            <td>{new Date(note.date).toLocaleDateString()}</td>
            <td>{note.startTime}</td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default StudyPlanner;
