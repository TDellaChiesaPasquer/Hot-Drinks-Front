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
export default userSlice.reducer;