import { View, Text, TouchableOpacity } from 'react-native'
import { renderThumbnail } from '../../view-items/renderThumbnail';
import { styles } from './styles';

export const TagRow = ({ item, locationEditor }) => {
    return (
        <TouchableOpacity
            onPress={() => locationEditor(item)}
            style={styles.rowContainer}
        >
            <View style={item.type === 'folder' ? styles.folder : styles.iconSections}>
                {renderThumbnail(item, 15)}
            </View>
            <View style={styles.textSections}>
                <View>
                    <Text
                        numberOfLines={1}
                        style={styles.title}
                    >{item.path}</Text>
                    <Text style={styles.date}>{item.description}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

