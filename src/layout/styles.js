import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        width: "100%",
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        // alignItems: "center",
    },
    indicators: {
        position: "absolute",
        backgroundColor: "#fff",
        height: "100%",
        width: "100%",
        zIndex: 100,
        alignSelf: "center",
    }
})