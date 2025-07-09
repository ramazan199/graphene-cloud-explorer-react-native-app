import BottomSheet, { BottomSheetBackdrop, useBottomSheetTimingConfigs } from '@gorhom/bottom-sheet';
import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { Easing } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { useContextApi } from '../../context/ContextApi';
import { AddSettings } from './childs/add';
import { CloudChild } from './childs/cloud';
import { CopyMoveComponent } from './childs/copymove';
import { IntentUpload } from './childs/intent';
import Settings from './childs/settings';
import { UploadSettings } from './childs/upload';
import { BottomSheetLayout } from './container';
import { styles } from './styles';

const components = {
    0: <AddSettings />,
    1: <UploadSettings />,
    2: <Settings />,
    3: <CloudChild />,
    4: <CopyMoveComponent />,
    5: <IntentUpload />
}

export const BottomSheetNative = () => {
    const { bottomSheetRef } = useContextApi()
    const animationConfigs = useBottomSheetTimingConfigs({ duration: 333, easing: Easing.sin });
    const snapPoints = useMemo(() => ['25%', '18%', '52%', '75%', '95%', '75%'], []);
    const { command } = useSelector(state => state.bottomSheetManager)


    const renderBackdrop = useCallback(
        props => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={2}
            />
        ),
        []
    );



    // renders
    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            backdropComponent={renderBackdrop}
            animationConfigs={animationConfigs}
            enablePanDownToClose={true}
            snapPoints={snapPoints}
            enableContentPanningGesture={false}
            enableHandlePanningGesture={false}
            style={styles.bottomSheet}
        >
            <View style={styles.contentContainer}>
                <BottomSheetLayout>
                    {components[command]}
                </BottomSheetLayout>
            </View>
        </BottomSheet >
    );
};



