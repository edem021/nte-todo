import { useState } from "react";

const TodoForm = ({ onSubmit }) => {
  const [newItem, setNewItem] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newItem === "") return;

    onSubmit(newItem);
    setNewItem("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex p-3 gap-2 h-16">
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          type="text"
          className="border-2 border-black rounded-md flex-1 outline-none px-2 text-[1.4rem] text-sky-100 bg-sky-900/70"
          placeholder="New task"
        />
        <button className="border-2 p-1 rounded-md text-[1.5rem] uppercase cursor-pointer font-bold flex items-center justify-center bg-amber-500/80 hover:bg-amber-500 transition-colors duration-200">
          Add
        </button>
      </div>
    </form>
  );
};

export default TodoForm;
