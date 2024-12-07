import React from "react";

const TaskItem = ({ task, onDelete }) => {
  return (
    <li className="flex justify-between items-center bg-gray-50 p-2 rounded-md shadow-sm mt-2">
      <span>{task}</span>
      <button
        className="text-red-500 hover:text-red-700"
        onClick={onDelete}
      >
        Delete
      </button>
    </li>
  );
};

export default TaskItem;
