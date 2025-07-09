import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        height: 133,
        backgroundColor: '#F7FAFF',
        borderColor: '#EEF2FE',
        borderRadius: 15,
        marginBottom: 30,
        paddingHorizontal: 14,
        paddingVertical: 16,
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    bottom: {

        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    left: {
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    right: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    remaining: {
        color: 'rgba(34, 33, 91, 0.5)',
        fontSize: 10,
        fontWeight: '400',
    },
    bottomText: {
        color: '#374151',
        fontSize: 12,
        fontWeight: '500'
    },
    headerText: {
        marginLeft: 10,
        fontWeight: '400',
        fontSize: 15,
        color: '#22215B'
    }
})