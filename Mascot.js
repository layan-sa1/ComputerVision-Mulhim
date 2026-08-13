import React from "react";
import { Image } from "react-native";

// الشخصية الرسمية بصورة PNG بدل الرسمة SVG السابقة
export default function Mascot({ size = 120 }) {
  return (
    <Image
      source={require("./assets/mascot-flame.png")}
      style={{ width: size, height: size * 1.15 }}
      resizeMode="contain"
    />
  );
}