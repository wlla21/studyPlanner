import {
  useEffect,
  useRef,
  useState,
} from "react";
import PomodoroContext from "./PomodoroContext";

const STORAGE_KEY = "pomodoro-completed-sessions";
const MODE_DURATIONS = { Study: 25, Break: 5 };

function getSavedSessions() {
  try {
    const sessions = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(sessions) ? sessions : [];
  } catch {
    return [];
  }
}

export function PomodoroProvider({ children }) {
  const [mode, setMode] = useState("Study");
  const [durationMinutes, setDurationMinutes] = useState(MODE_DURATIONS.Study);
  const [remainingSeconds, setRemainingSeconds] = useState(
    MODE_DURATIONS.Study * 60,
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(getSavedSessions);
  const deadline = useRef(null);
  const completionHandled = useRef(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedSessions));
    } catch (error) {
      console.error("Could not save completed Pomodoro sessions.", error);
    }
  }, [completedSessions]);

  useEffect(() => {
    if (!isPlaying) return undefined;

    const updateTimer = () => {
      const secondsLeft = Math.max(
        0,
        Math.ceil((deadline.current - Date.now()) / 1000),
      );

      if (secondsLeft > 0) {
        setRemainingSeconds(secondsLeft);
        return;
      }

      if (completionHandled.current) return;
      completionHandled.current = true;
      deadline.current = null;
      setIsPlaying(false);

      if (mode === "Study") {
        setCompletedSessions((sessions) => [
          ...sessions,
          {
            type: "Study",
            minutes: MODE_DURATIONS.Study,
            date: new Date().toLocaleDateString(),
            completedAt: new Date().toISOString(),
          },
        ]);
      }

      const nextMode = mode === "Study" ? "Break" : "Study";
      const nextDuration = MODE_DURATIONS[nextMode];
      setMode(nextMode);
      setDurationMinutes(nextDuration);
      setRemainingSeconds(nextDuration * 60);
      setTimerKey((key) => key + 1);
    };

    const intervalId = window.setInterval(updateTimer, 250);
    updateTimer();

    return () => window.clearInterval(intervalId);
  }, [isPlaying, mode]);

  const start = () => {
    if (isPlaying) return;
    deadline.current = Date.now() + remainingSeconds * 1000;
    completionHandled.current = false;
    setIsPlaying(true);
  };

  const pause = () => {
    if (!isPlaying) return;
    const secondsLeft = Math.max(
      0,
      Math.ceil((deadline.current - Date.now()) / 1000),
    );
    deadline.current = null;
    setRemainingSeconds(secondsLeft);
    setIsPlaying(false);
  };

  const reset = () => {
    deadline.current = null;
    completionHandled.current = false;
    setIsPlaying(false);
    setRemainingSeconds(durationMinutes * 60);
    setTimerKey((key) => key + 1);
  };

  const changeMode = (nextMode) => {
    const nextDuration = MODE_DURATIONS[nextMode];
    if (!nextDuration) return;

    deadline.current = null;
    completionHandled.current = false;
    setIsPlaying(false);
    setMode(nextMode);
    setDurationMinutes(nextDuration);
    setRemainingSeconds(nextDuration * 60);
    setTimerKey((key) => key + 1);
  };

  return (
    <PomodoroContext.Provider
      value={{
        mode,
        durationMinutes,
        remainingSeconds,
        isPlaying,
        timerKey,
        completedSessions,
        start,
        pause,
        reset,
        changeMode,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
}
