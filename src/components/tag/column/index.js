import { View, Text, TouchableOpacity, } from 'react-native'
import { renderThumbnail } from '../../view-items/renderThumbnail';
import { ColumnStyles as styles } from './styles';

export const TagColumn = ({ item, locationEditor }) => {

    return (
        <TouchableOpacity
            onPress={() => locationEditor(item.title)}
            style={styles.container}
        >
            <View style={styles.left}>
                <View style={styles.thumbnail}>{renderThumbnail(item, 5)}</View>
                <View style={styles.textArea}>
                    <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                </View>
            </View>
        </TouchableOpacity >
    )
}

