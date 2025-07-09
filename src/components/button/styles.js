import { StyleSheet } from "react-native";



export const styles = StyleSheet.create({
    primary: {
        borderWidth: 1,
        flex: 1,
        // height: 33,
        // width: '100%',
        backgroundColor: '#415EB6',
        borderColor: '#415EB6',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: 50,

    },
    primaryText: {
        color: '#fff',
        fontWeight: '500',
        fontSize: 18,
        // textAlign: 'center'
    },
    outlined: {
        borderWidth: 1,
        borderColor: '#415EB6',
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        flex: 1,
        // width: '100%',
    },
    outlinedText: {
        color: '#415EB6',
        fontWeight: '500',
        fontSize: 18,
    },

    disabled: {
        borderWidth: 1,
        flex: 1,
        // width: '100%',
        // backgroundColor: '#415EB6',
        borderColor: "#fff",
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        // maxHeight: 50,

        height: 50,
        backgroundColor: "#e4e4e4",
    }


})