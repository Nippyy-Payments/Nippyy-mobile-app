import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import History from '../main/screens/history/History';
import { useTheme } from '../contexts/ThemeContext';
import { Image, Platform, View } from 'react-native';
import Transfer from '../main/screens/Transfer/Transfer';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../main/screens/home/Home';
import Profile from '../main/screens/Profile/Profile';
import Success from '../main/screens/Transfer/Success';
import Tag from '../main/screens/Transfer/Tag';
import Reciept from '../main/screens/Transfer/Reciept';
import BankTransfer from '../main/screens/Transfer/BankTransfer';
import Addmoney from '../main/screens/home/Addmoney';
import SendMoney from '../main/screens/home/SendMoney';
import Wallets from '../main/screens/home/Wallets';
import Convert from '../main/screens/home/Convert';
import AccountDetails from '../main/screens/home/AccountDetails';
import TransactionPin from '../main/screens/Profile/TransactionPin';
import CreateTag from '../main/screens/Profile/CreateTag';
import BioLogin from '../main/screens/Profile/BioLogin';
import UserDetails from '../main/screens/Profile/UserDetails';
import Notifications from '../main/screens/home/Notifications';
import AuthGate from './AuthGate';
import EnterPin from '../auth/screens/EnterPin';
import CreatePin from '../auth/screens/CreatePin';
import KycSteps from '../main/screens/home/KycSteps';
import VerifyBvn from '../main/screens/home/verifications/VerifyBvn';
import VerifyPhone from '../main/screens/home/verifications/VerifyPhone';
import VerifyPhoneOtp from '../main/screens/home/verifications/VerifyPhoneOtp';
import TwoFactor from '../main/screens/Profile/TwoFactor';
import ProfileQR from '../main/screens/Profile/ProfileQR';
import TagDetails from '../main/screens/Transfer/TagDetails';


//navgation creators
const Stack = createStackNavigator()
const Tab = createBottomTabNavigator();

//App tab Navigation
const TabNavigation = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          paddingBottom: Platform.OS === 'ios' ? 24 : 16,
          paddingTop: 12,
          height: Platform.OS === 'ios' ? 100 : 125,
          elevation: 0,
          shadowOpacity: 0,
          paddingHorizontal: 16,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.secondaryText,
        tabBarLabelStyle: {
          fontFamily: 'semi',
          fontSize: 12,
          marginTop: 6,
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
        tabBarIconStyle: {
          marginTop: 6,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={Home}
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                resizeMode='contain'
                style={{ width: 20, height: 20, tintColor: focused ? theme.colors.primary : 'grey' }}
                source={require('../../assets/icons/nippyy-home.png')}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Send"
        component={Transfer}
        options={{
          title: 'Send',
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                resizeMode='contain'
                style={{ width: 20, height: 20, tintColor: focused ? theme.colors.primary : 'grey' }}
                source={require('../../assets/icons/nippyy-send.png')}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={History}
        options={{
          title: 'History',
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                resizeMode='contain'
                style={{ width: 20, height: 20, tintColor: focused ? theme.colors.primary : 'grey' }}
                source={require('../../assets/icons/nippyy-history.png')}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={Profile}
        options={{
          title: 'Menu',
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                resizeMode='contain'
                style={{ width: 20, height: 20, tintColor: focused ? theme.colors.primary : 'grey' }}
                source={require('../../assets/icons/nippyy-menu.png')}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  )
}



//main stack
const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AuthGate" component={AuthGate} />
      <Stack.Screen name="EnterPin" component={EnterPin} />
      <Stack.Screen name="KycSteps" component={KycSteps} />
      <Stack.Screen name="CreatePin" component={CreatePin} />
      <Stack.Screen name="Base" component={TabNavigation} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Addmoney" component={Addmoney} />
      <Stack.Screen name="Sendmoney" component={SendMoney} />
      <Stack.Screen name="Wallets" component={Wallets} />
      <Stack.Screen name="Convert" component={Convert} />
      <Stack.Screen name="AccountDetails" component={AccountDetails} />
      <Stack.Screen name="Bank" component={BankTransfer} />
      <Stack.Screen name="Success" component={Success} />
      <Stack.Screen name="Tag" component={Tag} />
      <Stack.Screen name="Reciept" component={Reciept} />
      <Stack.Screen name="CreateTag" component={CreateTag} />
      <Stack.Screen name="BioLogin" component={BioLogin} />
      <Stack.Screen name="UserDetails" component={UserDetails} />
      <Stack.Screen name="TransactionPin" component={TransactionPin} />
      <Stack.Screen name="ProfileQR" component={ProfileQR} />
      <Stack.Screen name="TwoFactor" component={TwoFactor} />
      <Stack.Screen name="TagDetails" component={TagDetails} />


      {/*Verification routes*/}
       <Stack.Screen name="VerifyPhone" component={VerifyPhone} />
       <Stack.Screen name="VerifyPhoneOtp" component={VerifyPhoneOtp} />
       <Stack.Screen name="VerifyBvn" component={VerifyBvn} />
       
    </Stack.Navigator>
  );
};

export default MainStack;
