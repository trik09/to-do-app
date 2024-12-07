import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const TaskInput = ({ onAddTask }) => {
  const [task, setTask] = useState("");
  const [error, setError] = useState(""); // State to handle errors
  const [isAdding, setIsAdding] = useState(false); // State to handle the loading state

  const handleAddTask = async () => {
    if (!task.trim()) {
      alert("Task cannot be empty!");
      return;
    }

    // Check if the user is authenticated
    if (!auth.currentUser) {
      setError("You need to be logged in to add tasks.");
      return;
    }

    // Prevent multiple submissions
    if (isAdding) return;

    setIsAdding(true); // Disable the button to prevent further clicks
    setError(""); // Reset error state before trying to add a new task

    try {
      // Add task to Firestore
      const docRef = await addDoc(collection(db, "tasks"), {
        task: task.trim(),
        createdAt: new Date(),
        userId: auth.currentUser.uid, // Ensure the userId is correctly set
      });

      console.log("Task added with ID:", docRef.id);

      // Clear input after adding
      setTask(""); 

    } catch (e) {
      console.error("Error adding task to Firestore:", e);
      setError(`Error adding task: ${e.message}`);
    } finally {
      setIsAdding(false); // Re-enable the button after the operation is finished
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      <input
        type="text"
        placeholder="Enter a new task"
        className="flex-grow border p-2 rounded-md"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button
        onClick={handleAddTask}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
        disabled={isAdding} // Disable the button while adding the task
      >
        {isAdding ? "Adding..." : "Add Task"} {/* Show loading state */}
      </button>

      {/* Display error if any */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default TaskInput;
