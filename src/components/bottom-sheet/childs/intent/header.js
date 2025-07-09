import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from "@expo/vector-icons";

export const Header = ({ goBack, location }) => {
    // const { location, mode } = useSelector(state => state.files);

    return (
        <View style={styles.selector}>
            <View style={styles.pageTitleView}>
                <View style={styles.pageTitle}>
                    <View style={styles.backIconView} >
                        {(location) && <Ionicons name="chevron-back" size={20} color="#22215B" onPress={() => goBack()} />}
                    </View>
                    <Text style={styles.titleText} numberOfLines={1}>{location ? location : 'Home'}</Text>
                </View>
            </View>
        </View>
    )
}

export const styles = StyleSheet.create({
    selector: {
        marginBottom: 14,
        alignItems: 'flex-end'
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
