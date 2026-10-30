import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Plus, Pencil, Trash2, CheckCircle2, Circle, X } from "lucide-react";

const getDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const StudyPlanner = () => {
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [loadedStorageKey, setLoadedStorageKey] = useState(null);
  const [note, setNote] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  const dateKey = getDateKey(date);
  const storageKey = `study-planner-${dateKey}`;

  // Load tasks whenever the selected calendar date changes.
  useEffect(() => {
    queueMicrotask(() => setMessage(""));

    try {
      const saved = localStorage.getItem(storageKey);
      const parsed = saved ? JSON.parse(saved) : [];
      setTasks(Array.isArray(parsed) ? parsed : []);
      setLoadedStorageKey(storageKey);
    } catch (error) {
      setTasks([]);
      setLoadedStorageKey(null);
      queueMicrotask(() =>
        setMessage(
          error instanceof Error
            ? `Could not load saved tasks: ${error.message}`
            : "Could not load saved tasks.",
        ),
      );
    }

    setNote("");
    setStartTime("");
    setEndTime("");
    setErrors({});
    setEditingId(null);
  }, [storageKey]);

  // Save the task list for the selected date.
  useEffect(() => {
    if (loadedStorageKey !== storageKey) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(tasks));
    } catch (error) {
      queueMicrotask(() =>
        setMessage(
          error instanceof Error
            ? `Could not save tasks: ${error.message}`
            : "Could not save tasks.",
        ),
      );
    }
  }, [tasks, storageKey, loadedStorageKey]);

  const clearForm = () => {
    setNote("");
    setStartTime("");
    setEndTime("");
    setErrors({});
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    const newErrors = {};

    if (!note.trim()) {
      newErrors.note = "Please enter a study task.";
    }

    if (!startTime) {
      newErrors.startTime = "Please select a start time.";
    }

    if (!endTime) {
      newErrors.endTime = "Please select an end time.";
    }

    if (startTime && endTime && startTime >= endTime) {
      newErrors.endTime = "End time must be after start time.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const overlapping = tasks.filter(
      (task) =>
        task.id !== editingId &&
        startTime < task.endTime &&
        endTime > task.startTime,
    );

    if (overlapping.length > 0) {
      setErrors({
        startTime: "This time overlaps with another task.",
        endTime: "Choose a different time range.",
      });

      setMessage(
        "Conflict with: " +
          overlapping
            .map((task) => `${task.text} (${task.startTime}–${task.endTime})`)
            .join(", "),
      );
      return;
    }

    if (editingId !== null) {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === editingId
            ? {
                ...task,
                text: note.trim(),
                startTime,
                endTime,
              }
            : task,
        ),
      );
      setMessage("Task updated successfully!");
    } else {
      const newTask = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        text: note.trim(),
        date: dateKey,
        startTime,
        endTime,
        done: false,
      };

      setTasks((previous) => [...previous, newTask]);
      setMessage("Task added successfully!");
    }

    clearForm();
  };

  const handleEdit = (task) => {
    setNote(task.text);
    setStartTime(task.startTime);
    setEndTime(task.endTime);
    setEditingId(task.id);
    setErrors({});
    setMessage("");
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this study task?")) return;

    setTasks((previous) => previous.filter((task) => task.id !== id));

    if (editingId === id) clearForm();
    setMessage("Task deleted.");
  };

  const toggleDone = (id) => {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  };

  const sortedTasks = [...tasks].sort((a, b) =>
    a.startTime.localeCompare(b.startTime),
  );

  const completedCount = tasks.filter((task) => task.done).length;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 text-gray-800 sm:p-6">
      <header>
        <h1 className="text-3xl font-bold">Study Planner</h1>
        <p className="mt-1 text-gray-500">
          Plan your tasks and track your progress.
        </p>
      </header>

      {/* Calendar */}
      <section className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Choose a date</h2>
        <Calendar
          onChange={setDate}
          value={date}
          className="w-full border-0 font-sans"
        />
      </section>

      {/* Selected date and progress */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">{date.toDateString()}</h2>
        <p className="mt-2 text-sm text-gray-500">
          {completedCount} of {tasks.length} tasks completed
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-green-500 transition-all"
            style={{
              width:
                tasks.length === 0
                  ? "0%"
                  : `${(completedCount / tasks.length) * 100}%`,
            }}
          />
        </div>
      </section>

      {/* Task form */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">
          {editingId !== null ? "Edit Task" : "Add a Study Task"}
        </h2>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="start-time"
                className="mb-1 block text-sm font-medium"
              >
                Start time
              </label>
              <input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    startTime: "",
                    endTime: "",
                  }));
                }}
                aria-invalid={Boolean(errors.startTime)}
                className={`w-full rounded-lg border px-3 py-2 ${
                  errors.startTime ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="end-time"
                className="mb-1 block text-sm font-medium"
              >
                End time
              </label>
              <input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    endTime: "",
                    startTime: "",
                  }));
                }}
                min={startTime || undefined}
                aria-invalid={Boolean(errors.endTime)}
                className={`w-full rounded-lg border px-3 py-2 ${
                  errors.endTime ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.endTime && (
                <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="task" className="mb-1 block text-sm font-medium">
              Study task
            </label>
            <input
              id="task"
              type="text"
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setErrors((prev) => ({ ...prev, note: "" }));
              }}
              placeholder="e.g. Task"
              aria-invalid={Boolean(errors.note)}
              className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 ${
                errors.note
                  ? "border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />
            {errors.note && (
              <p className="mt-1 text-sm text-red-600">{errors.note}</p>
            )}
          </div>

          {message && (
            <p
              role="status"
              className={`rounded-lg p-3 text-sm ${
                message.includes("Conflict")
                  ? "bg-red-50 text-red-700"
                  : message.includes("successfully")
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-700"
              }`}
            >
              {message}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
            >
              <Plus size={18} />
              {editingId !== null ? "Save Changes" : "Add Task"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={() => {
                  clearForm();
                  setMessage("");
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-3 hover:bg-gray-200"
              >
                <X size={18} />
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Tasks table */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Daily Tasks</h2>

        {sortedTasks.length === 0 ? (
          <p className="py-8 text-center text-gray-500">
            No tasks for this date. Add one above.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="border-b bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3">Study Task</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Start Time</th>
                  <th className="px-4 py-3">End Time</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td
                      className={`px-4 py-4 font-medium ${
                        task.done ? "text-gray-400 line-through" : ""
                      }`}
                    >
                      {task.text}
                    </td>
                    <td className="px-4 py-4">{date.toLocaleDateString()}</td>
                    <td className="px-4 py-4">{task.startTime}</td>
                    <td className="px-4 py-4">{task.endTime}</td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => toggleDone(task.id)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          task.done
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {task.done ? (
                          <CheckCircle2 size={15} />
                        ) : (
                          <Circle size={15} />
                        )}
                        {task.done ? "Done" : "Not done"}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(task)}
                          aria-label={`Edit ${task.text}`}
                          title="Edit"
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                        >
                          <Pencil size={17} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(task.id)}
                          aria-label={`Delete ${task.text}`}
                          title="Delete"
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default StudyPlanner;
