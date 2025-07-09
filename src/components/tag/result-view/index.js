import { FlatList } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { navigationPush } from '../../../navigation/root';
import { setFound, setLocation } from '../../../reducers/fileReducer';
import { renderScreen } from '../../../reducers/screenRerenderReducer';
import { locationGenerator } from '../../../utils/essential-functions';
import { EmptyComponent } from '../../list-empty';
import { TagColumn } from '../column';
import { TagRow } from '../row';


const ResultsView = () => {
    const { filterResults, mode } = useSelector(state => state.files);
    const dispatch = useDispatch();

    const locationEditor = (file) => {
        dispatch(setLocation(locationGenerator(file.path)));
        dispatch(setFound(file.name));
        dispatch(renderScreen(['CloudScreen']))
        navigationPush("Cloud");
    }

    return (
        <FlatList
            style={(!mode && filterResults?.length > 2) && { alignSelf: 'center' }}
            data={filterResults}
            keyExtractor={(item) => item.path}
            horizontal={false}
            extraData={mode}
            key={mode ? 1 : 3}
            // extraData={filterResults}
            ListEmptyComponent={<EmptyComponent />}
            showsVerticalScrollIndicator={false}
            numColumns={mode ? 1 : 3}
            renderItem={({ item }) => mode ? <TagColumn item={item} locationEditor={locationEditor} /> : <TagRow item={item} locationEditor={locationEditor} />}
        />
    )
}


export default ResultsView