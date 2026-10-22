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
  const existingNotes = JSON.parse(
    localStorage.getItem(date.toDateString()) || "[]",
  );
  const handleSignUp = (e) => {
    e.preventDefault();

    const newNote = {
      text: note,
      startTime,
      endTime,
    };

    existingNotes.push(newNote);

    localStorage.setItem(date.toDateString(), JSON.stringify(existingNotes));

    setNote("");
    setStartTime("");
    setEndTime("");
  };

  return (
    <div>
      <h1>Study Planner</h1>
      <div className="flex gap-2 px-4"></div>
      <div className="my-2">
        <Calendar onChange={setDate} value={date} />
      </div>
      <div>
        <h1>{date.toDateString()}</h1>
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
          <div className="my-4">
            <input
              type="text"
              ref={noteInputRef}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter your study task"
              className="border border-gray-300 rounded-md p-2 mb-4 w-64 mr-2"
            />
            <button
              onClick={handleSignUp}
              className="text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 box-border border border-transparent font-medium leading-5 rounded-base text-sm px-4 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55"
            >
              Add Task
            </button>
          </div>
        </form>

        <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
          <table className="text-sm text-left rtl:text-right text-body">
            <thead className="bg-neutral-secondary-soft border-b border-default">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">
                  Study Task
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Start Time
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  End Time
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {existingNotes.map((note, index) => (
                <tr
                  className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default"
                  key={index}
                >
                  <td className="px-6 py-4">{note.text}</td>
                  <td className="px-6 py-4">
                    {new Date(note.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{note.startTime}</td>
                  <td className="px-6 py-4">
                    <a
                      href="#"
                      className="font-medium text-fg-brand hover:underline"
                    >
                      Edit
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;
