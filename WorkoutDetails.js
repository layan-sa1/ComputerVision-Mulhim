import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView } from "react-native";
import { ChevronDown, ChevronUp, Plus, Sparkles, Camera, Hand, ClipboardList } from "./icons";
import colors from "./Colors";
import BottomNav from "./BottomNav";
import EXERCISES from "./ExercisesData";

export default function WorkoutDetails({ exerciseId, onBack, onNavTab, onSmartCorrection }) {
  const [musclesOpen, setMusclesOpen] = useState(true);
  const [stepsOpen, setStepsOpen] = useState(true);

  const ex = EXERCISES.find((e) => e.id === exerciseId) || EXERCISES[0];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} hitSlop={8}>
            <Text style={styles.backChevron}>‹</Text>
          </TouchableOpacity>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.title}>{ex.name}</Text>
            <Text style={styles.subtitle}>{ex.subtitle}</Text>
          </View>
          <View style={{ width: 20 }} />
        </View>

        <Image source={ex.image} style={styles.photo} resizeMode="cover" />

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.addExerciseBtn} activeOpacity={0.85}>
            <Plus size={15} color="#FFFFFF" />
            <Text style={styles.addExerciseText}>أضف التمرين</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.smartCorrectBtn} activeOpacity={0.85} onPress={onSmartCorrection}>
            <Sparkles size={13} color={colors.primary} />
            <Text style={styles.smartCorrectText}>جرّب التصحيح الذكي</Text>
            <Camera size={13} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <Accordion title="العضلات المستهدفة" Icon={Hand} open={musclesOpen} onToggle={() => setMusclesOpen((s) => !s)}>
          <View style={styles.muscleDiagramRow}>
            <View style={styles.muscleFigure} />
            <View style={styles.muscleFigure} />
          </View>
          <View style={styles.muscleList}>
            {ex.targetMuscles.map((m) => (
              <View key={m} style={styles.muscleItem}>
                <Text style={styles.muscleItemText}>{m}</Text>
                <View style={styles.muscleDot} />
              </View>
            ))}
          </View>
        </Accordion>

        <Accordion title="كيفية أداء التمرين" Icon={ClipboardList} open={stepsOpen} onToggle={() => setStepsOpen((s) => !s)}>
          <View style={{ gap: 12 }}>
            {ex.steps.map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <Text style={styles.stepText}>{step}</Text>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{i + 1}</Text>
                </View>
              </View>
            ))}
          </View>
        </Accordion>
      </ScrollView>

      <BottomNav active="workouts" onChange={onNavTab} />
    </SafeAreaView>
  );
}

function Accordion({ title, Icon, open, onToggle, children }) {
  return (
    <View style={styles.accordion}>
      <TouchableOpacity style={styles.accordionHeader} onPress={onToggle} activeOpacity={0.7}>
        {open ? <ChevronUp size={16} color={colors.textSecondary} /> : <ChevronDown size={16} color={colors.textSecondary} />}
        <View style={styles.accordionTitleRow}>
          <Text style={styles.accordionTitle}>{title}</Text>
          <Icon size={16} color={colors.primary} />
        </View>
      </TouchableOpacity>
      {open && <View style={styles.accordionBody}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 8, paddingBottom: 14 },
  backChevron: { fontSize: 22, color: colors.text },
  title: { fontSize: 17, fontWeight: "800", color: colors.text },
  subtitle: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  photo: { marginHorizontal: 16, height: 220, borderRadius: 20, backgroundColor: colors.surfaceMuted || colors.surface, width: undefined, alignSelf: "stretch" },
  actionsRow: { flexDirection: "row-reverse", gap: 10, paddingHorizontal: 16, marginTop: 14 },
  addExerciseBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 6, backgroundColor: colors.primary, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12 },
  addExerciseText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
  smartCorrectBtn: { flex: 1, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingVertical: 12 },
  smartCorrectText: { color: colors.primary, fontSize: 12, fontWeight: "800" },
  accordion: { marginHorizontal: 16, marginTop: 12, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 16, overflow: "hidden" },
  accordionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, paddingVertical: 14 },
  accordionTitleRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  accordionTitle: { fontSize: 13, fontWeight: "800", color: colors.text },
  accordionBody: { paddingHorizontal: 14, paddingBottom: 16 },
  muscleDiagramRow: { flexDirection: "row-reverse", gap: 10, marginBottom: 14 },
  muscleFigure: { flex: 1, height: 140, borderRadius: 12, backgroundColor: colors.surface },
  muscleList: { gap: 8 },
  muscleItem: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" },
  muscleItemText: { fontSize: 12, color: colors.text },
  muscleDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.primary },
  stepRow: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10 },
  stepNumber: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", marginTop: 1 },
  stepNumberText: { color: "#FFFFFF", fontSize: 11, fontWeight: "800" },
  stepText: { flex: 1, fontSize: 12, color: colors.text, textAlign: "right", lineHeight: 18 },
});
