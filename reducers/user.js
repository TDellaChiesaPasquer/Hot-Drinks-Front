import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {
        token: null,
        user: null,
    },
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addToken: (state, action) => {
            console.log('test3')
            state.value.token = action.payload;
        },
    },
});

export const { addToken } = userSlice.actions;
export default userSlice.reducer;