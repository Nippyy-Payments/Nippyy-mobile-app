import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export const CustomInput = ({
  label,
  value,
  onChangeText,
  secureTextEntry,
  error,
  keyboardType = 'default',
  autoCapitalize = 'none',
  placeholder
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.primaryText, fontFamily:'medium' }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: error ? '#FF3B30' : isFocused ? theme.colors.primary : theme.colors.border,
            color: theme.colors.primaryText,
            fontFamily:'medium',
            paddingRight: secureTextEntry ? 50 : 16, 
          },
        ]}
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        placeholderTextColor="grey"
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderWidth: 2,
    borderRadius: 8,
    paddingLeft: 16,
    fontSize: 14,
    backgroundColor: 'transparent',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    fontFamily:'medium'
  },
}); 