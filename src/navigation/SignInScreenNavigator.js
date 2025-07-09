import { SignInScreen } from "../screens/sign-in"
import QRScreen from "../screens/qr";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnBoarding from "../components/on-boarding";
import AlexaTest from "../screens/alexa-test";
import SingInViaText from "../screens/sign-in-text";

const Stack = createNativeStackNavigator();

const SignInScreenNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SignInScreen"
        component={SignInScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="QRScreen"
        component={QRScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='SingInViaTextScreen'
        component={SingInViaText}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="ViewGuideScreen"
        component={OnBoarding}
        options={{

          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AlexaTest"
        component={AlexaTest}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default SignInScreenNavigator;
