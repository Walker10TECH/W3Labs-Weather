import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TemperatureUnit } from '../../types/weather';
import { Fonts, FontSizes } from '../../theme/fonts';

interface AppHeaderProps {
  unit: TemperatureUnit;
  isLoading: boolean;
  onOpenSearch: () => void;
  onToggleUnit: () => void;
  onRequestGps: () => void;
  onRefresh: () => void;
  onOpenLunar?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  unit,
  isLoading,
  onOpenSearch,
  onToggleUnit,
  onRequestGps,
  onRefresh,
  onOpenLunar,
}) => {
  return (
    <View style={styles.header}>
      {/* Left: City Search, GPS & Lunar Agriculture Screen */}
      <View style={styles.leftButtons}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onOpenSearch}
          style={styles.iconButton}
          accessibilityLabel="Buscar Cidades"
        >
          <MaterialCommunityIcons name="magnify" size={19} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onRequestGps}
          style={styles.iconButton}
          accessibilityLabel="Minha Localização GPS"
        >
          <MaterialCommunityIcons name="crosshairs-gps" size={17} color="#93C5FD" />
        </TouchableOpacity>

        {onOpenLunar && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onOpenLunar}
            style={[styles.iconButton, styles.lunarHeaderButton]}
            accessibilityLabel="Calendário Lunar & Agricultura Familiar"
          >
            <MaterialCommunityIcons name="sprout" size={18} color="#4ADE80" />
          </TouchableOpacity>
        )}
      </View>

      {/* Right Controls: Unit Toggle (°C / °F) + Refresh */}
      <View style={styles.rightButtons}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onToggleUnit}
          style={styles.unitButton}
          accessibilityLabel="Alternar Celsius e Fahrenheit"
        >
          <Text style={[styles.unitText, unit === 'C' && styles.unitActive]}>°C</Text>
          <Text style={styles.unitDivider}>|</Text>
          <Text style={[styles.unitText, unit === 'F' && styles.unitActive]}>°F</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onRefresh}
          style={styles.iconButton}
          accessibilityLabel="Atualizar Clima"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <MaterialCommunityIcons name="refresh" size={19} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 6,
    width: '100%',
  },
  leftButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 17,
    gap: 3,
  },
  unitText: {
    fontSize: FontSizes.headerUnit,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  unitActive: {
    color: '#FFFFFF',
    fontFamily: Fonts.bold,
  },
  unitDivider: {
    fontFamily: Fonts.light,
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 10,
  },
  lunarHeaderButton: {
    backgroundColor: 'rgba(74, 222, 128, 0.18)',
    borderColor: 'rgba(74, 222, 128, 0.4)',
  },
});
