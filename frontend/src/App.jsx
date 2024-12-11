import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import { useAuthStore } from "./store/auth.store";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

function App() {
  const { authUser, checkAuth, socket } = useAuthStore();

  useEffect(() => {
    checkAuth();
    socket?.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });
  }, [checkAuth, socket]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="login" />}
        ></Route>
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        ></Route>
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
