import FavoriteScreen from '.'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MoveScreen from '../move';
const Stack = createNativeStackNavigator();

const FavoriteExplorer = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="FavoriteScreen"
                component={FavoriteScreen}
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

export default FavoriteExplorer