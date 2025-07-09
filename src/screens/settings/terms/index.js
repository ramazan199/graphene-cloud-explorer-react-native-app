import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { terms } from '../../../constants/termsandconditions'
import { Layout } from '../../../layout'

const TermsAndCondition = () => {
    return (
        <Layout name='TermsAndCondition'>
            <ScrollView showsVerticalScrollIndicator={false}>
                {
                    terms.map(item => (
                        <View style={styles.container} key={item.index}>
                            <Text style={styles.header}>{item.index}. {item.header}</Text>
                            {
                                item.rules.map(texts => (
                                    <View style={styles.view} key={texts.bullet}>
                                        <Text style={styles.bullet}>{texts.bullet}</Text>
                                        <Text style={styles.rules}>{texts.text}</Text>
                                    </View>
                                ))
                            }
                        </View>
                    ))
                }
            </ScrollView>
        </Layout>
    )
}

export default TermsAndCondition


export const styles = StyleSheet.create({
    container: {
        marginVertical: 24,
    },
    header: {
        fontSize: 24,
        fontWeight: '700',
    },
    view: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: "space-between",
        marginVertical: 14,

    },
    bullet: {
        fontSize: 14,
        width: 40,
        color: '#9D96A8',
        fontWeight: '700',
    },
    rules: {
        flex: 1,
        fontSize: 14,
        fontWeight: '400'
    }

})