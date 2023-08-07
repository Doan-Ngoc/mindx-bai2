/*import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './components/Login';

function App() {

  return (
    <Routes>}
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
}

export default App; */



const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(loginForm);
  const username = formData.get("username");
  const password = formData.get("password");
  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Login successful");
      console.log("Token:", data.access_token);
      // Store the token in localStorage or sessionStorage
      // Redirect to a protected page or do other tasks as needed
    } else {
      const errorData = await response.json();
      console.error("Login failed:", errorData.error);
    }
  } catch (err) {
    console.error("Error logging in:", err);
  }
});
