import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    head: {
        color: '#22215B',
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',

    },
    content: {
        fontSize: 16,
        fontWeight: '300',
        color: '#B0C0D0',
        textAlign: 'center',
        maxWidth: '80%',
        alignSelf: 'center',
    },
    buttonGroup: {
        flexDirection: 'row',
        height: 50,
    },
    gap: {
        width: 15,
        backgroundColor: 'transparent',
    },
    input: {
        borderWidth: 1,
        borderColor: '#415EB6',
        backgroundColor: '#fff',
        borderRadius: 10,
        fontSize: 16,
        color: "#22215B",
        paddingHorizontal: 12,
        paddingVertical: 16,
        width: '100%',
    }
})
