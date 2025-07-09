import { TouchableOpacity, View, Text } from "react-native"
import { useContextApi } from "../../context/ContextApi"
import { styles } from "./styles"

export const OptionButton = ({ icon, func, text, disabled }) => {
    const { closeBottomSheet } = useContextApi();


    const onPressHandler = () => {
        func();
        closeBottomSheet();
    }

    return (
        <TouchableOpacity style={styles.container} onPress={() => onPressHandler()} disabled={disabled} >
            <View style={styles.iconView}>{icon}</View>
            <Text style={disabled ? styles.disable : styles.text}>{text}</Text>
        </TouchableOpacity>
    )
}

