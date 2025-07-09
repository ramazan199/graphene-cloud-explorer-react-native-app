import { View } from 'react-native'
import { indicatorStyles as styles } from './styles'

export const Indicator = ({ currentIndex }) => {
    return (
        <View style={styles.container}>
            {
                [...Array(4)].map((_, index) => {
                    return <View
                        key={index}
                        style={[styles.dot, { backgroundColor: index !== currentIndex - 1 ? '#D9D9D9' : '#415EB6' }]}
                    />
                })
            }
        </View>
    )
}