import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const Layout = {
  window: { width, height },
  padding: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  iconSize: {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  },
  albumCardWidth: (width - 48) / 2,
  miniPlayerHeight: 56,
  tabBarHeight: 60,
} as const;

export default Layout;
