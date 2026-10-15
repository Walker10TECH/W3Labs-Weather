import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  Easing,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WeatherConditionType } from '../../types/weather';
import { getAtmosphericTheme } from '../../services/weatherUtils';

interface Props {
  condition: WeatherConditionType;
  children: React.ReactNode;
}

// Fixed pseudo-random seed to generate stable positions
function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const AtmosphericBackground: React.FC<Props> = ({ condition, children }) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const theme = getAtmosphericTheme(condition);

  // 1. Sun Animations (Rotation & Breathing Glow)
  const sunRotateAnim = useRef(new Animated.Value(0)).current;
  const sunPulseAnim = useRef(new Animated.Value(1)).current;
  const flareFloatAnim = useRef(new Animated.Value(0)).current;

  // 2. Cloud Drift Animations (Parallax Layers)
  const cloud1Anim = useRef(new Animated.Value(0)).current;
  const cloud2Anim = useRef(new Animated.Value(0)).current;
  const cloud3Anim = useRef(new Animated.Value(0)).current;

  // 3. Lightning Flash Animation
  const lightningAnim = useRef(new Animated.Value(0)).current;

  // 4. Rain Animations (28 drops)
  const rainDrops = useRef(
    Array.from({ length: 28 }, (_, i) => ({
      anim: new Animated.Value(0),
      xPercent: (i * 3.6 + pseudoRandom(i * 7) * 2) % 100,
      duration: 750 + Math.floor(pseudoRandom(i * 13) * 500),
      delay: Math.floor(pseudoRandom(i * 19) * 1000),
      length: 22 + Math.floor(pseudoRandom(i * 23) * 20),
      opacity: 0.35 + pseudoRandom(i * 29) * 0.45,
    }))
  ).current;

  // 5. Snow Animations (22 flakes)
  const snowflakes = useRef(
    Array.from({ length: 22 }, (_, i) => ({
      yAnim: new Animated.Value(0),
      xAnim: new Animated.Value(0),
      xPercent: (i * 4.6 + pseudoRandom(i * 11) * 3) % 100,
      duration: 3500 + Math.floor(pseudoRandom(i * 17) * 2500),
      delay: Math.floor(pseudoRandom(i * 31) * 2000),
      size: 4 + Math.floor(pseudoRandom(i * 41) * 6),
      opacity: 0.5 + pseudoRandom(i * 43) * 0.45,
    }))
  ).current;

  // 6. Stars Animations (32 stars)
  const stars = useRef(
    Array.from({ length: 32 }, (_, i) => ({
      anim: new Animated.Value(0.2 + pseudoRandom(i * 7) * 0.5),
      top: pseudoRandom(i * 13) * (screenHeight * 0.7),
      left: pseudoRandom(i * 17) * screenWidth,
      size: pseudoRandom(i * 23) > 0.7 ? 3.5 : pseudoRandom(i * 29) > 0.4 ? 2.5 : 1.5,
      duration: 1600 + Math.floor(pseudoRandom(i * 37) * 1800),
    }))
  ).current;

  // Initialize Sun & Flare Loop
  useEffect(() => {
    // Rotation Loop (takes 40s per full rotation)
    const rotateLoop = Animated.loop(
      Animated.timing(sunRotateAnim, {
        toValue: 1,
        duration: 40000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Pulse Breathing Loop
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(sunPulseAnim, {
          toValue: 1.15,
          duration: 3500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(sunPulseAnim, {
          toValue: 1,
          duration: 3500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Flare Float Loop
    const flareLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(flareFloatAnim, {
          toValue: 1,
          duration: 5000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(flareFloatAnim, {
          toValue: 0,
          duration: 5000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    rotateLoop.start();
    pulseLoop.start();
    flareLoop.start();

    return () => {
      rotateLoop.stop();
      pulseLoop.stop();
      flareLoop.stop();
    };
  }, [sunRotateAnim, sunPulseAnim, flareFloatAnim]);

  // Initialize Clouds Drifting Loop
  useEffect(() => {
    const drift1 = Animated.loop(
      Animated.timing(cloud1Anim, {
        toValue: 1,
        duration: 45000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    const drift2 = Animated.loop(
      Animated.timing(cloud2Anim, {
        toValue: 1,
        duration: 65000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    const drift3 = Animated.loop(
      Animated.timing(cloud3Anim, {
        toValue: 1,
        duration: 85000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    drift1.start();
    drift2.start();
    drift3.start();

    return () => {
      drift1.stop();
      drift2.stop();
      drift3.stop();
    };
  }, [cloud1Anim, cloud2Anim, cloud3Anim]);

  // Rain falling loops
  useEffect(() => {
    if (condition === 'rain' || condition === 'heavy_rain' || condition === 'thunderstorm') {
      const activeAnims = rainDrops.map((drop) => {
        const loop = Animated.loop(
          Animated.sequence([
            Animated.delay(drop.delay),
            Animated.timing(drop.anim, {
              toValue: 1,
              duration: drop.duration,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(drop.anim, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        );
        loop.start();
        return loop;
      });

      return () => {
        activeAnims.forEach((a) => a.stop());
      };
    }
  }, [condition, rainDrops]);

  // Thunderstorm Lightning Flashes
  useEffect(() => {
    if (condition === 'thunderstorm') {
      let isMounted = true;

      const triggerLightning = () => {
        if (!isMounted) return;
        Animated.sequence([
          Animated.timing(lightningAnim, {
            toValue: 0.8,
            duration: 80,
            useNativeDriver: true,
          }),
          Animated.timing(lightningAnim, {
            toValue: 0.1,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(lightningAnim, {
            toValue: 0.95,
            duration: 90,
            useNativeDriver: true,
          }),
          Animated.timing(lightningAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (isMounted) {
            const nextTimeout = 3000 + Math.random() * 6000;
            timeoutId = setTimeout(triggerLightning, nextTimeout);
          }
        });
      };

      let timeoutId = setTimeout(triggerLightning, 2000);

      return () => {
        isMounted = false;
        clearTimeout(timeoutId);
        lightningAnim.setValue(0);
      };
    }
  }, [condition, lightningAnim]);

  // Snow falling and swaying loops
  useEffect(() => {
    if (condition === 'snow') {
      const activeAnims = snowflakes.map((flake) => {
        const fallLoop = Animated.loop(
          Animated.sequence([
            Animated.delay(flake.delay),
            Animated.timing(flake.yAnim, {
              toValue: 1,
              duration: flake.duration,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(flake.yAnim, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        );

        const swayLoop = Animated.loop(
          Animated.sequence([
            Animated.timing(flake.xAnim, {
              toValue: 1,
              duration: 1800,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(flake.xAnim, {
              toValue: -1,
              duration: 1800,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ])
        );

        fallLoop.start();
        swayLoop.start();
        return { fallLoop, swayLoop };
      });

      return () => {
        activeAnims.forEach((a) => {
          a.fallLoop.stop();
          a.swayLoop.stop();
        });
      };
    }
  }, [condition, snowflakes]);

  // Star twinkling loops
  useEffect(() => {
    if (condition === 'clear_night' || condition === 'partly_cloudy_night') {
      const activeStarLoops = stars.map((star) => {
        const loop = Animated.loop(
          Animated.sequence([
            Animated.timing(star.anim, {
              toValue: 1.0,
              duration: star.duration,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(star.anim, {
              toValue: 0.15,
              duration: star.duration,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        );
        loop.start();
        return loop;
      });

      return () => {
        activeStarLoops.forEach((l) => l.stop());
      };
    }
  }, [condition, stars]);

  const sunSpin = sunRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const flareTranslateX = flareFloatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-15, 20],
  });

  const flareTranslateY = flareFloatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [10, -25],
  });

  const cloud1TranslateX = cloud1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-screenWidth * 0.8, screenWidth * 1.2],
  });

  const cloud2TranslateX = cloud2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-screenWidth * 1.0, screenWidth * 1.1],
  });

  const cloud3TranslateX = cloud3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-screenWidth * 0.6, screenWidth * 1.3],
  });

  return (
    <View style={styles.container}>
      {/* 1. Atmospheric Sky Gradient */}
      <LinearGradient
        colors={theme.gradientColors}
        start={{ x: 0.1, y: 0.0 }}
        end={{ x: 0.8, y: 1.0 }}
        style={StyleSheet.absoluteFill}
      />

      {/* 2. Realistic Animated Sun Atmosphere (Clear Day & Sunset) */}
      {(theme.particleType === 'sun' || condition === 'clear_day' || condition === 'sunset') && (
        <View style={styles.sunContainer} pointerEvents="none">
          {/* Animated Ambient Light Halo */}
          <Animated.View
            style={[
              styles.sunOuterAura,
              {
                transform: [{ scale: sunPulseAnim }],
              },
            ]}
          />

          {/* Rotating Sun Rays Corona */}
          <Animated.View
            style={[
              styles.sunCorona,
              {
                transform: [{ rotate: sunSpin }],
              },
            ]}
          >
            <View style={[styles.sunRayBeam, { transform: [{ rotate: '0deg' }] }]} />
            <View style={[styles.sunRayBeam, { transform: [{ rotate: '30deg' }] }]} />
            <View style={[styles.sunRayBeam, { transform: [{ rotate: '60deg' }] }]} />
            <View style={[styles.sunRayBeam, { transform: [{ rotate: '90deg' }] }]} />
            <View style={[styles.sunRayBeam, { transform: [{ rotate: '120deg' }] }]} />
            <View style={[styles.sunRayBeam, { transform: [{ rotate: '150deg' }] }]} />
          </Animated.View>

          {/* Sun Core Orb */}
          <Animated.View
            style={[
              styles.sunCore,
              {
                transform: [{ scale: sunPulseAnim }],
              },
            ]}
          />

          {/* Floating Subtle Lens Flares */}
          <Animated.View
            style={[
              styles.lensFlare1,
              {
                transform: [
                  { translateX: flareTranslateX },
                  { translateY: flareTranslateY },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.lensFlare2,
              {
                transform: [
                  { translateX: flareTranslateX },
                  { translateY: Animated.multiply(flareTranslateY, -0.6) },
                ],
              },
            ]}
          />
        </View>
      )}

      {/* 3. Realistic Drifting Clouds (Clouds, Overcast, Partly Cloudy) */}
      {(theme.particleType === 'clouds' ||
        condition === 'cloudy' ||
        condition === 'partly_cloudy_day' ||
        condition === 'partly_cloudy_night') && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Cloud Layer 1 - Foreground Slow Drift */}
          <Animated.View
            style={[
              styles.cloudBase,
              styles.cloudLayer1,
              { transform: [{ translateX: cloud1TranslateX }] },
            ]}
          >
            <View style={[styles.cloudPuffItem, { width: 280, height: 110, borderRadius: 55 }]} />
            <View
              style={[
                styles.cloudPuffItem,
                { width: 180, height: 130, borderRadius: 90, top: -40, left: 60 },
              ]}
            />
          </Animated.View>

          {/* Cloud Layer 2 - Midground Softer Drift */}
          <Animated.View
            style={[
              styles.cloudBase,
              styles.cloudLayer2,
              { transform: [{ translateX: cloud2TranslateX }] },
            ]}
          >
            <View style={[styles.cloudPuffItem, { width: 340, height: 130, borderRadius: 65 }]} />
            <View
              style={[
                styles.cloudPuffItem,
                { width: 220, height: 150, borderRadius: 110, top: -50, left: 80 },
              ]}
            />
          </Animated.View>

          {/* Cloud Layer 3 - Background Subtle Drift */}
          <Animated.View
            style={[
              styles.cloudBase,
              styles.cloudLayer3,
              { transform: [{ translateX: cloud3TranslateX }] },
            ]}
          >
            <View style={[styles.cloudPuffItem, { width: 310, height: 100, borderRadius: 50 }]} />
          </Animated.View>
        </View>
      )}

      {/* 4. Realistic Twinkling Stars (Night Skies) */}
      {(condition === 'clear_night' || condition === 'partly_cloudy_night') && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {stars.map((star, idx) => (
            <Animated.View
              key={idx}
              style={[
                styles.twinkleStar,
                {
                  top: star.top,
                  left: star.left,
                  width: star.size,
                  height: star.size,
                  borderRadius: star.size / 2,
                  opacity: star.anim,
                },
              ]}
            />
          ))}

          {/* Moonlight Haze Aura */}
          <View style={styles.moonHaze} />
        </View>
      )}

      {/* 5. Realistic Animated Falling Rain */}
      {(condition === 'rain' || condition === 'heavy_rain' || condition === 'thunderstorm') && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {rainDrops.map((drop, idx) => {
            const dropY = drop.anim.interpolate({
              inputRange: [0, 1],
              outputRange: [-60, screenHeight + 60],
            });

            return (
              <Animated.View
                key={idx}
                style={[
                  styles.rainStreak,
                  {
                    left: `${drop.xPercent}%`,
                    height: drop.length,
                    opacity: drop.opacity,
                    transform: [{ translateY: dropY }, { rotate: '14deg' }],
                  },
                ]}
              />
            );
          })}
        </View>
      )}

      {/* 6. Thunderstorm Lightning Flash */}
      {condition === 'thunderstorm' && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            styles.lightningFlash,
            { opacity: lightningAnim },
          ]}
        />
      )}

      {/* 7. Realistic Animated Snowfall */}
      {condition === 'snow' && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {snowflakes.map((flake, idx) => {
            const flakeY = flake.yAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-40, screenHeight + 40],
            });
            const flakeX = flake.xAnim.interpolate({
              inputRange: [-1, 1],
              outputRange: [-18, 18],
            });

            return (
              <Animated.View
                key={idx}
                style={[
                  styles.snowFlake,
                  {
                    left: `${flake.xPercent}%`,
                    width: flake.size,
                    height: flake.size,
                    borderRadius: flake.size / 2,
                    opacity: flake.opacity,
                    transform: [{ translateY: flakeY }, { translateX: flakeX }],
                  },
                ]}
              />
            );
          })}
        </View>
      )}

      {/* 8. Main App Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1118',
  },
  content: {
    flex: 1,
  },
  // Sun Styles
  sunContainer: {
    position: 'absolute',
    top: 30,
    right: 25,
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunOuterAura: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255, 230, 130, 0.12)',
  },
  sunCorona: {
    position: 'absolute',
    width: 170,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunRayBeam: {
    position: 'absolute',
    width: 180,
    height: 2.5,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255, 240, 180, 0.22)',
  },
  sunCore: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 245, 195, 0.92)',
    shadowColor: '#FDE047',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.95,
    shadowRadius: 40,
    elevation: 25,
  },
  lensFlare1: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    top: 150,
    left: -40,
  },
  lensFlare2: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 220, 150, 0.3)',
    top: 190,
    left: -70,
  },

  // Clouds Styles
  cloudBase: {
    position: 'absolute',
  },
  cloudLayer1: {
    top: 50,
    opacity: 0.28,
  },
  cloudLayer2: {
    top: 140,
    opacity: 0.18,
  },
  cloudLayer3: {
    top: 260,
    opacity: 0.14,
  },
  cloudPuffItem: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },

  // Stars Styles
  twinkleStar: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
  },
  moonHaze: {
    position: 'absolute',
    top: 40,
    right: 40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(180, 210, 255, 0.08)',
  },

  // Rain Styles
  rainStreak: {
    position: 'absolute',
    width: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(210, 235, 255, 0.65)',
  },

  // Lightning Styles
  lightningFlash: {
    backgroundColor: 'rgba(240, 245, 255, 0.75)',
  },

  // Snow Styles
  snowFlake: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 3,
  },
});
