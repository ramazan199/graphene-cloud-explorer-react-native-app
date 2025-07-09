import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'column',
        marginVertical: 21
    },
    buttonView: {
        width: '100%',
        height: 150,
        // alignItems: 'center',
    },
    buttonsGroup: {
        borderColor: 'red',
        alignItems: 'center',
        width: '100%',
    },
    viewGuideContainer: {
        paddingVertical: 20,
        width: '100%',
        borderTopWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'row',
        borderTopColor: '#EEF2FE',
    },
    viewGuide: {
        borderColor: 'red',
        paddingLeft: 4,
    },

    viewGuideText: {
        color: '#B0C0D0'
    }
})