import { Alert } from "react-native"

export const useErrorAlert = (title = 'Error', message = 'not working') => {
    return Alert.alert(title.toString(), message.toString());
}