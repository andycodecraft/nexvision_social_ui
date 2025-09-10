import { useState } from "react";
import SignIn from "./pages/SignIn";
import StartPage from "./pages/StartPage";
import MainPage from "./pages/Main"
import DashboardPage from "./components/Dashboard";
import SetupPage from "./components/Setup";
import ImageSearchPage from "./components/ImageSearch";
import TrackPage from "./components/Track";
import PersonalityPage from "./components/Personality";
import CreateCollectionPage from "./components/CreateCollection";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/startpage" element={<StartPage />}>
        <Route index element={<Navigate to="setup" replace />} />
        <Route path="setup" element={<SetupPage />} />
        <Route path="setup/create/:type" element={<CreateCollectionPage />} />
        <Route path="image-search" element={<ImageSearchPage />} />
        <Route path="track" element={<TrackPage />} />
        <Route path="personality" element={<PersonalityPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
}

export default App;
