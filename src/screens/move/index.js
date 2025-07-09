import { useEffect } from 'react';
import { BackHandler } from "react-native";
import { View, Text } from 'react-native'


const MoveScreen = ({ navigation }) => {
    function handleBackButtonClick() {
        navigation.pop();
        return true;
    }
    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
        };
    }, [])

    return (
        <View>
            <Text>Move</Text>
        </View>
    )
}

export default MoveScreen