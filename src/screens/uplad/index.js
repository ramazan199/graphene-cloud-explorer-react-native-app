import { FlatList } from 'react-native'
import { Layout } from '../../layout'
import { useSelector } from 'react-redux';
import { UploadList } from '../../components/upload-progress/list';

const UploadScreen = ({ route }) => {
    const { uploadQueue } = useSelector(state => state.newFileTransfer);
    const relay = Object.values(uploadQueue) ?? []

    return (
        <Layout name={route.name}>
            <FlatList
                data={relay}
                renderItem={({ item }) => <UploadList item={item} />}
            />
        </Layout>
    )
}

export default UploadScreen