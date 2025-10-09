import { useRef, useEffect } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';

export default function Celebrate() {
  const animation = useRef(null);


  return (
    <View style={styles.animationContainer}>
      <LottieView
        autoPlay
        ref={animation}
        style={{
          width: 300,
          height: 300,
          backgroundColor: null,
        }}
        source={require('../../../../assets/lottie/succ.json')}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  animationContainer: {
    alignItems: 'center',
    
  },
 
});
