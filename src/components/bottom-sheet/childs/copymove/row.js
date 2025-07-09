import { View, Text, TouchableOpacity } from 'react-native'
import { renderThumbnail } from '../../../view-items/renderThumbnail';
import { rowStyles } from './styles';

export const Row = ({ item, locationEditor }) => {
    return (
        <TouchableOpacity
            onPress={() => item.type === 'folder' && locationEditor(item.title)}
            style={rowStyles.rowContainer}
        >
            <View style={item.type === 'folder' ? rowStyles.folder : rowStyles.iconSections}>
                {renderThumbnail(item, 15)}
            </View>
            <View style={rowStyles.textSections}>
                <View>
                    <Text
                        numberOfLines={1}
                        style={rowStyles.title}
                    >{item.path}</Text>
                    <Text style={rowStyles.date}>{item.description}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

