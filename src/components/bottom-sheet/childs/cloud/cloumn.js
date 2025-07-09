import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import FolderIcon from '../../../../assets/icons/viewer/folder.svg';

export const ColumnForUpload = ({ item, locationEditor, location }) => {


    return (
        <TouchableOpacity
            onPress={() => locationEditor(item.title)}
            style={ColumnStyles.container}
        >
            <View style={ColumnStyles.left}>
                <View style={ColumnStyles.thumbnail}><FolderIcon /></View>
                <View style={ColumnStyles.textArea}>
                    <Text style={ColumnStyles.title} numberOfLines={1}>{item.title}</Text>
                    <Text style={ColumnStyles.description}>{item.description}</Text>
                </View>
            </View>
        </TouchableOpacity >
    )
}

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
        borderColor: "#00000043",
        borderRadius: 10,
        paddingHorizontal: 19,
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
    description: {
        color: 'rgba(34, 33, 91, 0.5)',
        fontSize: 10,
        marginTop: 3
    },
})
