import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import colors from "./Colors";

// شاشتا ما بين الجولات:
//   1) العدّاد ("استعد" 3،2،1) — دائرة تقدّم حقيقية تتحرك.
//   2) الاستراحة ("أنهيت الجولة") — ماسكوت + عدّاد 00:25 + كاروسيل نصائح.
// التدفق: عدّاد "المجموعة التالية" → الاستراحة "أنهيت الجولة" → عدّاد "الجولة التالية" → onFinish.
//
// ⬇️ لازم تكون صورة الماسكوت مرفوعة بمجلد assets المحلي بـSnack بهذا الاسم بالضبط:
//    mascot-celebrate.png
const MASCOT_CELEBRATE = require("./assets/mascot-celebrate.png");

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

/* ملاحظات الأداء — عدّاد ما قبل الاستراحة (المجموعة التالية) */
const FEEDBACK_BEFORE = {
  header: "المجموعة التالية تبدأ خلال",
  tone: "good", // "good" أخضر / "warn" ذهبي

};

/* ملاحظات الأداء — عدّاد ما بعد الاستراحة (الجولة التالية) */
const FEEDBACK_AFTER = {
  header: "الجولة التالية تبدأ خلال",
  tone: "good",
  text: "أداء رائع! حافظ على شدّ بطنك بالجولة القادمة.",
};

/* نصائح كاروسيل الاستراحة */
const REST_TIPS = [
  {
    icon: <Feather name="wind" size={26} color={colors.primary} />,
    title: "تنفّس بعمق",
    text: "شهيق 4 ثواني، زفير 4 ثواني.",
  },
  {
    icon: <Ionicons name="water" size={26} color={colors.primary} />,
    title: "اشرب ماء",
    text: "رشفة وحدة تكفي بين الجولات.",
  },
  {
    icon: <MaterialCommunityIcons name="run-fast" size={26} color={colors.primary} />,
    title: "استعد ذهنيًا",
    text: "تخيّل الحركة الصح قبل تنفيذها.",
  },
  {
    icon: <Ionicons name="fitness" size={26} color={colors.primary} />,
    title: "حافظ على وضعيتك",
    text: "ظهرك مستقيم، كتفك مرتخي.",
  },
];

export default function RoundBreak({ onFinish = () => {}, onBack, mode = "round" }) {
  // mode="set"   -> بعد إنهاء مجموعة عادية: عدّاد "المجموعة التالية" بس، ثم onFinish مباشرة.
  // mode="round" -> بعد إنهاء جولة كاملة: عدّاد → راحة/احتفال → عدّاد "الجولة التالية" → onFinish.
  const phases = mode === "set" ? ["countdownBefore"] : ["countdownBefore", "rest", "countdownAfter"];
  const [phaseIndex, setPhaseIndex] = useState(0);
  const phase = phases[phaseIndex];

  // الضغط يمين = التالي (زي ما يسويه العدّاد تلقائيًا لما يخلص)
  // الضغط يسار = السابق — ولو إحنا بأول شاشة، يرجع للي قبل RoundBreak بالكامل
  const goNext = () => {
    if (phaseIndex >= phases.length - 1) {
      onFinish();
    } else {
      setPhaseIndex((i) => i + 1);
    }
  };
  const goPrev = () => {
    if (phaseIndex <= 0) {
      onBack && onBack();
    } else {
      setPhaseIndex((i) => i - 1);
    }
  };

  let content;
  if (phase === "countdownBefore") {
    content = (
      <TapNavWrapper onPrev={goPrev} onNext={goNext}>
        <CountdownScreen seconds={3} header={FEEDBACK_BEFORE.header} feedback={FEEDBACK_BEFORE} onDone={goNext} />
      </TapNavWrapper>
    );
  } else if (phase === "rest") {
    content = (
      <RestTapNavWrapper onPrev={goPrev} onNext={goNext}>
        <RestScreen seconds={10} mascotUri={MASCOT_CELEBRATE} tips={REST_TIPS} onDone={goNext} />
      </RestTapNavWrapper>
    );
  } else {
    content = (
      <TapNavWrapper onPrev={goPrev} onNext={goNext}>
        <CountdownScreen seconds={3} header={FEEDBACK_AFTER.header} feedback={FEEDBACK_AFTER} onDone={goNext} />
      </TapNavWrapper>
    );
  }

  return content;
}

/* ============ طبقة ضغط شفافة: يمين = التالي، يسار = السابق ============ */
function TapNavWrapper({ children, onPrev, onNext }) {
  return (
    <View style={{ flex: 1 }}>
      {children}
      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onPrev} />
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onNext} />
        </View>
      </View>
    </View>
  );
}

/* ============ طبقة ضغط شفافة لشاشة الراحة ============ */
// نفس فكرة يمين=التالي ويسار=السابق، بس المساحة الشفافة تغطي بس الجزء
// العلوي (الماسكوت والعدّاد) وتوقف قبل ما توصل كاروسيل النصائح تحت —
// عشان السحب يمين/يسار على كاروسيل النصائح يضل يشتغل عادي بدون تعارض.
function RestTapNavWrapper({ children, onPrev, onNext }) {
  return (
    <View style={{ flex: 1 }}>
      {children}
      <View pointerEvents="box-none" style={[StyleSheet.absoluteFill, { height: SCREEN_H * 0.6 }]}>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onPrev} />
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onNext} />
        </View>
      </View>
    </View>
  );
}
/* ============ دائرة التقدّم (شغّالة) ============ */
function Ring({ size, stroke, progress, color, track = colors.border, dashed, children }) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, progress));
  const center = size / 2;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        {/* المسار (خلفية) */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={track}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={dashed ? "2 7" : undefined}
          strokeLinecap="round"
        />
        {/* القوس المتحرك */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={circ * (1 - clamped)}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      {children}
    </View>
  );
}

/* ============ شاشة العدّاد "استعد" ============ */
function CountdownScreen({ seconds, header, feedback, onDone }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) {
      onDone();
      return;
    }
    const id = setTimeout(() => {
      setRemaining((r) => Math.max(0, +(r - 0.05).toFixed(2)));
    }, 50);
    return () => clearTimeout(id);
  }, [remaining]);

  const toneColor = feedback.tone === "warn" ? colors.warning : colors.success;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.countWrap}>
        <Text style={styles.header}>{header}</Text>

        <Ring
          size={200}
          stroke={9}
          progress={remaining / seconds}
          color={colors.primary}
          dashed
        >
          <View style={styles.ringCenter}>
            <Text style={styles.bigNumber}>{Math.max(1, Math.ceil(remaining))}</Text>
            <Text style={styles.readyLabel}>استعد</Text>
          </View>
        </Ring>
      </View>

      {/* لا نعرض بطاقة الملاحظة إلا لو فيه نص فعلي — بين المجموعات العادية
          ما فيه ملاحظة أداء بعد (feedback.text فاضي)، فما نطلع بطاقة فاضية */}
      {feedback.text ? (
        <View style={styles.footerArea}>
          <View style={styles.feedbackCard}>
            <View style={[styles.feedbackIcon, { backgroundColor: `${toneColor}18` }]}>
              <Ionicons name="fitness" size={18} color={toneColor} />
            </View>
            <Text style={styles.feedbackText}>{feedback.text}</Text>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

/* ============ شاشة الاستراحة ============ */
function RestScreen({ seconds, mascotUri, tips, onDone }) {
  const [remaining, setRemaining] = useState(seconds);
  const [activeTip, setActiveTip] = useState(0);

  useEffect(() => {
    if (remaining <= 0) {
      onDone();
      return;
    }
    const id = setTimeout(() => {
      setRemaining((r) => Math.max(0, +(r - 0.05).toFixed(2)));
    }, 50);
    return () => clearTimeout(id);
  }, [remaining]);

  const mmss = () => {
    const s = Math.ceil(remaining);
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${m}:${sec}`;
  };

  const cardW = SCREEN_W - 40;
  const onScroll = (e) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / cardW);
    if (i !== activeTip) setActiveTip(i);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.restScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.restTitleRow}>
          <Text style={styles.restTitle}>أنهيت الجولة!</Text>
          <Text style={styles.restEmoji}>🎉</Text>
        </View>
        <Text style={styles.restSubtitle}>أحسنت، استمر على هذا الأداء!</Text>

        <View style={styles.mascotWrap}>
          <Ionicons name="sparkles" size={20} color={colors.accent} style={[styles.mStar, { top: 14, left: 48 }]} />
          <Ionicons name="sparkles" size={14} color={colors.accent} style={[styles.mStar, { top: 40, right: 52 }]} />
          <Ionicons name="sparkles" size={16} color={colors.accent} style={[styles.mStar, { bottom: 30, left: 64 }]} />
          <Ionicons name="sparkles" size={12} color={colors.accent} style={[styles.mStar, { bottom: 46, right: 62 }]} />
          <Image source={mascotUri} style={styles.mascotImg} resizeMode="contain" />
        </View>

        <Text style={styles.restLabel}>راحة قبل الجولة التالية</Text>

        <Ring size={130} stroke={7} progress={remaining / seconds} color={colors.primary} dashed>
          <Text style={styles.timerText}>{mmss()}</Text>
        </Ring>

        {/* تلميح السحب */}
        <View style={styles.swipeHint}>
          <Feather name="arrow-left" size={13} color={colors.textLight} />
          <Text style={styles.swipeHintText}>اسحب لليسار أو اليمين لعرض المزيد</Text>
          <Feather name="arrow-right" size={13} color={colors.textLight} />
        </View>

        {/* كاروسيل النصائح */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          style={{ width: cardW }}
        >
          {tips.map((tip, i) => (
            <View key={i} style={[styles.tipCard, { width: cardW }]}>
              <View style={styles.tipContent}>
                <View style={styles.tipTextCol}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipText}>{tip.text}</Text>
                </View>
                <View style={styles.tipIcon}>{tip.icon}</View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* النقاط */}
        <View style={styles.dots}>
          {tips.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeTip ? styles.dotActive : styles.dotInactive]} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },



  /* العدّاد */
  countWrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 },
  header: { fontSize: 18, fontWeight: "800", color: colors.primary, textAlign: "center", lineHeight: 28, marginBottom: 40 },
  ringCenter: { alignItems: "center", justifyContent: "center" },
  bigNumber: { fontSize: 72, fontWeight: "800", color: colors.text, lineHeight: 82 },
  readyLabel: { fontSize: 15, fontWeight: "700", color: colors.success, marginTop: -4 },

  footerArea: { paddingHorizontal: 20, paddingBottom: 24 },
  feedbackCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
  },
  feedbackIcon: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  feedbackText: { flex: 1, fontSize: 13, color: colors.text, textAlign: "right", lineHeight: 20 },

  /* الاستراحة */
  restScroll: { alignItems: "center", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28 },
  restTitleRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  restTitle: { fontSize: 27, fontWeight: "800", color: colors.primary },
  restEmoji: { fontSize: 24 },
  restSubtitle: { fontSize: 15, color: colors.textSecondary, textAlign: "center", marginTop: 8 },

  mascotWrap: { alignItems: "center", justifyContent: "center", marginVertical: 24, width: 240, height: 240 },
  mStar: { position: "absolute" },
  mascotImg: { width: 210, height: 210 },

  restLabel: { fontSize: 15, fontWeight: "700", color: colors.text, marginTop: 20, marginBottom: 18 },
  timerText: { fontSize: 30, fontWeight: "800", color: colors.text },

  swipeHint: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 24, marginBottom: 12 },
  swipeHintText: { fontSize: 11, color: colors.textLight, fontWeight: "600" },

  tipCard: { paddingHorizontal: 2 },
  tipContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
  },
  tipTextCol: { flex: 1 },
  tipTitle: { fontSize: 13, fontWeight: "800", color: colors.primary, textAlign: "right", marginBottom: 6 },
  tipText: { fontSize: 12, color: colors.textSecondary, textAlign: "right", lineHeight: 19 },
  tipIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: `${colors.primary}10`, alignItems: "center", justifyContent: "center" },

  dots: { flexDirection: "row", gap: 6, marginTop: 16 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  dotActive: { backgroundColor: colors.primary, width: 20 },
  dotInactive: { backgroundColor: colors.border },
});
