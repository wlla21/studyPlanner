import { useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const Pomodoro = () => {
  const [durationTime, setdurationTime] = useState(25);
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <div>
      <h1>Pomodoro</h1>
      <div className="flex flex-col items-center">
        <div className="flex gap-4 my-3">
          <button
            onClick={() => setdurationTime(25)}
            className="inline-flex items-center text-body bg-neutral-primary-soft border border-default hover:bg-neutral-secondary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary-soft shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
          >
            Study
          </button>
          <button
            onClick={() => setdurationTime(5)}
            className="inline-flex items-center text-body bg-neutral-primary-soft border border-default hover:bg-neutral-secondary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary-soft shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
          >
            Break
          </button>
        </div>
        <CountdownCircleTimer
          isPlaying={isPlaying}
          duration={durationTime * 60}
          colors={["#004777", "#F7B801", "#A30000"]}
          onComplete={() => {
            setIsPlaying(false);
            return { shouldRepeat: false };
          }}
        >
          {({ remainingTime }) => {
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;

            return (
              <div>
                <h2>
                  {String(minutes).padStart(2, "0")}:
                  {String(seconds).padStart(2, "0")}
                </h2>
              </div>
            );
          }}
        </CountdownCircleTimer>
        <div className="flex gap-4 my-4">
          <button
            onClick={() => setIsPlaying(true)}
            className="inline-flex items-center text-body bg-neutral-primary-soft border border-default hover:bg-neutral-secondary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary-soft shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
          >
            Start
          </button>
          <button
            onClick={() => setIsPlaying(false)}
            className="inline-flex items-center text-body bg-neutral-primary-soft border border-default hover:bg-neutral-secondary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary-soft shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
          >
            Pause
          </button>
          <button
            onClick={() => setIsPlaying(false)}
            className="inline-flex items-center text-body bg-neutral-primary-soft border border-default hover:bg-neutral-secondary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary-soft shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;
