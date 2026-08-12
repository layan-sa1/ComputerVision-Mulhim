import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import colors from "./Colors";

// ملف واحد لكل شاشات الـ Onboarding الأربع.
// نتنقّل بينها بـ state (currentStep) بدل ملفات منفصلة — أخف وأسهل بالصيانة.
// الصور تتحمّل مباشرة من GitHub (نفس طريقة باقي المشروع).
// ⬇️ ارفعي الصور للريبو داخل مجلد assets بنفس هالأسماء بالضبط:
//    onboarding-stand.png          (الجوال على الحامل)
//    onboarding-space.png          (الرياضي داخل الإطار)
//    onboarding-lighting.png       (الماسكوت تحت الإضاءة)
//    onboarding-clothing-good.png  (الملابس المناسبة)
//    onboarding-clothing-bad.png   (الملابس غير المناسبة)
const A =
  "https://raw.githubusercontent.com/layan-sa1/ComputerVision-Mulhim/main/assets";

const STEPS = [
  {
    key: "stand",
    number: "01",
    image: `${A}/onboarding-stand.png`,
    title: "ضع الجوال على حامل ثابت",
    subtitle: "لضمان تصوير واضح وثابت لحركتك",
  },
  {
    key: "space",
    number: "02",
    image: `${A}/onboarding-space.png`,
    title: "تأكد من وجود مساحة كافية",
    subtitle: "لتتحرك بحرية داخل الإطار وللحصول على أفضل نتائج",
  },
  {
    key: "lighting",
    number: "03",
    image: `${A}/onboarding-lighting.png`,
    title: "إضاءة المكان جيدة وواضحة",
    subtitle: "إضاءة جيدة تساعد على تتبع حركتك بدقة",
  },
  {
    key: "clothing",
    number: "04",
    title: "خل حركتك أوضح",
    subtitle:
      "ارتد ملابس مريحة وذات تباين واضح مع الخلفية لتحسين دقة تتبع حركتك.",
    goodImage: `${A}/onboarding-clothing-good.png`,
    badImage: `${A}/onboarding-clothing-bad.png`,
    badPoints: [
      "ملابس واسعة تخفي تفاصيل الجسم.",
      "ملابس قريبة من لون الخلفية.",
    ],
    warning: "قد تقلل دقة تتبع الحركة.",
  },
];

export default function Onboarding({ onFinish = () => {} }) {
  const [current, setCurrent] = useState(0);
  const step = STEPS[current];
  const isLast = current === STEPS.length - 1;

  const next = () => {
    if (isLast) onFinish();
    else setCurrent((c) => c + 1);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* الهيدر: تخطي + شريط التقدّم */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onFinish} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.skip}>تخطي</Text>
        </TouchableOpacity>
        <View style={styles.progress}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressSeg,
                i <= current ? styles.progressActive : styles.progressInactive,
              ]}
            />
          ))}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {step.key === "clothing" ? (
          <ClothingStep step={step} />
        ) : (
          <StandardStep step={step} />
        )}
      </ScrollView>

      {/* الفوتر: زر التالي / ابدأ التمرين */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cta} activeOpacity={0.85} onPress={next}>
          {isLast ? (
            <>
              <Ionicons name="sparkles" size={15} color="#FFFFFF" />
              <Text style={styles.ctaText}>ابدأ التمرين</Text>
            </>
          ) : (
            <>
              <Text style={styles.ctaText}>التالي</Text>
              <Feather name="chevron-left" size={18} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ---------- شاشة عادية (1 → 3) ---------- */
function StandardStep({ step }) {
  return (
    <View style={styles.standardWrap}>
      <View style={styles.illustration}>
        <Image
          source={{ uri: step.image }}
          style={styles.illustrationImg}
          resizeMode="contain"
        />
      </View>

      <View style={styles.numberBadge}>
        <Text style={styles.numberText}>{step.number}</Text>
      </View>

      <Text style={styles.title}>{step.title}</Text>
      <Text style={styles.subtitle}>{step.subtitle}</Text>
    </View>
  );
}

/* ---------- شاشة الملابس (4) ---------- */
function ClothingStep({ step }) {
  return (
    <View style={styles.clothingWrap}>
      <View style={styles.numberBadge}>
        <Text style={styles.numberText}>{step.number}</Text>
      </View>

      <View style={styles.titleRow}>
        <Ionicons name="sparkles" size={18} color={colors.accent} />
        <Text style={styles.titleRight}>{step.title}</Text>
      </View>
      <Text style={styles.subtitleRight}>{step.subtitle}</Text>

      {/* المناسب — داخل إطار التقاط */}
      <View style={styles.goodCard}>
        <View style={styles.goodBadge}>
          <Feather name="check" size={12} color="#FFFFFF" />
          <Text style={styles.goodBadgeText}>مناسب</Text>
        </View>

        <Image
          source={{ uri: step.goodImage }}
          style={styles.goodImg}
          resizeMode="contain"
        />

        {/* زوايا إطار الالتقاط الأربع */}
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />
      </View>

      {/* غير المناسب */}
      <Text style={styles.badLabel}>الملابس غير المناسبة</Text>
      <View style={styles.badRow}>
        <View style={styles.badImgWrap}>
          <Image
            source={{ uri: step.badImage }}
            style={styles.badImg}
            resizeMode="contain"
          />
          <View style={styles.badMark}>
            <Feather name="x" size={12} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.badPoints}>
          {step.badPoints.map((p, i) => (
            <View key={i} style={styles.badPointRow}>
              <View style={styles.dot} />
              <Text style={styles.badPointText}>{p}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.warningRow}>
        <Feather name="alert-triangle" size={13} color={colors.danger} />
        <Text style={styles.warningText}>{step.warning}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },

  /* الهيدر */
  header: { paddingHorizontal: 20, paddingTop: 8 },
  skip: {
    alignSelf: "flex-end",
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 12,
  },
  progress: { flexDirection: "row", gap: 6 },
  progressSeg: { flex: 1, height: 4, borderRadius: 999 },
  progressActive: { backgroundColor: colors.primary },
  progressInactive: { backgroundColor: colors.border },

  scroll: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 24, flexGrow: 1 },

  /* البادج الرقمي */
  numberBadge: {
    alignSelf: "center",
    minWidth: 44,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: `${colors.primary}12`,
    marginBottom: 12,
  },
  numberText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.primary,
    textAlign: "center",
  },

  /* شاشة عادية */
  standardWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  illustration: {
    width: "100%",
    height: 360,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  illustrationImg: { width: "94%", height: "100%" },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.primary,
    textAlign: "center",
    lineHeight: 30,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 16,
  },

  /* شاشة الملابس */
  clothingWrap: { flex: 1 },
  titleRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
    marginBottom: 6,
  },
  titleRight: { fontSize: 20, fontWeight: "800", color: colors.primary, textAlign: "right" },
  subtitleRight: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "right",
    lineHeight: 20,
    marginBottom: 16,
  },

  goodCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 10,
    backgroundColor: colors.card,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 26,
    height: 26,
    borderColor: colors.primary,
  },
  cornerTL: { top: 10, left: 10, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 10 },
  cornerTR: { top: 10, right: 10, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 10 },
  cornerBL: { bottom: 10, left: 10, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 10 },
  cornerBR: { bottom: 10, right: 10, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 10 },
  goodBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    zIndex: 2,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.success,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  goodBadgeText: { color: "#FFFFFF", fontSize: 11, fontWeight: "800" },
  goodImg: { width: "100%", height: 300, borderRadius: 12 },

  badLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.danger,
    textAlign: "right",
    marginTop: 18,
    marginBottom: 10,
  },
  badRow: { flexDirection: "row-reverse", alignItems: "center", gap: 14 },
  badImgWrap: { width: 100, height: 100, borderRadius: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  badImg: { width: 100, height: 100, borderRadius: 14 },
  badMark: {
    position: "absolute",
    top: -6,
    left: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.surface,
  },
  badPoints: { flex: 1, gap: 8 },
  badPointRow: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 8 },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.textSecondary,
    marginTop: 7,
  },
  badPointText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "right",
    lineHeight: 18,
  },

  warningRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    backgroundColor: `${colors.danger}10`,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 16,
  },
  warningText: { fontSize: 12, fontWeight: "600", color: colors.danger, textAlign: "right" },

  /* الفوتر */
  footer: { paddingHorizontal: 20, paddingBottom: 16, paddingTop: 8, backgroundColor: colors.surface },
  cta: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  ctaText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
});