import axios from "axios"
import { openModal } from "../reducers/modalReducer";
import { store } from "../store";
import { getUserPublicKeyMMKV } from "./mmkv"


const API = "http://162.55.209.61:8030/api/amazon-credentials";

export const getAlexaCredentials = async () => {
    let publicKey = await getUserPublicKeyMMKV();
    try {
        let res = await axios.get(`${API}?publicKey=${encodeURIComponent(publicKey)}`)
        return res.data;

    } catch (error) {
        store.dispatch(openModal({
            content: 'Make sure your phone has an active internet connection. Checking the cloud and phone',
            type: 'info',
            head: 'Could not connect to Alexa',
            icon: 'ex',
        }))
    }
}

export const sendAlexaCredentials = async (data) => {
    let publicKey = await getUserPublicKeyMMKV();
    let config = {
        method: 'post',
        url: API,
        data: { ...data, publicKey: publicKey },
    }
    try {
        return axios(config).then(res => res);
    }
    catch {
        store.dispatch(openModal({
            content: 'Make sure your cloud has an active internet connection. Checking the cloud and phone',
            type: 'info',
            head: 'Could not connect to Alexa',
            icon: 'ex',
        }))
    }
}