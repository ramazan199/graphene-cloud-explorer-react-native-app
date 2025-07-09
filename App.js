import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MenuProvider } from 'react-native-popup-menu';
import PolyfillCrypto from 'react-native-webview-crypto';
import { Provider } from 'react-redux';
import { BottomSheetNative } from './src/components/bottom-sheet';
import { ContextApiProvider } from './src/context/ContextApi';
import Router from './src/navigation/Router';
import SignInUp from './src/components/SignInUp/index.js';
import  PaymentScreen from './src/screens/payment/index.js';
import { store } from './src/store';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { useStripe, StripeProvider } from '@stripe/stripe-react-native';
import { navigationRef } from './src/navigation/NavigationService';
import { BottomSheetProvider } from './src/services/BottomSheetService';

SplashScreen.preventAutoHideAsync();

export default App = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [bottomSheetRef, setBottomSheetRef] = useState(null);

  const bottomSheetContext = {
    openBottomSheet: (index) => bottomSheetRef?.current?.snapToIndex(index),
    closeBottomSheet: () => bottomSheetRef?.current?.close(),
  };

  useEffect(() => {
    async function prepare () {
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {

    return null;
  }

  return (
    <StripeProvider
      publishableKey="pk_test_51QUPpVL5vnlesNTrpFG1yyTMgIEfZOw9CTheApJzrmbPIGLrJdPVny61F8abmkyxmEp0fUfVIUZo9CLV3hkB2J2a00Qv02R6hj" // Replace with your Stripe publishable key
      urlScheme="com.cloudapp" // Required for 3D Secure and bank redirects
      // merchantIdentifier="merchant.com.yourapp" // Required for Apple Pay
    >
      <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <PolyfillCrypto />
        <Provider store={store}>
          <BottomSheetProvider value={bottomSheetContext}>
            <ContextApiProvider>
              <MenuProvider>
                {/* <SignInUp /> */}
                <Router />
                <BottomSheetNative />
              </MenuProvider>
            </ContextApiProvider>
          </BottomSheetProvider>
        </Provider>
      </GestureHandlerRootView>
    </StripeProvider>
  );
};

// eas build -p android --profile preview