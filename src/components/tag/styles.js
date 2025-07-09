import { Dimensions, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
    },
    scrollView: {
        flexDirection: "row",
        flex: 1,
        flexWrap: "wrap",
        alignItems: "center",

    },

    childContainer: {
        borderWidth: 1,
        height: 30,
        width: Dimensions.get('window').width / 4.9,
        alignItems: "center",
        borderRadius: 4,
        flexDirection: "row",
        marginHorizontal: Dimensions.get('window').width / 62,
        marginVertical: 4,
    },
    text: {
        fontSize: 16,
    },
    xIcon: {
        width: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    tagLeftContainer: {
        width: "67%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderRightWidth: 1,
    },
});