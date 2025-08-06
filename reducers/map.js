import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { places: [] },
};

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    addPlace: (state, action) => {
      state.value.places.push(action.payload);
    },
    removePlace: (state, action) => {
        state.value.places = state.value.places.filter(elem => elem.name !== action.payload);
      }
        },
});

export const { addPlace, removePlace } = mapSlice.actions;
export default mapSlice.reducer;