import React from "react";

const TodayToDo = () => {
  const today = new Date();
  const todayToDo = JSON.parse(
    localStorage.getItem(today.toDateString()) || "[]",
  );
  return (
    <div className="border-slate-300 border-1 rounded-2xl p-4">
      <h1>TODAY'S PLAN</h1>
      <table>
        {todayToDo.map((note, index) => (
          <tr key={index}>
            <td className="px-6 py-4">{note.startTime}</td>
            <td className="px-6 py-4">{note.text}</td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default TodayToDo;
