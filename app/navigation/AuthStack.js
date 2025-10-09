import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Welcome from '../auth/screens/Welcome';
import { SignUp } from '../auth/screens/SignUp';
import { SignIn } from '../auth/screens/SignIn';
import { OTPVerificationScreen } from '../auth/screens/OTPVerificationScreen';
import { UserInfoScreen } from '../auth/screens/UserInfoScreen';
import SelectCountry from '../auth/screens/SelectCountry';
import DateOfBirth from '../auth/screens/DateOfBirth';

const Stack = createStackNavigator()

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="OTP" component={OTPVerificationScreen} />
      <Stack.Screen name="Info" component={UserInfoScreen} />
       <Stack.Screen name="Country" component={SelectCountry} />
       <Stack.Screen name="Dob" component={DateOfBirth} />
    </Stack.Navigator>
  );
};

export default AuthStack;
