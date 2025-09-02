import { useState } from "react";
import SignIn from "./pages/SignIn";
import StartPage from "./pages/StartPage";
import MainPage from "./pages/Main"
import Dashboard from "./components/Dashboard";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/startpage" element={<StartPage />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
