import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WidgetCard } from './WidgetCard';
import { Fonts, FontSizes } from '../../theme/fonts';
import { getAgriculturalPhaseKey, LUNAR_PHASES_DATA } from '../../services/lunarAgricultureData';

interface MoonPhaseWidgetProps {
  moonPhaseName: string;
  illumination: number;
  onPress?: () => void;
}

export const MoonPhaseWidget: React.FC<MoonPhaseWidgetProps> = ({
  moonPhaseName,
  illumination,
  onPress,
}) => {
  const agriPhaseKey = getAgriculturalPhaseKey(moonPhaseName);
  const agriInfo = LUNAR_PHASES_DATA[agriPhaseKey];

  return (
    <WidgetCard
      title="Fase da Lua & Plantio"
      icon="moon-waning-crescent"
      iconColor="#E0E7FF"
      onPress={onPress}
    >
      <View style={styles.body}>
        <View style={styles.moonRow}>
          <View style={styles.leftCol}>
            <Text style={styles.phaseName}>{moonPhaseName}</Text>
            <Text style={styles.illumText}>Iluminação: {illumination}%</Text>
          </View>
          <View style={styles.moonIconWrapper}>
            <MaterialCommunityIcons
              name={agriInfo.icon as any}
              size={24}
              color={agriInfo.accentColor}
            />
          </View>
        </View>

        {/* Agricultural planting advice badge */}
        <View style={styles.agriBadge}>
          <MaterialCommunityIcons name="sprout" size={12} color="#4ADE80" />
          <Text style={styles.agriBadgeText} numberOfLines={1}>
            {agriInfo.statusBadge}
          </Text>
        </View>

        <Text style={styles.subText} numberOfLines={2}>
          {agriInfo.farmerWisdom}
        </Text>
      </View>
    </WidgetCard>
  );
};

const styles = StyleSheet.create({
  body: {
    justifyContent: 'space-between',
    flex: 1,
  },
  moonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftCol: {
    flex: 1,
    paddingRight: 6,
  },
  phaseName: {
    fontSize: FontSizes.bodySmall,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
  illumText: {
    fontSize: FontSizes.bodyXs,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
  moonIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  agriBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 4,
  },
  agriBadgeText: {
    fontSize: 8.5,
    fontFamily: Fonts.bold,
    color: '#4ADE80',
    letterSpacing: 0.3,
  },
  subText: {
    fontSize: FontSizes.bodyXs,
    fontFamily: Fonts.light,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 12,
    marginTop: 4,
  },
});

