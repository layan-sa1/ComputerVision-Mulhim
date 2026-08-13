import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { EyeOff, ShieldCheck, Smartphone, Target, BarChart3, Lightbulb, TrendingUp, Sparkles } from "./icons";
import colors from "./Colors";
import Mascot from "./Mascot";

const FEATURES = [
  { Icon: Target, title: "تصحيح فوري لحركتك" },
  { Icon: BarChart3, title: "تقييم دقة الأداء" },
  { Icon: Lightbulb, title: "تجربة مخصصة لك" },
  { Icon: TrendingUp, title: "متابعة تطور أدائك" },
   { Icon: ShieldCheck, title: "خصوصيتك أولويتنا، بدون تسجيل أو مشاركة لبياناتك" },
];

export default function CvIntro({ onStart }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View style={styles.freeBadge}>
            <Sparkles size={12} color={colors.accent} />
            <Text style={styles.freeBadgeText}>تجربة مجانية</Text>
          </View>
        </View>

        <Text style={styles.brand}>ملهم</Text>
        <Text style={styles.headline}>مدربك الذكي </Text>
        <Text style={styles.subline}>تدريب ذكي، نتائج أفضل.</Text>
        
        <View style={styles.mascotWrap}>
          <View style={styles.mascotStars}>
            <Sparkles size={20} color={colors.accent} style={[styles.star, styles.starTopLeft]} />
            <Sparkles size={14} color={colors.accent} style={[styles.star, styles.starTopRight]} />
            <Sparkles size={16} color={colors.accent} style={[styles.star, styles.starBottomLeft]} />
            <Mascot size={110} pose="wave" />
          </View>
        </View>

        <View style={styles.featureCard}>
          {FEATURES.map((f, i) => (
            <View key={f.title} style={[styles.featureRow, i < FEATURES.length - 1 && styles.featureRowBorder]}>
              <f.Icon size={16} color={colors.primary} />
              <Text style={styles.featureText}>{f.title}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.ctaButton} activeOpacity={0.85} onPress={onStart}>
          <Sparkles size={15} color="#FFFFFF" />
          <Text style={styles.ctaText}>ابدأ التجربة</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function PrivacyItem({ Icon, label }) {
  return (
    <View style={styles.privacyItem}>
      <Icon size={16} color={colors.primary} />
      <Text style={styles.privacyItemLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },
  topRow: { alignItems: "flex-end", marginBottom: 16 },
  freeBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: `${colors.accent}22`, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  freeBadgeText: { fontSize: 10, fontWeight: "700", color: "#8A5A12" },
  brand: { fontSize: 26, fontWeight: "800", color: colors.primary, textAlign: "center" },
  headline: { fontSize: 15, fontWeight: "700", color: colors.text, textAlign: "center", marginTop: 4, lineHeight: 22 },
  subline: { fontSize: 12, color: colors.textSecondary, textAlign: "center", marginTop: 6 },
  privacyCard: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 12, marginTop: 18 },
  privacyTitleRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 10 },
  privacyTitle: { fontSize: 11, fontWeight: "700", color: colors.text },
  privacyItems: { flexDirection: "row", justifyContent: "space-around" },
  privacyItem: { alignItems: "center", gap: 4, width: 76 },
  privacyItemLabel: { fontSize: 9, color: colors.textSecondary, textAlign: "center", lineHeight: 12 },
  mascotWrap: { alignItems: "center", paddingVertical: 20 },
  mascotStars: { alignItems: "center", justifyContent: "center" },
  star: { position: "absolute" },
  starTopLeft: { top: 6, left: 18 },
  starTopRight: { top: 22, right: 14 },
  starBottomLeft: { bottom: 14, left: 4 },
  featureCard: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 16, overflow: "hidden" },
  featureRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10, paddingHorizontal: 14, paddingVertical: 12 },
  featureRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  featureText: { flex: 1, fontSize: 12, fontWeight: "600", color: colors.text, textAlign: "right" },
  footer: { paddingHorizontal: 20, paddingBottom: 16, paddingTop: 8, backgroundColor: colors.surface },
  ctaButton: { backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  ctaText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
});
