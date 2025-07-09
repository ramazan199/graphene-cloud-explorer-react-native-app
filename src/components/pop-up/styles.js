import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
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
        width: 75,
        alignItems: "center",
        borderRadius: 4,
        flexDirection: "row",
        margin: 6,
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


export const modalStyle = StyleSheet.create({
    modalView: {
        width: 350,
        margin: 20,
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 35,
        display: "flex",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    childContainer: {
        width: 70,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        borderWidth: 1,
        margin: 8,
    },
    optionsStylesView: {
        flexDirection: "row",
        flex: 1,
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
    },
});

export const optionsStyles = {
    optionsContainer: {
        display: "flex",
        flexDirection: "row",
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 16,
    },
};

export const tags = [
    {
        tagName: "jpg",
        id: 1,
        color: "#FF1F61",
    },
    {
        tagName: "mp3",
        id: 2,
        color: "#46D0FF",
    },
    {
        tagName: "mp4",
        id: 3,
        color: "#FF9000",
    },
    {
        tagName: "png",
        id: 4,
        color: "#0087FF",
    },
    {
        tagName: "txt",
        id: 5,
        color: "#6D62E1",
    },
    {
        tagName: "docs",
        id: 6,
        color: "#FFD101",
    },
    {
        tagName: "gif",
        id: 7,
        color: "#01E165",
    },
    {
        tagName: "pdf",
        id: 8,
        color: "#FF0E1B",
    },
];

export const microsoftFamily = 'doc|docx|rtf|xls|xlsx|ppt|pptx|mpp|accdb|pub'