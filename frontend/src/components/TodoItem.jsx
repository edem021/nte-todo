import React from "react";

const TodoItem = ({ id, todo, completed, onToggle, onDelete }) => {
  return (
    <li className="flex gap-2 justify-between">
      <label className="flex gap-2 items-center cursor-pointer group">
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => onToggle(id, e.target.checked)}
          className="hidden"
        />
        <span
          className={`w-4 h-4 flex items-center justify-center rounded text-sm leading-none ${completed ? "bg-amber-700 text-green-500 font-bold" : "bg-sky-100"} group-hover:bg-amber-500 transition-colors duration-100 `}
        >
          {completed && "✓"}
        </span>
        <span
          className={`text-sky-100 text-shadow-black text-shadow-xs ${completed && "line-through text-slate-600"}`}
        >
          {todo}
        </span>
      </label>

      <button
        onClick={() => onDelete(id)}
        className="font-bold text-red-500 cursor-pointer hover:text-red-900 transition-colors duration-100"
      >
        X
      </button>
    </li>
  );
};

export default TodoItem;
