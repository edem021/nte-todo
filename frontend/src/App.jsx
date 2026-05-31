import { useEffect, useState } from "react";
import TodoForm from "./components/TodoForm.jsx";
import TodoList from "./components/TodoList.jsx";
import ResetCountdown from "./components/ResetCountdown.jsx";
import {
  applyResets,
  getNextDailyReset,
  getNextWeeklyReset,
} from "./utils/resetTime.js";

function loadTodos(key) {
  const localValue = localStorage.getItem(key);
  if (localValue === null) return [];
  return JSON.parse(localValue);
}

function App() {
  const [todos, setTodos] = useState(() =>
    applyResets(loadTodos("WEEKLYITEMS"), loadTodos("DAILYITEMS")),
  );

  useEffect(() => {
    localStorage.setItem("WEEKLYITEMS", JSON.stringify(todos.weekly));
    localStorage.setItem("DAILYITEMS", JSON.stringify(todos.daily));
  }, [todos]);

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
      <div className="flex gap-120">
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
      </div>
    </div>
  );
}

export default App;
