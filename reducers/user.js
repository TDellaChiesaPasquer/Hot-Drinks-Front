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
      state.value.user?.conversationList.sort((a, b) => (new Date(b.lastActionDate)).valueOf() - (new Date(a.lastActionDate)).valueOf());
    },
    updateConv: (state, action) => {
      const index = state.value.user.conversationList.findIndex(x => String(x._id) === String(action.payload._id));
      if (index === -1) {
        state.value.user.conversationList.push(action.payload);
      } else {
        state.value.user.conversationList[index] = action.payload;
      }
      state.value.user.conversationList.sort((a, b) => (new Date(b.lastActionDate)).valueOf() - (new Date(a.lastActionDate)).valueOf());
    },
    readConv: (state, action) => {
      const index = state.value.user.conversationList.findIndex(x => String(x._id) === String(action.payload));
      if (index === -1) {
        return;
      }
      const messageList = state.value.user.conversationList[index].messageList;
      const otherUserNumber = String(state.value.user.conversationList[index].user1._id) === String(state.value.user._id) ? 2 : 1;
      for (let i = 0; i < messageList.length; i++) {
        if (messageList[messageList.length - 1 - i].creator === otherUserNumber) {
          if (messageList[messageList.length - 1 - i].seen) {
            return;
          }
          messageList[messageList.length - 1 - i].seen = true;
          continue;
        } 
      }
    },
    deleteConv: (state, action) => {
      console.log('Une conv est delete')
      state.value.user.conversationList = state.value.user.conversationList.filter(x => String(x._id) !== action.payload);
    },
    disconnect: (state, action) => {
      action.payload.navigate('SignUpNav');
      state.value = initialState;
    }
  },
});

export const { addToken, addTempInfo, addInfos, updateConv, readConv, disconnect, deleteConv } = userSlice.actions;
export default userSlice.reducer;
