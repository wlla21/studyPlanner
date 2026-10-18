import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const Pomodoro = () => {
  return (
    <div>
      <h1>Pomodoro</h1>
      <div>
        <CountdownCircleTimer
          isPlaying
          duration={25 * 60}
          colors={["#004777", "#F7B801", "#A30000"]}
          colorsTime={[15, 10, 5]}
        >
          {({ remainingTime }) => remainingTime}
        </CountdownCircleTimer>
        <button>Start</button>
        <button>Pause</button>
        <button>Reset</button>
      </div>
    </div>
  );
};

export default Pomodoro;
