import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import Header from "./components/Header";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import Auth from "./components/Auth";
import { db } from "./firebase";
import { doc, deleteDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore";

// Custom hook to manage authentication state
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state for auth

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false); // Set loading to false once auth status is checked
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};

function App() {
  const [error, setError] = useState(null); // Error state for handling errors
  const [tasks, setTasks] = useState([]); // State to store tasks
  const [loadingTask, setLoadingTask] = useState(false); // To track if a task is being added
  const { user, loading } = useAuth();

  // Fetch tasks for the authenticated user
  useEffect(() => {
    if (user) {
      const fetchTasks = async () => {
        try {
          const q = query(collection(db, "tasks"), where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const tasksData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTasks(tasksData); // Set tasks for the authenticated user
        } catch (e) {
          console.error("Error fetching tasks:", e);
          setError("Failed to fetch tasks.");
        }
      };

      fetchTasks();
    } else {
      setTasks([]); // Clear tasks when not authenticated
    }
  }, [user]);

  // Add new task to Firestore and update local state
  const handleAddTask = async (task) => {
    if (loadingTask) return; // Prevent adding duplicate tasks while one is being added
    setLoadingTask(true); // Set loading to true while adding task

    const newTask = {
      task,
      createdAt: new Date(),
      userId: user.uid,
    };

    try {
      // Add task to Firestore
      const docRef = await addDoc(collection(db, "tasks"), newTask);
      // Add task to local state only after Firestore confirms it
      setTasks((prevTasks) => [...prevTasks, { ...newTask, id: docRef.id }]);
    } catch (e) {
      console.error("Error adding task to Firestore:", e);
      setError("Failed to add task.");
    } finally {
      setLoadingTask(false); // Set loading to false after task is added
    }
  };

  // Delete task from Firestore and update local state
  const deleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id)); // Remove task locally
    } catch (e) {
      console.error("Error deleting task:", e);
      setError("Failed to delete task.");
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Error signing out: ", e);
      setError("Failed to log out.");
    }
  };

  if (loading) {
    return <p>Loading...</p>; // Show loading message while auth state is being determined
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        {error && <p className="text-red-500 text-center">{error}</p>} {/* Display error message */}
        {!user ? (
          // If no user is authenticated, show login/register page
          <Auth setIsAuthenticated={() => {}} />
        ) : (
          // If authenticated, show the to-do app
          <>
            <Header />
            <TaskInput onAddTask={handleAddTask} loading={loadingTask} /> {/* Pass loading state to disable button */}
            <TaskList tasks={tasks} onDeleteTask={deleteTask} /> {/* Pass tasks and delete function */}
            <button
              onClick={handleLogout}
              className="mt-4 w-full bg-red-500 text-white p-2 rounded-md"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
