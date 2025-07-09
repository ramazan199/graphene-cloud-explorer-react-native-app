import { View, StyleSheet, Dimensions } from 'react-native'

export const Progress = ({ color = '#000', percent = 90 }) => {
    return (
        <View style={progressStle.container}>
            <View style={[{ backgroundColor: color, width: `${percent}%` }, progressStle.colorful]}></View>
        </View>
    )
}


export const progressStle = StyleSheet.create({
    container: {
        // borderWidth: 1,
        width: Dimensions.get('window').width / 4,
        // flex: 1,
        height: 4,
        alignItems: 'flex-end',
        borderRadius: 10,
        backgroundColor: '#EEF7FE',
    },
    colorful: {
        height: '100%',
        borderRadius: 10,
    }
})