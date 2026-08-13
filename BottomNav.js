import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Dumbbell, UtensilsCrossed, Plus, Sparkles, Home } from "./icons";
import colors from "./Colors";

export default function BottomNav({ active = "workouts", onChange = () => {} }) {
  return (
    <View style={styles.wrap}>
      <TabIcon Icon={Dumbbell} tabKey="workouts" active={active} onPress={onChange} />
      <TabIcon Icon={UtensilsCrossed} tabKey="nutrition" active={active} onPress={onChange} />
      <TouchableOpacity style={styles.centerButton} activeOpacity={0.85} onPress={() => onChange("add")}>
        <Plus size={22} color="#FFFFFF" />
      </TouchableOpacity>
      <TabIcon Icon={Sparkles} tabKey="ai" active={active} onPress={onChange} />
      <TabIcon Icon={Home} tabKey="home" active={active} onPress={onChange} />
    </View>
  );
}

function TabIcon({ Icon, tabKey, active, onPress }) {
  const isActive = active === tabKey;
  return (
    <TouchableOpacity style={styles.tab} activeOpacity={0.7} onPress={() => onPress(tabKey)}>
      <Icon size={20} color={isActive ? colors.primary : colors.textSecondary} strokeWidth={isActive ? 2.2 : 1.8} />
      {isActive && <View style={styles.activeDot} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-around",
    backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border,
    paddingTop: 10, paddingBottom: 22, paddingHorizontal: 12,
  },
  tab: { alignItems: "center", justifyContent: "center", width: 44, height: 30 },
  activeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.primary, marginTop: 3 },
  centerButton: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: colors.primary,
    alignItems: "center", justifyContent: "center", marginTop: -26,
    shadowColor: colors.primary, shadowOpacity: 0.35, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 6,
  },
});