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
<<<<<<< HEAD
=======
        },
        addInfos: (state, action) => {
            state.value.user = action.payload;
>>>>>>> 18aaf4ccf3e6fae3695ac6d7f94b8d71991ffaae
        }
    },
});

<<<<<<< HEAD
export const { addToken, addTempInfo } = userSlice.actions;
export default userSlice.reducer;
=======
export const { addToken, addTempInfo, addInfos } = userSlice.actions;
export default userSlice.reducer;
>>>>>>> 18aaf4ccf3e6fae3695ac6d7f94b8d71991ffaae
