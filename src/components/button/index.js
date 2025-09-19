import { Text, TouchableOpacity } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { styles } from './styles'

export const Button = ({ text, callback, variant = 'primary', disabled = false, wait }) => {
    return (
        <TouchableOpacity style={!disabled ? (variant == 'primary' ? styles.primary : styles.outlined) : styles.disabled} onPress={callback} disabled={disabled || wait}>
            {
                wait ? <ActivityIndicator size="small" color="#fff" /> : <Text style={variant == 'primary' ? styles.primaryText : styles.outlinedText}>{text}</Text>
            }
        </TouchableOpacity>
    )
}

