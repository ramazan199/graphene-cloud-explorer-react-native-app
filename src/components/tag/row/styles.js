import { Dimensions, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    rowContainer: {
        marginHorizontal: 2,
        paddingVertical: 8,
    },
    iconSections: {
        alignItems: 'center',
        justifyContent: 'center',
        height: Dimensions.get('window').width / 3 - 20,
        width: Dimensions.get('window').width / 3 - 20,
        backgroundColor: '#F7FAFF',
        borderWidth: 1,
        borderColor: '#EEF2FE',
        borderRadius: 15
    },
    folder: {
        alignItems: 'center',
        justifyContent: 'center',
        height: Dimensions.get('window').width / 3 - 20,
        width: Dimensions.get('window').width / 3 - 20,
        backgroundColor: '#F7FAFF',
        borderWidth: 1,
        borderColor: "#00000043",
        borderRadius: 15
    },
    textSections: {
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        color: '#22215B',
        fontSize: 14,
        fontWeight: '400',
        maxWidth: 86,
    },
    date: {
        color: 'rgba(34, 33, 91, 0.5)',
        fontSize: 10,
        fontWeight: '400'
    },
    overlay: {
        position: 'absolute',
        top: 3,
        right: 3,
    },
    overlayStar: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    setting: {
        padding: 5,
    }
})