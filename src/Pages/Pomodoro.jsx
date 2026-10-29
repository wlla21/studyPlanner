import { useState, useEffect } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const Pomodoro = () => {
  const [durationTime, setDurationTime] = useState(25);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [mode, setMode] = useState("Study");

  const [completedSessions, setCompletedSessions] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("pomodoro-completed-sessions") || "[]",
      );
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "pomodoro-completed-sessions",
      JSON.stringify(completedSessions),
    );
  }, [completedSessions]);

  // Switch between Study and Break manually
  const changeMode = (newMode) => {
    setMode(newMode);
    setDurationTime(newMode === "Study" ? 25 : 5);
    setIsPlaying(false);
    setTimerKey((prev) => prev + 1);
  };

  // Automatically switch modes when the timer finishes
  const handleComplete = () => {
    if (mode === "Study") {
      const session = {
        type: "Study",
        minutes: 25,
        date: new Date().toLocaleDateString(),
        completedAt: new Date().toISOString(),
      };

      setCompletedSessions((previous) => [...previous, session]);
    }

    const nextMode = mode === "Study" ? "Break" : "Study";

    setMode(nextMode);
    setDurationTime(nextMode === "Study" ? 25 : 5);
    setTimerKey((previous) => previous + 1);

    return { shouldRepeat: false };
  };

  // Reset the current mode
  const handleReset = () => {
    setIsPlaying(false);
    setTimerKey((prev) => prev + 1);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-2 sm:p-4">
      <header className="text-center">
        <p className="dashboard-eyebrow">A little focus, a little rest</p>
        <h1 className="text-3xl font-semibold">Pomodoro timer</h1>
        <p className="mt-2 text-sm text-gray-500">
          Find your rhythm, one gentle session at a time.
        </p>
      </header>

      <section className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="mb-7 inline-flex rounded-full bg-gray-100 p-1.5">
          <button
            onClick={() => changeMode("Study")}
            aria-pressed={mode === "Study"}
            className={`rounded-full px-5 py-2 text-sm font-semibold ${
              mode === "Study"
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Study
          </button>
          <button
            onClick={() => changeMode("Break")}
            aria-pressed={mode === "Break"}
            className={`rounded-full px-5 py-2 text-sm font-semibold ${
              mode === "Break"
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Break
          </button>
        </div>

        <CountdownCircleTimer
          key={timerKey}
          isPlaying={isPlaying}
          duration={durationTime * 60}
          colors={["#78927a", "#b89b6a", "#ad6d63"]}
          colorsTime={[
            durationTime * 60,
            Math.round((durationTime * 60) / 2),
            0,
          ]}
          onComplete={handleComplete}
        >
          {({ remainingTime }) => {
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;

            return (
              <div className="font-serif text-4xl font-semibold tracking-tight text-gray-800">
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
              </div>
            );
          }}
        </CountdownCircleTimer>

        <h2 className="mt-6 text-lg font-semibold">{mode} time</h2>

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setIsPlaying(true)}
            disabled={isPlaying}
            className="rounded-full bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Start
          </button>
          <button
            onClick={() => setIsPlaying(false)}
            disabled={!isPlaying}
            className="rounded-full border border-gray-300 bg-white px-6 py-2.5 font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Pause
          </button>
          <button
            onClick={handleReset}
            className="rounded-full border border-gray-300 bg-white px-6 py-2.5 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center">
        <p className="text-sm font-medium text-gray-700">
          {completedSessions.length} completed study{" "}
          {completedSessions.length === 1 ? "session" : "sessions"}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Your progress is saved on this device.
        </p>
      </section>
    </div>
  );
};

export default Pomodoro;
