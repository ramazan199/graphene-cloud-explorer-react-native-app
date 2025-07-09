import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        height: 56,
        backgroundColor: '#F7FAFF',
        borderRadius: 10,
        borderColor: '#EEF2FE',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginVertical: 8,
    },
    textContainer: {
        borderWidth: 1,
        borderColor: '#F7FAFF',
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 16,
    },
    date: {
        color: 'rgba(34, 33, 91, 0.5)',
        fontSize: 10,
    },
    title: {
        color: '#22215B',
        fontSize: 14,
    },
    view: {
        marginLeft: 21,
        justifyContent: 'space-between',
        height: '100%',
        marginRight: 16,
    }
})