<<<<<<< HEAD
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {
        token: null,
        user: null,
        tempInfos: null
    },
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addToken: (state, action) => {
            state.value.token = action.payload;
        },
        addTempInfo: (state, action) => {
            if (!state.value.tempInfos) {
                state.value.tempInfos = {};
            }
            for (const key of Object.keys(action.payload)) {
                state.value.tempInfos[key] = action.payload[key];
            }
        },
        addInfos: (state, action) => {
            state.value.user = action.payload;
        }
    },
});

export const { addToken, addTempInfo, addInfos } = userSlice.actions;
=======
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {
        token: null,
        user: null,
        tempInfos: null
    },
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addToken: (state, action) => {
            state.value.token = action.payload;
        },
        addTempInfo: (state, action) => {
            if (!state.value.tempInfos) {
                state.value.tempInfos = {};
            }
            for (const key of Object.keys(action.payload)) {
                state.value.tempInfos[key] = action.payload[key];
            }
        }
    },
});

export const { addToken, addTempInfo } = userSlice.actions;
>>>>>>> 10c41729ac6fc8188094c1dfcc1a92f6d14df827
export default userSlice.reducer;