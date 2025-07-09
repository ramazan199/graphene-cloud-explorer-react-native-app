import { View, Text } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { styles } from './styles'

const PrepareModalView = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={34} color="#415EB6" style={styles.indicator} />
            <Text style={styles.text}>Prepairing to upload files</Text>
        </View>
    )
}

export default PrepareModalView

