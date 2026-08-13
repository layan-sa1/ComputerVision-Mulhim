import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  ArrowLeft,
  Camera,
  AlertCircle,
} from "./icons";

import colors from "./Colors";
import EXERCISES from "./ExercisesData";

/*
 * Demo-only:
 * جميع أجزاء الجسم تبدأ بحالة detected = true
 * حتى يمكن تجربة الشاشة بدون كاميرا حقيقية.
 *
 * اضغطي على أي Badge لتغيير حالته:
 * ✓ = الجزء ظاهر بشكل صحيح
 * × = الجزء غير ظاهر / غير صحيح
 *
 * لاحقًا يتم ربط ok بنتيجة الـ pose detection الفعلية.
 */

const INITIAL_PARTS = [
  {
    key: "legs",
    label: "الساقان",
  },
  {
    key: "arms",
    label: "الذراعان",
  },
  {
    key: "torso",
    label: "الجذع",
  },
  {
    key: "head",
    label: "الرأس",
  },
];

export default function PoseCheck({
  exerciseId,
  onBack,
  onStart,
}) {
  const [parts, setParts] = useState(
    INITIAL_PARTS.map((p) => ({
      ...p,
      ok: true,
    }))
  );

  /*
   * إذا كانت جميع أجزاء الجسم صحيحة
   * يتم تفعيل زر ابدأ التمرين
   */
  const allOk = parts.every((p) => p.ok);

  const ex =
    EXERCISES.find((e) => e.id === exerciseId) ||
    EXERCISES[0];

  /*
   * Demo:
   * الضغط على أي Badge يغيّر حالته
   */
  const toggle = (key) => {
    setParts((currentParts) =>
      currentParts.map((p) =>
        p.key === key
          ? {
              ...p,
              ok: !p.ok,
            }
          : p
      )
    );
  };

  return (
    <SafeAreaView style={styles.safe}>

      {/* ================= HEADER ================= */}

      <View style={styles.header}>

        <TouchableOpacity
          onPress={onBack}
          style={styles.backBtn}
          hitSlop={8}
          activeOpacity={0.75}
        >
          <ArrowLeft
            size={18}
            color={colors.primary}
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          التحقق من الوضعية
        </Text>

        {/* للمحافظة على توسيط العنوان */}
        <View style={styles.headerSpacer} />

      </View>

      {/* ================= CAMERA ================= */}

      <View style={styles.cameraFrame}>

        <View style={styles.cameraBadge}>

          <Camera
            size={13}
            color="#FFFFFF"
          />

          <Text style={styles.cameraBadgeText}>
            الكاميرا قيد العمل
          </Text>

        </View>

        <View style={styles.cameraPlaceholder} />

        <View style={styles.warnBanner}>

          <AlertCircle
            size={14}
            color="#FFFFFF"
          />

          <Text style={styles.warnText}>
            يرجى إظهار جميع أجزاء جسمك داخل الإطار
          </Text>

        </View>

      </View>

      {/* ================= REFERENCE ================= */}

      <View style={styles.referenceRow}>

        <Image
          source={ex.image}
          style={styles.referenceThumb}
          resizeMode="cover"
        />

        <View style={styles.referenceContent}>

          <Text style={styles.referenceLabel}>
            الوضعية الصحيحة
          </Text>

          <Text style={styles.referenceName}>
            {ex.name}
          </Text>

        </View>

      </View>

      {/* ================= BODY PARTS ================= */}

      <View style={styles.partsRow}>

        {parts.map((p) => (

          <TouchableOpacity
            key={p.key}
            onPress={() => toggle(p.key)}
            activeOpacity={0.8}
            style={[
              styles.partChip,

              /*
               * أخضر فاتح عند النجاح
               * أحمر فاتح عند الخطأ
               */
              p.ok
                ? styles.partChipSuccess
                : styles.partChipError,
            ]}
          >

            {/* Status Icon */}

            <Ionicons
              name={
                p.ok
                  ? "checkmark-circle"
                  : "close-circle"
              }
              size={22}
              color={
                p.ok
                  ? colors.success
                  : colors.danger
              }
              style={styles.statusIcon}
            />

            {/* Label */}

            <Text
              style={styles.partLabel}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
            >
              {p.label}
            </Text>

          </TouchableOpacity>

        ))}

      </View>

      {/* ================= START BUTTON ================= */}

      <TouchableOpacity
        style={[
          styles.startBtn,
          !allOk && styles.startBtnDisabled,
        ]}
        disabled={!allOk}
        activeOpacity={0.85}
        onPress={onStart}
      >

        <View style={styles.startBtnContent}>

          <Ionicons
            name="sparkles"
            size={15}
            color="#FFFFFF"
          />

          <Text style={styles.startBtnText}>
            ابدأ التمرين
          </Text>

        </View>

      </TouchableOpacity>

      {/* ================= HINT ================= */}

      <Text style={styles.hint}>

        {allOk
          ? "[معاينة] اضغطي أي بادج لتجربة حالة الخطأ"
          : "سيتم تفعيل الزر عند ظهور جميع الأجزاء بوضوح"}

      </Text>

    </SafeAreaView>
  );
}


/* ================================================= */
/* ====================== STYLES =================== */
/* ================================================= */

const styles = StyleSheet.create({

  /* ================= GENERAL ================= */

  safe: {
    flex: 1,
    backgroundColor: colors.surface,
  },


  /* ================= HEADER ================= */

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },

  backBtn: {
    width: 34,
    height: 34,

    borderRadius: 17,

    backgroundColor: colors.card,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: colors.border,
  },

  title: {
    flex: 1,

    fontSize: 16,
    fontWeight: "800",

    color: colors.text,

    textAlign: "center",
  },

  headerSpacer: {
    width: 34,
  },


  /* ================= CAMERA ================= */

  cameraFrame: {
    marginHorizontal: 16,

    borderRadius: 20,

    overflow: "hidden",
  },

  cameraBadge: {
    position: "absolute",

    top: 12,
    left: 12,

    zIndex: 2,

    flexDirection: "row",
    alignItems: "center",

    gap: 5,

    backgroundColor: "rgba(0,0,0,0.5)",

    paddingHorizontal: 10,
    paddingVertical: 5,

    borderRadius: 999,
  },

  cameraBadgeText: {
    color: "#FFFFFF",

    fontSize: 10,
    fontWeight: "700",
  },

  cameraPlaceholder: {
    height: 420,

    backgroundColor: "#0A0F0F",
  },

  warnBanner: {
    position: "absolute",

    bottom: 12,

    alignSelf: "center",

    flexDirection: "row",
    alignItems: "center",

    gap: 6,

    backgroundColor: colors.primary,

    paddingHorizontal: 14,
    paddingVertical: 8,

    borderRadius: 999,
  },

  warnText: {
    color: "#FFFFFF",

    fontSize: 11,
    fontWeight: "700",

    textAlign: "center",
  },


  /* ================= REFERENCE ================= */

  referenceRow: {
    flexDirection: "row-reverse",

    alignItems: "center",

    gap: 10,

    marginHorizontal: 16,
    marginTop: 12,

    backgroundColor: colors.card,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: 14,

    padding: 8,
  },

  referenceThumb: {
    width: 52,
    height: 52,

    borderRadius: 10,
  },

  referenceContent: {
    flex: 1,

    alignItems: "flex-end",
  },

  referenceLabel: {
    fontSize: 10,

    color: colors.textSecondary,

    textAlign: "right",
  },

  referenceName: {
    fontSize: 12,

    fontWeight: "800",

    color: colors.text,

    textAlign: "right",

    marginTop: 2,
  },


  /* ================= BODY PARTS ================= */

  partsRow: {
    flexDirection: "row",

    justifyContent: "space-between",

    paddingHorizontal: 12,

    marginTop: 18,

    gap: 6,
  },

  /*
   * الـ Badge نفسه
   */

  partChip: {
    flex: 1,

    minWidth: 0,

    height: 58,

    flexDirection: "row-reverse",

    alignItems: "center",

    justifyContent: "center",

    gap: 7,

    borderWidth: 1.5,

    borderRadius: 16,

    paddingHorizontal: 7,

    overflow: "hidden",
  },

  /*
   * الحالة الصحيحة
   * أخضر فاتح مثل الصورة المرجعية
   */

  partChipSuccess: {
    borderColor: "#79D8AE",
    backgroundColor: "#FFFFFF",
  },

  /*
   * الحالة الخاطئة
   * أحمر فاتح مثل الصورة المرجعية
   */

  partChipError: {
    borderColor: "#F29A9A",
    backgroundColor: "#FFFFFF",
  },

  /*
   * علامة ✓ أو ×
   */

  statusIcon: {
    flexShrink: 0,
  },

  /*
   * النص تركوازي في الحالتين
   */

  partLabel: {
    flexShrink: 1,

    fontSize: 11,

    fontWeight: "800",

    color: colors.primary,

    textAlign: "center",

    includeFontPadding: false,
  },


  /* ================= START BUTTON ================= */

  startBtn: {
    marginHorizontal: 16,

    /*
     * المسافة اللي اتفقنا عليها
     */
    marginTop: 100,

    minHeight: 54,

    paddingVertical: 15,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.primary,

    borderRadius: 18,
  },

  startBtnDisabled: {
    backgroundColor: colors.textLight,
  },

  startBtnContent: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 7,
  },

  startBtnText: {
    color: "#FFFFFF",

    fontSize: 15,

    fontWeight: "800",

    textAlign: "center",
  },


  /* ================= HINT ================= */

  hint: {
    textAlign: "center",

    fontSize: 10,

    color: colors.textSecondary,

    marginTop: 10,

    paddingHorizontal: 16,

    marginBottom: 8,
  },

});