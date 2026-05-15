import React from 'react';
import { TextInputProps } from "react-native";
import { Input as DSInput } from  "../design-system"

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
    return (
        <DSInput
            label={label}
            error={error}
            style={style}
            {...props}
        />
    );
}