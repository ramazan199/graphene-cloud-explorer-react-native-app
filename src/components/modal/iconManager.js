import { lazy } from "react"
import { View } from "react-native";
const Qr = lazy(() => import('../../assets/icons/modal/qr.svg'));
const Check = lazy(() => import('../../assets/icons/modal/checkmark.svg'));
const Ex = lazy(() => import('../../assets/icons/modal/exmark.svg'));
const Question = lazy(() => import('../../assets/icons/modal/quesmark.svg'));

const icons = {
    qr: <Qr />,
    check: <Check />,
    ex: <Ex />,
    question: <Question />
}

export const iconManager = (icon) => {
    return <View style={{ alignSelf: "center" }}>{icons[icon]}</View>
}