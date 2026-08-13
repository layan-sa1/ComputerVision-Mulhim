import { Asset } from "expo-asset";

const ALL_IMAGES = [
  // =========================
  // ONBOARDING
  // =========================
  require("./assets/onboarding-stand.png"),
  require("./assets/onboarding-space.png"),
  require("./assets/onboarding-lighting.png"),
  require("./assets/onboarding-clothing-good.png"),
  require("./assets/onboarding-clothing-bad.png"),

  // =========================
  // EXERCISES
  // =========================
  require("./assets/incline-press.png"),
  require("./assets/medball-pushup.png"),
  require("./assets/incline-press-close-grip.png"),
  require("./assets/incline-press-rotation.png"),
  require("./assets/incline-flye.png"),
  require("./assets/squat.png"),

  // =========================
  // MASCOTS
  // =========================
  require("./assets/mascot-flame.png"),
  require("./assets/mascot-celebrate.png"),
];

export async function preloadAllImages() {
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
}