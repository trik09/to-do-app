import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; 
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";

const TaskList = ({ onDeleteTask }) => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setError("You must be logged in to see tasks.");
      return;
    }

    const tasksQuery = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid) // Fetch tasks for the current user
    );

    // Real-time listener for tasks collection
    const unsubscribe = onSnapshot(tasksQuery, (querySnapshot) => {
      const fetchedTasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTasks(fetchedTasks); // Update tasks state with real-time data
    }, (e) => {
      setError("Error fetching tasks. Please try again.");
      console.error("Error fetching tasks:", e);
    });

    // Cleanup the listener when component unmounts
    return () => unsubscribe();

  }, []); // Empty dependency array ensures this runs once on component mount

  const handleDeleteTask = async (taskId) => {
    try {
      const taskDocRef = doc(db, "tasks", taskId);
      await deleteDoc(taskDocRef);
      // Optionally, you could remove the task from state locally without refetching
      setTasks(tasks.filter(task => task.id !== taskId)); // Remove task from the local state
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Error deleting task. Please try again.");
    }
  };

  return (
    <div className="mt-4">
      {error && <p className="text-red-500">{error}</p>}
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div key={task.id} className="flex justify-between items-center p-2 border-b">
            <p>{task.task}</p>
            <button
              onClick={() => handleDeleteTask(task.id)} // Call the delete function on click
              className="bg-red-500 text-white px-2 py-1 rounded-md"
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <p>No tasks found</p>
      )}
    </div>
  );
};

export default TaskList;
