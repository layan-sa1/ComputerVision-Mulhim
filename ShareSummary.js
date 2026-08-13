import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch, SafeAreaView } from "react-native";
import { X, Clock, RotateCw, Flame, Star, Share, Download, Copy } from "./icons";
import colors from "./Colors";

let mascotCelebrate = null;
try {
  mascotCelebrate = require("./assets/mascot-celebrate.png");
} catch (e) {
  mascotCelebrate = null;
}

const STATS = [
  { key: "time", Icon: Clock, label: "الوقت", value: "16s", color: colors.primary },
  { key: "reps", Icon: RotateCw, label: "التكرار", value: "4", color: "#7C5CFC" },
  { key: "cal", Icon: Flame, label: "سعرات", value: "0", color: colors.danger },
  { key: "accuracy", Icon: Star, label: "الدقة", value: "90%", color: colors.success },
];

export default function ShareSummary({ onClose }) {
  const [continueWithAI, setContinueWithAI] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={{ width: 60 }} />
        <Text style={styles.headerTitle}>مشاركة النشاط</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={8}>
          <X size={13} color={colors.text} />
          <Text style={styles.closeText}>إغلاق</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.brand}>🔥 ملهم</Text>
        <View style={styles.resultRow}>
          {mascotCelebrate ? (
            <Image source={mascotCelebrate} style={styles.mascot} resizeMode="contain" />
          ) : (
            <View style={styles.mascotFallback} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.resultTitle}>أحسنت!</Text>
            <Text style={styles.resultSubtitle}>أكملت أول تمرين بنجاح</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.statsGrid}>
          {STATS.map((s) => (
            <View key={s.key} style={styles.statItem}>
              <View style={[styles.statIconWrap, { backgroundColor: `${s.color}18` }]}>
                <s.Icon size={22} color={s.color} />
              </View>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.toggleRow}>
        <Switch value={continueWithAI} onValueChange={setContinueWithAI} trackColor={{ true: colors.primary, false: colors.border }} />
        <Text style={styles.toggleLabel}>هل ترغب بإكمال تمارينك مع المدرب الذكي؟</Text>
      </View>

      <View style={styles.actionsRow}>
        <ActionButton Icon={Share} label="المزيد" />
        <ActionButton Icon={Download} label="حفظ" />
        <ActionButton Icon={Copy} label="نسخ الصورة" />
      </View>
    </SafeAreaView>
  );
}

function ActionButton({ Icon, label }) {
  return (
    <View style={styles.actionItem}>
      <TouchableOpacity style={styles.actionBtn}>
        <Icon size={17} color={colors.primary} />
      </TouchableOpacity>
      <Text style={styles.actionLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 8, paddingBottom: 14 },
  headerTitle: { fontSize: 14, fontWeight: "800", color: colors.text },
  closeBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 4, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  closeText: { fontSize: 11, fontWeight: "700", color: colors.text },
  card: { marginHorizontal: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 16 },
  brand: { fontSize: 15, fontWeight: "800", color: colors.primary, textAlign: "right", marginBottom: 12 },
  resultRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  mascot: { width: 92, height: 92 },
  mascotFallback: { width: 92, height: 92, borderRadius: 46, backgroundColor: colors.primary },
  resultTitle: { fontSize: 20, fontWeight: "800", color: colors.text, textAlign: "right" },
  resultSubtitle: { fontSize: 13, color: colors.textSecondary, textAlign: "right", marginTop: 4 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 16 },
  statsGrid: { flexDirection: "row", justifyContent: "space-between" },
  statItem: { alignItems: "center", gap: 6, flex: 1 },
  statIconWrap: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  statLabel: { fontSize: 12, color: colors.textSecondary },
  statValue: { fontSize: 18, fontWeight: "800", color: colors.text },
  toggleRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10, marginHorizontal: 16, marginTop: 18 },
  toggleLabel: { flex: 1, fontSize: 11, color: colors.text, textAlign: "right" },
  actionsRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 28 },
  actionItem: { alignItems: "center", gap: 6 },
  actionBtn: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  actionLabel: { fontSize: 10, fontWeight: "600", color: colors.text },
});
