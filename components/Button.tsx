import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { colors } from '../constants/colors';
 
interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    disabled?: boolean;
    style?: ViewStyle;
}
 
export function Button({ title, onPress, variant = 'primary', disabled = false, style }: ButtonProps) {
    return(
        <TouchableOpacity
        style={[
            styles.base,
            styles[variant],
            disabled && styles.disabled,
            style,
        ]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
        >
            <Text style={[styles.text, styles[`${variant}Text`]]}>
                {title}
            </Text>
        </TouchableOpacity>    
    );
}
 
const styles = StyleSheet.create({
    base: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        minHeight: 48,
    },
    primary: {
        backgroundColor: colors.primary,
    },
    secondary: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
    primaryText: {
        color: '#ffffff'
    },
    secondaryText: {
        color: colors.text,
    },
    outlineText: {
        color: colors.primary,
    },
 
});
 