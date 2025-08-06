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
<<<<<<< HEAD
  name: "user",
=======
  name: 'user',
>>>>>>> 99e989854463e5b7135d5028c78f7f80a6843082
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
<<<<<<< HEAD

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
=======
    updateConv: (state, action) => {
      const index = state.value.user.conversationList.findIndex(x => String(x._id) === String(action.payload._id));
      if (index === -1) {
        console.log('test1')
        state.value.user.conversationList.push(action.payload);
        return;
      }
        console.log('test2')
      state.value.user.conversationList[index] = action.payload;
    }
  },
});

export const { addToken, addTempInfo, addInfos, updateConv } = userSlice.actions;
>>>>>>> 99e989854463e5b7135d5028c78f7f80a6843082
export default userSlice.reducer;
