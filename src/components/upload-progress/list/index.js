import { View, Text } from 'react-native'
import PaperIcon from '../../../assets/icons/viewer/file.svg';
import { styles } from './styles';
import { AnimatedCircularProgress } from 'react-native-circular-progress';


export const UploadList = ({ item }) => {
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <PaperIcon />
                <View style={styles.view}>
                    <Text style={styles.title} numberOfLines={1}>{item.file}</Text>
                    <Text style={styles.date}>{item.uploadDate}</Text>
                </View>
            </View>
            <AnimatedCircularProgress
                rotation={0}
                lineCap="round"
                size={40}
                width={5}
                fill={item.progress}
                tintColor="#5D82F5"
                backgroundColor="#5D82F533">
                {() => <Text style={{ fontSize: 9, fontWeight: "600" }}>{item.progress}%</Text>}
            </AnimatedCircularProgress>
        </View>
    )
}

