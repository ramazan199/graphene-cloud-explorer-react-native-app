import { View, Text } from 'react-native'
import FolderIcon from '../../assets/icons/noContent/cloud.svg'
import FavoriteIcon from '../../assets/icons/noContent/favorite.svg';
import { styles } from './styles';

export const EmptyComponent = ({ notMargin }) => {
    // const { name } = useRoute();

    return (
        <View style={notMargin ? styles.container2 : styles.container}>
            {
                true !== 'FavoriteScreen' ?
                    <View>
                        <FolderIcon />
                    </View>
                    : <View>
                        <FavoriteIcon />
                    </View>
            }
            <Text style={styles.text}> No files to show</Text>
        </View >
    )
}

