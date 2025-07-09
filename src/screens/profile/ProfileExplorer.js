import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from ".";
import PaymentScreen from "../payment";

const Stack = createNativeStackNavigator();

const ProfileExplorer = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentScreen"
        component={PaymentScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default ProfileExplorer;