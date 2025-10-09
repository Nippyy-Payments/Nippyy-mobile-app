import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppWrapper from './app/AppWrapper';
import { useFonts } from 'expo-font';

export default function App() {
  const [fontsLoaded] = useFonts({
    'bold': require('./assets/fonts/Bold.ttf'),
    'semi': require('./assets/fonts/Semi.ttf'),
    'medium': require('./assets/fonts/Medium.ttf'),
    'regular': require('./assets/fonts/Regular.ttf'),
    'light': require('./assets/fonts/Light.ttf'),
  });

  if (!fontsLoaded) {
    return <View style={styles.loadingContainer}><Text>Wait.....</Text></View>;
  }

  return <AppWrapper />
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
