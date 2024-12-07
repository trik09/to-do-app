import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore"; // Firestore methods to store user data

const Auth = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isRegistering) {
        // Register user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
          Email: user.email,  // Updated to 'Email'
          uid: user.uid,
          createdAt: new Date(),
        });

        console.log("User registered:", user);
      } else {
        // Login user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in:", userCredential.user);
      }

      setIsAuthenticated(true); // Set the user as authenticated after login/register
    } catch (error) {
      // Log detailed error information for debugging
      console.error("Error code:", error.code);  // Error code
      console.error("Error message:", error.message);  // Error message
      setError(`Error: ${error.message}`);  // Show error to user
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-2xl font-bold text-center">
        {isRegistering ? "Register" : "Login"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-500 text-center">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md"
        >
          {isRegistering ? "Register" : "Login"}
        </button>
      </form>
      <button
        onClick={() => setIsRegistering(!isRegistering)}
        className="text-center text-blue-500 mt-4"
      >
        {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
      </button>
    </div>
  );
};

export default Auth;
