import { FAB } from 'react-native-paper';
import { useContextApi } from '../../context/ContextApi'
import { Layout } from '../../layout'
import { styles } from './styles';
import FabIcon from '../../assets/icons/home/fab.svg';
import { useEffect, useState } from 'react';
import ViewItems from '../../components/view-items';
import { useDispatch, useSelector } from 'react-redux';
import { UploadProgress } from '../../components/upload-progress';
import { getCellularInfoMMKV, getLastsMMKV } from '../../utils/mmkv';;
import { openModal } from '../../reducers/modalReducer';


const HomeScreen = ({ route }) => {
    const { bottomSheetController } = useContextApi();
    const { HomeScreen } = useSelector(state => state.rerender)
    const { connection, type } = useSelector(state => state.network)
    const dispatch = useDispatch();
    const [content, setContent] = useState([]);



    const connectSql = async () => {
        let arr = await getLastsMMKV();
        setContent(arr);
    }

    useEffect(() => {
        connectSql();
    }, [HomeScreen, connection]);

    const openFab = async () => {
        const isToggled = await getCellularInfoMMKV();
        if (type === 'wifi' || isToggled) return bottomSheetController(1);

        dispatch(openModal({
            content: 'Cellular data usage is off. Are you sure you want to use cellular data for this action?',
            head: "You use cellular connection",
            type: 'confirm',
            icon: 'ex',
            callback: () => bottomSheetController(1)
        }))

    }

    return (
        <Layout name={route.name} searchBar>
            <UploadProgress />
            <ViewItems content={content} setContent={setContent} name={route.name} reload={connectSql} />
            <FAB
                style={styles.fab}
                mode="flat"
                icon={FabIcon}
                color={'#415EB6'}
                theme={{ myOwnProperty: true, colors: { accentColor: '#EEF2FE' } }}
                onPress={openFab}
            />
        </Layout>
    )
}

export default HomeScreen
