import TodoItem from "./TodoItem.jsx";

const TodoList = ({ todos, onToggle, onDelete }) => {
  return (
    <ul className="flex flex-col w-full px-4 gap-2">
      {todos.length === 0 && "No todos yet..."}
      {todos.map((todo) => (
        <TodoItem
          {...todo}
          key={todo.id}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default TodoList;
