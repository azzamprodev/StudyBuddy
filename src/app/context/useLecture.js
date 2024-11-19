"use client";
import { createContext, useContext, useState, useEffect } from "react";

const LectureContext = createContext();

export const LectureProvider = ({ children }) => {
  const [currentLecture, setCurrentLectureState] = useState(null);

  // Wrapper to update both state and sessionStorage
  const setCurrentLecture = (lecture) => {
    setCurrentLectureState(lecture);
    if (lecture) {
      sessionStorage.setItem("currentLecture", JSON.stringify(lecture));
    } else {
      sessionStorage.removeItem("currentLecture");
    }
  };

  // Initialize from sessionStorage on load
  useEffect(() => {
    const storedLecture = sessionStorage.getItem("currentLecture");
    if (storedLecture) {
      setCurrentLectureState(JSON.parse(storedLecture));
    }
  }, []);

  return (
    <LectureContext.Provider value={{ currentLecture, setCurrentLecture }}>
      {children}
    </LectureContext.Provider>
  );
};

export const useLecture = () => useContext(LectureContext);
