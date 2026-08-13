import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { ArrowLeft, Settings, Clock, Repeat, RefreshCcw, Pause, Camera } from "./icons";
import colors from "./Colors";

import EXERCISES from "./ExercisesData";

const SET_DURATION_SECONDS = 300; // 05:00 — مدة العد التنازلي لكل مجموعة

export default function ActiveWorkout({ onBack, detecting = false, exerciseId, setIndex = 1, roundIndex = 1, setsPerRound = 3, totalRounds = 2, onFinishSet }) {
  const ex = EXERCISES.find((e) => e.id === exerciseId) || EXERCISES[0];
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [voiceGuidance, setVoiceGuidance] = useState(true);
  const [vibrateOnError, setVibrateOnError] = useState(true);
  const [remainingSeconds, setRemainingSeconds] = useState(SET_DURATION_SECONDS);

  // يعيد ضبط العدّاد كل ما تبدأ مجموعة جديدة
  useEffect(() => {
    setRemainingSeconds(SET_DURATION_SECONDS);
  }, [setIndex, roundIndex]);

  useEffect(() => {
    if (remainingSeconds <= 0) return;
    const id = setInterval(() => {
      setRemainingSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [remainingSeconds > 0]);

  const mm = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const ss = String(remainingSeconds % 60).padStart(2, "0");

  // تبديل بين كاميرتك والمدرب (زي مران) — "trainer" يعرض صورة/فيديو التمرين
  // المرجعي، و"camera" يعرض الكاميرا الحية.
  const [viewMode, setViewMode] = useState("camera");

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.iconBtn} hitSlop={8}>
          <ArrowLeft size={18} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} hitSlop={8} onPress={() => setSettingsOpen((s) => !s)}>
          <Settings size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {settingsOpen && (
        <View style={styles.settingsPanel}>
          <SettingRow label="الإرشاد الصوتي" value={voiceGuidance} onChange={setVoiceGuidance} />
          <SettingRow label="اهتزاز عند خطأ بالوضعية" value={vibrateOnError} onChange={setVibrateOnError} />
        </View>
      )}

      {/* مفتاح كاميرتك / المدرب */}
      <View style={styles.viewSwitch}>
        <TouchableOpacity
          style={[styles.viewSwitchBtn, viewMode === "camera" && styles.viewSwitchBtnActive]}
          onPress={() => setViewMode("camera")}
        >
          <Text style={[styles.viewSwitchText, viewMode === "camera" && styles.viewSwitchTextActive]}>كاميرتك</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewSwitchBtn, viewMode === "trainer" && styles.viewSwitchBtnActive]}
          onPress={() => setViewMode("trainer")}
        >
          <Text style={[styles.viewSwitchText, viewMode === "trainer" && styles.viewSwitchTextActive]}>المدرب</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cameraFrame}>
        {viewMode === "trainer" ? (
          <>
            {ex.demoVideo ? (
              <Video
                source={ex.demoVideo}
                style={styles.trainerImage}
                resizeMode={ResizeMode.COVER}
                shouldPlay
                isLooping
                isMuted
              />
            ) : (
              <Image source={ex.image} style={styles.trainerImage} resizeMode="cover" />
            )}
            <View style={styles.cameraBadge}>
              <Text style={styles.cameraBadgeText}>عرض المدرب — {ex.name}</Text>
            </View>
          </>
        ) : detecting ? (
          <>
            <View style={styles.cameraBadge}>
              <Camera size={13} color="#FFFFFF" />
              <Text style={styles.cameraBadgeText}>الكاميرا قيد العمل</Text>
            </View>
            <View style={styles.cameraPlaceholder} />
            <View style={styles.warnBanner}>
              <Text style={styles.warnText}>يرجى إظهار جميع أجزاء جسمك داخل الإطار</Text>
            </View>
          </>
        ) : (
          <View style={styles.cameraPlaceholderLive} />
        )}
      </View>

      <View style={styles.exerciseCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.exerciseName}>{ex.name}</Text>
          <Text style={styles.exerciseProgress}>
            جولة {roundIndex} من {totalRounds} · مجموعة {setIndex} من {setsPerRound}
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${(setIndex / setsPerRound) * 100}%` }]} />
          </View>
        </View>
        <Image source={ex.image} style={styles.exerciseThumb} resizeMode="cover" />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={styles.statLabelRow}>
            <Clock size={13} color={colors.primary} />
            <Text style={styles.statLabel}>الوقت المتبقي</Text>
          </View>
          <Text style={styles.statValue}>{mm}:{ss}</Text>
          <Text style={styles.statUnit}>دقائق  ثواني</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statLabelRow}>
            <Repeat size={13} color={colors.primary} />
            <Text style={styles.statLabel}>عدد التكرار</Text>
          </View>
          <Text style={styles.statValue}>9<Text style={styles.statValueMuted}>/15</Text></Text>
        </View>
      </View>

      <View style={styles.controlsRow}>
        <View style={styles.controlItem}>
          <TouchableOpacity style={styles.controlBtn}>
            <RefreshCcw size={18} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.controlLabel}>قلب الكاميرا</Text>
        </View>
        <View style={styles.controlItem}>
          <TouchableOpacity style={styles.controlBtn}>
            <Pause size={18} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.controlLabel}>إيقاف</Text>
        </View>
      </View>

      {/* TEMP for Snack testing only — in production this should trigger
          automatically once the rep-counter/timer for the current set completes */}
      {onFinishSet && (
        <TouchableOpacity onPress={onFinishSet} style={styles.testFinishLink}>
          <Text style={styles.testFinishText}>
            [معاينة] إنهاء المجموعة {setIndex}{setIndex >= setsPerRound ? " (آخر مجموعة بالجولة)" : ""}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({ label, value, onChange }) {
  return (
    <View style={styles.settingRow}>
      <TouchableOpacity
        style={[styles.settingToggle, value ? styles.settingToggleOn : null]}
        onPress={() => onChange(!value)}
        activeOpacity={0.8}
      >
        <View style={[styles.settingKnob, value ? styles.settingKnobOn : null]} />
      </TouchableOpacity>
      <Text style={styles.settingLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  scrollContent: { paddingBottom: 24 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 8, paddingBottom: 10 },
  iconBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.card, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  settingsPanel: { marginHorizontal: 16, marginBottom: 10, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 12, gap: 10 },
  settingRow: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" },
  settingLabel: { fontSize: 12, fontWeight: "700", color: colors.text },
  settingToggle: { width: 40, height: 22, borderRadius: 11, backgroundColor: colors.border, padding: 2, justifyContent: "center" },
  settingToggleOn: { backgroundColor: colors.primary },
  settingKnob: { width: 18, height: 18, borderRadius: 9, backgroundColor: "#FFFFFF", alignSelf: "flex-start" },
  settingKnobOn: { alignSelf: "flex-end" },
  cameraFrame: { marginHorizontal: 16, borderRadius: 20, overflow: "hidden" },
  viewSwitch: { flexDirection: "row-reverse", alignSelf: "center", backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 3, marginBottom: 10, gap: 3 },
  viewSwitchBtn: { paddingHorizontal: 18, paddingVertical: 7, borderRadius: 9 },
  viewSwitchBtnActive: { backgroundColor: colors.primary },
  viewSwitchText: { fontSize: 12, fontWeight: "700", color: colors.text },
  viewSwitchTextActive: { color: "#FFFFFF" },
  trainerImage: { width: "100%", height: 320 },
  cameraBadge: { position: "absolute", top: 12, left: 12, zIndex: 2, flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(0,0,0,0.5)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  cameraBadgeText: { color: "#FFFFFF", fontSize: 10, fontWeight: "700" },
  cameraPlaceholder: { height: 320, backgroundColor: "#0A0F0F" },
  cameraPlaceholderLive: { height: 320, backgroundColor: colors.surface },
  warnBanner: { position: "absolute", bottom: 12, alignSelf: "center", backgroundColor: colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  warnText: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
  exerciseCard: {
    flexDirection: "row-reverse", alignItems: "center", gap: 12, marginHorizontal: 16, marginTop: 14,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 12,
  },
  exerciseName: { fontSize: 13, fontWeight: "800", color: colors.text, textAlign: "right" },
  exerciseProgress: { fontSize: 11, color: colors.textSecondary, textAlign: "right", marginTop: 2, marginBottom: 6 },
  progressTrack: { height: 5, backgroundColor: colors.border, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: colors.primary, borderRadius: 3 },
  exerciseThumb: { width: 44, height: 44, borderRadius: 10 },
  exerciseThumbPlaceholder: { width: 44, height: 44, borderRadius: 10, backgroundColor: colors.surface },
  statsRow: { flexDirection: "row", gap: 10, marginHorizontal: 16, marginTop: 12 },
  statCard: { flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 12, alignItems: "center" },
  statLabelRow: { flexDirection: "row-reverse", alignItems: "center", gap: 5, marginBottom: 8 },
  statLabel: { fontSize: 11, fontWeight: "700", color: colors.text },
  statValue: { fontSize: 24, fontWeight: "800", color: colors.primary },
  statValueMuted: { fontSize: 14, color: colors.textLight, fontWeight: "600" },
  statUnit: { fontSize: 9, color: colors.textSecondary, marginTop: 2 },
  controlsRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 22 },
  controlItem: { alignItems: "center", gap: 6 },
  controlBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: `${colors.primary}18`, alignItems: "center", justifyContent: "center" },
  controlLabel: { fontSize: 10, fontWeight: "700", color: colors.text },
  testFinishLink: { alignSelf: "center", marginTop: 16 },
  testFinishText: { fontSize: 10, color: colors.textLight, textDecorationLine: "underline" },
});
