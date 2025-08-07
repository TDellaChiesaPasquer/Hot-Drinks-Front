import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    token: null,
    user: null,
    tempInfos: null,
    tempPhotosList: [],
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
    },
    updateConv: (state, action) => {
      const index = state.value.user.conversationList.findIndex(x => String(x._id) === String(action.payload._id));
      if (index === -1) {
        state.value.user.conversationList.push(action.payload);
        return;
      }
      state.value.user.conversationList[index] = action.payload;
    }
  },
});

export const { addToken, addTempInfo, addInfos, updateConv } = userSlice.actions;
export default userSlice.reducer;
