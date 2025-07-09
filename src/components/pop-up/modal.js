import { Text, View, TouchableOpacity } from "react-native";
import { optionsStyles, modalStyle as styles, tags } from "./styles";
import {
    Menu,
    MenuOptions,
    MenuTrigger,
} from 'react-native-popup-menu';

export const PopUpModal = ({ visibility, setTagsOpen, tagDataFromModal }) => {
    return (
        <Menu opened={visibility} onBackdropPress={() => { setTagsOpen(false) }}>
            <MenuTrigger />
            <MenuOptions customStyles={optionsStyles} optionsContainerStyle={{ marginLeft: 100, marginTop: 10 }} >
                <View style={styles.optionsStylesView}>
                    {
                        tags.map(tag => <TouchableOpacity key={tag.id} style={[{ backgroundColor: `${tag.color}1A`, borderColor: tag.color }, styles.childContainer]} onPress={() => {
                            tagDataFromModal(tag, 'search')
                            setTagsOpen(false)
                        }}>
                            <Text style={{ color: tag.color, }}>{tag.tagName}</Text>
                        </TouchableOpacity>)
                    }

                </View>
            </MenuOptions>
        </Menu>
    );
};

