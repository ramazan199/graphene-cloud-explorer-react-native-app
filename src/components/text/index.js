import { Text } from 'react-native'

export const CustomText = ({ children, size = 16, color = '#B0C0D0', custom }) => {

    return (
        <Text style={[{ color: color, fontSize: size, textAlign: 'center', fontWeight: '500' }, { ...custom }]}>{children}</Text>
    )
}
