import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from 'react-redux';
import { setMode } from '../../../../reducers/fileReducer';
import GroupIcon from '../../../../assets/icons/bottomSheet/group.svg'
import UnitIcon from '../../../../assets/icons/bottomSheet/unit.svg'
import { HeaderStyles as styles } from './styles';

export const Header = ({ goBack, location }) => {
    const { mode } = useSelector(state => state.files);
    const dispatch = useDispatch();

    return (
        <View style={styles.selector}>
            <View style={styles.pageTitleView}>
                <View style={styles.pageTitle}>
                    {
                        location && <View style={styles.backIconView} >
                            <Ionicons name="chevron-back" size={20} color="#22215B" onPress={() => goBack()} />
                        </View>
                    }

                    <View style={styles.main}>
                        <Text style={styles.titleText} numberOfLines={1}>{location ? location : 'Home'}</Text>
                        <View style={styles.selectorIconGroup}>
                            <TouchableOpacity
                                style={styles.touchableOpacityOne}
                                onPress={() => !mode && dispatch(setMode(true))}
                            >
                                <UnitIcon color={mode ? '#22215B' : '#B0C0D0'} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => mode && dispatch(setMode(false))} style={styles.touchableOpacityTwo}>
                                <GroupIcon color={mode ? '#B0C0D0' : '#22215B'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}


