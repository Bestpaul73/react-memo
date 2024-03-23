import { createSlice } from "@reduxjs/toolkit";

const gameSlice = createSlice({
  name: "game",
  initialState: {
    difficultyMode: false,
  },
  reducers: {
    setDifficultyModeReducer(state, action) {
      state.difficultyMode = action.payload;
    },
    toggleDifficultyModeReducer(state) {
      state.difficultyMode = !state.difficultyMode;
    },
  },
});

export const { setDifficultyModeReducer, toggleDifficultyModeReducer } = gameSlice.actions;
export default gameSlice.reducer;
