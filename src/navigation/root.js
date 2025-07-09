import { navigationRef } from "./Router"

export const navigationPush = (screenName) => {
    if (navigationRef.isReady()) {
        navigationRef.navigate(screenName);
    }
}