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
  name: "user",
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

    addPhoto: (state, action) => {
      state.value.tempPhotosList.push(action.payload);
    },

    removePhoto: (state, action) => {
      state.value.tempPhotosList = state.value.tempPhotosList.filter(
        (data) => data !== action.payload
      );
    },
  },
});

export const { addToken, addTempInfo, addInfos, addPhoto, removePhoto } =
  userSlice.actions;
export default userSlice.reducer;
