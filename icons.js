import React from "react";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

// طبقة توافق: نفس أسماء lucide اللي كان يستخدمها المشروع، بس مرسومة
// بأيقونات @expo/vector-icons (مضمونة تشتغل بالسنارك بدون مشاكل تثبيت).
// strokeWidth ما تدعمه هالمكتبة فنتجاهله بس.
const wrap = (Family, name) => ({ strokeWidth, ...props }) => (
  <Family name={name} {...props} />
);

export const Dumbbell = wrap(MaterialCommunityIcons, "dumbbell");
export const UtensilsCrossed = wrap(MaterialCommunityIcons, "silverware-fork-knife");
export const Plus = wrap(Feather, "plus");
export const Sparkles = wrap(Ionicons, "sparkles-outline");
export const Home = wrap(Feather, "home");
export const ChevronDown = wrap(Feather, "chevron-down");
export const ChevronUp = wrap(Feather, "chevron-up");
export const Camera = wrap(Feather, "camera");
export const Hand = wrap(Ionicons, "hand-left-outline");
export const ClipboardList = wrap(MaterialCommunityIcons, "clipboard-list-outline");
export const EyeOff = wrap(Feather, "eye-off");
export const ShieldCheck = wrap(MaterialCommunityIcons, "shield-check-outline");
export const Smartphone = wrap(Feather, "smartphone");
export const Target = wrap(Feather, "target");
export const BarChart3 = wrap(Feather, "bar-chart-2");
export const Lightbulb = wrap(MaterialCommunityIcons, "lightbulb-outline");
export const TrendingUp = wrap(Feather, "trending-up");
export const Search = wrap(Feather, "search");
export const SlidersHorizontal = wrap(Feather, "sliders");
export const Grid2x2 = wrap(Feather, "grid");
export const Shirt = wrap(MaterialCommunityIcons, "tshirt-crew-outline");
export const Backpack = wrap(MaterialCommunityIcons, "bag-personal-outline");
export const CircleDot = wrap(Feather, "disc");
export const Footprints = wrap(MaterialCommunityIcons, "shoe-print");

// أضفناهم عشان بقية الشاشات (ActiveWorkout, PoseCheck, ShareSummary...)
export const ArrowLeft = wrap(Feather, "arrow-left");
export const Settings = wrap(Feather, "settings");
export const Clock = wrap(Feather, "clock");
export const Repeat = wrap(Feather, "repeat");
export const RefreshCcw = wrap(Feather, "refresh-ccw");
export const Pause = wrap(Feather, "pause");
export const X = wrap(Feather, "x");
export const RotateCw = wrap(Feather, "rotate-cw");
export const Flame = wrap(Ionicons, "flame-outline");
export const Star = wrap(Feather, "star");
export const Share = wrap(Feather, "share-2");
export const Download = wrap(Feather, "download");
export const Copy = wrap(Feather, "copy");
export const AlertCircle = wrap(Feather, "alert-circle");
export const CheckCircle2 = wrap(Feather, "check-circle");
export const XCircle = wrap(Feather, "x-circle");

// أيقونات أجزاء الجسم (شاشة التحقق من الوضعية PoseCheck)
export const Legs = wrap(MaterialCommunityIcons, "run");
export const Arms = wrap(MaterialCommunityIcons, "arm-flex-outline");
export const Torso = wrap(MaterialCommunityIcons, "tshirt-crew-outline");
export const Head = wrap(MaterialCommunityIcons, "face-man-outline");
