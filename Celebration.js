import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Easing, Dimensions, SafeAreaView } from "react-native";
import colors from "./Colors";

let mascotCelebrate = null;
try {
  mascotCelebrate = require("./assets/mascot-celebrate.png");
} catch (e) {
  mascotCelebrate = null;
}

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const CONFETTI_COLORS = [colors.accent, colors.success, colors.secondary, "#7C5CFC", colors.primary];
const CONFETTI_COUNT = 18;

function ConfettiPiece({ index }) {
  const fall = useRef(new Animated.Value(0)).current;
  const startX = Math.random() * SCREEN_W;
  const delay = Math.random() * 500;
  const duration = 2200 + Math.random() * 1400;
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const size = 7 + Math.random() * 6;
  const rotateStart = Math.random() * 360;

  useEffect(() => {
    Animated.timing(fall, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, []);

  const translateY = fall.interpolate({ inputRange: [0, 1], outputRange: [-40, SCREEN_H * 0.55] });
  const rotate = fall.interpolate({ inputRange: [0, 1], outputRange: [`${rotateStart}deg`, `${rotateStart + 480}deg`] });
  const opacity = fall.interpolate({ inputRange: [0, 0.85, 1], outputRange: [1, 1, 0] });

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: startX,
        top: 0,
        width: size,
        height: size * 1.6,
        backgroundColor: color,
        borderRadius: 2,
        opacity,
        transform: [{ translateY }, { rotate }],
      }}
    />
  );
}

export default function Celebration({ onContinue }) {
  // تختفي تلقائيًا بعد 6 ثواني وتروح للملخص، بدون ما يحتاج المستخدم يضغط.
  // خليت مساحة الضغط شغالة برضه كخيار تخطي مبكر لو حبت تكمل بسرعة.
  useEffect(() => {
    const id = setTimeout(() => onContinue && onContinue(), 6000);
    return () => clearTimeout(id);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      {Array.from({ length: CONFETTI_COUNT }).map((_, i) => (
        <ConfettiPiece key={i} index={i} />
      ))}

      <TouchableOpacity style={styles.tapArea} activeOpacity={1} onPress={onContinue}>
        <View style={styles.center}>
          {mascotCelebrate ? (
            <Image source={mascotCelebrate} style={styles.mascot} resizeMode="contain" />
          ) : (
            <View style={styles.mascotFallback} />
          )}
          <Text style={styles.title}>أحسنت! ✨</Text>
          <Text style={styles.subtitle}>أكملت أول تمرين بنجاح</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  tapArea: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 4 },
  mascot: { width: 220, height: 220, marginBottom: 12 },
  mascotFallback: { width: 220, height: 220, borderRadius: 110, backgroundColor: colors.primary, marginBottom: 12 },
  title: { fontSize: 24, fontWeight: "800", color: colors.primary },
  underline: { width: 60, height: 2, backgroundColor: colors.primary, marginTop: 4, marginBottom: 10, borderRadius: 1 },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 4  },
});
