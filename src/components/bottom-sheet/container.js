import { styles } from "./styles"
import { BottomSheetView } from "@gorhom/bottom-sheet";
export const BottomSheetLayout = ({ children }) => {
    return (
        <BottomSheetView style={styles.layout}>
            {children}
        </BottomSheetView>
    )
}

