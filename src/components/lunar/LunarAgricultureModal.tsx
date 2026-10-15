import React, { useState, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Fonts } from '../../theme/fonts';
import {
  LUNAR_PHASES_DATA,
  AGRICULTURAL_CROPS,
  calculateLunarSchedule,
  LunarPhaseKey,
  CropCategory,
} from '../../services/lunarAgricultureData';
import { CityLocation } from '../../types/weather';

interface LunarAgricultureModalProps {
  visible: boolean;
  onClose: () => void;
  location?: CityLocation;
  currentMoonPhaseName?: string;
  illumination?: number;
}

type TabType = 'guia' | 'culturas' | 'calendario';

export const LunarAgricultureModal: React.FC<LunarAgricultureModalProps> = ({
  visible,
  onClose,
  location,
  currentMoonPhaseName,
  illumination = 50,
}) => {
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  // Compute live lunar data
  const schedule = useMemo(() => calculateLunarSchedule(new Date()), []);
  const [selectedPhase, setSelectedPhase] = useState<LunarPhaseKey>(schedule.currentPhaseKey);
  const [activeTab, setActiveTab] = useState<TabType>('guia');

  // Search & filter state in the crops tab
  const [searchCrop, setSearchCrop] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CropCategory | 'Todas'>('Todas');

  const triggerHaptic = useCallback((style = Haptics.ImpactFeedbackStyle.Light) => {
    try {
      Haptics.impactAsync(style);
    } catch {
      // safe fallback
    }
  }, []);

  const handleSelectPhase = (phase: LunarPhaseKey) => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedPhase(phase);
  };

  const handleTabChange = (tab: TabType) => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
  };

  const phaseData = LUNAR_PHASES_DATA[selectedPhase];

  // Filter crops
  const filteredCrops = useMemo(() => {
    return AGRICULTURAL_CROPS.filter((crop) => {
      const matchesSearch =
        crop.name.toLowerCase().includes(searchCrop.toLowerCase()) ||
        crop.tip.toLowerCase().includes(searchCrop.toLowerCase()) ||
        crop.bestPhaseName.toLowerCase().includes(searchCrop.toLowerCase());

      const matchesCat = selectedCategory === 'Todas' || crop.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchCrop, selectedCategory]);

  const categoriesList: (CropCategory | 'Todas')[] = [
    'Todas',
    'Fruta',
    'Folhosa',
    'Legume/Grão',
    'Raiz/Tubérculo',
    'Erva/Aromática',
  ];

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalSheet, isWide && styles.modalSheetWide]}>
          {Platform.OS === 'ios' ? (
            <BlurView intensity={75} tint="dark" style={StyleSheet.absoluteFill} />
          ) : (
            <View style={[StyleSheet.absoluteFill, styles.androidBackdrop]} />
          )}

          {/* Top Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerBadge}>
                <MaterialCommunityIcons name="sprout" size={13} color="#4ADE80" />
                <Text style={styles.headerBadgeText}>PRODUTOR RURAL & AGRICULTURA FAMILIAR</Text>
              </View>
              <Text style={styles.headerTitle}>Calendário Lunar Agrícola</Text>
              {location && (
                <Text style={styles.headerLocation}>
                  Local: {location.name}, {location.region}
                </Text>
              )}
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityLabel="Fechar Calendário Lunar"
            >
              <MaterialCommunityIcons name="close" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Navigation Segments */}
          <View style={styles.tabNav}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleTabChange('guia')}
              style={[styles.tabBtn, activeTab === 'guia' && styles.tabBtnActive]}
            >
              <MaterialCommunityIcons
                name="moon-waning-crescent"
                size={16}
                color={activeTab === 'guia' ? '#FFFFFF' : 'rgba(255,255,255,0.6)'}
              />
              <Text style={[styles.tabBtnText, activeTab === 'guia' && styles.tabBtnTextActive]}>
                Guia das Fases
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleTabChange('culturas')}
              style={[styles.tabBtn, activeTab === 'culturas' && styles.tabBtnActive]}
            >
              <MaterialCommunityIcons
                name="carrot"
                size={16}
                color={activeTab === 'culturas' ? '#FFFFFF' : 'rgba(255,255,255,0.6)'}
              />
              <Text style={[styles.tabBtnText, activeTab === 'culturas' && styles.tabBtnTextActive]}>
                O que Plantar?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleTabChange('calendario')}
              style={[styles.tabBtn, activeTab === 'calendario' && styles.tabBtnActive]}
            >
              <MaterialCommunityIcons
                name="calendar-month"
                size={16}
                color={activeTab === 'calendario' ? '#FFFFFF' : 'rgba(255,255,255,0.6)'}
              />
              <Text style={[styles.tabBtnText, activeTab === 'calendario' && styles.tabBtnTextActive]}>
                Próximas Fases
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content Area */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* TAB 1: GUIA DAS FASES */}
            {activeTab === 'guia' && (
              <View style={styles.guiaContainer}>
                {/* Real-time Lunar Status Banner */}
                <View style={styles.liveStatusCard}>
                  <View style={styles.liveStatusLeft}>
                    <View style={styles.liveTagRow}>
                      <View style={styles.pulseDot} />
                      <Text style={styles.liveTagText}>FASE ASTRONÔMICA HOJE</Text>
                    </View>
                    <Text style={styles.livePhaseName}>
                      {currentMoonPhaseName || schedule.currentInfo.name}
                    </Text>
                    <Text style={styles.liveAdviceText}>
                      Iluminação: {illumination}% • {schedule.currentInfo.statusBadge}
                    </Text>
                  </View>

                  <View style={styles.liveStatusIconWrap}>
                    <MaterialCommunityIcons
                      name={schedule.currentInfo.icon as any}
                      size={38}
                      color="#FDE047"
                    />
                  </View>
                </View>

                {/* Phase Selectors Bar */}
                <Text style={styles.sectionHeading}>Toque na fase para ver as recomendações:</Text>
                <View style={styles.phaseSelectorRow}>
                  {(['nova', 'crescente', 'cheia', 'minguante'] as LunarPhaseKey[]).map((phaseKey) => {
                    const info = LUNAR_PHASES_DATA[phaseKey];
                    const isCurrent = schedule.currentPhaseKey === phaseKey;
                    const isSelected = selectedPhase === phaseKey;

                    return (
                      <TouchableOpacity
                        key={phaseKey}
                        activeOpacity={0.8}
                        onPress={() => handleSelectPhase(phaseKey)}
                        style={[
                          styles.phaseCardBtn,
                          isSelected && {
                            borderColor: info.accentColor,
                            backgroundColor: 'rgba(255, 255, 255, 0.12)',
                          },
                        ]}
                      >
                        {isCurrent && (
                          <View style={styles.currentBadge}>
                            <Text style={styles.currentBadgeText}>HOJE</Text>
                          </View>
                        )}
                        <MaterialCommunityIcons
                          name={info.icon as any}
                          size={24}
                          color={isSelected ? info.accentColor : '#FFFFFF'}
                        />
                        <Text
                          style={[
                            styles.phaseCardName,
                            isSelected && { color: info.accentColor, fontFamily: Fonts.bold },
                          ]}
                          numberOfLines={1}
                        >
                          {info.name.replace('Lua ', '')}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Selected Phase Detail Hero */}
                <View
                  style={[
                    styles.selectedPhaseHero,
                    { borderColor: phaseData.accentColor },
                  ]}
                >
                  <View style={styles.heroTopRow}>
                    <View style={styles.heroTitleGroup}>
                      <Text style={[styles.heroPhaseName, { color: phaseData.accentColor }]}>
                        {phaseData.name}
                      </Text>
                      <Text style={styles.heroTagline}>{phaseData.tagline}</Text>
                    </View>
                    <View style={[styles.heroBadge, { backgroundColor: phaseData.badgeBg }]}>
                      <Text style={[styles.heroBadgeText, { color: phaseData.accentColor }]}>
                        {phaseData.statusBadge}
                      </Text>
                    </View>
                  </View>

                  {/* Sap & Physiological Behavior */}
                  <View style={styles.sapBox}>
                    <View style={styles.sapHeader}>
                      <MaterialCommunityIcons name="water-percent" size={17} color="#60A5FA" />
                      <Text style={styles.sapTitle}>Movimento da Seiva & Gravidade</Text>
                    </View>
                    <Text style={styles.sapText}>{phaseData.sapBehavior}</Text>
                    <Text style={styles.sapSubText}>• {phaseData.gravityEffect}</Text>
                    <Text style={styles.sapSubText}>• {phaseData.lightEffect}</Text>
                  </View>

                  {/* When to Plant / When not to */}
                  <View style={styles.ruleBoxRow}>
                    <View style={[styles.ruleCard, styles.ruleCardFavorable]}>
                      <View style={styles.ruleCardHeader}>
                        <MaterialCommunityIcons name="check-circle" size={16} color="#4ADE80" />
                        <Text style={styles.ruleCardTitleFavorable}>Quando Plantar</Text>
                      </View>
                      <Text style={styles.ruleCardText}>{phaseData.whenToPlant}</Text>
                    </View>

                    <View style={[styles.ruleCard, styles.ruleCardWarning]}>
                      <View style={styles.ruleCardHeader}>
                        <MaterialCommunityIcons name="alert-circle" size={16} color="#F87171" />
                        <Text style={styles.ruleCardTitleWarning}>Quando Evitar</Text>
                      </View>
                      <Text style={styles.ruleCardText}>{phaseData.whenNotToPlant}</Text>
                    </View>
                  </View>
                </View>

                {/* WHAT TO PLANT (Detailed Categories) */}
                <View style={styles.contentSection}>
                  <View style={styles.sectionTitleRow}>
                    <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={20} color="#4ADE80" />
                    <Text style={styles.sectionTitle}>O que PLANTAR na {phaseData.name}:</Text>
                  </View>

                  {phaseData.whatToPlant.map((cat, idx) => (
                    <View key={idx} style={styles.plantCategoryCard}>
                      <View style={styles.categoryHeader}>
                        <MaterialCommunityIcons name={cat.icon as any} size={18} color="#4ADE80" />
                        <Text style={styles.categoryTitle}>{cat.categoryName}</Text>
                      </View>
                      <View style={styles.itemPillsRow}>
                        {cat.items.map((item, i) => (
                          <View key={i} style={styles.itemPill}>
                            <Text style={styles.itemPillText}>{item}</Text>
                          </View>
                        ))}
                      </View>
                      <Text style={styles.categoryWhy}>
                        <Text style={styles.boldWhy}>Por quê: </Text>
                        {cat.why}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* WHAT NOT TO PLANT */}
                <View style={styles.contentSection}>
                  <View style={styles.sectionTitleRow}>
                    <MaterialCommunityIcons name="close-circle-outline" size={20} color="#F87171" />
                    <Text style={[styles.sectionTitle, { color: '#F87171' }]}>
                      O que NÃO PLANTAR nesta fase:
                    </Text>
                  </View>

                  <View style={styles.plantAvoidCard}>
                    <View style={styles.itemPillsRow}>
                      {phaseData.whatNotToPlant.items.map((item, i) => (
                        <View key={i} style={styles.itemPillAvoid}>
                          <MaterialCommunityIcons name="close" size={12} color="#F87171" style={{ marginRight: 3 }} />
                          <Text style={styles.itemPillAvoidText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                    <Text style={styles.categoryWhyAvoid}>
                      <Text style={styles.boldWhyAvoid}>Motivo Agronômico: </Text>
                      {phaseData.whatNotToPlant.why}
                    </Text>
                  </View>
                </View>

                {/* PRACTICES & MANAGEMENT */}
                <View style={styles.contentSection}>
                  <View style={styles.sectionTitleRow}>
                    <MaterialCommunityIcons name="tractor" size={20} color="#FBBF24" />
                    <Text style={styles.sectionTitle}>Manejo & Práticas no Campo:</Text>
                  </View>

                  <View style={styles.practicesGrid}>
                    {phaseData.recommendedPractices.map((p, idx) => (
                      <View key={idx} style={styles.practiceCard}>
                        <View style={styles.practiceHeader}>
                          <View style={styles.practiceIconWrap}>
                            <MaterialCommunityIcons name={p.icon as any} size={18} color="#4ADE80" />
                          </View>
                          <Text style={styles.practiceTitle}>{p.title}</Text>
                        </View>
                        <Text style={styles.practiceDesc}>{p.desc}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* PRACTICES TO AVOID */}
                {phaseData.practicesToAvoid.length > 0 && (
                  <View style={styles.contentSection}>
                    <View style={styles.sectionTitleRow}>
                      <MaterialCommunityIcons name="alert-octagon" size={20} color="#FB7185" />
                      <Text style={[styles.sectionTitle, { color: '#FB7185' }]}>
                        Manejos Proibidos / Evitar Agora:
                      </Text>
                    </View>

                    <View style={styles.practicesGrid}>
                      {phaseData.practicesToAvoid.map((p, idx) => (
                        <View key={idx} style={styles.practiceCardAvoid}>
                          <View style={styles.practiceHeader}>
                            <View style={styles.practiceIconWrapAvoid}>
                              <MaterialCommunityIcons name={p.icon as any} size={18} color="#FB7185" />
                            </View>
                            <Text style={styles.practiceTitleAvoid}>{p.title}</Text>
                          </View>
                          <Text style={styles.practiceDesc}>{p.desc}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* FARMER WISDOM */}
                <View style={styles.wisdomCard}>
                  <MaterialCommunityIcons name="comment-quote-outline" size={24} color="#FBBF24" />
                  <View style={styles.wisdomBody}>
                    <Text style={styles.wisdomTitle}>Sabedoria do Agricultor Familiar</Text>
                    <Text style={styles.wisdomText}>&ldquo;{phaseData.farmerWisdom}&rdquo;</Text>
                  </View>
                </View>
              </View>
            )}

            {/* TAB 2: BUSCA DE CULTURAS (O QUE PLANTAR) */}
            {activeTab === 'culturas' && (
              <View style={styles.cropsContainer}>
                {/* Search Input */}
                <View style={styles.searchBar}>
                  <MaterialCommunityIcons name="magnify" size={20} color="rgba(255,255,255,0.6)" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar cultura (ex: tomate, cenoura, milho...)"
                    placeholderTextColor="rgba(255, 255, 255, 0.45)"
                    value={searchCrop}
                    onChangeText={setSearchCrop}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {searchCrop.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchCrop('')}>
                      <MaterialCommunityIcons name="close-circle" size={18} color="rgba(255,255,255,0.6)" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Category Pills Filter */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryFilterRow}
                >
                  {categoriesList.map((cat) => {
                    const isSel = selectedCategory === cat;
                    return (
                      <TouchableOpacity
                        key={cat}
                        activeOpacity={0.7}
                        onPress={() => {
                          triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                          setSelectedCategory(cat);
                        }}
                        style={[
                          styles.catPill,
                          isSel && styles.catPillActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.catPillText,
                            isSel && styles.catPillTextActive,
                          ]}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {/* Results Count */}
                <Text style={styles.cropsCount}>
                  Mostrando {filteredCrops.length} culturas agrícolas
                </Text>

                {/* Crops List */}
                <View style={styles.cropsGrid}>
                  {filteredCrops.map((crop) => (
                    <View key={crop.id} style={styles.cropCard}>
                      <View style={styles.cropTopRow}>
                        <View style={styles.cropNameGroup}>
                          <MaterialCommunityIcons name={crop.icon as any} size={22} color="#4ADE80" />
                          <Text style={styles.cropName}>{crop.name}</Text>
                        </View>
                        <View style={styles.cropCatBadge}>
                          <Text style={styles.cropCatText}>{crop.category}</Text>
                        </View>
                      </View>

                      {/* Best phase indicator */}
                      <View style={styles.cropPhaseIndicatorRow}>
                        <View style={styles.cropPhaseBadgeGood}>
                          <MaterialCommunityIcons name="check" size={14} color="#4ADE80" />
                          <Text style={styles.cropPhaseBadgeGoodText}>
                            Plantar: {crop.bestPhaseName}
                          </Text>
                        </View>

                        <View style={styles.cropPhaseBadgeBad}>
                          <MaterialCommunityIcons name="close" size={14} color="#F87171" />
                          <Text style={styles.cropPhaseBadgeBadText}>
                            Evitar: {crop.avoidPhaseName}
                          </Text>
                        </View>
                      </View>

                      {/* Harvest Phase */}
                      <View style={styles.cropHarvestRow}>
                        <MaterialCommunityIcons name="basket-outline" size={14} color="#FBBF24" />
                        <Text style={styles.cropHarvestText}>
                          Melhor Colheita: <Text style={styles.boldHarvest}>{crop.bestHarvestPhase}</Text>
                        </Text>
                      </View>

                      {/* Practical field tip */}
                      <View style={styles.cropTipBox}>
                        <Text style={styles.cropTipText}>
                          💡 <Text style={styles.cropTipLabel}>Dica de Campo: </Text>
                          {crop.tip}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* TAB 3: CALENDÁRIO DAS PRÓXIMAS FASES */}
            {activeTab === 'calendario' && (
              <View style={styles.calendarioContainer}>
                <View style={styles.calIntroCard}>
                  <MaterialCommunityIcons name="calendar-clock" size={24} color="#60A5FA" />
                  <View style={styles.calIntroTextWrap}>
                    <Text style={styles.calIntroTitle}>Previsão das Fases Lunares (Próximos 45 Dias)</Text>
                    <Text style={styles.calIntroDesc}>
                      Planeje antecipadamente suas compras de sementes, preparo de canteiros, adubação e datas de semeadura.
                    </Text>
                  </View>
                </View>

                {/* Timeline list */}
                <View style={styles.timelineList}>
                  {schedule.upcomingList.map((item, index) => {
                    const info = LUNAR_PHASES_DATA[item.phaseKey];
                    return (
                      <View key={index} style={styles.timelineItem}>
                        <View style={styles.timelineNodeCol}>
                          <View
                            style={[
                              styles.timelineDot,
                              { backgroundColor: info.accentColor },
                            ]}
                          >
                            <MaterialCommunityIcons
                              name={info.icon as any}
                              size={15}
                              color="#0A1118"
                            />
                          </View>
                          {index < schedule.upcomingList.length - 1 && (
                            <View style={styles.timelineLine} />
                          )}
                        </View>

                        <View style={styles.timelineCard}>
                          <View style={styles.timelineHeader}>
                            <View>
                              <Text style={[styles.timelinePhaseName, { color: info.accentColor }]}>
                                {item.phaseName}
                              </Text>
                              <Text style={styles.timelineDateText}>
                                {item.formattedDate} • {item.dayOfWeek}
                              </Text>
                            </View>
                            <View style={styles.daysBadge}>
                              <Text style={styles.daysBadgeText}>
                                Em {item.daysRemaining} {item.daysRemaining === 1 ? 'dia' : 'dias'}
                              </Text>
                            </View>
                          </View>

                          <Text style={styles.timelineTagline}>{info.tagline}</Text>

                          <View style={styles.timelineQuickTip}>
                            <MaterialCommunityIcons name="sprout" size={13} color="#4ADE80" />
                            <Text style={styles.timelineQuickTipText}>
                              {info.statusBadge}: {info.whenToPlant}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 10, 18, 0.75)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#0A121D',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '92%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    zIndex: 20,
    elevation: 24,
  },
  modalSheetWide: {
    maxWidth: 820,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 24,
    height: '88%',
    marginBottom: 20,
  },
  androidBackdrop: {
    backgroundColor: '#0A121D',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerLeft: {
    flex: 1,
    paddingRight: 10,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 222, 128, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 5,
  },
  headerBadgeText: {
    fontSize: 9,
    fontFamily: Fonts.bold,
    color: '#4ADE80',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  headerLocation: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabNav: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    gap: 6,
  },
  tabBtnActive: {
    backgroundColor: 'rgba(74, 222, 128, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.4)',
  },
  tabBtnText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.65)',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
    fontFamily: Fonts.bold,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
  },
  // Tab 1: Guia das Fases
  guiaContainer: {
    gap: 14,
  },
  liveStatusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  liveStatusLeft: {
    flex: 1,
    paddingRight: 10,
  },
  liveTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
  },
  liveTagText: {
    fontSize: 9,
    fontFamily: Fonts.bold,
    color: '#4ADE80',
    letterSpacing: 0.5,
  },
  livePhaseName: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
  liveAdviceText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
  liveStatusIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(253, 224, 71, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeading: {
    fontSize: 11,
    fontFamily: Fonts.bold,
    color: 'rgba(255, 255, 255, 0.65)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  phaseSelectorRow: {
    flexDirection: 'row',
    gap: 8,
  },
  phaseCardBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  currentBadge: {
    position: 'absolute',
    top: -6,
    backgroundColor: '#4ADE80',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  currentBadgeText: {
    fontSize: 8,
    fontFamily: Fonts.bold,
    color: '#0A1118',
  },
  phaseCardName: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 6,
    textAlign: 'center',
  },
  selectedPhaseHero: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  heroTitleGroup: {
    flex: 1,
    paddingRight: 8,
  },
  heroPhaseName: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    letterSpacing: -0.5,
  },
  heroTagline: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 3,
  },
  heroBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  heroBadgeText: {
    fontSize: 10,
    fontFamily: Fonts.bold,
  },
  sapBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    marginBottom: 12,
  },
  sapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  sapTitle: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: '#93C5FD',
  },
  sapText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
    lineHeight: 18,
    marginBottom: 6,
  },
  sapSubText: {
    fontSize: 11,
    fontFamily: Fonts.light,
    color: 'rgba(255, 255, 255, 0.75)',
    lineHeight: 16,
    marginTop: 2,
  },
  ruleBoxRow: {
    flexDirection: 'row',
    gap: 10,
  },
  ruleCard: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  ruleCardFavorable: {
    backgroundColor: 'rgba(74, 222, 128, 0.08)',
    borderColor: 'rgba(74, 222, 128, 0.25)',
  },
  ruleCardWarning: {
    backgroundColor: 'rgba(248, 113, 113, 0.08)',
    borderColor: 'rgba(248, 113, 113, 0.25)',
  },
  ruleCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 5,
  },
  ruleCardTitleFavorable: {
    fontSize: 11,
    fontFamily: Fonts.bold,
    color: '#4ADE80',
  },
  ruleCardTitleWarning: {
    fontSize: 11,
    fontFamily: Fonts.bold,
    color: '#F87171',
  },
  ruleCardText: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 15,
  },
  contentSection: {
    marginTop: 6,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
  plantCategoryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: '#4ADE80',
  },
  itemPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  itemPill: {
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.25)',
  },
  itemPillText: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
  },
  categoryWhy: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.75)',
    lineHeight: 16,
  },
  boldWhy: {
    fontFamily: Fonts.bold,
    color: '#4ADE80',
  },
  plantAvoidCard: {
    backgroundColor: 'rgba(248, 113, 113, 0.06)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.18)',
  },
  itemPillAvoid: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(248, 113, 113, 0.14)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.25)',
  },
  itemPillAvoidText: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
  },
  categoryWhyAvoid: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 16,
    marginTop: 4,
  },
  boldWhyAvoid: {
    fontFamily: Fonts.bold,
    color: '#F87171',
  },
  practicesGrid: {
    gap: 8,
  },
  practiceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 11,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  practiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  practiceIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  practiceTitle: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
  practiceDesc: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.75)',
    lineHeight: 16,
  },
  practiceCardAvoid: {
    backgroundColor: 'rgba(251, 113, 133, 0.06)',
    borderRadius: 12,
    padding: 11,
    borderWidth: 1,
    borderColor: 'rgba(251, 113, 133, 0.18)',
  },
  practiceIconWrapAvoid: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(251, 113, 133, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  practiceTitleAvoid: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: '#FB7185',
  },
  wisdomCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(251, 191, 36, 0.08)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.25)',
    gap: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  wisdomBody: {
    flex: 1,
  },
  wisdomTitle: {
    fontSize: 11,
    fontFamily: Fonts.bold,
    color: '#FBBF24',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  wisdomText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
    fontStyle: 'italic',
    lineHeight: 17,
  },

  // Tab 2: O que Plantar (Crops Search)
  cropsContainer: {
    gap: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
  },
  categoryFilterRow: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 2,
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  catPillActive: {
    backgroundColor: 'rgba(74, 222, 128, 0.2)',
    borderColor: '#4ADE80',
  },
  catPillText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.65)',
  },
  catPillTextActive: {
    color: '#FFFFFF',
    fontFamily: Fonts.bold,
  },
  cropsCount: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  cropsGrid: {
    gap: 10,
  },
  cropCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    padding: 13,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cropTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cropNameGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cropName: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
  cropCatBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  cropCatText: {
    fontSize: 9,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  cropPhaseIndicatorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  cropPhaseBadgeGood: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 222, 128, 0.14)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.25)',
  },
  cropPhaseBadgeGoodText: {
    fontSize: 10,
    fontFamily: Fonts.bold,
    color: '#4ADE80',
  },
  cropPhaseBadgeBad: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(248, 113, 113, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.22)',
  },
  cropPhaseBadgeBadText: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: '#F87171',
  },
  cropHarvestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  cropHarvestText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  boldHarvest: {
    fontFamily: Fonts.bold,
    color: '#FBBF24',
  },
  cropTipBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  cropTipText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 16,
  },
  cropTipLabel: {
    fontFamily: Fonts.bold,
    color: '#93C5FD',
  },

  // Tab 3: Próximas Fases (Timeline)
  calendarioContainer: {
    gap: 14,
  },
  calIntroCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(96, 165, 250, 0.08)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.2)',
    gap: 12,
    alignItems: 'center',
  },
  calIntroTextWrap: {
    flex: 1,
  },
  calIntroTitle: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: '#93C5FD',
    marginBottom: 3,
  },
  calIntroDesc: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.75)',
    lineHeight: 16,
  },
  timelineList: {
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  timelineNodeCol: {
    width: 32,
    alignItems: 'center',
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginVertical: 4,
  },
  timelineCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginLeft: 10,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  timelinePhaseName: {
    fontSize: 14,
    fontFamily: Fonts.bold,
  },
  timelineDateText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: 2,
  },
  daysBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  daysBadgeText: {
    fontSize: 9,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
  timelineTagline: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  timelineQuickTip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 222, 128, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 6,
  },
  timelineQuickTipText: {
    flex: 1,
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: '#4ADE80',
  },
});
