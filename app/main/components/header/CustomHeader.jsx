// CustomHeader.js
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function CustomHeader({ title, onBack }) {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBack) return onBack();
    if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handleBack} style={styles.pill}>
        <ArrowLeft size={23} strokeWidth={3} color="#333" />
      </Pressable>
      {title ? <Text style={styles.title}>{title}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff', 
  },
  pill: {
    // width: 45,
    // height: 45,
    // borderRadius: 100,
    // backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginLeft: 12,
    fontSize: 18,
    fontFamily:'semi'
  },
});
