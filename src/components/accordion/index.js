import { View, Text, TouchableOpacity } from 'react-native'
import { useRef, useState } from 'react'
import { Transition, Transitioning } from 'react-native-reanimated'
import { styles } from './styles';
import PlusBlack from '../../assets/icons/profile/faqplus.svg'
import PlusWite from '../../assets/icons/profile/faqplusactive.svg'


export const Accordion = ({ header, number, text }) => {

    const [open, setOpen] = useState(false);
    const ref = useRef();

    const handlePress = () => {
        setOpen(!open)
        ref?.current?.animateNextTransition()
    }


    const transition = (
        <Transition.Together>
            <Transition.In type='fade' durationMs={400} />
            <Transition.Change />
            <Transition.Out type='fade' durationMs={400} />
        </Transition.Together>
    )


    return (
        <Transitioning.View
            style={[{ backgroundColor: !open ? '#EEF2FE' : '#5d83f564' }, styles.main]}
            ref={ref}
            transition={transition}
        >
            <TouchableOpacity activeOpacity={1} onPress={handlePress} style={styles.container}>
                <Text style={styles.number}>{number}</Text>
                <View style={styles.headingBox}>
                    <Text style={styles.heading}>{header}</Text>
                    {open ? <PlusBlack /> : <PlusWite />}
                </View>
                {open && <Text style={styles.content}>{text}</Text>}
            </TouchableOpacity>
        </Transitioning.View>
    )
}

