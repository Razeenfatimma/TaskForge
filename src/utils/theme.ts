import { ProjectColor, TaskPriority, TaskStatus } from '../types';

export interface ColorScheme {
  id: ProjectColor;
  label: string;
  primary: string; // e.g. #8B5CF6
  primaryDark: string; // #6D28D9 for high contrast text
  bgLight: string; // pastel background wash
  bgMedium: string; // slightly deeper pastel
  border: string; // border tint
  textOnLight: string; // dark text on light background
  gradient: string; // banner gradient
  glassGradient: string; // liquid glass gradient with translucent tint + white sheen
  glassBg: string; // translucent tinted glass background
  glassBorder: string; // translucent white/tinted border
  shadow: string; // soft colored shadow
  badgeBg: string;
  badgeText: string;
  btnBg: string;
  btnHover: string;
  btnText: string;
}

export const PROJECT_COLORS: Record<ProjectColor, ColorScheme> = {
  purple: {
    id: 'purple',
    label: 'Lavender Purple',
    primary: '#8B5CF6',
    primaryDark: '#6D28D9',
    bgLight: 'rgba(245, 243, 255, 0.55)',
    bgMedium: 'rgba(237, 233, 254, 0.7)',
    border: 'rgba(221, 214, 254, 0.75)',
    textOnLight: '#4C1D95',
    gradient: 'linear-gradient(135deg, rgba(237, 233, 254, 0.65) 0%, rgba(221, 214, 254, 0.45) 50%, rgba(196, 181, 253, 0.35) 100%)',
    glassGradient: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(237, 233, 254, 0.45) 50%, rgba(221, 214, 254, 0.3) 100%)',
    glassBg: 'rgba(245, 243, 255, 0.45)',
    glassBorder: 'rgba(255, 255, 255, 0.8)',
    shadow: 'rgba(139, 92, 246, 0.16)',
    badgeBg: 'rgba(237, 233, 254, 0.75)',
    badgeText: '#5B21B6',
    btnBg: '#8B5CF6',
    btnHover: '#7C3AED',
    btnText: '#FFFFFF',
  },
  blue: {
    id: 'blue',
    label: 'Sky Blue',
    primary: '#0EA5E9',
    primaryDark: '#0369A1',
    bgLight: 'rgba(240, 249, 255, 0.55)',
    bgMedium: 'rgba(224, 242, 254, 0.7)',
    border: 'rgba(186, 230, 253, 0.75)',
    textOnLight: '#075985',
    gradient: 'linear-gradient(135deg, rgba(224, 242, 254, 0.65) 0%, rgba(186, 230, 253, 0.45) 50%, rgba(125, 211, 252, 0.35) 100%)',
    glassGradient: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(224, 242, 254, 0.45) 50%, rgba(186, 230, 253, 0.3) 100%)',
    glassBg: 'rgba(240, 249, 255, 0.45)',
    glassBorder: 'rgba(255, 255, 255, 0.8)',
    shadow: 'rgba(14, 165, 233, 0.16)',
    badgeBg: 'rgba(224, 242, 254, 0.75)',
    badgeText: '#0369A1',
    btnBg: '#0284C7',
    btnHover: '#0369A1',
    btnText: '#FFFFFF',
  },
  green: {
    id: 'green',
    label: 'Mint Green',
    primary: '#10B981',
    primaryDark: '#047857',
    bgLight: 'rgba(236, 253, 245, 0.55)',
    bgMedium: 'rgba(209, 250, 229, 0.7)',
    border: 'rgba(167, 243, 208, 0.75)',
    textOnLight: '#065F46',
    gradient: 'linear-gradient(135deg, rgba(209, 250, 229, 0.65) 0%, rgba(167, 243, 208, 0.45) 50%, rgba(110, 231, 183, 0.35) 100%)',
    glassGradient: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(209, 250, 229, 0.45) 50%, rgba(167, 243, 208, 0.3) 100%)',
    glassBg: 'rgba(236, 253, 245, 0.45)',
    glassBorder: 'rgba(255, 255, 255, 0.8)',
    shadow: 'rgba(16, 185, 129, 0.16)',
    badgeBg: 'rgba(209, 250, 229, 0.75)',
    badgeText: '#065F46',
    btnBg: '#059669',
    btnHover: '#047857',
    btnText: '#FFFFFF',
  },
  coral: {
    id: 'coral',
    label: 'Coral Orange',
    primary: '#F97316',
    primaryDark: '#C2410C',
    bgLight: 'rgba(255, 247, 237, 0.55)',
    bgMedium: 'rgba(255, 237, 213, 0.7)',
    border: 'rgba(254, 215, 170, 0.75)',
    textOnLight: '#9A3412',
    gradient: 'linear-gradient(135deg, rgba(255, 237, 213, 0.65) 0%, rgba(254, 215, 170, 0.45) 50%, rgba(253, 186, 116, 0.35) 100%)',
    glassGradient: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 237, 213, 0.45) 50%, rgba(254, 215, 170, 0.3) 100%)',
    glassBg: 'rgba(255, 247, 237, 0.45)',
    glassBorder: 'rgba(255, 255, 255, 0.8)',
    shadow: 'rgba(249, 115, 22, 0.16)',
    badgeBg: 'rgba(255, 237, 213, 0.75)',
    badgeText: '#9A3412',
    btnBg: '#EA580C',
    btnHover: '#C2410C',
    btnText: '#FFFFFF',
  },
  pink: {
    id: 'pink',
    label: 'Soft Pink',
    primary: '#EC4899',
    primaryDark: '#BE185D',
    bgLight: 'rgba(253, 242, 248, 0.55)',
    bgMedium: 'rgba(252, 231, 243, 0.7)',
    border: 'rgba(251, 207, 232, 0.75)',
    textOnLight: '#9D174D',
    gradient: 'linear-gradient(135deg, rgba(252, 231, 243, 0.65) 0%, rgba(251, 207, 232, 0.45) 50%, rgba(244, 114, 182, 0.35) 100%)',
    glassGradient: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(252, 231, 243, 0.45) 50%, rgba(251, 207, 232, 0.3) 100%)',
    glassBg: 'rgba(253, 242, 248, 0.45)',
    glassBorder: 'rgba(255, 255, 255, 0.8)',
    shadow: 'rgba(236, 72, 153, 0.16)',
    badgeBg: 'rgba(252, 231, 243, 0.75)',
    badgeText: '#9D174D',
    btnBg: '#DB2777',
    btnHover: '#BE185D',
    btnText: '#FFFFFF',
  },
};

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; bg: string; text: string; border: string; dot: string }> = {
  urgent: {
    label: 'Urgent',
    bg: 'rgba(255, 228, 230, 0.65)',
    text: '#9F1239',
    border: 'rgba(254, 205, 211, 0.75)',
    dot: '#E11D48',
  },
  high: {
    label: 'High',
    bg: 'rgba(255, 237, 213, 0.65)',
    text: '#9A3412',
    border: 'rgba(254, 215, 170, 0.75)',
    dot: '#EA580C',
  },
  medium: {
    label: 'Medium',
    bg: 'rgba(254, 243, 199, 0.65)',
    text: '#92400E',
    border: 'rgba(253, 230, 138, 0.75)',
    dot: '#D97706',
  },
  low: {
    label: 'Low',
    bg: 'rgba(224, 242, 254, 0.65)',
    text: '#075985',
    border: 'rgba(186, 230, 253, 0.75)',
    dot: '#0284C7',
  },
};

// All 4 columns now have identical, equalized frosted glass softness (approx 40% opacity, translucent white border)
export const STATUS_CONFIG: Record<TaskStatus, { label: string; bg: string; text: string; border: string; columnBg: string; headerColor: string }> = {
  todo: {
    label: 'To Do',
    bg: 'rgba(237, 233, 254, 0.6)',
    text: '#4C1D95',
    border: 'rgba(221, 214, 254, 0.75)',
    columnBg: 'rgba(245, 243, 255, 0.42)',
    headerColor: '#6D28D9',
  },
  in_progress: {
    label: 'In Progress',
    bg: 'rgba(224, 242, 254, 0.6)',
    text: '#075985',
    border: 'rgba(186, 230, 253, 0.75)',
    columnBg: 'rgba(240, 249, 255, 0.42)',
    headerColor: '#0284C7',
  },
  review: {
    label: 'Review',
    bg: 'rgba(254, 243, 199, 0.6)',
    text: '#92400E',
    border: 'rgba(253, 230, 138, 0.75)',
    columnBg: 'rgba(254, 248, 232, 0.42)', // Softened to match all other columns perfectly!
    headerColor: '#D97706',
  },
  done: {
    label: 'Done',
    bg: 'rgba(209, 250, 229, 0.6)',
    text: '#065F46',
    border: 'rgba(167, 243, 208, 0.75)',
    columnBg: 'rgba(236, 253, 245, 0.42)',
    headerColor: '#059669',
  },
};

export function getProjectTheme(color: ProjectColor): ColorScheme {
  return PROJECT_COLORS[color] || PROJECT_COLORS.purple;
}
