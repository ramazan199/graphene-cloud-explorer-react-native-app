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
    }
});
