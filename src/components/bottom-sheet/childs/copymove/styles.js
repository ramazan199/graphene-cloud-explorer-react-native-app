import { Dimensions, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        height: ((Dimensions.get('window').height * 90) / 100) - 10,
    },
    button: {
        marginTop: 5,
        height: 50,
        flexDirection: 'row',

    },
    gap: {
        width: 15,
        backgroundColor: 'transparent',
    },
    text: {
        color: '#22215B',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: '400',
        marginBottom: 5,
    },
    title: {
        color: '#B0C0D0',
        fontSize: 15,
        textAlign: 'center',
        fontWeight: '400',
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

export const ColumnStyles = StyleSheet.create({
    container: {
        borderWidth: 1,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
        height: 56,
        justifyContent: 'space-between',
        backgroundColor: '#F7FAFF',
        borderColor: '#EEF2FE',
        borderRadius: 10,
        paddingHorizontal: 19,
    },
    onSelect: {
        borderWidth: 1,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
        height: 56,
        justifyContent: 'space-between',
        backgroundColor: '#F7FAFF',
        borderColor: "#00000043",
        borderRadius: 10,
        paddingHorizontal: 19,
    },
    thumbnail: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    textArea: {
        marginLeft: 19.4,
        flex: 1,
    },
    title: {
        color: '#22215B',
        fontSize: 14,
    },
    setting: {
        // padding: 8,
        paddingLeft: 16,
        paddingVertical: 8,
    },
    description: {
        color: 'rgba(34, 33, 91, 0.5)',
        fontSize: 10,
        marginTop: 3
    },
})

export const HeaderStyles = StyleSheet.create({
    selector: {
        paddingTop: 10,
        marginTop: 5,
        borderTopWidth: 1,
        borderTopColor: '#B0C0D0',
        marginBottom: 14,
        alignItems: 'flex-end'
    },
    main: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    selectorIconGroup: {
        flexDirection: 'row',
    },
    touchableOpacityOne: {
        paddingHorizontal: 10,
    },

    touchableOpacityTwo: {
        paddingLeft: 10,
    },
    pageTitleView: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between'
    },
    backIconView: {
        width: 22,
        height: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleText: {
        fontSize: 16,
        color: "#22215B",
        width: '70%'
    },
    pageTitle: {
        flexDirection: 'row',
        alignItems: 'center',
    },

})

export const rowStyles = StyleSheet.create({
    rowContainer: {
        marginHorizontal: 2,
        paddingVertical: 8,
    },
    iconSections: {
        alignItems: 'center',
        justifyContent: 'center',
        height: Dimensions.get('window').width / 3 - 20,
        width: Dimensions.get('window').width / 3 - 20,
        backgroundColor: '#F7FAFF',
        borderWidth: 1,
        borderColor: '#EEF2FE',
        borderRadius: 15
    },
    folder: {
        alignItems: 'center',
        justifyContent: 'center',
        height: Dimensions.get('window').width / 3 - 20,
        width: Dimensions.get('window').width / 3 - 20,
        backgroundColor: '#F7FAFF',
        borderWidth: 1,
        borderColor: "#00000043",
        borderRadius: 15
    },
    textSections: {
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        color: '#22215B',
        fontSize: 14,
        fontWeight: '400',
        maxWidth: 86,
    },
    date: {
        color: 'rgba(34, 33, 91, 0.5)',
        fontSize: 10,
        fontWeight: '400'
    },
    overlay: {
        position: 'absolute',
        top: 3,
        right: 3,
    },
    overlayStar: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    setting: {
        padding: 5,
    }
})