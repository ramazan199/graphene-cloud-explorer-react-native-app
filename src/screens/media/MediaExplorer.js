import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MoveScreen from '../move';
import MediaScreen from './'
const Stack = createNativeStackNavigator();

const MediaExplorer = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MediaScreen"
                component={MediaScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="MoveScreen"
                component={MoveScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

export default MediaExplorer