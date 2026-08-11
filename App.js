import React, { useState } from "react";
import { View, Alert } from "react-native";
import WorkoutsList from "./WorkoutsList";
import WorkoutDetails from "./WorkoutDetails";
import CvIntro from "./CvIntro";

// Simple state-based screen switcher — no expo-router here since Snack's
// default template doesn't have it set up. Swap this out for real navigation
// once these files are inside the actual project.

export default function App() {
  const [screen, setScreen] = useState("workouts");
  const [selectedExercise, setSelectedExercise] = useState(null);

  const handleNavTab = (key) => {
    if (key === "workouts") setScreen("workouts");
    else Alert.alert("تنقّل", `تبويب "${key}" مو مبني بهالمعاينة بعد`);
  };

  return (
    <View style={{ flex: 1 }}>
      {screen === "workouts" && (
        <WorkoutsList
          onOpenExercise={(ex) => {
            setSelectedExercise(ex);
            setScreen("details");
          }}
          onNavTab={handleNavTab}
        />
      )}
      {screen === "details" && (
        <WorkoutDetails
          exercise={selectedExercise}
          onBack={() => setScreen("workouts")}
          onNavTab={handleNavTab}
          onSmartCorrect={() => setScreen("cvIntro")}
        />
      )}
      {screen === "cvIntro" && <CvIntro onStart={() => setScreen("details")} />}
    </View>
  );
}
