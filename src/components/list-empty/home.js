import { View, Text, StyleSheet } from 'react-native'
import FolderIcon from '../../assets/icons/noContent/cloud.svg'

export const EmptyComponentHome = () => {
    return (
        <View style={styles.container}>
            <FolderIcon />
            <Text style={styles.text} > No files to show</Text>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: '#B0C0D0',
        fontSize: 14,
        marginTop: 12,
        textAlign: 'center',
    }
})