import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    number: {
        color: '#9D96A8',
        fontSize: 32,
        fontWeight: '700',
    },
    heading: {
        fontWeight: '700',
        fontSize: 20,
        color: '#000'
    },
    headingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 16,
    },
    content: {
        color: '#5A5365',
        fontWeight: '400',
        fontSize: 18,
    },
    main: {
        // paddingHorizontal: 16,
        // paddingVertical: 32,
        borderRadius: 8,
        marginVertical: 2,
    },
    container: {
        paddingHorizontal: 16,
        paddingVertical: 32,
        // borderWidth: 1
    }
})