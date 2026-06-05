import { useEffect, useState } from "react";
import TodoForm from "./components/TodoForm.jsx";
import TodoList from "./components/TodoList.jsx";
import ResetCountdown from "./components/ResetCountdown.jsx";
import {
  applyResets,
  getNextDailyReset,
  getNextWeeklyReset,
} from "./utils/resetTime.js";
import { loadPlaytime, formatPlayTime } from "./utils/playtime.js";
import Header from "./components/Header.jsx";

function loadTodos(key) {
  const localValue = localStorage.getItem(key);
  if (localValue === null) return [];
  return JSON.parse(localValue);
}

function App() {
  const [totalMs, setTotalMs] = useState(() => loadPlaytime());
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionStart, setSessionStart] = useState(null);
  const [displayMs, setDisplayMs] = useState(() => loadPlaytime());
  const [todos, setTodos] = useState(() =>
    applyResets(loadTodos("WEEKLYITEMS"), loadTodos("DAILYITEMS")),
  );

  useEffect(() => {
    localStorage.setItem("WEEKLYITEMS", JSON.stringify(todos.weekly));
    localStorage.setItem("DAILYITEMS", JSON.stringify(todos.daily));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("PLAYTIME_TOTAL_MS", String(totalMs));
  }, [totalMs]);

  useEffect(() => {
    if (!isPlaying) return;

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - sessionStart;
      setDisplayMs(totalMs + elapsed);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isPlaying, sessionStart, totalMs]);

  const handlePlay = () => {
    if (isPlaying) return;

    const now = Date.now();
    setSessionStart(now);
    setIsPlaying(true);
  };

  const handlePause = () => {
    if (!isPlaying) return;

    const elapsed = Date.now() - sessionStart;
    const newTotal = totalMs + elapsed;

    setTotalMs(newTotal);
    setDisplayMs(newTotal);
    setSessionStart(null);
    setIsPlaying(false);
  };

  const updateList = (listKey, updater) => {
    setTodos((current) => ({
      ...current,
      [listKey]: updater(current[listKey]),
    }));
  };

  const addTodo = (listKey, text) => {
    updateList(listKey, (items) => [
      ...items,
      { id: crypto.randomUUID(), todo: text, completed: false },
    ]);
  };

  const toggleTodo = (listKey, id, completed) => {
    updateList(listKey, (items) =>
      items.map((item) => (item.id === id ? { ...item, completed } : item)),
    );
  };

  const deleteTodo = (listKey, id) => {
    updateList(listKey, (items) => items.filter((item) => item.id !== id));
  };

  return (
    <div className="page-bg">
      <Header
        displayTime={formatPlayTime(displayMs)}
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
      />

      <main className="flex gap-120">
        <div className="todo-card">
          <h2 className="card-title">WEEKLY TASKS</h2>

          <div className="card-content">
            <TodoForm onSubmit={(text) => addTodo("weekly", text)} />

            <TodoList
              todos={todos.weekly}
              onToggle={(id, completed) => toggleTodo("weekly", id, completed)}
              onDelete={(id) => deleteTodo("weekly", id)}
            />

            <ResetCountdown getNextReset={getNextWeeklyReset} />
          </div>
        </div>

        <div className="todo-card">
          <h2 className="card-title">DAILY TASKS</h2>

          <div className="card-content">
            <TodoForm onSubmit={(text) => addTodo("daily", text)} />

            <TodoList
              todos={todos.daily}
              onToggle={(id, completed) => toggleTodo("daily", id, completed)}
              onDelete={(id) => deleteTodo("daily", id)}
            />

            <ResetCountdown getNextReset={getNextDailyReset} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
