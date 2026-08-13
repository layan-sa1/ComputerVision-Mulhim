import React, { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import { Asset } from "expo-asset";

import WorkoutsList from "./WorkoutsList";
import WorkoutDetails from "./WorkoutDetails";
import CvIntro from "./CvIntro";
import Onboarding from "./onboarding";
import PoseCheck from "./PoseCheck";
import ActiveWorkout from "./ActiveWorkout";
import RoundBreak from "./Roundbreak";
import Celebration from "./Celebration";
import ShareSummary from "./ShareSummary";


// ============================================================
// PRELOAD ALL APP IMAGES
// ============================================================

const ALL_IMAGES = [
  // -------------------------
  // ONBOARDING
  // -------------------------
  require("./assets/onboarding-stand.png"),
  require("./assets/onboarding-space.png"),
  require("./assets/onboarding-lighting.png"),
  require("./assets/onboarding-clothing-good.png"),
  require("./assets/onboarding-clothing-bad.png"),

  // -------------------------
  // EXERCISES
  // -------------------------
  require("./assets/incline-press.png"),
  require("./assets/medball-pushup.png"),
  require("./assets/incline-press-close-grip.png"),
  require("./assets/incline-press-rotation.png"),
  require("./assets/incline-flye.png"),
  require("./assets/squat.png"),

  // -------------------------
  // MASCOTS
  // -------------------------
  require("./assets/mascot-flame.png"),
  require("./assets/mascot-celebrate.png"),
];


// ============================================================
// PRELOAD FUNCTION
// ============================================================

const preloadAllImages = async () => {
  try {
    await Promise.all(
      ALL_IMAGES.map((image) =>
        Asset.fromModule(image).downloadAsync()
      )
    );

    console.log("✅ All Mulhim images preloaded");
  } catch (error) {
    console.warn("⚠️ Image preload error:", error);
  }
};


// ============================================================
// DEMO CONFIG
// ============================================================

const SETS_PER_ROUND = 3;
const TOTAL_ROUNDS = 2;


// ============================================================
// APP
// ============================================================

export default function App() {

  const [imagesReady, setImagesReady] = useState(false);

  const [screen, setScreen] = useState("workouts");

  const [selectedExerciseId, setSelectedExerciseId] =
    useState(null);

  const [setIndex, setSetIndex] = useState(1);

  const [roundIndex, setRoundIndex] = useState(1);


  // ==========================================================
  // PRELOAD IMAGES ON APP START
  // ==========================================================

  useEffect(() => {

    let mounted = true;

    const prepareApp = async () => {

      await preloadAllImages();

      if (mounted) {
        setImagesReady(true);
      }

    };

    prepareApp();

    return () => {
      mounted = false;
    };

  }, []);


  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const handleNavTab = (key) => {

    if (key === "workouts") {

      setScreen("workouts");

    } else {

      Alert.alert(
        "تنقّل",
        `تبويب "${key}" مو مبني بهالمعاينة بعد`
      );

    }

  };


  // ==========================================================
  // FINISH SET
  // ==========================================================

  const handleFinishSet = () => {

    const isLastSetOfRound =
      setIndex >= SETS_PER_ROUND;

    setScreen(
      isLastSetOfRound
        ? "roundBreak"
        : "setBreak"
    );

  };


  // ==========================================================
  // BREAK FINISHED
  // ==========================================================

  const handleBreakDone = () => {

    const wasLastSetOfRound =
      setIndex >= SETS_PER_ROUND;


    // ------------------------------------------
    // Last set of current round
    // ------------------------------------------

    if (wasLastSetOfRound) {

      const isLastRound =
        roundIndex >= TOTAL_ROUNDS;


      // ----------------------------------------
      // Entire workout finished
      // ----------------------------------------

      if (isLastRound) {

        setScreen("celebration");

        return;

      }


      // ----------------------------------------
      // Move to next round
      // ----------------------------------------

      setRoundIndex((r) => r + 1);

      setSetIndex(1);

    }

    // ------------------------------------------
    // Move to next set
    // ------------------------------------------

    else {

      setSetIndex((s) => s + 1);

    }


    setScreen("activeWorkout");

  };


  // ==========================================================
  // WAIT UNTIL IMAGES ARE READY
  // ==========================================================

  if (!imagesReady) {

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#F8F9FA",
        }}
      />
    );

  }


  // ==========================================================
  // APP SCREENS
  // ==========================================================

  return (

    <View style={{ flex: 1 }}>

      {/* =====================================================
          WORKOUTS LIST
      ===================================================== */}

      {screen === "workouts" && (

        <WorkoutsList

          onOpenExercise={(id) => {

            setSelectedExerciseId(id);

            // Reset workout progress
            setSetIndex(1);
            setRoundIndex(1);

            setScreen("details");

          }}

          onNavTab={handleNavTab}

        />

      )}


      {/* =====================================================
          WORKOUT DETAILS
      ===================================================== */}

      {screen === "details" && (

        <WorkoutDetails

          exerciseId={selectedExerciseId}

          onBack={() =>
            setScreen("workouts")
          }

          onNavTab={handleNavTab}

          onSmartCorrection={() =>
            setScreen("cvIntro")
          }

        />

      )}


      {/* =====================================================
          COMPUTER VISION INTRO
      ===================================================== */}

      {screen === "cvIntro" && (

        <CvIntro

          onStart={() =>
            setScreen("onboarding")
          }

        />

      )}


      {/* =====================================================
          ONBOARDING
      ===================================================== */}

      {screen === "onboarding" && (

        <Onboarding

          onFinish={() =>
            setScreen("poseCheck")
          }

        />

      )}


      {/* =====================================================
          POSE CHECK
      ===================================================== */}

      {screen === "poseCheck" && (

        <PoseCheck

          exerciseId={selectedExerciseId}

          onBack={() =>
            setScreen("onboarding")
          }

          onStart={() =>
            setScreen("activeWorkout")
          }

        />

      )}


      {/* =====================================================
          ACTIVE WORKOUT
      ===================================================== */}

      {screen === "activeWorkout" && (

        <ActiveWorkout

          onBack={() =>
            setScreen("poseCheck")
          }

          detecting={false}

          exerciseId={selectedExerciseId}

          setIndex={setIndex}

          roundIndex={roundIndex}

          setsPerRound={SETS_PER_ROUND}

          totalRounds={TOTAL_ROUNDS}

          onFinishSet={handleFinishSet}

        />

      )}


      {/* =====================================================
          SET BREAK
      ===================================================== */}

      {screen === "setBreak" && (

        <RoundBreak

          mode="set"

          onFinish={handleBreakDone}

        />

      )}


      {/* =====================================================
          ROUND BREAK
      ===================================================== */}

      {screen === "roundBreak" && (

        <RoundBreak

          mode="round"

          onFinish={handleBreakDone}

        />

      )}


      {/* =====================================================
          CELEBRATION
      ===================================================== */}

      {screen === "celebration" && (

        <Celebration

          onContinue={() =>
            setScreen("shareSummary")
          }

        />

      )}


      {/* =====================================================
          SHARE SUMMARY
      ===================================================== */}

      {screen === "shareSummary" && (

        <ShareSummary

          onClose={() =>
            setScreen("workouts")
          }

        />

      )}

    </View>

  );

}