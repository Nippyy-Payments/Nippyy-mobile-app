import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '../../../contexts/ThemeContext';

export default function Reciept() {
      const { theme } = useTheme();
  return (
    <View style={{flex:1,backgroundColor:theme.colors.primary}}>
      <Text>Reciept</Text>
    </View>
  )
}

const styles = StyleSheet.create({})