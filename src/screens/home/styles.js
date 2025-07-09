import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        flex: 1,
    },
    fab: {
        position: "absolute",
        right: 0,
        bottom: 0,
        margin: 16,
        zIndex: 1000,
        borderRadius: 30,
        backgroundColor: "#415EB6",
        shadowColor: "rgba(65, 94, 182, 0.1);",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 4
    },
    alexa: {
        borderWidth: 1,
        borderColor: '#415EB6',
        height: 56,
        backgroundColor: '#EEF2FE',
        borderRadius: 10,
        paddingHorizontal: 22,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%'
    },
    connectionText: {
        color: '#1B1D28',
        fontSize: 16,
        fontWeight: '400',
        marginHorizontal: 7,
    },
    loginText: {
        color: '#87949E',
        fontSize: 12,
        fontWeight: '400',
    },
    close: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        width: '12%'
    }
});