import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    progressSection: {
        flex: 1,
        justifyContent: 'center',
    },
    progress: {
        flexDirection: 'row',
        height: 9,
        borderRadius: 4,
        backgroundColor: '#567DF41A',
    },
    blue: {
        flex: 1,
        backgroundColor: 'rgba(86, 125, 244, 0.95)',
        borderRadius: 4,
    },
    text: {
        color: '#22215B',
        fontSize: 7,
        backgroundColor: 'transparent',
        marginLeft: 5,
    },
    white: {
        borderRadius: 4,
    },
});