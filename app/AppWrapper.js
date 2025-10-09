import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './contexts/ThemeContext';
import AppNavigator from './navigation/AppNavigator';
import { ToastProvider } from './providers/toast/Toast';
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from './contexts/UserContext';
import { KycModalProvider } from './contexts/KycModal';

const AppWrapper = () => {
  return (

    <ThemeProvider>
      <UserProvider>
        <ToastProvider>
          <NavigationContainer>
            <KycModalProvider>
              <StatusBar animated style='auto' />
              <AppNavigator />
            </KycModalProvider>
          </NavigationContainer>
        </ToastProvider>
      </UserProvider>
    </ThemeProvider>

  );
};

export default AppWrapper;
