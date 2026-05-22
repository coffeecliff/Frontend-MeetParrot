import React from 'react';
import { TextInput, TextInputProps, StyleSheet, View, Text } from 'react-native';
import { colors } from '../constants/colors';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
    return (
        <View>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[styles.input, style]}
                placeholderTextColor={props.placeholderTextColor ?? '#999'}
                {...props}
            />
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    input: {
        fontSize: 16,
        color: colors.textPrimary,
        paddingVertical: 10,
        paddingHorizontal: 14,
    },
    error: {
        fontSize: 12,
        color: colors.error,
        marginTop: 4,
    },
});
