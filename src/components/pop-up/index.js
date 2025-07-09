import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { styles } from "./styles";

export const PopUp = ({ tagsData, removeSelectedTags }) => {
    return (
        <View style={styles.container}>
            <View style={styles.scrollView}>
                {tagsData?.map((tag) => (
                    <TouchableOpacity
                        key={tag.id}
                        style={[{ borderColor: tag.color }, styles.childContainer]}
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
                                marginHorizontal: 4.5,
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

