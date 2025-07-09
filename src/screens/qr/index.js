import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Layout } from '../../layout';
import { PasswordModal } from '../../components/modal/password';
import { BarCodeScanner } from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openSettings } from 'react-native-permissions';
import { openModal } from '../../reducers/modalReducer';

const QRScreen = ({ route }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [barcode, setBarcode] = useState(null);
    const { QrScreen } = useSelector(state => state.rerender)
    const dispatch = useDispatch();

    const getBarCodeScannerPermissions = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        if (status !== 'granted') {
            openPermissionsSettings();
            return;
        }
        setHasPermission(status === 'granted');
    };

    const openPermissionsSettings = () => {
        dispatch(openModal({
            content: 'This app uses the Camera to scan QR code. Please allow access to Camera from Settings',
            type: 'info',
            head: '"Cloud Services" would like to access Camera ',
            icon: 'ex',
            buttonText: 'Open settings',
            callback: () => openSettings()
        }))
    }

    useEffect(() => {
        getBarCodeScannerPermissions();
    }, [QrScreen]);

    const handleBarCodeScanned = ({ data }) => {
        setScanned(true);
        setBarcode(data)
    };

    const cancelBarcodeScanning = () => {
        setScanned(false);
        setBarcode(null)
    }

    if (hasPermission === null) {
        return <Layout name={route.name}>
            <Text style={{ alignSelf: 'center' }}>
                Requesting for camera permission ....
            </Text>
        </Layout>;
    }
    if (hasPermission === false) {
        return <Layout name={route.name}>
            <Text style={{ alignSelf: 'center' }}>No access to camera, activate camera permission and lunch app again</Text>
        </Layout>;
    }

    return (

        <Layout name={route.name}>

            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            {
                barcode ?
                    <View style={{ backgroundColor: 'green', height: 30, borderRadius: 10, width: 150, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: 10, }}>
                        <Text style={{ color: '#fff' }}>Scanned</Text>
                    </View>
                    : <View style={{ backgroundColor: 'gray', height: 30, borderRadius: 10, width: 150, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: 10, }}>
                        <Text style={{ marginRight: 5 }}>Not Scanned</Text>
                        <ActivityIndicator size={10} style={{ marginLeft: 5 }} color='#fff' />
                    </View>

            }
            <BarcodeMask
                edgeColor={'rgba(255, 255, 255, 0.8)'}
                showAnimatedLine={false}
                edgeWidth={48}
                edgeHeight={48}
                edgeBorderWidth={5}
                edgeRadius={15}
                backgroundColor={'rgba(0, 0, 0, 0.5)'}
                outerMaskOpacity={0.1}
                width={180} height={180}
            />
            <View style={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                {
                    scanned && <PasswordModal setScanned={setScanned} barcode={barcode} cancel={cancelBarcodeScanning} />
                }
            </View>
        </Layout >
    )
}

export default QRScreen
