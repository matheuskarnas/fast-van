export const colors = {
  primary:    '#1A3C6E',
  action:     '#F4821F',
  success:    '#1D9E75',
  warning:    '#F59E0B',
  danger:     '#E24B4A',
  bg:         '#F5F6FA',
  surface:    '#FFFFFF',
  textPrimary:'#1A1A2E',
  textSecondary: '#6B7280',
  border:     '#E5E7EB',
  borderLight:'#F1F1F1',
} as const;

export const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32,
} as const;

export const radius = {
  sm: 8, md: 12, lg: 16, xl: 20, full: 999,
} as const;

export const font = {
  sm: 12, md: 14, base: 15, lg: 16, xl: 18, xxl: 20, xxxl: 24, huge: 28,
} as const;