import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, SafeAreaView } from "react-native";
import { Search, SlidersHorizontal, Plus, Sparkles, Grid2x2, Shirt, Backpack, CircleDot, Dumbbell, Footprints } from "./icons";
import colors from "./Colors";
import BottomNav from "./BottomNav";
import EXERCISES, { LEVEL_COLORS } from "./ExercisesData";

const FILTERS = [
  { key: "all", label: "الكل", Icon: Grid2x2 },
  { key: "chest", label: "صدر", Icon: Shirt },
  { key: "back", label: "ظهر", Icon: Backpack },
  { key: "shoulder", label: "كتف", Icon: CircleDot },
  { key: "arm", label: "ذراع", Icon: Dumbbell },
  { key: "leg", label: "رجل", Icon: Footprints },
];

const DIFFICULTY_STEPS = { مبتدئ: 1, متوسط: 2, متقدم: 3 };

export default function WorkoutsList({ onOpenExercise, onNavTab }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = activeFilter === "all" ? EXERCISES : EXERCISES.filter((e) => e.muscleKey === activeFilter);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>قائمة التمارين</Text>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search size={15} color={colors.textSecondary} />
          <TextInput placeholder="ابحث عن تمرين..." placeholderTextColor={colors.textLight} style={styles.searchInput} />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <SlidersHorizontal size={14} color={colors.text} />
          <Text style={styles.filterBtnText}>فلترة</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.chipsRow, { transform: [{ scaleX: -1 }] }]}
        contentContainerStyle={{ gap: 10, paddingHorizontal: 16 }}
      >
        {FILTERS.map((f) => {
          const active = f.key === activeFilter;
          return (
            <TouchableOpacity
              key={f.key}
              onPress={() => setActiveFilter(f.key)}
              style={[styles.chip, active ? styles.chipActive : null, { transform: [{ scaleX: -1 }] }]}
            >
              <f.Icon size={13} color={active ? "#FFFFFF" : colors.primary} />
              <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>{f.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {filtered.map((ex) => {
          const dots = DIFFICULTY_STEPS[ex.level] || 1;
          const levelColor = LEVEL_COLORS[ex.level] || colors.primary;
          return (
            <TouchableOpacity key={ex.id} style={styles.card} activeOpacity={0.9} onPress={() => onOpenExercise(ex.id)}>
              <View style={styles.cardImage}>
                <Image source={ex.image} style={styles.cardImagePhoto} resizeMode="cover" />
                <View style={styles.smartBadge}>
                  <Sparkles size={9} color={colors.primary} />
                  <Text style={styles.smartBadgeText}>تصحيح ذكي</Text>
                </View>
                <TouchableOpacity style={styles.addBtn}>
                  <Plus size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={2}>{ex.name}</Text>
                <Text style={styles.cardMuscle}>{ex.muscle}</Text>
                <View style={styles.cardMeta}>
                  <View style={styles.dots}>
                    {[0, 1, 2].map((i) => (
                      <View key={i} style={[styles.dot, { backgroundColor: i < dots ? levelColor : colors.border }]} />
                    ))}
                  </View>
                  <Text style={styles.cardMetaText}>{ex.sets}</Text>
                  <Text style={styles.cardMetaText}>{ex.reps}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <BottomNav active="workouts" onChange={onNavTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: { alignItems: "center", paddingTop: 8, paddingBottom: 12 },
  title: { fontSize: 18, fontWeight: "800", color: colors.text },
  searchRow: { flexDirection: "row", gap: 8, paddingHorizontal: 16, marginBottom: 12 },
  searchBox: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 12, height: 40 },
  searchInput: { flex: 1, fontSize: 12, color: colors.text, textAlign: "right" },
  filterBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 12, height: 40 },
  filterBtnText: { fontSize: 12, fontWeight: "700", color: colors.text },
  chipsRow: { flexGrow: 0, marginBottom: 14 },
  chip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 12, fontWeight: "700", color: colors.text },
  chipTextActive: { color: "#FFFFFF" },
  grid: { paddingHorizontal: 16, flexDirection: "row", flexWrap: "wrap", gap: 12, paddingBottom: 12 },
  card: { width: "47%", borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, overflow: "hidden" },
  cardImage: { height: 100, backgroundColor: colors.surface, justifyContent: "flex-end" },
  cardImagePhoto: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  smartBadge: { position: "absolute", top: 6, right: 6, flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "#FFFFFF", paddingHorizontal: 6, paddingVertical: 3, borderRadius: 8 },
  smartBadgeText: { fontSize: 8, fontWeight: "700", color: colors.text },
  addBtn: { position: "absolute", bottom: 6, left: 6, width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  cardBody: { padding: 10 },
  cardTitle: { fontSize: 12, fontWeight: "800", color: colors.text, textAlign: "right", lineHeight: 16 },
  cardMuscle: { fontSize: 10, color: colors.textSecondary, textAlign: "right", marginTop: 3 },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  dots: { flexDirection: "row", gap: 2 },
  dot: { width: 5, height: 5, borderRadius: 2.5 },
  cardMetaText: { fontSize: 9, color: colors.textSecondary },
});
