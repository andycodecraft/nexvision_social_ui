// ProfilesContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const ProfilesContext = createContext(null);

export const ProfilesProvider = ({ children }) => {
  const [profiles, setProfiles] = useState(() => {
    // read once on init
    const stored = localStorage.getItem("profiles");
    return stored ? JSON.parse(stored) : [];
  });

  // persist whenever profiles change
  useEffect(() => {
    localStorage.setItem("profiles", JSON.stringify(profiles));
  }, [profiles]);

  return (
    <ProfilesContext.Provider value={{ profiles, setProfiles }}>
      {children}
    </ProfilesContext.Provider>
  );
};

export const useProfiles = () => {
  const ctx = useContext(ProfilesContext);
  if (!ctx) throw new Error("useProfiles must be used within ProfilesProvider");
  return ctx;
};
