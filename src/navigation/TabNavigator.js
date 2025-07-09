import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { colors } from '../assets/styles/theme';
import { styles } from './styles';
import CloudExplorer from '../screens/cloud/CloudExplorer';
import MediaExplorer from '../screens/media/MediaExplorer';
import FavoriteExplorer from '../screens/favorite/FavoriteExplorer';
import HomeExplorer from '../screens/home/HomeExplorer';
import ProfileExplorer from '../screens/profile/ProfileExplorer';
import CloudIcon from '../assets/icons/tabbar/cloud.svg';
import HomeIcon from '../assets/icons/tabbar/home.svg';
import MediaIcon from '../assets/icons/tabbar/media.svg';
import ProfileIcon from '../assets/icons/tabbar/profile.svg';
import FavoriteIcon from '../assets/icons/tabbar/favorite.svg';
import { setEmptySelectedFiles, setFound } from '../reducers/fileReducer';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { currenScreen } from '../reducers/bottomSheetReducer';
import PaymentExplorer from '../screens/payment/PaymentExplorer';
import PaymentIcon from '../assets/icons/tabbar/profile.svg';


const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const dispatch = useDispatch();
    const { selectedFiles, found } = useSelector(state => state.files);

    const tabPressHandler = useCallback((name) => {
        selectedFiles && dispatch(setEmptySelectedFiles([]));
        found && dispatch(setFound(null));
        dispatch(currenScreen(name));
        // handle the click event
    }, []);




    return (
        <Tab.Navigator
            initialRouteName={"Cloud"}
            screenOptions={{
                tabBarShowLabel: false,
                tabBarActiveTintColor: colors.blue,
                tabBarInactiveTintColor: colors.grey,
                tabBarStyle: styles.tabBar,
                headerShown: false,
                tabBarHideOnKeyboard: true
            }}
        >
            <Tab.Screen
                listeners={{ tabPress: () => tabPressHandler('Cloud') }}
                name="Cloud"
                component={CloudExplorer}
                options={{ tabBarIcon: ({ color }) => <CloudIcon style={{ color: color }} /> }}
            />
            <Tab.Screen
                name="Favorite"
                listeners={{ tabPress: () => tabPressHandler('Favorite') }}
                component={FavoriteExplorer}
                options={{ tabBarIcon: ({ color }) => <FavoriteIcon style={{ color: color }} /> }}
            />
            <Tab.Screen
                name="Home"
                listeners={{ tabPress: () => tabPressHandler('Home') }}
                component={HomeExplorer}
                options={{ tabBarIcon: ({ color }) => <HomeIcon style={{ color: color }} /> }}
            />
            <Tab.Screen
                name="Media"
                listeners={{ tabPress: () => tabPressHandler('Media') }}
                component={MediaExplorer}
                options={{ tabBarIcon: ({ color }) => <MediaIcon style={{ color: color }} /> }}
            />
            <Tab.Screen
                name="Profile"
                listeners={{ tabPress: () => tabPressHandler('Profile') }}
                component={ProfileExplorer}
                options={({ route }) => ({
                    tabBarStyle: ((route) => {
                        const routeName = getFocusedRouteNameFromRoute(route) ?? "";
                        if (routeName === 'QRScreen') {
                            return { display: "none" };
                        }
                        return;
                    })(route),
                    tabBarIcon: ({ color }) => <ProfileIcon style={{ color: color }} />
                })}
            // options={{ tabBarIcon: ({ color }) => <ProfileIcon style={{ color: color }} /> }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;