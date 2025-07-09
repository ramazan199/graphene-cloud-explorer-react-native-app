import { ScrollView } from 'react-native'
import { Layout } from '../../../layout'
import { Accordion } from '../../../components/accordion';
import { faqs } from '../../../constants';

const FAQScreen = () => {
    return (
        <Layout name='FAQScreen'>
            <ScrollView showsVerticalScrollIndicator={false}>
                {
                    faqs.map((item, index) => <Accordion number={`0${index + 1}`} text={item.text} header={item.header} key={index} />)
                }
            </ScrollView>
        </Layout >
    )
}

export default FAQScreen
