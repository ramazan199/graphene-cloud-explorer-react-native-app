const initialState = {
    CloudScreen: {
        loader: false,
        blocker: false
    },
    FavoriteScreen: {
        loader: false,
        blocker: false
    },
    // ... other screens ...
    PaymentScreen: {
        loader: false,
        blocker: false
    }
};

export const screenBehaviorReducer = (state = initialState, action) => {
    switch (action.type) {
        // ... your existing cases
        default:
            return state;
    }
}; 