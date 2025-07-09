import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { styles } from './styles'

export const Tag = ({ tagsData, removeSelectedTags }) => {
    return (
        <View style={styles.container}>
            <View style={styles.scrollView}>
                {tagsData?.map((tag, index) => (
                    <TouchableOpacity
                        key={tag.id}
                        style={[{ borderColor: tag.color }, styles.childContainer, (index === 0 || index === 4) && { marginLeft: 0 }, (index === 3 || index === 7) && { marginRight: 0 }]}
                    >
                        <View
                            style={[
                                {
                                    backgroundColor: `${tag.color}1A`,
                                    borderRightColor: tag.color,
                                    ...styles.tagLeftContainer,
                                },
                            ]}
                        >
                            <Text style={{ color: tag.color, ...styles.text }}>
                                {tag.tagName}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                flex: 1,
                                height: '100%'
                                // marginHorizontal: 4.5,
                            }}
                            onPress={() => removeSelectedTags(tag.tagName, 'remove')}
                            activeOpacity={0.6}
                        >
                            <AntDesign name="close" size={13} color="#22215B" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

