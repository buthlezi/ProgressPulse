export type ThemeName = 'Indigo Pop' | 'Emerald Calm' | 'Warm Amber';

type Pallette = {
  headerBg: string;
  headerText: string;
  headerBottom: string;
  pageBg: string;
  primary: string;
  primaryDark: string;
  border: string;
  muted: string;
};

export const THEMES: Record<ThemeName, Pallette> = {
  'Indigo Pop': {
    headerBg: '#3730A3',
    headerText: '#FFFFFF',
    headerBottom: '#E6E6E6',
    pageBg: '#F8FAFC',
    primary: '#4F46E5',
    primaryDark: '#3B3A9C',
    border: '#E2E8F0',
    muted: '#64748B',
  },
  'Emerald Calm': {
    headerBg: '#065F46',
    headerText: '#FFFFFF',
    headerBottom: '#E6E6E6',
    pageBg: '#F0FDF4',
    primary: '#10B981',
    primaryDark: '#059669',
    border: '#D1FAE5',
    muted: '#64748B',
  },
  'Warm Amber': {
    headerBg: '#92400E',
    headerText: '#FFFFFF',
    headerBottom: '#E6E6E6',
    pageBg: '#FFFBEB',
    primary: '#F59E0B',
    primaryDark: '#D97706',
    border: '#FDE68A',
    muted: '#64748B',
  },
};
