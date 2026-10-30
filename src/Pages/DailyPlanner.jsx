import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_USDA_API_KEY;
const STORAGE_KEY = "study-brain-daily-planner";

const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getSavedData = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

const createEmptyDay = () => ({
  foods: [],
  water: [],
  sleep: { bedtime: "22:30", wakeTime: "07:00" },
  tasks: [],
});

const DailyPlanner = () => {
  const [allDays, setAllDays] = useState(getSavedData);
  const [date, setDate] = useState(getToday());

  const [foodSearch, setFoodSearch] = useState("");
  const [foodResults, setFoodResults] = useState([]);
  const [foodLoading, setFoodLoading] = useState(false);
  const [foodError, setFoodError] = useState("");

  const [waterAmount, setWaterAmount] = useState("250");

  const [bedtime, setBedtime] = useState("22:30");
  const [wakeTime, setWakeTime] = useState("07:00");

  const [taskName, setTaskName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [taskError, setTaskError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const dayData = allDays[date] || createEmptyDay();
  const foods = dayData.foods || [];
  const water = dayData.water || [];
  const tasks = dayData.tasks || [];

  // Save all dates to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allDays));
  }, [allDays]);

  // Load the selected day's sleep settings
  useEffect(() => {
    const day = allDays[date] || createEmptyDay();

    setBedtime(day.sleep?.bedtime || "22:30");
    setWakeTime(day.sleep?.wakeTime || "07:00");

    setFoodSearch("");
    setFoodResults([]);
    setFoodError("");
    setTaskName("");
    setStartTime("");
    setEndTime("");
    setTaskError("");
    setEditingId(null);
  }, [date, allDays]);

  // Update only the selected date
  const updateDay = (updates) => {
    setAllDays((previous) => {
      const current = previous[date] || createEmptyDay();

      return {
        ...previous,
        [date]: { ...current, ...updates },
      };
    });
  };

  // Food calorie counter
  // Food calorie counter using USDA FoodData Central

  const searchFoods = async (e) => {
    e.preventDefault();

    if (!foodSearch.trim()) {
      setFoodError("Please enter a food name.");
      setFoodResults([]);
      return;
    }

    if (!API_KEY) {
      setFoodError("USDA API key is missing. Check your .env file.");
      return;
    }

    setFoodLoading(true);
    setFoodError("");
    setFoodResults([]);

    try {
      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(
          foodSearch.trim(),
        )}&api_key=${API_KEY}&pageSize=8`,
      );

      if (!response.ok) {
        throw new Error("Unable to retrieve food data.");
      }

      const data = await response.json();

      if (!data.foods || data.foods.length === 0) {
        setFoodError("No matching foods found. Try another search.");
        return;
      }

      setFoodResults(data.foods);
    } catch (error) {
      setFoodError(
        error.message || "Something went wrong while searching for food.",
      );
    } finally {
      setFoodLoading(false);
    }
  };

  // Find the energy value in a USDA food result
  const getFoodCalories = (food) => {
    const energy = food.foodNutrients?.find(
      (nutrient) =>
        nutrient.nutrientId === 1008 ||
        nutrient.nutrientName?.toLowerCase() === "energy",
    );

    if (!energy || !Number.isFinite(Number(energy.value))) {
      return null;
    }

    // USDA energy values may use different units.
    // Convert kJ to kcal when the returned unit is kJ.
    if (energy.unitName?.toLowerCase() === "kj") {
      return Number(energy.value) / 4.184;
    }

    return Number(energy.value);
  };

  // Add a selected food to the daily log
  const addFood = (food) => {
    const calories = getFoodCalories(food);

    if (calories === null) {
      setFoodError(
        "Calorie information is unavailable for this food. Try another result.",
      );
      return;
    }

    updateDay({
      foods: [
        ...foods,
        {
          id: crypto.randomUUID(),
          fdcId: food.fdcId,
          name: food.description,
          calories: Number(calories.toFixed(1)),
        },
      ],
    });

    setFoodSearch("");
    setFoodResults([]);
    setFoodError("");
  };

  // Delete a food entry
  const deleteFood = (id) => {
    updateDay({
      foods: foods.filter((food) => food.id !== id),
    });
  };

  // Total calories logged for the selected day
  const totalCalories = foods.reduce(
    (total, food) => total + Number(food.calories || 0),
    0,
  );
  // Water intake counter
  const addWater = (amount) => {
    if (!Number.isFinite(amount) || amount <= 0) return;

    updateDay({
      water: [...water, { id: crypto.randomUUID(), amount }],
    });
  };

  const deleteWater = (id) => {
    updateDay({ water: water.filter((item) => item.id !== id) });
  };

  const totalWater = water.reduce((total, item) => total + item.amount, 0);

  // Sleep duration calculator, including sleep across midnight
  const getSleepMinutes = () => {
    if (!bedtime || !wakeTime) return 0;

    const [bedHour, bedMinute] = bedtime.split(":").map(Number);
    const [wakeHour, wakeMinute] = wakeTime.split(":").map(Number);

    let minutes = wakeHour * 60 + wakeMinute - (bedHour * 60 + bedMinute);

    if (minutes < 0) minutes += 24 * 60;

    return minutes;
  };

  const sleepMinutes = getSleepMinutes();

  const saveSleep = () => {
    updateDay({
      sleep: { bedtime, wakeTime },
    });
  };

  // Study task planner
  const saveTask = (e) => {
    e.preventDefault();
    setTaskError("");

    if (!taskName.trim()) {
      setTaskError("Please enter a task name.");
      return;
    }

    if (!startTime || !endTime) {
      setTaskError("Please enter both start and end times.");
      return;
    }

    if (endTime <= startTime) {
      setTaskError("End time must be later than start time.");
      return;
    }

    const overlap = tasks.some(
      (task) =>
        task.id !== editingId &&
        startTime < task.endTime &&
        endTime > task.startTime,
    );

    if (overlap) {
      setTaskError("This task overlaps with another task.");
      return;
    }

    const oldTask = tasks.find((task) => task.id === editingId);

    const newTask = {
      id: editingId || crypto.randomUUID(),
      name: taskName.trim(),
      startTime,
      endTime,
      done: oldTask?.done || false,
    };

    updateDay({
      tasks: editingId
        ? tasks.map((task) => (task.id === editingId ? newTask : task))
        : [...tasks, newTask],
    });

    setTaskName("");
    setStartTime("");
    setEndTime("");
    setEditingId(null);
  };

  const toggleTask = (id) => {
    updateDay({
      tasks: tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    });
  };

  const editTask = (task) => {
    setEditingId(task.id);
    setTaskName(task.name);
    setStartTime(task.startTime);
    setEndTime(task.endTime);
    setTaskError("");
  };

  const deleteTask = (id) => {
    updateDay({
      tasks: tasks.filter((task) => task.id !== id),
    });

    if (editingId === id) {
      setEditingId(null);
      setTaskName("");
      setStartTime("");
      setEndTime("");
    }
  };

  const completedTasks = tasks.filter((task) => task.done).length;

  const cardStyle = "rounded-2xl border border-gray-200 bg-white p-5 shadow-sm";

  const inputStyle =
    "w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400";

  const buttonStyle =
    "rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700";

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Daily Planner</h1>
        <p className="mt-2 text-gray-600">
          Organize your tasks and build routines that support your studies.
        </p>

        <label htmlFor="planner-date" className="mt-4 block font-medium">
          Select date
        </label>

        <input
          id="planner-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-2 rounded-lg border p-2.5"
        />
      </header>

      {/* Daily overview */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className={cardStyle}>
          <p className="text-sm text-gray-500">Food energy logged</p>
          <p className="mt-2 text-2xl font-bold">
            {totalCalories.toLocaleString()} kcal
          </p>
          <p className="text-sm text-gray-500">
            From {foods.length} food entries
          </p>
        </div>

        <div className={cardStyle}>
          <p className="text-sm text-gray-500">Water logged</p>
          <p className="mt-2 text-2xl font-bold">
            {totalWater.toLocaleString()} mL
          </p>
          <p className="text-sm text-gray-500">{water.length} drink entries</p>
        </div>

        <div className={cardStyle}>
          <p className="text-sm text-gray-500">Sleep duration</p>
          <p className="mt-2 text-2xl font-bold">
            {Math.floor(sleepMinutes / 60)}h {sleepMinutes % 60}m
          </p>
          <p className="text-sm text-gray-500">Based on your entered times</p>
        </div>
      </section>

      {/* Food tracker */}
      {/* Food & Calories */}
      <section className={cardStyle}>
        <div className="mb-4">
          <h2 className="text-xl font-bold">Food & Calories</h2>

          <p className="mt-1 text-sm text-gray-500">
            Search food information and record what you eat. Calorie values are
            estimates and may vary by serving size.
          </p>
        </div>

        {/* Food search */}
        <form onSubmit={searchFoods} className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">
              Search for food
            </span>

            <input
              type="text"
              value={foodSearch}
              onChange={(e) => setFoodSearch(e.target.value)}
              placeholder="e.g. cooked rice, banana, egg"
              className={inputStyle}
            />
          </label>

          <button
            type="submit"
            disabled={foodLoading}
            className={`${buttonStyle} disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {foodLoading ? "Searching..." : "Search Food"}
          </button>
        </form>

        {/* Error message */}
        {foodError && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {foodError}
          </p>
        )}

        {/* Search results */}
        {foodResults.length > 0 && (
          <div className="mt-5 space-y-3">
            <h3 className="font-semibold">Search Results</h3>

            {foodResults.map((food) => {
              const calories = getFoodCalories(food);

              return (
                <div
                  key={food.fdcId}
                  className="flex flex-col gap-3 rounded-xl border border-gray-200 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{food.description}</p>

                    <p className="mt-1 text-sm text-gray-500">
                      {calories === null
                        ? "Calorie information unavailable"
                        : `Estimated ${calories.toFixed(1)} kcal`}
                    </p>

                    {food.brandOwner && (
                      <p className="text-xs text-gray-400">{food.brandOwner}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => addFood(food)}
                    disabled={calories === null}
                    className={`${buttonStyle} disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    Add Food
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Daily food log */}
        <div className="mt-6">
          <h3 className="font-semibold">Today's Food Log</h3>

          <div className="mt-3 space-y-2">
            {foods.map((food) => (
              <div
                key={food.id}
                className="flex items-center justify-between gap-3 border-b py-3"
              >
                <div>
                  <p className="font-medium">{food.name}</p>

                  <p className="text-sm text-gray-500">
                    {Number(food.calories).toFixed(1)} kcal
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => deleteFood(food.id)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            ))}

            {foods.length === 0 && (
              <p className="text-sm text-gray-500">
                No food entries yet. Search for a food to get started.
              </p>
            )}
          </div>
        </div>

        {/* Total */}
        <div className="mt-5 rounded-xl bg-amber-50 p-4">
          <p className="text-sm text-amber-800">Total food energy logged</p>

          <p className="mt-1 text-2xl font-bold text-amber-950">
            {totalCalories.toLocaleString(undefined, {
              maximumFractionDigits: 1,
            })}{" "}
            kcal
          </p>
        </div>
      </section>

      {/* Water tracker */}
      <section className={cardStyle}>
        <h2 className="text-xl font-bold">Water Intake</h2>
        <p className="mt-1 text-sm text-gray-500">
          Record water as you drink throughout the day.
        </p>

        <div className="my-4 flex flex-wrap gap-2">
          {[150, 250, 350, 500].map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => addWater(amount)}
              className="rounded-lg border border-blue-300 px-4 py-2 hover:bg-blue-50"
            >
              +{amount} mL
            </button>
          ))}
        </div>

        <form
          className="flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            addWater(Number(waterAmount));
          }}
        >
          <input
            type="number"
            min="1"
            value={waterAmount}
            onChange={(e) => setWaterAmount(e.target.value)}
            aria-label="Custom water amount in milliliters"
            className="w-40 rounded-lg border p-2.5"
          />
          <button type="submit" className={buttonStyle}>
            Add mL
          </button>
        </form>

        <p className="mt-4 text-2xl font-bold">
          {totalWater.toLocaleString()} mL
        </p>

        <div className="mt-3 space-y-2">
          {water.map((item) => (
            <div key={item.id} className="flex justify-between border-b py-2">
              <span>{item.amount} mL</span>
              <button
                type="button"
                onClick={() => deleteWater(item.id)}
                className="text-red-600"
              >
                Undo
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Sleep tracker */}
      <section className={cardStyle}>
        <h2 className="text-xl font-bold">Sleep Tracker</h2>
        <p className="mb-4 mt-1 text-sm text-gray-500">
          Record when you went to bed and when you woke up.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label>
            <span className="mb-1 block text-sm font-medium">Bedtime</span>
            <input
              type="time"
              value={bedtime}
              onChange={(e) => setBedtime(e.target.value)}
              className={inputStyle}
            />
          </label>

          <label>
            <span className="mb-1 block text-sm font-medium">Wake-up time</span>
            <input
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className={inputStyle}
            />
          </label>
        </div>

        <div className="my-4 rounded-xl bg-indigo-50 p-4">
          <p className="text-sm text-indigo-700">Calculated sleep duration</p>
          <p className="mt-1 text-3xl font-bold text-indigo-900">
            {Math.floor(sleepMinutes / 60)}h {sleepMinutes % 60}m
          </p>
        </div>

        <button type="button" onClick={saveSleep} className={buttonStyle}>
          Save Sleep Times
        </button>
      </section>

      <footer className="pb-6 text-center text-sm text-gray-500">
        Your daily records are stored locally in this browser.
      </footer>
    </main>
  );
};

export default DailyPlanner;
