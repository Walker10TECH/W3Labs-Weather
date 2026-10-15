import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CityLocation } from '../../types/weather';
import { searchCities } from '../../services/weatherApi';

interface CitySearchModalProps {
  visible: boolean;
  savedCities: CityLocation[];
  currentCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
  onRequestGps: () => void;
  onClose: () => void;
}

export const CitySearchModal: React.FC<CitySearchModalProps> = ({
  visible,
  savedCities,
  currentCity,
  onSelectCity,
  onRequestGps,
  onClose,
}) => {
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CityLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const isWide = width >= 768;

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const res = await searchCities(query);
      setResults(res);
      setIsSearching(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (city: CityLocation) => {
    onSelectCity(city);
    setQuery('');
    setResults([]);
    onClose();
  };

  const handleGps = () => {
    onRequestGps();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        {Platform.OS === 'ios' ? (
          <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10, 18, 29, 0.95)' }]} />
        )}

        <View style={[styles.content, isWide && styles.contentWide]}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <Text style={styles.modalTitle}>Cidades e Locais</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialCommunityIcons name="close" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Search Box */}
          <View style={styles.searchBar}>
            <MaterialCommunityIcons name="magnify" size={20} color="rgba(255, 255, 255, 0.6)" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar cidade mundial ou brasileira..."
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
            {isSearching && <ActivityIndicator size="small" color="#93C5FD" />}
          </View>

          {/* GPS Quick Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleGps}
            style={styles.gpsButton}
          >
            <View style={styles.gpsIconCircle}>
              <MaterialCommunityIcons name="crosshairs-gps" size={18} color="#60A5FA" />
            </View>
            <View style={styles.gpsTextContainer}>
              <Text style={styles.gpsTitle}>Usar Localização Atual (GPS)</Text>
              <Text style={styles.gpsSub}>Previsão exata baseada nas coordenadas do dispositivo</Text>
            </View>
          </TouchableOpacity>

          {/* List: Either Search Results or Saved Cities */}
          <Text style={styles.sectionHeader}>
            {query.length >= 2 ? 'Resultados da Busca' : 'Cidades Sugeridas e Salvas'}
          </Text>

          <FlatList
            data={query.length >= 2 ? results : savedCities}
            keyExtractor={(item) => `${item.id}-${item.latitude}-${item.longitude}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                {query.length >= 2 && !isSearching ? (
                  <Text style={styles.emptyText}>Nenhuma cidade encontrada para "{query}".</Text>
                ) : null}
              </View>
            )}
            renderItem={({ item }) => {
              const isSelected = item.name === currentCity.name;

              return (
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => handleSelect(item)}
                  style={[styles.cityItem, isSelected && styles.cityItemSelected]}
                >
                  <View style={styles.cityInfo}>
                    <Text style={styles.cityNameText}>{item.name}</Text>
                    <Text style={styles.cityRegionText}>
                      {item.region ? `${item.region}, ${item.country}` : item.country}
                    </Text>
                  </View>

                  <View style={styles.rightIcons}>
                    {isSelected && (
                      <View style={styles.selectedBadge}>
                        <MaterialCommunityIcons name="check" size={14} color="#10B981" />
                        <Text style={styles.selectedBadgeText}>Atual</Text>
                      </View>
                    )}
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={20}
                      color="rgba(255, 255, 255, 0.4)"
                    />
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(10, 15, 25, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
  },
  contentWide: {
    maxWidth: 640,
    maxHeight: '85%',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
  },
  gpsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.35)',
    borderRadius: 16,
    padding: 12,
    marginTop: 14,
  },
  gpsIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  gpsTextContainer: {
    flex: 1,
  },
  gpsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#93C5FD',
  },
  gpsSub: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 1,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 10,
  },
  listContent: {
    paddingBottom: 40,
    gap: 8,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  cityItemSelected: {
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
    borderColor: 'rgba(96, 165, 250, 0.5)',
  },
  cityInfo: {
    flex: 1,
  },
  cityNameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cityRegionText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: 2,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
  },
  selectedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34D399',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
  },
});
