import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 10,
        // height: 46,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        borderColor: "#EEF2FE",
        marginBottom: 20,
    },
    input: {
        flex: 1,
        height: 46,
        borderRadius: 10,
        marginLeft: 8,
        paddingHorizontal: 5,
        color: '#B0C0D0',
        fontSize: 16,
        fontWeight: "400",
        placeholderTextColor: "red",

    },
    indicators: {
        position: "absolute",
        backgroundColor: "#fff",
        height: "100%",
        width: "100%",
        zIndex: 100,
        alignSelf: "center",
    },
})