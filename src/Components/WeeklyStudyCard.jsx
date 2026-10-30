import { useState } from "react";

const WeeklyStudyCard = () => {
  const [refresh, setRefresh] = useState(0);

  const sessions = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("pomodoro-completed-sessions") || "[]",
      );
    } catch {
      return [];
    }
  })();

  const getMonday = (date) => {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    result.setDate(
      result.getDate() - (result.getDay() === 0 ? 6 : result.getDay() - 1),
    );
    return result;
  };

  const getKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getMinutes = (date) => {
    const key = getKey(date);

    return sessions.reduce((sum, session) => {
      if (session.type !== "Study" || !session.completedAt) return sum;

      const completed = new Date(session.completedAt);
      const minutes = Number(session.minutes);

      if (
        !Number.isNaN(completed.getTime()) &&
        getKey(completed) === key &&
        Number.isFinite(minutes) &&
        minutes > 0
      ) {
        return sum + minutes;
      }

      return sum;
    }, 0);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours && mins) return `${hours}h ${mins}m`;
    if (hours) return `${hours}h`;
    return `${mins}m`;
  };

  const monday = getMonday(new Date());

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(date.getDate() + index);

    const lastWeekDate = new Date(date);
    lastWeekDate.setDate(lastWeekDate.getDate() - 7);

    return {
      key: getKey(date),
      label: date.toLocaleDateString("en-US", { weekday: "short" }),
      dateLabel: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      current: getMinutes(date),
      previous: getMinutes(lastWeekDate),
    };
  });

  const currentTotal = days.reduce((sum, day) => sum + day.current, 0);
  const previousTotal = days.reduce((sum, day) => sum + day.previous, 0);
  const difference = currentTotal - previousTotal;

  const maxMinutes = Math.max(
    60,
    ...days.flatMap((day) => [day.current, day.previous]),
  );

  return (
    <section className="rounded-3xl border border-[#e8e6df] bg-[#fffefa] p-5 shadow-[0_4px_20px_rgba(65,70,55,0.05)] sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#89947e]">
            YOUR LEARNING JOURNEY
          </p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-[#343b32]">
            Study rhythm
          </h2>
          <p className="mt-1 text-sm text-[#92938a]">
            Your daily focus, compared week by week.
          </p>
        </div>

        <button
          onClick={() => setRefresh((value) => value + 1)}
          className="rounded-full border border-[#e8e6df] px-3 py-2 text-xs font-medium text-[#74796d] transition hover:bg-[#f3f4ed]"
          aria-label="Refresh study comparison"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-[#eef2e9] p-4">
          <p className="text-xs font-medium text-[#74836c]">This week</p>
          <p className="mt-2 text-2xl font-semibold text-[#52684e]">
            {formatTime(currentTotal)}
          </p>
          <p className="mt-1 text-xs text-[#87917f]">Total focused time</p>
        </div>

        <div className="rounded-2xl bg-[#f6f0e5] p-4">
          <p className="text-xs font-medium text-[#9b8969]">Last week</p>
          <p className="mt-2 text-2xl font-semibold text-[#8c7756]">
            {formatTime(previousTotal)}
          </p>
          <p className="mt-1 text-xs text-[#a99a81]">Previous total</p>
        </div>
      </div>

      {/* Chart heading */}
      <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[#41463c]">
            Daily comparison
          </h3>
          <p className="mt-1 text-xs text-[#999a90]">Monday – Sunday</p>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-[#777b70]">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#91a58a]" />
            This week
          </span>
        </div>
      </div>

      {/* Daily comparison bars */}
      <div className="mt-5 space-y-5">
        {days.map((day) => (
          <div key={day.key}>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 text-sm font-semibold text-[#555b4e]">
                  {day.label}
                </span>
                <span className="text-xs text-[#a3a397]">{day.dateLabel}</span>
              </div>

              <span className="text-xs font-medium text-[#6f7568]">
                {formatTime(day.current)}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="h-2.5 overflow-hidden rounded-full bg-[#f0f0e9]">
                <div
                  className="h-full rounded-full bg-[#91a58a] transition-all duration-500"
                  style={{
                    width: `${(day.current / maxMinutes) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly reflection */}
      <div className="mt-6 rounded-2xl border border-[#e9e9df] bg-[#f8f8f2] p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#858d78]">
          WEEKLY NOTE
        </p>

        <p className="mt-2 text-sm leading-6 text-[#666b5f]">
          {currentTotal === 0 && previousTotal === 0
            ? "Your study record will appear here as you complete Pomodoro sessions."
            : difference > 0
              ? `You recorded ${formatTime(difference)} more than last week. Notice which routines helped you focus.`
              : difference < 0
                ? `You recorded ${formatTime(Math.abs(difference))} less than last week. Use this as information to adjust your routine gently.`
                : "Your total study time matches last week. Notice which daily habits are working well."}
        </p>
      </div>
    </section>
  );
};

export default WeeklyStudyCard;
