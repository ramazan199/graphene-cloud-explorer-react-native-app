import HomeScreen from '.'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MoveScreen from '../move';
import UploadScreen from '../uplad';

const Stack = createNativeStackNavigator();

const HomeExplorer = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
            />

            <Stack.Screen
                name="UpdateScreen"
                component={UploadScreen}
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="MoveScreen"
                component={MoveScreen}
            />
        </Stack.Navigator>
    )
}

export default HomeExplorer