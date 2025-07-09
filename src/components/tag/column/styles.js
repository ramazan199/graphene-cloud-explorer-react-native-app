import { StyleSheet } from "react-native";

export const ColumnStyles = StyleSheet.create({
    container: {
        borderWidth: 1,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
        height: 56,
        justifyContent: 'space-between',
        backgroundColor: '#F7FAFF',
        borderColor: '#EEF2FE',
        borderRadius: 10,
        paddingHorizontal: 19,

    },
    thumbnail: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    textArea: {
        marginLeft: 19.4,
        flex: 1,
    },
    title: {
        color: '#22215B',
        fontSize: 14,
    },
    setting: {
        // padding: 8,
        paddingLeft: 16,
        paddingVertical: 8,
    },
    description: {
        color: 'rgba(34, 33, 91, 0.5)',
        fontSize: 10,
        marginTop: 3
    },
})