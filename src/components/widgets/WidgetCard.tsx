import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fonts, FontSizes } from '../../theme/fonts';

interface WidgetCardProps {
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor?: string;
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  size?: 'half' | 'full' | 'third' | 'quarter' | 'auto';
  showChevron?: boolean;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({
  title,
  icon,
  iconColor = 'rgba(255, 255, 255, 0.7)',
  children,
  onPress,
  style,
  contentStyle,
  size = 'half',
  showChevron = true,
}) => {
  const { width } = useWindowDimensions();
  const CardContainer = onPress ? TouchableOpacity : View;

  const getSizeStyle = (): ViewStyle => {
    if (size === 'full') return styles.fullWidth;
    if (size === 'auto') return styles.autoWidth;

    // Responsive width calculation based on screen width
    if (width >= 1400) {
      // 4K and Ultra-wide
      if (size === 'quarter') return { width: '23.8%' };
      if (size === 'third') return { width: '31.8%' };
      return { width: '48.5%' };
    }
    if (width >= 1024) {
      // Desktop / Large Tablet
      if (size === 'third' || size === 'quarter') return { width: '31.8%' };
      return { width: '48.5%' };
    }
    if (width >= 600) {
      // Tablet / Mobile Landscape
      return { width: '48.5%' };
    }
    // Small to standard phones
    return styles.halfWidth;
  };

  return (
    <CardContainer
      activeOpacity={0.82}
      onPress={onPress}
      style={[styles.cardOuter, getSizeStyle(), style]}
    >
      <BlurView
        intensity={Platform.OS === 'ios' ? 40 : 25}
        tint="dark"
        style={styles.blurLayer}
      >
        <View style={styles.glassBackground}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.titleContainer}>
              <MaterialCommunityIcons
                name={icon}
                size={12}
                color={iconColor}
                style={styles.icon}
              />
              <Text style={styles.titleText}>{title.toUpperCase()}</Text>
            </View>
            {onPress && showChevron && (
              <MaterialCommunityIcons
                name="chevron-right"
                size={13}
                color="rgba(255, 255, 255, 0.4)"
              />
            )}
          </View>

          {/* Body */}
          <View style={[styles.content, contentStyle]}>{children}</View>
        </View>
      </BlurView>
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  cardOuter: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 5,
    marginBottom: 11,
  },
  halfWidth: {
    width: '48%',
  },
  fullWidth: {
    width: '100%',
  },
  autoWidth: {
    flex: 1,
  },
  blurLayer: {
    flex: 1,
  },
  glassBackground: {
    padding: 11,
    backgroundColor: 'rgba(20, 32, 55, 0.45)',
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  icon: {
    marginRight: 5,
  },
  titleText: {
    fontSize: FontSizes.widgetTitle,
    fontFamily: Fonts.bold,
    color: 'rgba(255, 255, 255, 0.65)',
    letterSpacing: 0.6,
  },
  content: {
    flex: 1,
  },
});
