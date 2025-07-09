import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    switchContainer: {
        borderWidth: 1,
        borderColor: '#F3F4F6',
        borderRadius: 15,
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    switchText: {
        fontWeight: '500',
        fontSize: 16,

    },
    switchView: {
        flexDirection: 'row',
        marginVertical: 12,
        // borderWidth: 1,
        borderColor: 'red',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    listContainer: {

        marginTop: 14,
    },
    touchable: {
        borderWidth: 1,
        marginVertical: 12,
        backgroundColor: '#F7FAFF',
        // height: 56,
        borderRadius: 10,
        borderColor: '#EEF2FE',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 18,
        paddingHorizontal: 20,
    },
    touchText: {
        color: '#1B1D28',
        fontSize: 16,
        marginLeft: 19,
    },
    logIn: {
        color: '#87949E',
        fontSize: 12,
        fontWeight: "400"
    },
    connected: {
        color: '#39C0B8',
        fontSize: 12,
        fontWeight: "400"
    }
})

