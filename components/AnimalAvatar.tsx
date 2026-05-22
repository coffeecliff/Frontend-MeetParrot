import React, { useMemo } from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '../constants/colors';

interface AnimalAvatarProps {
  source?: ImageSourcePropType;
  animal?: string;
  size?: number;
  style?: ViewStyle;
  isLogo?: boolean;
}

export function AnimalAvatar({ source, animal = 'MS', size = 104, style, isLogo = false }: AnimalAvatarProps) {
  const styles = useMemo(() => StyleSheet.create({
    avatar: {
      width: size,
      height: size,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    image: {
      width: isLogo ? '100%' : '78%',
      height: isLogo ? '100%' : '78%',
      borderRadius: 20,
    },
    initials: {
      color: colors.primaryDark,
      fontSize: Math.max(18, size * 0.28),
      fontWeight: '900',
    },
  }), [size, isLogo]);

  return (
    <View style={[styles.avatar, style]}>
      {source
        ? <Image source={source} style={styles.image} resizeMode="contain" />
        : <Text style={styles.initials}>{animal}</Text>
      }
    </View>
  );
}
