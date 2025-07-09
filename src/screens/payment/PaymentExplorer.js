import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PaymentScreen from ".";

const Stack = createNativeStackNavigator();

const PaymentExplorer = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="PaymentScreen"
                component={PaymentScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default PaymentExplorer; 