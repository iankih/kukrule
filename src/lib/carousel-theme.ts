import { theme } from './theme'

export const carouselThemes = {
  teal: {
    name: 'Teal (민트)',
    primary: theme.colors.primary.main, // #2D5F3F
    light: theme.colors.primary.light,  // #EEFBFB
    lighter: theme.colors.primary.lighter, // #F7FDFD
    gradient: `linear-gradient(135deg, ${theme.colors.primary.lighter} 0%, ${theme.colors.primary.light} 50%, ${theme.colors.primary.lighter} 100%)`,
    textColor: theme.colors.text.primary,
    subtitleColor: theme.colors.text.secondary
  },
  purple: {
    name: 'Purple (보라)',
    primary: '#8B5CF6',
    light: '#F3F0FF',
    lighter: '#FAF8FF',
    gradient: 'linear-gradient(135deg, #FAF8FF 0%, #F3F0FF 50%, #FAF8FF 100%)',
    textColor: theme.colors.text.primary,
    subtitleColor: theme.colors.text.secondary
  },
  orange: {
    name: 'Orange (오렌지)',
    primary: theme.colors.semantic.warning, // #FF9500
    light: '#FFF7ED',
    lighter: '#FFFBF5',
    gradient: 'linear-gradient(135deg, #FFFBF5 0%, #FFF7ED 50%, #FFFBF5 100%)',
    textColor: theme.colors.text.primary,
    subtitleColor: theme.colors.text.secondary
  },
  blue: {
    name: 'Blue (파랑)',
    primary: theme.colors.semantic.info, // #5352ED
    light: '#F0F0FF',
    lighter: '#F8F8FF',
    gradient: 'linear-gradient(135deg, #F8F8FF 0%, #F0F0FF 50%, #F8F8FF 100%)',
    textColor: theme.colors.text.primary,
    subtitleColor: theme.colors.text.secondary
  },
  green: {
    name: 'Green (초록)',
    primary: '#10B981',
    light: '#ECFDF5',
    lighter: '#F0FDF4',
    gradient: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 50%, #F0FDF4 100%)',
    textColor: theme.colors.text.primary,
    subtitleColor: theme.colors.text.secondary
  },
  pink: {
    name: 'Pink (핑크)',
    primary: '#EC4899',
    light: '#FDF2F8',
    lighter: '#FEF7F7',
    gradient: 'linear-gradient(135deg, #FEF7F7 0%, #FDF2F8 50%, #FEF7F7 100%)',
    textColor: theme.colors.text.primary,
    subtitleColor: theme.colors.text.secondary
  },
  gray: {
    name: 'Gray (회색)',
    primary: theme.colors.neutral.gray500,
    light: theme.colors.neutral.gray50,
    lighter: theme.colors.neutral.white,
    gradient: `linear-gradient(135deg, ${theme.colors.neutral.white} 0%, ${theme.colors.neutral.gray50} 50%, ${theme.colors.neutral.white} 100%)`,
    textColor: theme.colors.text.primary,
    subtitleColor: theme.colors.text.secondary
  }
} as const

export type CarouselThemeKey = keyof typeof carouselThemes

export function getCarouselTheme(color: string): typeof carouselThemes.teal {
  return carouselThemes[color as CarouselThemeKey] || carouselThemes.teal
}