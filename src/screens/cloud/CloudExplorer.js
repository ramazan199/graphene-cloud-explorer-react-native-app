import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CloudScreen from ".";
import MoveScreen from "../move";
// import MoveScreen from "../move-screen";

const Stack = createNativeStackNavigator();

const CloudExplorer = () => {

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="CloudScreen"
                component={CloudScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="MoveScreen"
                component={MoveScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default CloudExplorer;
