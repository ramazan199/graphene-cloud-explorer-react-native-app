import { ActivityIndicator, NativeEventEmitter, NativeModules, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import * as Clipboard from 'expo-clipboard';
import { useEffect, useState } from 'react';


const AlexaTest = () => {

    const { LWAModule } = NativeModules;
    let eventListener
    const eventEmitter = new NativeEventEmitter(LWAModule);

    const [wait, setWait] = useState(false);
    const [alexaDetails, setAlexaDetails] = useState(null);

    const alexaLogin = async () => {
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ borderWidth: 1, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {
                    wait ? <ActivityIndicator /> : <TouchableOpacity
                        onPress={alexaLogin}
                        style={{ borderRadius: 10, borderWidth: 1, alignItems: 'center', backgroundColor: 'red', width: 200, height: 50, justifyContent: 'center' }}>
                        <Text>Test</Text>
                    </TouchableOpacity>
                }

            </View>
        </SafeAreaView>
    )
}

export default AlexaTest

const styles = StyleSheet.create({})