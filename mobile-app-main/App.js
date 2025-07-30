/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import {
  PermissionsAndroid,
  StyleSheet,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {NavigationContainer} from '@react-navigation/native';
import MyStack from './src/Navigation/StackNavigation/StackNavigation';
import { getFirebaseToken, requestUserPermission } from './src/helpers';
import notifee from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
export function App() {

  const firebaseToken = async () => {
    try {
      let status = await notifee?.requestPermission();
    } catch (e) {
      console.log("error",e)
    }
  };
  useEffect(() => {
    requestUserPermission();
    firebaseToken()
  }, [])
  return (
    <GestureHandlerRootView style={styles.container}>
    <NavigationContainer>
      <MyStack />
      <Toast />
    </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  container: {
    flex: 1,
  },
});

export default App;
