import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    token: null,
    user: null,
    tempInfos: null,
    tempPhotosList: [],
    tastesById: {},
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
      state.value.user?.conversationList.sort(
        (a, b) =>
          new Date(b.lastActionDate).valueOf() -
          new Date(a.lastActionDate).valueOf()
      );
    },
    updateConv: (state, action) => {
      const index = state.value.user.conversationList.findIndex(
        (x) => String(x._id) === String(action.payload._id)
      );
      if (index === -1) {
        state.value.user.conversationList.push(action.payload);
      } else {
        state.value.user.conversationList[index] = action.payload;
      }
      state.value.user.conversationList.sort(
        (a, b) =>
          new Date(b.lastActionDate).valueOf() -
          new Date(a.lastActionDate).valueOf()
      );
    },
    readConv: (state, action) => {
      const index = state.value.user.conversationList.findIndex(
        (x) => String(x._id) === String(action.payload)
      );
      if (index === -1) {
        return;
      }
      const messageList = state.value.user.conversationList[index].messageList;
      const otherUserNumber =
        String(state.value.user.conversationList[index].user1._id) ===
        String(state.value.user._id)
          ? 2
          : 1;
      for (let i = 0; i < messageList.length; i++) {
        if (
          messageList[messageList.length - 1 - i].creator === otherUserNumber
        ) {
          if (messageList[messageList.length - 1 - i].seen) {
            return;
          }
          messageList[messageList.length - 1 - i].seen = true;
          continue;
        }
      }
    },
    deleteConv: (state, action) => {
      state.value.user.conversationList =
        state.value.user.conversationList.filter(
          (x) => String(x._id) !== action.payload
        );
    },
    disconnect: (state, action) => {
      action.payload.navigate("SignUpNav");
      state.value = initialState.value;
    },

    setAllTastes: (state, action) => {
      state.value.tastesById = action.payload;
    },

    setAnswer: (state, action) => {
      const index = state.value.user.tastesList.findIndex(
        (x) => x.category === action.payload.category
      );
      if (index === -1) {
        state.value.user.tastesList.push({...action.payload, star: false});
        return;
      }
      state.value.user.tastesList[index] = {star: state.value.user.tastesList[index].star, ...action.payload};
    },

    toggleStar: (state, action) => {
      const index = state.value.user.tastesList.findIndex(
        (x) => x.category === action.payload.category
      );
      state.value.user.tastesList[index] = {...state.value.user.tastesList[index], star: action.payload.star};
    },
    newSuperlike: (state, action) => {
      const lastSuperlike = state.value.user.lastSuperlike || new Date();
      const today = dayjs().set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0);
      let superlikeNumber = state.value.user.superlikeNumber;
      if (today.valueOf() - lastSuperlike.valueOf() > 0 || !superlikeNumber) {
        superlikeNumber = 0;
      }
      state.value.user.lastSuperlike = new Date();
      state.value.user.superlikeNumber = superlikeNumber + 1;
    }
  },
});

export const {
  addToken,
  addTempInfo,
  addInfos,
  updateConv,
  readConv,
  disconnect,
  deleteConv,
  setAllTastes,
  setAnswer,
  toggleStar,
  newSuperlike
} = userSlice.actions;
export default userSlice.reducer;
